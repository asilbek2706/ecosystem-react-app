import { type FC, useState } from 'react';
import {
    Grid,
    TextField,
    Button,
    Typography,
    Box,
    InputAdornment,
    IconButton,
} from '@mui/material';
import {
    Lock,
    Visibility,
    VisibilityOff,
    ShieldOutlined,
} from '@mui/icons-material';
import type { IPasswordSettingsProps } from '../../types/profile.ts';

export const PasswordSettings: FC<IPasswordSettingsProps> = ({
    formData,
    onChange,
    onSubmit,
    loading,
}) => {
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);

    return (
        <Box component="form" onSubmit={onSubmit} className="fade-in">
            <Typography variant="h6" className="section-title">
                Xavfsizlik sozlamalari
            </Typography>
            <Typography variant="body2" className="section-subtitle">
                Hisobingiz xavfsizligini ta'minlash uchun kuchli paroldan
                foydalaning.
            </Typography>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        type={showOld ? 'text' : 'password'}
                        label="Joriy parol"
                        name="old_password"
                        value={formData.old_password}
                        onChange={onChange}
                        required
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action" fontSize="small" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowOld(!showOld)}
                                            edge="end"
                                        >
                                            {showOld ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type={showNew ? 'text' : 'password'}
                        label="Yangi parol"
                        name="new_password"
                        value={formData.new_password}
                        onChange={onChange}
                        required
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ShieldOutlined
                                            color="primary"
                                            fontSize="small"
                                        />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowNew(!showNew)}
                                            edge="end"
                                        >
                                            {showNew ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="password"
                        label="Yangi parolni tasdiqlang"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={onChange}
                        required
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: 'rgba(255, 152, 0, 0.05)',
                            borderLeft: '4px solid #ff9800',
                            borderRadius: '4px',
                            mb: 2,
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="warning.dark"
                            sx={{ display: 'block' }}
                        >
                            • Parol kamida 8 ta belgidan iborat bo'lishi kerak.
                        </Typography>
                        <Typography
                            variant="caption"
                            color="warning.dark"
                            sx={{ display: 'block' }}
                        >
                            • Katta-kichik harflar va raqamlardan foydalanish
                            tavsiya etiladi.
                        </Typography>
                    </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="warning"
                        className="submit-btn"
                        disabled={loading}
                    >
                        Parolni yangilash
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
