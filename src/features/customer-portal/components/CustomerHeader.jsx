import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  FileText,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import BrandLogo from '../../../components/common/BrandLogo';

export const CustomerHeader = ({
  activeCustomer,
  activeTab,
  onTabChange,
  activeOrderCount = 0,
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

  const displayName = activeCustomer?.name || user?.name || 'Valued Customer';
  const displayPhone = activeCustomer?.phone || user?.email || 'Customer Account';
  const displayInitials =
    activeCustomer?.avatarInitials ||
    (displayName
      ? displayName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : 'CP');

  return (
    <header className="bg-[#131d33] text-white border-b border-slate-800/90 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Portal Tag */}
          <BrandLogo
            badge="Customer Portal"
            badgeVariant="gold"
            subtitle="Order Tracking & Digital Invoices"
            theme="dark"
            size="md"
          />

          {/* Right Section: Enterprise User Profile & Actions */}
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

            {/* Customer Profile & Menu (No demo switcher) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700/80 text-xs transition-colors shadow-xs"
              >
                <div
                  className={`w-7 h-7 rounded-full ${
                    activeCustomer?.avatarBg || 'bg-[#dfa84a] text-[#131d33]'
                  } flex items-center justify-center text-[11px] font-bold shadow-xs flex-shrink-0`}
                >
                  {displayInitials}
                </div>

                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-slate-100 text-xs leading-tight">
                    {displayName}
                  </div>
                  <div className="text-[10px] text-[#dfa84a] font-medium">
                    {activeCustomer?.loyaltyTier || 'Verified Customer'}
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
                      {displayPhone}
                    </p>
                    <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#dfa84a]/15 text-[#dfa84a] text-[10px] font-semibold border border-[#dfa84a]/20">
                      <span>{activeCustomer?.loyaltyTier || 'Member Account'}</span>
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
                      <User className="w-3.5 h-3.5 text-[#dfa84a]" />
                      <span>View Account Profile</span>
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
            onClick={() => onTabChange('tracking')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'tracking'
                ? 'border-[#dfa84a] text-[#dfa84a] font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Live Order Tracking</span>
            {activeOrderCount > 0 && (
              <span className="bg-[#dfa84a] text-[#131d33] font-bold text-[10px] px-1.5 py-0.5 rounded-full shadow-xs">
                {activeOrderCount} Active
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('history')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'history'
                ? 'border-[#dfa84a] text-[#dfa84a] font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('invoices')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'invoices'
                ? 'border-[#dfa84a] text-[#dfa84a] font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Receipts & Invoices</span>
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
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
