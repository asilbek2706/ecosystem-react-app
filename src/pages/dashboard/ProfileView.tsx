import { type FC } from 'react';
import { Box, Typography, Avatar, Paper, Divider, Grid } from '@mui/material';
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
            superadmin: 'Admin',
            manager: 'Manager',
            simpleuser: 'Oddiy foydalanuvchi',
            developer: 'Developer',
            dev: 'Developer',
            'chief executive officer': 'Chief Executive Officer',
        };

        return roles[normalizedRole] || role;
    };

    const profileDetails = [
        { label: 'Username', value: user.username, icon: 'bi-person-badge' },
        { label: 'Email', value: user.email, icon: 'bi-envelope' },
        { label: 'Telefon', value: user.phone_number, icon: 'bi-telephone' },
        { label: 'Telegram ID', value: user.telegram_id, icon: 'bi-telegram' },
        { label: 'GitHub', value: user.github_username, icon: 'bi-github' },
        {
            label: "A'zo bo'lgan sana",
            value: user.date_joined
                ? new Date(user.date_joined).toLocaleDateString()
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
                            bgcolor: 'primary.main',
                            width: 120,
                            height: 120,
                        }}
                    >
                        {user.first_name?.charAt(0) || 'U'}
                    </Avatar>

                    <Typography variant="h5" className="user-full-name">
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
                                    <i className={`bi ${item.icon}`}></i>
                                    <Box>
                                        <Typography className="label">
                                            {item.label}
                                        </Typography>
                                        <Typography className="value">
                                            {item.value || 'Kiritilmagan'}
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
