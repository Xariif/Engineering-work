import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import userService from '../services/userService.js';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    CircularProgress,
    Divider,
    Avatar,
    Stack,
    Container
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import SaveIcon from '@mui/icons-material/Save';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await userService.getProfile();
                setFormData({
                    firstName: profileData.firstName || '',
                    lastName: profileData.lastName || '',
                    email: profileData.email || '',
                    phoneNumber: profileData.phoneNumber || ''
                });
            } catch (err) {
                if (err.response?.data?.errors) {
                    const errorMessages = Object.entries(err.response.data.errors)
                        .map(([field, messages]) => messages)
                        .flat();
                    errorMessages.forEach(message => {
                        showToast(message, 'error');
                    });
                } else {
                    showToast(err.message || 'Failed to load profile data', 'error');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [showToast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const updatedProfile = await userService.updateProfile(formData);
            updateUser(updatedProfile);
            showToast('Profile updated successfully', 'success');
        } catch (err) {
            if (err.response?.data?.errors) {
                const errorMessages = Object.entries(err.response.data.errors)
                    .map(([field, messages]) => messages)
                    .flat();
                errorMessages.forEach(message => {
                    showToast(message, 'error');
                });
            } else {
                showToast(err.message || 'Failed to update profile', 'error');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper 
                elevation={3} 
                sx={{ 
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                {/* Header Section with Gradient Background */}
                <Box
                    sx={{
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        p: 4,
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)',
                        }
                    }}
                >
                    <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        spacing={3} 
                        alignItems="center"
                        sx={{ position: 'relative', zIndex: 1 }}
                    >
                        <Avatar 
                            sx={{ 
                                width: 100, 
                                height: 100, 
                                bgcolor: 'rgba(255,255,255,0.2)',
                                border: '4px solid rgba(255,255,255,0.3)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }}
                        >
                            <PersonIcon sx={{ fontSize: 50 }} />
                        </Avatar>
                        <Box>
                            <Typography 
                                variant="h4" 
                                component="h1" 
                                gutterBottom 
                                sx={{ 
                                    fontWeight: 700,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                            >
                                Profile Settings
                            </Typography>
                            <Typography 
                                variant="subtitle1"
                                sx={{
                                    opacity: 0.9,
                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}
                            >
                                Manage your account information and preferences
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                {/* Form Content */}
                <Box sx={{ p: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            {/* Personal Information Section */}
                            <Grid item xs={12}>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        mb: 3,
                                        color: 'text.primary',
                                        fontWeight: 600
                                    }}
                                >
                                    Personal Information
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                endAdornment: <BadgeIcon sx={{ color: 'action.active' }} />,
                                            }}
                                            sx={{ 
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                endAdornment: <BadgeIcon sx={{ color: 'action.active' }} />,
                                            }}
                                            sx={{ 
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Contact Information Section */}
                            <Grid item xs={12}>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        mb: 3,
                                        color: 'text.primary',
                                        fontWeight: 600
                                    }}
                                >
                                    Contact Information
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            disabled                                          
                                            InputProps={{
                                                endAdornment: <EmailIcon sx={{ color: 'action.active' }} />,
                                            }}
                                            sx={{ 
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            InputProps={{
                                                endAdornment: <PhoneIcon sx={{ color: 'action.active' }} />,
                                            }}
                                            sx={{ 
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Fixed Position Save Button */}
                        <Box 
                            sx={{ 
                                position: 'sticky',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                bgcolor: 'background.paper',
                                borderTop: '1px solid',
                                borderColor: 'divider',
                                p: 3,
                                mt: 4,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                zIndex: 1,
                            }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={saving}
                                size="large"
                                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                sx={{ 
                                    minWidth: 200,
                                    height: 48,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    boxShadow: 2
                                }}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile; 