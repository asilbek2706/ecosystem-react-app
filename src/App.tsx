import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import NotFound from './components/NotFound';
import ForgotPassword from './auth/ForgotPassword';
import ActivateAccount from './auth/ActivateAccount';
import LoginPage from './pages/LoginPage.tsx';
import Dashboard from './pages/dashboard/Dashboard.tsx';

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/activate" element={<ActivateAccount />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
