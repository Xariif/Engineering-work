import React, { useCallback } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TodayIcon from "@mui/icons-material/Today";
import TurnoverCalendarDay from "./TurnoverCalendarDay.jsx";
import { enUS } from "date-fns/locale";

// Create a custom locale based on enUS with Monday as first day of week
const localeWithMondayStart = {
  ...enUS,
  options: {
    ...enUS.options,
    weekStartsOn: 1 // 0 = Sunday, 1 = Monday
  }
};

const TurnoverCalendar = React.memo(({ 
  selectedDate, 
  onDateChange, 
  turnoversByDate, 
  disabled,
  goToToday
}) => {
  const DaySlot = useCallback((props) => {
    return (
      <TurnoverCalendarDay
        {...props}
        turnoversByDate={turnoversByDate}
      />
    );
  }, [turnoversByDate]);

  return (
    <Box
      sx={{
        flex: { xs: "1", md: "2" },
        width: "100%",
        "& .MuiDateCalendar-root": {
          width: "100%",
          height: "100%",
        },
        "& .MuiDayCalendar-weekDayLabel": {
          width: "auto",
          margin: "0 4px",
          fontSize: { xs: "0.75rem", sm: "0.85rem" },
          fontWeight: "600",
        },
        "& .MuiDayCalendar-header": {
          justifyContent: "space-between",
          padding: "0 4px",
          marginBottom: "8px",
        },
        "& .MuiDayCalendar-monthContainer": {
          gap: { xs: "4px", sm: "8px" },
        },
        "& .MuiDayCalendar-weekContainer": {
          margin: { xs: "2px 0", sm: "4px 0" },
          justifyContent: "space-between",
        },
        "& .MuiPickersSlideTransition-root": {
          minHeight: "290px",
          overflowY: "visible",
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Turnover Calendar
        </Typography>
        <Button
          size='medium'
          onClick={goToToday}
          disabled={disabled}
          startIcon={<TodayIcon />}
          variant="outlined"
        >
          Today
        </Button>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeWithMondayStart}>
        <DateCalendar
          value={selectedDate}
          onChange={onDateChange}
          disabled={disabled}
          maxDate={new Date()}
          views={["year", "month", "day"]}
          disableFuture
          dayOfWeekFormatter={(day) => {
            return day.toLocaleDateString("en-CA", { weekday: "long" });
          }}
          slots={{
            day: DaySlot
          }}
        />
      </LocalizationProvider>
    </Box>
  );
});

export default TurnoverCalendar; 