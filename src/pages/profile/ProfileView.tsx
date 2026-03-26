import { type FC, type ReactNode, useEffect, useMemo, useState } from 'react';
import axios, { AxiosError } from 'axios';
import {
    Alert,
    Avatar,
    Box,
    Chip,
    Divider,
    Grid,
    Paper,
    Skeleton,
    Typography,
} from '@mui/material';
import {
    CalendarCheck,
    Envelope,
    Github,
    PersonBadge,
    ShieldCheck,
    Telegram,
    Telephone,
} from 'react-bootstrap-icons';

import type { IUserProfile } from '../../types/auth.types.ts';
import '../../styles/dashboard/ProfileView.scss';
import api from '../../api/axios.tsx';

// --- Interfaces ---
interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: string;
}

interface ApiErrorResponse {
    message?: string;
    detail?: string;
    errors?: Record<string, string[]>;
}

interface ProfileDetail {
    label: string;
    value: string;
    icon: ReactNode;
}

const BASE_URL = 'https://eco.runcdc.uz';

const ProfileView: FC = () => {
    const [user, setUser] = useState<IUserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // --- Data Fetching ---
    const fetchProfile = async (): Promise<void> => {
        try {
            setLoading(true);
            const response =
                await api.get<ApiResponse<IUserProfile>>('/auth/profile/');

            // Backend javobiga qarab response.data yoki response.data.data
            const userData = response.data.data || response.data;
            setUser(userData as IUserProfile);
            setError(null);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<ApiErrorResponse>;
                const errorMessage =
                    axiosError.response?.data?.message ||
                    axiosError.response?.data?.detail ||
                    "Profil ma'lumotlarini yuklab bo'lmadi";
                setError(errorMessage);
            } else {
                setError('Kutilmagan xatolik yuz berdi');
            }
            console.error('Profile fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        fetchProfile().then(() => {
            if (!isMounted) return;
        });

        return () => {
            isMounted = false;
        };
    }, []);

    // --- Helpers ---
    const avatarSrc = useMemo((): string | undefined => {
        if (!user) return undefined;
        const photo = user.avatar || user.profile_image_url;

        if (!photo || photo === 'Not set' || photo.includes('default-avatar')) {
            return undefined;
        }

        return photo.startsWith('http')
            ? photo
            : `${BASE_URL}${photo.startsWith('/') ? '' : '/'}${photo}`;
    }, [user]);

    const getRoleLabel = (role: string | undefined): string => {
        if (!role) return 'Foydalanuvchi';

        const roles: Record<string, string> = {
            superadmin: 'Bosh Administrator',
            developer: 'Dasturchi',
            dev: 'Dasturchi',
            manager: 'Loyiha Menejeri',
        };

        return roles[role.toLowerCase().trim()] || role;
    };

    // --- Render Logic ---
    if (loading) return <ProfileSkeleton />;

    if (error)
        return (
            <Box p={3} className="fade-in">
                <Alert
                    severity="error"
                    variant="outlined"
                    sx={{ borderRadius: '12px', fontWeight: 600 }}
                >
                    {error}
                </Alert>
            </Box>
        );

    if (!user) return null;

    const profileDetails: ProfileDetail[] = [
        {
            label: 'Foydalanuvchi nomi',
            value: user.username ? `${user.username}` : 'Kiritilmagan',
            icon: <PersonBadge />,
        },
        {
            label: 'Email manzil',
            value: user.email,
            icon: <Envelope />,
        },
        {
            label: 'Telefon',
            value:
                user.phone_number && user.phone_number !== 'Not set'
                    ? user.phone_number
                    : 'Kiritilmagan',
            icon: <Telephone />,
        },
        {
            label: 'Telegram ID',
            value:
                user.telegram_id && user.telegram_id !== 'Not set'
                    ? user.telegram_id
                    : 'Ulanmagan',
            icon: <Telegram />,
        },
        {
            label: 'GitHub',
            value:
                user.github_username && user.github_username !== 'Not set'
                    ? user.github_username
                    : 'Ulanmagan',
            icon: <Github />,
        },
        {
            label: "Ro'yxatdan o'tgan sana",
            value: user.date_joined
                ? new Date(user.date_joined).toLocaleDateString('uz-UZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                  })
                : "Noma'lum",
            icon: <CalendarCheck />,
        },
    ];

    return (
        <Box className="profile-view-wrapper fade-in">
            <Paper className="profile-card" elevation={0}>
                <Box className="profile-banner">
                    <Chip
                        icon={<ShieldCheck size={14} color="white" />}
                        label="Tasdiqlangan Profil"
                        className="status-chip"
                    />
                </Box>

                <Box className="profile-body">
                    <Box className="avatar-section">
                        <Avatar src={avatarSrc} className="profile-avatar">
                            {user.first_name?.[0] || 'U'}
                        </Avatar>
                        <Box className="user-info-header">
                            <Typography variant="h4" className="fullname">
                                {user.first_name} {user.last_name}
                            </Typography>
                            <Typography className="role-text">
                                {getRoleLabel(user.role)}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 4, opacity: 0.5 }} />

                    <Grid container spacing={3}>
                        {profileDetails.map(
                            (item: ProfileDetail, index: number) => (
                                <Grid size={{ xs: 12, md: 6 }} key={index}>
                                    <Box className="info-card">
                                        <div className="icon-wrapper">
                                            {item.icon}
                                        </div>
                                        <div className="text-wrapper">
                                            <Typography className="label">
                                                {item.label}
                                            </Typography>
                                            <Typography className="value">
                                                {item.value}
                                            </Typography>
                                        </div>
                                    </Box>
                                </Grid>
                            )
                        )}
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

// --- Skeleton Loader ---
const ProfileSkeleton: FC = () => (
    <Box className="profile-view-wrapper">
        <Skeleton
            variant="rectangular"
            height={160}
            sx={{ borderRadius: '24px 24px 0 0' }}
        />
        <Box sx={{ p: 4, mt: -6 }}>
            <Skeleton
                variant="circular"
                width={140}
                height={140}
                sx={{ border: '6px solid white' }}
            />
            <Skeleton variant="text" width="40%" height={60} sx={{ mt: 2 }} />
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {Array.from({ length: 6 }).map((_, i: number) => (
                    <Grid size={{ xs: 12, md: 6 }} key={i}>
                        <Skeleton
                            variant="rounded"
                            height={80}
                            sx={{ borderRadius: '18px' }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    </Box>
);

export default ProfileView;
