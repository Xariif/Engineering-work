import apiService from './apiService.js';

const reportService = {
    // Get all malls that the manager has access to
    async getMalls() {
        try {
            return await apiService.get("report/malls");
        } catch (error) {
            console.error('Error accessing report data:', error.message);
            throw error;
        }
    },
    
    // Get all tenants for a specific mall
    async getTenantsByMall(mallId) {
        try {
            return await apiService.get(`report/tenants/${mallId}`);
        } catch (error) {
            console.error('Error retrieving tenants data:', error.message);
            throw error;
        }
    },

    // Get data for bar chart
    async getBarChartData(mallId, startDate, endDate, tenantIds = []) {
        try {
            let url = `report/chart/bar/${mallId}?startDate=${startDate}&endDate=${endDate}`;
            
            // Add tenant IDs if specified
            if (tenantIds && tenantIds.length > 0) {
                tenantIds.forEach(id => {
                    url += `&TenantIds=${id}`;
                });
            }
            
            return await apiService.get(url);
        } catch (error) {
            console.error('Error retrieving bar chart data:', error.message);
            throw error;
        }
    },

    // Get data for line chart
    async getLineChartData(mallId, startDate, endDate, tenantIds = []) {
        try {
            let url = `report/chart/line/${mallId}?startDate=${startDate}&endDate=${endDate}`;
            
            // Add tenant IDs if specified
            if (tenantIds && tenantIds.length > 0) {
                tenantIds.forEach(id => {
                    url += `&TenantIds=${id}`;
                });
            }
            
            return await apiService.get(url);
        } catch (error) {
            console.error('Error retrieving line chart data:', error.message);
            throw error;
        }
    },

    // Get data for pie chart
    async getPieChartData(mallId, startDate, endDate, tenantIds = []) {
        try {
            let url = `report/chart/pie/${mallId}?startDate=${startDate}&endDate=${endDate}`;
            
            // Add tenant IDs if specified
            if (tenantIds && tenantIds.length > 0) {
                tenantIds.forEach(id => {
                    url += `&TenantIds=${id}`;
                });
            }
            
            return await apiService.get(url);
        } catch (error) {
            console.error('Error retrieving pie chart data:', error.message);
            throw error;
        }
    }
};

export default reportService; 