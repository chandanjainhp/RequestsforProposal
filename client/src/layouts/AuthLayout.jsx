import React from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';
import Toast from '../components/Toast';

const AuthLayout = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#FFFFE3] flex items-center justify-center p-6">
        <Outlet />
        <Toast />
      </div>
    </ErrorBoundary>
  );
};

export default AuthLayout;
