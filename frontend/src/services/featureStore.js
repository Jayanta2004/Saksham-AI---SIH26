const key = (name, userId = 'guest') => `saksham_${name}_${userId}`;
const read = (name, userId, fallback) => { try { return JSON.parse(localStorage.getItem(key(name, userId))) ?? fallback; } catch { return fallback; } };
const write = (name, userId, value) => localStorage.setItem(key(name, userId), JSON.stringify(value));

export const featureStore = {
  courseState(userId, courseId) { return read(`course_${courseId}`, userId, { enrolled: false, completedModules: [], bookmarked: false, feedback: null }); },
  saveCourseState(userId, courseId, state) { write(`course_${courseId}`, userId, state); },
  notifications(userId) { return read('notifications', userId, []); },
  addNotification(userId, notification) {
    const all = this.notifications(userId);
    write('notifications', userId, [{ id: crypto.randomUUID(), read: false, createdAt: new Date().toISOString(), ...notification }, ...all].slice(0, 30));
  },
  markNotificationsRead(userId) { write('notifications', userId, this.notifications(userId).map(n => ({ ...n, read: true }))); },
  weeklyPlan(userId) { return read('weekly_plan', userId, null); },
  saveWeeklyPlan(userId, plan) { write('weekly_plan', userId, plan); },
};
