import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const Permissions = () => {
    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "email", headerName: "Email", width: 200 },
        { field: "resourceAccess", headerName: "Resource Access", width: 150 },
        { field: "name", headerName: "Name", width: 150 },
        { field: "type", headerName: "Type", width: 120 },
    ];

    const rows = [
        {
            id: 1,
            email: "user1@example.com",
            resourceAccess: "Mall",
            name: "Mall A",
            type: "Manager",
        },
        {
            id: 2,
            email: "user2@example.com",
            resourceAccess: "Store",
            name: "Store B",
            type: "Tenant",
        },
        {
            id: 3,
            email: "user3@example.com",
            resourceAccess: "Mall",
            name: "Mall C",
            type: "Tenant",
        },
        {
            id: 4,
            email: "user4@example.com",
            resourceAccess: "Store",
            name: "Store D",
            type: "Manager",
        },
        {
            id: 5,
            email: "user5@example.com",
            resourceAccess: "Mall",
            name: "Mall E",
            type: "Tenant",
        },
    ];

    return (
        <div style={{ height: 400, width: "100%" }}>
            <h1>User Permissions</h1>
            <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
        </div>
    );
};

export default Permissions;