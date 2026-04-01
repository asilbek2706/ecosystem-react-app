import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import NotFound from './components/NotFound';
import ForgotPassword from './auth/ForgotPassword';
import ActivateAccount from './auth/ActivateAccount';
import LoginPage from './auth/LoginPage';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute from './auth/ProtectedRoute';
import DashboardRoutes from './routes/DashboardRoutes';

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/activate" element={<ActivateAccount />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard/*" element={<Dashboard />}>
                        <Route path="*" element={<DashboardRoutes />} />
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
