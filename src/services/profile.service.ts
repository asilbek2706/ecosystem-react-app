import api from '../api/axios';
import type { IUserProfile } from '../types/auth.types.ts';

export interface IUpdateProfileData {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    telegram_id?: string;
}

export const ProfileService = {
    updateProfile: (data: IUpdateProfileData) =>
        api.patch<{ data: IUserProfile }>('/auth/change-profile/', data),
};
