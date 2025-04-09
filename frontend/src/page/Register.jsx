import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined"; // Import the registration icon
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined"; // Import the back arrow icon
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";
import accountService from "../services/accountService.js";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }

        accountService
            .register(email, password, confirmPassword, firstName, lastName, phoneNumber)
            .then(() => {
                showToast("Registration successful!", "success");
                navigate("/login");
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.Message || "An error occurred during registration.";
                showToast(errorMessage, "error");
            });
    };

    const handleBack = () => {
        navigate("/login");
    };

    return (
        <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                    maxWidth: 400,
                    padding: 3,
                    boxShadow: 3,
                    borderRadius: 2,
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
                    <PersonAddOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />
                </Box>
                <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
                    Register
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
                <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="First Name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Last Name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Phone Number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    fullWidth
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Register
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={handleBack}
                    startIcon={<ArrowBackIosNewOutlinedIcon />} // Add the back arrow icon
                >
                    Back
                </Button>
            </Box>
        </Container>
    );
};

export default Register;