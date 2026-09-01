import api from './api';

export const skillService = {
  getUserCompetencies: async () => {
    const response = await api.get('/api/users/competencies');
    return response.data;
  },
};
