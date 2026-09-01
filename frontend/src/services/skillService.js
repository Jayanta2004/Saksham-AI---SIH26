import api from './api';

export const skillService = {
  getUserCompetencies: async () => {
    const response = await api.get('/api/users/competencies');
    return response.data;
  },

  getUserStats: async () => {
    try {
      const response = await api.get('/api/users/stats');
      return response.data;
    } catch {
      return {
        courses_completed: 0,
        learning_hours: 0,
        assessments_passed: 0,
        certificates_earned: 0
      };
    }
  },

  getUserCertificates: async () => {
    try {
      const response = await api.get('/api/users/certificates');
      return response.data?.certificates || [];
    } catch {
      return [];
    }
  },

  getUserTrajectory: async () => {
    try {
      const response = await api.get('/api/users/trajectory');
      return response.data;
    } catch {
      return null;
    }
  }
};

export default skillService;
