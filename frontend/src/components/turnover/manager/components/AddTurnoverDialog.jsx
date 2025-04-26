import React, { useMemo, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, parse, isAfter, isSameDay, parseISO } from 'date-fns';

const AddTurnoverDialog = ({ 
  open, 
  handleClose, 
  newTurnoverData, 
  setNewTurnoverData, 
  handleAddTurnover,
  turnoverData
}) => {
  // Create a Set of dates that already have turnover records
  const existingDates = useMemo(() => {
    const dates = new Set();
    if (turnoverData && turnoverData.length > 0) {
      turnoverData.forEach(turnover => {
        // Extract just the date part (YYYY-MM-DD) from ISO strings or date objects
        let dateStr;
        if (typeof turnover.date === 'string') {
          // Handle ISO date strings by extracting just the date part
          dateStr = turnover.date.split('T')[0];
        } else {
          dateStr = format(new Date(turnover.date), 'yyyy-MM-dd');
        }
        dates.add(dateStr);
      });
    }
    return dates;
  }, [turnoverData]);


  const handleValueChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setNewTurnoverData(prev => ({
      ...prev,
      value: value
    }));
  };

  const handleDateChange = (newDate) => {
    if (!newDate) return;
    setNewTurnoverData(prev => ({
      ...prev,
      date: format(newDate, 'yyyy-MM-dd')
    }));
  };

  // Function to disable dates
  const shouldDisableDate = (date) => {
    if (!date) return false;
    
    // Format the date to YYYY-MM-DD for comparison with the Set
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Disable dates that already have turnover records
    if (existingDates.has(formattedDate)) {
      return true;
    }
    
    // Disable future dates (after today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isAfter(date, today)) {
      return true;
    }
    
    return false;
  };

  // Find first available date when opening the dialog
  useEffect(() => {
    if (open && existingDates.size > 0) {
      const today = new Date();
      // Try to find a date that doesn't exist in the set
      let availableDate = null;
      for (let i = 0; i < 366; i++) { // try up to a year back
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        if (!shouldDisableDate(checkDate)) {
          availableDate = checkDate;
          break;
        }
      }

      if (availableDate) {
        setNewTurnoverData(prev => ({
          ...prev,
          date: format(availableDate, 'yyyy-MM-dd')
        }));
      }
    }
  }, [open, existingDates]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Turnover</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={typeof newTurnoverData.date === 'string' 
                ? parse(newTurnoverData.date, 'yyyy-MM-dd', new Date()) 
                : newTurnoverData.date}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
              shouldDisableDate={shouldDisableDate}
              maxDate={new Date()} // Set maximum date to today
            />
          </LocalizationProvider>
          
          <TextField
            label="Turnover Value"
            value={newTurnoverData.value}
            onChange={handleValueChange}
            type="text"
            fullWidth
            margin="normal"
            placeholder="Enter value"
            inputProps={{ inputMode: 'numeric' }}
            helperText="Enter the turnover value in EUR"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button 
          onClick={handleAddTurnover} 
          color="primary" 
          variant="contained"
          disabled={!newTurnoverData.value}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTurnoverDialog; 