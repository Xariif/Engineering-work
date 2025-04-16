import apiService from "./apiService.js";

const accessService = {
	getAccessData: async () => {
		return await apiService.get("access");
	},

	getTenantAccessData: async () => {
		return await apiService.get("access/tenant");
	},

	addTenantAccess: async (userEmail, resourceId) => {
		return await apiService.post("access/tenant", {
			userEmail,
			resourceId,
		});
	},

	removeTenantAccess: async (accessId) => {
		return await apiService.delete(`access/tenant/${accessId}`);
	},
};

export default accessService;
