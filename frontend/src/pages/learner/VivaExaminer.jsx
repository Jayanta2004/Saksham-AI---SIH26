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

    // Try finding Indian English or clear British voice
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/20 p-6 md:p-8 backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
                  <GraduationCap className="w-3.5 h-3.5" />
                  NSSTA Greater Noida Examination Protocol
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
                  <Mic className="w-3.5 h-3.5" />
                  Voice-Enabled Oral Evaluation (STT / TTS)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  <Scale className="w-3.5 h-3.5" />
                  Official MoSPI Rubric
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                AI Voice Roleplay Examiner
                <span className="text-xs font-medium uppercase px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                  NSSTA Viva Voce
                </span>
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-3xl leading-relaxed">
                Experience high-fidelity oral defense examinations overseen by simulated National Statistical Systems Training Academy (NSSTA) Examination Boards. Defend survey designs, non-sampling error handling, CAPI field protocols, and SNA 2008 macroeconomic accounts under rigorous verbal examination.
              </p>
            </div>

            {/* Audio Toggle Controls */}
            <div className="flex items-center gap-3 self-start md:self-auto bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  if (voiceEnabled && synthRef.current) synthRef.current.cancel();
                }}
                className={`p-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                  voiceEnabled
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Toggle Examiner Voice Narration"
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                <span className="hidden sm:inline">{voiceEnabled ? 'Examiner Voice ON' : 'Examiner Voice MUTED'}</span>
              </button>

              {sessionId && (
                <button
                  onClick={handleReset}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Exit Chamber
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* STAGE 1: TRACK & BOARD SELECTION (When no active session)      */}
        {/* ============================================================== */}
        {!sessionId && !finalDossier && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  Select Examination Board & Cadre Track
                </h2>
                <p className="text-xs md:text-sm text-slate-400">
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
                    className={`cursor-pointer rounded-xl border p-6 transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500/70 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {sc.cadre}
                        </span>
                        <span className="text-xs font-medium text-amber-400/90 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {sc.duration_min} Mins
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                          {sc.title}
                        </h3>
                        <p className="text-xs text-amber-400/80 font-medium mt-1">
                          {sc.board_name}
                        </p>
                      </div>

                      <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs space-y-1">
                        <div className="text-slate-400 font-medium">Lead Presiding Examiner:</div>
                        <div className="text-white font-semibold">{sc.lead_examiner}</div>
                        <div className="text-slate-500 text-[11px]">{sc.lead_title}</div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {sc.overview}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="text-xs text-slate-400">
                        Threshold: <span className="text-amber-400 font-semibold">{sc.passing_score}% Score</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-700'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Track Details & Launch Action */}
            {selectedScenario && (
              <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase text-amber-400">
                    <Sparkles className="w-4 h-4" />
                    Selected Protocol Ready
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedScenario.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                    You will defend 4 structured oral examination questions directly before Presiding Examiner <strong>{selectedScenario.lead_examiner}</strong>. Responses will be recorded via your microphone or manual input, and evaluated immediately across Technical Depth, Nomenclature, and Methodological Precision.
                  </p>
                </div>

                <button
                  onClick={startViva}
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded-xl shadow-xl shadow-amber-600/20 transition-all flex items-center justify-center gap-3 text-base flex-shrink-0"
                >
                  <Play className="w-5 h-5 fill-slate-950" />
                  Enter Oral Defense Chamber
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* STAGE 2: ACTIVE ORAL DEFENSE CHAMBER                          */}
        {/* ============================================================== */}
        {sessionId && activeTurn && !finalDossier && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 4 Cols: Presiding Board & Examiner Persona */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Presiding Examiner Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="text-center space-y-4">
                  {/* Lead Examiner Avatar & Speaking Pulse */}
                  <div className="relative inline-block mx-auto">
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-slate-900 flex items-center justify-center text-3xl font-extrabold text-amber-200 border-2 shadow-2xl transition-all ${
                      isSpeaking ? 'border-amber-400 ring-4 ring-amber-500/30 scale-105' : 'border-slate-700'
                    }`}>
                      {selectedScenario?.lead_examiner?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'NS'}
                    </div>
                    {isSpeaking && (
                      <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-lg">
                        <Volume2 className="w-3 h-3" /> Speaking
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {selectedScenario?.lead_examiner}
                    </h3>
                    <p className="text-xs text-amber-400 font-semibold mt-0.5">
                      Presiding Examiner
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {selectedScenario?.lead_title}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-left text-xs space-y-2">
                    <div className="flex justify-between items-center text-slate-400 text-[11px]">
                      <span>Board Protocol:</span>
                      <span className="text-white font-medium">{selectedScenario?.board_name?.slice(0, 28)}...</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400 text-[11px]">
                      <span>Passing Threshold:</span>
                      <span className="text-amber-400 font-bold">{selectedScenario?.passing_score}%</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400 text-[11px]">
                      <span>Current Status:</span>
                      <span className={`font-semibold ${isSpeaking ? 'text-amber-400' : isListening ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
                        {isSpeaking ? 'Speaking prompt' : isListening ? 'Listening to candidate' : 'Awaiting oral defense'}
                      </span>
                    </div>
                  </div>

                  {/* Audio Equalizer Simulation */}
                  <div className="h-8 bg-slate-950/90 rounded-lg border border-slate-800 flex items-center justify-center gap-1.5 px-4">
                    {[40, 75, 55, 90, 60, 80, 45, 95, 70, 50, 85, 65, 40].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isSpeaking
                            ? 'bg-amber-400'
                            : isListening
                            ? 'bg-red-400'
                            : 'bg-slate-700'
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
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      Replay Question
                    </button>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                      {showHint ? 'Hide Context' : 'Official Context'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Last Feedback Quick Note if available */}
              {lastFeedback && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Award className="w-3.5 h-3.5" /> Previous Item Assessment
                    </span>
                    <span className="text-white font-extrabold">{lastFeedback.scores.turn_score_pct}%</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950 p-3 rounded-xl border border-slate-800">
                    "{lastFeedback.examiner_remarks}"
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500">Depth</div>
                      <div className="font-bold text-amber-400">{lastFeedback.scores.technical_depth} / 5</div>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500">Accuracy</div>
                      <div className="font-bold text-emerald-400">{lastFeedback.scores.methodological_accuracy} / 5</div>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500">Clarity</div>
                      <div className="font-bold text-indigo-400">{lastFeedback.scores.articulation_clarity} / 5</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 8 Cols: Active Viva Question & Candidate Speech Capture */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Question Banner */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    Viva Item {activeTurn.index + 1} of {activeTurn.total}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                        style={{ width: `${((activeTurn.index + 1) / activeTurn.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-slate-400 font-semibold">{Math.round(((activeTurn.index + 1) / activeTurn.total) * 100)}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    {activeTurn.title}
                  </h2>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-200 text-base md:text-lg leading-relaxed font-serif">
                    "{activeTurn.question}"
                  </div>
                </div>

                {/* Context Hint Collapsible */}
                {showHint && activeTurn.context_hint && (
                  <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs md:text-sm text-indigo-200 space-y-1">
                    <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" /> Presiding Board Context Hint:
                    </div>
                    <p className="leading-relaxed">{activeTurn.context_hint}</p>
                  </div>
                )}
              </div>

              {/* Candidate Oral Response Chamber */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Mic className="w-4 h-4 text-amber-400" />
                      Candidate's Oral Defense Submission
                    </h3>
                    <p className="text-xs text-slate-400">
                      Speak clearly into your microphone, or type your technical argument below.
                    </p>
                  </div>

                  {/* Microphone Record Button */}
                  <button
                    onClick={toggleListening}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
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
                    className="w-full bg-slate-950 text-slate-100 placeholder-slate-600 rounded-xl border border-slate-800 p-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-amber-500/50 leading-relaxed font-sans"
                  />
                  {isListening && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-500/40 rounded-full text-red-400 text-xs font-semibold animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Recording Voice Audio...
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Word Count: <strong className="text-slate-300">{candidateResponse.trim().split(/\s+/).filter(Boolean).length}</strong> words</span>
                  </div>

                  <button
                    onClick={submitTurn}
                    disabled={submitting || !candidateResponse.trim()}
                    className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                      submitting || !candidateResponse.trim()
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 shadow-amber-600/20'
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
        {/* STAGE 3: OFFICIAL NSSTA CERTIFICATION DOSSIER (Completed)      */}
        {/* ============================================================== */}
        {finalDossier && (
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* Dossier Header Certificate */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
                  <Award className="w-4 h-4" /> Official Examination Transcript & Record
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                  National Statistical Systems Training Academy
                </h2>
                <p className="text-sm md:text-base text-amber-300 font-semibold tracking-wide">
                  {finalDossier.board_name}
                </p>
                <div className="text-xs text-slate-400">
                  Certified on: <strong className="text-slate-200">{finalDossier.date_certified}</strong> • Session ID: <code className="text-amber-400/90">{finalDossier.session_id}</code>
                </div>
              </div>

              {/* Big Score & Verdict Card */}
              <div className="mt-8 p-6 md:p-8 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
                <div className="space-y-2 text-center md:text-left">
                  <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    Official Board Recommendation
                  </div>
                  <div className={`text-2xl md:text-3xl font-extrabold ${finalDossier.verdictColor}`}>
                    {finalDossier.verdict}
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
                    {finalDossier.recommendation}
                  </p>
                </div>

                <div className="text-center bg-slate-900 px-8 py-5 rounded-2xl border border-slate-700/80 flex-shrink-0">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Composite Score</div>
                  <div className="text-4xl md:text-5xl font-black text-amber-400 mt-1">
                    {finalDossier.overall_score}<span className="text-xl text-slate-500">/100</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-medium">Standard NSSTA Rubric</div>
                </div>
              </div>

              {/* Core Rubric Score Triplets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-6">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <div className="text-xs text-slate-400 font-medium">Technical Depth & Concepts</div>
                  <div className="text-2xl font-bold text-amber-400">{finalDossier.rubric_summary.technical_depth} <span className="text-xs text-slate-500">/ 5.0</span></div>
                  <div className="text-[10px] text-slate-500">Variance, estimation, frameworks</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <div className="text-xs text-slate-400 font-medium">Methodological & Regulatory Precision</div>
                  <div className="text-2xl font-bold text-emerald-400">{finalDossier.rubric_summary.methodological_accuracy} <span className="text-xs text-slate-500">/ 5.0</span></div>
                  <div className="text-[10px] text-slate-500">SNA 2008, DPDPA 2023, CAPI standards</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <div className="text-xs text-slate-400 font-medium">Articulation & Oral Defense</div>
                  <div className="text-2xl font-bold text-indigo-400">{finalDossier.rubric_summary.articulation_clarity} <span className="text-xs text-slate-500">/ 5.0</span></div>
                  <div className="text-[10px] text-slate-500">Clarity, structure, executive presence</div>
                </div>
              </div>
            </div>

            {/* Turn by Turn Oral Transcript Audit */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-amber-400" />
                  Turn-by-Turn Oral Defense Transcript & Board Audit
                </h3>
              </div>

              <div className="space-y-6">
                {finalDossier.turns.map((turn, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-slate-950 rounded-xl border border-slate-800/80 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div className="font-bold text-sm text-amber-300">
                        Question {idx + 1}: {turn.question_title}
                      </div>
                      <div className="text-xs px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded font-semibold">
                        Score: {turn.scores.turn_score_pct}%
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 italic bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <strong>Board Inquiry:</strong> "{turn.question}"
                    </div>

                    <div className="text-xs text-slate-200 bg-slate-900/40 p-3 rounded-lg border border-slate-800/60 leading-relaxed">
                      <strong>Candidate Defense:</strong> "{turn.candidate_response}"
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="text-slate-400">
                        <strong>Examiner Remarks:</strong> {turn.examiner_remarks}
                      </div>

                      {turn.matched_concepts?.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] text-slate-400 font-semibold">Mastered Concepts:</span>
                          {turn.matched_concepts.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px]">
                              ✓ {c}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-amber-400" />
                        Official Reference: <span className="text-slate-400">{turn.official_reference}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescribed iGOT Remediation Courses */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-400" />
                    Board Mandated / Recommended Upskilling Pathways
                  </h3>
                  <p className="text-xs text-slate-400">
                    Targeted modules aligned with specific concepts scrutinized during your oral defense.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {finalDossier.recommended_courses.map((course, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-colors"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                        {course.competency}
                      </span>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Provider: {course.provider} • Duration: {course.duration}
                      </p>
                    </div>

                    <Link
                      to="/learning-paths"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-semibold rounded-lg text-xs border border-indigo-500/30 transition-all"
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
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all border border-slate-700"
              >
                <Printer className="w-4 h-4" />
                Print Official NSSTA Transcript
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-amber-600/20"
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
