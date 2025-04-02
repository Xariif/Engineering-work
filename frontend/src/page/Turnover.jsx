import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Turnover = () => {
  // Static predefined turnover data
  const predefinedTurnoverData = {
    1: 100,
    2: 200,
    3: 150,
    4: 300,
    5: 250,
    6: 400,
    7: 350,
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderDayContent = (date, selectedDates, pickersDayProps) => {
    const day = date.day.getDate();
    const turnover = predefinedTurnoverData[day] || 0; // Get turnover for the day or default to 0

    return (
      <Box
        {...pickersDayProps}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 80, // Larger day box
          height: 80,
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: turnover > 0 ? "#e3f2fd" : "transparent", // Highlight days with turnover
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {day}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          ${turnover}
        </Typography>
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        p={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh", // Full viewport height
          overflow: "hidden", // Prevent scrolling
        }}
      >
        <Typography variant="h4" gutterBottom>
          {selectedDate.toLocaleString("default", { month: "long" })} {selectedDate.getFullYear()}
        </Typography>
        <DateCalendar
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          slots={{
            day: renderDayContent, // Custom rendering for days
          }}
          sx={{
            "& .MuiPickersDay-root": {
              margin: "4px", // Adjust spacing between days
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default Turnover;
