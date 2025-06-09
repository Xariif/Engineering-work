import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useToast } from "../../../context/ToastContext.jsx";
import turnoverService from "../../../services/turnoverService.js";
import accessService from "../../../services/accessService.js";
import MallStoreSelector from "./components/MallStoreSelector.jsx";
import TurnoverCalendar from "./components/TurnoverCalendar.jsx";
import TurnoverForm from "./components/TurnoverForm.jsx";
import TurnoverExport from "./components/TurnoverExport.jsx";

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

  const isDateValid = useCallback((date) => {
    const today = new Date();
    return date <= today;
  }, []);

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

  const handleMallChange = useCallback((event) => {
    const mall = malls.find((m) => m.name === event.target.value);
    setSelectedMall(mall.name);
    setStores(mall.stores);
    setSelectedStore("");
    setTurnoverValue("");
    setSelectedTurnoverId(null);
  }, [malls]);

  const handleStoreChange = useCallback((event) => {
    setSelectedStore(event.target.value);
    setTurnoverValue("");
    setSelectedTurnoverId(null);
  }, []);

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
  }, [turnoversByDate, isDateValid, showToast]);

  const goToToday = useCallback(() => {
    const today = new Date();
    handleDateChange(today);
  }, [handleDateChange]);

  const handleTurnoverValueChange = useCallback((value) => {
    setTurnoverValue(value);
  }, []);

  const handleTurnoverSubmit = useCallback(async () => {
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
       let res =   await turnoverService.addTurnover({
          tenantId: parseInt(selectedStore),
          value: parseFloat(turnoverValue),
          date: selectedDate,
        });
        setSelectedTurnoverId(res.id);
        showToast("Turnover added successfully", "success");
      }

      // Refresh turnovers
      const response = await turnoverService.getTurnoversByStore(selectedStore);
      setTurnovers(prev=> response);
    } catch (error) {
      showToast(
        error?.message || "Failed to save turnover",
        "error",
      );
    }
  }, [selectedStore, selectedDate, turnoverValue, selectedTurnoverId, isDateValid, showToast]);

  const handleDeleteTurnover = useCallback(async () => {
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
        error?.message || "Failed to delete turnover",
        "error",
      );
    }
  }, [selectedTurnoverId, selectedStore, showToast]);

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
        <MallStoreSelector
          selectedMall={selectedMall}
          selectedStore={selectedStore}
          malls={malls}
          stores={stores}
          onMallChange={handleMallChange}
          onStoreChange={handleStoreChange}
        />

        <Box
          sx={{
            display: "flex",
            gap: { xs: 3, md: 2 },
            mb: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <TurnoverCalendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            turnoversByDate={turnoversByDate}
            disabled={!selectedStore}
            goToToday={goToToday}
          />

          <TurnoverForm
            turnoverValue={turnoverValue}
            onTurnoverValueChange={handleTurnoverValueChange}
            onSubmit={handleTurnoverSubmit}
            onDelete={handleDeleteTurnover}
            disabled={!selectedStore}
            isDateValid={isDateValid}
            selectedDate={selectedDate}
            selectedTurnoverId={selectedTurnoverId}
            exportComponent={selectedStore ? 
              <TurnoverExport 
                turnovers={turnovers} 
                storeName={stores.find(s => s.id === selectedStore)?.name || 'Store'} 
                disabled={!selectedStore || turnovers.length === 0}
                selectedDate={selectedDate}
              /> : null
            }
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Turnover;
