import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export const DashboardLayout = ({ children, title, subtitle, headerActions = null }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-[#f8fafc] flex overflow-hidden">
      {/* Fixed Non-Scrollable Sidebar (Left) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Fixed Header (Stays Fixed at Top, Not Scrollable) */}
        <Header
          title={title}
          subtitle={subtitle}
          actions={headerActions}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Scrollable Dashboard Body (Only this part scrolls) */}
        <main className="flex-1 px-6 lg:px-8 py-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
