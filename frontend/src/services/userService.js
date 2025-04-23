import apiService from "./apiService.js";

const userService = {
    getProfile: async () => {
        return await apiService.get("account/profile");
    },

    updateProfile: async (profileData) => {
        return await apiService.put("account/profile", profileData);
    },

    generatePasswordResetToken: async (email) => {
        return await apiService.post("account/generate-password-reset-token", { email });
    },

    resetPassword: async (token, password, confirmPassword, email) => {
        return await apiService.post("account/reset-password", { token, password, confirmPassword, email });
    }
};

export default userService; 