import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentService } from '../../services/assessmentService';
import { Clock, FileText, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

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
        setQuizzes([
          {
            id: 'qz_sampling_01',
            title: 'Complex Survey Sampling & Stratification',
            description: 'Evaluate multi-stage stratified sampling, variance estimation, and PSU weighting across NSS rounds.',
            difficulty_level: 'Hard',
            competency_tag: 'Survey Sampling',
            total_questions: 10,
            time_limit_minutes: 15
          },
          {
            id: 'qz_python_02',
            title: 'Python Pandas Survey Microdata Wrangling',
            description: 'Test your proficiency in DataFrame indexing, cross-tabulations, and CAPI field record validation.',
            difficulty_level: 'Medium',
            competency_tag: 'Python / R Stats',
            total_questions: 10,
            time_limit_minutes: 12
          },
          {
            id: 'qz_ml_03',
            title: 'National Accounts & SNA 2008 Diagnostics',
            description: 'Assess sector Gross Value Added (GVA), base-year adjustments, and double deflation compilation.',
            difficulty_level: 'Medium',
            competency_tag: 'National Accounts',
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
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="font-headline text-xl font-bold text-slate-900">Diagnostic AI Assessments</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Role-aware competency evaluations grounded in official MoSPI statistical manuals to test knowledge and verify skill progression.
        </p>
      </div>

      {/* Available Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full font-mono">
                  {quiz.competency_tag}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {quiz.difficulty_level}
                </span>
              </div>

              <h2 className="font-headline text-base font-bold text-slate-900 leading-snug">
                {quiz.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {quiz.description}
              </p>

              <div className="flex items-center space-x-4 text-xs text-slate-600 font-mono pt-2 border-t border-slate-100">
                <span className="flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {quiz.total_questions} Questions
                </span>
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {quiz.time_limit_minutes} mins
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/quiz/${quiz.id}`)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assessments;
