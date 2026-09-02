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
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate('/courses')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </button>
      </div>

      {/* Main Course Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full font-mono">
              iGOT Karmayogi Bharat
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> 96% AI Competency Match
            </span>
          </div>

          <h1 className="font-headline text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            Data Science &amp; Statistical Machine Learning for Civil Servants
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            This course covers practical applications of machine learning algorithms on official survey datasets. Learn supervised classification methods, automated data validation, and microdata privacy standards.
          </p>

          {/* AI Recommendation Reason */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="text-xs font-bold text-slate-900">Why this was recommended:</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recommended for your Senior Statistical Officer role because your Machine Learning &amp; Python competency (1.6/5.0) is currently below the target benchmark (3.0/5.0).
            </p>
          </div>
        </div>

        {/* Course Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-200 text-xs sm:text-sm">
          <div>
            <div className="text-xs text-slate-500">Duration</div>
            <div className="font-bold text-slate-900 mt-1">6 Hours</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Skill Domain</div>
            <div className="font-bold text-slate-900 mt-1">Machine Learning</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Difficulty</div>
            <div className="font-bold text-slate-900 mt-1">Intermediate</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Certificate</div>
            <div className="font-bold text-emerald-600 mt-1">Verified</div>
          </div>
        </div>

        {/* Progress & Enrollment Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          {enrolled ? (
            <div className="flex-1 space-y-1.5 mr-4">
              <div className="flex justify-between text-xs font-medium text-slate-700 font-mono">
                <span>Course Progress ({completedModules.length}/{modules.length} Modules)</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isFullyCompleted ? 'bg-emerald-600' : 'bg-gradient-to-r from-blue-600 to-cyan-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-600">Start now to track progress and sync with your competency matrix.</p>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleEnroll}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                isFullyCompleted
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : enrolled
                  ? 'bg-blue-50 text-blue-700 border border-blue-300'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isFullyCompleted ? '✓ Course Completed' : enrolled ? 'Enrolled (In Progress)' : 'Enroll & Start Learning'}
            </button>

            <Link
              to="/assessments"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
            >
              Take Assessment
            </Link>
          </div>
        </div>
      </div>

      {/* Learning Modules List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-base font-bold text-slate-900">Curriculum &amp; Modules</h2>
          <span className="text-xs text-slate-500 font-mono">{completedModules.length}/{modules.length} Completed</span>
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
                    ? 'bg-blue-50/40 border-blue-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">{mod.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{mod.description}</p>
                    <span className="inline-block text-[11px] text-slate-500 mt-2 font-mono">{mod.duration}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleModule(idx);
                  }}
                  className={`text-xs px-3 py-1 rounded-lg font-bold shrink-0 transition ${
                    isDone ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
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
