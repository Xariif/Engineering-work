import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';

const Reports = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper 
                elevation={3} 
                sx={{ 
                    borderRadius: 4,
                    overflow: 'hidden',
                    p: 4
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Reports
                </Typography>
                <Typography variant="body1" paragraph>
                    This is the reports dashboard for managers. Here you can view and generate various reports related to tenant turnover and mall performance.
                </Typography>
                <Box sx={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        Report content will be displayed here
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Reports; 