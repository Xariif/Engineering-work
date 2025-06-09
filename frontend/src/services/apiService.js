const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let toastHandler = null;

const apiService = {
    setToastHandler: (handler) => {
        toastHandler = handler;
    },

    get: async (endpoint, options = {}) => {
        return apiService.request(endpoint, { method: "GET", ...options });
    },

    post: async (endpoint, body, options = {}) => {
        return apiService.request(endpoint, { method: "POST", body: JSON.stringify(body), ...options });
    },

    put: async (endpoint, body, options = {}) => {
        return apiService.request(endpoint, { method: "PUT", body: JSON.stringify(body), ...options });
    },

    delete: async (endpoint, options = {}) => {
        return apiService.request(endpoint, { method: "DELETE", ...options });
    },

    request: async (endpoint, options) => {
        const token = localStorage.getItem("authToken");
        const headers = {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        };

        try {
            let url = `${API_BASE_URL}${endpoint}`;

            const response = await fetch(url, {
                ...options,
                headers: { ...headers, ...options.headers },
            });

            if (response.url.includes("Account/Login")) {
                throw new Error("Authentication required. Please log in.");
            }

            if (response.ok) {
                const text = await response.text();
                const data = text ? JSON.parse(text) : {};
                return data;
            } else {
                const errorText = await response.text();
                let errorMessage = `Error: ${response.status} ${response.statusText}`;
                try {
                    const errorData = errorText ? JSON.parse(errorText) : {};
                    errorMessage = errorData.Message || errorData.message || errorMessage;
                } catch {}
                if (toastHandler) toastHandler(errorMessage, "error");
                throw new Error(errorMessage);
            }
        } catch (error) {
            if (toastHandler) toastHandler(error.message || "Unexpected error", "error");
            throw error;
        }
    },
};

export default apiService;