import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toastQueue, setToastQueue] = useState([]); 
    const [currentToast, setCurrentToast] = useState(null); 

    const showToast = useCallback((message, severity = "info") => {
        setToastQueue((prevQueue) => [...prevQueue, { message, severity }]);
    }, []);

    const hideToast = useCallback(() => {
        setCurrentToast(null); 
    }, []);

    React.useEffect(() => {
        if (!currentToast && toastQueue.length > 0) {
            const nextToast = toastQueue[0];
            setCurrentToast(nextToast);
            setToastQueue((prevQueue) => prevQueue.slice(1));
        }
    }, [currentToast, toastQueue]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {currentToast && (
                <Snackbar
                    open={!!currentToast}
                    autoHideDuration={3000}
                    onClose={hideToast}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert onClose={hideToast} severity={currentToast.severity} sx={{ width: "100%" }}>
                        {currentToast.message}
                    </Alert>
                </Snackbar>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};