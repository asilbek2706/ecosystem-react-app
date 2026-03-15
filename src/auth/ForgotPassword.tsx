import React, { type FormEvent, useState } from 'react';
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

interface BackendError {
    detail?: string;
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

    const handleSendCode = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await AuthService.forgotPassword(username);
            toast.success('Tasdiqlash kodi yuborildi!');
            setStep(2);
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;
            const errorMsg =
                axiosError.response?.data?.detail ||
                axiosError.response?.data?.message ||
                'Username topilmadi yoki xatolik yuz berdi.';
            toast.error(errorMsg); // Xatolik xabari
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndReset = async (e: FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Parollar mos kelmadi!');
            return;
        }

        setLoading(true);
        try {
            await AuthService.verifyForgotOtp({
                otp: code,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });

            toast.success('Parol muvaffaqiyatli yangilandi!');

            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;
            const errorMsg =
                axiosError.response?.data?.detail ||
                axiosError.response?.data?.message ||
                "Xatolik! Kod xato bo'lishi yoki parol talablarga javob bermasligi mumkin.";
            toast.error(errorMsg); // Xatolik xabari
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
                    />
                    <Typography variant="h5" fontWeight="700">
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

                {/* MUI Alert olib tashlandi, chunki endi toast ishlatamiz */}

                <form
                    onSubmit={
                        step === 1 ? handleSendCode : handleVerifyAndReset
                    }
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
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <i className="bi bi-person text-secondary"></i>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        ) : (
                            <>
                                <TextField
                                    label="Tasdiqlash kodi"
                                    variant="standard"
                                    fullWidth
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
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
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
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
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
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
                            disabled={loading}
                            sx={{ minHeight: '45px' }}
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
                            onClick={() => navigate('/login')}
                            className="back-link"
                            disabled={loading}
                            sx={{ textDecoration: 'none' }}
                        >
                            <i className="bi bi-arrow-left me-1"></i> Orqaga
                            qaytish
                        </Link>
                    </Box>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
