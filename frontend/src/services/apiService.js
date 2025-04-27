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

            if (response.url.includes("Account/Login")) {
                console.warn("Authentication required. Redirected to login page.");
                throw new Error("Authentication required. Please log in.");
            }

            if (response.ok) {
                const text = await response.text();
                const data = text ? JSON.parse(text) : {};
                return data;
            } else {
                throw new Error(`Error: ${response.status} ${response.statusText}`);               
            }
        } catch (error) {
            if (error.response) {
                throw error; 
            }
            throw error;
        }
    },
};

export default apiService;