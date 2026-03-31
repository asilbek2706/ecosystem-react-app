import { type FC, useEffect, useState, useCallback } from 'react';
import {
    Box,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    Chip,
    Button,
} from '@mui/material';
import {
    Building,
    People,
    ArrowRightCircle,
    InfoCircle,
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

import { DepartmentService } from '../../services/department.service';
import '../../styles/dashboard/DashboardHome.scss';
import type {
    IDepartment,
    IDepartmentListResponse,
} from '../../types/department.type.ts';

interface ApiErrorResponse {
    message?: string;
    detail?: string;
}

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

            const result = response.data as unknown as IDepartmentListResponse;

            if (
                result &&
                result.data &&
                Array.isArray(result.data.departments)
            ) {
                setDepartments(result.data.departments);
            } else {
                setDepartments([]);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<ApiErrorResponse>;
                setError(
                    axiosError.response?.data?.message ||
                        "Ma'lumotlarni yuklashda xatolik yuz berdi"
                );
            } else {
                setError('Kutilmagan xatolik yuz berdi');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchDepartments();
    }, [fetchDepartments]);

    const handleDeptClick = (id: string): void => {
        navigate(`/dashboard/department/list/${id}`);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '60vh',
                }}
            >
                <CircularProgress size={50} thickness={4} />
                <Typography
                    sx={{ mt: 2, color: 'text.secondary', fontWeight: 600 }}
                >
                    Departamentlar yuklanmoqda...
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="dashboard-home fade-in">
            <header className="welcome-section">
                <Box>
                    <Typography variant="h4" className="greeting">
                        Asosiy Panel
                    </Typography>
                    <Typography className="sub-text">
                        Tizimdagi barcha faol departamentlar va statistikalar
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<ArrowRightCircle />}
                    className="action-button"
                >
                    Hisobotlar
                </Button>
            </header>

            {error ? (
                <Alert
                    severity="error"
                    variant="outlined"
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => void fetchDepartments()}
                        >
                            Qayta urinish
                        </Button>
                    }
                    sx={{ borderRadius: '15px', mb: 4 }}
                >
                    {error}
                </Alert>
            ) : departments.length === 0 ? (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 10,
                        color: 'text.secondary',
                    }}
                >
                    <InfoCircle size={40} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Hozircha departamentlar mavjud emas
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3} className="departments-grid">
                    {departments.map((dept) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={dept.id}>
                            <Box
                                className="dept-card"
                                onClick={() => handleDeptClick(dept.id)}
                            >
                                <div className="dept-header">
                                    <div className="dept-icon">
                                        <Building size={24} />
                                    </div>
                                    <div className="title-wrapper">
                                        <Typography className="dept-title">
                                            {dept.name}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'primary.main',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {dept.code}
                                        </Typography>
                                    </div>
                                </div>

                                <div className="dept-info">
                                    <div className="info-item">
                                        <Typography className="label">
                                            Jamoa a'zolari
                                        </Typography>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={1}
                                        >
                                            <People size={16} />
                                            <Typography className="value">
                                                {dept.members_count} ta
                                            </Typography>
                                        </Box>
                                    </div>
                                    <div
                                        className="info-item"
                                        style={{ textAlign: 'right' }}
                                    >
                                        <Typography className="label">
                                            Status
                                        </Typography>
                                        <Chip
                                            label={
                                                dept.is_active
                                                    ? 'Faol'
                                                    : 'Nofaol'
                                            }
                                            size="small"
                                            color={
                                                dept.is_active
                                                    ? 'success'
                                                    : 'default'
                                            }
                                            sx={{
                                                fontWeight: 700,
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </div>
                                </div>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default DashboardHome;
