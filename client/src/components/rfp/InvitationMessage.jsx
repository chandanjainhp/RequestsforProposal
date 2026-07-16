import React from 'react';

const InvitationMessage = ({ message, setMessage }) => {
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs mr-3">2</span>
                Invitation Message
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Subject Line</label>
                    <input
                        type="text"
                        value={message.subject}
                        onChange={e => setMessage({ ...message, subject: e.target.value })}
                        placeholder="Invitation to Bid: Cloud Infrastructure Migration"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Message Body</label>
                    <textarea
                        rows="4"
                        value={message.body}
                        onChange={e => setMessage({ ...message, body: e.target.value })}
                        placeholder="Dear Vendor, You are invited to submit a proposal..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all font-medium resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                    />
                </div>
            </div>
        </div>
    );
};

export default InvitationMessage;
