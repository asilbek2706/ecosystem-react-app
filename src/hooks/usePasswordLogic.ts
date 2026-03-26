import { useNavigate } from 'react-router-dom';
import { type ChangeEvent, type FormEvent, useState } from 'react';
import {
    type IChangePasswordData,
    PasswordService,
} from '../services/password.service.ts';
import { toast } from 'sonner';
import { AuthService } from '../services/auth.service.ts';
import type { IApiError } from '../types/auth.types.ts';

export const usePasswordLogic = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordData, setPasswordData] = useState<IChangePasswordData>({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPasswordData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handlePasswordSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error('Yangi parollar bir-biriga mos kelmadi!');
            return;
        }

        if (passwordData.new_password.length < 8) {
            toast.error('Parol kamida 8 ta belgidan iborat bo‘lishi kerak!');
            return;
        }

        setLoading(true);
        const tId = toast.loading('Parol yangilanmoqda...');

        try {
            await PasswordService.changePassword(passwordData);
            toast.success('Muvaffaqiyatli! Xavfsizlik uchun qayta kiring.', {
                id: tId,
            });

            // 2 soniyadan keyin logout qilish
            setTimeout(() => {
                AuthService.logout();
                navigate('/login', { replace: true });
            }, 2000);
        } catch (error) {
            const apiError = error as IApiError;
            toast.error(
                apiError.response?.data?.message || "Eski parol noto'g'ri!",
                { id: tId }
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        passwordData,
        loading,
        handlePasswordChange,
        handlePasswordSubmit,
    };
};
