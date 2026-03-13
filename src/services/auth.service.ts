import api from '../api/axios';

export const AuthService = {
    login: (data: object) => api.post('/auth/login/', data),

    sendOTP: (username: string) =>
        api.post('/auth/send-verify-otp/', { username }),

    verifyOTP: (otp: string) => api.post('/auth/verify-otp/', { otp }),

    getProfile: () => api.get('/auth/profile/'),

    saveTokens: (access: string, refresh: string) => {
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
    },

    saveProfile: (profile: object) => {
        localStorage.setItem('userProfile', JSON.stringify(profile));
    },
};
