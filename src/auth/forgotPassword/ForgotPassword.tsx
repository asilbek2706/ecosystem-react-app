import React, { useState, type FormEvent } from 'react';
import { Box, TextField, Button, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.scss';

const ForgotPassword: React.FC = () => {
    const [step, setStep] = useState(1); // 1: Username, 2: OTP (Kod)
    const [username, setUsername] = useState('');
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const handleSendCode = (e: FormEvent) => {
        e.preventDefault();
        console.log('Kod yuborildi:', username);
        setStep(2); // Keyingi bosqichga o'tish
    };

    const handleVerifyCode = (e: FormEvent) => {
        e.preventDefault();
        console.log('Kod tasdiqlandi:', code);
        navigate('/login');
    };

    return (
        <div className="forgot-container">
            <div className="forgot-card shadow">
                <div className="text-center mb-4">
                    <img
                        src="/images/lototip.png"
                        alt="Logo"
                        className="forgot-logo"
                    />
                    <Typography variant="h5" fontWeight="700">
                        {step === 1 ? 'Akkauntni tiklash' : 'Kodni kiriting'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {step === 1
                            ? 'Admin bergan username-ni kiriting, biz emailga kod yuboramiz.'
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

export default ForgotPassword;
