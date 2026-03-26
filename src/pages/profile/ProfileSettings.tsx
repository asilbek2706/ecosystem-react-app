import { type FC, useState } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Person, Lock, PhotoCamera } from '@mui/icons-material';

// Hooks & Logic
import { useProfileLogic } from '../../hooks/useProfileLogic';
import { usePasswordLogic } from '../../hooks/usePasswordLogic';

// Components
import { GeneralSettings } from '../../components/Profile/GeneralSettings.tsx';
import { PasswordSettings } from '../../components/Profile/PasswordSettings.tsx';

// Styles & Types
import '../../styles/profile/ProfileSettings.scss';
import type { ProfileContextType } from '../../types/profile';

const ProfileSettings: FC = () => {
    // 1. Context dan ma'lumotlarni olish
    const { user, refreshProfile } = useOutletContext<ProfileContextType>();

    // 2. Tab holati
    const [activeTab, setActiveTab] = useState<number>(0);

    // 3. Biznes mantiq (Hooks)
    const profileLogic = useProfileLogic(user, refreshProfile);
    const passwordLogic = usePasswordLogic();

    return (
        <Box className="profile-page-wrapper fade-in">
            <Toaster position="top-right" reverseOrder={false} />

            <Box className="glass-card">
                {/* --- Sidebar Section --- */}
                <Box className="sidebar">
                    <Box className="profile-preview">
                        <div className="avatar-container">
                            <Avatar
                                src={user?.profile_image_url || ''}
                                className="main-avatar"
                                sx={{
                                    bgcolor: user?.avatar
                                        ? 'transparent'
                                        : '#3b82f6',
                                }}
                            >
                                {!user?.avatar && user?.first_name?.[0]}
                            </Avatar>
                            <label className="camera-overlay">
                                <PhotoCamera fontSize="small" />
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) =>
                                        console.log(e.target.files?.[0])
                                    } // Keyinchalik upload mantiqi qo'shiladi
                                />
                            </label>
                        </div>
                        <Typography variant="h6" fontWeight={700} noWrap>
                            {user?.first_name} {user?.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            ID: {user?.id || 'Noma’lum'}
                        </Typography>
                    </Box>

                    <Tabs
                        orientation="vertical"
                        value={activeTab}
                        onChange={(_, v) => setActiveTab(v)}
                        className="settings-tabs"
                        sx={{ '& .MuiTabs-indicator': { display: 'none' } }}
                    >
                        <Tab
                            icon={<Person fontSize="small" />}
                            iconPosition="start"
                            label="Profil ma'lumotlari"
                        />
                        <Tab
                            icon={<Lock fontSize="small" />}
                            iconPosition="start"
                            label="Xavfsizlik & Parol"
                        />
                    </Tabs>
                </Box>

                {/* --- Content Area Section --- */}
                <Box className="content">
                    {activeTab === 0 ? (
                        <GeneralSettings
                            formData={profileLogic.formData}
                            onChange={profileLogic.handleFormChange}
                            onSubmit={profileLogic.handleProfileSubmit}
                            loading={profileLogic.loading}
                        />
                    ) : (
                        <PasswordSettings
                            formData={passwordLogic.passwordData}
                            onChange={passwordLogic.handlePasswordChange}
                            onSubmit={passwordLogic.handlePasswordSubmit}
                            loading={passwordLogic.loading}
                        />
                    )}
                </Box>
            </Box>

            {/* --- OTP Verification Modal --- */}
            <Dialog
                open={profileLogic.isVerifyModalOpen}
                onClose={() => profileLogic.setIsVerifyModalOpen(false)}
                slotProps={{
                    paper: {
                        className: 'otp-dialog',
                        sx: { borderRadius: '24px' },
                    },
                }}
            >
                <DialogTitle
                    sx={{ fontWeight: 800, textAlign: 'center', pt: 3 }}
                >
                    Emailni tasdiqlash
                </DialogTitle>
                <DialogContent>
                    <Typography
                        variant="body2"
                        sx={{
                            mb: 3,
                            color: 'text.secondary',
                            textAlign: 'center',
                        }}
                    >
                        Xavfsizlikni ta'minlash uchun emailingizga yuborilgan 6
                        xonali kodni kiriting.
                    </Typography>
                    <TextField
                        fullWidth
                        autoFocus
                        placeholder="000000"
                        variant="outlined"
                        slotProps={{
                            htmlInput: {
                                maxLength: 6,
                                style: {
                                    textAlign: 'center',
                                    letterSpacing: '12px',
                                    fontSize: '1.8rem',
                                    fontWeight: 900,
                                    color: '#3b82f6',
                                },
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
                    <Button
                        onClick={() => profileLogic.setIsVerifyModalOpen(false)}
                        sx={{ color: 'text.secondary', fontWeight: 600 }}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        variant="contained"
                        className="submit-btn"
                        sx={{ m: '0 !important', px: 4 }}
                    >
                        Tasdiqlash
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProfileSettings;
