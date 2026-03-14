import { useEffect, useState, useCallback, type FC } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import '../../styles/dashboard/Dashboard.scss';
import { AuthService } from '../../services/auth.service.ts';
import type { IUserProfile } from '../../types/auth.types.ts';
import UserMenu from './UserMenu.tsx';

const Dashboard: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [user] = useState<IUserProfile | null>(() => {
        return AuthService.getSavedProfile();
    });

    useEffect(() => {
        if (!user) {
            navigate('/login', { replace: true });
        }
    }, [user, navigate]);

    const handleNavClick = useCallback(
        (path: string) => {
            navigate(path);
        },
        [navigate]
    );

    const isActive = (path: string) => location.pathname === path;

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
                    <button
                        className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                        onClick={() => handleNavClick('/dashboard')}
                    >
                        <i className="bi bi-grid-1x2-fill"></i>
                        <p>Asosiy Panel</p>
                    </button>

                    <button
                        className={`nav-item ${isActive('/dashboard/schedule') ? 'active' : ''}`}
                        onClick={() => handleNavClick('/dashboard/schedule')}
                    >
                        <i className="bi bi-calendar4-event"></i>
                        <p>Dars jadvali</p>
                    </button>

                    <button
                        className={`nav-item ${isActive('/dashboard/projects') ? 'active' : ''}`}
                        onClick={() => handleNavClick('/dashboard/projects')}
                    >
                        <i className="bi bi-journal-code"></i>
                        <p>Loyihalar</p>
                    </button>

                    <button
                        className={`nav-item ${isActive('/dashboard/messages') ? 'active' : ''}`}
                        onClick={() => handleNavClick('/dashboard/messages')}
                    >
                        <i className="bi bi-chat-left-text"></i>
                        <p>Xabarlar</p>
                    </button>

                    <div className="nav-divider"></div>

                    <button
                        className={`nav-item ${isActive('/dashboard/settings') ? 'active' : ''}`}
                        onClick={() => handleNavClick('/dashboard/settings')}
                    >
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

                    <UserMenu user={user} />
                </header>

                <main className="content-body">
                    <Outlet context={{ user }} />
                </main>
            </Box>
        </Box>
    );
};

export default Dashboard;
