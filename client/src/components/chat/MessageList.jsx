import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages }) => {
    const scrollRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth bg-gray-50/30 dark:bg-black transition-colors">
                <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto opacity-0 animate-fade-in-up">
                    <div className="w-20 h-20 bg-linear-to-tr from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/30">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">How can I help you today?</h3>
                    <p className="text-gray-500 dark:text-gray-400">I can analyze RFPs, compare vendor proposals, or draft requirements for your procurement team.</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth bg-gray-50/30 dark:bg-black transition-colors">
            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))}
        </div>
    );
};

export default MessageList;
