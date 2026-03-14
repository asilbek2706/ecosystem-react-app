import { type FC } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const WelcomeLoader: FC<{ name: string }> = ({ name }) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
            }}
        >
            <div style={{ animation: 'pulse 1.5s infinite' }}>
                <i
                    className="bi bi-layers-half"
                    style={{ fontSize: '4rem', color: '#4361ee' }}
                ></i>
            </div>
            <Typography
                variant="h4"
                fontWeight="800"
                sx={{ mt: 3, color: '#1e293b' }}
            >
                Xush kelibsiz, {name}!
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mt: 1 }}>
                Ecosystem tizimi yuklanmoqda...
            </Typography>
            <CircularProgress
                size={30}
                thickness={5}
                sx={{ mt: 4, color: '#4361ee' }}
            />

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </Box>
    );
};

export default WelcomeLoader;
