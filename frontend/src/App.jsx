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
                    main: "#2e7d32",
                    light: "#4caf50",
                    dark: "#1b5e20",
                    contrastText: "#ffffff",
                },
                secondary: {
                    main: "#00796b",
                    light: "#26a69a",
                    dark: "#004d40",
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
                    main: "#00c853",
                    light: "#69f0ae",
                    dark: "#009624",
                    contrastText: "#000000",
                },
                secondary: {
                    main: "#1de9b6",
                    light: "#64ffda",
                    dark: "#00bfa5",
                    contrastText: "#000000",
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
            defaultProps: {
                variant: "filled",
            },
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    padding: "10px 20px",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: mode === 'light' 
                        ? '0 2px 8px rgba(46, 125, 50, 0.25)'
                        : '0 2px 8px rgba(0, 200, 83, 0.3)',
                },
                containedPrimary: {
                    backgroundColor: mode === 'light' ? "#2e7d32" : "#00c853",
                    color: mode === 'light' ? "#ffffff" : "#000000",
                    "&:hover": {
                        backgroundColor: mode === 'light' ? "#1b5e20" : "#00e676",
                        transform: "translateY(-2px)",
                        boxShadow: mode === 'light' 
                            ? '0 4px 12px rgba(46, 125, 50, 0.4)'
                            : '0 4px 12px rgba(0, 200, 83, 0.5)',
                    },
                },
                containedError: {
                    backgroundColor: "#f44336",
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: "#d32f2f",
                        transform: "translateY(-2px)",
                        boxShadow: '0 4px 12px rgba(244, 67, 54, 0.4)'
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'light' ? "#2e7d32" : "#00c853",
                    boxShadow: mode === 'light'
                        ? '0 2px 8px rgba(46, 125, 50, 0.3)'
                        : '0 2px 8px rgba(0, 200, 83, 0.4)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    boxShadow: mode === 'light'
                        ? '0 4px 20px rgba(46, 125, 50, 0.15)'
                        : '0 4px 20px rgba(0, 200, 83, 0.2)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: mode === 'light'
                            ? '0 8px 30px rgba(46, 125, 50, 0.2)'
                            : '0 8px 30px rgba(0, 200, 83, 0.3)',
                    }
                }
            }
        },
        MuiTextField: {
            defaultProps: {
                variant: "filled",
                InputProps: {
                    endAdornment: null,
                },
            },
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: mode === 'light' ? "rgba(0, 0, 0, 0.02)" : "rgba(255, 255, 255, 0.05)",
                        "& fieldset": {
                            borderColor: mode === 'light' ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.15)",
                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                        },
                        "&:hover fieldset": {
                            borderColor: mode === 'light' ? "#4caf50" : "#69f0ae",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: mode === 'light' ? "#2e7d32" : "#00c853",
                            borderWidth: "2px",
                            boxShadow: mode === 'light'
                                ? '0 0 0 3px rgba(46, 125, 50, 0.2)'
                                : '0 0 0 3px rgba(0, 200, 83, 0.3)',
                        },
                    },
                    "& .MuiFilledInput-root": {
                        backgroundColor: mode === 'light' ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.05)",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        "&:hover": {
                            backgroundColor: mode === 'light' ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)",
                        },
                        "&.Mui-focused": {
                            backgroundColor: mode === 'light' ? "rgba(46, 125, 50, 0.04)" : "rgba(0, 200, 83, 0.05)",
                            boxShadow: mode === 'light'
                                ? '0 0 0 3px rgba(46, 125, 50, 0.2)'
                                : '0 0 0 3px rgba(0, 200, 83, 0.3)',
                        },
                        "&:before": {
                            borderBottom: mode === 'light' 
                                ? '1px solid rgba(0, 0, 0, 0.2)' 
                                : '1px solid rgba(255, 255, 255, 0.2)',
                        },
                        "&:hover:before": {
                            borderBottom: mode === 'light' 
                                ? `2px solid ${mode === 'light' ? "#4caf50" : "#69f0ae"}`
                                : `2px solid ${mode === 'light' ? "#4caf50" : "#69f0ae"}`,
                        },
                        "&.Mui-focused:before": {
                            borderBottom: `2px solid ${mode === 'light' ? "#2e7d32" : "#00c853"}`,
                        },
                        "&.Mui-focused:after": {
                            borderBottom: `2px solid ${mode === 'light' ? "#2e7d32" : "#00c853"}`,
                        },
                    },
                    "& .MuiInputLabel-root": {
                        color: mode === 'light' ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)",
                        transition: 'color 0.2s ease',
                        "&.Mui-focused": {
                            color: mode === 'light' ? "#2e7d32" : "#00c853",
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
                    borderRadius: "8px",
                    transition: 'box-shadow 0.2s ease',
                    "&.Mui-focused": {
                        boxShadow: mode === 'light'
                            ? '0 0 0 3px rgba(46, 125, 50, 0.2)'
                            : '0 0 0 3px rgba(0, 200, 83, 0.3)',
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: mode === 'light' ? "#2e7d32" : "#00c853",
                        borderWidth: "2px",
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
                    transition: 'box-shadow 0.3s ease',
                    boxShadow: mode === 'light'
                        ? '0 2px 10px rgba(46, 125, 50, 0.1)'
                        : '0 2px 10px rgba(0, 200, 83, 0.15)',
                },
                elevation1: {
                    boxShadow: mode === 'light'
                        ? '0 2px 10px rgba(46, 125, 50, 0.1)'
                        : '0 2px 10px rgba(0, 200, 83, 0.15)',
                },
                elevation2: {
                    boxShadow: mode === 'light'
                        ? '0 3px 12px rgba(46, 125, 50, 0.12)'
                        : '0 3px 12px rgba(0, 200, 83, 0.18)',
                },
                elevation4: {
                    boxShadow: mode === 'light'
                        ? '0 4px 16px rgba(46, 125, 50, 0.14)'
                        : '0 4px 16px rgba(0, 200, 83, 0.22)',
                },
                elevation8: {
                    boxShadow: mode === 'light'
                        ? '0 8px 24px rgba(46, 125, 50, 0.16)'
                        : '0 8px 24px rgba(0, 200, 83, 0.25)',
                },
                elevation16: {
                    boxShadow: mode === 'light'
                        ? '0 12px 32px rgba(46, 125, 50, 0.18)'
                        : '0 12px 32px rgba(0, 200, 83, 0.28)',
                },
                elevation24: {
                    boxShadow: mode === 'light'
                        ? '0 16px 40px rgba(46, 125, 50, 0.2)'
                        : '0 16px 40px rgba(0, 200, 83, 0.3)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: "16px",
                    boxShadow: mode === 'light'
                        ? '0 2px 4px rgba(46, 125, 50, 0.15)'
                        : '0 2px 4px rgba(0, 200, 83, 0.2)',
                },
                colorPrimary: {
                    backgroundColor: mode === 'light' ? "#4caf50" : "#00e676",
                    color: mode === 'light' ? "#ffffff" : "#000000",
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: mode === 'light'
                        ? '0 2px 12px rgba(46, 125, 50, 0.12)'
                        : '0 2px 12px rgba(0, 200, 83, 0.18)',
                    overflow: "hidden",
                    "& .MuiDataGrid-cell": {
                        borderBottom: mode === 'light' 
                            ? "1px solid rgba(0, 0, 0, 0.1)" 
                            : "1px solid rgba(255, 255, 255, 0.1)",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: mode === 'light'
                            ? "rgba(76, 175, 80, 0.1)"
                            : "rgba(0, 200, 83, 0.1)",
                        borderBottom: mode === 'light'
                            ? "1px solid rgba(0, 0, 0, 0.1)"
                            : "1px solid rgba(255, 255, 255, 0.1)",
                    },
                    "& .MuiDataGrid-row:hover": {
                        backgroundColor: mode === 'light'
                            ? "rgba(76, 175, 80, 0.08)"
                            : "rgba(0, 200, 83, 0.08)",
                    },
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                root: {
                    width: 42,
                    height: 26,
                    padding: 0,
                },
                switchBase: {
                    padding: 1,
                    '&.Mui-checked': {
                        transform: 'translateX(16px)',
                        color: '#fff',
                        '& + .MuiSwitch-track': {
                            backgroundColor: mode === 'light' ? '#2e7d32' : '#00c853',
                            opacity: 1,
                        },
                    },
                },
                thumb: {
                    width: 24,
                    height: 24,
                    boxShadow: mode === 'light'
                        ? '0 1px 4px rgba(46, 125, 50, 0.3)'
                        : '0 1px 4px rgba(0, 200, 83, 0.4)',
                },
                track: {
                    borderRadius: 13,
                    backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
                },
            },
        },
        MuiSelect: {
            defaultProps: {
                variant: "filled",
            },
            styleOverrides: {
                root: {
                    "& .MuiFilledInput-root": {
                        backgroundColor: mode === 'light' ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.05)",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                    },
                },
            },
        },
        MuiInputBase: {
            defaultProps: {
                variant: "filled",
            },
        },
        MuiInput: {
            defaultProps: {
                variant: "filled",
            },
        },
        MuiFormControl: {
            defaultProps: {
                variant: "filled",
            },
        },
        MuiInputAdornment: {
            styleOverrides: {
                root: {
                    color: mode === 'light' ? 'rgba(0, 0, 0, 0.54)' : 'rgba(255, 255, 255, 0.7)',
                    "&.MuiInputAdornment-positionEnd": {
                        marginLeft: 8,
                        "& .MuiSvgIcon-root": {
                            color: mode === 'light' ? "#4caf50" : "#00c853",
                            fontSize: "1.4rem",
                            transition: "color 0.2s ease-in-out",
                        },
                        "&:hover .MuiSvgIcon-root": {
                            color: mode === 'light' ? "#2e7d32" : "#00e676",
                        },
                    },
                },
                filled: {
                    "&.MuiInputAdornment-positionEnd": {
                        marginTop: "0 !important",
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
