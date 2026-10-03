import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  TrendingUp,
  Layers,
  Printer,
  Package,
  Receipt,
  Users,
  Truck,
  Tag,
  X,
  LogOut,
  User,
  ChevronUp,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Close profile popup on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
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

  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
        { name: 'Reports', path: '/reports', icon: TrendingUp },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { name: 'Inventory', path: '/inventory', icon: Layers },
        { name: 'Print jobs', path: '/print-jobs', icon: Printer },
        { name: 'Orders', path: '/orders', icon: Package },
        { name: 'Billing', path: '/billing', icon: Receipt },
      ],
    },
    {
      title: 'RELATIONSHIPS',
      items: [
        { name: 'Customers', path: '/customers', icon: Users },
        { name: 'Suppliers', path: '/suppliers', icon: Truck },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { name: 'Rate card', path: '/rate-card', icon: Tag },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Fixed Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-[#131d33] text-slate-300 flex flex-col justify-between flex-shrink-0 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div className="flex flex-col min-h-0 flex-1">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#dfa84a] flex items-center justify-center shadow-md flex-shrink-0">
                <span className="font-serif font-black text-[#131d33] text-base tracking-tight select-none">
                  PP
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm tracking-tight leading-snug">
                  Pen Pal Plus
                </span>
                <span className="text-[#dfa84a] text-[10px] font-bold tracking-wider uppercase mt-0.5">
                  BOOKSHOP & PRESS
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Groups */}
          <div className="px-3 py-4 space-y-5 overflow-y-auto custom-scrollbar flex-1">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400/80 tracking-wider uppercase">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      location.pathname === item.path ||
                      (item.path === '/dashboard' && location.pathname === '/');

                    return (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => onClose && onClose()}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[#e8a838] text-[#131d33] font-semibold shadow-sm'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#131d33]' : 'text-slate-400'}`} />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom User Info Profile (Green Area with Clickable Logout Popup) */}
        <div className="p-4 border-t border-slate-800/80 flex-shrink-0 relative" ref={profileMenuRef}>
          {/* Profile Popup Menu opening upwards */}
          {profileMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#1a2642] border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 text-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="px-3 py-2.5 border-b border-slate-700/60">
                <p className="text-xs font-semibold text-white">Aravinda Perera</p>
                <p className="text-[11px] text-slate-400 truncate">aravinda@penpalplus.lk</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-slate-300 font-medium">Owner / Admin</span>
                </div>
              </div>

              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-lg flex items-center gap-2.5 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}

          {/* Profile Card Trigger Button */}
          <button
            type="button"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left focus:outline-none ${
              profileMenuOpen ? 'bg-slate-800' : 'hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#d97706] text-white flex items-center justify-center font-bold text-xs shadow-inner flex-shrink-0">
                AP
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-white text-xs font-semibold truncate leading-tight">
                  Aravinda Perera
                </span>
                <span className="text-slate-400 text-[11px] truncate mt-0.5">
                  Owner / Admin
                </span>
              </div>
            </div>

            <ChevronUp className={`w-4 h-4 text-slate-400 transition-transform ${profileMenuOpen ? 'rotate-180 text-amber-400' : ''}`} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
