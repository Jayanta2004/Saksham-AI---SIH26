import api from './api';

export const assessmentService = {
  getQuizzes: async () => {
    const response = await api.get('/api/assessments/quizzes');
    return response.data;
  },
  getQuizById: async (id) => {
    const response = await api.get(`/api/assessments/quizzes/${id}`);
    return response.data;
  },
  submitQuiz: async (quizId, userAnswers, timeSpentSeconds) => {
    const response = await api.post('/api/assessments/submit', {
      quiz_id: quizId,
      user_answers: userAnswers,
      time_spent_seconds: timeSpentSeconds,
    });
    return response.data;
  },
  getMyAttempts: async () => {
    const response = await api.get('/api/assessments/my-attempts');
    return response.data;
  },
  generateQuiz: async (payload) => {
    const response = await api.post('/api/ai/proxy/generate-quiz', payload);
    return response.data;
  },
};
