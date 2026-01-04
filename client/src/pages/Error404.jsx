import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../layout/PublicLayout';

/**
 * 404 Not Found Error Page
 */
const Error404 = () => {
  return (
    <PublicLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-charcoal mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-muted-blue mb-2">Page Not Found</h2>
            <p className="text-soft-gray max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/app/dashboard"
              className="btn-primary inline-block"
            >
              Go to Dashboard
            </Link>
            <div>
              <Link
                to="/"
                className="link text-sm"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Error404;
