import apiService from "./apiService.js";

const turnoverService = {
    async getTurnoversByStore(storeId) {
        return await apiService.get(`turnover/store/${storeId}`);
    },

    async addTurnover(turnoverData) {
        return await apiService.post('turnover', turnoverData);
    },

    async updateTurnover(id, turnoverData) {
        return await apiService.put(`turnover/${id}`, turnoverData);
    },

    async deleteTurnover(id) {
        return await apiService.delete(`turnover/${id}`);
    },

    async getTotalTurnover(storeId) {
        return await apiService.get(`turnover/total/${storeId}`);
    }
};

export default turnoverService; 