import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Select, MenuItem, FormControl, InputLabel, TextField, Button } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import turnoverService from '../services/turnoverService.js';
import accessService from '../services/accessService.js';

const Turnover = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [selectedMall, setSelectedMall] = useState('');
    const [selectedStore, setSelectedStore] = useState('');
    const [malls, setMalls] = useState([]);
    const [stores, setStores] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [turnoverValue, setTurnoverValue] = useState('');
    const [turnovers, setTurnovers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedTurnoverId, setSelectedTurnoverId] = useState(null);

    const isDateValid = (date) => {
        const today = new Date();
        const currentYear = today.getFullYear();
        
        return date.getFullYear() === currentYear && date <= today;
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
                console.error('Error fetching access data:', error);
                showToast('Failed to load mall and store data', 'error');
            }
        };

        fetchAccessData();
    }, []);

    useEffect(() => {
        const fetchTurnovers = async () => {
            if (selectedStore) {
                try {
                    const response = await turnoverService.getTurnoversByStore(selectedStore);
                    setTurnovers(response);
                } catch (error) {
                    console.error('Error fetching turnovers:', error);
                    setError('Failed to load turnover data');
                }
            }
        };

        fetchTurnovers();
    }, [selectedStore]);

    const handleMallChange = (event) => {
        const mall = malls.find(m => m.name === event.target.value);
        setSelectedMall(mall.name);
        setStores(mall.stores);
        setSelectedStore('');
        setTurnoverValue('');
        setError('');
        setSuccess('');
    };

    const handleStoreChange = (event) => {
        setSelectedStore(event.target.value);
        setTurnoverValue('');
        setError('');
        setSuccess('');
    };

    const handleDateChange = (date) => {
        if (!isDateValid(date)) {
            setError('Turnover can only be added for the current year and dates not exceeding today');
            return;
        }
        setSelectedDate(date);
        const dateString = date.toLocaleDateString('en-CA');
        const turnover = turnovers.find(t => new Date(t.date).toLocaleDateString('en-CA') === dateString);
        setTurnoverValue(turnover?.value || '');
        setSelectedTurnoverId(turnover?.id || null);
        setError('');
        setSuccess('');
    };

    const handleTurnoverSubmit = async () => {
        if (!selectedStore || !selectedDate || !turnoverValue) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        if (!isDateValid(selectedDate)) {
            showToast('Turnover can only be added for the current year and dates not exceeding today', 'error');
            return;
        }

        try {
            if (selectedTurnoverId) {
                // Update existing turnover
                await turnoverService.updateTurnover(selectedTurnoverId, {
                    tenantId: parseInt(selectedStore),
                    value: parseFloat(turnoverValue),
                    date: selectedDate
                });
                showToast('Turnover updated successfully', 'info');
            } else {
                // Add new turnover
                await turnoverService.addTurnover({
                    tenantId: parseInt(selectedStore),
                    value: parseFloat(turnoverValue),
                    date: selectedDate
                });
                showToast('Turnover added successfully', 'success');
            }
            
            // Refresh turnovers
            const response = await turnoverService.getTurnoversByStore(selectedStore);
            setTurnovers(response);
        } catch (error) {
            console.error('Error saving turnover:', error);
            showToast(error.response?.data?.message || 'Failed to save turnover', 'error');
        }
    };

    const handleDeleteTurnover = async () => {
        if (!selectedTurnoverId) {
            showToast('No turnover selected to delete', 'error');
            return;
        }

        try {
            await turnoverService.deleteTurnover(selectedTurnoverId);
            showToast('Turnover deleted successfully', 'success');
            
            // Refresh turnovers
            const response = await turnoverService.getTurnoversByStore(selectedStore);
            setTurnovers(response);
            
            // Clear selected turnover
            setTurnoverValue('');
            setSelectedTurnoverId(null);
        } catch (error) {
            console.error('Error deleting turnover:', error);
            showToast(error.response?.data?.message || 'Failed to delete turnover', 'error');
        }
    };

    if (user?.role === 'Manager') {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Manager Turnover View
                </Typography>
                {/* Manager view will be implemented later */}
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    textAlign: 'center',
                    fontWeight: 'bold',
                    mb: 4,
                    color: 'primary.main',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                Turnover Management
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Box 
                        sx={{ 
                            flex: { xs: '1', md: '2' },
                            '& .MuiDateCalendar-root': {
                                width: '100%',
                                maxWidth: 'none',
                                height: 'auto',
                                minHeight: '400px',
                            },
                            '& .MuiPickersDay-root': {
                                width: 'auto',
                                height: 'auto',
                                padding: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                            }
                        }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateCalendar
                                value={selectedDate}
                                onChange={handleDateChange}
                                disabled={!selectedStore}
                                maxDate={new Date()}
                                views={['year', 'month', 'day']}
                                disableFuture
                                sx={{
                                    '& .MuiPickersDay-root': {
                                        '&.Mui-selected': {
                                            backgroundColor: 'primary.main',
                                        },
                                    },
                                }}
                                slots={{
                                    day: (props) => {
                                        const dateString = props.day.toLocaleDateString('en-CA');
                                        const turnover = turnovers.find(t => {
                                            try {
                                                const turnoverDate = new Date(t.date);
                                                if (isNaN(turnoverDate.getTime())) {
                                                    return false;
                                                }
                                                return turnoverDate.toLocaleDateString('en-CA') === dateString;
                                            } catch (error) {
                                                console.error('Error processing turnover date:', error);
                                                return false;
                                            }
                                        });
                                        
                                        return (
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '100%',
                                                }}
                                            >
                                                <PickersDay
                                                    {...props}
                                                    sx={{
                                                        width: '100% !important',
                                                        height: '100% !important',
                                                        borderRadius: '8px !important',
                                                        ...(turnover && {
                                                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                                                            },
                                                            '&.Mui-selected': {
                                                                backgroundColor: 'primary.main',
                                                            },
                                                        }),
                                                    }}
                                                />
                                                {turnover && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            position: 'absolute',
                                                            bottom: '2px',
                                                            left: '50%',
                                                            transform: 'translateX(-50%)',
                                                            fontSize: '0.7rem',
                                                            color: props.selected ? 'white' : 'text.secondary',
                                                            fontWeight: 'bold',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '90%',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {new Intl.NumberFormat('pl-PL', {
                                                            style: 'currency',
                                                            currency: 'PLN',
                                                            minimumFractionDigits: 0,
                                                            maximumFractionDigits: 0,
                                                        }).format(turnover.value)}
                                                    </Typography>
                                                )}
                                            </Box>
                                        );
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </Box>

                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2, 
                        flex: { xs: '1', md: '1' }
                    }}>
                        <TextField
                            fullWidth
                            label="Turnover Value"
                            type="number"
                            value={turnoverValue}
                            onChange={(e) => setTurnoverValue(e.target.value)}
                            disabled={!selectedStore}
                            InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>PLN</Typography>,
                            }}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                onClick={handleTurnoverSubmit}
                                disabled={!selectedStore || !selectedDate || !turnoverValue || !isDateValid(selectedDate)}
                                fullWidth
                                color={selectedTurnoverId ? "info" : "primary"}
                            >
                                {selectedTurnoverId ? 'Update Turnover' : 'Add Turnover'}
                            </Button>
                            {selectedTurnoverId && (
                                <Button
                                    variant="outlined"
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
