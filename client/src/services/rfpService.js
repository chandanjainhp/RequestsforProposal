import api from '../api/axios';

const rfpService = {
    getAll: async () => {
        // return api.get('/rfps');
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        { id: 1, title: 'Enterprise Cloud Migration', vendorCount: 12, status: 'Open', deadline: 'Oct 24, 2025' },
                        { id: 2, title: 'Q4 Laptop Refresh', vendorCount: 5, status: 'Draft', deadline: 'Nov 01, 2025' },
                        { id: 3, title: 'Cybersecurity Audit Service', vendorCount: 8, status: 'Closed', deadline: 'Sep 15, 2025' },
                        { id: 4, title: 'Marketing Agency Retainer', vendorCount: 15, status: 'Open', deadline: 'Dec 10, 2025' },
                    ]
                });
            }, 700);
        });
    },

    create: async (rfpData) => {
        // return api.post('/rfps', rfpData);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: { id: Math.floor(Math.random() * 1000), ...rfpData } });
            }, 1000);
        });
    }
};

export default rfpService;
