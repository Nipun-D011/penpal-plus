import { useState, useEffect, useMemo } from 'react';
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
  subscribeToSuppliers,
} from '../../../services/supplierService';
import {
  subscribeToPurchaseOrders,
  updatePurchaseOrderStatus,
  subscribeToSupplierBills,
} from '../../../services/portalService';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
} from 'lucide-react';

export const SupplierPortalPage = () => {
  const [suppliersList, setSuppliersList] = useState(mockPortalSuppliers);
  const [activeSupplierId, setActiveSupplierId] = useState(mockPortalSuppliers[0]?.id);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'deliveries', 'bills', 'alerts', 'profile'
  const [selectedPO, setSelectedPO] = useState(null);
  const [poModalOpen, setPOModalOpen] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState(mockSupplierPurchaseOrders);
  const [supplierBills, setSupplierBills] = useState(mockSupplierBills);

  // Subscribe to live suppliers, purchase orders, and vendor bills
  useEffect(() => {
    const unsubSuppliers = subscribeToSuppliers((liveSups) => {
      if (liveSups && liveSups.length > 0) {
        const mapped = liveSups.map((s) => ({
          ...s,
          id: s.id,
          name: s.name,
          category: s.category || 'Supplies',
          contactPerson: s.contactPerson || s.contact,
          phone: s.contact || s.phone,
          email: s.email,
          address: s.address,
          paymentTerms: s.paymentTerms || 'Credit 30 Days',
          totalOrdersCount: s.recentOrders?.length || 12,
          totalBilledAmount: s.totalPurchases || 'Rs. 250,000',
          totalOutstanding: s.outstanding || 'Rs. 0',
          avatarInitials: s.name
            ? s.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
            : 'SP',
          avatarBg: s.avatarBg || 'bg-emerald-700',
        }));
        setSuppliersList(mapped);
      }
    });

    const unsubPOs = subscribeToPurchaseOrders((livePOs) => {
      if (livePOs && livePOs.length > 0) {
        setPurchaseOrders(livePOs);
      }
    });

    const unsubBills = subscribeToSupplierBills((liveBills) => {
      if (liveBills && liveBills.length > 0) {
        setSupplierBills(liveBills);
      }
    });

    return () => {
      unsubSuppliers();
      unsubPOs();
      unsubBills();
    };
  }, []);

  const activeSupplier = useMemo(() => {
    return (
      suppliersList.find((s) => s.id === activeSupplierId) ||
      suppliersList[0] ||
      mockPortalSuppliers[0]
    );
  }, [suppliersList, activeSupplierId]);

  // Filter items for current supplier
  const supplierPOs = useMemo(() => {
    const filtered = purchaseOrders.filter(
      (po) => po.supplierId === activeSupplier.id
    );
    return filtered.length > 0 ? filtered : mockSupplierPurchaseOrders.filter((po) => po.supplierId === 'sup-1');
  }, [purchaseOrders, activeSupplier.id]);

  const currentSupplierBills = useMemo(() => {
    const filtered = supplierBills.filter(
      (b) => b.supplierId === activeSupplier.id
    );
    return filtered.length > 0 ? filtered : mockSupplierBills.filter((b) => b.supplierId === 'sup-1');
  }, [supplierBills, activeSupplier.id]);

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

  const handleUpdatePOStatus = async (poId, newStatus) => {
    // Compute updated timeline
    const targetPO = purchaseOrders.find((po) => po.id === poId);
    let updatedTimeline = null;
    if (targetPO && Array.isArray(targetPO.timeline)) {
      updatedTimeline = targetPO.timeline.map((item) => {
        if (newStatus === 'Confirmed' && item.step === 2) {
          return { ...item, completed: true, current: true, time: 'Just now' };
        }
        if (newStatus === 'In Transit' && item.step <= 3) {
          return { ...item, completed: true, current: item.step === 3, time: 'Just now' };
        }
        return item;
      });
    }

    try {
      await updatePurchaseOrderStatus(poId, newStatus, updatedTimeline);
    } catch (err) {
      console.warn('Could not update PO status in Firestore, updating local state:', err);
    }

    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id === poId) {
          return {
            ...po,
            status: newStatus,
            timeline: updatedTimeline || po.timeline,
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
        suppliers={suppliersList}
        onSelectSupplier={(s) => setActiveSupplierId(s.id)}
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
              onViewPO={handleOpenPODetails}
              onUpdateStatus={handleUpdatePOStatus}
            />
          </div>
        )}

        {activeTab === 'deliveries' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-sm mb-1">
                Active In-Transit Shipments
              </h3>
              <p className="text-xs text-slate-500">
                Orders dispatched by {activeSupplier.name} currently awaiting warehouse receipt verification.
              </p>
            </div>
            <SupplierPOTable
              purchaseOrders={supplierPOs.filter((po) => po.status !== 'Fulfilled')}
              onViewPO={handleOpenPODetails}
              onUpdateStatus={handleUpdatePOStatus}
            />
          </div>
        )}

        {activeTab === 'bills' && (
          <SupplierBillsLedger
            bills={currentSupplierBills}
            totalOutstanding={activeSupplier.totalOutstanding}
            paymentTerms={activeSupplier.paymentTerms}
          />
        )}

        {activeTab === 'alerts' && (
          <SupplierReorderAlerts alerts={supplierAlerts} />
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm max-w-3xl">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div
                className={`w-14 h-14 rounded-2xl ${activeSupplier.avatarBg} text-white flex items-center justify-center font-bold text-xl shadow-md`}
              >
                {activeSupplier.avatarInitials}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-serif">
                  {activeSupplier.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vendor Partner ID: {activeSupplier.id} · {activeSupplier.category}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs text-slate-700">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Contact Representative</span>
                    <span className="text-slate-600">{activeSupplier.contactPerson || 'Vendor Rep'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Phone</span>
                    <span className="text-slate-600">{activeSupplier.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Email Address</span>
                    <span className="text-slate-600">{activeSupplier.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Warehouse / Dispatch Address</span>
                    <span className="text-slate-600">{activeSupplier.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Agreed Settlement Terms</span>
                    <span className="text-slate-600">{activeSupplier.paymentTerms}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PO Detail & Verification Modal */}
      <PODetailModal
        isOpen={poModalOpen}
        onClose={() => setPOModalOpen(false)}
        po={selectedPO}
        onUpdateStatus={handleUpdatePOStatus}
      />
    </div>
  );
};

export default SupplierPortalPage;
