import React, { type FormEvent, useState } from 'react';
import { Box, TextField, Button, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/auth/LoginPage.scss';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);
    const navigate = useNavigate();

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();

        if (username === 'user123') {
            setIsActive(false);
        } else {
            setIsActive(true);
            console.log('Login:', { username, password });
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="row g-0 h-100">
                    {/* Chap taraf: Rasm */}
                    <div className="col-md-6 image-section">
                        <img src="/images/coderImage.png" alt="Ecosystem" />
                    </div>

                    <div className="col-md-6 form-section">
                        <Typography variant="h4" className="form-title">
                            Log In
                        </Typography>

                        {/* Inactive xabari - Faqat aktiv bo'lmasa chiqadi */}
                        {!isActive && (
                            <Typography
                                color="error"
                                variant="body2"
                                sx={{
                                    mb: 2,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}
                            >
                                <i className="bi bi-exclamation-circle me-2"></i>
                                Siz active emassiz!
                            </Typography>
                        )}

                        <form onSubmit={handleLogin}>
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
                                    InputProps={{
                                        startAdornment: (
                                            <i className="bi bi-person me-2 text-secondary"></i>
                                        ),
                                        endAdornment: (
                                            <i className="bi bi-file-text text-light"></i>
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
                                    InputProps={{
                                        startAdornment: (
                                            <i className="bi bi-lock me-2 text-secondary"></i>
                                        ),
                                        endAdornment: (
                                            <i className="bi bi-file-lock text-light"></i>
                                        ),
                                    }}
                                />

                                {/* Linklar qismi: Remember me o'rniga faqat aktivatsiya yoki forgot password */}
                                <div className="d-flex justify-content-end align-items-center">
                                    <div className="d-flex gap-2">
                                        {!isActive ? (
                                            <Link
                                                component="button"
                                                type="button"
                                                onClick={() =>
                                                    navigate('/activate')
                                                }
                                                className="special-link active-link d-flex justify-content-start"
                                                sx={{
                                                    color: '#ff5252',
                                                    fontWeight: 'bold',
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
                                                className="special-link"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="login-btn"
                                    fullWidth
                                >
                                    Log in
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
