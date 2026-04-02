import { type FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Alert,
    Box,
    Card,
    Chip,
    CircularProgress,
    Grid,
    IconButton,
    Typography,
} from '@mui/material';
import {
    ArrowLeft,
    Check2Circle,
    ClockHistory,
    HourglassSplit,
    Inbox,
    PersonCircle,
} from 'react-bootstrap-icons';
import '@/styles/dashboard/department/DepartmentTasks.scss';
import type {
    ITask,
    StatusStyle,
    TaskPriority,
    TaskStatus,
} from '@/types/task.type.ts';
import { TaskService } from '@/services/task.service.ts';

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

            // Skrinshotingizda response.data.data.tasks massiv ekanligi ko'rindi
            if (response.data?.status && response.data?.data?.tasks) {
                const allFetchedTasks = response.data.data.tasks;

                // STRICT FILTER: Millionta departament ichidan faqat hozirgisini ajratish
                const strictFiltered = allFetchedTasks.filter(
                    (task) =>
                        String(task.department_code).trim() ===
                        String(deptCode).trim()
                );

                setTasks(strictFiltered);
            } else {
                setTasks([]);
            }
        } catch (err) {
            console.error('Task fetch error:', err);
            setError('Ma’lumotlarni yuklashda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    }, [deptCode]);

    useEffect(() => {
        void loadTasks();
    }, [loadTasks]);

    const getStatusStyles = (status: TaskStatus): StatusStyle => {
        const config: Record<TaskStatus, StatusStyle> = {
            pending: {
                color: 'secondary',
                icon: <HourglassSplit size={14} />,
                label: 'Kutilmoqda',
            },
            in_progress: {
                color: 'warning',
                icon: <ClockHistory size={14} />,
                label: 'Jarayonda',
            },
            done: {
                color: 'success',
                icon: <Check2Circle size={14} />,
                label: 'Bajarildi',
            },
        };
        return config[status] || config.pending;
    };

    const getPriorityColor = (priority: TaskPriority): string => {
        const colors: Record<TaskPriority, string> = {
            critical: '#d32f2f',
            high: '#ed6c02',
            medium: '#0288d1',
            low: '#4caf50',
        };
        return colors[priority] || '#757575';
    };

    if (loading)
        return (
            <Box display="flex" justifyContent="center" py={10}>
                <CircularProgress thickness={5} size={50} />
            </Box>
        );

    return (
        <Box className="tasks-container" p={3}>
            <Box display="flex" alignItems="center" gap={2} mb={4}>
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
                    <Typography variant="h4" fontWeight={900}>
                        {deptCode}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={700}
                    >
                        Jami: {tasks.length} ta vazifa
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
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {tasks.map((task: ITask) => {
                        const style = getStatusStyles(task.status);
                        return (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={task.id}>
                                <Card
                                    className="task-card"
                                    onClick={() =>
                                        navigate(
                                            `/dashboard/task-detail/${task.id}`
                                        )
                                    }
                                    sx={{
                                        borderRadius: '18px',
                                        cursor: 'pointer',
                                        transition: '0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                        },
                                    }}
                                >
                                    <Box p={3}>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            mb={2}
                                        >
                                            <Chip
                                                icon={style.icon}
                                                label={style.label}
                                                color={style.color}
                                                size="small"
                                                sx={{ fontWeight: 800 }}
                                            />
                                            <Typography
                                                variant="caption"
                                                fontWeight={900}
                                                sx={{
                                                    color: getPriorityColor(
                                                        task.priority
                                                    ),
                                                }}
                                            >
                                                {task.priority.toUpperCase()}
                                            </Typography>
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
                                            className="line-clamp-2"
                                            mb={3}
                                            sx={{ minHeight: '40px' }}
                                        >
                                            {task.description}
                                        </Typography>

                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            pt={2}
                                            sx={{
                                                borderTop: '1px solid #f0f0f0',
                                            }}
                                        >
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                gap={0.5}
                                            >
                                                <PersonCircle
                                                    size={14}
                                                    color="#64748b"
                                                />
                                                <Typography
                                                    variant="caption"
                                                    fontWeight={700}
                                                >
                                                    {task.created_by.username}
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="caption"
                                                fontWeight={700}
                                                color="text.secondary"
                                            >
                                                {task.deadline
                                                    ? new Date(
                                                          task.deadline
                                                      ).toLocaleDateString(
                                                          'uz-UZ'
                                                      )
                                                    : 'N/A'}
                                            </Typography>
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
