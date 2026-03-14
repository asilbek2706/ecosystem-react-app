import React, { type FormEvent, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Link,
    InputAdornment,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
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
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSendCode = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await AuthService.forgotPassword(username);
            setStep(2);
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;
            setError(
                axiosError.response?.data?.detail ||
                    axiosError.response?.data?.message ||
                    'Username topilmadi yoki xatolik yuz berdi.'
            );
        } finally {
            setLoading(false);
        }
    };

    // 2-qadam: OTP + Yangi parollarni yuborish
    const handleVerifyAndReset = async (e: FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Parollar mos kelmadi!');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await AuthService.verifyForgotOtp({
                otp: code,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            alert(
                'Parol muvaffaqiyatli yangilandi! Endi yangi parol bilan login qilishingiz mumkin.'
            );
            navigate('/login');
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;
            setError(
                axiosError.response?.data?.detail ||
                    axiosError.response?.data?.message ||
                    "Xatolik! Kod xato bo'lishi yoki parol talablarga javob bermasligi mumkin."
            );
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

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

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
