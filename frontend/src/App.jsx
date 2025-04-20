import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext.jsx";
import { useTheme } from "./context/ThemeContext.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                primary: {
                    main: "#1976d2",
                    light: "#42a5f5",
                    dark: "#1565c0",
                    contrastText: "#ffffff",
                },
                secondary: {
                    main: "#9c27b0",
                    light: "#ba68c8",
                    dark: "#7b1fa2",
                    contrastText: "#ffffff",
                },
                background: {
                    default: "#f5f5f5",
                    paper: "#ffffff",
                },
                text: {
                    primary: "rgba(0, 0, 0, 0.87)",
                    secondary: "rgba(0, 0, 0, 0.6)",
                },
            }
            : {
                primary: {
                    main: "#6a11cb",
                    light: "#9d4edd",
                    dark: "#4a148c",
                    contrastText: "#ffffff",
                },
                secondary: {
                    main: "#2575fc",
                    light: "#5393ff",
                    dark: "#1a4b9a",
                    contrastText: "#ffffff",
                },
                background: {
                    default: "#121212",
                    paper: "#1e1e1e",
                },
                text: {
                    primary: "#ffffff",
                    secondary: "#e0e0e0",
                },
            }),
        error: {
            main: "#f44336",
            light: "#e57373",
            dark: "#d32f2f",
        },
        success: {
            main: "#4caf50",
            light: "#81c784",
            dark: "#388e3c",
        },
    },
    typography: {
        fontFamily: "'Roboto', 'Arial', sans-serif",
        h1: {
            fontSize: "2.5rem",
            fontWeight: 700,
            letterSpacing: "0.02em",
        },
        h2: {
            fontSize: "2rem",
            fontWeight: 600,
            letterSpacing: "0.01em",
        },
        body1: {
            fontSize: "1rem",
            lineHeight: 1.5,
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
            letterSpacing: "0.02em",
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    padding: "8px 16px",
                    transition: "all 0.2s ease-in-out",
                },
                containedPrimary: {
                    background: mode === 'light' 
                        ? "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)"
                        : "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                    color: "#ffffff",
                    "&:hover": {
                        background: mode === 'light'
                            ? "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)"
                            : "linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)",
                        transform: "translateY(-1px)",
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: mode === 'light'
                        ? "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)"
                        : "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: mode === 'light' ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)",
                        "& fieldset": {
                            borderColor: mode === 'light' ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)",
                        },
                        "&:hover fieldset": {
                            borderColor: mode === 'light' ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: mode === 'light' ? "#1976d2" : "#ffffff",
                            borderWidth: "1px",
                        },
                    },
                    "& .MuiInputLabel-root": {
                        color: mode === 'light' ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)",
                        "&.Mui-focused": {
                            color: mode === 'light' ? "#1976d2" : "#ffffff",
                        },
                    },
                    "& .MuiInputBase-input": {
                        color: mode === 'light' ? "rgba(0, 0, 0, 0.87)" : "#ffffff",
                        "&::placeholder": {
                            color: mode === 'light' ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)",
                        },
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ffffff",
                        borderWidth: "1px",
                    },
                },
            },
        },
        MuiSnackbar: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    overflow: "hidden",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: "none",
                    "& .MuiDataGrid-cell": {
                        borderBottom: mode === 'light' 
                            ? "1px solid rgba(0, 0, 0, 0.1)" 
                            : "1px solid rgba(255, 255, 255, 0.1)",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: mode === 'light'
                            ? "rgba(0, 0, 0, 0.05)"
                            : "rgba(255, 255, 255, 0.05)",
                        borderBottom: mode === 'light'
                            ? "1px solid rgba(0, 0, 0, 0.1)"
                            : "1px solid rgba(255, 255, 255, 0.1)",
                    },
                    "& .MuiDataGrid-row:hover": {
                        backgroundColor: mode === 'light'
                            ? "rgba(0, 0, 0, 0.04)"
                            : "rgba(255, 255, 255, 0.05)",
                    },
                },
            },
        },
    },
});

function App() {
    const { mode } = useTheme();
    const theme = createTheme(getDesignTokens(mode));

    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppRoutes />
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
