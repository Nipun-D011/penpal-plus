import { useState } from 'react';
import CustomerHeader from '../components/CustomerHeader';
import CustomerLiveTracker from '../components/CustomerLiveTracker';
import CustomerOrdersList from '../components/CustomerOrdersList';
import CustomerReceiptModal from '../components/CustomerReceiptModal';
import {
  mockPortalCustomers,
  mockCustomerOrders,
  mockCustomerInvoices,
} from '../data/mockCustomerPortalData';
import {
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Award,
} from 'lucide-react';

export const CustomerPortalPage = () => {
  const [activeCustomer, setActiveCustomer] = useState(mockPortalCustomers[0]);
  const [activeTab, setActiveTab] = useState('tracking'); // 'tracking', 'history', 'invoices', 'profile'
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Orders specifically for this customer
  const customerOrders = mockCustomerOrders.filter(
    (o) => o.customerId === activeCustomer.id
  );

  // Invoices specifically for this customer
  const customerInvoices = mockCustomerInvoices.filter(
    (inv) => inv.customerId === activeCustomer.id
  );

  const activeOrdersCount = customerOrders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Completed'
  ).length;

  const handleOpenReceipt = (orderOrInv) => {
    // Normalize into order structure if it's an invoice
    if (orderOrInv.orderRef) {
      const match = mockCustomerOrders.find((o) => o.id === orderOrInv.orderRef);
      if (match) {
        setSelectedReceiptOrder(match);
      } else {
        setSelectedReceiptOrder({
          id: orderOrInv.id,
          orderDate: orderOrInv.date,
          totalAmount: orderOrInv.amount,
          paymentStatus: orderOrInv.status === 'Paid' ? 'Paid in Full' : 'Pending',
          items: orderOrInv.items?.map((it, i) => ({
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
        onSelectCustomer={(c) => {
          setActiveCustomer(c);
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
                Total Orders
              </span>
              <span className="text-lg font-bold text-white font-mono">
                {activeCustomer.totalOrders}
              </span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-left">
              <span className="text-[10px] text-slate-300 block uppercase font-medium">
                Total Spent
              </span>
              <span className="text-lg font-bold text-[#dfa84a] font-mono">
                {activeCustomer.totalSpent}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'tracking' && (
          <CustomerLiveTracker
            orders={customerOrders}
            allOrders={mockCustomerOrders}
            onOpenReceipt={handleOpenReceipt}
          />
        )}

        {activeTab === 'history' && (
          <CustomerOrdersList
            orders={customerOrders}
            onSelectOrder={(order) => {
              setActiveTab('tracking');
            }}
            onOpenReceipt={handleOpenReceipt}
          />
        )}

        {activeTab === 'invoices' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Invoices & Digital Receipts
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official invoices for all completed and active transactions
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {customerInvoices.length} Invoices Available
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Invoice No</th>
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {customerInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {inv.id}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {inv.orderRef}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{inv.date}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {inv.items?.map((it) => it.name).join(', ')}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{inv.paymentMethod}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {inv.amount}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenReceipt(inv)}
                          className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md font-semibold text-xs flex items-center gap-1 mx-auto transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account Details Card */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#dfa84a]" />
                Customer Profile & Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Full Name / Organization
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {activeCustomer.name}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Primary Phone
                  </span>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {activeCustomer.phone}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Registered Email
                  </span>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {activeCustomer.email}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Delivery Address
                  </span>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {activeCustomer.address}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                <span className="font-bold block mb-1">
                  💡 Need to update your delivery address or contact number?
                </span>
                Please notify our staff at the main counter or call 037 222 1190.
              </div>
            </div>

            {/* Loyalty & Stats Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Pen Pal Plus Membership
              </h3>

              <div className="text-center py-4 bg-gradient-to-b from-amber-50/60 to-white rounded-xl border border-amber-200/80 p-4">
                <div className="w-12 h-12 rounded-full bg-[#dfa84a] text-[#131d33] font-bold flex items-center justify-center mx-auto mb-2 shadow-sm">
                  {activeCustomer.avatarInitials}
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {activeCustomer.loyaltyTier}
                </div>
                <div className="text-xs text-slate-500">
                  Customer ID: {activeCustomer.id}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Registered</span>
                  <span className="font-semibold text-slate-800">
                    {activeCustomer.memberSince}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Total Orders</span>
                  <span className="font-semibold text-slate-800">
                    {activeCustomer.totalOrders} Completed
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Cumulative Spend</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {activeCustomer.totalSpent}
                  </span>
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
        customer={activeCustomer}
      />
    </div>
  );
};

export default CustomerPortalPage;
