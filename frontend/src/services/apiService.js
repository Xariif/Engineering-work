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
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: { ...headers, ...options.headers },
            });

            const data = await response.json();

            if (!response.ok) {
                // If we have validation errors, throw them with the full error response
                if (data.errors) {
                    const error = new Error();
                    error.response = { data };
                    throw error;
                }
                // Otherwise throw with a general message
                throw new Error(data.message || "Something went wrong");
            }

            return data;
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