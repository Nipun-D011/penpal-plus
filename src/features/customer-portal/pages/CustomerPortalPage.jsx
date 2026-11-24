import { useState, useEffect, useMemo } from 'react';
import CustomerHeader from '../components/CustomerHeader';
import CustomerLiveTracker from '../components/CustomerLiveTracker';
import CustomerOrdersList from '../components/CustomerOrdersList';
import CustomerReceiptModal from '../components/CustomerReceiptModal';
import {
  mockPortalCustomers,
  mockCustomerOrders,
  mockCustomerInvoices,
} from '../data/mockCustomerPortalData';
import { subscribeToCustomers } from '../../../services/customerService';
import { subscribeToOrders, getStatusStep } from '../../../services/orderService';
import { subscribeToPrintJobs } from '../../../services/printJobService';
import { subscribeToInvoices } from '../../../services/billingService';
import { useAuth } from '../../../context/AuthContext';
import {
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Award,
} from 'lucide-react';

export const CustomerPortalPage = () => {
  const { user } = useAuth();
  const [customersList, setCustomersList] = useState(mockPortalCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [activeTab, setActiveTab] = useState('tracking'); // 'tracking', 'history', 'invoices', 'profile'
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  const [liveOrders, setLiveOrders] = useState([]);
  const [livePrintJobs, setLivePrintJobs] = useState([]);
  const [liveInvoices, setLiveInvoices] = useState([]);

  // Synthesize customer profile for authenticated user
  const currentAuthCustomer = useMemo(() => {
    if (!user) return null;
    const name = user.name || user.fullName || user.email?.split('@')[0] || 'Customer';
    const nameParts = name.trim().split(' ').filter(Boolean);
    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : name.slice(0, 2).toUpperCase();

    return {
      id: `cust-${user.uid?.slice(0, 8) || 'user'}`,
      uid: user.uid,
      name,
      email: user.email || '',
      phone: user.phoneNumber || '077 233 1190',
      address: 'Kurunegala',
      memberSince: 'Since 2026',
      loyaltyTier: 'New Customer',
      totalOrders: 0,
      totalSpent: 'Rs. 0',
      avatarInitials: initials,
      avatarBg: 'bg-emerald-700',
    };
  }, [user]);

  // Subscribe to live Firestore collections
  useEffect(() => {
    const unsubCustomers = subscribeToCustomers((data) => {
      if (data && data.length > 0) {
        const mapped = data.map((c) => {
          const nameParts = (c.name || '').trim().split(' ').filter(Boolean);
          const initials =
            c.initials ||
            (nameParts.length > 1
              ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
              : (c.name || 'CP').slice(0, 2).toUpperCase());

          return {
            ...c,
            id: c.id,
            name: c.name,
            email: c.email || `${c.name?.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
            phone: c.phone || '077 233 1190',
            address: c.city ? `Kurunegala (${c.city})` : 'Kurunegala',
            memberSince: c.customerSince ? `Since ${c.customerSince}` : 'March 2023',
            loyaltyTier: c.ordersCount > 15 ? 'Gold Member' : 'Regular Customer',
            totalOrders: c.ordersCount || 0,
            totalSpent: c.totalSpent || 'Rs. 0',
            avatarInitials: initials,
            avatarBg: c.avatarBg || 'bg-emerald-700',
          };
        });
        setCustomersList(mapped);
      }
    });

    const unsubOrders = subscribeToOrders((data) => setLiveOrders(data || []));
    const unsubJobs = subscribeToPrintJobs((data) => setLivePrintJobs(data || []));
    const unsubInvoices = subscribeToInvoices((data) => setLiveInvoices(data || []));

    return () => {
      unsubCustomers();
      unsubOrders();
      unsubJobs();
      unsubInvoices();
    };
  }, []);

  // Ensure current auth customer appears in list
  const displayCustomersList = useMemo(() => {
    if (
      currentAuthCustomer &&
      !customersList.some(
        (c) =>
          c.id === currentAuthCustomer.id ||
          (c.email && c.email.toLowerCase() === currentAuthCustomer.email.toLowerCase())
      )
    ) {
      return [currentAuthCustomer, ...customersList];
    }
    return customersList;
  }, [currentAuthCustomer, customersList]);

  // Derive active customer: user profile if customer, or selection if admin/staff
  const activeCustomer = useMemo(() => {
    if (selectedCustomerId) {
      const found = displayCustomersList.find((c) => c.id === selectedCustomerId);
      if (found) return found;
    }

    if (user && user.role === 'Customer') {
      const userEmail = (user.email || '').toLowerCase().trim();
      const userUid = user.uid || '';
      const userName = (user.name || '').toLowerCase().trim();

      const matched = displayCustomersList.find(
        (c) =>
          (c.email && c.email.toLowerCase().trim() === userEmail) ||
          (userUid && (c.uid === userUid || c.id === userUid || c.id === `cust-${userUid.slice(0, 8)}`)) ||
          (userName && c.name && c.name.toLowerCase().trim() === userName)
      );

      return matched || currentAuthCustomer || mockPortalCustomers[0];
    }

    return displayCustomersList[0] || mockPortalCustomers[0];
  }, [selectedCustomerId, displayCustomersList, user, currentAuthCustomer]);

  // Combine live orders and print jobs into unified portal format
  const allPortalOrders = useMemo(() => {
    const combined = [];

    // Map store customer orders
    liveOrders.forEach((o) => {
      const step = getStatusStep(o.status);
      combined.push({
        id: o.id,
        customerId: o.customerId || 'cust-1',
        customerName: o.customer || o.customerName,
        type: o.jobType || 'Book & Stationery Order',
        orderDate: o.date || 'Today',
        estimatedReady: o.dueDate || 'Ready Today',
        status: o.status || 'Processing',
        statusStep: step,
        totalAmount: o.amount || 'Rs. 0',
        paymentStatus: o.paymentStatus || 'Paid',
        pickupLocation: 'Main Counter, Pen Pal Plus - Kurunegala',
        notes: o.notes || 'In-store collection',
        items: o.items || [
          { id: 1, name: o.jobType || 'Stationery Order', qty: o.qty || 1, unitPrice: o.amount, total: o.amount },
        ],
        timeline: [
          { step: 1, title: 'Order Placed', time: o.date || 'Today', desc: 'Received & verified by shop', completed: true },
          { step: 2, title: 'Processing', time: 'In progress', desc: 'Items being processed', completed: step >= 2, current: step === 2 },
          { step: 3, title: 'Ready for Collection', time: o.dueDate || 'Pending', desc: 'Package prepared at counter', completed: step >= 3, current: step === 3 },
          { step: 4, title: 'Delivered', time: 'Completed', desc: 'Collected by customer', completed: step >= 4 },
        ],
      });
    });

    // Map printing jobs
    livePrintJobs.forEach((j) => {
      let step = 1;
      const statusLower = (j.status || '').toLowerCase();
      if (statusLower === 'prepress' || statusLower === 'scanning') step = 2;
      else if (statusLower === 'printing' || statusLower === 'in-progress') step = 2;
      else if (statusLower === 'ready') step = 3;
      else if (statusLower === 'completed' || statusLower === 'delivered') step = 4;

      combined.push({
        id: j.id,
        customerId: j.customerId || 'cust-1',
        customerName: j.customer,
        type: 'Print Job Order',
        orderDate: j.date || 'Recent',
        estimatedReady: j.timing || 'Due Soon',
        status: j.status || 'In Progress',
        statusStep: step,
        totalAmount: j.amount || 'Rs. 0',
        paymentStatus: 'Paid in Full',
        pickupLocation: 'Printing Press Counter #2, Kurunegala',
        notes: j.title || 'Print Job',
        items: [
          { id: 1, name: j.title || 'Printing service', qty: 1, unitPrice: j.amount, total: j.amount },
        ],
        timeline: [
          { step: 1, title: 'Job Order Placed', time: 'Logged', desc: 'Artwork submitted', completed: true },
          { step: 2, title: 'Printing / Prepress', time: 'In progress', desc: 'Machine in production', completed: step >= 2, current: step === 2 },
          { step: 3, title: 'Ready for Collection', time: j.timing || 'Soon', desc: 'Ready at counter #2', completed: step >= 3, current: step === 3 },
          { step: 4, title: 'Collected', time: 'Completed', desc: 'Finished and handed over', completed: step >= 4 },
        ],
      });
    });

    return combined.length > 0 ? combined : mockCustomerOrders;
  }, [liveOrders, livePrintJobs]);

  // Orders specifically for this customer
  const customerOrders = useMemo(() => {
    const isKumariDemo =
      activeCustomer.id === 'cust-1' ||
      (activeCustomer.email && activeCustomer.email.toLowerCase() === 'kumari.fonseka@gmail.com');

    const filtered = allPortalOrders.filter(
      (o) =>
        o.customerId === activeCustomer.id ||
        (o.customerName &&
          activeCustomer.name &&
          o.customerName.toLowerCase().includes(activeCustomer.name.toLowerCase()))
    );

    if (filtered.length > 0) return filtered;

    // Only fallback to mock orders if this is explicitly the Kumari Fonseka demo account
    if (isKumariDemo) {
      return mockCustomerOrders.filter((o) => o.customerId === 'cust-1');
    }

    return [];
  }, [allPortalOrders, activeCustomer]);

  // Invoices specifically for this customer
  const customerInvoices = useMemo(() => {
    const isKumariDemo =
      activeCustomer.id === 'cust-1' ||
      (activeCustomer.email && activeCustomer.email.toLowerCase() === 'kumari.fonseka@gmail.com');

    const liveFiltered = liveInvoices.filter(
      (inv) =>
        inv.customerId === activeCustomer.id ||
        (inv.customer &&
          activeCustomer.name &&
          inv.customer.toLowerCase().includes(activeCustomer.name.toLowerCase()))
    );

    if (liveFiltered.length > 0) {
      return liveFiltered.map((inv) => ({
        id: inv.invoiceNumber || inv.id,
        customerId: activeCustomer.id,
        orderRef: inv.orderRef || 'INV-REF',
        date: inv.date || 'Today',
        amount: inv.amount || `Rs. ${inv.numericAmount || inv.totalDue || 0}`,
        paymentMethod: inv.paymentMethod || 'Cash',
        status: inv.status || 'Paid',
        items: (inv.items || []).map((it) => ({
          name: it.description || 'Service',
          qty: it.qty || 1,
          rate: `Rs. ${it.rate || 0}`,
          total: `Rs. ${it.amount || 0}`,
        })),
      }));
    }

    if (isKumariDemo) {
      return mockCustomerInvoices.filter((inv) => inv.customerId === 'cust-1');
    }

    return [];
  }, [liveInvoices, activeCustomer]);

  const activeOrdersCount = customerOrders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Completed'
  ).length;

  const handleOpenReceipt = (orderOrInv) => {
    if (orderOrInv.orderRef) {
      const match = allPortalOrders.find((o) => o.id === orderOrInv.orderRef);
      if (match) {
        setSelectedReceiptOrder(match);
      } else {
        setSelectedReceiptOrder({
          id: orderOrInv.id,
          orderDate: orderOrInv.date,
          totalAmount: orderOrInv.amount,
          paymentStatus: orderOrInv.status === 'Paid' ? 'Paid in Full' : 'Pending',
          items:
            orderOrInv.items?.map((it, i) => ({
              id: i,
              name: it.name,
              qty: it.qty,
              unitPrice: it.rate,
              total: it.total,
            })) || [],
        });
      }
    } else {
      setSelectedReceiptOrder(orderOrInv);
    }
    setReceiptModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      {/* Branded Customer Header */}
      <CustomerHeader
        activeCustomer={activeCustomer}
        customers={displayCustomersList}
        onSelectCustomer={(c) => {
          setSelectedCustomerId(c.id);
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeOrderCount={activeOrdersCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-[#131d33] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-[#dfa84a] text-[#131d33] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {activeCustomer.loyaltyTier}
              </span>
              <span className="text-xs text-slate-400">
                Member since {activeCustomer.memberSince}
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
              Welcome, {activeCustomer.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Track your active printing jobs and bookshop orders in real-time, view itemized charges, and download official receipts.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-xs flex-shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-300 block uppercase font-medium">
                Active Orders
              </span>
              <span className="text-lg font-bold text-white font-mono">
                {activeOrdersCount}
              </span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-left">
              <span className="text-[10px] text-slate-300 block uppercase font-medium">
                Total Orders Placed
              </span>
              <span className="text-lg font-bold text-[#dfa84a] font-mono">
                {activeCustomer.totalOrders}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'tracking' && (
          <CustomerLiveTracker
            orders={customerOrders}
            allOrders={allPortalOrders}
            onOpenReceipt={handleOpenReceipt}
          />
        )}

        {activeTab === 'history' && (
          <CustomerOrdersList
            orders={customerOrders}
            onSelectOrder={() => setActiveTab('tracking')}
            onOpenReceipt={handleOpenReceipt}
          />
        )}

        {activeTab === 'invoices' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  Official Invoices & Tax Receipts
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing invoices generated for {activeCustomer.name}
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {customerInvoices.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No invoices available yet.
                </div>
              ) : (
                customerInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/70 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs sm:text-sm text-slate-900">
                            {inv.id}
                          </span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                            {inv.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {inv.date} · {inv.paymentMethod} · Ref: {inv.orderRef}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 pl-13 sm:pl-0">
                      <span className="font-bold text-sm text-slate-900 font-mono">
                        {inv.amount}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenReceipt(inv)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View receipt
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm max-w-2xl">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div
                className={`w-14 h-14 rounded-2xl ${activeCustomer.avatarBg} text-white flex items-center justify-center font-bold text-xl shadow-md`}
              >
                {activeCustomer.avatarInitials}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-serif">
                  {activeCustomer.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customer ID: {activeCustomer.id} · {activeCustomer.loyaltyTier}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs text-slate-700">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Full Name</span>
                    <span className="text-slate-600">{activeCustomer.name}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Phone</span>
                    <span className="text-slate-600">{activeCustomer.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Email Address</span>
                    <span className="text-slate-600">{activeCustomer.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Delivery Address</span>
                    <span className="text-slate-600">{activeCustomer.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Membership Tier</span>
                    <span className="text-slate-600">{activeCustomer.loyaltyTier}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Printable Receipt Modal */}
      <CustomerReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        order={selectedReceiptOrder}
      />
    </div>
  );
};

export default CustomerPortalPage;
