import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Container, CircularProgress } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { useToast } from "../context/ToastContext.jsx";
import apiService from "../services/apiService.js";

const ConfirmAccount = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !email) {
            setLoading(false);
            setError("Invalid confirmation link. Token or email is missing.");
            return;
        }

        const confirmEmail = async () => {
            try {
                await apiService.post("account/confirm-email", { token, email });
                setSuccess(true);
                showToast("Your account has been successfully activated!", "success");
            } catch (error) {
                setError(error.response?.data?.message || "Failed to confirm email. Please try again.");
                showToast(error.response?.data?.message || "Failed to confirm email", "error");
            } finally {
                setLoading(false);
            }
        };

        confirmEmail();
    }, [token, email, showToast]);

    const handleLogin = () => {
        navigate("/login");
    };

    const handleResendConfirmation = async () => {
        if (!email) return;
        
        try {
            setLoading(true);
            await apiService.post("account/resend-confirmation-email", { email });
            showToast("Confirmation email has been resent to your email address", "success");
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to resend confirmation email", "error");
        } finally {
            setLoading(false);
        }
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
                    textAlign: "center",
                }}
            >
                {loading ? (
                    <>
                        <CircularProgress sx={{ margin: "0 auto", marginY: 4 }} />
                        <Typography variant="body1">Confirming your email...</Typography>
                    </>
                ) : success ? (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 2,
                            }}
                        >
                            <VerifiedUserOutlinedIcon sx={{ fontSize: 60, color: "success.main" }} />
                        </Box>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Email Confirmed!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Your account has been activated successfully. You can now login to your account.
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            onClick={handleLogin}
                        >
                            Login to Your Account
                        </Button>
                    </>
                ) : (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 2,
                            }}
                        >
                            <VerifiedUserOutlinedIcon sx={{ fontSize: 60, color: "error.main" }} />
                        </Box>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Confirmation Failed
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            {error || "There was a problem confirming your email."}
                        </Typography>
                        {email && (
                            <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth 
                                onClick={handleResendConfirmation}
                                disabled={loading}
                            >
                                Resend Confirmation Email
                            </Button>
                        )}
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            fullWidth 
                            onClick={handleLogin}
                            sx={{ mt: 1 }}
                        >
                            Back to Login
                        </Button>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default ConfirmAccount; 