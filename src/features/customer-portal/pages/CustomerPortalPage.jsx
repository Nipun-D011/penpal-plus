import { useState, useEffect, useMemo } from 'react';
import CustomerHeader from '../components/CustomerHeader';
import CustomerLiveTracker from '../components/CustomerLiveTracker';
import CustomerOrdersList from '../components/CustomerOrdersList';
import CustomerReceiptModal from '../components/CustomerReceiptModal';
import Card from '../../../components/common/Card';
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
  Phone,
  Mail,
  MapPin,
  Award,
  Package,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const CustomerPortalPage = () => {
  const { user } = useAuth();
  const [customersList, setCustomersList] = useState(mockPortalCustomers);
  const [activeTab, setActiveTab] = useState('tracking'); // 'tracking', 'history', 'invoices', 'profile'
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  const [liveOrders, setLiveOrders] = useState([]);
  const [livePrintJobs, setLivePrintJobs] = useState([]);
  const [liveInvoices, setLiveInvoices] = useState([]);

  // Subscribe to live Firestore collections
  useEffect(() => {
    const unsubCustomers = subscribeToCustomers((data) => {
      if (data && data.length > 0) {
        const mapped = data.map((c) => ({
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
          avatarInitials: c.initials || 'CP',
          avatarBg: c.avatarBg || 'bg-[#dfa84a] text-[#131d33]',
        }));
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

  const activeCustomer = useMemo(() => {
    if (user?.role === 'Customer' && user?.id) {
      const match = customersList.find(
        (c) =>
          c.id === user.id ||
          (user.email && c.email?.toLowerCase() === user.email.toLowerCase())
      );
      if (match) return match;
    }
    return customersList[0] || mockPortalCustomers[0];
  }, [customersList, user]);

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
          {
            id: 1,
            name: o.jobType || 'Stationery Order',
            qty: o.qty || 1,
            unitPrice: o.amount,
            total: o.amount,
          },
        ],
        timeline: [
          {
            step: 1,
            title: 'Order Placed',
            time: o.date || 'Today, 09:30 AM',
            desc: 'Order received & queued into store system',
            completed: true,
          },
          {
            step: 2,
            title: 'Processing Items',
            time: step >= 2 ? 'In progress' : 'Pending',
            desc: 'Packing stock & quality verification',
            completed: step >= 2,
            current: step === 2,
          },
          {
            step: 3,
            title: 'Ready for Collection',
            time: step >= 3 ? 'Ready now' : o.dueDate || 'Today, 04:00 PM',
            desc: 'Packaged & waiting at main counter',
            completed: step >= 3,
            current: step === 3,
          },
          {
            step: 4,
            title: 'Completed',
            time: step >= 4 ? 'Collected' : 'Pending',
            desc: 'Collected by customer',
            completed: step >= 4,
            current: step === 4,
          },
        ],
      });
    });

    // Map print jobs
    livePrintJobs.forEach((j) => {
      let statusText = 'Processing';
      let step = 2;
      if (j.status === 'pending') {
        statusText = 'Queued';
        step = 1;
      } else if (j.status === 'prepress') {
        statusText = 'Prepress / Proofing';
        step = 2;
      } else if (j.status === 'printing') {
        statusText = 'Printing Active';
        step = 2;
      } else if (j.status === 'ready') {
        statusText = 'Ready for Collection';
        step = 3;
      } else if (j.status === 'completed') {
        statusText = 'Completed';
        step = 4;
      }

      combined.push({
        id: j.id,
        customerId: j.customerId || 'cust-1',
        customerName: j.customer,
        type: `Print Job (${j.jobType || 'Press'})`,
        orderDate: 'Aug 2026',
        estimatedReady: j.timing || 'Ready Today',
        status: statusText,
        statusStep: step,
        totalAmount: j.amount || 'Rs. 0',
        paymentStatus: 'Paid in Full',
        pickupLocation: 'Press Counter, Pen Pal Plus - Kurunegala',
        notes: `Assigned operator: ${j.staff || 'Senior Staff'} · ${j.jobType || 'Printing'}`,
        items: [
          {
            id: 1,
            name: j.title,
            qty: 1,
            unitPrice: j.amount,
            total: j.amount,
          },
        ],
        timeline: [
          {
            step: 1,
            title: 'Job Ticket Received',
            time: '19 Aug, 08:30 AM',
            desc: 'Artwork & paper specs verified',
            completed: true,
          },
          {
            step: 2,
            title: 'Press Production',
            time: step >= 2 ? 'In production' : 'Pending',
            desc: 'High-speed printing & binding underway',
            completed: step >= 2,
            current: step === 2,
          },
          {
            step: 3,
            title: 'Ready for Collection',
            time: step >= 3 ? 'Ready now' : j.timing || 'Today',
            desc: 'Packaged & inspected at press counter',
            completed: step >= 3,
            current: step === 3,
          },
          {
            step: 4,
            title: 'Completed',
            time: step >= 4 ? 'Collected' : 'Pending',
            desc: 'Job handed over to customer',
            completed: step >= 4,
            current: step === 4,
          },
        ],
      });
    });

    if (combined.length === 0) {
      return mockCustomerOrders;
    }

    return combined;
  }, [liveOrders, livePrintJobs]);

  // Orders specifically for this customer
  const customerOrders = useMemo(() => {
    const filtered = allPortalOrders.filter(
      (o) =>
        o.customerId === activeCustomer.id ||
        (o.customerName &&
          activeCustomer.name &&
          o.customerName.toLowerCase().includes(activeCustomer.name.toLowerCase()))
    );
    return filtered.length > 0
      ? filtered
      : mockCustomerOrders.filter((o) => o.customerId === 'cust-1');
  }, [allPortalOrders, activeCustomer]);

  // Invoices specifically for this customer
  const customerInvoices = useMemo(() => {
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

    return mockCustomerInvoices.filter((inv) => inv.customerId === 'cust-1');
  }, [liveInvoices, activeCustomer]);

  const activeOrdersCount = customerOrders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Completed'
  ).length;

  const readyOrdersCount = customerOrders.filter(
    (o) =>
      o.status?.toLowerCase().includes('ready') ||
      o.statusStep === 3
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

  // 4 KPI Summary Cards matching DashboardPage
  const kpiCards = [
    {
      title: 'Active Orders',
      value: activeOrdersCount,
      subtext: 'In production or processing',
      icon: Package,
      iconColor: 'bg-amber-50 text-amber-600 border border-amber-200/60',
    },
    {
      title: 'Ready for Collection',
      value: readyOrdersCount,
      subtext: 'Available at main counter',
      icon: CheckCircle2,
      iconColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
    },
    {
      title: 'Total Orders Placed',
      value: activeCustomer.totalOrders || customerOrders.length,
      subtext: 'Lifetime order history',
      icon: Clock,
      iconColor: 'bg-blue-50 text-blue-600 border border-blue-200/60',
    },
    {
      title: 'Membership Tier',
      value: activeCustomer.loyaltyTier || 'Gold Member',
      subtext: activeCustomer.memberSince || 'Active customer',
      icon: Award,
      iconColor: 'bg-amber-50 text-[#dfa84a] border border-[#dfa84a]/30',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      {/* Branded Customer Header */}
      <CustomerHeader
        activeCustomer={activeCustomer}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeOrderCount={activeOrdersCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Clean Enterprise Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-2xl lg:text-[26px] font-serif font-bold text-slate-900 tracking-tight leading-tight">
              Welcome, {activeCustomer.name}
            </h1>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Live tracking for printing jobs, bookshop retail orders, and official invoices
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeCustomer.loyaltyTier || 'Verified Customer'}</span>
            </span>
          </div>
        </div>

        {/* 4 KPI Summary Cards matching DashboardPage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <Card
                key={idx}
                className="flex flex-col justify-between hover:shadow-md transition-all border border-slate-200/80 rounded-2xl p-5 bg-white"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {kpi.title}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${kpi.iconColor}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="font-serif font-bold text-2xl lg:text-[26px] text-slate-900 tracking-tight leading-none truncate">
                    {kpi.value}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 font-normal truncate">
                    {kpi.subtext}
                  </p>
                </div>
              </Card>
            );
          })}
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
                        className="text-xs font-semibold text-[#dfa84a] hover:text-[#c9933b] hover:underline cursor-pointer"
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
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm max-w-3xl">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div
                className={`w-14 h-14 rounded-2xl ${activeCustomer.avatarBg} flex items-center justify-center font-bold text-xl shadow-md`}
              >
                {activeCustomer.avatarInitials}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-serif">
                  {activeCustomer.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-[#dfa84a]/15 text-[#c9933b] font-semibold text-[10px] px-2 py-0.5 rounded-md border border-[#dfa84a]/30 uppercase tracking-wider">
                    {activeCustomer.loyaltyTier}
                  </span>
                  <span className="text-xs text-slate-500">
                    Member since {activeCustomer.memberSince}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs text-slate-700">
              <div className="space-y-4">
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
                    <span className="font-semibold text-slate-900 block">Pickup City / Area</span>
                    <span className="text-slate-600">{activeCustomer.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Total Lifetime Volume</span>
                    <span className="text-slate-600">
                      {activeCustomer.totalOrders} Orders · {activeCustomer.totalSpent}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Digital Receipt Modal */}
      <CustomerReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        order={selectedReceiptOrder}
      />
    </div>
  );
};

export default CustomerPortalPage;
