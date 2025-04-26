import React, { memo, useMemo } from "react";
import { 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableFooter, 
  TableRow, 
  TableCell, 
  Box, 
  IconButton 
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

const TurnoverMonthTable = memo(({ 
  turnovers, 
  monthlyTotal, 
  formatCurrency, 
  isSmallScreen, 
  onEditClick, 
  onDeleteClick 
}) => {
  // Memoize the sorted turnovers to prevent recreation on re-renders
  const sortedTurnovers = useMemo(() => {
    return [...turnovers].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [turnovers]);

  // Pre-render table headers to prevent recreation
  const tableHeader = useMemo(() => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
        <TableCell sx={{ fontWeight: "bold", display: { xs: "none", sm: "table-cell" } }}>Added By</TableCell>
        <TableCell sx={{ fontWeight: "bold", display: { xs: "none", md: "table-cell" } }}>ID</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
      </TableRow>
    </TableHead>
  ), []);

  // Pre-render table footer to prevent recreation
  const tableFooter = useMemo(() => (
    <TableFooter>
      <TableRow
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.03)",
          "& .MuiTableCell-root": { fontWeight: "bold" }
        }}
      >
        <TableCell>Monthly Total</TableCell>
        <TableCell sx={{ color: "primary.main" }}>{formatCurrency(monthlyTotal)}</TableCell>
        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{turnovers.length} records</TableCell>
        <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}></TableCell>
        <TableCell></TableCell>
      </TableRow>
    </TableFooter>
  ), [monthlyTotal, formatCurrency, turnovers.length]);

  return (
    <TableContainer>
      <Table size={isSmallScreen ? "small" : "medium"}>
        {tableHeader}
        <TableBody>
          {sortedTurnovers.map((item) => (
            <TableRow
              key={item.id}
              sx={{
                "&:hover": { bgcolor: "action.hover" },
                transition: "background-color 0.2s"
              }}
            >
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CalendarMonthIcon
                    sx={{
                      mr: 1,
                      color: "text.secondary",
                      fontSize: 16,
                      display: { xs: "none", sm: "block" }
                    }}
                  />
                  {format(new Date(item.date), isSmallScreen ? "MM/dd" : "MMMM d")}
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>{formatCurrency(item.value)}</TableCell>
              <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{item.userName || "Unknown"}</TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{item.id}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex" }}>
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={() => onEditClick(item)}
                    title="Edit turnover"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => onDeleteClick(item)}
                    title="Delete turnover"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {tableFooter}
      </Table>
    </TableContainer>
  );
});

// Add displayName for better debugging
TurnoverMonthTable.displayName = 'TurnoverMonthTable';

export default TurnoverMonthTable; 