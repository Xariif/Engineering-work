import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Avatar,
  Divider,
  Button,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableFooter
} from "@mui/material";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import accessService from "../services/accessService.js";
import turnoverService from "../services/turnoverService.js";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StoreIcon from '@mui/icons-material/Store';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const TenantDetail = () => {
  const { tenantId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState(null);
  const [turnoverData, setTurnoverData] = useState([]);
  const [totalTurnover, setTotalTurnover] = useState(0);

  // Check user role
  const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
  const userRole = userDetails.role || "";

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (userRole !== "Manager") {
      showToast("Access denied. Manager role required.", "error");
      navigate("/");
      return;
    }
    
    fetchTenantData();
  }, [tenantId, userRole, navigate, showToast]);

  const fetchTenantData = async () => {
    try {
      setLoading(true);
      
      // Step 1: Get all mall data to find the tenant
      const accessData = await accessService.getAccessData();
      if (!accessData || !accessData.malls) {
        throw new Error("Failed to fetch mall data");
      }

      // Find the tenant in all malls
      let foundTenant = null;
      let parentMall = null;
      
      for (const mall of accessData.malls) {
        const tenant = mall.stores.find(store => store.id === parseInt(tenantId));
        if (tenant) {
          foundTenant = tenant;
          parentMall = { name: mall.name, address: mall.address };
          break;
        }
      }

      if (!foundTenant) {
        throw new Error("Tenant not found");
      }

      foundTenant.mall = parentMall;
      setTenant(foundTenant);
      
      // Step 2: Get turnover data for this tenant
      try {
        const turnovers = await turnoverService.getTurnoversByStore(tenantId);
        setTurnoverData(turnovers);
        
        // Get total turnover
        const totalResponse = await turnoverService.getTotalTurnover(tenantId);
        if (totalResponse && totalResponse.total !== undefined) {
          setTotalTurnover(totalResponse.total);
        }
      } catch (err) {
        console.error("Error fetching turnover data:", err);
        showToast("Could not load turnover data", "error");
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tenant data:", error);
      showToast(error.message || "Failed to load tenant data", "error");
      setLoading(false);
      navigate("/turnover-manager");
    }
  };

  const handleBackClick = () => {
    navigate("/turnover-manager");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Group turnovers hierarchically by year and month
  const organizeByYearAndMonth = (turnovers) => {
    const organized = {};
    
    turnovers.forEach(turnover => {
      const date = new Date(turnover.date);
      const year = date.getFullYear().toString();
      const month = format(date, 'MMMM');
      
      if (!organized[year]) {
        organized[year] = {};
      }
      
      if (!organized[year][month]) {
        organized[year][month] = [];
      }
      
      organized[year][month].push(turnover);
    });
    
    return organized;
  };
  
  // Calculate total for each year
  const calculateYearlyTotals = (organizedData) => {
    const yearlyTotals = {};
    
    Object.keys(organizedData).forEach(year => {
      yearlyTotals[year] = 0;
      
      Object.keys(organizedData[year]).forEach(month => {
        const monthlyTotal = organizedData[year][month].reduce(
          (total, turnover) => total + turnover.value, 0
        );
        yearlyTotals[year] += monthlyTotal;
      });
    });
    
    return yearlyTotals;
  };
  
  // Calculate monthly totals for a specific year
  const calculateMonthlyTotals = (yearData) => {
    const monthlyTotals = {};
    
    Object.keys(yearData).forEach(month => {
      monthlyTotals[month] = yearData[month].reduce(
        (total, turnover) => total + turnover.value, 0
      );
    });
    
    return monthlyTotals;
  };

  // Add a function to calculate year-over-year percentage change, excluding current year
  const calculateYearOverYearChange = (yearlyTotals) => {
    const changes = {};
    const years = Object.keys(yearlyTotals).sort((a, b) => parseInt(b) - parseInt(a));
    const currentYear = new Date().getFullYear().toString();
    
    for (let i = 0; i < years.length; i++) {
      const year = years[i];
      const prevYear = years[i + 1]; // Next in array is actually previous year since we sorted desc
      
      // Skip current year
      if (year === currentYear) {
        changes[year] = null;
        continue;
      }
      
      if (prevYear) {
        const yearTotal = yearlyTotals[year];
        const prevTotal = yearlyTotals[prevYear];
        
        if (prevTotal === 0) {
          changes[year] = 100; // Avoid division by zero
        } else {
          const percentChange = ((yearTotal - prevTotal) / prevTotal) * 100;
          changes[year] = percentChange;
        }
      } else {
        changes[year] = null; // No previous year to compare
      }
    }
    
    return changes;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBackClick}
        sx={{ mb: 3 }}
      >
        Back to Tenants
      </Button>
      
      {tenant && (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {tenant.imageUrl ? (
                    <Avatar src={tenant.imageUrl} sx={{ width: 80, height: 80, mr: 3 }} />
                  ) : (
                    <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}>
                      <StoreIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                  )}
                  
                  <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                      {tenant.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                      Mall: {tenant.mall.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tenant.mall.address}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: { xs: 'flex-start', md: 'flex-end' },
                  height: '100%',
                  justifyContent: 'center'
                }}>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                    Total Turnover: {formatCurrency(totalTurnover)}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                    {turnoverData.length} turnover records
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" sx={{ mb: 2 }}>
              Users with Access
            </Typography>
            
            {tenant.accesses && tenant.accesses.length > 0 ? (
              <Grid container spacing={2}>
                {tenant.accesses.map((access, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1">
                              {access.userName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {access.userEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="text.secondary">No users have access to this tenant</Typography>
            )}
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" component="h2">
                Turnover History
              </Typography>
            </Box>
            
            {turnoverData.length > 0 ? (
              <>
                {/* Nested view by year and month */}
                {Object.entries(organizeByYearAndMonth(turnoverData))
                  .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA)) // Sort years in descending order
                  .map(([year, months]) => {
                    const yearlyTotal = Object.values(months).flat().reduce(
                      (sum, item) => sum + item.value, 0
                    );
                    
                    return (
                      <Accordion key={year} defaultExpanded={true}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.03)',
                            borderLeft: 4,
                            borderColor: 'primary.main'
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <Typography variant="h6">{year}</Typography>
                            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                              {formatCurrency(yearlyTotal)}
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                          {Object.entries(months)
                            .sort(([monthA], [monthB]) => {
                              // Sort months in descending order
                              const monthOrder = [
                                'December', 'November', 'October', 'September', 'August', 'July',
                                'June', 'May', 'April', 'March', 'February', 'January'
                              ];
                              return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
                            })
                            .map(([month, turnovers]) => {
                              const monthlyTotal = turnovers.reduce(
                                (sum, item) => sum + item.value, 0
                              );
                              
                              return (
                                <Accordion key={`${year}-${month}`} sx={{ boxShadow: 'none' }}>
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{ 
                                      backgroundColor: 'rgba(0, 0, 0, 0.01)',
                                      borderLeft: 3,
                                      borderColor: 'primary.light',
                                      ml: 2
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                      <Typography variant="subtitle1">{month}</Typography>
                                      <Box>
                                        <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 'bold' }}>
                                          {formatCurrency(monthlyTotal)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {turnovers.length} entries
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </AccordionSummary>
                                  <AccordionDetails sx={{ px: 0 }}>
                                    <TableContainer>
                                      <Table size={isSmallScreen ? "small" : "medium"}>
                                        <TableHead>
                                          <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' } }}>Added By</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', md: 'table-cell' } }}>ID</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {turnovers
                                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                                            .map((item) => (
                                              <TableRow 
                                                key={item.id}
                                                sx={{ 
                                                  '&:hover': { bgcolor: 'action.hover' },
                                                  transition: 'background-color 0.2s'
                                                }}
                                              >
                                                <TableCell>
                                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <CalendarMonthIcon 
                                                      sx={{ 
                                                        mr: 1, 
                                                        color: 'text.secondary', 
                                                        fontSize: 16,
                                                        display: { xs: 'none', sm: 'block' }
                                                      }} 
                                                    />
                                                    {format(new Date(item.date), isSmallScreen ? 'MM/dd' : 'MMMM d')}
                                                  </Box>
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                  {formatCurrency(item.value)}
                                                </TableCell>
                                                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                                  {item.userName || 'Unknown'}
                                                </TableCell>
                                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                                  {item.id}
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter>
                                          <TableRow sx={{ 
                                            backgroundColor: 'rgba(0, 0, 0, 0.03)', 
                                            '& .MuiTableCell-root': { fontWeight: 'bold' } 
                                          }}>
                                            <TableCell>Monthly Total</TableCell>
                                            <TableCell sx={{ color: 'primary.main' }}>
                                              {formatCurrency(monthlyTotal)}
                                            </TableCell>
                                            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                              {turnovers.length} records
                                            </TableCell>
                                            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}></TableCell>
                                          </TableRow>
                                        </TableFooter>
                                      </Table>
                                    </TableContainer>
                                  </AccordionDetails>
                                </Accordion>
                              );
                            })}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                
                {/* Summary Cards - Keeping these for overview */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Summary by Year
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {(() => {
                      const yearlyTotals = calculateYearlyTotals(organizeByYearAndMonth(turnoverData));
                      const yoyChanges = calculateYearOverYearChange(yearlyTotals);
                      const currentYear = new Date().getFullYear().toString();
                      
                      return Object.entries(yearlyTotals)
                        .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
                        .map(([year, total]) => {
                          const isCurrentYear = year === currentYear;
                          const percentChange = yoyChanges[year];
                          const hasChange = percentChange !== null;
                          const isPositiveChange = percentChange > 0;
                          
                          return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={year}>
                              <Card
                                sx={{
                                  bgcolor: 'background.paper',
                                  boxShadow: 2,
                                  borderRadius: 2,
                                  p: 2,
                                  minWidth: 150,
                                  borderLeft: 5,
                                  borderColor: 'primary.main'
                                }}
                              >
                                <Typography variant="h6" color="text.secondary">
                                  {year}
                                  {isCurrentYear && " (Current)"}
                                </Typography>
                                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mt: 1, color: 'primary.main' }}>
                                  {formatCurrency(total)}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {Object.values(organizeByYearAndMonth(turnoverData)[year]).flat().length} entries
                                  </Typography>
                                  {!isCurrentYear && hasChange && (
                                    <Chip
                                      label={`${isPositiveChange ? '+' : ''}${percentChange.toFixed(1)}% vs ${parseInt(year) - 1}`}
                                      size="small"
                                      color={isPositiveChange ? "success" : "error"}
                                      sx={{ fontWeight: 'bold', ml: 1 }}
                                    />
                                  )}
                                </Box>
                              </Card>
                            </Grid>
                          );
                        });
                    })()}
                  </Grid>
                </Box>
              </>
            ) : (
              <Typography color="text.secondary">No turnover records available for this tenant</Typography>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
};

export default TenantDetail; 