const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
        const token = localStorage.getItem("authToken"); // Retrieve the auth token
        const headers = {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }), // Add Authorization header if token exists
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: { ...headers, ...options.headers },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Something went wrong");
            }

            return await response.json();
        } catch (error) {
            console.error("API Request Error:", error.message);
            throw error;
        }
    },
};

export default apiService;