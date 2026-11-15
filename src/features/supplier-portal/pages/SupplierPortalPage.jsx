import { useState } from 'react';
import SupplierHeader from '../components/SupplierHeader';
import SupplierKpiCards from '../components/SupplierKpiCards';
import SupplierPOTable from '../components/SupplierPOTable';
import PODetailModal from '../components/PODetailModal';
import SupplierBillsLedger from '../components/SupplierBillsLedger';
import SupplierReorderAlerts from '../components/SupplierReorderAlerts';
import {
  mockPortalSuppliers,
  mockSupplierPurchaseOrders,
  mockSupplierBills,
  mockSupplierLowStockAlerts,
} from '../data/mockSupplierPortalData';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
} from 'lucide-react';

export const SupplierPortalPage = () => {
  const [activeSupplier, setActiveSupplier] = useState(mockPortalSuppliers[0]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'deliveries', 'bills', 'alerts', 'profile'
  const [selectedPO, setSelectedPO] = useState(null);
  const [poModalOpen, setPOModalOpen] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState(mockSupplierPurchaseOrders);

  // Filter items for current supplier
  const supplierPOs = purchaseOrders.filter(
    (po) => po.supplierId === activeSupplier.id
  );

  const supplierBills = mockSupplierBills.filter(
    (b) => b.supplierId === activeSupplier.id
  );

  const supplierAlerts = mockSupplierLowStockAlerts.filter(
    (a) => a.supplierId === activeSupplier.id
  );

  const openPOCount = supplierPOs.filter((po) => po.status !== 'Fulfilled').length;
  const inTransitCount = supplierPOs.filter(
    (po) => po.status === 'In Transit' || po.status === 'Partially Received'
  ).length;

  const handleOpenPODetails = (po) => {
    setSelectedPO(po);
    setPOModalOpen(true);
  };

  const handleUpdatePOStatus = (poId, newStatus) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id === poId) {
          const updatedTimeline = po.timeline.map((item) => {
            if (newStatus === 'Confirmed' && item.step === 2) {
              return { ...item, completed: true, current: true, time: 'Just now' };
            }
            if (newStatus === 'In Transit' && item.step <= 3) {
              return { ...item, completed: true, current: item.step === 3, time: 'Just now' };
            }
            return item;
          });
          return {
            ...po,
            status: newStatus,
            timeline: updatedTimeline,
          };
        }
        return po;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      {/* Branded Supplier Header */}
      <SupplierHeader
        activeSupplier={activeSupplier}
        onSelectSupplier={(s) => setActiveSupplier(s)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        openPOCount={openPOCount}
        alertsCount={supplierAlerts.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Vendor Top Banner */}
        <div className="bg-gradient-to-r from-[#131d33] via-slate-900 to-[#1e293b] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30 font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                {activeSupplier.category}
              </span>
              <span className="text-xs text-slate-400">
                Payment Terms: {activeSupplier.paymentTerms}
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
              {activeSupplier.name} · Vendor Portal
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Fulfill purchase orders, track store receipt verification, monitor payment settlements, and review stock reorder alerts for Pen Pal Plus.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-xs flex-shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-300 block uppercase font-medium">
                Total Orders
              </span>
              <span className="text-lg font-bold text-white font-mono">
                {activeSupplier.totalOrdersCount}
              </span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-left">
              <span className="text-[10px] text-slate-300 block uppercase font-medium">
                Outstanding Balance
              </span>
              <span className="text-lg font-bold text-[#dfa84a] font-mono">
                {activeSupplier.totalOutstanding}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <SupplierKpiCards
              openPOCount={openPOCount}
              inTransitCount={inTransitCount}
              totalOutstanding={activeSupplier.totalOutstanding}
              lifetimePurchases={activeSupplier.totalBilledAmount}
            />

            <SupplierPOTable
              purchaseOrders={supplierPOs}
              onSelectPO={handleOpenPODetails}
            />
          </div>
        )}

        {activeTab === 'deliveries' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm p-6 space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Stock Receipts & Delivery Verification Log
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparison of quantities dispatched by you vs. quantities officially checked-in at Pen Pal Plus
              </p>
            </div>

            <div className="space-y-4">
              {supplierPOs.map((po) => (
                <div
                  key={po.id}
                  className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {po.id}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">
                        Issued: {po.issueDate} · Expected: {po.expectedDelivery}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${
                        po.status === 'Fulfilled'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {po.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {po.items.map((it) => (
                      <div
                        key={it.id}
                        className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1"
                      >
                        <div className="font-semibold text-slate-900 truncate">
                          {it.name}
                        </div>
                        <div className="flex justify-between text-slate-500 text-[11px]">
                          <span>Ordered: <strong>{it.orderedQty}</strong></span>
                          <span>Received: <strong className="text-emerald-700">{it.receivedQty}</strong></span>
                          <span>Outstanding: <strong className="text-amber-700">{it.pendingQty}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bills' && (
          <SupplierBillsLedger
            bills={supplierBills}
            supplier={activeSupplier}
          />
        )}

        {activeTab === 'alerts' && (
          <SupplierReorderAlerts
            alerts={supplierAlerts}
            supplier={activeSupplier}
          />
        )}

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Vendor Profile & Commercial Terms
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Company Name
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {activeSupplier.name}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Contact Person
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {activeSupplier.contactPerson}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Contact Phone
                  </span>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {activeSupplier.phone}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Contact Email
                  </span>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {activeSupplier.email}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 sm:col-span-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Registered Address
                  </span>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {activeSupplier.address}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950">
                <span className="font-bold block mb-1">
                  Agreed Payment Terms with Pen Pal Plus (Pvt) Ltd:
                </span>
                Standard billing cycle is <strong>{activeSupplier.paymentTerms}</strong>. Invoices are settled upon receipt verification and digital 3-way matching.
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Vendor Financial Health
              </h3>

              <div className="text-center py-4 bg-gradient-to-b from-blue-50/50 to-white rounded-xl border border-blue-200/80 p-4">
                <div className="w-12 h-12 rounded-full bg-[#131d33] text-white font-bold flex items-center justify-center mx-auto mb-2 shadow-sm">
                  {activeSupplier.avatarInitials}
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {activeSupplier.name}
                </div>
                <div className="text-xs text-slate-500">
                  Supplier ID: {activeSupplier.id}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Total Orders</span>
                  <span className="font-semibold text-slate-800">
                    {activeSupplier.totalOrdersCount} POs
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Lifetime Procurement</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {activeSupplier.totalBilledAmount}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Outstanding Balance</span>
                  <span className="font-semibold text-amber-700 font-mono">
                    {activeSupplier.totalOutstanding}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PO Detail & Dispatch Modal */}
      <PODetailModal
        isOpen={poModalOpen}
        onClose={() => setPOModalOpen(false)}
        purchaseOrder={selectedPO}
        supplier={activeSupplier}
        onUpdateStatus={handleUpdatePOStatus}
      />
    </div>
  );
};

export default SupplierPortalPage;
