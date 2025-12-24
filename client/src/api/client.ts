import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Add auth token/email
apiClient.interceptors.request.use(
    (config) => {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            config.headers['x-user-email'] = userEmail;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors globally
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        const { response } = error;

        if (response?.status === 401) {
            // Unauthorized: redirect to login
            localStorage.removeItem('userEmail');
            window.location.href = '/login';
        }

        if (response?.status === 404) {
            console.error('Resource not found');
        }

        if (response && response.status >= 500) {
            console.error('Server error:', response.data);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
