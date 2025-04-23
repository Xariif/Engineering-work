import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import PublicRoute from './PublicRoute.jsx';
import Layout from '../components/Layout.jsx';
import Dashboard from '../page/Dashboard.jsx';
import TurnoverManager from '../page/TurnoverManager.jsx';
import Permissions from '../page/Permissions.jsx';
import Turnover from '../page/Turnover.jsx';
import Profile from '../page/Profile.jsx';
import Login from '../page/Login.jsx';
import Register from '../page/Register.jsx';
import Logout from '../page/Logout.jsx';
import ForgotPassword from '../page/ForgotPassword.jsx';
import ResetPassword from '../page/ResetPassword.jsx';
import NotFound from '../page/NotFound.jsx';
import ConfirmAccount from '../page/ConfirmAccount.jsx';
import ResendActivation from "../page/ResendActivation.jsx";

const AppRoutes = () => {
    const { user } = useAuth();
    const { toggleColorMode, mode } = useTheme();
    const userRole = user?.role;

    return (
        <Routes>
            <Route
                element={
                    <ProtectedRoute>
                        <Layout onThemeToggle={toggleColorMode} themeMode={mode} />
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<Dashboard />} />
                {userRole === "Manager" && (
                    <>
                        <Route path="/turnover-manager" element={<TurnoverManager />} />
                        <Route path="/permissions" element={<Permissions />} />
                    </>
                )}
                {userRole === "Tenant" && (
                    <>          
                        <Route path="/turnover" element={<Turnover />} />
                    </>
                )}
                <Route path="/profile" element={<Profile />} />
            </Route>
            
            {/* Public routes - only accessible if NOT logged in */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/confirm-account" element={<ConfirmAccount />} />
                <Route path="/resend-activation" element={<ResendActivation />} />
            </Route>
            
            {/* Special routes */}
            <Route path="/logout" element={<Logout />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;