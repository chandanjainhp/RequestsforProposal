import React from 'react';

const RfpDocumentEditor = ({ sections, onUpdateSection, onAddSection }) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12 min-h-[800px] transition-colors">
            <div className="max-w-3xl mx-auto space-y-12">
                {sections.map((section, index) => (
                    <div key={section.id} className="group relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center text-xs font-black">
                                    {index + 1}
                                </div>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {section.title}
                                </h3>
                            </div>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="Delete">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={section.content}
                            onChange={(e) => onUpdateSection(section.id, e.target.value)}
                            placeholder={section.placeholder}
                            className="w-full text-gray-700 dark:text-gray-300 text-lg leading-relaxed bg-transparent border-l-4 border-gray-50 dark:border-gray-800 focus:border-indigo-500 dark:focus:border-indigo-500 pl-6 py-2 outline-none transition-all resize-none overflow-hidden placeholder-gray-300 dark:placeholder-gray-700"
                            rows={Math.max(3, section.content.split('\n').length)}
                        />
                    </div>
                ))}

                <button
                    onClick={onAddSection}
                    className="w-full py-5 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-600 font-bold hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                    Add New Section
                </button>
            </div>
        </div>
    );
};

export default RfpDocumentEditor;
