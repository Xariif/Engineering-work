import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./page/Dashboard.jsx";
import Login from "./page/Login.jsx";
import NotFound from "./page/NotFound.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "./components/Layout.jsx";
import Register from "./page/Register.jsx";
import Permissions from "./page/Permissions.jsx";
import Turnover from "./page/Turnover.jsx";
import Logout from "./page/Logout.jsx";
import ForgotPassword from "./page/ForgotPassword.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // Import the ProtectedRoute

const customTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#6a11cb", // Vibrant purple
        },
        secondary: {
            main: "#2575fc", // Bright blue
        },
        background: {
            default: "#121212", // Dark background
            paper: "#1e1e1e", // Slightly lighter for cards
        },
        text: {
            primary: "#ffffff", // White text
            secondary: "#b0bec5", // Subtle gray text
        },
    },
    typography: {
        fontFamily: "'Roboto', 'Arial', sans-serif",
        h1: {
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#ffffff",
        },
        h2: {
            fontSize: "2rem",
            fontWeight: 600,
            color: "#ffffff",
        },
        body1: {
            fontSize: "1rem",
            color: "#b0bec5",
        },
        button: {
            textTransform: "none", // Disable uppercase for buttons
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px", // Rounded buttons
                    padding: "10px 20px",
                },
                containedPrimary: {
                    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                    color: "#ffffff",
                    "&:hover": {
                        background: "linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)",
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                    boxShadow: "none",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: "#1e1e1e",
                    color: "#ffffff",
                },
            },
        },
    },
});

function App() {
    return (
        <>
            <ThemeProvider theme={customTheme}>
                <CssBaseline />
                <Routes>
                    {/* Protected Routes */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/permissions" element={<Permissions />} />
                        <Route path="/turnover" element={<Turnover />} />
                    </Route>

                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </ThemeProvider>
        </>
    );
}

export default App;
