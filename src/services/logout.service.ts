import api from '../api/axios';
import { AuthService } from './auth.service';

export const LogoutService = {
    handleLogout: async (): Promise<boolean> => {
        try {
            await api.post('/auth/logout/');
            return true;
        } catch (error) {
            console.error('Server-side logout failed:', error);
            return false;
        } finally {
            AuthService.logout();
        }
    },
};
