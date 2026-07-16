import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NotificationCenter from '../pages/NotificationCenter';
import Sidebar from './layout/Sidebar';
import TopBar from './layout/TopBar';
import MobileOverlay from './layout/MobileOverlay';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Drawer
  const [isCollapsed, setIsCollapsed] = useState(false);    // Desktop Collapse
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

      {/* --- Sidebar Component --- */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* --- Topbar Component --- */}
        <TopBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          setIsNotifOpen={setIsNotifOpen}
        />

        {/* Content Window */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none scroll-smooth">
          <Outlet />
        </main>
      </div>

      {/* Shared Components */}
      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

      {/* Mobile Sidebar Overlay */}
      <MobileOverlay isSidebarOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
};

export default Layout;