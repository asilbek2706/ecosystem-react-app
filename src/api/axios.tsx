import axios from 'axios';

const api = axios.create({
    baseURL: 'https://eco.runcdc.uz/api/v1',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    const isPublic = [
        '/login/',
        '/send-verify-otp/',
        '/verify-otp/',
        '/auth/forgot-password/',
        '/auth/verify-forgot-otp/',
    ].some((url) => config.url?.includes(url));

    if (token && !isPublic) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
