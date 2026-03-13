import React, { type FormEvent, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Link,
    InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/auth/AuthAction.scss';

const ForgotPassword: React.FC = () => {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const handleSendCode = (e: FormEvent) => {
        e.preventDefault();
        // Swagger: POST /api/auth/forgot-password-send
        console.log('Tiklash kodi yuborildi:', username);
        setStep(2);
    };

    const handleVerify = (e: FormEvent) => {
        e.preventDefault();
        // Swagger: POST /api/auth/verify-reset-code
        navigate('/login');
    };

    return (
        <div className="auth-action-container">
            <div className="auth-action-card shadow">
                <div className="text-center mb-4">
                    <img
                        src="/images/lototip.png"
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
                            : 'Emailingizga kelgan maxfiy kodni kiriting.'}
                    </Typography>
                </div>
                <form onSubmit={step === 1 ? handleSendCode : handleVerify}>
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
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <i className="bi bi-key text-secondary"></i>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            className="action-btn"
                        >
                            {step === 1 ? 'Kod yuborish' : 'Tasdiqlash'}
                        </Button>
                        <Link
                            component="button"
                            type="button"
                            onClick={() => navigate('/login')}
                            className="back-link"
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
