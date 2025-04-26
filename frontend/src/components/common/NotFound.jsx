import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const NotFound = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center',
                gap: 2,
            }}
        >
            <Typography variant="h1" component="h1" color="error">
                404
            </Typography>
            <Typography variant="h6" component="p">
                Page Not Found
            </Typography>
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/"
                sx={{ textTransform: 'none' }}
            >
                Go Back to Home
            </Button>
        </Box>
    );
};

export default NotFound;