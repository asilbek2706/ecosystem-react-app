import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/Background.scss';

const Layout: React.FC = () => {
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
