import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  DollarSign,
  AlertTriangle,
  Building2,
  ChevronDown,
  ExternalLink,
  LogOut,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { mockPortalSuppliers } from '../data/mockSupplierPortalData';

export const SupplierHeader = ({
  activeSupplier,
  onSelectSupplier,
  suppliers = [],
  activeTab,
  onTabChange,
  openPOCount = 0,
  alertsCount = 0,
}) => {
  const supplierList = suppliers && suppliers.length > 0 ? suppliers : mockPortalSuppliers;
  const [supplierMenuOpen, setSupplierMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const isSupplierRole = user?.role === 'Supplier';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSupplierMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-[#131d33] text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#dfa84a] flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="font-serif font-black text-[#131d33] text-sm tracking-tight">
                PP
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-white tracking-wide">
                  Pen Pal Plus
                </span>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Supplier Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Purchase Orders & Vendor Billing Ledger
              </p>
            </div>
          </div>

          {/* Right Section: Supplier Account & Switcher */}
          <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setSupplierMenuOpen(!supplierMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs transition-colors"
                title={isSupplierRole ? 'Account Menu' : 'Switch Supplier'}
              >
                <div
                  className={`w-6 h-6 rounded-full ${
                    activeSupplier.avatarBg || 'bg-blue-600'
                  } flex items-center justify-center text-[10px] font-bold text-white`}
                >
                  {activeSupplier.avatarInitials}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-medium text-slate-200 leading-tight">
                    {activeSupplier.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {activeSupplier.category}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {supplierMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                  {isSupplierRole ? (
                    <div>
                      <div className="px-3.5 py-2.5 border-b border-slate-100">
                        <p className="font-semibold text-slate-900 text-xs leading-tight">
                          {activeSupplier.name}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {activeSupplier.email || user?.email}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="text-[10px] text-blue-700 font-semibold uppercase tracking-wider">
                            {activeSupplier.category || 'Vendor Account'}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 px-3 pb-1">
                        <button
                          type="button"
                          onClick={() => {
                            onTabChange('profile');
                            setSupplierMenuOpen(false);
                          }}
                          className="w-full text-left text-xs text-slate-700 hover:text-slate-900 flex items-center gap-2 py-1.5 font-medium transition-colors"
                        >
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          Supplier Profile
                        </button>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left text-xs text-red-600 hover:text-red-700 flex items-center gap-2 py-1.5 font-medium transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Switch Vendor Account (Demo)
                      </div>
                      <div className="max-h-60 overflow-y-auto py-1">
                        {supplierList.map((sup) => (
                          <button
                            key={sup.id}
                            type="button"
                            onClick={() => {
                              onSelectSupplier(sup);
                              setSupplierMenuOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors ${
                              activeSupplier.id === sup.id ? 'bg-blue-50/70' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-7 h-7 rounded-full ${sup.avatarBg} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
                              >
                                {sup.avatarInitials}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 leading-tight">
                                  {sup.name}
                                </p>
                                <p className="text-[10px] text-slate-500">
                                  {sup.category} · {sup.phone}
                                </p>
                              </div>
                            </div>
                            {activeSupplier.id === sup.id && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 pt-2 px-3 pb-1">
                        <button
                          type="button"
                          onClick={() => navigate('/dashboard')}
                          className="w-full text-left text-xs text-slate-600 hover:text-slate-900 flex items-center gap-2 py-1.5 font-medium transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#dfa84a]" />
                          Back to Shop Admin Staff View
                        </button>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left text-xs text-red-600 hover:text-red-700 flex items-center gap-2 py-1.5 font-medium transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Admin Switcher shortcut: Only show if Admin or Staff */}
            {!isSupplierRole && (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#dfa84a]" />
                Staff View
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex space-x-1 sm:space-x-4 border-t border-slate-800/80 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => onTabChange('orders')}
            className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'orders'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Purchase Orders</span>
            {openPOCount > 0 && (
              <span className="bg-blue-500 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                {openPOCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('deliveries')}
            className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'deliveries'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Active Deliveries</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('bills')}
            className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'bills'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Bills & Ledger</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('alerts')}
            className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'alerts'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Reorder Alerts</span>
            {alertsCount > 0 && (
              <span className="bg-amber-500 text-slate-900 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                {alertsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('profile')}
            className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'profile'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Company Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default SupplierHeader;
