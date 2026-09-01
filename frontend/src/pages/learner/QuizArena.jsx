import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentService } from '../../services/assessmentService';
import { Clock, ArrowRight, ArrowLeft } from 'lucide-react';

const QuizArena = () => {
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
        console.warn('Using mock fallback quiz questions');
        setQuiz({
          id: 'qz_sampling_01',
          title: 'Complex Survey Sampling & Stratification',
          competency_tag: 'Survey Sampling',
          total_questions: 3
        });
        setQuestions([
          {
            id: 'q1',
            question_text: 'What is the primary advantage of Multi-Stage Stratified Sampling in large-scale household surveys?',
            option_a: 'It completely eliminates sampling error without requiring sample weights.',
            option_b: 'It balances operational field feasibility across geographically spread PSUs while controlling variance.',
            option_c: 'It replaces primary sampling units with non-probability quota samples.',
            option_d: 'It allows field enumerators to choose sample households arbitrarily.',
            correct_option: 'option_b',
            explanation: 'Multi-stage stratified sampling allows survey teams to cluster data collection logistically into First Stage Units while controlling statistical variance.'
          },
          {
            id: 'q2',
            question_text: 'In the System of National Accounts (SNA 2008), Gross Value Added (GVA) at basic prices is calculated as:',
            option_a: 'GVA = Output - Intermediate Consumption + Net Product Taxes',
            option_b: 'GVA = Output at basic prices minus Intermediate Consumption',
            option_c: 'GVA = Total Imports minus Total Exports',
            option_d: 'GVA = Gross Domestic Product + Subsidies',
            correct_option: 'option_b',
            explanation: 'GVA at basic prices measures sector output before adding net product taxes.'
          },
          {
            id: 'q3',
            question_text: 'Which technique is most effective for detecting anomalies and entry errors in CAPI field survey records?',
            option_a: 'Isolation Forests & Multidimensional Outlier Detection',
            option_b: 'Linear Regression without regularization',
            option_c: 'Simple Moving Average',
            option_d: 'Naive Bayes without smoothing',
            correct_option: 'option_a',
            explanation: 'Isolation Forests and clustering algorithms effectively isolate multivariate anomalies in survey records.'
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
          explanation: q.explanation || 'The chosen standard option reflects verified methodology.'
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
      <div className="min-h-[300px] flex items-center justify-center text-gray-400 text-sm">
        Loading assessment...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Bar */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
            {quiz?.competency_tag || 'Assessment'}
          </span>
          <h1 className="text-base font-semibold text-gray-900 mt-1">{quiz?.title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-sm font-medium text-gray-700">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={() => navigate('/assessments')}
            className="text-xs text-gray-500 hover:text-gray-800 transition"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Quiz Question Card or Result Screen */}
      {!isSubmitted ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          {/* Question Counter & Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-base font-semibold text-gray-900 leading-snug">
            {currentQ?.question_text}
          </h2>

          {/* Options */}
          <div className="space-y-2.5">
            {[
              { key: 'option_a', text: currentQ?.option_a },
              { key: 'option_b', text: currentQ?.option_b },
              { key: 'option_c', text: currentQ?.option_c },
              { key: 'option_d', text: currentQ?.option_d }
            ].map((opt) => {
              const isSelected = selectedAnswers[currentQ?.id] === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => handleOptionSelect(opt.key)}
                  className={`w-full p-4 text-left rounded-xl border text-sm transition flex items-start space-x-3 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-medium'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                      isSelected ? 'bg-blue-600 text-white font-medium' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {opt.key.replace('option_', '').toUpperCase()}
                  </span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-40 transition flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition flex items-center space-x-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Result Screen */
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 text-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Assessment Complete</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {result?.passed ? 'You successfully achieved the passing benchmark.' : 'Review explanations below to improve.'}
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-xs text-gray-500">Final Score</div>
                <div className="text-2xl font-semibold text-blue-600 mt-1">{result?.score_percentage}%</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-xs text-gray-500">Correct Answers</div>
                <div className="text-2xl font-semibold text-gray-900 mt-1">
                  {result?.total_correct} / {result?.total_questions}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-xs text-gray-500">Competency Gain</div>
                <div className="text-2xl font-semibold text-emerald-600 mt-1">{result?.competency_gain}</div>
              </div>
            </div>

            <div>
              <button
                onClick={() => navigate('/assessments')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
              >
                Back to Assessments
              </button>
            </div>
          </div>

          {/* Detailed Feedback List */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Question Feedback</h3>
            <div className="space-y-3">
              {result?.detailed_feedback?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Question {idx + 1}</span>
                    <span className={`text-xs font-medium ${item.is_correct ? 'text-emerald-700' : 'text-red-600'}`}>
                      {item.is_correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-gray-700">{item.question_text}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    <span className="font-medium text-gray-700">Explanation:</span> {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizArena;
