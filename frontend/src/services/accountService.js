import apiService from "./apiService.js";

const accountService = {
    login: async (email, password) => {
        const endpoint = "account/login";
        const body = { email, password };
        return await apiService.post(endpoint, body);
    },

    register: async (email, password, confirmPassword, firstName, lastName, phoneNumber) => {
        const endpoint = "account/register";
        const body = { email, password, confirmPassword, firstName, lastName, phoneNumber };
        return await apiService.post(endpoint, body);
    },

    generatePasswordResetToken: async (email) => {
        const endpoint = "account/generate-password-reset-token";
        const body = { email };
        return await apiService.post(endpoint, body);
    },

    resetPassword: async (email, token, password, confirmPassword) => {
        const endpoint = "account/reset-password";
        const body = { email, token, password, confirmPassword };
        return await apiService.post(endpoint, body);
    },

    changeEmail: async (userId, newEmail) => {
        const endpoint = "account/change-email";
        const body = { userId, newEmail };
        return await apiService.post(endpoint, body);
    },
};

export default accountService;