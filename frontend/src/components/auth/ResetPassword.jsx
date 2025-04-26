import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Container, CircularProgress } from "@mui/material";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { useToast } from "../../context/ToastContext.jsx";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [email, setEmail] = useState(searchParams.get('email'));
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!token) {
            showToast("Invalid reset token", "error");
            navigate("/forgot-password");
            return;
        }
        
        if (password !== confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }
        
        if (password.length < 8) {
            showToast("Password must be at least 8 characters long", "error");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            await userService.resetPassword(token, password, confirmPassword, email);
            showToast("Password reset successful", "success");
            navigate("/login");
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to reset password", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate("/login");
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                    maxWidth: 400,
                    padding: 4,
                    boxShadow: 4,
                    borderRadius: 3,
                    backgroundColor: "background.paper",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 2,
                    }}
                >
                    <LockResetOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />
                </Box>
                <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
                    Reset Password
                </Typography>
                <Typography variant="body2" textAlign="center" color="text.secondary" gutterBottom>
                    Enter your email and new password below.
                </Typography>
                
                <TextField 
                    label="Email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    fullWidth 
                    disabled
                />
                
                <TextField 
                    label="New Password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    fullWidth 
                />
                
                <TextField 
                    label="Confirm Password" 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    fullWidth 
                />
                
                <Button 
                    color="primary" 
                    type="submit"
                    disabled={isSubmitting}
                    fullWidth 
                >
                    {isSubmitting ? <CircularProgress size={24} /> : "Reset Password"}
                </Button>
                
                <Button 
                    color="secondary" 
                    fullWidth 
                    onClick={handleBack} 
                    startIcon={<ArrowBackIosNewOutlinedIcon />}
                >
                    Back to Login
                </Button>
            </Box>
        </Container>
    );
};

export default ResetPassword; 