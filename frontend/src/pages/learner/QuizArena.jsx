import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentService } from '../../services/assessmentService';
import { Clock, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Award, Sparkles, Bot, Activity } from 'lucide-react';

export default function QuizArena() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await assessmentService.getQuizById(id || 'qz_sampling_01');
        setQuiz(data.quiz);
        setQuestions(data.questions || []);
      } catch (err) {
        setQuiz({
          id: 'qz_sampling_01',
          title: 'Multi-Stage Stratified Sampling & Survey Multipliers',
          competency_tag: 'Survey Sampling (NSSO)',
          total_questions: 3,
          difficulty: 'Intermediate (SSO/JSO)'
        });
        setQuestions([
          {
            id: 'q1',
            question_text: 'In a two-stage stratified sampling design for NSS surveys where Census Villages are FSUs and Households are SSUs, what is the primary role of the multiplier?',
            option_a: 'To normalize non-response bias across strata',
            option_b: 'To inflate sample household observations to represent the target population universe',
            option_c: 'To compute the standard error of the stratum mean',
            option_d: 'To allocate sample sizes proportionally between rural and urban sectors',
            correct_option: 'option_b',
            explanation: 'The multiplier represents the inverse of the inclusion probability of the ultimate sampling unit (household), inflating sample values to yield unbiased estimates of total population aggregates.'
          },
          {
            id: 'q2',
            question_text: 'Under the System of National Accounts (SNA 2008) methodology adopted by India, what is the exact formula for Gross Value Added (GVA) at basic prices?',
            option_a: 'GVA at basic prices = Gross Output at basic prices - Intermediate Consumption',
            option_b: 'GVA at basic prices = GDP at market prices + Net Product Taxes',
            option_c: 'GVA at basic prices = Compensation of Employees + Net Imports',
            option_d: 'GVA at basic prices = Final Consumption Expenditure + Gross Fixed Capital Formation',
            correct_option: 'option_a',
            explanation: 'By definition in SNA 2008, GVA at basic prices equals Gross Output measured at basic prices minus the value of Intermediate Consumption consumed during production.'
          },
          {
            id: 'q3',
            question_text: 'Which index formula is primarily utilized in the compilation of the Index of Industrial Production (IIP) in India?',
            option_a: 'Paasche Weighted Price Index',
            option_b: 'Laspeyres Base-Weighted Quantity Index',
            option_c: 'Fisher Ideal Geometric Index',
            option_d: 'Marshall-Edgeworth Index',
            correct_option: 'option_b',
            explanation: 'The Index of Industrial Production (IIP) is compiled as a Laspeyres quantity index using fixed base-year gross value added weights allocated to sectors.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const handleOptionSelect = (optionKey) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentIndex]?.id]: optionKey
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await assessmentService.submitQuiz(quiz?.id || id, selectedAnswers, 600 - timeLeft);
      setResult(res);
      setIsSubmitted(true);
    } catch (err) {
      let correct = 0;
      const feedback = questions.map((q) => {
        const choice = selectedAnswers[q.id];
        const isCorr = choice === q.correct_option;
        if (isCorr) correct++;
        return {
          question_id: q.id,
          question_text: q.question_text,
          user_choice: choice,
          correct_option: q.correct_option,
          is_correct: isCorr,
          explanation: q.explanation || 'The chosen standard option reflects verified MoSPI methodology.'
        };
      });

      const scorePct = Number(((correct / questions.length) * 100).toFixed(1));
      setResult({
        score_percentage: scorePct,
        total_correct: correct,
        total_questions: questions.length,
        passed: scorePct >= 70,
        competency_gain: scorePct >= 70 ? '+0.35' : '+0.10',
        detailed_feedback: feedback
      });
      setIsSubmitted(true);
    }
  };

  const currentQ = questions[currentIndex];
  const formatTime = (secs) => {
    const m = Math.floor(Math.max(0, secs) / 60);
    const s = Math.max(0, secs) % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center text-slate-400 text-sm">
        Loading diagnostic assessment...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Top Assessment Bar */}
      <div className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-ai-purple animate-pulse"></span>
            <span className="text-[11px] font-mono font-bold uppercase text-ai-purple">
              {quiz?.competency_tag || 'Official Statistics Assessment'}
            </span>
          </div>
          <h1 className="font-headline text-lg font-bold text-slate-900 dark:text-white">
            {quiz?.title || 'Diagnostic Evaluation'}
          </h1>
        </div>

        {/* Timer & Question Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 glass-panel px-3.5 py-1.5 rounded-xl border border-glass-border">
            <Clock className="w-4 h-4 text-warning-amber animate-pulse" />
            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Question Navigator Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {questions.map((q, idx) => {
          const isAnswered = !!selectedAnswers[q.id];
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-9 h-9 rounded-xl font-mono text-xs font-bold flex items-center justify-center transition-all ${
                isCurrent
                  ? 'bg-gradient-to-r from-ai-cyan to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                  : isAnswered
                  ? 'bg-emerald-500/20 text-success-emerald border border-success-emerald/30'
                  : 'glass-card text-on-surface-variant hover:text-white'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      {!isSubmitted && currentQ && (
        <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl border-slate-200 dark:border-glass-border">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-glass-border">
            <span className="text-xs font-mono font-bold text-ai-cyan">
              QUESTION {currentIndex + 1} OF {questions.length}
            </span>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full glass-panel text-on-surface-variant">
              Intermediate (SSO/JSO)
            </span>
          </div>

          <h2 className="font-headline text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.question_text}
          </h2>

          {/* 4 Interactive Option Cards */}
          <div className="space-y-3">
            {[
              { key: 'option_a', text: currentQ.option_a },
              { key: 'option_b', text: currentQ.option_b },
              { key: 'option_c', text: currentQ.option_c },
              { key: 'option_d', text: currentQ.option_d }
            ].map((opt, i) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleOptionSelect(opt.key)}
                  className={`w-full p-4 rounded-xl text-left border transition-all text-xs sm:text-sm font-medium flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-cyan-500/10 border-ai-cyan text-ai-cyan shadow-md shadow-cyan-500/10'
                      : 'glass-card hover:border-ai-cyan/40 text-slate-800 dark:text-on-surface'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'bg-ai-cyan text-slate-950 font-bold'
                        : 'bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-on-surface-variant'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="leading-relaxed">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-200 dark:border-glass-border flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="glass-card px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-white disabled:opacity-30 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="gradient-button text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/30 flex items-center gap-2"
              >
                <span>Submit Assessment</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results & Explanatory Feedback */}
      {isSubmitted && result && (
        <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl border-slate-200 dark:border-glass-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-glass-border gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-success-emerald uppercase">
                Assessment Complete
              </span>
              <h2 className="font-headline text-2xl font-bold text-slate-900 dark:text-white">
                Score: {result.score_percentage}%
              </h2>
              <p className="text-xs text-slate-500 dark:text-on-surface-variant mt-0.5">
                {result.total_correct} of {result.total_questions} questions answered correctly
              </p>
            </div>

            <div className="glass-panel px-4 py-2.5 rounded-xl border border-success-emerald/30 text-success-emerald flex items-center gap-2">
              <Award className="w-5 h-5" />
              <div>
                <div className="text-xs font-bold">Competency Gain</div>
                <div className="text-sm font-mono font-extrabold">{result.competency_gain} Delta</div>
              </div>
            </div>
          </div>

          {/* Itemized Explanations */}
          <div className="space-y-4">
            <h3 className="font-headline text-base font-bold text-slate-900 dark:text-white">
              Itemized Methodological Explanations
            </h3>
            {result.detailed_feedback?.map((fb, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  fb.is_correct ? 'glass-card border-success-emerald/40' : 'glass-card border-red-500/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className={fb.is_correct ? 'text-success-emerald' : 'text-red-400'}>
                    Question {idx + 1}: {fb.is_correct ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-xs text-slate-800 dark:text-white font-medium mb-2">{fb.question_text}</p>
                <div className="p-3 rounded-lg glass-panel text-[11px] text-slate-600 dark:text-on-surface-variant leading-relaxed">
                  <strong>MoSPI Methodological Rationale:</strong> {fb.explanation}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 gradient-button text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md flex items-center justify-center gap-2"
          >
            <span>Return to Dashboard &amp; View Updated Radar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
