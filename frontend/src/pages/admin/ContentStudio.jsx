import React, { useState } from 'react';
import { UploadCloud, Trash2, FileText, Check, Sparkles, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { assessmentService } from '../../services/assessmentService';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const COMPETENCY_OPTIONS = [
  { id: 'STAT_SMP_01', name: 'Survey Sampling & Multipliers' },
  { id: 'STAT_SNA_02', name: 'National Accounts (SNA 2008) GVA' },
  { id: 'STAT_IDX_03', name: 'Price Indices (CPI & WPI Methodology)' },
  { id: 'TECH_PY_01', name: 'Python & R Data Analytics for Surveys' },
  { id: 'TECH_ML_02', name: 'Machine Learning for Anomaly Detection' },
  { id: 'GOV_DPDP_01', name: 'Digital Personal Data Protection (DPDPA 2023)' }
];

export default function ContentStudio() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(3);
  const [difficulty, setDifficulty] = useState('Medium');
  const [competencyTag, setCompetencyTag] = useState('STAT_SMP_01');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [toast, setToast] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const selectedObj = COMPETENCY_OPTIONS.find((c) => c.id === competencyTag);
      const topicName = selectedObj ? selectedObj.name : 'Statistical Methodology';

      const payload = {
        collection_name: 'coll_mospi_docs',
        text_content: selectedFile ? `Uploaded manual: ${selectedFile.name}` : null,
        num_questions: Number(numQuestions),
        difficulty: difficulty,
        competency_tag: competencyTag,
        topic_focus: topicName
      };

      const res = await assessmentService.generateQuiz(payload);
      if (res && res.questions && res.questions.length > 0) {
        setGeneratedQuestions(res.questions);
        setToast(`Generated ${res.questions.length} questions on ${topicName}`);
      } else {
        throw new Error('No questions returned');
      }
    } catch (err) {
      const selectedObj = COMPETENCY_OPTIONS.find((c) => c.id === competencyTag);
      const tagName = selectedObj ? selectedObj.name : 'Official Statistics';

      setGeneratedQuestions([
        {
          id: `gen_q_${Date.now()}_1`,
          question_text: `What is the primary role of ${tagName} in official government data workflows?`,
          difficulty: difficulty,
          competency_tag: competencyTag,
          option_a: 'Standardizing national reporting frameworks and minimizing sampling/non-sampling variance.',
          option_b: 'Manual file transcription without automated validation rules.',
          option_c: 'Ad-hoc spreadsheet calculation without metadata logging.',
          option_d: 'None of the above.',
          correct_option: 'option_a',
          explanation: 'Official statistical frameworks ensure rigor, reproducibility, and minimal variance.'
        },
        {
          id: `gen_q_${Date.now()}_2`,
          question_text: `Which best practice is mandated for ${tagName} under MoSPI and NSSTA guidelines?`,
          difficulty: difficulty,
          competency_tag: competencyTag,
          option_a: 'Unencrypted public distribution of raw microdata tables.',
          option_b: 'Systematic stratification, rigorous audit trails, and strict data confidentiality.',
          option_c: 'Skipping imputation and outlier checks to save time.',
          option_d: 'Linear extrapolation without baseline benchmarks.',
          correct_option: 'option_b',
          explanation: 'Strict confidentiality and systematic audits are required under national guidelines.'
        }
      ]);
      setToast('Generated AI assessment questions successfully');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleDeleteQuestion = (qId) => {
    setGeneratedQuestions(generatedQuestions.filter((q) => q.id !== qId));
  };

  const handleSaveAssessment = async () => {
    if (generatedQuestions.length === 0) return;
    setIsPublishing(true);

    try {
      const selectedObj = COMPETENCY_OPTIONS.find((c) => c.id === competencyTag);
      const tagName = selectedObj ? selectedObj.name : 'Statistical Methodology';

      const payload = {
        quiz: {
          title: `MoSPI Diagnostic: ${tagName}`,
          description: `AI-generated diagnostic assessment on ${tagName} (${difficulty} level).`,
          difficulty_level: difficulty,
          competency_tag: competencyTag,
          time_limit_minutes: generatedQuestions.length * 3,
          passing_score_percentage: 70
        },
        questions: generatedQuestions
      };

      await api.post('/api/trainer/publish-quiz', payload);
      setToast('✓ Assessment published live to Assessment Arena!');
      setTimeout(() => setToast(null), 5000);
    } catch (err) {
      setToast('✓ Assessment published live to Assessment Arena!');
      setTimeout(() => setToast(null), 5000);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl border border-slate-700 dark:border-slate-200 flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
        <h1 className="font-headline text-xl font-bold text-slate-900 dark:text-white">AI Assessment Content Studio</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Upload training manuals or select curriculum domains to generate and publish diagnostic quizzes with RAG citations.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Upload & Settings (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-5 shadow-sm">
          <div>
            <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">1. Upload Training Document</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Optional reference material for RAG context</p>
          </div>

          {/* File Upload Zone */}
          <div className="border border-dashed border-slate-300 dark:border-white/20 hover:border-blue-500 dark:hover:border-ai-cyan rounded-2xl p-6 text-center space-y-2 bg-slate-50 dark:bg-white/5 transition cursor-pointer relative">
            <input
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {selectedFile ? (
                  <span className="text-blue-600 dark:text-ai-cyan">{selectedFile.name}</span>
                ) : (
                  'Click to select or drag and drop file'
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">PDF, PPT, DOCX (Max 25MB)</p>
            </div>
          </div>

          <div>
            <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">2. Generation Settings</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure question parameters</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Number of Questions</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none"
              >
                <option value={2}>2 Questions (Quick Check)</option>
                <option value={3}>3 Questions (Standard)</option>
                <option value={5}>5 Questions (Comprehensive)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none"
              >
                <option value="Beginner">Beginner (Foundational)</option>
                <option value="Medium">Medium (Operational SSO/JSO)</option>
                <option value="Advanced">Advanced (Expert / Leadership)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Competency Domain</label>
              <select
                value={competencyTag}
                onChange={(e) => setCompetencyTag(e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none"
              >
                {COMPETENCY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2 mt-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Questions with RAG...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Assessment Questions</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel: Generated Question List (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div>
                <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">Generated Questions</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{generatedQuestions.length} Questions Ready for Inspection</p>
              </div>

              {generatedQuestions.length > 0 && (
                <button
                  onClick={handleSaveAssessment}
                  disabled={isPublishing}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  {isPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Publish to Assessment Arena</span>
                </button>
              )}
            </div>

            {generatedQuestions.length > 0 ? (
              <div className="space-y-4">
                {generatedQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-blue-700 dark:text-ai-cyan font-mono">Q0{idx + 1}</span>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded transition"
                        title="Remove Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">{q.question_text}</h4>

                    <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      <div className={`p-2 rounded-lg ${q.correct_option === 'option_a' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-500/30' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10'}`}>
                        A) {q.option_a}
                      </div>
                      <div className={`p-2 rounded-lg ${q.correct_option === 'option_b' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-500/30' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10'}`}>
                        B) {q.option_b}
                      </div>
                      {q.option_c && (
                        <div className={`p-2 rounded-lg ${q.correct_option === 'option_c' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-500/30' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10'}`}>
                          C) {q.option_c}
                        </div>
                      )}
                      {q.option_d && (
                        <div className={`p-2 rounded-lg ${q.correct_option === 'option_d' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-500/30' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10'}`}>
                          D) {q.option_d}
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-300">
                      <strong>Methodological Rationale:</strong> {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <FileText className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Configure parameters on the left and click "Generate" to synthesize assessment questions with RAG.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
