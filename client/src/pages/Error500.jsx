import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import PublicLayout from '../layout/PublicLayout';

/**
 * 500 Server Error Page
 */
const Error500 = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <PublicLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <AlertTriangle className="mx-auto h-16 w-16 text-charcoal mb-4" />
            <h1 className="text-6xl font-bold text-charcoal mb-4">500</h1>
            <h2 className="text-2xl font-semibold text-muted-blue mb-2">Server Error</h2>
            <p className="text-soft-gray max-w-md mx-auto mb-4">
              Something went wrong on our end. We're working to fix this issue.
            </p>
            <p className="text-soft-gray text-sm max-w-md mx-auto">
              Error Code: 500 - Internal Server Error
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleRetry}
              className="btn-primary inline-flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </button>
            <div className="space-y-2">
              <Link
                to="/app/dashboard"
                className="block link text-sm"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/auth/login"
                className="block link text-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Error500;
