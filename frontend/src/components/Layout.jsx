import React from "react";
import { AppBar, Toolbar, Typography, Box, Container, Button, IconButton } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import SecurityIcon from "@mui/icons-material/Security"; // Icon for Permissions

const Layout = () => {
	return (
		<Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
			{/* Header */}
			<AppBar position="static">
				<Toolbar>
					{/* Logo */}
					<IconButton edge="start" color="inherit" component={Link} to="/" sx={{ mr: 2 }}>
						<HomeIcon />
					</IconButton>

					{/* Title */}
					<Typography variant="h6" sx={{ flexGrow: 1 }}>
						Engineering Work
					</Typography>

					{/* Navigation Links */}
					<Button color="inherit" component={Link} to="/">
						<DashboardIcon sx={{ mr: 1 }} />
						Dashboard
					</Button>
					<Button color="inherit" component={Link} to="/turnover">
						<TrendingUpIcon sx={{ mr: 1 }} />
						Turnover
					</Button>
					<Button color="inherit" component={Link} to="/reports">
						<BarChartIcon sx={{ mr: 1 }} />
						Reports
					</Button>
					<Button color="inherit" component={Link} to="/permissions">
						<SecurityIcon sx={{ mr: 1 }} />
						Permissions
					</Button>
					<Button color="inherit" component={Link} to="/login">
						<LoginIcon sx={{ mr: 1 }} />
						Login
					</Button>
					<Button color="inherit" component={Link} to="/logout">
						<LogoutIcon sx={{ mr: 1 }} />
						Logout
					</Button>
				</Toolbar>
			</AppBar>

			{/* Main Content */}
			<Container component="main" sx={{ flexGrow: 1, py: 3 }}>
				<Outlet />
			</Container>

			{/* Footer */}
			<Box component="footer" sx={{ py: 2, textAlign: "center", backgroundColor: "background.default" }}>
				<Typography variant="body2" color="text.secondary">
					© 2025 Engineering Work. All rights reserved.
				</Typography>
			</Box>
		</Box>
	);
};

export default Layout;
