import React, { memo, useState, useMemo, useCallback } from "react";
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Box, 
  Typography 
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TurnoverMonthTable from "./TurnoverMonthTable.jsx";

const TurnoverMonthAccordion = memo(({ 
  month, 
  turnovers, 
  formatCurrency, 
  isSmallScreen, 
  onEditClick, 
  onDeleteClick 
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const handleChange = useCallback(() => {
    setExpanded(prevExpanded => !prevExpanded);
  }, []);

  // Pre-calculate the monthly total once during render
  const monthlyTotal = useMemo(() => 
    turnovers.reduce((sum, item) => sum + item.value, 0),
    [turnovers]
  );

  // Memoize the header content to prevent recreation on expand/collapse
  const accordionHeader = useMemo(() => (
    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
      <Typography variant="subtitle1">{month}</Typography>
      <Box>
        <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: "bold" }}>
          {formatCurrency(monthlyTotal)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {turnovers.length} entries
        </Typography>
      </Box>
    </Box>
  ), [month, monthlyTotal, formatCurrency, turnovers.length]);

  return (
    <Accordion 
      expanded={expanded} 
      onChange={handleChange} 
      sx={{ boxShadow: "none" }}
      TransitionProps={{ unmountOnExit: true }} // Unmount content when collapsed to save memory
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.01)",
          borderLeft: 3,
          borderColor: "primary.light",
          ml: 2
        }}
      >
        {accordionHeader}
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0 }}>
        {expanded && ( // Only render table when expanded
          <TurnoverMonthTable
            turnovers={turnovers}
            monthlyTotal={monthlyTotal}
            formatCurrency={formatCurrency}
            isSmallScreen={isSmallScreen}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
});

// Add displayName for better debugging
TurnoverMonthAccordion.displayName = 'TurnoverMonthAccordion';

export default TurnoverMonthAccordion; 