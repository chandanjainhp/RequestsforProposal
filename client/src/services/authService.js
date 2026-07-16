import api from '../api/axios';

const authService = {
    login: async (email, password) => {
        // MOCK: Simulate API delay and return success
        // return api.post('/auth/login', { email, password });
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem('token', 'mock-jwt-token');
                resolve({
                    data: {
                        user: { id: 1, name: 'Demo User', email },
                        token: 'mock-jwt-token'
                    }
                });
            }, 1000);
        });
    },

    register: async (userData) => {
        // return api.post('/auth/register', userData);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: { message: 'Registration successful' } });
            }, 1000);
        });
    },

    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
};

export default authService;
