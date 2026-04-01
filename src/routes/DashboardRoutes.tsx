import { type FC, lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const ProfileSettings = lazy(() => import('../pages/profile/ProfileSettings'));
const DepartmentTasks = lazy(
    () => import('../pages/dashboard/department/DepartmentTasks.tsx')
);
const TaskDetail = lazy(
    () => import('../pages/dashboard/department/TaskDetail.tsx')
);

const PageLoader: FC = () => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
        }}
    >
        <CircularProgress size={40} />
    </Box>
);

const DashboardRoutes: FC = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route index element={<DashboardHome />} />

                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<ProfileSettings />} />

                <Route path="tasks/:deptCode" element={<DepartmentTasks />} />
                <Route path="task-detail/:id" element={<TaskDetail />} />

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

                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />
            </Routes>
        </Suspense>
    );
};

export default DashboardRoutes;
