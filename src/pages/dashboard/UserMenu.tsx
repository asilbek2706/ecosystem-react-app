import { type FC, memo, type MouseEvent, useState } from 'react';
import {
    Avatar,
    Badge,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/auth.service.ts';
import type { IUserProfile } from '../../types/auth.types.ts';
import '../../styles/dashboard/UserMenu.scss';

interface UserMenuProps {
    user: IUserProfile | null;
}

const UserMenu: FC<UserMenuProps> = memo(({ user }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

    const handleLogout = () => {
        handleCloseMenu();
        AuthService.logout();
        navigate('/login');
    };

    const getAvatarImage = () => {
        if (!user || user.profile_image_url === 'Not set') return undefined;
        return user.profile_image_url;
    };

    const getDepartmentName = () => {
        if (user?.member_departments && user.member_departments.length > 0) {
            return user.member_departments[0].name;
        }
        return user?.role === 'dev' ? 'Frontend Developer' : user?.role;
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
                style={{ cursor: 'pointer' }}
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
                <Avatar
                    className="user-avatar"
                    sx={{ bgcolor: 'primary.main' }}
                    src={getAvatarImage()}
                >
                    {user?.first_name?.charAt(0) || 'U'}
                </Avatar>
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
                        minWidth: '180px',
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
                <MenuItem
                    onClick={handleLogout}
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
