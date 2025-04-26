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
import TurnoverYearExport from "./TurnoverYearExport.jsx";

const TurnoverYearAccordion = memo(({ 
  year, 
  months, 
  yearlyTotal, 
  formatCurrency, 
  isSmallScreen, 
  onEditClick, 
  onDeleteClick,
  storeName
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = useCallback(() => {
    setExpanded(prevExpanded => !prevExpanded);
  }, []);

  const allYearTurnovers = useMemo(() => {
    return Object.values(months).flat();
  }, [months]);

  const handleExportClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const monthOrder = useMemo(() => 
    ["December", "November", "October", "September", "August", "July", "June", "May", "April", "March", "February", "January"],
    []
  );
  
  const sortedMonths = useMemo(() => {
    return Object.entries(months)
      .sort(([monthA], [monthB]) => {
        return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
      });
  }, [months, monthOrder]);
  
  const accordionHeader = useMemo(() => (
    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
      <Typography variant="h6">{year}</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6" color="primary.main" sx={{ fontWeight: "bold", mr: 1 }}>
          {formatCurrency(yearlyTotal)}
        </Typography>
        <Box onClick={handleExportClick}>
          <TurnoverYearExport 
            year={year} 
            turnovers={allYearTurnovers}
            storeName={storeName}
          />
        </Box>
      </Box>
    </Box>
  ), [year, yearlyTotal, formatCurrency, allYearTurnovers, storeName, handleExportClick]);
  
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