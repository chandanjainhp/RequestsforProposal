import React from 'react';

const FeatureTable = () => {
    const features = [
        {
            category: "Core Features", items: [
                { name: "RFP Creation", starter: "Basic Templates", pro: "Advanced AI Templates", ent: "Custom Templates" },
                { name: "Vendor Management", starter: "Limited", pro: "Unlimited", ent: "Unlimited + API" },
                { name: "Proposal Storage", starter: "5GB", pro: "50GB", ent: "Unlimited" }
            ]
        },
        {
            category: "AI Intelligence", items: [
                { name: "Auto-Scoring", starter: "Basic", pro: "Advanced", ent: "Custom Models" },
                { name: "Risk Detection", starter: "—", pro: "Standard", ent: "Real-time" },
                { name: "Market Insights", starter: "—", pro: "Regional", ent: "Global" }
            ]
        },
        {
            category: "Support & Security", items: [
                { name: "Support Level", starter: "Email", pro: "Priority Email", ent: "24/7 Dedicated" },
                { name: "SSO", starter: "—", pro: "Google/Microsoft", ent: "Okta/SAML" },
                { name: "Audit Logs", starter: "7 Days", pro: "1 Year", ent: "Unlimited" }
            ]
        }
    ];

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">Compare Plans</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 bg-gray-50 dark:bg-gray-900"></th>
                                <th className="p-4 text-lg font-bold text-gray-900 dark:text-white text-center w-1/4">Starter</th>
                                <th className="p-4 text-lg font-bold text-indigo-600 dark:text-indigo-400 text-center w-1/4">Professional</th>
                                <th className="p-4 text-lg font-bold text-gray-900 dark:text-white text-center w-1/4">Enterprise</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((cat, cIdx) => (
                                <React.Fragment key={cIdx}>
                                    <tr>
                                        <td colSpan="4" className="p-4 bg-gray-100 dark:bg-gray-800 font-bold text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider border-y border-gray-200 dark:border-gray-700 mt-8">
                                            {cat.category}
                                        </td>
                                    </tr>
                                    {cat.items.map((item, iIdx) => (
                                        <tr key={iIdx} className="border-b border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-black transition-colors">
                                            <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{item.name}</td>
                                            <td className="p-4 text-center text-gray-600 dark:text-gray-400">{item.starter}</td>
                                            <td className="p-4 text-center font-bold text-indigo-900 dark:text-indigo-300 bg-indigo-50/30 dark:bg-indigo-900/30">{item.pro}</td>
                                            <td className="p-4 text-center text-gray-600 dark:text-gray-400">{item.ent}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default FeatureTable;
