import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined"; // Import the arrow icon

const ForgotPassword = () => {
	const [email, setEmail] = useState("");

	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		navigate("/login");

		setEmail("");
	};

	const handleBack = () => {
		// Navigate back to the previous page or login page
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
					<VpnKeyOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />
				</Box>
				<Typography variant="h4" component="h1" textAlign="center" gutterBottom>
					Forgot Password
				</Typography>
				<Typography variant="body2" textAlign="center" color="text.secondary" gutterBottom>
					Enter your email address and we'll send you a link to reset your password.
				</Typography>
				<TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
				<Button type="submit" variant="contained" color="primary" fullWidth>
					Send Reset Link
				</Button>
				<Button
					variant="outlined"
					color="secondary"
					fullWidth
					onClick={handleBack}
					startIcon={<ArrowBackIosNewOutlinedIcon />} // Add the arrow icon
				>
					Back
				</Button>
			</Box>
		</Container>
	);
};

export default ForgotPassword;
