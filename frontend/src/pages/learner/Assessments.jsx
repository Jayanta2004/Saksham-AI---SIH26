import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentService } from '../../services/assessmentService';
import { Clock, FileText } from 'lucide-react';

const Assessments = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        const quizData = await assessmentService.getQuizzes();
        setQuizzes(quizData.quizzes || []);
      } catch (err) {
        console.warn('Using mock fallback for quizzes');
        setQuizzes([
          {
            id: 'qz_sampling_01',
            title: 'Complex Survey Sampling & Stratification',
            description: 'Evaluate multi-stage stratified sampling, variance estimation, and PSU weighting.',
            difficulty_level: 'Hard',
            competency_tag: 'Survey Sampling',
            total_questions: 10,
            time_limit_minutes: 15
          },
          {
            id: 'qz_python_02',
            title: 'Python Pandas Survey Microdata Wrangling',
            description: 'Test your proficiency in DataFrame indexing, cross-tabulations, and CAPI validation.',
            difficulty_level: 'Medium',
            competency_tag: 'Python / R Stats',
            total_questions: 10,
            time_limit_minutes: 12
          },
          {
            id: 'qz_ml_03',
            title: 'Machine Learning Microdata Benchmark',
            description: 'Supervised classification, decision trees, and anomaly detection algorithms.',
            difficulty_level: 'Medium',
            competency_tag: 'Machine Learning',
            total_questions: 10,
            time_limit_minutes: 15
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Assessments</h1>
        <p className="text-sm text-gray-500 mt-1">
          Role-aware competency evaluations to test knowledge and verify skill progression.
        </p>
      </div>

      {/* Available Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between space-y-4 hover:border-gray-300 transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                  {quiz.competency_tag}
                </span>
                <span className="text-xs text-gray-500">
                  {quiz.difficulty_level}
                </span>
              </div>

              <h2 className="text-base font-semibold text-gray-900 leading-snug">
                {quiz.title}
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed">
                {quiz.description}
              </p>

              <div className="flex items-center space-x-4 text-xs text-gray-500 pt-2">
                <span className="flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  {quiz.total_questions} Questions
                </span>
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  {quiz.time_limit_minutes} mins
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/quiz/${quiz.id}`)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition"
            >
              Start Assessment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assessments;
