import React, { type ChangeEvent, type FormEvent, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Link,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import '../styles/auth/AuthAction.scss';
import { AuthService } from '../services/auth.service';

/**
 * Backenddan kelishi mumkin bo'lgan xatolik strukturasi
 */
interface BackendError {
    detail?: string | string[];
    message?: string;
}

const ForgotPassword: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [username, setUsername] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    /**
     * Step 1: Username yuborish va kod olish
     */
    const handleSendCode = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Username'ni trim va uppercase qilib yuboramiz
            await AuthService.forgotPassword(username.trim().toUpperCase());
            toast.success('Tasdiqlash kodi yuborildi!');
            setStep(2);
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;
            const errorData = axiosError.response?.data;

            let errorMsg = 'Username topilmadi yoki xatolik yuz berdi.';

            if (errorData?.message) {
                errorMsg = errorData.message;
            } else if (Array.isArray(errorData?.detail)) {
                errorMsg = errorData.detail[0];
            } else if (typeof errorData?.detail === 'string') {
                errorMsg = errorData.detail;
            }

            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Step 2: Kodni tekshirish va parolni yangilash
     */
    const handleVerifyAndReset = async (e: FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Parollar mos kelmadi!');
            return;
        }

        setLoading(true);
        try {
            await AuthService.verifyForgotOtp({
                otp: code.trim(),
                new_password: newPassword,
                confirm_password: confirmPassword,
            });

            toast.success('Parol muvaffaqiyatli yangilandi!');

            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;
            const errorData = axiosError.response?.data;

            let errorMsg =
                "Xatolik! Kod xato bo'lishi yoki parol talablarga javob bermasligi mumkin.";

            if (errorData?.message) {
                errorMsg = errorData.message;
            } else if (Array.isArray(errorData?.detail)) {
                errorMsg = errorData.detail[0];
            } else if (typeof errorData?.detail === 'string') {
                errorMsg = errorData.detail;
            }

            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-action-container">
            <div className="auth-action-card shadow">
                <div className="text-center mb-4">
                    <img
                        src="/images/logotip.png"
                        alt="Logo"
                        className="action-logo"
                        style={{ maxWidth: '100px' }}
                    />
                    <Typography
                        variant="h5"
                        fontWeight="700"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Parolni tiklash
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                    >
                        {step === 1
                            ? 'Username kiriting, parolni tiklash kodini yuboramiz.'
                            : 'Kodni va yangi parolni kiriting.'}
                    </Typography>
                </div>

                <form
                    onSubmit={
                        step === 1 ? handleSendCode : handleVerifyAndReset
                    }
                    noValidate
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                        }}
                    >
                        {step === 1 ? (
                            <TextField
                                label="Username"
                                variant="standard"
                                fullWidth
                                value={username}
                                // Avtomatik katta harfga o'tkazish
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setUsername(e.target.value.toUpperCase())
                                }
                                required
                                disabled={loading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <i className="bi bi-person text-secondary"></i>
                                        </InputAdornment>
                                    ),
                                    style: { textTransform: 'uppercase' },
                                }}
                            />
                        ) : (
                            <>
                                <TextField
                                    label="Tasdiqlash kodi"
                                    variant="standard"
                                    fullWidth
                                    value={code}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => setCode(e.target.value)}
                                    required
                                    autoFocus
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <i className="bi bi-key text-secondary"></i>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    label="Yangi parol"
                                    type="password"
                                    variant="standard"
                                    fullWidth
                                    value={newPassword}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => setNewPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <i className="bi bi-lock text-secondary"></i>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    label="Parolni tasdiqlash"
                                    type="password"
                                    variant="standard"
                                    fullWidth
                                    value={confirmPassword}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <i className="bi bi-shield-check text-secondary"></i>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            className="action-btn"
                            disabled={
                                loading ||
                                (step === 1
                                    ? !username.trim()
                                    : !code.trim() || !newPassword)
                            }
                            sx={{
                                minHeight: '48px',
                                borderRadius: '10px',
                                fontWeight: '600',
                                textTransform: 'none',
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : step === 1 ? (
                                'Kod yuborish'
                            ) : (
                                'Parolni yangilash'
                            )}
                        </Button>

                        <Link
                            component="button"
                            type="button"
                            onClick={() =>
                                step === 2 ? setStep(1) : navigate('/login')
                            }
                            sx={{
                                textDecoration: 'none',
                                color: 'text.secondary',
                                textAlign: 'center',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                            }}
                        >
                            <i className="bi bi-arrow-left me-1"></i>
                            {step === 2
                                ? "Username-ni o'zgartirish"
                                : 'Orqaga qaytish'}
                        </Link>
                    </Box>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
