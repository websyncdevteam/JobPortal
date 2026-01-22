import api from "../api";

const payoutService = {
  // 🔹 Get all payouts
  getPayouts: async (filters = {}) => {
    const response = await api.get("/payout/freelancer/my-payouts", { 
      params: filters 
    });
    return response.data;
  },

  // 🔹 Request new payout
  requestPayout: async (payoutData) => {
    const response = await api.post("/payout/request", payoutData);
    return response.data;
  },

  // 🔹 Get earnings summary
  getEarningsSummary: async (timeframe = "all") => {
    const response = await api.get("/freelancer/earnings", { 
      params: { timeframe } 
    });
    return response.data;
  },

  // 🔹 Get payout statistics
  getPayoutStats: async () => {
    const response = await api.get("/freelancer/dashboard");
    return response.data?.data?.quickStats || {};
  }
};

export default payoutService;