import { FC, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Divider,
    Chip,
    Button,
    CircularProgress,
    Grid,
    Alert,
} from '@mui/material';
import {
    ArrowLeft,
    InfoCircle,
    PersonCircle,
    Calendar3,
    Briefcase,
    FlagFill,
} from 'react-bootstrap-icons';
import type { ITaskDetailResponse, ITask } from '@/types/task.type.ts';
import api from '@/api/axios.tsx';
import '@/styles/dashboard/department/TaskDetail.scss';

const TaskDetail: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<ITask | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTaskDetail = useCallback(async (): Promise<void> => {
        if (!id) return;
        try {
            setLoading(true);
            const response = await api.get<ITaskDetailResponse>(
                `/tasks/detail/${id}/`
            );

            // Bu yerda response.data bu ITaskDetailResponse
            // response.data.data esa ITask obyektining o'zi
            if (response.data?.status && response.data?.data) {
                setTask(response.data.data);
            }
        } catch (err) {
            setError('Vazifa yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void fetchTaskDetail();
    }, [fetchTaskDetail]);

    if (loading)
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '60vh',
                }}
            >
                <CircularProgress thickness={5} />
            </Box>
        );

    if (error || !task)
        return (
            <Box p={4}>
                <Alert severity="error" sx={{ borderRadius: '12px' }}>
                    {error || 'Vazifa topilmadi'}
                </Alert>
                <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    Orqaga qaytish
                </Button>
            </Box>
        );

    return (
        <Box className="task-detail-container">
            <Button
                startIcon={<ArrowLeft />}
                onClick={() => navigate(-1)}
                className="back-btn"
            >
                Vazifalar ro'yxatiga qaytish
            </Button>

            <Paper elevation={0} className="detail-paper">
                <Box className="task-header">
                    <Box>
                        <Typography variant="h4" className="task-title">
                            {task.title}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: 'primary.main', fontWeight: 700 }}
                        >
                            #{task.id.split('-')[0].toUpperCase()}
                        </Typography>
                    </Box>
                    <Chip
                        label={task.status.replace('_', ' ')}
                        color={task.status === 'done' ? 'success' : 'primary'}
                        className="status-chip"
                    />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" className="section-title">
                    <InfoCircle size={18} /> Tavsif
                </Typography>
                <Typography className="task-description">
                    {task.description}
                </Typography>

                <Grid container spacing={4} className="meta-grid">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box className="meta-item">
                            <Typography className="meta-label">
                                <Briefcase /> Departament
                            </Typography>
                            <Typography variant="h6" className="meta-value">
                                {task.department_code}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box className="meta-item">
                            <Typography className="meta-label">
                                <PersonCircle /> Mas'ul shaxs
                            </Typography>
                            <Typography variant="h6" className="meta-value">
                                {task.created_by.username}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box className="meta-item">
                            <Typography className="meta-label">
                                <FlagFill /> Ustuvorlik
                            </Typography>
                            <Chip
                                label={task.priority}
                                size="small"
                                color={
                                    task.priority === 'urgent'
                                        ? 'error'
                                        : 'warning'
                                }
                                sx={{
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                }}
                            />
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box className="meta-item">
                            <Typography className="meta-label">
                                <Calendar3 /> Tugatish muddati
                            </Typography>
                            <Typography variant="h6" className="meta-value">
                                {task.deadline
                                    ? new Date(
                                          task.deadline
                                      ).toLocaleDateString()
                                    : 'Belgilanmagan'}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default TaskDetail;
