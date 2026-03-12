import React, { useState, type FormEvent } from 'react';
import { Box, TextField, Button, Typography, Link } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/auth/AuthAction.scss';

const AuthAction: React.FC = () => {
    const [step, setStep] = useState(1); // 1: Username, 2: OTP
    const [username, setUsername] = useState('');
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const isActivation = location.pathname.includes('activate');

    const handleSendCode = (e: FormEvent) => {
        e.preventDefault();
        console.log(
            `${isActivation ? 'Aktivatsiya' : 'Tiklash'} kodi yuborildi:`,
            username
        );
        setStep(2);
    };

    const handleVerifyCode = (e: FormEvent) => {
        e.preventDefault();
        console.log('Kod tasdiqlandi:', code);
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
                        {isActivation
                            ? 'Akkauntni faollashtirish'
                            : 'Parolni tiklash'}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                    >
                        {step === 1
                            ? 'Tizimdagi username-ni kiriting, biz emailga kod yuboramiz.'
                            : 'Emailingizga yuborilgan 6 xonali kodni kiriting.'}
                    </Typography>
                </div>

                <form onSubmit={step === 1 ? handleSendCode : handleVerifyCode}>
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
                                        <i className="bi bi-person me-2"></i>
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
                                        <i className="bi bi-shield-lock me-2"></i>
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
                            onClick={() =>
                                step === 2 ? setStep(1) : navigate('/login')
                            }
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

export default AuthAction;
