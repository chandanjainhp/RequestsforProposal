import React, { useState } from 'react';

const ChatInput = ({ onSendMessage }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        onSendMessage(input);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="p-4 md:p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-20 transition-colors">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
                <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all group-focus-within:ring-2 group-focus-within:ring-indigo-100 dark:group-focus-within:ring-indigo-900/30 group-focus-within:border-indigo-400 dark:group-focus-within:border-indigo-600"></div>
                <textarea
                    rows="1"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask BidSense to analyze an RFP..."
                    className="w-full relative bg-transparent border-none focus:ring-0 py-4 pl-5 pr-24 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none overflow-hidden"
                    style={{ minHeight: '56px' }}
                />
                <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                    <button type="button" className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Attach context">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    </button>
                    <button
                        type="submit"
                        className={`p-2 rounded-lg transition-all ${input.trim() ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'}`}
                        disabled={!input.trim()}
                    >
                        <svg className="w-5 h-5 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </div>
            </form>
            <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-3 font-medium">
                AI generated content can be inaccurate.
            </p>
        </div>
    );
};

export default ChatInput;
