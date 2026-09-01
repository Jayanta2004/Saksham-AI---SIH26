import api from './api';

export const authService = {
  // Login with Email & Password
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('saksham_token', response.data.token);
      localStorage.setItem('saksham_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // 1-Click Demo Persona Login for Hackathon Evaluation
  demoLogin: async (role) => {
    const response = await api.post('/api/auth/demo-login', { role });
    if (response.data && response.data.token) {
      localStorage.setItem('saksham_token', response.data.token);
      localStorage.setItem('saksham_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Fetch Current Logged in User Profile
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('saksham_token');
    localStorage.removeItem('saksham_user');
  },
};
