import api from './api';

export const analyticsService = {
  getWorkforceAnalytics: async () => {
    const response = await api.get('/api/analytics/workforce');
    return response.data;
  },
};
