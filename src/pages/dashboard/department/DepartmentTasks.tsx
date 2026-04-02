import { type FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Grid,
    Chip,
    IconButton,
    Card,
    Alert,
} from '@mui/material';
import {
    ArrowLeft,
    Calendar3,
    Check2Circle,
    ClockHistory,
    Inbox,
    LightningChargeFill,
    PersonCircle,
} from 'react-bootstrap-icons';
import '@/styles/dashboard/department/DepartmentTasks.scss';
import type { ITask } from '@/types/task.type.ts';
import { TaskService } from '@/services/task.service.ts';

interface StatusConfig {
    color:
        | 'warning'
        | 'success'
        | 'info'
        | 'error'
        | 'default'
        | 'primary'
        | 'secondary';
    icon: ReactNode;
    label: string;
}

const DepartmentTasks: FC = () => {
    const { deptCode } = useParams<{ deptCode: string }>();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState<ITask[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadTasks = useCallback(async (): Promise<void> => {
        if (!deptCode) return;
        try {
            setLoading(true);
            setError(null);

            const response = await TaskService.getTasksByDepartment(deptCode);

            if (response.data?.status && response.data?.data?.tasks) {
                const filteredTasks = response.data.data.tasks.filter(
                    (t: ITask) =>
                        String(t.department_code).trim().toLowerCase() ===
                        String(deptCode).trim().toLowerCase()
                );

                setTasks(filteredTasks);
            }
        } catch (err) {
            console.error('Task list fetch error:', err);
            setError(
                'Vazifalarni yuklashda xatolik yuz berdi. Backend bilan aloqani tekshiring.'
            );
        } finally {
            setLoading(false);
        }
    }, [deptCode]);

    useEffect(() => {
        void loadTasks();
    }, [loadTasks]);

    const getStatusStyles = (status: ITask['status']): StatusConfig => {
        const config: Record<ITask['status'], StatusConfig> = {
            in_progress: {
                color: 'warning',
                icon: <ClockHistory />,
                label: 'Jarayonda',
            },
            done: {
                color: 'success',
                icon: <Check2Circle />,
                label: 'Bajarildi',
            },
            todo: {
                color: 'info',
                icon: <LightningChargeFill />,
                label: 'Kutilmoqda',
            },
        };
        return config[status] || config.todo;
    };

    if (loading)
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                }}
            >
                <CircularProgress thickness={5} size={50} />
            </Box>
        );

    return (
        <Box className="tasks-container" p={3}>
            <Box
                className="header-box"
                display="flex"
                alignItems="center"
                gap={2}
                mb={4}
            >
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{
                        bgcolor: 'white',
                        boxShadow: 1,
                        '&:hover': { bgcolor: '#f5f5f5' },
                    }}
                >
                    <ArrowLeft size={20} />
                </IconButton>
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={900}
                        sx={{ letterSpacing: '-0.5px' }}
                    >
                        {deptCode}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={600}
                    >
                        Admin paneldan olingan: {tasks.length} ta vazifa
                    </Typography>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                    {error}
                </Alert>
            )}

            {tasks.length === 0 && !error ? (
                <Box textAlign="center" py={10} sx={{ opacity: 0.5 }}>
                    <Inbox size={80} />
                    <Typography variant="h5" mt={2} fontWeight={800}>
                        Vazifalar topilmadi
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ maxWidth: 400, mx: 'auto', mt: 1 }}
                    >
                        Backend'da ushbu <b>"{deptCode}"</b> kodi ostida
                        vazifalar yaratilganiga ishonch hosil qiling.
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {tasks.map((task: ITask) => {
                        const status: StatusConfig = getStatusStyles(
                            task.status
                        );
                        return (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={task.id}>
                                <Card
                                    className="task-card"
                                    onClick={() =>
                                        navigate(
                                            `/dashboard/task-detail/${task.id}`
                                        )
                                    }
                                >
                                    <Box className="card-content" p={3}>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            mb={2.5}
                                        >
                                            <Chip
                                                icon={status.icon}
                                                label={status.label}
                                                size="small"
                                                color={status.color}
                                                sx={{
                                                    fontWeight: 700,
                                                    borderRadius: '8px',
                                                }}
                                            />
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                gap={1}
                                            >
                                                <Box
                                                    component="span"
                                                    className="priority-dot"
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        background:
                                                            task.priority ===
                                                            'urgent'
                                                                ? '#ef4444'
                                                                : '#f59e0b',
                                                        boxShadow: `0 0 8px ${task.priority === 'urgent' ? '#ef4444' : '#f59e0b'}`,
                                                    }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    fontWeight={900}
                                                    sx={{
                                                        textTransform:
                                                            'uppercase',
                                                        color: 'text.secondary',
                                                    }}
                                                >
                                                    {task.priority}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Typography
                                            variant="h6"
                                            fontWeight={800}
                                            mb={1}
                                            className="line-clamp-1"
                                        >
                                            {task.title}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            className="task-desc line-clamp-2"
                                            sx={{ minHeight: '40px' }}
                                        >
                                            {task.description}
                                        </Typography>

                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            mt={3}
                                            pt={2}
                                            sx={{
                                                borderTop: '1px solid #f0f0f0',
                                            }}
                                        >
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                gap={1}
                                            >
                                                <PersonCircle
                                                    size={16}
                                                    color="#999"
                                                />
                                                <Typography
                                                    variant="caption"
                                                    fontWeight={700}
                                                    color="text.primary"
                                                >
                                                    {task.created_by.username}
                                                </Typography>
                                            </Box>
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                gap={0.8}
                                                color="text.secondary"
                                            >
                                                <Calendar3 size={14} />
                                                <Typography
                                                    variant="caption"
                                                    fontWeight={700}
                                                >
                                                    {task.deadline
                                                        ? new Date(
                                                              task.deadline
                                                          ).toLocaleDateString(
                                                              'uz-UZ'
                                                          )
                                                        : 'Muddatsiz'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
};

export default DepartmentTasks;
