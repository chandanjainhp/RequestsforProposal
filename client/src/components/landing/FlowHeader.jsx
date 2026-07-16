import React from 'react';

const FlowHeader = () => {
    return (
        <div className="text-center max-w-3xl mx-auto mb-20 px-4">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                Built for every <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                    procurement need
                </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                Flexible workflows for any industry, team size, or complexity — powered by intelligent AI assistance.
            </p>
        </div>
    );
};

export default FlowHeader;
