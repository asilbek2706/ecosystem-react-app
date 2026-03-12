import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './auth/LoginPage';
import NotFound from './components/NotFound.tsx';
import AuthAction from './auth/AuthAction.tsx';

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<AuthAction />} />
                <Route path="/activate" element={<AuthAction />} />

                <Route path="/" element={<Navigate to="/login" replace />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
