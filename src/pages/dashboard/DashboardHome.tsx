import { useEffect, useState, useCallback, type FC } from 'react';
import {
    Box,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import { ArrowRightCircle, InfoCircle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { DepartmentService } from '@/services/department.service';
import '../../styles/dashboard/DashboardHome.scss';
import type { IDepartment } from '@/types/department.type.ts';
import DepartmentCard from './department/DepartmentCard.tsx';
import { normalizeDepartmentList } from '@/utils/api-normalizers.ts';

const DashboardHome: FC = () => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState<IDepartment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDepartments = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const response = await DepartmentService.getAllDepartments();
            setDepartments(normalizeDepartmentList(response.data));
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                        'Ma’lumotlarni yuklashda xatolik'
                );
            } else {
                setError('Kutilmagan xato yuz berdi');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchDepartments();
    }, [fetchDepartments]);

    const handleDeptClick = (deptCode: string): void => {
        navigate(`/dashboard/tasks/${deptCode}`);
    };

    if (loading)
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );

    return (
        <Box className="dashboard-home fade-in">
            <header
                className="welcome-section"
                style={{
                    marginBottom: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Asosiy Panel
                    </Typography>
                    <Typography color="text.secondary">
                        Departamentlar va statistikalar
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<ArrowRightCircle />}>
                    Hisobotlar
                </Button>
            </header>

            {error && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>
                    {error}
                </Alert>
            )}

            {departments.length === 0 && !error ? (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                    <InfoCircle size={40} color="gray" />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Ma'lumot topilmadi
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {departments.map((dept) => (
                        <DepartmentCard
                            key={dept.id}
                            dept={dept}
                            onClick={handleDeptClick}
                        />
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default DashboardHome;
