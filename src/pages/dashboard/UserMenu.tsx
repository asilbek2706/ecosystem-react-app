import { type FC, memo, type MouseEvent, useState } from 'react';
import {
    Avatar,
    Badge,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LogoutService } from '../../services/logout.service.ts'; // Alohida service
import type { IUserProfile } from '../../types/auth.types.ts';
import '../../styles/dashboard/UserMenu.scss';

interface UserMenuProps {
    user: IUserProfile | null;
}

const UserMenu: FC<UserMenuProps> = memo(({ user }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

    const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleProfileClick = () => {
        handleCloseMenu();
        navigate('/dashboard/profile');
    };

    const handleLogout = async () => {
        handleCloseMenu();
        setIsLoggingOut(true); // Yuklanish holatini yoqish

        try {
            // Server-side logoutni chaqiramiz
            await LogoutService.handleLogout();
        } catch (error) {
            console.error('Logout process error:', error);
        } finally {
            setIsLoggingOut(false);
            // Har qanday holatda foydalanuvchini login sahifasiga yo'naltiramiz
            navigate('/login', { replace: true });
        }
    };

    const getAvatarImage = () => {
        if (!user || user.profile_image_url === 'Not set') return undefined;
        return user.profile_image_url;
    };

    const getDepartmentName = () => {
        if (user?.member_departments && user.member_departments.length > 0) {
            return user.member_departments[0].name;
        }

        // Rollarni chiroyliroq ko'rsatish mantiqi
        const roles: Record<string, string> = {
            dev: 'Dasturchi',
            superadmin: 'Admin',
            manager: 'Manager',
        };

        return roles[user?.role || ''] || user?.role || 'Foydalanuvchi';
    };

    return (
        <div className="navbar-actions">
            <IconButton className="action-btn">
                <Badge badgeContent={4} color="error">
                    <i className="bi bi-bell"></i>
                </Badge>
            </IconButton>

            <div
                className="user-account"
                onClick={handleOpenMenu}
                style={{ cursor: isLoggingOut ? 'not-allowed' : 'pointer' }}
            >
                <div className="user-info">
                    <Typography className="name">
                        {user
                            ? `${user.first_name} ${user.last_name}`
                            : 'Yuklanmoqda...'}
                    </Typography>
                    <Typography className="role">
                        {getDepartmentName()}
                    </Typography>
                </div>
                <Box sx={{ position: 'relative' }}>
                    <Avatar
                        className="user-avatar"
                        sx={{ bgcolor: 'primary.main' }}
                        src={getAvatarImage()}
                    >
                        {user?.first_name?.charAt(0) || 'U'}
                    </Avatar>
                    {isLoggingOut && (
                        <CircularProgress
                            size={40}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 1,
                            }}
                        />
                    )}
                </Box>
            </div>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                sx={{ mt: 1.5 }}
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        minWidth: '200px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    },
                }}
            >
                <MenuItem onClick={handleProfileClick} sx={{ py: 1.2 }}>
                    <ListItemIcon>
                        <i className="bi bi-person"></i>
                    </ListItemIcon>
                    Profil
                </MenuItem>

                <MenuItem onClick={handleCloseMenu} sx={{ py: 1.2 }}>
                    <ListItemIcon>
                        <i className="bi bi-gear"></i>
                    </ListItemIcon>
                    Sozlamalar
                </MenuItem>

                <div
                    style={{
                        height: '1px',
                        backgroundColor: '#eee',
                        margin: '8px 0',
                    }}
                />

                <MenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    sx={{ color: '#d32f2f', py: 1.2 }}
                >
                    <ListItemIcon>
                        <i
                            className="bi bi-box-arrow-right"
                            style={{ color: '#d32f2f' }}
                        ></i>
                    </ListItemIcon>
                    Chiqish
                </MenuItem>
            </Menu>
        </div>
    );
});

export default UserMenu;
