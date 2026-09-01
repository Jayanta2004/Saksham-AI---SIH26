import api from './api';

export const courseService = {
  getAllCourses: async () => {
    const response = await api.get('/api/sync/all-courses');
    return response.data;
  },
  getIgotCourses: async () => {
    const response = await api.get('/api/sync/igot');
    return response.data;
  },
  getNsstaPrograms: async () => {
    const response = await api.get('/api/sync/nssta');
    return response.data;
  },
  nominateCourse: async (courseId, batchId) => {
    const response = await api.post('/api/sync/nominate', { course_id: courseId, batch_id: batchId });
    return response.data;
  },
};
