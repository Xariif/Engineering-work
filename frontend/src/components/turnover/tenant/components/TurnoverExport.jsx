import React from "react";
import { Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const TurnoverExport = React.memo(({ turnovers, storeName, disabled, selectedDate }) => {
  const exportToCSV = () => {
    // Get selected year from the calendar date
    const selectedYear = selectedDate.getFullYear();
    
    // Filter turnovers for selected year
    const yearTurnovers = turnovers.filter(turnover => {
      const turnoverDate = new Date(turnover.date);
      return turnoverDate.getFullYear() === selectedYear;
    });
    
    // Sort by date
    yearTurnovers.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    
    // Create CSV header
    let csvContent = "Date,Value\n";
    
    // Add data rows
    yearTurnovers.forEach(turnover => {
      const formattedDate = new Date(turnover.date).toLocaleDateString("en-CA");
      csvContent += `${formattedDate},${turnover.value}\n`;
    });
    
    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    // Set filename with current date
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `${storeName}_turnover_${selectedYear}_${dateStr}.csv`;
    
    // Trigger download
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Button
      variant="outlined"
      onClick={exportToCSV}
      disabled={disabled}
      startIcon={<FileDownloadIcon />}
      color="secondary"
      fullWidth
    >
      Export {selectedDate.getFullYear()} Turnover to CSV
    </Button>
  );
});

export default TurnoverExport; 