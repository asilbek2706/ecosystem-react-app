import { useEffect, useState, type FC } from 'react';
import {
    Box,
    Typography,
    Avatar,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    ListItemIcon,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard/Dashboard.scss';
import { AuthService } from '../../services/auth.service.ts';
import type { IUserProfile } from '../../types/auth.types.ts';

const Dashboard: FC = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [user, setUser] = useState<IUserProfile | null>(null);

    useEffect(() => {
        const profile = AuthService.getSavedProfile();

        if (profile) {
            setUser(profile);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
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
        return user?.role === 'dev'
            ? 'Frontend Developer'
            : user?.role || 'Foydalanuvchi';
    };

    return (
        <Box className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-box">
                        <img
                            src="/images/favicon.png"
                            alt="Logo"
                            style={{ width: '24px' }}
                        />
                    </div>
                    <span className="logo-text">Ecosystem</span>
                </div>

                <nav className="sidebar-nav">
                    <button className="nav-item active">
                        <i className="bi bi-grid-1x2-fill"></i>
                        <p>Asosiy Panel</p>
                    </button>
                    <button className="nav-item">
                        <i className="bi bi-calendar4-event"></i>
                        <p>Dars jadvali</p>
                    </button>
                    <button className="nav-item">
                        <i className="bi bi-journal-code"></i>
                        <p>Loyihalar</p>
                    </button>
                    <button className="nav-item">
                        <i className="bi bi-chat-left-text"></i>
                        <p>Xabarlar</p>
                    </button>
                    <div className="nav-divider"></div>
                    <button className="nav-item">
                        <i className="bi bi-gear"></i>
                        <p>Sozlamalar</p>
                    </button>
                </nav>
            </aside>

            <Box className="main-wrapper">
                <header className="navbar-custom">
                    <Typography variant="h5" className="brand-name">
                        Ecosystem
                    </Typography>

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
                            transformOrigin={{
                                horizontal: 'right',
                                vertical: 'top',
                            }}
                            anchorOrigin={{
                                horizontal: 'right',
                                vertical: 'bottom',
                            }}
                            sx={{ mt: 1.5 }}
                            PaperProps={{
                                sx: {
                                    borderRadius: '12px',
                                    minWidth: '180px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                },
                            }}
                        >
                            <MenuItem
                                onClick={handleCloseMenu}
                                sx={{ py: 1.2 }}
                            >
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
                </header>

                <main className="content-body">
                    <Box className="welcome-section" sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight="800" gutterBottom>
                            Xayrli kun, {user?.first_name || 'Foydalanuvchi'}!
                            👋
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Bugungi rejalaringizni tekshirib ko'ring.
                        </Typography>
                    </Box>

                    <div className="empty-state">
                        <Typography variant="h6">
                            Dashboardingiz tayyor.
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Bu yerda tez orada sizning statistikangiz ko'rinadi.
                        </Typography>
                    </div>
                </main>
            </Box>
        </Box>
    );
};

export default Dashboard;
