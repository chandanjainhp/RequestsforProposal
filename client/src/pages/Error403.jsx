import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import PublicLayout from '../layouts/PublicLayout';

/**
 * 403 Unauthorized Error Page
 */
const Error403 = () => {
  return (
    <PublicLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <ShieldX className="mx-auto h-16 w-16 text-charcoal mb-4" />
            <h1 className="text-6xl font-bold text-charcoal mb-4">403</h1>
            <h2 className="text-2xl font-semibold text-muted-blue mb-2">Access Denied</h2>
            <p className="text-soft-gray max-w-md mx-auto mb-4">
              You don't have permission to access this page. This area is restricted to authorized users only.
            </p>
            <p className="text-soft-gray text-sm max-w-md mx-auto">
              If you believe this is an error, please contact your administrator or support team.
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
                to="/auth/login"
                className="link text-sm"
              >
                Sign In with Different Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Error403;
