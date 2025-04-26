import React, { useMemo } from 'react';
import { Box, Typography, useMediaQuery, alpha, Card, CardContent, Divider } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import BarChartIcon from '@mui/icons-material/BarChart';

const BarChartSection = ({ data, title = "Tenant Performance Comparison" }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    
    // Define a set of distinct, visually appealing colors for charts
    const chartColors = useMemo(() => [
        '#1f77b4', // Blue
        '#ff7f0e', // Orange
        '#2ca02c', // Green
        '#d62728', // Red
        '#9467bd', // Purple
        '#8c564b', // Brown
        '#e377c2', // Pink
        '#7f7f7f', // Gray
        '#bcbd22', // Olive
        '#17becf'  // Teal
    ], []);
    
    // Assign colors to tenants
    const getTenantColors = useMemo(() => {
        const colorMap = {};
        
        if (data && data.series) {
            data.series.forEach((series, index) => {
                // Cycle through colors if there are more tenants than colors
                colorMap[series.name] = chartColors[index % chartColors.length];
            });
        }
        
        return colorMap;
    }, [data, chartColors]);

    // Memoize chart data preparation to optimize performance - always call this hook
    const chartData = useMemo(() => {
        // Handle empty data case
        if (!data || !data.series || data.series.length === 0 || !data.labels || data.labels.length === 0) {
            return {
                series: [],
                xAxisData: [],
                maxValue: 0,
                topTenants: [],
                tenantNames: []
            };
        }
        
        // Get top tenants by summing their values across all periods
        const tenantTotals = {};
        
        data.series.forEach(series => {
            const total = series.data.reduce((sum, val) => sum + val, 0);
            tenantTotals[series.name] = total;
        });
        
        // Sort tenants by total and take top 6
        const topTenants = Object.entries(tenantTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name]) => name);
            
        // Filter series to only include top tenants
        const filteredSeries = data.series.filter(series => 
            topTenants.includes(series.name)
        );

        // Create series data for each tenant
        const series = filteredSeries.map((tenantSeries) => {
            return {
                data: tenantSeries.data,
                label: tenantSeries.name,
                color: getTenantColors[tenantSeries.name],
                valueFormatter: (value) => new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(value)
            };
        });
        
        // Calculate max value for better visualization
        const maxValue = Math.max(
            ...filteredSeries.flatMap(series => series.data)
        ) * 1.1; // Add 10% padding
        
        return {
            series,
            xAxisData: data.labels,
            maxValue,
            topTenants,
            tenantNames: filteredSeries.map(series => series.name)
        };
    }, [data, getTenantColors]);

    // Calculate chart dimensions - always call this hook
    const chartHeight = useMemo(() => {
        // Default height if no data
        if (!chartData.xAxisData || chartData.xAxisData.length === 0) {
            return isSmallScreen ? 350 : isMediumScreen ? 450 : 500;
        }
        // Increase height based on number of data points
        const baseHeight = isSmallScreen ? 350 : isMediumScreen ? 450 : 500;
        return Math.max(baseHeight, chartData.xAxisData.length * 60);
    }, [isSmallScreen, isMediumScreen, chartData.xAxisData]);

    // Render empty state if no data
    if (!data || !data.series || data.series.length === 0 || !data.labels || data.labels.length === 0 ||
        !chartData.series || chartData.series.length === 0) {
        return (
            <Card 
                elevation={2} 
                sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    borderRadius: 2,
                    background: alpha(theme.palette.background.paper, 0.8),
                    height: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }}
            >
                <BarChartIcon sx={{ fontSize: 48, color: alpha(theme.palette.primary.main, 0.5), mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    No data available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Please adjust filters or check back later
                </Typography>
            </Card>
        );
    }

    return (
        <Card 
            elevation={3} 
            sx={{ 
                mb: 4,
                borderRadius: 3,
                overflow: 'hidden',
                backgroundColor: theme.palette.background.paper,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-4px)'
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <BarChartIcon sx={{ color: theme.palette.primary.main, fontSize: 28, mr: 1.5 }} />
                    <Box>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Monthly turnover comparison for top {chartData.topTenants.length} tenants
                        </Typography>
                    </Box>
                </Box>
                
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ 
                    height: 500,
                    width: '100%',
                    mt: 3
                }}>
                    <BarChart
                        xAxis={[{ 
                            label: 'Time Period',
                            scaleType: 'band',
                            data: chartData.xAxisData,
                            tickLabelStyle: {
                                angle: 45,
                                textAnchor: 'start',
                                fontSize: 12
                            },
                            labelStyle: {
                                transform: 'translateY(30px)'
                            }
                        }]}
                        yAxis={[{
                            label: 'Turnover (EUR)',
                            max: chartData.maxValue,
                            tickLabelStyle: {
                                fontSize: 12
                            },
                            valueFormatter: (value) => 
                                value >= 1000000 
                                    ? `${(value / 1000000).toFixed(1)}M €` 
                                    : value >= 1000 
                                        ? `${(value / 1000).toFixed(0)}k €` 
                                        : `${value.toFixed(0)} €`
                        }]}
                        series={chartData.series}
                        layout="vertical"
                        margin={{ 
                            left: 80,  
                            right: 20,
                            top: 50,
                            bottom: 80
                        }}
                        slotProps={{
                            legend: {
                                position: {
                                    vertical: 'top',
                                    horizontal: 'middle'
                                },
                                labelStyle: {
                                    fontSize: 12
                                },
                                itemGap: 10
                            },
                            bar: {
                                borderRadius: 4,
                                paddingInner: 0.5,
                                paddingOuter: 0.3
                            }
                        }}
                    />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
                    Comparing monthly turnover across {chartData.xAxisData.length} periods 
                    {chartData.xAxisData.length > 0 ? ` (${chartData.xAxisData[0]} - ${chartData.xAxisData[chartData.xAxisData.length-1]})` : ''}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default BarChartSection;