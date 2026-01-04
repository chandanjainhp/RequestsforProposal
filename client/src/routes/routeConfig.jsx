import React, { memo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layouts
import PublicLayout from '../layout/PublicLayout';
import ProtectedLayout from '../layout/ProtectedLayout';
import AuthLayout from '../layout/AuthLayout';

// Pages
import HomePage from '../pages/homePage';
import DashboardPage from '../pages/DashboardPage';
import RfpEditorPage from '../pages/RfpEditorPage';
import SendRfpPage from '../pages/SendRfpPage';
import HistoryPage from '../pages/HistoryPage';
import VendorPage from '../pages/VendorPage';
import ComparePage from '../pages/ComparePage';
import ChatPage from '../pages/ChatPage';
import SettingsPage from '../pages/SettingsPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminSettingsPage from '../pages/AdminSettingsPage';
import ProposalInboxPage from '../pages/ProposalInboxPage';
import HelpPage from '../pages/HelpPage';

// Auth Pages
import SignupPage from '../pages/SignupPage';
import VerifyOTPPage from '../pages/VerifyOTPPage';
import LoginPage from '../pages/LoginPage';
import Error403 from '../pages/Error403';
import Error404 from '../pages/Error404';
import Error500 from '../pages/Error500';

// Root redirect component to avoid re-rendering issues
const RootRedirect = memo(() => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/app/dashboard" : "/public"} replace />;
});

// Fallback redirect component
const FallbackRedirect = memo(() => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/app/dashboard" : "/public"} replace />;
});

// Admin Route Guard Component
const AdminRoute = memo(({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/403" replace />;
  }
  
  return children;
});

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Root redirect based on auth status */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public Routes */}
      <Route path="/public" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<Navigate to="/public" replace />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="signup" element={
          !isAuthenticated ? <SignupPage /> : <Navigate to="/app/dashboard" replace />
        } />
        <Route path="verify-otp" element={<VerifyOTPPage />} />
        <Route path="login" element={
          !isAuthenticated ? <LoginPage /> : <Navigate to="/app/dashboard" replace />
        } />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Route>

      {/* Protected Routes */}
      <Route path="/app" element={<ProtectedLayout />}>
        {/* Default redirect */}
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        
        {/* Main app routes */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="editor" element={<RfpEditorPage />} />
        <Route path="editor/:rfpId" element={<RfpEditorPage />} />
        <Route path="send" element={<SendRfpPage />} />
        <Route path="send/:rfpId" element={<SendRfpPage />} />
        <Route path="proposals" element={<ProposalInboxPage />} />
        <Route path="proposals/:rfpId" element={<ProposalInboxPage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="compare/:rfpId" element={<ComparePage />} />
        <Route path="vendors" element={<VendorPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="help" element={<HelpPage />} />

        {/* Admin Routes - same layout, just role-protected */}
        <Route path="admin/users" element={
          <AdminRoute><AdminUsersPage /></AdminRoute>
        } />
        <Route path="admin/settings" element={
          <AdminRoute><AdminSettingsPage /></AdminRoute>
        } />

        {/* Catch-all for /app/* */}
        <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
      </Route>

      {/* Error Pages */}
      <Route path="/403" element={<Error403 />} />
      <Route path="/404" element={<Error404 />} />
      <Route path="/500" element={<Error500 />} />

      {/* Redirect all other routes */}
      <Route path="*" element={<FallbackRedirect />} />
    </Routes>
  );
};

export default AppRoutes;
