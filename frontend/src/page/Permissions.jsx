import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Typography, Button, MenuItem, Select, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Paper, Avatar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import accessService from "../services/accessService.js";
import { useToast } from "../context/ToastContext.jsx";
import { useNavigate } from "react-router-dom";

// Separate component for the user input field
const UserInputField = React.memo(({ value, onChange, onAddUser }) => {
	return (
		<Box sx={{ mt: 2 }}>
			<TextField
				label="Add New User (Email)"
				value={value}
				onChange={onChange}
				fullWidth
				onKeyPress={(e) => {
					if (e.key === 'Enter' && value.trim()) {
						onAddUser();
					}
				}}
			/>
		</Box>
	);
});

const Permissions = () => {
	const [malls, setMalls] = useState([]);
	const [selectedMall, setSelectedMall] = useState("");
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedStore, setSelectedStore] = useState(null);
	const [newUser, setNewUser] = useState("");
	const [loading, setLoading] = useState(true);
	const { showToast } = useToast();
	const navigate = useNavigate();

	// Get user role from localStorage
	const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
	const userRole = userDetails.role || "";

	useEffect(() => {
		if (userRole !== "Manager") {
			showToast("Access denied. Manager role required.", "error");
			navigate("/");
			return;
		}
		fetchAccessData();
	}, [userRole, navigate, showToast]);

	const fetchAccessData = async () => {
		try {
			const response = await accessService.getAccessData();

			if (!response || !response.malls) {
				throw new Error("Invalid response format");
			}

			const processedMalls = response.malls.map(mall => ({
				id: mall.name, // Using mall name as ID since it's unique
				name: mall.name,
				address: mall.address,
				stores: mall.stores.map(store => ({
					id: store.id,
					name: store.name,
					imageUrl: store.imageUrl,
					accesses: store.accesses || [],
					accessCount: (store.accesses || []).length
				}))
			}));

			setMalls(processedMalls);
			if (!selectedMall && processedMalls.length > 0) {
				setSelectedMall(processedMalls[0].id);
			}
			setLoading(false);
		} catch (error) {
			if (error.response?.status === 403) {
				showToast("Access denied. Manager role required.", "error");
				navigate("/");
			} else {
				showToast(error.message || "Failed to fetch access data", "error");
			}
			setLoading(false);
		}
	};

	const handleMallChange = (event) => {
		setSelectedMall(event.target.value);
	};

	const handleRowClick = (params) => {
		setSelectedStore(params.row);
		setOpenDialog(true);
	};

	const handleDialogClose = useCallback(() => {
		setOpenDialog(false);
		setSelectedStore(null);
		setNewUser("");
	}, []);

	const handleNewUserChange = useCallback((e) => {
		setNewUser(e.target.value);
	}, []);

	const handleAddUser = async () => {
		if (newUser.trim() && selectedStore) {
			try {
				await accessService.addTenantAccess(newUser, selectedStore.id);
				showToast("User added successfully", "success");
				
				// Update local state immediately
				setSelectedStore(prevStore => ({
					...prevStore,
					accesses: [...(prevStore.accesses || []), { 
						userId: "", // Will be set by backend
						userName: newUser.split('@')[0], // Simple name from email
						userEmail: newUser 
					}],
					accessCount: (prevStore.accessCount || 0) + 1
				}));

				// Update the stores list
				setMalls(prevMalls => 
					prevMalls.map(mall => ({
						...mall,
						stores: mall.stores.map(store => 
							store.id === selectedStore.id
								? {
									...store,
									accesses: [...(store.accesses || []), { 
										userId: "", // Will be set by backend
										userName: newUser.split('@')[0], // Simple name from email
										userEmail: newUser 
									}],
									accessCount: (store.accessCount || 0) + 1
								}
								: store
						)
					}))
				);

				setNewUser("");
				
				// Fetch fresh data in the background
				fetchAccessData();
			} catch (error) {
				if (error.response?.status === 403) {
					showToast("Access denied. Manager role required.", "error");
					navigate("/");
				} else {
					showToast(error.message || "Failed to add user", "error");
				}
			}
		}
	};

	const handleRemoveAccess = async (userEmail, storeId) => {
		try {
			// Find the access ID from the accessData
			const access = malls
				.flatMap(mall => mall.stores)
				.find(store => store.id === storeId)
				?.accesses
				.find(access => access.userEmail === userEmail);

			if (!access) {
				throw new Error('Access not found');
			}

			await accessService.removeTenantAccess(access.id);
			
			// Update local state immediately
			setSelectedStore(prevStore => ({
				...prevStore,
				accesses: prevStore.accesses.filter(access => access.userEmail !== userEmail),
				accessCount: prevStore.accessCount - 1
			}));

			// Update the stores list
			setMalls(prevMalls => 
				prevMalls.map(mall => ({
					...mall,
					stores: mall.stores.map(store => 
						store.id === storeId
							? {
								...store,
								accesses: store.accesses.filter(access => access.userEmail !== userEmail),
								accessCount: store.accessCount - 1
							}
							: store
					)
				}))
			);

			showToast("User removed successfully", "success");
			
			// Fetch fresh data in the background
			fetchAccessData();
		} catch (error) {
			console.error('Error removing access:', error);
			if (error.response?.status === 403) {
				showToast("Access denied. Manager role required.", "error");
				navigate("/");
			} else {
				showToast(error.message || "Failed to remove user", "error");
			}
		}
	};

	const columns = useMemo(() => [
		{ field: "id", headerName: "ID", width: 90, hide: true },
		{ 
			field: "name", 
			headerName: "Store Name", 
			width: 400, 
			flex: 1,
			renderCell: (params) => (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 , height: '100%'}}>
					<Avatar 
						src={params.row.imageUrl} 
						alt={params.row.name}
						sx={{ width: 32, height: 32 }}
					/>
					<Typography>{params.row.name}</Typography>
				</Box>
			)
		},
		{
			field: "accessCount",
			headerName: "Assigned Users",
			width: 200,
			align: 'center',
			headerAlign: 'center',
			renderCell: (params) => {
				const count = params.value || 0;
				return `${count} ${count === 1 ? 'user' : 'users'}`;
			}
		},
	], []);

	const selectedMallData = useMemo(() => 
		malls.find(mall => mall.id === selectedMall),
		[malls, selectedMall]
	);

	const stores = useMemo(() => 
		selectedMallData?.stores || [],
		[selectedMallData]
	);

	const UserList = useMemo(() => {
		if (!selectedStore?.accesses) return null;
		
		return selectedStore.accesses.map((access) => (
			<Box
				key={access.userEmail}
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 1,
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Avatar 
						sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
					>
						{access.userName.charAt(0).toUpperCase()}
					</Avatar>
					<Box>
						<Typography variant="body1">{access.userName}</Typography>
						<Typography variant="body2" color="text.secondary">{access.userEmail}</Typography>
					</Box>
				</Box>
				<Button
					variant="outlined"
					color="error"					
					size="small"
					onClick={() => handleRemoveAccess(access.userEmail, selectedStore.id)}
				>
					Remove
				</Button>
			</Box>
		));
	}, [selectedStore?.accesses, handleRemoveAccess]);

	return (
		<Paper elevation={2} sx={{ 
			height: '100%',
			p: 3,
			display: 'flex',
			flexDirection: 'column',
			gap: 3
		}}>
			<Box sx={{ 
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				mb: 2
			}}>
				<Typography variant="h5" sx={{ fontWeight: 600 }}>
					Permissions Management
				</Typography>
				<Select
					value={selectedMall}
					onChange={handleMallChange}
					displayEmpty
					sx={{ width: 300 }}
					size="small"
				>
					<MenuItem value="" disabled>
						Select a Mall
					</MenuItem>
					{malls.map((mall) => (
						<MenuItem key={mall.id} value={mall.id}>
							{mall.name}
						</MenuItem>
					))}
				</Select>
			</Box>
			<Box sx={{ 
				flex: 1,
				minHeight: 0,
				'& .MuiDataGrid-root': {
					border: 'none',
					'& .MuiDataGrid-cell:focus': {
						outline: 'none'
					},
					'& .MuiDataGrid-row:hover': {
						cursor: 'pointer',
						backgroundColor: 'rgba(0, 0, 0, 0.04)'
					}
				}
			}}>
				<DataGrid
					rows={stores}
					columns={columns}
					pageSize={10}
					rowsPerPageOptions={[10, 25, 50]}
					onRowClick={handleRowClick}
					loading={loading}
					getRowId={(row) => row.id}
					disableColumnMenu
					disableSelectionOnClick
				/>
			</Box>
			<Dialog 
				open={openDialog} 
				onClose={handleDialogClose} 
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle sx={{ 
					borderBottom: '1px solid',
					borderColor: 'divider',
					pb: 2
				}}>
					{selectedStore?.name} - User Access
				</DialogTitle>
				<DialogContent sx={{ pt: 2 }}>
					<Typography variant="body1" gutterBottom>
						Assigned Users:
					</Typography>
					{selectedStore?.accesses?.length > 0 ? (
						UserList
					) : (
						<Typography color="text.secondary">No users assigned</Typography>
					)}
					<UserInputField 
						value={newUser}
						onChange={handleNewUserChange}
						onAddUser={handleAddUser}
					/>
				</DialogContent>
				<DialogActions sx={{ 
					borderTop: '1px solid',
					borderColor: 'divider',
					pt: 2,
					px: 3
				}}>
					<Button variant="outlined" color="info" onClick={handleDialogClose}>Cancel</Button>
					<Button 
						onClick={handleAddUser} 
						variant="outlined" 
						color="success"
						disabled={!newUser.trim()}
					>
						Add User
					</Button>
				</DialogActions>
			</Dialog>
		</Paper>
	);
};

export default Permissions;
