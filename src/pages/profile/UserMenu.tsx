import { type FC, memo, type MouseEvent, useState, useMemo } from 'react';
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
    Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    PersonOutline,
    LogoutOutlined,
    NotificationsNoneOutlined,
} from '@mui/icons-material';

import { LogoutService } from '../../services/logout.service.ts';
import type { IUserProfile } from '../../types/auth.types.ts';
import '../../styles/dashboard/UserMenu.scss';

// Backend URL ni o'zingiznikiga almashtiring
const API_URL = import.meta.env.VITE_API_URL || 'https://api.ecosystem.uz';

interface UserMenuProps {
    user: IUserProfile | null;
}

const UserMenu: FC<UserMenuProps> = memo(({ user }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

    // --- Rasm mantiqini to'g'irlash (Master Logic) ---
    const avatarSrc = useMemo(() => {
        if (!user) return undefined;

        // Backenddan qaysi nomda kelsa ham ushlab olamiz
        const rawPath = user.avatar || user.profile_image_url;

        if (
            !rawPath ||
            rawPath === 'Not set' ||
            rawPath.includes('default-avatar')
        ) {
            return undefined;
        }

        // Agar path to'liq URL bo'lmasa, API_URL ni qo'shamiz
        if (rawPath.startsWith('http')) {
            return rawPath;
        }

        // Relative path bo'lsa (masalan: /media/avatars/user.jpg)
        return `${API_URL}${rawPath.startsWith('/') ? '' : '/'}${rawPath}`;
    }, [user]);

    const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => setAnchorEl(null);

    const handleLogout = async () => {
        handleCloseMenu();
        setIsLoggingOut(true);
        try {
            await LogoutService.handleLogout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
            navigate('/login', { replace: true });
        }
    };

    const displayRole = () => {
        if (user?.member_departments?.length)
            return user.member_departments[0].name;
        const roles: Record<string, string> = {
            dev: 'Dasturchi',
            superadmin: 'Admin',
            manager: 'Manager',
        };
        return roles[user?.role || ''] || 'Foydalanuvchi';
    };

    return (
        <div className="navbar-actions">
            <Tooltip title="Bildirishnomalar">
                <IconButton className="action-btn">
                    <Badge color="error" variant="dot">
                        <NotificationsNoneOutlined />
                    </Badge>
                </IconButton>
            </Tooltip>

            <div
                className="user-account"
                onClick={handleOpenMenu}
                style={{ cursor: isLoggingOut ? 'wait' : 'pointer' }}
            >
                <div className="user-info">
                    <Typography className="name">
                        {user
                            ? `${user.first_name} ${user.last_name}`
                            : 'Yuklanmoqda...'}
                    </Typography>
                    <Typography className="role">{displayRole()}</Typography>
                </div>

                <Box className="avatar-wrapper">
                    <Avatar
                        className="user-avatar"
                        src={avatarSrc}
                        sx={{
                            bgcolor: 'primary.main',
                            transition: '0.3s',
                            opacity: isLoggingOut ? 0.5 : 1,
                        }}
                    >
                        {user?.first_name?.charAt(0) || 'U'}
                    </Avatar>

                    {isLoggingOut && (
                        <CircularProgress
                            size={44}
                            thickness={2}
                            sx={{
                                position: 'absolute',
                                top: -2,
                                left: -2,
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
                className="user-menu-root"
                PaperProps={{ className: 'user-menu-paper' }}
                disableScrollLock
            >
                <Box
                    sx={{
                        px: 2,
                        py: 1,
                        borderBottom: '1px solid #f1f5f9',
                        mb: 1,
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        Tizimga kirilgan:
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                        {user?.email}
                    </Typography>
                </Box>

                <MenuItem
                    onClick={() => {
                        handleCloseMenu();
                        navigate('/dashboard/profile');
                    }}
                >
                    <ListItemIcon>
                        <PersonOutline fontSize="small" />
                    </ListItemIcon>
                    Profil
                </MenuItem>

                <MenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="logout-item"
                >
                    <ListItemIcon>
                        <LogoutOutlined fontSize="small" color="error" />
                    </ListItemIcon>
                    Chiqish
                </MenuItem>
            </Menu>
        </div>
    );
});

export default UserMenu;
