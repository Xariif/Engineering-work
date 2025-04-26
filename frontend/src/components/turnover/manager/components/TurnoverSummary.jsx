import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { format } from "date-fns";

const TurnoverSummary = ({ totalTurnover, turnoverData, formatCurrency }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        padding: 3,
        borderRadius: 2,
        backgroundColor: "background.paper",
        boxShadow: 1,
        border: "1px solid",
        borderColor: "divider"
      }}
    >
      <Typography variant="overline" color="text.secondary" pl={2}>
        TOTAL TURNOVER
      </Typography>
      <Typography
        variant="h3"
        color="primary"
        sx={{
          fontWeight: "bold",
          letterSpacing: "-0.5px",
          mb: 2
        }}
      >
        {formatCurrency(totalTurnover)}
      </Typography>
      
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px dashed",
          borderColor: "divider",
          pt: 2
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TrendingUpIcon color="success" sx={{ fontSize: 20, mr: 1 }} />
          <Typography variant="body1" mr={1}>
            {turnoverData.length} total records
          </Typography>
        </Box>
        
        <Chip 
          label={`Since ${turnoverData.length > 0 ? format(new Date(Math.min(...turnoverData.map(t => new Date(t.date)))), "MMM yyyy") : "N/A"}`}
          color="default"
          size="small"
        />
      </Box>
    </Box>
  );
};

export default TurnoverSummary; 