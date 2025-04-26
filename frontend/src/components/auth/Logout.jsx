import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

const Logout = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const { resetTheme } = useTheme();

    useEffect(() => {
        localStorage.clear();
        sessionStorage.clear();
        resetTheme();
        auth.logout();
        navigate("/login");
    }, [navigate]);

    return null;
};

export default Logout;