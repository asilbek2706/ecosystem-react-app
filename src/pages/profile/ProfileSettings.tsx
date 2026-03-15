import { type ChangeEvent, type FC, type FormEvent, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import {
    type IUpdateProfileData,
    ProfileService,
} from '../../services/profile.service.ts';
import { EmailService } from '../../services/email.service.ts';
import {
    type IChangePasswordData,
    PasswordService,
} from '../../services/password.service.ts';
import { AuthService } from '../../services/auth.service.ts';
import type { IApiError, IUserProfile } from '../../types/auth.types.ts';

interface ContextType {
    user: IUserProfile | null;
    refreshProfile: () => Promise<void>;
}

const ProfileSettings: FC = () => {
    const { user, refreshProfile } = useOutletContext<ContextType>();
    const navigate = useNavigate();

    // --- State-lar ---
    const [loading, setLoading] = useState<boolean>(false);
    const [verifying, setVerifying] = useState<boolean>(false);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState<string>('');

    const [formData, setFormData] = useState<IUpdateProfileData>({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        telegram_id: user?.telegram_id || '',
    });

    const [passwordData, setPasswordData] = useState<IChangePasswordData>({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        const toastId = toast.loading("O'zgarishlar saqlanmoqda...");
        setLoading(true);

        try {
            await ProfileService.updateProfile(formData);
            if (formData.email !== user?.email) {
                toast.success(
                    'Profil yangilandi. Yangi emailga tasdiqlash kodi yuborildi!',
                    { id: toastId }
                );
                setIsVerifyModalOpen(true);
            } else {
                toast.success('Ma’lumotlar muvaffaqiyatli yangilandi!', {
                    id: toastId,
                });
            }
            await refreshProfile();
        } catch (error: unknown) {
            const apiError = error as IApiError;
            toast.error(
                apiError.response?.data?.message || 'Xatolik yuz berdi',
                { id: toastId }
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error('Yangi parollar mos kelmadi!');
            return;
        }

        const tId = toast.loading('Parol yangilanmoqda...');
        try {
            await PasswordService.changePassword(passwordData);
            toast.success(
                "Parol muvaffaqiyatli o'zgartirildi! Qayta login qiling.",
                { id: tId }
            );

            setTimeout(() => {
                AuthService.logout();
                navigate('/login', { replace: true });
            }, 2000);
        } catch (error: unknown) {
            const apiError = error as IApiError;
            toast.error(
                apiError.response?.data?.message || "Eski parol noto'g'ri",
                { id: tId }
            );
        }
    };

    const handleVerifyEmail = async (): Promise<void> => {
        if (!verificationCode) return;
        setVerifying(true);
        const tId = toast.loading('Kod tekshirilmoqda...');

        try {
            await EmailService.verifyNewEmail({ code: verificationCode });
            toast.success('Email muvaffaqiyatli tasdiqlandi!', { id: tId });
            setIsVerifyModalOpen(false);
            setVerificationCode('');
            await refreshProfile();
        } catch (error: unknown) {
            const apiError = error as IApiError;
            toast.error(apiError.response?.data?.message || 'Kod noto‘g‘ri!', {
                id: tId,
            });
        } finally {
            setVerifying(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Toaster position="top-center" />
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                Sozlamalar
            </Typography>

            <Paper
                sx={{
                    p: 4,
                    borderRadius: '16px',
                    mb: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                }}
            >
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Shaxsiy ma'lumotlar
                </Typography>
                <form onSubmit={handleProfileSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Ism"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Familiya"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Telefon"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Telegram ID"
                                name="telegram_id"
                                value={formData.telegram_id}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{ py: 1.2, px: 4, borderRadius: '8px' }}
                            >
                                Profilni saqlash
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {/* 2. Parolni o'zgartirish */}
            <Paper
                sx={{
                    p: 4,
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                }}
            >
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Xavfsizlik (Parol)
                </Typography>
                <form onSubmit={handlePasswordSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Eski parol"
                                name="old_password"
                                value={passwordData.old_password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Yangi parol"
                                name="new_password"
                                value={passwordData.new_password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Yangi parolni tasdiqlang"
                                name="confirm_password"
                                value={passwordData.confirm_password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="warning"
                                sx={{ py: 1.2, px: 4, borderRadius: '8px' }}
                            >
                                Parolni yangilash
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {/* Email Verify Modali */}
            <Dialog
                open={isVerifyModalOpen}
                onClose={() => !verifying && setIsVerifyModalOpen(false)}
            >
                <DialogTitle>Emailni tasdiqlash</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        Yangi emailingizga yuborilgan 6 xonali kodni kiriting:
                    </Typography>
                    <TextField
                        fullWidth
                        label="Tasdiqlash kodi"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        slotProps={{ htmlInput: { maxLength: 6 } }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setIsVerifyModalOpen(false)}
                        disabled={verifying}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        onClick={handleVerifyEmail}
                        variant="contained"
                        disabled={verifying || verificationCode.length < 1}
                    >
                        Tasdiqlash
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProfileSettings;
