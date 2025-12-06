import Sidebar from './Sidebar';
import ToastContainer from '../components/ToastContainer';
import BannerContainer from '../components/BannerContainer';
import ConfirmDialog from '../components/ConfirmDialog';
import { NetworkStatusManager } from '../components/NetworkStatus';
import { GlobalAutoSaveStatus } from '../components/AutoSave';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation - Optimized width 220px (was 240px) */}
      <Sidebar />
      
      {/* Main Content Area - Optimized for new sidebar width */}
      {/* Mobile: full width (sidebar hidden) */}
      {/* Tablet/Desktop: ml-55 (220px sidebar) */}
      <main className="min-h-screen sm:ml-55">
        {/* Global Auto-Save Status - Top Right */}
        <div className="fixed top-4 right-4 z-40 sm:right-8">
          <GlobalAutoSaveStatus />
        </div>
        
        {/* Banner Notifications - Top of content */}
        <div className="relative">
          <div className="px-4 pt-4 sm:px-6">
            <BannerContainer />
          </div>
          
          {/* Network Status Manager - Handles offline banners, sync progress */}
          <NetworkStatusManager />
          
          {/* Main page content */}
          {children}
        </div>
      </main>
      
      {/* Toast Notifications - Fixed position overlay */}
      <ToastContainer />
      
      {/* Confirmation Dialog - Modal overlay */}
      <ConfirmDialog />
    </div>
  );
}
