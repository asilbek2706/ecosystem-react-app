import { FC, useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    MenuItem,
    Modal,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { X } from 'react-bootstrap-icons';
import { TaskService } from '@/services/task.service';

interface Props {
    open: boolean;
    onClose: () => void;
    deptCode: string;
    onSuccess: () => void;
}

const CreateTaskModal: FC<Props> = ({ open, onClose, deptCode, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'medium',
        deadline: '',
    });

    const handleSave = async () => {
        if (!form.title) return alert('Sarlavha majburiy!');
        try {
            setLoading(true);
            await TaskService.createTask({
                ...form,
                department_code: deptCode,
                status: 'todo',
                deadline: form.deadline
                    ? new Date(form.deadline).toISOString()
                    : null,
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Xatolik! Balki bu departament kodi bazada yo'qdir?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 450,
                    bgcolor: 'white',
                    p: 4,
                    borderRadius: '24px',
                    boxShadow: 24,
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >
                    <Typography variant="h6" fontWeight={800}>
                        Yangi Vazifa
                    </Typography>
                    <IconButton onClick={onClose}>
                        <X />
                    </IconButton>
                </Stack>
                <Stack spacing={2.5}>
                    <TextField
                        label="Vazifa nomi"
                        fullWidth
                        onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                        }
                    />
                    <TextField
                        label="Batafsil ma'lumot"
                        multiline
                        rows={3}
                        fullWidth
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />
                    <TextField
                        select
                        label="Ustuvorlik"
                        value={form.priority}
                        fullWidth
                        onChange={(e) =>
                            setForm({ ...form, priority: e.target.value })
                        }
                    >
                        <MenuItem value="low">Past</MenuItem>
                        <MenuItem value="medium">O'rta</MenuItem>
                        <MenuItem value="high">Yuqori</MenuItem>
                        <MenuItem value="urgent">Tezkor</MenuItem>
                    </TextField>
                    <TextField
                        type="datetime-local"
                        label="Deadline"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        onChange={(e) =>
                            setForm({ ...form, deadline: e.target.value })
                        }
                    />
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSave}
                        disabled={loading}
                        sx={{ borderRadius: '12px', py: 1.5 }}
                    >
                        {loading ? 'Yaratilmoqda...' : 'Saqlash'}
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default CreateTaskModal;
