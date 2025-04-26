import React, { memo, useMemo } from "react";
import { Box, Typography, Paper } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TurnoverYearAccordion from "./TurnoverYearAccordion.jsx";
import TurnoverSummaryCards from "./TurnoverSummaryCards.jsx";

const TurnoverHistory = memo(({
  turnoverData,
  organizeByYearAndMonth,
  calculateYearlyTotals,
  calculateYearOverYearChange,
  formatCurrency,
  isSmallScreen,
  onEditClick,
  onDeleteClick,
  storeName
}) => {
  if (!turnoverData || turnoverData.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <TrendingUpIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h5" component="h2">
            Turnover History
          </Typography>
        </Box>
        <Typography color="text.secondary">No turnover records available for this tenant</Typography>
      </Paper>
    );
  }

  // Memoize these calculations to prevent unnecessary recalculation on re-renders
  const organizedData = useMemo(() => organizeByYearAndMonth(turnoverData), [turnoverData, organizeByYearAndMonth]);
  const yearlyTotals = useMemo(() => calculateYearlyTotals(organizedData), [organizedData, calculateYearlyTotals]);
  const yoyChanges = useMemo(() => calculateYearOverYearChange(yearlyTotals), [yearlyTotals, calculateYearOverYearChange]);

  // Memoize the sorted years data to avoid recalculation on each render
  const sortedYearData = useMemo(() => {
    return Object.entries(organizedData)
      .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA)) // Sort years in descending order
      .map(([year, months]) => ({
        year,
        months,
        yearlyTotal: yearlyTotals[year] // Use the pre-calculated total
      }));
  }, [organizedData, yearlyTotals]);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <TrendingUpIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h5" component="h2">
          Turnover History
        </Typography>
      </Box>

      {/* Nested view by year and month */}
      {sortedYearData.map(({ year, months, yearlyTotal }) => (
        <TurnoverYearAccordion
          key={year}
          year={year}
          months={months}
          yearlyTotal={yearlyTotal}
          formatCurrency={formatCurrency}
          isSmallScreen={isSmallScreen}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          storeName={storeName || `Store-${year}`}
        />
      ))}

      {/* Summary Cards - Keeping these for overview */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Summary by Year
        </Typography>
        
        <TurnoverSummaryCards 
          yearlyTotals={yearlyTotals}
          organizeByYearAndMonth={organizeByYearAndMonth}
          turnoverData={turnoverData}
          formatCurrency={formatCurrency}
          yoyChanges={yoyChanges}
        />
      </Box>
    </Paper>
  );
});

export default TurnoverHistory; 