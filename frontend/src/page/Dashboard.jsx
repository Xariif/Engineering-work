import React from "react";
import { Box, Typography, Paper, Grid, Divider, Card, CardContent, CardMedia, Button } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import SecurityIcon from "@mui/icons-material/Security";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { user } = useAuth();
    const userRole = user?.role || "";

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                pb: 4,
            }}
        >
            {/* 1. Application Overview */}
            <Paper
                elevation={3}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        p: { xs: 3, md: 5 },
                        color: "white",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        Engineering Work Management System
                    </Typography>
                    <Typography variant="h6" sx={{ maxWidth: 800, mb: 2, opacity: 0.9 }}>
                        A comprehensive solution for mall management, tenant turnover tracking, and data analytics
                    </Typography>
                    <Typography variant="body1" sx={{ maxWidth: 800 }}>
                        This platform provides tools for both mall managers and tenants to collaborate efficiently.
                        With role-based access control, each user can access features relevant to their responsibilities
                        while maintaining data security and privacy.
                    </Typography>
                </Box>

                <Box sx={{ p: { xs: 3, md: 4 } }}>
                    <Grid container spacing={1} sx={{ width: '100%' }} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Grid item xs={12} md={6} lg={4}>
                            <Box textAlign="center" p={2}>
                                <TrendingUpIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
                                <Typography variant="h6" gutterBottom>
                                    Turnover Management
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Track and report store turnover with an intuitive interface for both managers and tenants.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Box textAlign="center" p={2}>
                                <SecurityIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
                                <Typography variant="h6" gutterBottom>
                                    Access Control
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Manage permissions and user roles with a robust security system.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Box textAlign="center" p={2}>
                                <BarChartIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
                                <Typography variant="h6" gutterBottom>
                                    Data Analytics
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Generate meaningful reports and visualize data trends for better decision making.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* 2. Tenant Turnover Section */}
            <Card 
                elevation={3}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                <Grid container>
                    <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
                        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                            <Box 
                                sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    mb: 2,
                                    gap: 1 
                                }}
                            >
                                <TrendingUpIcon sx={{ fontSize: 36, color: "primary.main" }} />
                                <Typography variant="h4" component="h2" fontWeight="600">
                                    Tenant Turnover Module
                                </Typography>
                            </Box>
                            
                            <Typography variant="body1" paragraph>
                                The Tenant Turnover Module provides a streamlined way to report and track 
                                store revenue. Tenants can easily submit their daily turnover data through a 
                                user-friendly calendar interface.
                            </Typography>
                            
                            <Typography variant="body1" paragraph>
                                Mall managers gain access to comprehensive turnover data across all stores,
                                enabling them to analyze performance trends and make data-driven decisions.
                            </Typography>
                            
                            <Box sx={{ mt: 3 }}>
                                {userRole === "Tenant" && (
                                    <Button 
                                        component={Link} 
                                        to="/turnover" 
                                        variant="contained" 
                                        color="primary" 
                                        endIcon={<ArrowForwardIcon />}
                                    >
                                        Go to Turnover
                                    </Button>
                                )}
                                
                                {userRole === "Manager" && (
                                    <Button 
                                        component={Link} 
                                        to="/turnover-manager" 
                                        variant="contained" 
                                        color="primary" 
                                        endIcon={<ArrowForwardIcon />}
                                    >
                                        Manage Turnover Data
                                    </Button>
                                )}
                                
                                {!user && (
                                    <Box sx={{ position: 'relative' }}>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            endIcon={<ArrowForwardIcon />}
                                            disabled
                                            sx={{ 
                                                opacity: 0.7,
                                                '&.Mui-disabled': {
                                                    color: 'white',
                                                    backgroundColor: (theme) => theme.palette.primary.main + '80'
                                                }
                                            }}
                                        >
                                            Access Turnover
                                        </Button>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                position: 'absolute', 
                                                bottom: -18, 
                                                left: 8, 
                                                color: 'text.secondary',
                                                fontSize: '0.7rem'
                                            }}
                                        >
                                            Log in to access turnover features
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box 
                            sx={{ 
                                p: 2, 
                                height: '100%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center'
                            }}
                        >
                            <CardMedia
                                component="img"
                                image="/tenantTurnoverModule.png"
                                alt="Tenant Turnover Module"
                                sx={{ 
                                    maxHeight: 400,
                                    width: 'auto',
                                    maxWidth: '100%',
                                    borderRadius: 2,
                                    boxShadow: 3
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Card>

            {/* 3. Permissions Tool Section */}
            <Card 
                elevation={3}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                <Grid container spacing={0}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
                        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                            <Box 
                                sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    mb: 2,
                                    gap: 1 
                                }}
                            >
                                <SecurityIcon sx={{ fontSize: 36, color: "primary.main" }} />
                                <Typography variant="h4" component="h2" fontWeight="600">
                                    Permissions Management
                                </Typography>
                            </Box>
                            
                            <Typography variant="body1" paragraph>
                                The Permissions Management system gives mall administrators complete control 
                                over user access and privileges within the platform. Easily assign roles and 
                                specific permissions to ensure data security.
                            </Typography>
                            
                            <Typography variant="body1" paragraph>
                                Create custom permission sets, manage user-store relationships, and control
                                exactly what data each tenant can access and modify.
                            </Typography>
                            
                            <Box sx={{ mt: 3 }}>
                                {userRole === "Manager" && (
                                    <Button 
                                        component={Link} 
                                        to="/permissions" 
                                        variant="contained" 
                                        color="primary" 
                                        endIcon={<ArrowForwardIcon />}
                                    >
                                        Manage Permissions
                                    </Button>
                                )}
                                
                                {userRole !== "Manager" && userRole !== "" && (
                                    <Box sx={{ position: 'relative' }}>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            endIcon={<ArrowForwardIcon />}
                                            disabled
                                            sx={{ 
                                                opacity: 0.7,
                                                '&.Mui-disabled': {
                                                    color: 'white',
                                                    backgroundColor: (theme) => theme.palette.primary.main + '80'
                                                }
                                            }}
                                        >
                                            Manage Permissions
                                        </Button>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                position: 'absolute', 
                                                bottom: -18, 
                                                left: 8, 
                                                color: 'text.secondary',
                                                fontSize: '0.7rem'
                                            }}
                                        >
                                            Available for Managers only
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ width: '100%' }}>
                        <Box 
                            sx={{ 
                                p: 2, 
                                height: '100%', 
                                width: '100%',
                                display: 'flex', 
                                flexDirection: { xs: 'column', lg: 'row' },
                                flexWrap: 'wrap',
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                gap: 3
                            }}
                        >
                            <Box 
                                sx={{ 
                                    width: { xs: '100%', lg: 'calc(50% - 12px)' }, 
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography variant="subtitle1" color="primary.main" gutterBottom fontWeight="500">
                                    Permission Management Interface
                                </Typography>
                                <Box 
                                    sx={{ 
                                        flexGrow: 1, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center' 
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image="/permissionsTool.png"
                                        alt="Permissions Tool"
                                        sx={{ 
                                            maxHeight: { xs: 180, lg: 220 },
                                            width: 'auto',
                                            maxWidth: '100%',
                                            margin: '0 auto',
                                            borderRadius: 2,
                                            boxShadow: 3
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box 
                                sx={{ 
                                    width: { xs: '100%', lg: 'calc(50% - 12px)' }, 
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography variant="subtitle1" color="primary.main" gutterBottom fontWeight="500">
                                    Detailed Permission Controls
                                </Typography>
                                <Box 
                                    sx={{ 
                                        flexGrow: 1, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center' 
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image="/permissionsDetails.png"
                                        alt="Permissions Details"
                                        sx={{ 
                                            maxHeight: { xs: 180, lg: 220 },
                                            width: 'auto',
                                            maxWidth: '100%',
                                            margin: '0 auto',
                                            borderRadius: 2,
                                            boxShadow: 3
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Card>

            {/* 4. Reports Section */}
            <Paper
                elevation={3}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    p: { xs: 3, md: 4 },
                    width: '100%'
                }}
            >
                <Box 
                    sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        mb: 2,
                        gap: 1 
                    }}
                >
                    <BarChartIcon sx={{ fontSize: 36, color: "primary.main" }} />
                    <Typography variant="h4" component="h2" fontWeight="600">
                        Reports & Analytics
                    </Typography>
                </Box>

                <Typography variant="body1" paragraph>
                    The Reports module transforms raw turnover data into actionable insights through powerful 
                    analytics and visualizations. Compare performance across different time periods, identify trends,
                    and make data-driven decisions.
                </Typography>
                
                <Box sx={{ mt: 3, mb: 4 }}>
                    {userRole === "Manager" && (
                        <Button 
                            component={Link} 
                            to="/reports" 
                            variant="contained" 
                            color="primary" 
                            endIcon={<ArrowForwardIcon />}
                        >
                            View Reports
                        </Button>
                    )}
                    {userRole !== "Manager" && userRole !== "" && (
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                endIcon={<ArrowForwardIcon />}
                                disabled
                                sx={{ 
                                    opacity: 0.7,
                                    '&.Mui-disabled': {
                                        color: 'white',
                                        backgroundColor: (theme) => theme.palette.primary.main + '80'
                                    }
                                }}
                            >
                                View Reports
                            </Button>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    position: 'absolute', 
                                    bottom: -18, 
                                    left: 8, 
                                    color: 'text.secondary',
                                    fontSize: '0.7rem'
                                }}
                            >
                                Available for Managers only
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Grid container spacing={3} sx={{ width: '100%' }}>
                    <Grid item xs={12} sx={{ width: '100%' }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Performance Metrics
                                </Typography>
                                <Typography variant="body2">
                                    Track key performance indicators like year-over-year growth, average daily turnover,
                                    and seasonal variations to measure store and mall performance.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sx={{ width: '100%' }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Comparative Analysis
                                </Typography>
                                <Typography variant="body2">
                                    Compare turnover data between different stores, categories, or time periods
                                    to identify high-performing tenants and successful business models.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sx={{ width: '100%' }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Custom Reports
                                </Typography>
                                <Typography variant="body2">
                                    Create customized reports tailored to specific business questions and export
                                    them in multiple formats for presentations and further analysis.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Dashboard;