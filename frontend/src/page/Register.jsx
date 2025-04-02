import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [token, setToken] = useState("");

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");
        if (tokenFromUrl) {
            //ask api if the token is valid
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Name:", name);
        console.log("Surname:", surname);
        console.log("Phone Number:", phoneNumber);
        console.log("Token:", token);
        // Add logic to send the data to the server with the token in the header
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
                <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
                    Register
                </Typography>
                <TextField
                    label="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Surname"
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
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
            </Box>
        </Container>
    );
};

export default Register;