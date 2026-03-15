import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import NotFound from './components/NotFound';
import ForgotPassword from './auth/ForgotPassword';
import ActivateAccount from './auth/ActivateAccount';
import LoginPage from './auth/LoginPage.tsx';
import Dashboard from './pages/dashboard/Dashboard.tsx';
import DashboardHome from './pages/dashboard/DashboardHome.tsx';
import ProfilePage from './pages/profile/ProfilePage.tsx';
import ProfileSettings from './pages/profile/ProfileSettings.tsx';
import ProtectedRoute from './auth/ProtectedRoute.tsx';

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/activate" element={<ActivateAccount />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />}>
                        {/* /dashboard */}
                        <Route index element={<DashboardHome />} />

                        {/* /dashboard/profile */}
                        <Route path="profile" element={<ProfilePage />} />

                        {/* /dashboard/settings - Profilni tahrirlash sahifasi */}
                        <Route path="settings" element={<ProfileSettings />} />

                        <Route
                            path="schedule"
                            element={<div>Dars jadvali (Tez kunda)</div>}
                        />
                        <Route
                            path="projects"
                            element={<div>Loyihalar (Tez kunda)</div>}
                        />
                        <Route
                            path="messages"
                            element={<div>Xabarlar (Tez kunda)</div>}
                        />
                    </Route>
                </Route>

                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
