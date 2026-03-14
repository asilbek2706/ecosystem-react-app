import api from '../api/axios';
import type { IUserProfile } from '../types/auth.types.ts';

interface LoginData {
    username: string;
    password?: string;
}

interface TokenResponse {
    access: string;
    refresh: string;
}

export const AuthService = {
    login: (data: LoginData) => api.post<TokenResponse>('/auth/login/', data),

    sendOTP: (username: string) =>
        api.post('/auth/send-verify-otp/', { username }),

    verifyOTP: (otp: string) => api.post('/auth/verify-otp/', { otp }),

    getProfile: () => api.get<{ data: IUserProfile }>('/auth/profile/'),

    saveTokens: (access: string, refresh: string): void => {
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
    },

    saveProfile: (profile: IUserProfile): void => {
        localStorage.setItem('userProfile', JSON.stringify(profile));
    },

    getSavedProfile: (): IUserProfile | null => {
        const profile = localStorage.getItem('userProfile');
        return profile ? JSON.parse(profile) : null;
    },

    logout: (): void => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userProfile');
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('accessToken');
    },
};
