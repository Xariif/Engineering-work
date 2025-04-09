import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container, Link } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import accountService from "../services/accountService.js";
import {useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        accountService
            .login(email, password)
            .then((response) => {
                localStorage.setItem("authToken", response.token);
                localStorage.setItem(
                    "userDetails",
                    JSON.stringify({
                        firstName: response.firstName,
                        lastName: response.lastName,
                        phoneNumber: response.phoneNumber,
                        email: response.email,
                        role: response.role,
                    })
                );
                navigate("/");
                showToast("Login successful", "success");
            })
            .catch((error) => {
                const errorMessage = error.message || "An error occurred during login.";
                showToast(errorMessage, "error");
            });
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
                    <LockOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />
                </Box>
                <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
                    Login
                </Typography>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
                <Link
                    variant="body2"
                    sx={{ textAlign: "center", marginTop: 1, color: "primary.main", textDecoration: "none" }}
                    onClick={() => navigate("/forgot-password")}
                >
                    Forgot Password?
                </Link>
                <Typography variant="body2" textAlign="center" color="text.secondary">
                    Don't have an account?{" "}
                    <Link
                        variant="body2"
                        sx={{ color: "primary.main", textDecoration: "none" }}
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;
