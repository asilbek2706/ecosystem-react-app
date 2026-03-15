import api from '../api/axios';

export interface IChangePasswordData {
    old_password: string;
    new_password: string;
    confirm_password: string;
}

export const PasswordService = {
    changePassword: (data: IChangePasswordData) =>
        api.post('/auth/change-password/', data),
};
