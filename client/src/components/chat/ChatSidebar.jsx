import React from 'react';

const ChatSidebar = ({ isOpen, onClose, chats, activeChatId, onSelectChat, onNewChat, onDeleteChat }) => {
    return (
        <aside className={`${isOpen ? 'w-80' : 'w-0'} bg-gray-50 dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 flex flex-col overflow-hidden`}>
            {/* Header for History Panel */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm min-w-[20rem]">
                <h3 className="font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">Recent Chats</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 md:hidden">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 min-w-[20rem]">
                <button
                    onClick={onNewChat}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all mb-4"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                    Start New Chat
                </button>

                {chats.map((item) => (
                    <div
                        key={item.id}
                        className={`group w-full text-left p-3 rounded-xl transition-all border relative cursor-pointer ${item.id === activeChatId ? 'bg-white dark:bg-gray-800 border-indigo-100 dark:border-indigo-500/20 shadow-sm ring-1 ring-indigo-500/10' : 'border-transparent hover:bg-white dark:hover:bg-gray-800 hover:border-gray-100 dark:hover:border-gray-700 hover:shadow-sm'}`}
                        onClick={() => onSelectChat(item.id)}
                    >
                        <div className="flex items-center justify-between mb-1 pr-6">
                            <span className={`text-xs font-semibold truncate ${item.id === activeChatId ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'}`}>
                                {item.title || 'New Conversation'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate w-full pr-4">
                                {item.messages[item.messages.length - 1]?.content.substring(0, 40)}...
                            </p>
                            <span className="text-[10px] text-gray-300 dark:text-gray-600 whitespace-nowrap ml-2">{item.time}</span>
                        </div>

                        {/* Delete Button (visible on hover) */}
                        <button
                            onClick={(e) => onDeleteChat(e, item.id)}
                            className="absolute right-2 top-2 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-all"
                            title="Delete Chat"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                ))}
            </div>

            {/* Bottom Info */}
            <div className="p-2 border-t border-gray-100 dark:border-gray-800 flex justify-center min-w-[20rem]">
                <div className="h-1 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
        </aside>
    );
};

export default ChatSidebar;
