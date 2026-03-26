import type { IApiError, IUserProfile } from '../types/auth.types.ts';
import { type ChangeEvent, type FormEvent, useState } from 'react';
import type { IProfileUpdateForm } from '../types/profile.ts';
import { toast } from 'sonner';
import { ProfileService } from '../services/profile.service.ts';

export const useProfileLogic = (
    user: IUserProfile | null,
    refreshProfile: () => Promise<void>
) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);

    const [formData, setFormData] = useState<IProfileUpdateForm>({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        telegram_id: user?.telegram_id || '',
    });

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleProfileSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        const tId = toast.loading('Saqlanmoqda...');
        try {
            await ProfileService.updateProfile(formData);
            if (formData.email !== user?.email) {
                setIsVerifyModalOpen(true);
                toast.success('Tasdiqlash kodi yuborildi!', { id: tId });
            } else {
                toast.success('Profil yangilandi!', { id: tId });
            }
            await refreshProfile();
        } catch (error) {
            const apiError = error as IApiError;
            toast.error(apiError.response?.data?.message || 'Xatolik', {
                id: tId,
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        isVerifyModalOpen,
        setIsVerifyModalOpen,
        handleFormChange,
        handleProfileSubmit,
    };
};
