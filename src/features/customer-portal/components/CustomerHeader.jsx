import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  FileText,
  User,
  LogOut,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { mockPortalCustomers } from '../data/mockCustomerPortalData';

export const CustomerHeader = ({
  activeCustomer,
  onSelectCustomer,
  customers = [],
  activeTab,
  onTabChange,
  activeOrderCount = 1,
}) => {
  const customerList = customers && customers.length > 0 ? customers : mockPortalCustomers;
  const [customerMenuOpen, setCustomerMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCustomerMenuOpen(false);
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
      {/* Top Banner & Customer Switcher */}
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
                <span className="bg-amber-500/20 text-[#dfa84a] border border-[#dfa84a]/30 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Customer Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Order Tracking & Digital Invoices
              </p>
            </div>
          </div>

          {/* Right Section: Switch Customer Demo & Account */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Customer Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCustomerMenuOpen(!customerMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs transition-colors"
                title="Switch customer account"
              >
                <div
                  className={`w-6 h-6 rounded-full ${
                    activeCustomer.avatarBg || 'bg-emerald-600'
                  } flex items-center justify-center text-[10px] font-bold text-white`}
                >
                  {activeCustomer.avatarInitials}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-medium text-slate-200 leading-tight">
                    {activeCustomer.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {activeCustomer.phone}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {customerMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Switch Test Customer
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {customerList.map((cust) => (
                      <button
                        key={cust.id}
                        type="button"
                        onClick={() => {
                          onSelectCustomer(cust);
                          setCustomerMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors ${
                          activeCustomer.id === cust.id ? 'bg-amber-50/70' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-full ${cust.avatarBg} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
                          >
                            {cust.avatarInitials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">
                              {cust.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {cust.loyaltyTier} · {cust.phone}
                            </p>
                          </div>
                        </div>
                        {activeCustomer.id === cust.id && (
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
                      <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
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
                </div>
              )}
            </div>

            {/* Admin Switcher shortcut */}
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#dfa84a]" />
              Staff View
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex space-x-1 sm:space-x-4 border-t border-slate-800/80 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => onTabChange('tracking')}
            className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'tracking'
                ? 'border-[#dfa84a] text-[#dfa84a]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Live Order Tracking</span>
            {activeOrderCount > 0 && (
              <span className="bg-[#dfa84a] text-[#131d33] font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                {activeOrderCount} Active
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('history')}
            className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'history'
                ? 'border-[#dfa84a] text-[#dfa84a]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('invoices')}
            className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'invoices'
                ? 'border-[#dfa84a] text-[#dfa84a]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Receipts & Invoices</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('profile')}
            className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'profile'
                ? 'border-[#dfa84a] text-[#dfa84a]'
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
