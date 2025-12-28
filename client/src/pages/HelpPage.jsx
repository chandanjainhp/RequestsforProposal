import React from 'react';
import Breadcrumb from '../components/Breadcrumb';

export default function HelpPage() {
  return (
    <div className="w-full overflow-x-hidden overflow-y-auto">
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <Breadcrumb items={[{ label: 'Help', href: null }]} />
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-sm text-gray-600 mt-2">Find answers to common questions or contact our support team.</p>
        </div>
      </header>

      <div className="px-4 md:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <section className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-3">Getting Started</h2>
            <p className="text-sm text-gray-700">To create your first BidSense, start a conversation on the Chat page or use the "New RFP" button in History.</p>
          </section>

          <section className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-3">Frequently Asked Questions</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              <li><strong>Q:</strong> How do I send a BidSense to vendors? <br /><strong>A:</strong> Open a BidSense and use the "Send" action to select vendors and send via email.</li>
              <li><strong>Q:</strong> Where can I find proposals? <br /><strong>A:</strong> The Proposals page shows all vendor submissions.</li>
              <li><strong>Q:</strong> Who can access settings? <br /><strong>A:</strong> Admins have access to full settings; users can update their profile in Settings.</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-3">Contact Support</h2>
            <p className="text-sm text-gray-700">If you can't find an answer, email <a className="text-blue-600" href="mailto:support@bidsense.example">support@bidsense.example</a> or open a support ticket from your account menu.</p>
          </section>
        </div>
      </div>
    </div>
  );
}