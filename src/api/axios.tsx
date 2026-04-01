import axios, { type InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: 'https://eco.runcdc.uz/api/v1',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');

        const publicUrls = [
            '/login/',
            '/send-verify-otp/',
            '/verify-otp/',
            '/auth/forgot-password/',
            '/auth/verify-forgot-otp/',
        ];

        const isPublic = config.url
            ? publicUrls.some((url) => config.url!.endsWith(url))
            : false;

        if (token && !isPublic) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
