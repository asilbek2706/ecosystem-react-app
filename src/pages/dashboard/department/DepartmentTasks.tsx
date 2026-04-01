import { type FC, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Grid,
    Chip,
    IconButton,
    Card,
} from '@mui/material';
import {
    ArrowLeft,
    Calendar3,
    PersonCircle,
    LightningChargeFill,
    Check2Circle,
    ClockHistory,
} from 'react-bootstrap-icons';
import '@/styles/dashboard/department/DepartmentTasks.scss';
import type { ITask } from '@/types/task.type.ts';
import { TaskService } from '@/services/task.service.ts';

const DepartmentTasks: FC = () => {
    const { deptCode } = useParams<{ deptCode: string }>();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTasks = useCallback(async () => {
        if (!deptCode) return;
        try {
            const response = await TaskService.getTasksByDepartment(deptCode);
            if (response.data?.data?.tasks) {
                setTasks(response.data.data.tasks);
            }
        } catch (error) {
            console.error('Task list error:', error);
        } finally {
            setLoading(false);
        }
    }, [deptCode]);

    useEffect(() => {
        void loadTasks();
    }, [loadTasks]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'in_progress':
                return {
                    color: 'warning',
                    icon: <ClockHistory />,
                    label: 'Jarayonda',
                };
            case 'done':
                return {
                    color: 'success',
                    icon: <Check2Circle />,
                    label: 'Bajarildi',
                };
            default:
                return {
                    color: 'info',
                    icon: <LightningChargeFill />,
                    label: 'Kutilmoqda',
                };
        }
    };

    if (loading)
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );

    return (
        <Box className="tasks-container">
            <Box className="header-box">
                <IconButton onClick={() => navigate(-1)} className="back-icon">
                    <ArrowLeft size={20} />
                </IconButton>
                <Box>
                    <Typography variant="h4" fontWeight={800}>
                        {deptCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Jami {tasks.length} ta vazifa mavjud
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {tasks.map((task) => {
                    const status = getStatusStyles(task.status);
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
                                <Box className="card-content">
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Chip
                                            icon={status.icon}
                                            label={status.label}
                                            size="small"
                                            color={status.color as any}
                                            className="status-badge"
                                        />
                                        <Box display="flex" alignItems="center">
                                            <span
                                                className="priority-dot"
                                                style={{
                                                    background:
                                                        task.priority ===
                                                        'urgent'
                                                            ? '#f44336'
                                                            : '#ffa726',
                                                }}
                                            />
                                            <Typography
                                                variant="caption"
                                                fontWeight={700}
                                                sx={{
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                {task.priority}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Typography
                                        variant="h6"
                                        className="task-title"
                                    >
                                        {task.title}
                                    </Typography>
                                    <Typography className="task-desc">
                                        {task.description}
                                    </Typography>

                                    <Box className="task-footer">
                                        <Box className="user-tag">
                                            <PersonCircle size={14} />
                                            {task.created_by.username}
                                        </Box>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={1}
                                            color="text.secondary"
                                        >
                                            <Calendar3 size={14} />
                                            <Typography
                                                variant="caption"
                                                fontWeight={600}
                                            >
                                                {task.deadline
                                                    ? new Date(
                                                          task.deadline
                                                      ).toLocaleDateString()
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
        </Box>
    );
};

export default DepartmentTasks;
