import { type ChangeEvent, type FC, type FormEvent, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    InputAdornment,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import '../styles/auth/AuthAction.scss';
import { AuthService } from '../services/auth.service.ts';

interface ApiErrorResponse {
    detail?: string | string[];
    message?: string;
    status?: boolean;
}

const ActivateAccount: FC = () => {
    const [step, setStep] = useState<number>(1);
    const [username, setUsername] = useState<string>('');
    const [otpCode, setOtpCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [statusMsg, setStatusMsg] = useState<{
        type: 'error' | 'success';
        text: string;
    } | null>(null);

    const navigate = useNavigate();

    const handleAction = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatusMsg(null);

        try {
            if (step === 1) {
                const response = await AuthService.sendOTP(username.trim());

                if (response.data.status === true || response.status === 200) {
                    setStatusMsg({
                        type: 'success',
                        text:
                            response.data.message ||
                            'Tasdiqlash kodi yuborildi!',
                    });
                    setStep(2);
                }
            } else {
                const response = await AuthService.verifyOTP(otpCode.trim());

                if (
                    response.data.status === true ||
                    response.status === 200 ||
                    response.status === 201
                ) {
                    setStatusMsg({
                        type: 'success',
                        text: 'Profilingiz muvaffaqiyatli faollashtirildi!',
                    });
                    setTimeout(() => navigate('/login'), 2500);
                }
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiErrorResponse>;
            const errorData = axiosError.response?.data;

            let errorText = 'Xatolik yuz berdi. Qaytadan urinib ko‘ring.';
            if (errorData?.message) errorText = errorData.message;
            else if (Array.isArray(errorData?.detail))
                errorText = errorData.detail[0];
            else if (typeof errorData?.detail === 'string')
                errorText = errorData.detail;

            setStatusMsg({ type: 'error', text: errorText });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-action-container">
            <div className="auth-action-card shadow-lg">
                <div className="text-center mb-4">
                    <img
                        src="/images/coderImage.png"
                        alt="Logo"
                        style={{ maxWidth: '100px' }}
                    />
                    <Typography
                        variant="h5"
                        fontWeight="700"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Aktivatsiya
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                    >
                        {step === 1
                            ? 'Profilingizni faollashtirish uchun username kiriting.'
                            : 'Emailingizga kelgan tasdiqlash kodini kiriting.'}
                    </Typography>
                </div>

                {statusMsg && (
                    <Alert
                        severity={statusMsg.type}
                        sx={{ mb: 2, borderRadius: '10px' }}
                        variant="filled"
                    >
                        {statusMsg.text}
                    </Alert>
                )}

                <form onSubmit={handleAction} noValidate>
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
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setUsername(e.target.value)
                                }
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
                            <TextField
                                label="Tasdiqlash kodi"
                                variant="standard"
                                fullWidth
                                value={otpCode}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setOtpCode(e.target.value)
                                }
                                required
                                autoFocus
                                disabled={loading}
                                placeholder="OTP kodni kiriting"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <i className="bi bi-shield-lock text-secondary"></i>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            className="action-btn"
                            disabled={
                                loading ||
                                (step === 1
                                    ? !username.trim()
                                    : !otpCode.trim())
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
                                'Tasdiqlash'
                            )}
                        </Button>

                        <Link
                            component="button"
                            type="button"
                            onClick={() =>
                                step === 1 ? navigate('/login') : setStep(1)
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
                            {step === 1
                                ? 'Orqaga qaytish'
                                : 'Username-ni o‘zgartirish'}
                        </Link>
                    </Box>
                </form>
            </div>
        </div>
    );
};

export default ActivateAccount;
