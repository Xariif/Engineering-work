import { createContext, useContext, useState, useEffect } from "react";
import accountService from "../services/accountService.js";
import { useTheme } from "./ThemeContext.jsx";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const { resetTheme } = useTheme();

	useEffect(() => {
		const localStorageUser = localStorage.getItem("userDetails");
		const token = localStorage.getItem("authToken");

		if (localStorageUser && token) {
			accountService
				.verifyToken()
				.then(() => {
					setUser((prev) => ({ ...prev, ...JSON.parse(localStorageUser) }));
				})
				.catch(() => {
					logout();
				})
				.finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, []);

	const login = async (email, password) => {
		try {
			const response = await accountService.login(email, password);

			const { token, firstName, lastName, phoneNumber, role, email: userEmail } = response;
			localStorage.setItem("authToken", token);

			// Instead of trying to decode the token, use the response data directly
			const userData = {
				email: userEmail,
				firstName,
				lastName,
				phoneNumber,
				role,
			};

			setUser(userData);
			localStorage.setItem("userDetails", JSON.stringify(userData));

			return response;
		} catch (error) {
			throw error;
		}
	};

	const logout = () => {
		localStorage.removeItem("authToken");
		localStorage.removeItem("userDetails");
		resetTheme();
		setUser(null);
	};

	const updateUser = (userData) => {
		if (user) {
			setUser((prevUser) => ({
				...prevUser,
				firstName: userData.firstName,
				lastName: userData.lastName,
				phoneNumber: userData.phoneNumber,
				role: userData.role,
			}));
		}
	};

	const value = {
		user,
		login,
		logout,
		updateUser,
	};

	return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export default AuthContext;
