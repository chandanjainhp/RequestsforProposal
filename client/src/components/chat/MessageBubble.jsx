import React from 'react';

const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    const isAi = message.role === 'ai';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] md:max-w-[70%] flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>

                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-sm ${isUser ? 'ml-3 bg-indigo-600' : 'mr-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'}`}>
                    {isUser ? (
                        <span className="text-white text-xs font-bold">ME</span>
                    ) : (
                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    )}
                </div>

                {/* Bubble */}
                <div className={`p-5 rounded-2xl shadow-sm border ${isUser ? 'bg-indigo-600 text-white border-transparent' : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border-gray-100 dark:border-gray-800'}`}>
                    <p className="text-sm leading-7 whitespace-pre-wrap">{message.content}</p>
                    <div className={`flex items-center mt-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <span className={`text-[10px] ${isUser ? 'text-indigo-200' : 'text-gray-400 dark:text-gray-500'}`}>{message.time}</span>
                        {isAi && (
                            <button className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
