import React from "react";
import { Grid, Card, Box, Typography, Chip } from "@mui/material";

const TurnoverSummaryCards = ({ 
  yearlyTotals,
  organizeByYearAndMonth,
  turnoverData,
  formatCurrency,
  yoyChanges
}) => {
  const currentYear = new Date().getFullYear().toString();

  return (
    <Grid container spacing={2}>
      {Object.entries(yearlyTotals)
        .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
        .map(([year, total]) => {
          const isCurrentYear = year === currentYear;
          const percentChange = yoyChanges[year];
          const hasChange = percentChange !== null;
          const isPositiveChange = percentChange > 0;
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={year}>
              <Card
                sx={{
                  bgcolor: "background.paper",
                  boxShadow: 2,
                  borderRadius: 2,
                  p: 2,
                  minWidth: 150,
                  borderLeft: 5,
                  borderColor: "primary.main"
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {year}
                  {isCurrentYear && " (Current)"}
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: "bold", mt: 1, color: "primary.main" }}>
                  {formatCurrency(total)}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {Object.values(organizeByYearAndMonth(turnoverData)[year]).flat().length} entries
                  </Typography>
                  {!isCurrentYear && hasChange && (
                    <Chip
                      label={`${isPositiveChange ? "+" : ""}${percentChange.toFixed(1)}% vs ${parseInt(year) - 1}`}
                      size="small"
                      color={isPositiveChange ? "success" : "error"}
                      sx={{ fontWeight: "bold", ml: 1 }}
                    />
                  )}
                </Box>
              </Card>
            </Grid>
          );
        })}
    </Grid>
  );
};

export default TurnoverSummaryCards; 