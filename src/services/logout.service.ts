import { AxiosError, type AxiosResponse } from 'axios';
import api from '../api/axios';
import { AuthService } from './auth.service';

/**
 * Payload: Backend body ichida JWT kutayotgan bo'lsa
 */
interface LogoutPayload {
    token: string | null;
}

/**
 * Response: Serverdan qaytadigan muvaffaqiyatli javob
 */
interface LogoutResponse {
    message?: string;
    detail?: string;
    success?: boolean;
}

/**
 * Error: Serverdan kelishi mumkin bo'lgan xatolik
 */
interface BackendError {
    detail?: string;
    message?: string;
}

export const LogoutService = {
    handleLogout: async (): Promise<boolean> => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            // 1. Payload tayyorlash
            const payload: LogoutPayload = {
                token: accessToken,
            };

            // 2. So'rov yuborish
            // api/axios.ts interceptor bu yerda avtomatik Authorization headerini qo'shadi
            const response: AxiosResponse<LogoutResponse> =
                await api.post<LogoutResponse>('/auth/logout/', payload);

            if (response.data) {
                console.log(
                    'Logout muvaffaqiyatli:',
                    response.data.message || response.data.detail
                );
            }

            return true;
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;

            // Konsolga aniq xatolikni chiqarish (500, 401 va h.k.)
            console.error(
                'Logout server xatosi:',
                axiosError.response?.data?.detail ||
                    axiosError.response?.data?.message ||
                    axiosError.message
            );

            return false;
        } finally {
            // 3. Tozalash (Har qanday holatda foydalanuvchini tizimdan chiqaramiz)
            AuthService.logout();
            window.location.href = '/login';
        }
    },
};
