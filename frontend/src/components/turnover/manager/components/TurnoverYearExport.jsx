import React, { memo } from "react";
import { IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const TurnoverYearExport = memo(({ year, turnovers, storeName }) => {
  const exportToCSV = () => {
    // Sort by date
    const sortedTurnovers = [...turnovers].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    
    // Create CSV header
    let csvContent = "Date,Value\n";
    
    // Add data rows
    sortedTurnovers.forEach(turnover => {
      const formattedDate = new Date(turnover.date).toLocaleDateString("en-CA");
      csvContent += `${formattedDate},${turnover.value}\n`;
    });
    
    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    // Set filename with current date
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `${storeName}_turnover_${year}_${dateStr}.csv`;
    
    // Trigger download
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Tooltip title={`Export ${year} data`}>
      <IconButton
        onClick={exportToCSV}
        size="small"
        color="primary"
      >
        <FileDownloadIcon />
      </IconButton>
    </Tooltip>
  );
});

TurnoverYearExport.displayName = 'TurnoverYearExport';

export default TurnoverYearExport; 