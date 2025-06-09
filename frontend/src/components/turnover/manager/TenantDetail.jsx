import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Grid, CircularProgress, Button, Paper, Typography, Divider } from "@mui/material";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useToast } from "../../../context/ToastContext.jsx";
import accessService from "../../../services/accessService.js";
import turnoverService from "../../../services/turnoverService.js";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import TenantHeader from "./components/TenantHeader.jsx";
import TurnoverSummary from "./components/TurnoverSummary.jsx";
import UserAccessList from "./components/UserAccessList.jsx";
import TurnoverHistory from "./components/TurnoverHistory.jsx";
import TurnoverDialogs from "./components/TurnoverDialogs.jsx";
import AddTurnoverDialog from "./components/AddTurnoverDialog.jsx";




const TenantDetail = () => {
	const { tenantId } = useParams();
	const { user } = useAuth();
	const { showToast } = useToast();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [tenant, setTenant] = useState(null);
	const [turnoverData, setTurnoverData] = useState([]);
	const [totalTurnover, setTotalTurnover] = useState(0);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [selectedTurnover, setSelectedTurnover] = useState(null);
	const [editTurnoverValue, setEditTurnoverValue] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	const [newTurnoverData, setNewTurnoverData] = useState({
		date: format(new Date(), "yyyy-MM-dd"),
		value: ""
	});

	// Check user role
	const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
	const userRole = userDetails.role || "";

	// Use useMediaQuery inside a custom hook to ensure it works with SSR
	const useIsSmallScreen = () => {
		const [isSmall, setIsSmall] = useState(false);
		
		useEffect(() => {
			const mediaQuery = window.matchMedia('(max-width: 600px)');
			setIsSmall(mediaQuery.matches);
			
			const handler = (e) => setIsSmall(e.matches);
			mediaQuery.addEventListener('change', handler);
			return () => mediaQuery.removeEventListener('change', handler);
		}, []);
		
		return isSmall;
	};
	
	const isSmallScreen = useIsSmallScreen();

	useEffect(() => {
		if (userRole !== "Manager") {
			showToast("Access denied. Manager role required.", "error");
			navigate("/");
			return;
		}

		fetchTenantData();
	}, [tenantId, userRole, navigate, showToast]);

	const fetchTenantInfo = async () => {
		try {
			// Step 1: Get all mall data to find the tenant
			const accessData = await accessService.getAccessData();
			if (!accessData || !accessData.malls) {
				throw new Error("Failed to fetch mall data");
			}

			// Find the tenant in all malls
			let foundTenant = null;
			let parentMall = null;

			for (const mall of accessData.malls) {
				const tenant = mall.stores.find((store) => store.id === parseInt(tenantId));
				if (tenant) {
					foundTenant = tenant;
					parentMall = { name: mall.name, address: mall.address };
					break;
				}
			}

			if (!foundTenant) {
				throw new Error("Tenant not found");
			}

			foundTenant.mall = parentMall;
			setTenant(foundTenant);
			return true;
		} catch (error) {
			console.error("Error fetching tenant data:", error);
			showToast(error.message || "Failed to load tenant data", "error");
			navigate("/turnover-manager");
			return false;
		}
	};

	const fetchTurnoverInfo = async () => {
		try {
			const turnovers = await turnoverService.getTurnoversByStore(tenantId);
			setTurnoverData(turnovers);
			
			// Get total turnover
			const totalResponse = await turnoverService.getTotalTurnover(tenantId);
			if (totalResponse && totalResponse.total !== undefined) {
				setTotalTurnover(totalResponse.total);
			}
			return true;
		} catch (err) {
			console.error("Error fetching turnover data:", err);
			showToast("Could not load turnover data", "error");
			return false;
		}
	};

	const fetchTenantData = async () => {
		setLoading(true);
		const tenantSuccess = await fetchTenantInfo();
		
		if (tenantSuccess) {
			await fetchTurnoverInfo();
		}
		
		setLoading(false);
	};

	const handleBackClick = () => {
		navigate("/turnover-manager");
	};

	const formatCurrency = useCallback((value) => {
		return new Intl.NumberFormat("en-CA", {
			style: "currency",
			currency: "EUR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(value);
	}, []);

	// Group turnovers hierarchically by year and month
	const organizeByYearAndMonth = useCallback((turnovers) => {
		const organized = {};

		turnovers.forEach((turnover) => {
			const date = new Date(turnover.date);
			const year = date.getFullYear().toString();
			const month = format(date, "MMMM");

			if (!organized[year]) {
				organized[year] = {};
			}

			if (!organized[year][month]) {
				organized[year][month] = [];
			}

			organized[year][month].push(turnover);
		});

		return organized;
	}, []);

	// Calculate total for each year - memoized to avoid recalculations
	const calculateYearlyTotals = useCallback((organizedData) => {
		const yearlyTotals = {};

		Object.keys(organizedData).forEach((year) => {
			yearlyTotals[year] = 0;

			Object.keys(organizedData[year]).forEach((month) => {
				const monthlyTotal = organizedData[year][month].reduce((total, turnover) => total + turnover.value, 0);
				yearlyTotals[year] += monthlyTotal;
			});
		});

		return yearlyTotals;
	}, []);

	// Calculate monthly totals for a specific year - memoized
	const calculateMonthlyTotals = useCallback((yearData) => {
		const monthlyTotals = {};

		Object.keys(yearData).forEach((month) => {
			monthlyTotals[month] = yearData[month].reduce((total, turnover) => total + turnover.value, 0);
		});

		return monthlyTotals;
	}, []);

	// Add a function to calculate year-over-year percentage change, excluding current year
	const calculateYearOverYearChange = useCallback((yearlyTotals) => {
		const changes = {};
		const years = Object.keys(yearlyTotals).sort((a, b) => parseInt(b) - parseInt(a));
		const currentYear = new Date().getFullYear().toString();
		
		for (let i = 0; i < years.length; i++) {
			const year = years[i];
			const prevYear = years[i + 1]; // Next in array is actually previous year since we sorted desc
			
			// Skip current year
			if (year === currentYear) {
				changes[year] = null;
				continue;
			}
			
			if (prevYear) {
				const yearTotal = yearlyTotals[year];
				const prevTotal = yearlyTotals[prevYear];
				
				if (prevTotal === 0) {
					changes[year] = 100; // Avoid division by zero
				} else {
					const percentChange = ((yearTotal - prevTotal) / prevTotal) * 100;
					changes[year] = percentChange;
				}
			} else {
				changes[year] = null; // No previous year to compare
			}
		}
		
		return changes;
	}, []);

	// Add handlers for edit and delete
	const handleEditClick = useCallback((turnover) => {
		setSelectedTurnover(turnover);
		setEditTurnoverValue(turnover.value.toString());
		setEditDialogOpen(true);
	}, []);

	const handleDeleteClick = useCallback((turnover) => {
		setSelectedTurnover(turnover);
		setDeleteDialogOpen(true);
	}, []);

	const handleEditDialogClose = useCallback(() => {
		setEditDialogOpen(false);
		setSelectedTurnover(null);
	}, []);

	const handleDeleteDialogClose = useCallback(() => {
		setDeleteDialogOpen(false);
		setSelectedTurnover(null);
	}, []);

	const handleTurnoverUpdate = useCallback(async () => {
		if (!selectedTurnover || !editTurnoverValue) {
			return;
		}

		try {
			const updatedTurnover = await turnoverService.updateTurnover(selectedTurnover.id, {
				tenantId: parseInt(tenantId),
				value: parseFloat(editTurnoverValue),
				date: selectedTurnover.date
			});

			// Update local state instead of refreshing the entire page
			setTurnoverData(prevData => 
				prevData.map(item => 
					item.id === selectedTurnover.id 
						? {...item, value: parseFloat(editTurnoverValue)} 
						: item
				)
			);
			
			// Update total turnover
			setTotalTurnover(prevTotal => 
				prevTotal - selectedTurnover.value + parseFloat(editTurnoverValue)
			);
			
			showToast("Turnover updated successfully", "success");
			
			// Close dialog
			handleEditDialogClose();
		} catch (error) {
			console.error("Error updating turnover:", error);
			showToast(error?.message || "Failed to update turnover", "error");
		}
	}, [selectedTurnover, editTurnoverValue, tenantId, showToast, handleEditDialogClose]);

	const handleTurnoverDelete = useCallback(async () => {
		if (!selectedTurnover) {
			return;
		}

		try {
			setIsDeleting(true);
			await turnoverService.deleteTurnover(selectedTurnover.id);
			
			// Update the local state instead of full refresh
			setTurnoverData(prevData => 
				prevData.filter(item => item.id !== selectedTurnover.id)
			);
			
			// Update the total as well
			setTotalTurnover(prevTotal => prevTotal - selectedTurnover.value);
			
			showToast("Turnover deleted successfully", "success");
			
			// Close dialog
			handleDeleteDialogClose();
		} catch (error) {
			console.error("Error deleting turnover:", error);
			showToast(error?.message || "Failed to delete turnover", "error");
		} finally {
			setIsDeleting(false);
		}
	}, [selectedTurnover, handleDeleteDialogClose, showToast]);

	// Handle adding new turnover
	const handleAddDialogOpen = useCallback(() => {
		setAddDialogOpen(true);
	}, []);

	const handleAddDialogClose = useCallback(() => {
		setAddDialogOpen(false);
		setNewTurnoverData({
			date: format(new Date(), "yyyy-MM-dd"),
			value: ""
		});
	}, []);

	const handleAddTurnover = useCallback(async () => {
		if (!newTurnoverData.value) {
			showToast("Please enter a turnover value", "error");
			return;
		}

		try {
			const newTurnover = await turnoverService.addTurnover({
				tenantId: parseInt(tenantId),
				value: parseFloat(newTurnoverData.value),
				date: newTurnoverData.date
			});

			// Update local state
			setTurnoverData(prevData => [...prevData, newTurnover]);
			
			// Update total turnover
			setTotalTurnover(prevTotal => prevTotal + parseFloat(newTurnoverData.value));
			
			showToast("Turnover added successfully", "success");
			
			// Close dialog
			handleAddDialogClose();
		} catch (error) {
			console.error("Error adding turnover:", error);
			showToast(error?.message || "Failed to add turnover", "error");
		}
	}, [newTurnoverData, tenantId, showToast, handleAddDialogClose]);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Button variant="outlined" color="primary" startIcon={<ArrowBackIcon />} onClick={handleBackClick} sx={{ mb: 3 }}>
				Back to Tenants
			</Button>

			{tenant && (
				<>
					<Paper sx={{ p: 3, mb: 4 }}>
						<Grid container spacing={3} sx={{ mb: 3 }}>
							<Grid item xs={12} md={6}>
								<TenantHeader tenant={tenant} />
							</Grid>
							
							<Grid item xs={12} md={6}>
								<TurnoverSummary 
									totalTurnover={totalTurnover} 
									turnoverData={turnoverData} 
									formatCurrency={formatCurrency}
								/>
							</Grid>
						</Grid>

						<Divider sx={{ my: 3 }} />

						<Typography variant="h6" sx={{ mb: 2 }}>
							Users with Access
						</Typography>
						
						<UserAccessList accesses={tenant.accesses} />
					</Paper>

					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
						<Typography variant="h6">Turnover Management</Typography>
						<Button 
							variant="contained" 
							color="primary" 
							startIcon={<AddIcon />}
							onClick={handleAddDialogOpen}
						>
							Add Turnover
						</Button>
					</Box>

					<TurnoverHistory 
						turnoverData={turnoverData}
						organizeByYearAndMonth={organizeByYearAndMonth}
						calculateYearlyTotals={calculateYearlyTotals}
						calculateYearOverYearChange={calculateYearOverYearChange}
						formatCurrency={formatCurrency}
						isSmallScreen={isSmallScreen}
						onEditClick={handleEditClick}
						onDeleteClick={handleDeleteClick}
						storeName={tenant.name}
					/>
				</>
			)}

			<TurnoverDialogs 
				editDialogOpen={editDialogOpen}
				deleteDialogOpen={deleteDialogOpen}
				selectedTurnover={selectedTurnover}
				editTurnoverValue={editTurnoverValue}
				setEditTurnoverValue={setEditTurnoverValue}
				handleEditDialogClose={handleEditDialogClose}
				handleDeleteDialogClose={handleDeleteDialogClose}
				handleTurnoverUpdate={handleTurnoverUpdate}
				handleTurnoverDelete={handleTurnoverDelete}
				isDeleting={isDeleting}
			/>

			<AddTurnoverDialog
				open={addDialogOpen}
				handleClose={handleAddDialogClose}
				newTurnoverData={newTurnoverData}
				setNewTurnoverData={setNewTurnoverData}
				handleAddTurnover={handleAddTurnover}
				turnoverData={turnoverData}
			/>
		</Box>
	);
};

export default TenantDetail;
