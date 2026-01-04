import React from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';
import Toast from '../components/Toast';

const PublicLayout = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#FFFFE3]">
        <Outlet />
        <Toast />
      </div>
    </ErrorBoundary>
  );
};

export default PublicLayout;
