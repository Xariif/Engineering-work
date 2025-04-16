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
    }
};

export default userService; 