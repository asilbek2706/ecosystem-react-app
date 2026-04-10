import { type FC, useEffect, useState, useCallback, ReactElement } from 'react';
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
import type { ITask, TaskStatus, StatusStyle } from '@/types/task.type.ts';
import { TaskService } from '@/services/task.service.ts';
import '@/styles/dashboard/department/TaskDetail.scss';
import { normalizeTaskDetail } from '@/utils/api-normalizers.ts';

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
            const response = await TaskService.getTaskById(id);
            setTask(normalizeTaskDetail(response.data));
        } catch (err) {
            console.error(err);
            setError('Vazifa yuklashda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void fetchTaskDetail();
    }, [fetchTaskDetail]);

    const getStatusStyles = (status: TaskStatus): StatusStyle => {
        const config: Record<TaskStatus, StatusStyle> = {
            pending: {
                color: 'secondary',
                icon: <InfoCircle />,
                label: 'Kutilmoqda',
            },
            in_progress: {
                color: 'warning',
                icon: <InfoCircle />,
                label: 'Jarayonda',
            },
            done: {
                color: 'success',
                icon: <InfoCircle />,
                label: 'Bajarildi',
            },
        };
        return config[status] || config.pending;
    };

    if (loading)
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="60vh"
            >
                <CircularProgress thickness={5} size={50} />
            </Box>
        );

    if (error || !task)
        return (
            <Box p={4}>
                <Alert severity="error" sx={{ borderRadius: '12px' }}>
                    {error || 'Vazifa topilmadi'}
                </Alert>
                <Button
                    startIcon={<ArrowLeft />}
                    onClick={() => navigate(-1)}
                    sx={{ mt: 2 }}
                >
                    Orqaga qaytish
                </Button>
            </Box>
        );

    const statusStyle = getStatusStyles(task.status);
    const creatorName =
        typeof task.created_by === 'string'
            ? task.created_by
            : task.created_by?.username || 'Noma`lum';

    return (
        <Box className="task-detail-container" p={3}>
            <Button
                startIcon={<ArrowLeft />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3, fontWeight: 700, textTransform: 'none' }}
            >
                Vazifalar ro'yxatiga qaytish
            </Button>

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: '24px',
                    border: '1px solid #f0f0f0',
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    flexWrap="wrap"
                    gap={2}
                >
                    <Box>
                        <Typography
                            variant="h3"
                            fontWeight={900}
                            gutterBottom
                            sx={{ letterSpacing: '-1px' }}
                        >
                            {task.title}
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            color="primary"
                            fontWeight={800}
                        >
                            ID: #{task.id.split('-')[0].toUpperCase()}
                        </Typography>
                    </Box>
                    <Chip
                        icon={statusStyle.icon as ReactElement}
                        label={statusStyle.label}
                        color={statusStyle.color}
                        sx={{
                            fontWeight: 900,
                            px: 2,
                            height: '40px',
                            borderRadius: '12px',
                        }}
                    />
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box mb={5}>
                    <Typography
                        variant="h6"
                        fontWeight={800}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mb={2}
                    >
                        <InfoCircle size={20} color="#6366f1" /> Tavsif
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}
                    >
                        {task.description ||
                            'Ushbu vazifa uchun tavsif yozilmagan.'}
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DetailInfoCard
                            icon={<Briefcase />}
                            label="Departament"
                            value={task.department_code}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DetailInfoCard
                            icon={<PersonCircle />}
                            label="Mas'ul shaxs"
                            value={creatorName}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box
                            p={2}
                            sx={{ bgcolor: '#f8fafc', borderRadius: '16px' }}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                display="flex"
                                alignItems="center"
                                gap={1}
                                mb={1}
                                fontWeight={700}
                            >
                                <FlagFill /> Ustuvorlik
                            </Typography>
                            <Chip
                                label={task.priority.toUpperCase()}
                                size="small"
                                sx={{
                                    fontWeight: 900,
                                    bgcolor:
                                        task.priority === 'critical'
                                            ? '#fee2e2'
                                            : '#fef3c7',
                                    color:
                                        task.priority === 'critical'
                                            ? '#ef4444'
                                            : '#f59e0b',
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DetailInfoCard
                            icon={<Calendar3 />}
                            label="Muddat"
                            value={
                                task.deadline
                                    ? new Date(
                                          task.deadline
                                      ).toLocaleDateString('uz-UZ')
                                    : 'Muddatsiz'
                            }
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

// Yordamchi komponent
const DetailInfoCard: FC<{
    icon: ReactElement;
    label: string;
    value: string;
}> = ({ icon, label, value }) => (
    <Box
        p={2}
        sx={{ bgcolor: '#f8fafc', borderRadius: '16px', height: '100%' }}
    >
        <Typography
            variant="caption"
            color="text.secondary"
            display="flex"
            alignItems="center"
            gap={1}
            mb={0.5}
            fontWeight={700}
        >
            {icon} {label}
        </Typography>
        <Typography variant="body1" fontWeight={800} color="text.primary">
            {value}
        </Typography>
    </Box>
);

export default TaskDetail;
