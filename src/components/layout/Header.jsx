import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = ({ onToggleSidebar, title = 'Dashboard', subtitle = "Wednesday, 19 August 2026 · Overview of today's shop activity" }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-[#f8fafc] border-b border-slate-200/70 py-4 px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0 z-30">
      {/* Title & Subtitle */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-200/60 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl lg:text-[26px] font-serif font-bold text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Search and Action items */}
      <div className="flex items-center gap-3.5 self-end md:self-auto w-full md:w-auto">
        {/* Search input */}
        <div className="relative flex-1 md:w-64 lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search books, jobs, customers..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/90 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#131d33]/15 focus:border-[#131d33] transition-all shadow-sm"
          />
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-full bg-white border border-slate-200/90 text-slate-600 hover:bg-slate-100/80 transition-colors flex-shrink-0 shadow-sm"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User avatar with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-8 h-8 rounded-full bg-[#131d33] text-white flex items-center justify-center font-semibold text-xs shadow-sm flex-shrink-0 hover:ring-2 hover:ring-[#131d33]/30 transition-all focus:outline-none"
            aria-label="User menu"
          >
            AP
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1 z-50 text-slate-800 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900 leading-none">Aravinda Perera</p>
                <p className="text-[11px] text-slate-500 mt-1 truncate">aravinda@penpalplus.lk</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded text-[10px] font-semibold uppercase">
                  Owner / Admin
                </span>
              </div>

              <div className="py-1 border-b border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profile details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Account settings</span>
                </button>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
