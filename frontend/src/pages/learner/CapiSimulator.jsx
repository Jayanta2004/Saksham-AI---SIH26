import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  User,
  ShieldCheck,
  AlertTriangle,
  Send,
  RotateCcw,
  CheckCircle2,
  Award,
  BookOpen,
  Mic,
  MicOff,
  Building2,
  MapPin,
  TrendingUp,
  FileCheck,
  Sparkles,
  Info,
  ChevronRight,
  Loader2,
  X,
  Printer
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CapiSimulator() {
  const { user } = useAuth();

  const [personas, setPersonas] = useState([]);
  const [activePersonaId, setActivePersonaId] = useState(null);
  const [loadingPersonas, setLoadingPersonas] = useState(true);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [rapport, setRapport] = useState(50);
  const [latestTip, setLatestTip] = useState(null);

  // Evaluation Report State
  const [evaluating, setEvaluating] = useState(false);
  const [evalReport, setEvalReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch personas on load
  useEffect(() => {
    let isMounted = true;
    const fetchPersonas = async () => {
      try {
        const res = await api.get('/api/simulator/personas');
        if (isMounted && res.data?.personas) {
          setPersonas(res.data.personas);
          setActivePersonaId(res.data.personas[0]?.id || null);
          setRapport(res.data.personas[0]?.initial_rapport || 45);
        }
      } catch (err) {
        console.warn('[CapiSimulator] Fallback personas used:', err);
      } finally {
        if (isMounted) setLoadingPersonas(false);
      }
    };

    fetchPersonas();
    return () => {
      isMounted = false;
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const activePersona = personas.find((p) => p.id === activePersonaId) || personas[0];

  // Initialize initial message when persona changes
  useEffect(() => {
    if (activePersona) {
      setRapport(activePersona.initial_rapport || 45);
      setLatestTip({
        type: 'info',
        text: `Field Protocol: Introduce yourself respectfully, present your MoSPI photo ID card, and reassure the respondent regarding DPDPA 2023 statistical confidentiality.`
      });
      setMessages([
        {
          sender: 'respondent',
          text: activePersona.sample_dialogues?.[0]?.reply || 'Namaste... Who are you? Why are you asking for our personal details?',
          timestamp: 'Just now',
          rapportDelta: 0,
          stateTag: 'Initial Reluctance'
        }
      ]);
    }
  }, [activePersonaId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  // Voice input
  const handleToggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'hi-IN'; // Default to Indian English / Hindi mix
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => setIsListening(true);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;
    rec.start();
  };

  // Send question to simulator
  const handleSendMessage = async (textToSend) => {
    const question = (textToSend || input).trim();
    if (!question || sending || !activePersona) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = {
      sender: 'user',
      text: question,
      timestamp: timeStr
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setSending(true);

    try {
      const res = await api.post('/api/simulator/chat', {
        persona_id: activePersona.id,
        message: question,
        current_rapport: rapport
      });

      const replyData = res.data;
      const respTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setRapport(replyData.new_rapport);
      if (replyData.feedback_tip) {
        setLatestTip({
          type: replyData.rapport_delta >= 0 ? 'success' : 'warning',
          text: replyData.feedback_tip
        });
      }

      setMessages([
        ...nextMessages,
        {
          sender: 'respondent',
          text: replyData.reply,
          timestamp: respTimeStr,
          rapportDelta: replyData.rapport_delta,
          stateTag: replyData.state_tag
        }
      ]);
    } catch (err) {
      console.warn('Chat error:', err);
    } finally {
      setSending(false);
    }
  };

  const handleRestart = () => {
    if (!activePersona) return;
    setRapport(activePersona.initial_rapport || 45);
    setLatestTip({
      type: 'info',
      text: `Field Protocol: Introduce yourself respectfully, present your MoSPI photo ID card, and reassure the respondent regarding DPDPA 2023 statistical confidentiality.`
    });
    setMessages([
      {
        sender: 'respondent',
        text: activePersona.sample_dialogues?.[0]?.reply || 'Namaste... Who are you?',
        timestamp: 'Just now',
        rapportDelta: 0,
        stateTag: 'Initial Reluctance'
      }
    ]);
  };

  const handleEvaluate = async () => {
    if (!activePersona || messages.length < 2) {
      alert('Please conduct at least 2 question exchanges before generating your evaluation report.');
      return;
    }

    setEvaluating(true);
    try {
      const res = await api.post('/api/simulator/evaluate', {
        persona_id: activePersona.id,
        total_exchanges: messages.filter((m) => m.sender === 'user').length,
        final_rapport: rapport,
        history: messages
      });

      if (res.data?.report) {
        setEvalReport(res.data.report);
        setShowReportModal(true);
      }
    } catch (err) {
      alert('Could not generate report. Please try again.');
    } finally {
      setEvaluating(false);
    }
  };

  // Quick Starter Questions
  const starterQuestions = [
    'Namaste Patil ji. I am an authorized Field Investigator from the Ministry of Statistics (MoSPI). Here is my official government badge.',
    'Your responses are strictly protected under the Digital Personal Data Protection Act (DPDPA 2023) and cannot be shared with tax or police authorities.',
    'Could you break down your total agricultural revenue from cotton versus total input costs (seeds, fertilizer, diesel)?',
    'Do you or any household members have outstanding loan installments with the bank or local lenders?'
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-600" />
              NSSO Field Operations Division (FOD) Training Simulator
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Simulation
            </span>
          </div>
          <h1 className="font-headline text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            AI CAPI Survey &amp; Field Enumeration Roleplay Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Practice personal interviewing techniques for national surveys (PLFS, ASI, TUS). Master respondent rapport, address data-sharing skepticism, uphold DPDPA 2023 confidentiality, and validate schedule consistency.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleRestart}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            title="Reset interview"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleEvaluate}
            disabled={evaluating || messages.length < 2}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition"
          >
            {evaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
            <span>Evaluate &amp; Score Interview</span>
          </button>
        </div>
      </div>

      {/* Persona Selector Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span>Select Survey Respondent Persona:</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {personas.map((p) => {
            const isSelected = p.id === activePersonaId;
            return (
              <button
                key={p.id}
                onClick={() => setActivePersonaId(p.id)}
                className={`text-left p-4 rounded-xl border transition flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 shadow-2xs ring-1 ring-blue-500'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-headline font-bold text-sm text-slate-900">{p.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      Age {p.age}
                    </span>
                  </div>
                  <div className="text-xs text-blue-700 font-semibold mt-0.5">{p.occupation}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{p.location}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{p.difficulty}</span>
                  <span className="text-blue-600 font-semibold">Select Persona &rarr;</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulation Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Respondent Dossier & CAPI Schedule Checklist (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Dossier Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-headline font-bold text-base text-slate-900">{activePersona?.name}</h3>
                <p className="text-xs text-slate-500">{activePersona?.survey_round}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold text-sm">
                {activePersona?.name.charAt(0)}
              </div>
            </div>

            {/* Rapport & Trust Meter */}
            <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  Rapport &amp; Trust Level:
                </span>
                <span
                  className={`font-mono font-bold text-xs ${
                    rapport >= 75
                      ? 'text-emerald-700'
                      : rapport >= 50
                      ? 'text-amber-700'
                      : 'text-rose-700'
                  }`}
                >
                  {rapport}% ({rapport >= 75 ? 'Cooperative' : rapport >= 50 ? 'Cautious' : 'Guarded'})
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    rapport >= 75
                      ? 'bg-emerald-500'
                      : rapport >= 50
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${rapport}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500 flex justify-between pt-0.5">
                <span>0% Hostile</span>
                <span>50% Neutral</span>
                <span>100% Full Trust</span>
              </div>
            </div>

            {/* Field Quirks & Psychology */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Respondent Sensitivity &amp; Quirks:
              </span>
              <div className="space-y-1.5">
                {activePersona?.field_quirks?.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="leading-snug text-[11px]">{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CAPI Schedule Checklist */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                CAPI Schedule Milestones:
              </span>
              <div className="space-y-1 text-xs">
                {[
                  { label: 'Official Identity & Badge Verification', done: messages.some((m) => m.text.toLowerCase().includes('mospi') || m.text.toLowerCase().includes('badge')) },
                  { label: 'DPDPA 2023 Consent & Confidentiality', done: messages.some((m) => m.text.toLowerCase().includes('confidential') || m.text.toLowerCase().includes('dpdpa')) },
                  { label: 'Economic Activity & Turnover Probing', done: messages.some((m) => m.text.toLowerCase().includes('income') || m.text.toLowerCase().includes('cost')) },
                  { label: 'Liabilities & Informal Credit Checks', done: messages.some((m) => m.text.toLowerCase().includes('loan') || m.text.toLowerCase().includes('debt')) },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-1.5 text-slate-700">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.done ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span className={`text-[11px] ${item.done ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Interview Dialogue Stream (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[650px]">
          {/* Stream Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-headline font-bold text-sm text-slate-900">
                  CAPI Field Tablet Interface
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Module: Schedule 10.4 &bull; Status: Live Interviewing
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-full font-mono text-slate-700 shadow-2xs">
                Exchanges: {messages.filter((m) => m.sender === 'user').length}
              </span>
            </div>
          </div>

          {/* Real-time Field Feedback Tip Banner */}
          {latestTip && (
            <div
              className={`p-3 border-b text-xs flex items-center gap-2.5 transition-all ${
                latestTip.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : latestTip.type === 'warning'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <Info className="w-4 h-4 shrink-0" />
              <span className="leading-snug">{latestTip.text}</span>
            </div>
          )}

          {/* Dialogue Message Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-sm space-y-2 ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 rounded-bl-none text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold pb-1 border-b border-white/20">
                      <span>{isUser ? 'Field Investigator (You)' : activePersona?.name}</span>
                      {msg.stateTag && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            isUser
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-700 font-mono font-normal'
                          }`}
                        >
                          {msg.stateTag}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>

                    <div
                      className={`flex items-center justify-between text-[10px] font-mono pt-1 ${
                        isUser ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {!isUser && msg.rapportDelta !== undefined && msg.rapportDelta !== 0 && (
                        <span
                          className={`font-bold ${
                            msg.rapportDelta > 0 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {msg.rapportDelta > 0 ? `+${msg.rapportDelta}` : msg.rapportDelta} Trust
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none flex items-center gap-2.5 text-xs text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>{activePersona?.name} is responding...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Probing Suggestion Chips */}
          <div className="p-3 bg-white border-t border-slate-200 overflow-x-auto flex gap-2 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 shrink-0">
              Probing Starters:
            </span>
            {starterQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                disabled={sending}
                className="text-[11px] bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-full transition-all text-left truncate max-w-xs shrink-0"
                title={q}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Pill */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-300 focus-within:border-blue-500"
            >
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2 rounded-xl transition ${
                  isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-200 text-slate-700'
                }`}
                title="Voice input (Dictate question)"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask question, probe income/hours, or explain MoSPI confidentiality..."
                className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none"
              />

              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Evaluation Modal */}
      {showReportModal && evalReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-slate-900">
                    MoSPI CAPI Interviewing Competency Dossier
                  </h3>
                  <p className="text-xs text-slate-500">Official Field Evaluation for {evalReport.persona_name}</p>
                </div>
              </div>

              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-6 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-blue-200 uppercase tracking-wider font-semibold">
                  Overall Field Score
                </div>
                <div className="text-3xl font-extrabold font-mono mt-0.5">{evalReport.overall_score}%</div>
                <div className="text-xs text-blue-100 font-semibold mt-1">{evalReport.grade}</div>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold font-mono">
                  +50 XP Earned
                </span>
                <p className="text-[11px] text-blue-200 mt-1">Status: Passed Official Benchmark</p>
              </div>
            </div>

            {/* 4 Pillars Breakdown Grid */}
            <div className="space-y-3">
              <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-slate-400">
                Competency Breakdown Across 4 Core Pillars:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.values(evalReport.competencies).map((c, i) => (
                  <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{c.label}</span>
                      <span className="font-mono font-bold text-blue-700">{c.score}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${c.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Improvement Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                <h5 className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Strengths Observed:
                </h5>
                <ul className="space-y-1 text-emerald-800 list-disc list-inside">
                  {evalReport.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <h5 className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-600" />
                  Recommended Refinements:
                </h5>
                <ul className="space-y-1 text-amber-800 list-disc list-inside">
                  {evalReport.improvement_areas.map((area, i) => (
                    <li key={i}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Training Modules */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">Recommended NSSTA Academy Follow-up:</span>
              {evalReport.recommended_nssta_courses.map((course, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-700">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>{course}</span>
                </div>
              ))}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              >
                Close &amp; Save Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
