import { useEffect, useState, useCallback, useMemo, type FC } from 'react';
import { Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';

import { AuthService } from '../../services/auth.service.ts';
import type { IUserProfile } from '../../types/auth.types.ts';
import UserMenu from '../profile/UserMenu.tsx';

// Styles
import '../../styles/dashboard/Dashboard.scss';
import type { DashboardContextType } from './DashboardLayout.tsx';

const Dashboard: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState<IUserProfile | null>(() =>
        AuthService.getSavedProfile()
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const refreshProfile = useCallback(async (): Promise<void> => {
        try {
            const response = await AuthService.getProfile();
            const latestData = response.data.data;
            AuthService.saveProfile(latestData);
            setUser(latestData);
        } catch (err) {
            console.error('Update error:', err);
            if (!AuthService.isAuthenticated())
                navigate('/login', { replace: true });
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        if (!AuthService.isAuthenticated()) {
            navigate('/login', { replace: true });
        } else {
            refreshProfile();
        }
    }, [navigate, refreshProfile]);

    const handleNav = (path: string) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    // Performance uchun contextni memoize qilish
    const contextValue = useMemo(
        () => ({ user, refreshProfile }),
        [user, refreshProfile]
    );

    if (loading && !user) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    bgcolor: '#f4f8ff',
                }}
            >
                <CircularProgress
                    thickness={5}
                    size={50}
                    sx={{ color: '#0f4c81' }}
                />
            </Box>
        );
    }

    return (
        <Box className="dashboard-container">
            {/* Overlay for Mobile */}
            <div
                className={`sidebar-overlay ${isMenuOpen ? 'visible' : ''}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
                <div
                    className="sidebar-header"
                    onClick={() => handleNav('/dashboard')}
                >
                    <div className="logo-box">
                        <img
                            src="/images/logotip.png"
                            alt="Logo"
                            style={{ width: '22px' }}
                        />
                    </div>
                    <span className="logo-text">Ecosystem</span>
                </div>

                <nav className="sidebar-nav">
                    <NavItem
                        label="Asosiy Panel"
                        icon="bi-grid-1x2-fill"
                        path="/dashboard"
                        currentPath={location.pathname}
                        onClick={handleNav}
                    />
                    <NavItem
                        label="Dars jadvali"
                        icon="bi-calendar4-event"
                        path="/dashboard/schedule"
                        currentPath={location.pathname}
                        onClick={handleNav}
                    />
                    <NavItem
                        label="Loyihalar"
                        icon="bi-journal-code"
                        path="/dashboard/projects"
                        currentPath={location.pathname}
                        onClick={handleNav}
                    />
                    <NavItem
                        label="Xabarlar"
                        icon="bi-chat-left-text"
                        path="/dashboard/messages"
                        currentPath={location.pathname}
                        onClick={handleNav}
                    />

                    <div className="nav-divider" />

                    <NavItem
                        label="Sozlamalar"
                        icon="bi-gear"
                        path="/dashboard/settings"
                        currentPath={location.pathname}
                        onClick={handleNav}
                    />
                </nav>
            </aside>

            {/* Main Content Area */}
            <Box className="main-wrapper">
                <header className="navbar-custom">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            sx={{
                                display: { lg: 'none' },
                                mr: 2,
                                color: '#0f4c81',
                            }}
                        >
                            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </IconButton>
                        <Typography variant="h5" className="brand-name">
                            Panel
                        </Typography>
                    </Box>

                    <UserMenu user={user} />
                </header>

                <main className="content-body">
                    <Outlet
                        context={contextValue satisfies DashboardContextType}
                    />
                </main>
            </Box>
        </Box>
    );
};

// --- Sub-component for Nav Items ---
interface NavItemProps {
    label: string;
    icon: string;
    path: string;
    currentPath: string;
    onClick: (path: string) => void;
}

const NavItem: FC<NavItemProps> = ({
    label,
    icon,
    path,
    currentPath,
    onClick,
}) => {
    const active = currentPath === path;
    return (
        <button
            type="button"
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => onClick(path)}
        >
            <i className={`bi ${icon}`}></i>
            <p>{label}</p>
        </button>
    );
};

export default Dashboard;
