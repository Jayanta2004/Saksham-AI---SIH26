import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Clock, BookOpen, Award, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const courseId = id || 'crs_igot_01';
  const storageKey = `saksham_course_progress_${user?.id || 'guest'}_${courseId}`;

  const [enrolled, setEnrolled] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_enrolled`);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [completedModules, setCompletedModules] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_modules`);
      return saved ? JSON.parse(saved) : [0];
    } catch {
      return [0];
    }
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}_enrolled`, JSON.stringify(enrolled));
    } catch (e) {}
  }, [enrolled, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}_modules`, JSON.stringify(completedModules));
    } catch (e) {}
  }, [completedModules, storageKey]);

  const modules = [
    {
      title: 'Module 1: Official Microdata Architecture & Sampling Weights',
      duration: '45 mins',
      description: 'Overview of survey structures, microdata formats, and sampling multipliers.'
    },
    {
      title: 'Module 2: Supervised Learning for Survey Validation',
      duration: '90 mins',
      description: 'Training decision trees and classification models to detect data anomalies in field collections.'
    },
    {
      title: 'Module 3: Anomaly Detection & Privacy Standards (DPDPA)',
      duration: '60 mins',
      description: 'DPDPA 2023 compliant anonymization techniques and outlier detection algorithms.'
    }
  ];

  const handleEnroll = () => {
    setEnrolled(true);
    setToast('Enrolled successfully in course!');
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleModule = (index) => {
    if (!enrolled) {
      setEnrolled(true);
    }
    
    let updated;
    if (completedModules.includes(index)) {
      updated = completedModules.filter((i) => i !== index);
    } else {
      updated = [...completedModules, index];
      setToast(`Completed Module ${index + 1}`);
      setTimeout(() => setToast(null), 3000);
    }
    setCompletedModules(updated);
  };

  const progressPercent = modules.length > 0 ? Math.round((completedModules.length / modules.length) * 100) : 0;
  const isFullyCompleted = completedModules.length === modules.length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl border border-slate-700 dark:border-slate-200 flex items-center gap-2 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate('/courses')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-ai-cyan transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </button>
      </div>

      {/* Main Course Header Card */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 space-y-6 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 dark:text-ai-cyan bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/20 px-2.5 py-1 rounded-full font-mono">
              iGOT Karmayogi Bharat
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-success-emerald bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-success-emerald" /> 96% AI Competency Match
            </span>
          </div>

          <h1 className="font-headline text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            Data Science &amp; Statistical Machine Learning for Civil Servants
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            This course covers practical applications of machine learning algorithms on official survey datasets. Learn supervised classification methods, automated data validation, and microdata privacy standards.
          </p>

          {/* AI Recommendation Reason */}
          <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
            <div className="text-xs font-bold text-slate-900 dark:text-white">Why this was recommended:</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Recommended for your Senior Statistical Officer role because your Machine Learning &amp; Python competency (1.6/5.0) is currently below the target benchmark (3.0/5.0).
            </p>
          </div>
        </div>

        {/* Course Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-200 dark:border-white/10 text-xs sm:text-sm">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Duration</div>
            <div className="font-bold text-slate-900 dark:text-white mt-1">6 Hours</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Skill Domain</div>
            <div className="font-bold text-slate-900 dark:text-white mt-1">Machine Learning</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Difficulty</div>
            <div className="font-bold text-slate-900 dark:text-white mt-1">Intermediate</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Certificate</div>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">Verified</div>
          </div>
        </div>

        {/* Progress & Enrollment Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          {enrolled ? (
            <div className="flex-1 space-y-1.5 mr-4">
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 font-mono">
                <span>Course Progress ({completedModules.length}/{modules.length} Modules)</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isFullyCompleted ? 'bg-emerald-600' : 'bg-gradient-to-r from-blue-600 to-cyan-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-600 dark:text-slate-400">Start now to track progress and sync with your competency matrix.</p>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleEnroll}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                isFullyCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40'
                  : enrolled
                  ? 'bg-blue-50 dark:bg-cyan-500/20 text-blue-700 dark:text-ai-cyan border border-blue-300 dark:border-cyan-500/40'
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-600 text-white'
              }`}
            >
              {isFullyCompleted ? '✓ Course Completed' : enrolled ? 'Enrolled (In Progress)' : 'Enroll & Start Learning'}
            </button>

            <Link
              to="/assessments"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
            >
              Take Assessment
            </Link>
          </div>
        </div>
      </div>

      {/* Learning Modules List */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">Curriculum &amp; Modules</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{completedModules.length}/{modules.length} Completed</span>
        </div>

        <div className="space-y-3">
          {modules.map((mod, idx) => {
            const isDone = completedModules.includes(idx);
            return (
              <div
                key={idx}
                onClick={() => handleToggleModule(idx)}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-start justify-between gap-4 ${
                  isDone
                    ? 'bg-blue-50/40 dark:bg-cyan-500/10 border-blue-300 dark:border-ai-cyan/40'
                    : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-ai-cyan shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{mod.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{mod.description}</p>
                    <span className="inline-block text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-mono">{mod.duration}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleModule(idx);
                  }}
                  className={`text-xs px-3 py-1 rounded-lg font-bold shrink-0 transition ${
                    isDone ? 'bg-blue-100 dark:bg-cyan-500/20 text-blue-800 dark:text-ai-cyan' : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isDone ? 'Completed' : 'Mark Done'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
