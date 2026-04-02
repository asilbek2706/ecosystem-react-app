import { type FC, memo } from 'react';
import { Box, Chip, Grid, Typography } from '@mui/material';
import { ArrowRightShort, Building, People } from 'react-bootstrap-icons';
import type { IDepartment } from '@/types/department.type.ts';

interface Props {
    dept: IDepartment;
    onClick: (code: string) => void;
}

const DepartmentCard: FC<Props> = memo(({ dept, onClick }) => {
    if (!dept) return null;

    return (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Box
                className="dept-card"
                onClick={() => onClick(dept.code)}
                sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    p: 2.5,
                    borderRadius: '20px',
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                        borderColor: 'primary.main',
                        '& .arrow-icon': {
                            transform: 'translateX(4px)',
                        },
                    },
                }}
            >
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: '12px',
                            bgcolor: 'primary.light',
                            color: 'primary.main',
                            display: 'flex',
                        }}
                    >
                        <Building size={24} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            fontWeight={800}
                            noWrap
                            sx={{ fontSize: '1.1rem', lineHeight: 1.2 }}
                        >
                            {dept.name || 'Nomsiz Departament'}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 800,
                                letterSpacing: 1,
                                textTransform: 'uppercase',
                            }}
                        >
                            {dept.code}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-end"
                >
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight={700}
                            display="block"
                            gutterBottom
                        >
                            Jamoa a'zolari
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <People size={16} color="#64748b" />
                            <Typography variant="body2" fontWeight={800}>
                                {dept.members_count || 0} ta
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                        <Chip
                            label={dept.is_active ? 'Faol' : 'Nofaol'}
                            size="small"
                            color={dept.is_active ? 'success' : 'default'}
                            variant={dept.is_active ? 'filled' : 'outlined'}
                            sx={{
                                fontWeight: 800,
                                borderRadius: '8px',
                                fontSize: '10px',
                                mb: 1,
                            }}
                        />
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-end"
                            color="primary.main"
                        >
                            <Typography
                                variant="caption"
                                fontWeight={900}
                                sx={{ mr: 0.5 }}
                            >
                                KO'RISH
                            </Typography>
                            <ArrowRightShort
                                size={20}
                                className="arrow-icon"
                                style={{ transition: 'transform 0.2s' }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Grid>
    );
});

DepartmentCard.displayName = 'DepartmentCard';

export default DepartmentCard;
