import { type FC, type ReactNode, useMemo } from 'react';
import {
    Avatar,
    Box,
    Chip,
    Divider,
    Grid,
    Paper,
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

interface ProfileViewProps {
    user: IUserProfile | null;
}

interface ProfileDetail {
    label: string;
    value: string;
    icon: ReactNode;
}

const ProfileView: FC<ProfileViewProps> = ({ user }) => {
    const avatarSrc = useMemo((): string | undefined => {
        if (!user) return undefined;
        const photo = user.avatar || user.profile_image_url;

        if (!photo || photo === 'Not set' || photo.includes('default-avatar')) {
            return undefined;
        }

        return photo.startsWith('http')
            ? photo
            : `${api}${photo.startsWith('/') ? '' : '/'}${photo}`;
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

    if (!user) return null;

    const profileDetails: ProfileDetail[] = [
        {
            label: 'Foydalanuvchi nomi',
            value: user.username || 'Kiritilmagan',
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
                        {profileDetails.map((item, index) => (
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
                        ))}
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default ProfileView;
