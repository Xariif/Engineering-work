import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const Dashboard = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                gap: 4,
                padding: 4,
            }}
        >
            {/* Welcome Section */}
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: "100%",
                    maxWidth: 800,
                    textAlign: "center",
                }}
            >
                <Typography variant="h3" component="h1" gutterBottom>
                    Welcome to the Dashboard
                </Typography>
                <Typography variant="body1">
                    This is your central hub for managing the system. Here, you can find recent updates, project
                    information, and more.
                </Typography>
                <img
                    src="https://via.placeholder.com/800x200"
                    alt="Dashboard Overview"
                    style={{ marginTop: 16, width: "100%", borderRadius: 8 }}
                />
            </Paper>

            {/* Project Info Section */}
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: "100%",
                    maxWidth: 800,
                }}
            >
                <Typography variant="h4" component="h2" gutterBottom>
                    About the Project
                </Typography>
                <Typography variant="body1" gutterBottom>
                    This project is designed to streamline tenant and mall management. It provides tools for managing
                    accounts, roles, and stores, ensuring a seamless experience for both managers and tenants.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Key Features:
                </Typography>
                <ul style={{ textAlign: "left", margin: "0 auto", maxWidth: "600px" }}>
                    <li>Role-based access control for Managers and Tenants</li>
                    <li>Store and tenant management</li>
                    <li>Secure authentication and authorization</li>
                    <li>Reports and analytics for performance tracking</li>
                    <li>Responsive design for mobile and desktop</li>
                </ul>
                <img
                    src="https://via.placeholder.com/800x200"
                    alt="Project Features"
                    style={{ marginTop: 16, width: "100%", borderRadius: 8 }}
                />
            </Paper>
        </Box>
    );
};

export default Dashboard;