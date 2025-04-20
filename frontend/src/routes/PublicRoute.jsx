import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Public routes are accessible only when the user is NOT logged in
// If a logged-in user tries to access these routes, they are redirected to the dashboard
const PublicRoute = ({ children }) => {
    const { user } = useAuth();

    if (user) {
        // User is logged in, redirect to dashboard
        return <Navigate to="/" replace />;
    }

    // User is not logged in, render the public route
    return children ? children : <Outlet />;
};

export default PublicRoute; 