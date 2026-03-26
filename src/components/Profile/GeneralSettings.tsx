import {
    Box,
    Button,
    Grid,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import { Badge, Email, Phone, Telegram } from '@mui/icons-material';
import type { FC } from 'react';
import type { IGeneralSettingsProps } from '../../types/profile.ts';

export const GeneralSettings: FC<IGeneralSettingsProps> = ({
    formData,
    onChange,
    onSubmit,
    loading,
}) => {
    return (
        <Box component="form" onSubmit={onSubmit} className="fade-in">
            <Typography variant="h6" className="section-title">
                Asosiy ma'lumotlar
            </Typography>
            <Typography variant="body2" className="section-subtitle">
                Mijozlarga ko'rinadigan ma'lumotlaringiz
            </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Ism"
                        name="first_name"
                        value={formData.first_name}
                        onChange={onChange}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Badge
                                            color="primary"
                                            fontSize="small"
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Familiya"
                        name="last_name"
                        value={formData.last_name}
                        onChange={onChange}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email
                                            color="primary"
                                            fontSize="small"
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Telefon"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={onChange}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone
                                            color="primary"
                                            fontSize="small"
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Telegram ID"
                        name="telegram_id"
                        value={formData.telegram_id}
                        onChange={onChange}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Telegram
                                            color="primary"
                                            fontSize="small"
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        className="submit-btn"
                        disabled={loading}
                    >
                        O'zgarishlarni saqlash
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
