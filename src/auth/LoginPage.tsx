import React, { type FormEvent, useState } from 'react';
import { Box, Button, Link, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/auth/LoginPage.scss';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);
    const navigate = useNavigate();

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();

        // Backend kelguncha test mantiqi
        if (username === 'fake12') {
            setIsActive(false);
        } else {
            setIsActive(true);
            console.log('Login:', { username, password });
            // Bu yerda muvaffaqiyatli bo'lsa navigatsiya bo'ladi
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="row g-0 h-100">
                    {/* Chap taraf: Branding/Rasm */}
                    <div className="col-md-6 image-section">
                        <img src="/images/coderImage.png" alt="Ecosystem" />
                        {/* Kerak bo'lsa bu yerga "Ecosystem by CoderBoys" kabi matn qo'shish mumkin */}
                    </div>

                    {/* O'ng taraf: Forma */}
                    <div className="col-md-6 form-section">
                        <Typography variant="h4" className="form-title">
                            Login
                        </Typography>

                        {/* Inactive xabari */}
                        {!isActive && (
                            <Box
                                className="error-message"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2,
                                }}
                            >
                                <i className="bi bi-exclamation-circle me-2"></i>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: '600' }}
                                >
                                    Siz active emassiz!
                                </Typography>
                            </Box>
                        )}

                        <form onSubmit={handleLogin} autoComplete="off">
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                }}
                            >
                                <TextField
                                    label="Username"
                                    variant="standard"
                                    fullWidth
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <i className="bi bi-person me-2 text-secondary"></i>
                                        ),
                                    }}
                                />

                                <TextField
                                    label="Password"
                                    type="password"
                                    variant="standard"
                                    fullWidth
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <i className="bi bi-lock me-2 text-secondary"></i>
                                        ),
                                    }}
                                />

                                {/* Dinamik Linklar */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        mt: -1,
                                    }}
                                >
                                    {!isActive ? (
                                        <Link
                                            component="button"
                                            type="button"
                                            style={{
                                                color: 'red',
                                                fontWeight: '600',
                                                textDecoration: 'underline',
                                            }}
                                            onClick={() =>
                                                navigate('/activate')
                                            }
                                            className="special-link active-link"
                                            sx={{
                                                textDecoration: 'none',
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            Activate account
                                        </Link>
                                    ) : (
                                        <Link
                                            component="button"
                                            type="button"
                                            onClick={() =>
                                                navigate('/forgot-password')
                                            }
                                            className="special-link forgot-link"
                                            sx={{
                                                textDecoration: 'underline',
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="login-btn"
                                    fullWidth
                                    disabled={!username || !password}
                                >
                                    Login
                                </Button>
                            </Box>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
