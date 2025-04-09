import React, { useState } from "react";
import { Box, Typography, Button, MenuItem, Select, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const Permissions = () => {
    const [selectedMall, setSelectedMall] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const [newUser, setNewUser] = useState("");

    const data = [
        {
            id: 1,
            storeName: "Carrefour",
            assignedUsers: [
                { id: 1, fullName: "Example User 1" },
                { id: 2, fullName: "Example User 2" },
            ],
        },
        {
            id: 2,
            storeName: "Leroy Merlin",
            assignedUsers: [
                { id: 3, fullName: "Example User 3" },
                { id: 4, fullName: "Example User 4" },
            ],
        },
        {
            id: 3,
            storeName: "Starbucks",
            assignedUsers: [
                { id: 5, fullName: "Example User 5" },
                { id: 6, fullName: "Example User 6" },
            ],
        },
    ];

    const handleMallChange = (event) => {
        setSelectedMall(event.target.value);
    };

    const handleRowClick = (params) => {
        setSelectedStore(params.row);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedStore(null);
    };

    const handleAddUser = () => {
        if (newUser.trim()) {
            const updatedStore = {
                ...selectedStore,
                assignedUsers: [...selectedStore.assignedUsers, { id: Date.now(), fullName: newUser }],
            };
            const updatedData = data.map((store) => (store.id === updatedStore.id ? updatedStore : store));
            setSelectedStore(updatedStore);
            setNewUser("");
        }
    };

    const handleRemoveUser = (userId) => {
        const updatedStore = {
            ...selectedStore,
            assignedUsers: selectedStore.assignedUsers.filter((user) => user.id !== userId),
        };
        const updatedData = data.map((store) => (store.id === updatedStore.id ? updatedStore : store));
        setSelectedStore(updatedStore);
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "storeName", headerName: "Store Name", width: 200 },
        {
            field: "assignedUsers",
            headerName: "Assigned Users",
            width: 300,
            valueGetter: (params) => params.map((user) => user.fullName).join(", "),
        },
    ];

    return (
        <Box sx={{ width: "100%", padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Permissions Management
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body1" gutterBottom>
                    Select a Mall:
                </Typography>
                <Select
                    value={selectedMall}
                    onChange={handleMallChange}
                    displayEmpty
                    fullWidth
                    sx={{ marginBottom: 2 }}
                >
                    <MenuItem value="" disabled>
                        Select a Mall
                    </MenuItem>
                    <MenuItem value="Mall A">Mall A</MenuItem>
                    <MenuItem value="Mall B">Mall B</MenuItem>
                    <MenuItem value="Mall C">Mall C</MenuItem>
                </Select>
            </Box>
            <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    pageSize={5}
                    onRowClick={handleRowClick}
                />
            </div>
            <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
                <DialogTitle>Manage Permissions for {selectedStore?.storeName}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Assigned Users:
                    </Typography>
                    {selectedStore?.assignedUsers.map((user) => (
                        <Box
                            key={user.id}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 1,
                            }}
                        >
                            <Typography>{user.fullName}</Typography>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleRemoveUser(user.id)}
                            >
                                Remove
                            </Button>
                        </Box>
                    ))}
                    <TextField
                        label="Add New User"
                        value={newUser}
                        onChange={(e) => setNewUser(e.target.value)}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        Close
                    </Button>
                    <Button onClick={handleAddUser} variant="contained" color="primary">
                        Add User
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Permissions;