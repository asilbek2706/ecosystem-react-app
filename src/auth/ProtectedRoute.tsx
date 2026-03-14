import { Navigate, Outlet } from 'react-router-dom';
import { AuthService } from '../services/auth.service.ts';

const ProtectedRoute = () => {
    const isAuthenticated = AuthService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
