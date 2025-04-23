import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";
import EmailIcon from "@mui/icons-material/Email";
import accountService from "../services/accountService.js";

const ResendActivation = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast("Please enter your email address", "error");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
    await accountService.resendConfirmationEmail(email);
      showToast("Activation email has been sent to your email address", "success");
      navigate("/login");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to send activation email", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <EmailIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
              Resend Activation Email
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Enter your email address below and we'll send you a new activation link.
            </Typography>
          </Box>

          <TextField
            label="Email Address"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{ py: 1.5 }}
          >
            {isSubmitting ? "Sending..." : "Send Activation Email"}
          </Button>

          <Button
            variant="text"
            onClick={() => navigate("/login")}
            sx={{ textTransform: "none" }}
          >
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResendActivation;