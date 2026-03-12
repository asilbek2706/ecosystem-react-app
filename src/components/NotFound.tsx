import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.scss';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box className="not-found-wrapper">
            <div className="error-content text-center">
                <h1 className="error-code">404</h1>

                <Typography variant="h5" fontWeight="600" className="mb-2">
                    Sahifa topilmadi!
                </Typography>

                <Typography
                    variant="body1"
                    color="textSecondary"
                    className="mb-4 px-3"
                >
                    Siz qidirayotgan sahifa o'chirilgan, nomi o'zgartirilgan
                    yoki <br />
                    vaqtincha mavjud emas bo'lishi mumkin.
                </Typography>

                <Button
                    variant="contained"
                    className="back-home-btn"
                    onClick={() => navigate('/login')}
                    startIcon={<i className="bi bi-house-door"></i>}
                >
                    Login sahifasiga qaytish
                </Button>
            </div>
        </Box>
    );
};

export default NotFound;
