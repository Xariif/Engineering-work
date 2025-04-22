import apiService from "./apiService.js";

const userService = {
    getProfile: async () => {
        return await apiService.get("account/profile");
    },

    updateProfile: async (profileData) => {
        return await apiService.put("account/profile", profileData);
    },

    changePassword: async (currentPassword, newPassword, confirmPassword) => {
        return await apiService.put("account/password", {
            currentPassword,
            newPassword,
            confirmPassword
        });
    },

    generatePasswordResetToken: async (email) => {
        return await apiService.post("account/generate-password-reset-token", { email });
    },

    resetPassword: async (token, newPassword, confirmPassword, email) => {
        return await apiService.post("account/reset-password", { token, newPassword, confirmPassword, email });
    }
};

export default userService; 