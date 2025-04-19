import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, Container, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import SecurityIcon from "@mui/icons-material/Security";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const Layout = ({ onThemeToggle, themeMode }) => {
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const [drawerOpen, setDrawerOpen] = useState(false);
	const location = useLocation();

	// Get user role from localStorage
	const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
	const userRole = userDetails.role || "";

	// Define navigation links based on user role
	const navLinks = [
		{ to: "/", icon: <DashboardIcon />, label: "Dashboard" },
		...(userRole === "Tenant" ? [{ to: "/turnover", icon: <TrendingUpIcon />, label: "Turnover" }] : []),
		...(userRole === "Manager"
			? [
					{ to: "/reports", icon: <BarChartIcon />, label: "Reports" },
					{ to: "/permissions", icon: <SecurityIcon />, label: "Permissions" },
					{ to: "/turnover-manager", icon: <TrendingUpIcon />, label: "Turnover Manager" },
			  ]
			: []),
		{ to: "/profile", icon: <PersonIcon />, label: "Profile" },
		{ to: "/logout", icon: <LogoutIcon /> },
	];

	return (
		<Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
			<AppBar position="static">
				<Container maxWidth="lg" sx={{ borderRadius: "none" }}>
					<Toolbar>
						<Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
							<IconButton 
								edge="start" 
								color="inherit" 
								component={Link} 
								to="/" 
								sx={{ mr: 2 }}
							>
								<HomeIcon />
							</IconButton>
							<Typography variant="h6" component="div">
								Engineering Work
							</Typography>
						</Box>
						
						<Tooltip title={`Switch to ${themeMode === "light" ? "dark" : "light"} mode`}>
							<IconButton onClick={onThemeToggle} color="inherit" sx={{ mx: 1 }}>
								{themeMode === "light" ? <Brightness4 /> : <Brightness7 />}
							</IconButton>
						</Tooltip>
						
						{isSmallScreen ? (
							<>
								<IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
									<MenuIcon />
								</IconButton>
								<Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
									<List sx={{ width: 250 }}>
										{navLinks.map((link) => (
											<ListItem 
												button 
												component={Link} 
												to={link.to} 
												key={link.to} 
												onClick={() => setDrawerOpen(false)}
												sx={{ 
													backgroundColor: location.pathname === link.to ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
													"&:hover": { backgroundColor: 'rgba(0, 0, 0, 0.12)' } 
												}}
											>
												<ListItemIcon sx={{ minWidth: 40, color: location.pathname === link.to ? 'primary.main' : 'inherit' }}>
													{link.icon}
												</ListItemIcon>
												<ListItemText 
													primary={link.label} 
													primaryTypographyProps={{ 
														fontWeight: location.pathname === link.to ? 'bold' : 'normal' 
													}} 
												/>
											</ListItem>
										))}
									</List>
								</Drawer>
							</>
						) : (
							<Box sx={{ display: 'flex' }}>
								{navLinks.map((link, index) => (
									<Tooltip title={link.label} key={link.to}>
										<IconButton 
											color="inherit" 
											component={Link} 
											to={link.to} 
											sx={{ 
												mx: 0.5,
												...(link.to === "/logout"  && { ml: 3 }),
												backgroundColor: location.pathname === link.to ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
												"&:hover": { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
											}}
										>
											{link.icon}
										</IconButton>
									</Tooltip>
								))}
							</Box>
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
