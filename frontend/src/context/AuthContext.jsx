import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUser({
                id: decodedToken.nameid,
                email: decodedToken.email,
                role: decodedToken.role,
                firstName: decodedToken.firstName,
                lastName: decodedToken.lastName,
                phoneNumber: decodedToken.phoneNumber
            });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await apiService.post('account/login', { email, password });
            const { token } = response;
            localStorage.setItem('token', token);
            
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUser({
                id: decodedToken.nameid,
                email: decodedToken.email,
                role: decodedToken.role,
                firstName: decodedToken.firstName,
                lastName: decodedToken.lastName,
                phoneNumber: decodedToken.phoneNumber
            });
            
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateUser = (userData) => {
        if (user) {
            setUser(prevUser => ({
                ...prevUser,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phoneNumber: userData.phoneNumber
            }));
        }
    };

    const value = {
        user,
        login,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext; 