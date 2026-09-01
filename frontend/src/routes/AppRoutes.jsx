import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Learner Pages
import LearnerDashboard from '../pages/learner/LearnerDashboard';
import Profile from '../pages/learner/Profile';
import MySkills from '../pages/learner/MySkills';
import SkillGap from '../pages/learner/SkillGap';
import PersonalizedLearningPath from '../pages/learner/PersonalizedLearningPath';
import RecommendedCourses from '../pages/learner/RecommendedCourses';
import CourseDetail from '../pages/learner/CourseDetail';
import TrainingProgrammes from '../pages/learner/TrainingProgrammes';
import Assessments from '../pages/learner/Assessments';
import QuizArena from '../pages/learner/QuizArena';
import AiAssistant from '../pages/learner/AiAssistant';
import MyProgress from '../pages/learner/MyProgress';
import Certificates from '../pages/learner/Certificates';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import UserManagement from '../pages/admin/UserManagement';
import CompetencyFramework from '../pages/admin/CompetencyFramework';
import ContentStudio from '../pages/admin/ContentStudio';
import AdminReports from '../pages/admin/AdminReports';
import AdminSettings from '../pages/admin/AdminSettings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Learner Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout title="Saksham AI — Skill Intelligence & Learning Platform" />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<LearnerDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/skills" element={<MySkills />} />
        <Route path="/skill-gap" element={<SkillGap />} />
        <Route path="/learning-path" element={<PersonalizedLearningPath />} />
        <Route path="/courses" element={<RecommendedCourses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/training" element={<TrainingProgrammes />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/quiz/:id" element={<QuizArena />} />
        <Route path="/ai-assistant" element={<AiAssistant />} />
        <Route path="/progress" element={<MyProgress />} />
        <Route path="/certificates" element={<Certificates />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="admin">
            <MainLayout title="Saksham AI — Admin Workforce Intelligence" />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/competencies" element={<CompetencyFramework />} />
        <Route path="/admin/courses" element={<RecommendedCourses />} />
        <Route path="/admin/training" element={<TrainingProgrammes />} />
        <Route path="/admin/assessments" element={<Assessments />} />
        <Route path="/admin/content" element={<ContentStudio />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
