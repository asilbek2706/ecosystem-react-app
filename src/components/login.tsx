import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    InputAdornment,
    IconButton,
    Alert,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    LockOutlined,
    EmailOutlined,
} from '@mui/icons-material';
import axios from 'axios';

const LoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(
                'BACKEND_SWAGGER_URL/auth/login',
                {
                    email,
                    password,
                }
            );

            const token = response.data.token;
            localStorage.setItem('token', token);

            // Muvaffaqiyatli login - Dashboardga yo'naltirish
            window.location.href = '/dashboard';
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login yoki parol xato!');
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e1e2f 0%, #0f0f1a 100%)',
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={0}
                    sx={{
                        padding: 4,
                        borderRadius: 4,
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Ecosystem
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}
                    >
                        Tizimga kirish uchun ma'lumotlarni kiriting
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlined
                                            sx={{
                                                color: 'rgba(255,255,255,0.7)',
                                            }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                            sx={textFieldStyle}
                        />

                        <TextField
                            fullWidth
                            label="Parol"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined
                                            sx={{
                                                color: 'rgba(255,255,255,0.7)',
                                            }}
                                        />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            edge="end"
                                        >
                                            {showPassword ? (
                                                <VisibilityOff
                                                    sx={{ color: '#fff' }}
                                                />
                                            ) : (
                                                <Visibility
                                                    sx={{ color: '#fff' }}
                                                />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={textFieldStyle}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 3,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                borderRadius: 2,
                                background:
                                    'linear-gradient(45deg, #007bff 30%, #00d2ff 90%)',
                                boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
                            }}
                        >
                            Kirish
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

// MUI inputlarini custom qilish uchun style
const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
        color: '#fff',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
        '&.Mui-focused fieldset': { borderColor: '#007bff' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
};

export default LoginPage;
