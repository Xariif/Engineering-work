import React from "react";
import { Box, Typography } from "@mui/material";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

const TurnoverCalendarDay = React.memo(({ day, turnoversByDate, ...other }) => {
  const dateString = day.toLocaleDateString("en-CA");
  const turnover = turnoversByDate[dateString];

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        m: 0.5,
      }}
    >
      <PickersDay
        {...other}
        day={day}
        sx={{
          width: "100% !important",
          height: "100% !important",
          borderRadius: "8px !important",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          ...(turnover && {
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(76, 175, 80, 0.2)",
            },
            "&.Mui-selected": {
              backgroundColor: "primary.main",
            },
          }),
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
          {day.getDate()}
        </Typography>
        {turnover && (
          <Typography 
            variant="caption"
            sx={{
              fontSize: { xs: "0.65rem", sm: "0.7rem" },
              fontWeight: "normal",
              lineHeight: 1,
            }}
          >
            {new Intl.NumberFormat("en-CA", {
              style: "currency",
              currency: "EUR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(turnover.value)}
          </Typography>
        )}
        {!turnover && (
          <Typography 
            variant="caption" 
            sx={{ 
              opacity: 0,
              fontSize: { xs: "0.65rem", sm: "0.7rem" },
              lineHeight: 1,
            }}
          >
            -
          </Typography>
        )}
      </PickersDay>
    </Box>
  );
});

export default TurnoverCalendarDay; 