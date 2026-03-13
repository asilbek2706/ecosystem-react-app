import { Outlet } from 'react-router-dom';
import '../styles/Background.scss';
import type { FC } from 'react';

const Layout: FC = () => {
    return (
        <div className="app-layout">
            <div className="background-overlay"></div>

            <main className="content-area">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
