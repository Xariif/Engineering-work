import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Container, Grid, FormControl, InputLabel, Select, MenuItem, TextField, Tab, Tabs, CircularProgress, Alert, Button, Chip, OutlinedInput, Checkbox, ListItemText, ButtonGroup, Card, CardContent, Divider, IconButton, Tooltip, useTheme, alpha } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StorefrontIcon from "@mui/icons-material/Storefront";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import LineChartSection from "./components/LineChartSection.jsx";
import BarChartSection from "./components/BarChartSection.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import reportService from "../../services/reportService.js";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250
		}
	}
};

const Reports = () => {
	const theme = useTheme();
	const { user } = useAuth();
	const { showToast } = useToast();
	const [loading, setLoading] = useState(true);
	const [malls, setMalls] = useState([]);
	const [tenants, setTenants] = useState([]);
	const [selectedMall, setSelectedMall] = useState("");
	const [selectedTenants, setSelectedTenants] = useState([]);
	const [startDate, setStartDate] = useState(startOfMonth(subMonths(new Date(), 6)));
	const [endDate, setEndDate] = useState(endOfMonth(new Date()));
	const [chartTab, setChartTab] = useState(0);
	const [error, setError] = useState(null);
	const [loadingTenants, setLoadingTenants] = useState(false);

	// Chart data
	const [barChartData, setBarChartData] = useState(null);
	const [lineChartData, setLineChartData] = useState(null);
	const [fetchingChartData, setFetchingChartData] = useState(false);

	// Fetch malls on component mount
	useEffect(() => {
		fetchMalls();
	}, []);

	// Fetch tenants when mall changes
	useEffect(() => {
		if (selectedMall) {
			fetchTenants();
		}
	}, [selectedMall]);

	// Fetch chart data when mall, tenants, or date range changes
	useEffect(() => {
		if (selectedMall) {
			fetchChartData();
		}
	}, [selectedMall, selectedTenants, startDate, endDate]);

	const fetchMalls = async () => {
		setLoading(true);
		try {
			const mallData = await reportService.getMalls();

			if (mallData && Array.isArray(mallData)) {
				setMalls(mallData);

				// Set first mall as default if available
				if (mallData.length > 0) {
					setSelectedMall(mallData[0].id);
				}
				setError(null);
			} else {
				setError("Invalid data format received from server");
				showToast("Failed to load mall data", "error");
			}
		} catch (err) {
			console.error("Error fetching malls:", err);
			setError("Failed to load mall data. Please try again later or check if you are logged in.");
			showToast("Failed to load mall data", "error");
		} finally {
			setLoading(false);
		}
	};

	const fetchTenants = async () => {
		setLoadingTenants(true);
		try {
			const tenantData = await reportService.getTenantsByMall(selectedMall);

			if (tenantData && Array.isArray(tenantData)) {
				setTenants(tenantData);
				// Select all tenants by default
				setSelectedTenants(tenantData.map((tenant) => tenant.id));
				setError(null);
			} else {
				setError("Invalid tenant data format received from server");
				showToast("Failed to load tenant data", "error");
			}
		} catch (err) {
			console.error("Error fetching tenants:", err);
			setError("Failed to load tenant data.");
			showToast("Failed to load tenant data", "error");
		} finally {
			setLoadingTenants(false);
		}
	};

	const fetchChartData = async () => {
		if (!selectedMall) return;

		setFetchingChartData(true);
		const formattedStartDate = format(startDate, "yyyy-MM-dd");
		const formattedEndDate = format(endDate, "yyyy-MM-dd");

		try {
			// Fetch data for all chart types
			const [barData, lineData] = await Promise.all([reportService.getBarChartData(selectedMall, formattedStartDate, formattedEndDate, selectedTenants), reportService.getLineChartData(selectedMall, formattedStartDate, formattedEndDate, selectedTenants)]);

			setBarChartData(barData);
			console.log("lineData",lineData);
			setLineChartData(lineData);
			setError(null);
		} catch (err) {
			console.error("Error fetching chart data:", err);
			setError("Failed to load chart data. Please try again later.");
			showToast("Failed to load chart data", "error");
		} finally {
			setFetchingChartData(false);
		}
	};

	const handleMallChange = (event) => {
		setSelectedMall(event.target.value);
	};

	const handleTenantChange = (event) => {
		const {
			target: { value }
		} = event;
		setSelectedTenants(
			// On autofill we get a stringified value.
			typeof value === "string" ? value.split(",") : value
		);
	};

	const handleStartMonthChange = (date) => {
		setStartDate(startOfMonth(date));
	};

	const handleEndMonthChange = (date) => {
		setEndDate(endOfMonth(date));
	};

	const handleTabChange = (event, newValue) => {
		setChartTab(newValue);
	};

	const handleRetry = () => {
		if (!selectedMall) {
			fetchMalls();
		} else {
			fetchChartData();
		}
	};

	const getTenantNameById = (id) => {
		const tenant = tenants.find((t) => t.id === id);
		return tenant ? tenant.name : `Tenant ${id}`;
	};

	const selectAllTenants = () => {
		setSelectedTenants(tenants.map((tenant) => tenant.id));
	};

	const deselectAllTenants = () => {
		setSelectedTenants([]);
	};

	const selectedMallName = malls.find((m) => m.id === selectedMall)?.name || "";

	if (loading) {
		return (
			<Container maxWidth="lg" sx={{ py: 4, display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
				<CircularProgress />
			</Container>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Typography
				variant="h4"
				gutterBottom
				sx={{
					textAlign: "center",
					fontWeight: "bold",
					mb: 3,
					color: "primary.main"
				}}
			>
				Mall Performance Reports
			</Typography>

			{error && (
				<Alert
					severity="error"
					sx={{ mb: 3 }}
					action={
						<Button color="inherit" size="small" onClick={handleRetry}>
							Retry
						</Button>
					}
				>
					{error}
				</Alert>
			)}

			{/* Filter Card */}
			<Card
				elevation={2}
				sx={{
					mb: 4,
					borderRadius: 2,
					background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
					overflow: "visible"
				}}
			>
				<Box
					sx={{
						p: 2,
						display: "flex",
						alignItems: "center",
						borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
						background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.7)})`
					}}
				>
					<FilterAltIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
					<Typography variant="h6" sx={{ fontWeight: "medium", flex: 1 }}>
						Report Filters
					</Typography>
					{selectedMallName && <Chip icon={<HomeWorkIcon />} label={selectedMallName} color="primary" variant="outlined" sx={{ fontWeight: "medium", ml: 1 }} />}
				</Box>

				<CardContent sx={{ p: 3 }}>
					<Grid container spacing={3}>
						{/* Mall Selection */}
						<Grid item xs={12} md={4}>
							<Box sx={{ mb: 1 }}>
								<Typography variant="subtitle2" color="primary" sx={{ display: "flex", alignItems: "center" }}>
									<HomeWorkIcon fontSize="small" sx={{ mr: 0.5 }} />
									Mall Selection
								</Typography>
							</Box>
							<FormControl
								fullWidth
								variant="outlined"
								sx={{
									"& .MuiOutlinedInput-root": {
										borderRadius: 2,
										bgcolor: "background.paper",
										boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
									}
								}}
							>
								<InputLabel id="mall-select-label">Select Mall</InputLabel>
								<Select variant="filled" labelId="mall-select-label" id="mall-select" value={selectedMall} onChange={handleMallChange} label="Select Mall">
									{malls.map((mall) => (
										<MenuItem key={mall.id} value={mall.id}>
											{mall.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						{/* Month Range Selection */}
						<Grid item xs={12} md={8}>
							<Box sx={{ mb: 1 }}>
								<Typography variant="subtitle2" color="primary" sx={{ display: "flex", alignItems: "center" }}>
									<CalendarMonthIcon fontSize="small" sx={{ mr: 0.5 }} />
									Date Range
								</Typography>
							</Box>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DatePicker
											label="Start Month"
											views={["year", "month"]}
											value={startDate}
											onChange={handleStartMonthChange}
											slotProps={{
												textField: {
													fullWidth: true,
													sx: {
														"& .MuiOutlinedInput-root": {
															borderRadius: 2,
															bgcolor: "background.paper",
															boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
														}
													}
												}
											}}
											maxDate={endDate}
										/>
									</LocalizationProvider>
								</Grid>

								<Grid item xs={12} sm={6}>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DatePicker
											label="End Month"
											views={["year", "month"]}
											value={endDate}
											onChange={handleEndMonthChange}
											slotProps={{
												textField: {
													fullWidth: true,
													sx: {
														"& .MuiOutlinedInput-root": {
															borderRadius: 2,
															bgcolor: "background.paper",
															boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
														}
													}
												}
											}}
											minDate={startDate}
											maxDate={new Date()}
										/>
									</LocalizationProvider>
								</Grid>
							</Grid>
						</Grid>

						{/* Tenant Selection */}
						<Grid item xs={12}>
							<Divider sx={{ my: 1 }} />
							<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
								<Typography variant="subtitle2" color="primary" sx={{ display: "flex", alignItems: "center" }}>
									<StorefrontIcon fontSize="small" sx={{ mr: 0.5 }} />
									Tenant Selection
								</Typography>
								<Box>
									<Tooltip title="Select All Tenants">
										<IconButton size="small" onClick={selectAllTenants} disabled={loadingTenants || selectedTenants.length === tenants.length} color="primary" sx={{ mr: 1 }}>
											<CheckBoxIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title="Deselect All Tenants">
										<IconButton size="small" onClick={deselectAllTenants} disabled={loadingTenants || selectedTenants.length === 0} color="primary">
											<CheckBoxOutlineBlankIcon />
										</IconButton>
									</Tooltip>
								</Box>
							</Box>
							<FormControl
								fullWidth
								variant="outlined"
								sx={{
									"& .MuiOutlinedInput-root": {
										borderRadius: 2,
										bgcolor: "background.paper",
										boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
									}
								}}
							>
								<InputLabel id="tenant-select-label">Tenants</InputLabel>
								<Select
									labelId="tenant-select-label"
									id="tenant-select"
									multiple
									value={selectedTenants}
									onChange={handleTenantChange}
									input={<OutlinedInput label="Tenants" />}
									renderValue={(selected) => (
										<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>{selected.length === 0 ? <Chip label="No tenants selected" color="error" size="small" /> : selected.length === tenants.length ? <Chip label="All Tenants" color="primary" size="small" variant="filled" /> : <Chip label={`${selected.length} tenants selected`} color="primary" size="small" icon={<StorefrontIcon />} />}</Box>
									)}
									MenuProps={MenuProps}
									disabled={loadingTenants}
								>
									{loadingTenants ? (
										<MenuItem disabled>
											<CircularProgress size={20} sx={{ mr: 1 }} />
											Loading tenants...
										</MenuItem>
									) : (
										tenants.map((tenant) => (
											<MenuItem key={tenant.id} value={tenant.id}>
												<Checkbox checked={selectedTenants.indexOf(tenant.id) > -1} />
												<ListItemText primary={tenant.name} secondary={tenant.category} primaryTypographyProps={{ variant: "body2" }} secondaryTypographyProps={{ variant: "caption" }} />
											</MenuItem>
										))
									)}
								</Select>
							</FormControl>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* Chart Tabs and Content */}
			<Paper
				elevation={3}
				sx={{
					borderRadius: 2,
					overflow: "hidden",
					boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
				}}
			>
				<Tabs
					value={chartTab}
					onChange={handleTabChange}
					variant="fullWidth"
					sx={{
						borderBottom: 1,
						borderColor: "divider",
						"& .MuiTabs-indicator": {
							height: 3,
							borderRadius: "3px 3px 0 0"
						},
						"& .MuiTab-root": {
							py: 2,
							fontWeight: "medium"
						}
					}}
				>
					<Tab label="Bar Chart" />
					<Tab label="Line Chart" />
				</Tabs>

				<Box sx={{ p: 3 }}>
					{fetchingChartData ? (
						<Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
							<CircularProgress />
						</Box>
					) : (
						<>
							{chartTab === 0 && <BarChartSection data={barChartData} />}
							{chartTab === 1 && <LineChartSection data={lineChartData} />}
						</>
					)}
				</Box>
			</Paper>
		</Container>
	);
};

export default Reports;
