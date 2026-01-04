import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from './Sidebar';
import Header from './Header';
import ErrorBoundary from '../components/ErrorBoundary';
import Toast from '../components/Toast';

const ProtectedLayout = ({ requiredRole = null }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFFE3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D8196] mx-auto"></div>
          <p className="mt-4 text-[#6D8196]">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with current location
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role requirements for admin routes
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/403" replace />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#FFFFE3]">
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Header */}
            <Header />
            
            {/* Page Content */}
            <main className="flex-1 p-6 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
        
        <Toast />
      </div>
    </ErrorBoundary>
  );
};

export default ProtectedLayout;
