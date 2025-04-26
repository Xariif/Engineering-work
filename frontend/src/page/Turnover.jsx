import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import turnoverService from "../services/turnoverService.js";
import accessService from "../services/accessService.js";
import TodayIcon from "@mui/icons-material/Today";

const Turnover = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [selectedMall, setSelectedMall] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [malls, setMalls] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnoverValue, setTurnoverValue] = useState("");
  const [turnovers, setTurnovers] = useState([]);
  const [selectedTurnoverId, setSelectedTurnoverId] = useState(null);

  // Create a memoized lookup object for turnovers
  const turnoversByDate = useMemo(() => {
    const lookup = {};
    turnovers.forEach(turnover => {
      try {
        const date = new Date(turnover.date);
        if (!isNaN(date.getTime())) {
          const dateString = date.toLocaleDateString("en-CA");
          lookup[dateString] = turnover;
        }
      } catch (error) {
        console.error("Error processing turnover date:", error);
      }
    });
    return lookup;
  }, [turnovers]);

  const isDateValid = (date) => {
    const today = new Date();
    return date <= today;
  };

  useEffect(() => {
    const fetchAccessData = async () => {
      try {
        const response = await accessService.getTenantAccessData();
        setMalls(response.malls);
        if (response.malls.length > 0) {
          setSelectedMall(response.malls[0].name);
          setStores(response.malls[0].stores);
          if (response.malls[0].stores.length > 0) {
            setSelectedStore(response.malls[0].stores[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching access data:", error);
        showToast("Failed to load mall and store data", "error");
      }
    };

    fetchAccessData();
  }, [showToast]);

  useEffect(() => {
    const fetchTurnovers = async () => {
      if (selectedStore) {
        try {
          const response = await turnoverService.getTurnoversByStore(
            selectedStore,
          );
          setTurnovers(response);
        } catch (error) {
          console.error("Error fetching turnovers:", error);
          showToast("Failed to load turnover data", "error");
        }
      }
    };

    fetchTurnovers();
  }, [selectedStore, showToast]);

  const handleMallChange = (event) => {
    const mall = malls.find((m) => m.name === event.target.value);
    setSelectedMall(mall.name);
    setStores(mall.stores);
    setSelectedStore("");
    setTurnoverValue("");
    setSelectedTurnoverId(null);
  };

  const handleStoreChange = (event) => {
    setSelectedStore(event.target.value);
    setTurnoverValue("");
    setSelectedTurnoverId(null);
  };

  const handleDateChange = useCallback((date) => {
    if (!isDateValid(date)) {
      showToast(
        "Turnover can only be added for the current year and dates not exceeding today",
        "error",
      );
      return;
    }
    setSelectedDate(date);
    const dateString = date.toLocaleDateString("en-CA");
    const turnover = turnoversByDate[dateString];
    setTurnoverValue(turnover?.value || "");
    setSelectedTurnoverId(turnover?.id || null);
  }, [turnoversByDate, showToast]);

  const goToToday = useCallback(() => {
    const today = new Date();
    handleDateChange(today);
  }, [handleDateChange]);

  const handleTurnoverSubmit = async () => {
    if (!selectedStore || !selectedDate || !turnoverValue) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (!isDateValid(selectedDate)) {
      showToast(
        "Turnover can only be added for the current year and dates not exceeding today",
        "error",
      );
      return;
    }

    try {
      if (selectedTurnoverId) {
        // Update existing turnover
        await turnoverService.updateTurnover(selectedTurnoverId, {
          tenantId: parseInt(selectedStore),
          value: parseFloat(turnoverValue),
          date: selectedDate,
        });
        showToast("Turnover updated successfully", "success");
      } else {
        // Add new turnover
        await turnoverService.addTurnover({
          tenantId: parseInt(selectedStore),
          value: parseFloat(turnoverValue),
          date: selectedDate,
        });
        showToast("Turnover added successfully", "success");
      }

      // Refresh turnovers
      const response = await turnoverService.getTurnoversByStore(selectedStore);
      setTurnovers(response);
    } catch (error) {
      console.error("Error saving turnover:", error);
      showToast(
        error.response?.data?.message || "Failed to save turnover",
        "error",
      );
    }
  };

  const handleDeleteTurnover = async () => {
    if (!selectedTurnoverId) {
      showToast("No turnover selected to delete", "error");
      return;
    }

    try {
      await turnoverService.deleteTurnover(selectedTurnoverId);
      showToast("Turnover deleted successfully", "success");

      // Refresh turnovers
      const response = await turnoverService.getTurnoversByStore(selectedStore);
      setTurnovers(response);

      // Clear selected turnover
      setTurnoverValue("");
      setSelectedTurnoverId(null);
    } catch (error) {
      console.error("Error deleting turnover:", error);
      showToast(
        error.response?.data?.message || "Failed to delete turnover",
        "error",
      );
    }
  };

  // Memoize the day slot renderer
  const DaySlot = useCallback((props) => {
    const dateString = props.day.toLocaleDateString("en-CA");
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
          {...props}
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
            {props.day.getDate()}
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
  }, [turnoversByDate]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 4,
          color: "primary.main",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
        }}
      >
        Turnover Management
      </Typography>

      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Mall</InputLabel>
            <Select
              value={selectedMall}
              onChange={handleMallChange}
              label="Mall"
            >
              {malls.map((mall) => (
                <MenuItem key={mall.id} value={mall.name}>
                  {mall.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Store</InputLabel>
            <Select
              value={selectedStore}
              onChange={handleStoreChange}
              label="Store"
              disabled={!selectedMall}
            >
              {stores.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: { xs: 3, md: 2 },
            mb: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
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
                {new Date().getFullYear()}
              </Typography>
              <Button
                size="small"
                onClick={goToToday}
                disabled={!selectedStore}
                startIcon={<TodayIcon />}
              >
                Today
              </Button>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                disabled={!selectedStore}
                maxDate={new Date()}
                minDate={new Date(new Date().getFullYear(), 0, 1)}
                views={["month", "day"]}
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

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flex: { xs: "1", md: "1" },
              width: "100%",
              mt: { xs: 2, md: 0 },
            }}
          >
            <TextField
              fullWidth
              label="Turnover Value"
              type="number"
              value={turnoverValue}
              onChange={(e) => setTurnoverValue(e.target.value)}
              disabled={!selectedStore}

            />
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Button
                variant="contained"
                onClick={handleTurnoverSubmit}
                disabled={!selectedStore || !selectedDate || !turnoverValue ||
                  !isDateValid(selectedDate)}
                fullWidth
                color={selectedTurnoverId ? "info" : "primary"}
              >
                {selectedTurnoverId ? "Update Turnover" : "Add Turnover"}
              </Button>
              {selectedTurnoverId && (
                <Button
                  color="error"
                  onClick={handleDeleteTurnover}
                  fullWidth
                >
                  Delete Turnover
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Turnover;
