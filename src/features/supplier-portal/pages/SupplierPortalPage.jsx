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
import { useAuth } from '../../../context/AuthContext';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
} from 'lucide-react';

export const SupplierPortalPage = () => {
  const { user } = useAuth();
  const [suppliersList, setSuppliersList] = useState(mockPortalSuppliers);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'deliveries', 'bills', 'alerts', 'profile'
  const [selectedPO, setSelectedPO] = useState(null);
  const [poModalOpen, setPOModalOpen] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState(mockSupplierPurchaseOrders);
  const [supplierBills, setSupplierBills] = useState(mockSupplierBills);

  // Synthesize supplier profile for authenticated user
  const currentAuthSupplier = useMemo(() => {
    if (!user) return null;
    const name = user.businessName || user.name || user.fullName || 'Supplier';
    const nameParts = name.trim().split(' ').filter(Boolean);
    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : name.slice(0, 2).toUpperCase();

    return {
      id: `sup-${user.uid?.slice(0, 8) || 'user'}`,
      uid: user.uid,
      name,
      category: 'Wholesale & Consumables',
      contactPerson: user.name || 'Sales Rep',
      phone: user.phoneNumber || '011 258 3390',
      email: user.email || '',
      address: 'Industrial Estate, Kurunegala',
      paymentTerms: 'Credit 30 Days',
      totalOrdersCount: 0,
      totalBilledAmount: 'Rs. 0',
      totalOutstanding: 'Rs. 0',
      avatarInitials: initials,
      avatarBg: 'bg-blue-700',
    };
  }, [user]);

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

  // Ensure current auth supplier appears in list
  const displaySuppliersList = useMemo(() => {
    if (
      currentAuthSupplier &&
      !suppliersList.some(
        (s) =>
          s.id === currentAuthSupplier.id ||
          (s.email && s.email.toLowerCase() === currentAuthSupplier.email.toLowerCase())
      )
    ) {
      return [currentAuthSupplier, ...suppliersList];
    }
    return suppliersList;
  }, [currentAuthSupplier, suppliersList]);

  // Derive active supplier
  const activeSupplier = useMemo(() => {
    if (selectedSupplierId) {
      const found = displaySuppliersList.find((s) => s.id === selectedSupplierId);
      if (found) return found;
    }

    if (user && user.role === 'Supplier') {
      const userEmail = (user.email || '').toLowerCase().trim();
      const userUid = user.uid || '';
      const userName = (user.businessName || user.name || '').toLowerCase().trim();

      const matched = displaySuppliersList.find(
        (s) =>
          (s.email && s.email.toLowerCase().trim() === userEmail) ||
          (userUid && (s.uid === userUid || s.id === userUid || s.id === `sup-${userUid.slice(0, 8)}`)) ||
          (userName && s.name && s.name.toLowerCase().trim() === userName)
      );

      return matched || currentAuthSupplier || mockPortalSuppliers[0];
    }

    return displaySuppliersList[0] || mockPortalSuppliers[0];
  }, [selectedSupplierId, displaySuppliersList, user, currentAuthSupplier]);

  // Filter items for current supplier
  const supplierPOs = useMemo(() => {
    const isSarasaviDemo =
      activeSupplier.id === 'sup-1' ||
      (activeSupplier.email && activeSupplier.email.toLowerCase() === 'orders@sarasavi.lk');

    const filtered = purchaseOrders.filter(
      (po) =>
        po.supplierId === activeSupplier.id ||
        (po.supplier &&
          activeSupplier.name &&
          po.supplier.toLowerCase().includes(activeSupplier.name.toLowerCase()))
    );

    if (filtered.length > 0) return filtered;

    if (isSarasaviDemo) {
      return mockSupplierPurchaseOrders.filter((po) => po.supplierId === 'sup-1');
    }

    return [];
  }, [purchaseOrders, activeSupplier]);

  const currentSupplierBills = useMemo(() => {
    const isSarasaviDemo =
      activeSupplier.id === 'sup-1' ||
      (activeSupplier.email && activeSupplier.email.toLowerCase() === 'orders@sarasavi.lk');

    const filtered = supplierBills.filter(
      (b) =>
        b.supplierId === activeSupplier.id ||
        (b.supplierName &&
          activeSupplier.name &&
          b.supplierName.toLowerCase().includes(activeSupplier.name.toLowerCase()))
    );

    if (filtered.length > 0) return filtered;

    if (isSarasaviDemo) {
      return mockSupplierBills.filter((b) => b.supplierId === 'sup-1');
    }

    return [];
  }, [supplierBills, activeSupplier]);

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

    // Update local state for immediate responsive feedback
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
      {/* Branded Header */}
      <SupplierHeader
        activeSupplier={activeSupplier}
        suppliers={displaySuppliersList}
        onSelectSupplier={(sup) => setSelectedSupplierId(sup.id)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        openPOCount={openPOCount}
        alertsCount={supplierAlerts.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-[#131d33] to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-blue-500/30 text-blue-300 border border-blue-400/30 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {activeSupplier.category}
              </span>
              <span className="text-xs text-slate-400">
                Payment Terms: {activeSupplier.paymentTerms}
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
              {activeSupplier.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Fulfill bookstore orders, confirm item dispatches, monitor ledger statements, and reconcile payments directly with Pen Pal Plus.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-xs flex-shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-300 block uppercase font-medium">
                Open POs
              </span>
              <span className="text-lg font-bold text-white font-mono">
                {openPOCount}
              </span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-left">
              <span className="text-[10px] text-slate-300 block uppercase font-medium">
                In Transit
              </span>
              <span className="text-lg font-bold text-[#dfa84a] font-mono">
                {inTransitCount}
              </span>
            </div>
          </div>
        </div>

        {/* Global Supplier KPI Cards */}
        <SupplierKpiCards
          supplier={activeSupplier}
          openPOCount={openPOCount}
          inTransitCount={inTransitCount}
          alertsCount={supplierAlerts.length}
        />

        {/* Dynamic Tab Contents */}
        {activeTab === 'orders' && (
          <SupplierPOTable
            purchaseOrders={supplierPOs}
            onViewDetails={handleOpenPODetails}
            onUpdateStatus={handleUpdatePOStatus}
          />
        )}

        {activeTab === 'deliveries' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Dispatched & In-Transit Shipments</h3>
                <p className="text-xs text-slate-500">Track current consignments on their way to the Pen Pal Plus Kurunegala store</p>
              </div>
            </div>
            <SupplierPOTable
              purchaseOrders={supplierPOs.filter((po) => po.status === 'In Transit' || po.status === 'Confirmed')}
              onViewDetails={handleOpenPODetails}
              onUpdateStatus={handleUpdatePOStatus}
            />
          </div>
        )}

        {activeTab === 'bills' && (
          <SupplierBillsLedger
            bills={currentSupplierBills}
            supplier={activeSupplier}
          />
        )}

        {activeTab === 'alerts' && (
          <SupplierReorderAlerts
            alerts={supplierAlerts}
            onAction={(alert) => {
              alert(`Ready to generate urgent replenishment PO for ${alert.itemTitle}`);
            }}
          />
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm max-w-2xl">
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
                  Supplier ID: {activeSupplier.id} · {activeSupplier.category}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs text-slate-700">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Company / Business Name</span>
                    <span className="text-slate-600">{activeSupplier.name}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Contact Phone</span>
                    <span className="text-slate-600">{activeSupplier.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Billing Email</span>
                    <span className="text-slate-600">{activeSupplier.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Warehouse / Office Address</span>
                    <span className="text-slate-600">{activeSupplier.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Standard Payment Terms</span>
                    <span className="text-slate-600 font-medium text-emerald-700">{activeSupplier.paymentTerms}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Purchase Order Detail Modal */}
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
