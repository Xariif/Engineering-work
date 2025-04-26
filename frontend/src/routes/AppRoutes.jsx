import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "@mui/material/styles";
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import PublicRoute from '../components/common/PublicRoute.jsx';
import NotFound from '../components/common/NotFound.jsx';
import Layout from '../components/layout/Layout.jsx';
import Dashboard from '../components/dashboard/Dashboard.jsx';
import TurnoverManager from '../components/turnover/manager/TurnoverManager.jsx';
import TenantDetail from '../components/turnover/manager/TenantDetail.jsx';
import Permissions from '../components/permissions/Permissions.jsx';
import Turnover from '../components/turnover/tenant/Turnover.jsx';
import Profile from '../components/profile/Profile.jsx';
import Login from '../components/auth/Login.jsx';
import Register from '../components/auth/Register.jsx';
import Logout from '../components/auth/Logout.jsx';
import ForgotPassword from '../components/auth/ForgotPassword.jsx';
import ResetPassword from '../components/auth/ResetPassword.jsx';
import ConfirmAccount from '../components/auth/ConfirmAccount.jsx';
import ResendActivation from '../components/auth/ResendActivation.jsx';
import { Route, Routes } from "react-router-dom";
import Reports from "../components/reports/Reports.jsx";


const AppRoutes = ( { toggleColorMode, mode }) => {
	const { user } = useAuth();

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
						<Route path="/reports" element={<Reports />} />
						<Route path="/turnover-manager" element={<TurnoverManager />} />
						<Route path="/tenant/:tenantId" element={<TenantDetail />} />
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
