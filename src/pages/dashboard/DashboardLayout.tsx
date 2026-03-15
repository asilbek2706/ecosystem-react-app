import { useEffect, useState, useCallback, type FC } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import '../../styles/dashboard/Dashboard.scss';
import { AuthService } from '../../services/auth.service.ts';
import type { IUserProfile } from '../../types/auth.types.ts';
import UserMenu from '../profile/UserMenu.tsx';

interface NavItemProps {
    active: boolean;
    onClick: () => void;
    icon: string;
    label: string;
}

export interface DashboardContextType {
    user: IUserProfile | null;
    refreshProfile: () => Promise<void>;
}

const DashboardLayout: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState<IUserProfile | null>(() => {
        return AuthService.getSavedProfile();
    });

    const [loading, setLoading] = useState<boolean>(true);

    const refreshProfile = useCallback(async (): Promise<void> => {
        try {
            const response = await AuthService.getProfile();
            const latestData = response.data.data;

            AuthService.saveProfile(latestData);
            setUser(latestData);
        } catch (err) {
            console.error('Profilni yangilashda xatolik:', err);
            if (!AuthService.isAuthenticated()) {
                navigate('/login');
            }
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

    const handleNavClick = (path: string): void => {
        navigate(path);
    };

    const isActive = (path: string): boolean => location.pathname === path;

    if (loading && !user) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="dashboard-container">
            <aside className="sidebar">
                <div
                    className="sidebar-header"
                    onClick={() => handleNavClick('/dashboard')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="logo-box">
                        <img
                            src="/images/logotip.png"
                            alt="Logo"
                            style={{ width: '24px' }}
                        />
                    </div>
                    <span className="logo-text">Ecosystem</span>
                </div>

                <nav className="sidebar-nav">
                    <NavItem
                        active={isActive('/dashboard')}
                        onClick={() => handleNavClick('/dashboard')}
                        icon="bi-grid-1x2-fill"
                        label="Asosiy Panel"
                    />
                    <NavItem
                        active={isActive('/dashboard/schedule')}
                        onClick={() => handleNavClick('/dashboard/schedule')}
                        icon="bi-calendar4-event"
                        label="Dars jadvali"
                    />
                    <NavItem
                        active={isActive('/dashboard/projects')}
                        onClick={() => handleNavClick('/dashboard/projects')}
                        icon="bi-journal-code"
                        label="Loyihalar"
                    />
                    <NavItem
                        active={isActive('/dashboard/messages')}
                        onClick={() => handleNavClick('/dashboard/messages')}
                        icon="bi-chat-left-text"
                        label="Xabarlar"
                    />

                    <div className="nav-divider"></div>

                    <NavItem
                        active={isActive('/dashboard/settings')}
                        onClick={() => handleNavClick('/dashboard/settings')}
                        icon="bi-gear"
                        label="Sozlamalar"
                    />
                </nav>
            </aside>

            <Box className="main-wrapper">
                <header className="navbar-custom">
                    <Typography variant="h5" className="brand-name">
                        Ecosystem
                    </Typography>
                    <UserMenu user={user} />
                </header>

                <main className="content-body">
                    {/* Outlet context endi aniq DashboardContextType ga ega */}
                    <Outlet
                        context={
                            {
                                user,
                                refreshProfile,
                            } satisfies DashboardContextType
                        }
                    />
                </main>
            </Box>
        </Box>
    );
};

const NavItem: FC<NavItemProps> = ({ active, onClick, icon, label }) => (
    <button
        type="button"
        className={`nav-item ${active ? 'active' : ''}`}
        onClick={onClick}
    >
        <i className={`bi ${icon}`}></i>
        <p>{label}</p>
    </button>
);

export default DashboardLayout;
