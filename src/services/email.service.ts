import api from '../api/axios';

export interface IVerifyEmailData {
    code: string;
}

export const EmailService = {
    verifyNewEmail: (data: IVerifyEmailData) =>
        api.post('/auth/verify-new-email/', data),
};
