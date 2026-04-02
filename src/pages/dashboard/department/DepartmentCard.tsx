import { Box, Typography, Chip, Grid } from '@mui/material';
import { Building, People } from 'react-bootstrap-icons';
import type { IDepartment } from '@/types/department.type.ts';
import type { FC } from 'react';

interface Props {
    dept: IDepartment;
    onClick: (code: string) => void;
}

const DepartmentCard: FC<Props> = ({ dept, onClick }) => {
    return (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Box className="dept-card" onClick={() => onClick(dept.code)}>
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
                            sx={{ color: 'primary.main', fontWeight: 700 }}
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
                        <Box display="flex" alignItems="center" gap={1}>
                            <People size={16} />
                            <Typography className="value">
                                {dept.members_count} ta
                            </Typography>
                        </Box>
                    </div>
                    <div className="info-item" style={{ textAlign: 'right' }}>
                        <Typography className="label">Status</Typography>
                        <Chip
                            label={dept.is_active ? 'Faol' : 'Nofaol'}
                            size="small"
                            color={dept.is_active ? 'success' : 'default'}
                            sx={{ fontWeight: 700, borderRadius: '8px' }}
                        />
                    </div>
                </div>
            </Box>
        </Grid>
    );
};

export default DepartmentCard;
