import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
  Printer,
  Compass,
  FileCheck,
  Send,
  HelpCircle,
  GraduationCap,
  Scale,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VivaExaminer() {
  // State
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Active test state
  const [activeTurn, setActiveTurn] = useState(null);
  const [candidateResponse, setCandidateResponse] = useState('');
  const [lastFeedback, setLastFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [finalDossier, setFinalDossier] = useState(null);
  
  // Voice & Speech state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Initialize Speech APIs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          setCandidateResponse((prev) => {
            const trimmed = prev.trim();
            const addition = finalTranscript || interimTranscript;
            if (!trimmed) return addition;
            if (trimmed.endsWith(addition.trim())) return trimmed;
            return trimmed + ' ' + addition;
          });
        };

        recognition.onerror = (e) => {
          console.warn('Speech recognition error:', e.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }

    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  // Fetch scenarios on mount
  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/viva/scenarios');
      const data = await res.json();
      if (data.success && data.scenarios) {
        setScenarios(data.scenarios);
        setSelectedScenario(data.scenarios[0]);
      }
    } catch (err) {
      console.error('Failed to load viva scenarios:', err);
    } finally {
      setLoading(false);
    }
  };

  // Speak text using TTS
  const speakText = (text) => {
    if (!voiceEnabled || !synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 0.95;

    // Try finding Indian English or clear voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-IN') || v.name.includes('India') || v.name.includes('Natural'));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  // Toggle Voice Listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your response directly.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (synthRef.current) synthRef.current.cancel();
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Recognition start failed:', err);
      }
    }
  };

  // Start Viva Examination
  const startViva = async () => {
    if (!selectedScenario) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/viva/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: selectedScenario.id })
      });
      const data = await res.json();
      if (data.success) {
        setSessionId(data.session_id);
        setActiveTurn(data.current_turn);
        setCandidateResponse('');
        setLastFeedback(null);
        setFinalDossier(null);
        setShowHint(false);

        // Speak initial question prompt
        if (data.current_turn.examiner_speech) {
          setTimeout(() => speakText(data.current_turn.examiner_speech), 400);
        }
      }
    } catch (err) {
      console.error('Failed to start viva session:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit Oral Defense Answer
  const submitTurn = async () => {
    if (!candidateResponse.trim()) {
      alert('Please provide an oral or written defense response before submitting.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    if (synthRef.current) synthRef.current.cancel();

    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/viva/evaluate-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          response_text: candidateResponse
        })
      });
      const data = await res.json();
      if (data.success) {
        setLastFeedback(data.last_turn_feedback);

        // Speak examiner feedback
        if (data.last_turn_feedback?.speech_feedback) {
          speakText(data.last_turn_feedback.speech_feedback);
        }

        if (data.is_complete) {
          setFinalDossier(data.final_dossier);
          setActiveTurn(null);
        } else {
          // Prepare next turn
          setActiveTurn(data.next_turn);
          setCandidateResponse('');
          setShowHint(false);
        }
      }
    } catch (err) {
      console.error('Failed to submit turn:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset examination
  const handleReset = () => {
    if (synthRef.current) synthRef.current.cancel();
    if (recognitionRef.current) recognitionRef.current.abort();
    setSessionId(null);
    setActiveTurn(null);
    setCandidateResponse('');
    setLastFeedback(null);
    setFinalDossier(null);
    setIsListening(false);
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Banner (Light Theme) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50/90 via-white to-indigo-50/90 border border-amber-200 p-6 md:p-8 shadow-sm">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                  NSSTA Greater Noida Examination Protocol
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-900 border border-indigo-200">
                  <Mic className="w-3.5 h-3.5 text-indigo-700" />
                  Voice-Enabled Oral Evaluation (STT / TTS)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <Scale className="w-3.5 h-3.5 text-emerald-700" />
                  Official MoSPI Rubric
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                AI Voice Roleplay Examiner
                <span className="text-xs font-bold uppercase px-2.5 py-1 bg-amber-100 text-amber-900 rounded border border-amber-300">
                  NSSTA Viva Voce
                </span>
              </h1>
              <p className="text-slate-600 text-sm md:text-base max-w-3xl leading-relaxed">
                Experience high-fidelity oral defense examinations overseen by simulated National Statistical Systems Training Academy (NSSTA) Examination Boards. Defend survey designs, non-sampling error handling, CAPI field protocols, and SNA 2008 macroeconomic accounts under rigorous verbal examination.
              </p>
            </div>

            {/* Audio Toggle Controls */}
            <div className="flex items-center gap-3 self-start md:self-auto bg-white/90 p-2.5 rounded-xl border border-slate-200 shadow-sm">
              <button
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  if (voiceEnabled && synthRef.current) synthRef.current.cancel();
                }}
                className={`p-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                  voiceEnabled
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
                title="Toggle Examiner Voice Narration"
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4 text-amber-700" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                <span className="hidden sm:inline">{voiceEnabled ? 'Examiner Voice ON' : 'Examiner Voice MUTED'}</span>
              </button>

              {sessionId && (
                <button
                  onClick={handleReset}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Exit Chamber
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* STAGE 1: TRACK & BOARD SELECTION (Light Theme)                 */}
        {/* ============================================================== */}
        {!sessionId && !finalDossier && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-600" />
                  Select Examination Board & Cadre Track
                </h2>
                <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                  Each examination board maintains specialized technical rubrics, scoring weights, and official standard reference manuals.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scenarios.map((sc) => {
                const isSelected = selectedScenario?.id === sc.id;
                return (
                  <div
                    key={sc.id}
                    onClick={() => setSelectedScenario(sc)}
                    className={`cursor-pointer rounded-2xl border p-6 transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-50/50 border-amber-500 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {sc.cadre}
                        </span>
                        <span className="text-xs font-semibold text-amber-800 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          {sc.duration_min} Mins
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                          {sc.title}
                        </h3>
                        <p className="text-xs text-amber-800 font-semibold mt-1">
                          {sc.board_name}
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="text-slate-500 font-medium">Lead Presiding Examiner:</div>
                        <div className="text-slate-900 font-bold">{sc.lead_examiner}</div>
                        <div className="text-slate-500 text-[11px]">{sc.lead_title}</div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {sc.overview}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs text-slate-600">
                        Passing Threshold: <span className="text-amber-800 font-bold">{sc.passing_score}% Score</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Track Details & Launch Action (Light) */}
            {selectedScenario && (
              <div className="bg-gradient-to-r from-amber-50/70 via-white to-amber-50/40 border border-amber-300 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Selected Protocol Ready
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedScenario.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    You will defend 4 structured oral examination questions directly before Presiding Examiner <strong>{selectedScenario.lead_examiner}</strong>. Responses will be recorded via your microphone or manual input, and evaluated immediately across Technical Depth, Nomenclature, and Methodological Precision.
                  </p>
                </div>

                <button
                  onClick={startViva}
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-3 text-base flex-shrink-0 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Enter Oral Defense Chamber
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* STAGE 2: ACTIVE ORAL DEFENSE CHAMBER (Light Theme)            */}
        {/* ============================================================== */}
        {sessionId && activeTurn && !finalDossier && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 4 Cols: Presiding Board & Examiner Persona */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Presiding Examiner Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />
                
                <div className="text-center space-y-4">
                  {/* Lead Examiner Avatar & Speaking Pulse */}
                  <div className="relative inline-block mx-auto">
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-slate-800 flex items-center justify-center text-3xl font-extrabold text-amber-100 border-2 shadow-md transition-all ${
                      isSpeaking ? 'border-amber-500 ring-4 ring-amber-300/60 scale-105' : 'border-slate-300'
                    }`}>
                      {selectedScenario?.lead_examiner?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'NS'}
                    </div>
                    {isSpeaking && (
                      <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-sm">
                        <Volume2 className="w-3 h-3" /> Speaking
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {selectedScenario?.lead_examiner}
                    </h3>
                    <p className="text-xs text-amber-800 font-semibold mt-0.5">
                      Presiding Examiner
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {selectedScenario?.lead_title}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
                    <div className="flex justify-between items-center text-slate-600 text-[11px]">
                      <span>Board Protocol:</span>
                      <span className="text-slate-900 font-medium">{selectedScenario?.board_name?.slice(0, 28)}...</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 text-[11px]">
                      <span>Passing Threshold:</span>
                      <span className="text-amber-800 font-bold">{selectedScenario?.passing_score}%</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 text-[11px]">
                      <span>Current Status:</span>
                      <span className={`font-semibold ${isSpeaking ? 'text-amber-700' : isListening ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
                        {isSpeaking ? 'Speaking prompt' : isListening ? 'Listening to candidate' : 'Awaiting oral defense'}
                      </span>
                    </div>
                  </div>

                  {/* Audio Equalizer Simulation */}
                  <div className="h-8 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center gap-1.5 px-4">
                    {[40, 75, 55, 90, 60, 80, 45, 95, 70, 50, 85, 65, 40].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isSpeaking
                            ? 'bg-amber-600'
                            : isListening
                            ? 'bg-red-500'
                            : 'bg-slate-300'
                        }`}
                        style={{
                          height: isSpeaking || isListening ? `${(h * ((i % 3) + 1)) % 100}%` : '20%'
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      onClick={() => speakText(activeTurn.question)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                      Replay Question
                    </button>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                      {showHint ? 'Hide Context' : 'Official Context'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Last Feedback Quick Note if available */}
              {lastFeedback && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600">
                    <span className="flex items-center gap-1 text-amber-800">
                      <Award className="w-3.5 h-3.5 text-amber-600" /> Previous Item Assessment
                    </span>
                    <span className="text-slate-900 font-extrabold">{lastFeedback.scores.turn_score_pct}%</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed italic bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                    "{lastFeedback.examiner_remarks}"
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-medium">Depth</div>
                      <div className="font-bold text-amber-800">{lastFeedback.scores.technical_depth} / 5</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-medium">Accuracy</div>
                      <div className="font-bold text-emerald-700">{lastFeedback.scores.methodological_accuracy} / 5</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-medium">Clarity</div>
                      <div className="font-bold text-indigo-700">{lastFeedback.scores.articulation_clarity} / 5</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 8 Cols: Active Viva Question & Candidate Speech Capture */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Question Banner */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-amber-600" />
                    Viva Item {activeTurn.index + 1} of {activeTurn.total}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-36 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                        style={{ width: `${((activeTurn.index + 1) / activeTurn.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-slate-600 font-bold">{Math.round(((activeTurn.index + 1) / activeTurn.total) * 100)}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    {activeTurn.title}
                  </h2>
                  <div className="p-5 bg-amber-50/50 rounded-xl border border-amber-200 text-slate-900 text-base md:text-lg leading-relaxed font-serif">
                    "{activeTurn.question}"
                  </div>
                </div>

                {/* Context Hint Collapsible */}
                {showHint && activeTurn.context_hint && (
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-xs md:text-sm text-indigo-950 space-y-1">
                    <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-indigo-700" /> Presiding Board Context Hint:
                    </div>
                    <p className="leading-relaxed text-indigo-900/90">{activeTurn.context_hint}</p>
                  </div>
                )}
              </div>

              {/* Candidate Oral Response Chamber */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Mic className="w-4 h-4 text-amber-700" />
                      Candidate's Oral Defense Submission
                    </h3>
                    <p className="text-xs text-slate-500">
                      Speak clearly into your microphone, or type your technical argument below.
                    </p>
                  </div>

                  {/* Microphone Record Button */}
                  <button
                    onClick={toggleListening}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                      isListening
                        ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        Click to Dictate Answer
                      </>
                    )}
                  </button>
                </div>

                {/* Response Textarea / Live Transcript */}
                <div className="relative">
                  <textarea
                    rows={6}
                    value={candidateResponse}
                    onChange={(e) => setCandidateResponse(e.target.value)}
                    placeholder="Candidate response transcript... (Click 'Click to Dictate Answer' to record voice or type your formal defense here citing methodology and official guidelines)"
                    className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl border border-slate-300 p-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:bg-white leading-relaxed font-sans transition-all"
                  />
                  {isListening && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-100 border border-red-300 rounded-full text-red-700 text-xs font-semibold animate-pulse shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-red-600" />
                      Recording Voice Audio...
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-slate-600 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>Word Count: <strong className="text-slate-900">{candidateResponse.trim().split(/\s+/).filter(Boolean).length}</strong> words</span>
                  </div>

                  <button
                    onClick={submitTurn}
                    disabled={submitting || !candidateResponse.trim()}
                    className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                      submitting || !candidateResponse.trim()
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-amber-600/20'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <Activity className="w-4 h-4 animate-spin" />
                        Board Deliberating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Oral Defense to Board
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STAGE 3: OFFICIAL NSSTA CERTIFICATION DOSSIER (Light Theme)    */}
        {/* ============================================================== */}
        {finalDossier && (
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* Dossier Header Certificate (Light) */}
            <div className="bg-gradient-to-b from-white via-amber-50/20 to-white border-2 border-amber-300 rounded-3xl p-8 md:p-12 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
              
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-widest">
                  <Award className="w-4 h-4 text-amber-700" /> Official Examination Transcript & Record
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                  National Statistical Systems Training Academy
                </h2>
                <p className="text-sm md:text-base text-amber-800 font-bold tracking-wide">
                  {finalDossier.board_name}
                </p>
                <div className="text-xs text-slate-500">
                  Certified on: <strong className="text-slate-800">{finalDossier.date_certified}</strong> • Session ID: <code className="text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">{finalDossier.session_id}</code>
                </div>
              </div>

              {/* Big Score & Verdict Card */}
              <div className="mt-8 p-6 md:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
                <div className="space-y-2 text-center md:text-left">
                  <div className="text-xs uppercase font-bold tracking-wider text-slate-500">
                    Official Board Recommendation
                  </div>
                  <div className={`text-2xl md:text-3xl font-extrabold ${finalDossier.verdictColor}`}>
                    {finalDossier.verdict}
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 max-w-xl leading-relaxed">
                    {finalDossier.recommendation}
                  </p>
                </div>

                <div className="text-center bg-slate-50 px-8 py-5 rounded-2xl border border-slate-200 flex-shrink-0">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Composite Score</div>
                  <div className="text-4xl md:text-5xl font-black text-amber-700 mt-1">
                    {finalDossier.overall_score}<span className="text-xl text-slate-500">/100</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-semibold">Standard NSSTA Rubric</div>
                </div>
              </div>

              {/* Core Rubric Score Triplets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-6">
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-1 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold">Technical Depth & Concepts</div>
                  <div className="text-2xl font-bold text-amber-700">{finalDossier.rubric_summary.technical_depth} <span className="text-xs text-slate-500">/ 5.0</span></div>
                  <div className="text-[10px] text-slate-500">Variance, estimation, frameworks</div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-1 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold">Methodological Precision</div>
                  <div className="text-2xl font-bold text-emerald-700">{finalDossier.rubric_summary.methodological_accuracy} <span className="text-xs text-slate-500">/ 5.0</span></div>
                  <div className="text-[10px] text-slate-500">SNA 2008, DPDPA 2023, CAPI standards</div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-1 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold">Articulation & Oral Defense</div>
                  <div className="text-2xl font-bold text-indigo-700">{finalDossier.rubric_summary.articulation_clarity} <span className="text-xs text-slate-500">/ 5.0</span></div>
                  <div className="text-[10px] text-slate-500">Clarity, structure, executive presence</div>
                </div>
              </div>
            </div>

            {/* Turn by Turn Oral Transcript Audit */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-amber-700" />
                  Turn-by-Turn Oral Defense Transcript & Board Audit
                </h3>
              </div>

              <div className="space-y-6">
                {finalDossier.turns.map((turn, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div className="font-bold text-sm text-slate-900">
                        Question {idx + 1}: {turn.question_title}
                      </div>
                      <div className="text-xs px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold">
                        Score: {turn.scores.turn_score_pct}%
                      </div>
                    </div>

                    <div className="text-xs text-slate-800 italic bg-amber-50/60 p-3 rounded-lg border border-amber-200">
                      <strong>Board Inquiry:</strong> "{turn.question}"
                    </div>

                    <div className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                      <strong>Candidate Defense:</strong> "{turn.candidate_response}"
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="text-slate-700">
                        <strong>Examiner Remarks:</strong> {turn.examiner_remarks}
                      </div>

                      {turn.matched_concepts?.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] text-slate-600 font-semibold">Mastered Concepts:</span>
                          {turn.matched_concepts.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-medium">
                              ✓ {c}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-amber-700" />
                        Official Reference: <span className="text-slate-700 font-medium">{turn.official_reference}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescribed iGOT Remediation Courses */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-700" />
                    Board Mandated / Recommended Upskilling Pathways
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Targeted modules aligned with specific concepts scrutinized during your oral defense.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {finalDossier.recommended_courses.map((course, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-colors shadow-xs"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded border border-indigo-200">
                        {course.competency}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-600">
                        Provider: {course.provider} • Duration: {course.duration}
                      </p>
                    </div>

                    <Link
                      to="/learning-paths"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-semibold rounded-lg text-xs border border-indigo-200 transition-all"
                    >
                      Enrol on iGOT Platform
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all border border-slate-300 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                Print Official NSSTA Transcript
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-amber-600/20 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Appear for Another Board Examination
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
