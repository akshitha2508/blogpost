import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Enhanced response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        
        // Handle token expiration
        if (error.response?.status === 401 || 
            error.response?.data?.message?.includes('token') ||
            error.response?.data?.message?.includes('expired') ||
            error.response?.data?.message?.includes('invalid') ||
            error.response?.data?.msg?.includes('token') ||
            error.response?.data?.msg?.includes('expired') ||
            error.response?.data?.msg?.includes('invalid')) {
            
            // Clear expired token
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Redirect to login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
