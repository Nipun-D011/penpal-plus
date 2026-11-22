import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  DollarSign,
  AlertTriangle,
  Building2,
  ChevronDown,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import BrandLogo from '../../../components/common/BrandLogo';

export const SupplierHeader = ({
  activeSupplier,
  activeTab,
  onTabChange,
  openPOCount = 0,
  alertsCount = 0,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const displayName = activeSupplier?.name || user?.name || 'Authorized Supplier';
  const displayCategory = activeSupplier?.category || 'Vendor Partner';
  const displayInitials =
    activeSupplier?.avatarInitials ||
    (displayName
      ? displayName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : 'SP');

  return (
    <header className="bg-[#131d33] text-white border-b border-slate-800/90 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Portal Tag */}
          <BrandLogo
            badge="Supplier Portal"
            badgeVariant="blue"
            subtitle="Purchase Orders & Vendor Billing Ledger"
            variant="dark"
            size="md"
          />

          {/* Right Section: Supplier Profile & Account Menu (No demo switcher) */}
          <div className="flex items-center gap-3">
            {/* Staff / Admin View Shortcut */}
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition-colors shadow-xs"
              title="Switch to internal staff management view"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#dfa84a]" />
              <span>Staff View</span>
            </button>

            {/* Supplier Profile Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700/80 text-xs transition-colors shadow-xs"
              >
                <div
                  className={`w-7 h-7 rounded-full ${
                    activeSupplier?.avatarBg || 'bg-blue-600 text-white'
                  } flex items-center justify-center text-[11px] font-bold shadow-xs flex-shrink-0`}
                >
                  {displayInitials}
                </div>

                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-slate-100 text-xs leading-tight">
                    {displayName}
                  </div>
                  <div className="text-[10px] text-blue-300 font-medium">
                    {displayCategory}
                  </div>
                </div>

                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    profileMenuOpen ? 'rotate-180 text-[#dfa84a]' : ''
                  }`}
                />
              </button>

              {/* Account Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#1a2642] rounded-xl shadow-2xl border border-slate-700/80 py-2 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-2 border-b border-slate-700/60">
                    <p className="text-xs font-semibold text-white truncate">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {displayCategory} · {activeSupplier?.phone || user?.email}
                    </p>
                    <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 text-[10px] font-semibold border border-blue-400/20">
                      <span>{activeSupplier?.paymentTerms || 'Credit 30 Days'}</span>
                    </div>
                  </div>

                  <div className="pt-1.5 px-1.5 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onTabChange('profile');
                      }}
                      className="w-full text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 px-2.5 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#dfa84a]" />
                      <span>Vendor Company Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate('/dashboard');
                      }}
                      className="w-full text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 px-2.5 py-2 rounded-lg flex items-center gap-2 transition-colors sm:hidden"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#dfa84a]" />
                      <span>Back to Staff View</span>
                    </button>

                    <div className="border-t border-slate-700/60 my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2.5 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex space-x-1 sm:space-x-4 border-t border-slate-800/90 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => onTabChange('orders')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'orders'
                ? 'border-[#dfa84a] text-[#dfa84a] font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Purchase Orders</span>
            {openPOCount > 0 && (
              <span className="bg-[#dfa84a] text-[#131d33] font-bold text-[10px] px-1.5 py-0.5 rounded-full shadow-xs">
                {openPOCount} Open
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('bills')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'bills'
                ? 'border-[#dfa84a] text-[#dfa84a] font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Billing & Invoices</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('alerts')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'alerts'
                ? 'border-[#dfa84a] text-[#dfa84a] font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Stock Reorder Demands</span>
            {alertsCount > 0 && (
              <span className="bg-amber-500/20 text-[#dfa84a] border border-[#dfa84a]/30 font-semibold text-[10px] px-1.5 py-0.5 rounded-full">
                {alertsCount} Critical
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('profile')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'profile'
                ? 'border-[#dfa84a] text-[#dfa84a] font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Vendor Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default SupplierHeader;
