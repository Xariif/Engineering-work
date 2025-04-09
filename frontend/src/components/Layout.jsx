import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, Container, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import SecurityIcon from "@mui/icons-material/Security";
import MenuIcon from "@mui/icons-material/Menu";

const Layout = () => {
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const [drawerOpen, setDrawerOpen] = useState(false);

	const navLinks = [
		{ to: "/", icon: <DashboardIcon />, label: "Dashboard" },
		{ to: "/turnover", icon: <TrendingUpIcon />, label: "Turnover" },
		{ to: "/reports", icon: <BarChartIcon />, label: "Reports" },
		{ to: "/permissions", icon: <SecurityIcon />, label: "Permissions" },
		{ to: "/logout", icon: <LogoutIcon />, label: "Logout" },
	];

	return (
		<Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
			<AppBar position="static">
				<Container maxWidth="lg" sx={{borderRadius: 'none'}}>
					<Toolbar>
						<IconButton edge="start" color="inherit" component={Link} to="/" sx={{ mr: 2 }}>
							<HomeIcon />
						</IconButton>
						<Typography variant="h6" sx={{ flexGrow: 1 }}>
							Engineering Work
						</Typography>
						{isSmallScreen ? (
							<>
								<IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
									<MenuIcon />
								</IconButton>
								<Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
									<List>
										{navLinks.map((link) => (
											<ListItem button component={Link} to={link.to} key={link.label} onClick={() => setDrawerOpen(false)}>
												<ListItemIcon>{link.icon}</ListItemIcon>
												<ListItemText primary={link.label} />
											</ListItem>
										))}
									</List>
								</Drawer>
							</>
						) : (
							navLinks.map((link) => (
								<Button color="inherit" component={Link} to={link.to} key={link.label}>
									{link.icon}
									{link.label}
								</Button>
							))
						)}
					</Toolbar>
				</Container>
			</AppBar>

			<Container maxWidth="lg" sx={{ flexGrow: 1, py: 3 }}>
				<Outlet />
			</Container>

			<Box component="footer" sx={{ py: 2, textAlign: "center", backgroundColor: "background.default" }}>
				<Container maxWidth="lg">
					<Typography variant="body2" color="text.secondary">
						© 2025 Engineering Work. All rights reserved.
					</Typography>

					<Typography variant="body2" color="text.secondary">
						Created by Jakub Filiks
					</Typography>
				</Container>
			</Box>
		</Box>
	);
};

export default Layout;
