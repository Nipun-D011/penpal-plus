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
import { subscribeToSuppliers } from '../../../services/supplierService';
import {
  subscribeToPurchaseOrders,
  updatePurchaseOrderStatus,
  subscribeToSupplierBills,
} from '../../../services/portalService';
import { useAuth } from '../../../context/AuthContext';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Truck,
} from 'lucide-react';

export const SupplierPortalPage = () => {
  const { user } = useAuth();
  const [suppliersList, setSuppliersList] = useState(mockPortalSuppliers);
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
            ? s.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()
            : 'SP',
          avatarBg: s.avatarBg || 'bg-blue-600 text-white',
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
    if (user?.role === 'Supplier' && user?.id) {
      const match = suppliersList.find(
        (s) =>
          s.id === user.id ||
          (user.email && s.email?.toLowerCase() === user.email.toLowerCase())
      );
      if (match) return match;
    }
    return suppliersList[0] || mockPortalSuppliers[0];
  }, [suppliersList, user]);

  // Filter items for current supplier
  const supplierPOs = useMemo(() => {
    const filtered = purchaseOrders.filter(
      (po) => po.supplierId === activeSupplier.id
    );
    return filtered.length > 0
      ? filtered
      : mockSupplierPurchaseOrders.filter((po) => po.supplierId === 'sup-1');
  }, [purchaseOrders, activeSupplier.id]);

  const currentSupplierBills = useMemo(() => {
    const filtered = supplierBills.filter(
      (bill) => bill.supplierId === activeSupplier.id
    );
    return filtered.length > 0
      ? filtered
      : mockSupplierBills.filter((bill) => bill.supplierId === 'sup-1');
  }, [supplierBills, activeSupplier.id]);

  const supplierAlerts = useMemo(() => {
    return mockSupplierLowStockAlerts.filter(
      (alert) => alert.supplierCategory === activeSupplier.category
    );
  }, [activeSupplier.category]);

  const openPOCount = supplierPOs.filter(
    (po) => po.status === 'Issued' || po.status === 'Processing'
  ).length;

  const inTransitCount = supplierPOs.filter(
    (po) => po.status === 'Dispatched'
  ).length;

  const handleOpenPODetails = (po) => {
    setSelectedPO(po);
    setPOModalOpen(true);
  };

  const handleUpdatePOStatus = async (poId, newStatus) => {
    try {
      await updatePurchaseOrderStatus(poId, newStatus);
    } catch (error) {
      console.error('Error updating purchase order status:', error);
    }

    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id === poId) {
          const updatedTimeline = [...(po.timeline || [])];
          if (newStatus === 'Processing' && updatedTimeline[1]) {
            updatedTimeline[1].completed = true;
            updatedTimeline[1].current = true;
          } else if (newStatus === 'Dispatched' && updatedTimeline[2]) {
            if (updatedTimeline[1]) updatedTimeline[1].completed = true;
            updatedTimeline[2].completed = true;
            updatedTimeline[2].current = true;
          }
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
      {/* Branded Supplier Header (Without demo switcher) */}
      <SupplierHeader
        activeSupplier={activeSupplier}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        openPOCount={openPOCount}
        alertsCount={supplierAlerts.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Clean Enterprise Vendor Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-2xl lg:text-[26px] font-serif font-bold text-slate-900 tracking-tight leading-tight">
              {activeSupplier.name}
            </h1>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Authorized Supplier Portal · {activeSupplier.category} · Credit Terms: {activeSupplier.paymentTerms}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>{activeSupplier.category}</span>
            </span>
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
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-blue-500/15 text-blue-700 font-semibold text-[10px] px-2 py-0.5 rounded-md border border-blue-400/20 uppercase tracking-wider">
                    {activeSupplier.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    Vendor Partner ID: {activeSupplier.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs text-slate-700">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      Contact Representative
                    </span>
                    <span className="text-slate-600">
                      {activeSupplier.contactPerson || 'Vendor Rep'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      Phone Number
                    </span>
                    <span className="text-slate-600">{activeSupplier.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      Email Address
                    </span>
                    <span className="text-slate-600">{activeSupplier.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      Office / Warehouse Address
                    </span>
                    <span className="text-slate-600">{activeSupplier.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      Approved Credit Terms
                    </span>
                    <span className="text-slate-600">
                      {activeSupplier.paymentTerms}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      Lifetime Order Fulfillment
                    </span>
                    <span className="text-slate-600">
                      {activeSupplier.totalOrdersCount} Shipments ({activeSupplier.totalBilledAmount})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Purchase Order Details Modal */}
      <PODetailModal
        isOpen={poModalOpen}
        onClose={() => setPOModalOpen(false)}
        purchaseOrder={selectedPO}
        onUpdateStatus={handleUpdatePOStatus}
      />
    </div>
  );
};

export default SupplierPortalPage;
