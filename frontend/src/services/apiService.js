const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiService = {
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

            // Check if redirected to login page
            if (response.url.includes("Account/Login")) {
                console.warn("Authentication required. Redirected to login page.");
                throw new Error("Authentication required. Please log in.");
            }

            // Only try to parse JSON if we have a successful response
            if (response.ok) {
                // Make sure content exists before trying to parse it
                const text = await response.text();
                const data = text ? JSON.parse(text) : {};
                return data;
            } else {
                // Handle error responses
                try {
                    const errorText = await response.text();
                    const errorData = errorText ? JSON.parse(errorText) : {};
                    
                    if (errorData.errors) {
                        const error = new Error("Validation error");
                        error.response = { data: errorData };
                        throw error;
                    }
                    
                    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
                } catch (jsonError) {
                    // If parsing JSON fails, throw a generic error with the status
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            }
        } catch (error) {
            if (error.response) {
                throw error; // Re-throw validation errors
            }
            console.error("API Request Error:", error.message);
            throw error;
        }
    },
};

export default apiService;