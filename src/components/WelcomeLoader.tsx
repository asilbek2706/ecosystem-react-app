import { type FC } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import '../styles/WelcomeLoader.scss';

const WelcomeLoader: FC<{ name: string }> = ({ name }) => {
    return (
        <Box className="welcome-loader">
            <div className="loader-content">
                <div className="logo-animation">
                    <img src="/images/logotip.png" alt="logo" />
                </div>

                <Typography
                    variant="h4"
                    fontWeight="800"
                    className="welcome-text"
                >
                    Xush kelibsiz, {name}!
                </Typography>

                <Typography variant="body1" className="sub-text">
                    Ecosystem tizimi yuklanmoqda...
                </Typography>

                <CircularProgress
                    size={28}
                    thickness={5}
                    className="loader-spinner"
                />
            </div>
        </Box>
    );
};

export default WelcomeLoader;
