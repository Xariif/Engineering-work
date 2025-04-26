import React, { memo, useState, useCallback, useMemo } from "react";
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Box, 
  Typography 
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TurnoverMonthAccordion from "./TurnoverMonthAccordion.jsx";

const TurnoverYearAccordion = memo(({ 
  year, 
  months, 
  yearlyTotal, 
  formatCurrency, 
  isSmallScreen, 
  onEditClick, 
  onDeleteClick 
}) => {
  const [expanded, setExpanded] = useState(true);

  const handleChange = useCallback(() => {
    setExpanded(prevExpanded => !prevExpanded);
  }, []);

  // Month order reference - defined outside render to avoid recreation
  const monthOrder = useMemo(() => 
    ["December", "November", "October", "September", "August", "July", "June", "May", "April", "March", "February", "January"],
    []
  );
  
  // Memoize the sorted months to prevent recalculation on each render
  const sortedMonths = useMemo(() => {
    return Object.entries(months)
      .sort(([monthA], [monthB]) => {
        return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
      });
  }, [months, monthOrder]);
  
  // Memoize the header to avoid recreation on expanded state changes
  const accordionHeader = useMemo(() => (
    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
      <Typography variant="h6">{year}</Typography>
      <Typography variant="h6" color="primary.main" sx={{ fontWeight: "bold" }}>
        {formatCurrency(yearlyTotal)}
      </Typography>
    </Box>
  ), [year, yearlyTotal, formatCurrency]);
  
  return (
    <Accordion 
      expanded={expanded} 
      onChange={handleChange} 
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.03)",
          borderLeft: 4,
          borderColor: "primary.main"
        }}
      >
        {accordionHeader}
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {sortedMonths.map(([month, turnovers]) => (
          <TurnoverMonthAccordion
            key={`${year}-${month}`}
            month={month}
            turnovers={turnovers}
            formatCurrency={formatCurrency}
            isSmallScreen={isSmallScreen}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
});

TurnoverYearAccordion.displayName = 'TurnoverYearAccordion';

export default TurnoverYearAccordion; 