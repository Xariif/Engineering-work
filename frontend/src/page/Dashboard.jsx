import React from 'react';
import { Box, Typography } from '@mui/material';

const Dashboard = () => {
    return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 2,
                }}
            >
                <Typography variant="h3" component="h1">
                    Hello, World!
                </Typography>
                <Typography variant="body1">
                    Welcome to the Dashboard
                </Typography>
            </Box>
    );
};

export default Dashboard;