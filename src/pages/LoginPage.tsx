import {
    useEffect,
    useState,
    type ChangeEvent,
    type FC,
    type FormEvent,
} from 'react';
import '../styles/auth/LoginPage.scss';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import type { AxiosError } from 'axios';
import {
    Alert,
    Box,
    Button,
    Link,
    CircularProgress,
    TextField,
    Typography,
    InputAdornment,
} from '@mui/material';
import WelcomeLoader from '../components/WelcomeLoader';

interface ApiErrorResponse {
    detail?: string | string[];
    message?: string;
}

const LoginPage: FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [fullName, setFullName] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        if (error) setError(null);
    }, [username, password]);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setIsActive(true);

        try {
            const response = await AuthService.login({
                username: username.trim(),
                password: password,
            });

            if (response.status === 201 || response.status === 200) {
                AuthService.saveTokens(
                    response.data.access,
                    response.data.refresh
                );

                const profileRes = await AuthService.getProfile();
                const userData = profileRes.data.data;

                AuthService.saveProfile(userData);

                setFullName(`${userData.first_name} ${userData.last_name}`);
                setIsSuccess(true);

                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiErrorResponse>;
            const errorData = axiosError.response?.data;
            const status = axiosError.response?.status;

            let detailMsg = '';
            if (Array.isArray(errorData?.detail)) {
                detailMsg = errorData.detail[0];
            } else {
                detailMsg =
                    errorData?.detail ||
                    errorData?.message ||
                    'Xatolik yuz berdi!';
            }

            if (status === 400 || status === 401 || status === 403) {
                const isNotActive =
                    detailMsg.toLowerCase().includes('active') ||
                    detailMsg.toLowerCase().includes('faol');

                if (isNotActive) {
                    setIsActive(false);
                    setError(
                        'Siz active emassiz! Iltimos, profilingizni faollashtiring.'
                    );
                } else {
                    setError(detailMsg || 'Username yoki parol noto‘g‘ri!');
                }
            } else {
                setError('Tizimga kirishda xatolik yuz berdi!');
            }
            setLoading(false);
        }
    };

    if (isSuccess) {
        return <WelcomeLoader name={fullName} />;
    }

    return (
        <div className="login-container">
            <div className="login-card shadow-lg">
                <div className="row g-0 h-100">
                    <div className="col-md-6 image-section d-none d-md-flex">
                        <img src="/images/coderImage.png" alt="Ecosystem" />
                    </div>

                    <div className="col-md-6 form-section">
                        <Typography
                            variant="h4"
                            className="form-title"
                            fontWeight="700"
                        >
                            Login
                        </Typography>

                        {error && (
                            <Alert
                                severity="error"
                                sx={{ mb: 2, borderRadius: '10px' }}
                                variant="filled"
                            >
                                {error}
                            </Alert>
                        )}

                        <form
                            onSubmit={handleLogin}
                            noValidate
                            autoComplete="off"
                        >
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
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => setUsername(e.target.value)}
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <i className="bi bi-person me-2 text-primary"></i>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    label="Password"
                                    type="password"
                                    variant="standard"
                                    fullWidth
                                    value={password}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => setPassword(e.target.value)}
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <i className="bi bi-lock me-2 text-primary"></i>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

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
                                            onClick={() =>
                                                navigate('/activate')
                                            }
                                            sx={{
                                                color: '#d32f2f',
                                                fontWeight: '700',
                                                fontSize: '0.85rem',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
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
                                            sx={{
                                                fontSize: '0.85rem',
                                                color: 'text.secondary',
                                                cursor: 'pointer',
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
                                    disabled={
                                        loading || !username.trim() || !password
                                    }
                                    sx={{
                                        minHeight: '48px',
                                        borderRadius: '10px',
                                        fontWeight: '600',
                                        textTransform: 'none',
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress
                                            size={24}
                                            color="inherit"
                                        />
                                    ) : (
                                        'Login'
                                    )}
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
