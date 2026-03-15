import { type FC } from 'react';
import { Box, Typography, Avatar, Paper, Divider, Grid } from '@mui/material'; // Grid2 ishlatish tavsiya etiladi
import type { IUserProfile } from '../../types/auth.types.ts';
import '../../styles/dashboard/ProfileView.scss';

interface ProfileViewProps {
    user: IUserProfile | null;
}

const ProfileView: FC<ProfileViewProps> = ({ user }) => {
    if (!user) return null;

    const getRoleLabel = (role: string | undefined) => {
        if (!role) return 'Foydalanuvchi';
        const normalizedRole = role.toLowerCase().trim();

        const roles: Record<string, string> = {
            superadmin: 'Super Admin',
            manager: 'Manager',
            simpleuser: 'Foydalanuvchi',
            developer: 'Dasturchi',
            dev: 'Dasturchi',
            'chief executive officer': 'CEO (Rahbar)',
        };
        return roles[normalizedRole] || role;
    };

    const profileDetails = [
        { label: 'Username', value: user.username, icon: 'bi-person-badge' },
        { label: 'Email', value: user.email, icon: 'bi-envelope' },
        {
            label: 'Telefon',
            value:
                user.phone_number !== 'Not set'
                    ? user.phone_number
                    : 'Kiritilmagan',
            icon: 'bi-telephone',
        },
        {
            label: 'Telegram ID',
            value:
                user.telegram_id !== 'Not set' ? user.telegram_id : 'Ulanmagan',
            icon: 'bi-telegram',
        },
        {
            label: 'GitHub',
            value:
                user.github_username !== 'Not set'
                    ? user.github_username
                    : 'Ulanmagan',
            icon: 'bi-github',
        },
        {
            label: "Ro'yxatdan o'tgan sana",
            value: user.date_joined
                ? new Date(user.date_joined).toLocaleDateString('uz-UZ')
                : "Noma'lum",
            icon: 'bi-calendar-check',
        },
    ];

    return (
        <Box className="profile-view-container">
            <Paper className="profile-card" elevation={0}>
                <Box className="profile-header-bg" />
                <Box className="profile-content">
                    <Avatar
                        src={
                            user.profile_image_url === 'Not set'
                                ? undefined
                                : user.profile_image_url
                        }
                        className="large-avatar"
                        sx={{
                            width: 120,
                            height: 120,
                            border: '4px solid white',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        }}
                    >
                        {user.first_name?.charAt(0) || 'U'}
                    </Avatar>

                    <Typography variant="h5" fontWeight="700" sx={{ mt: 2 }}>
                        {user.first_name} {user.last_name}
                    </Typography>

                    <Typography className="user-role-badge">
                        {getRoleLabel(user.role)}
                    </Typography>

                    <Divider sx={{ my: 3, width: '100%' }} />

                    <Grid container spacing={3}>
                        {profileDetails.map((item, index) => (
                            <Grid size={{ xs: 12, sm: 6 }} key={index}>
                                <Box className="info-item">
                                    <i
                                        className={`bi ${item.icon} text-primary`}
                                    ></i>
                                    <Box>
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                        >
                                            {item.label}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            fontWeight="600"
                                        >
                                            {item.value}
                                        </Typography>
                                    </Box>
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
