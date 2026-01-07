import api from '../api';

export const authService = {
    login: async (email, password) => {
        console.log('🔵 Client: Sending Login Request...', { email });
        try {
            const response = await api.post('/auth/login', { email, password });
            console.log('🟢 Client: Login Response:', response.data);
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (response.data.name) {
                    localStorage.setItem('userName', response.data.name);
                }
            }
            return response.data;
        } catch (error) {
            console.error('🔴 Client: Login Error:', error.response?.data || error.message);
            throw error;
        }
    },

    register: async (username, email, password) => {
        console.log('🔵 Client: Sending Register Request...', { username, email });
        try {
            const response = await api.post('/auth/register', { name: username, email, password });
            console.log('🟢 Client: Register Response:', response.data);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (response.data.name) {
                    localStorage.setItem('userName', response.data.name);
                }
            }
            return response.data;
        } catch (error) {
            console.error('🔴 Client: Register Error:', error.response?.data || error.message);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
    },

    getToken: () => localStorage.getItem('token'),
    getUserName: () => localStorage.getItem('userName') || 'User',
    isAuthenticated: () => !!localStorage.getItem('token')
};