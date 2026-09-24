import React, { useState, useEffect, useRef } from 'react';
import {
  Languages,
  Volume2,
  VolumeX,
  Copy,
  Check,
  BookOpen,
  Sparkles,
  MessageSquare,
  HelpCircle,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRight,
  ShieldCheck,
  Bookmark
} from 'lucide-react';

export default function SurveyLocalizer() {
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState('hi');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState('upas_schedule_10');
  const [adaptedData, setAdaptedData] = useState(null);
  const [lexicon, setLexicon] = useState([]);
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'lexicon'
  const [lexiconSearch, setLexiconSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    fetchInitialData();

    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const [langRes, qRes, lexRes] = await Promise.all([
        fetch('http://localhost:5000/api/localizer/languages'),
        fetch('http://localhost:5000/api/localizer/questions'),
        fetch('http://localhost:5000/api/localizer/lexicon')
      ]);

      const [langData, qData, lexData] = await Promise.all([
        langRes.json(),
        qRes.json(),
        lexRes.json()
      ]);

      if (langData.success) setLanguages(langData.languages);
      if (qData.success) {
        setQuestions(qData.questions);
        if (qData.questions.length > 0) {
          fetchAdaptation(qData.questions[0].id, 'hi');
        }
      }
      if (lexData.success) setLexicon(lexData.lexicon);
    } catch (err) {
      console.error('Failed to load localizer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdaptation = async (questionId, langCode) => {
    try {
      const res = await fetch('http://localhost:5000/api/localizer/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: questionId, target_lang: langCode })
      });
      const data = await res.json();
      if (data.success) {
        setAdaptedData(data);
      }
    } catch (err) {
      console.error('Failed to adapt question:', err);
    }
  };

  const handleLanguageChange = (code) => {
    setSelectedLang(code);
    fetchAdaptation(selectedQuestionId, code);
  };

  const handleQuestionChange = (id) => {
    setSelectedQuestionId(id);
    fetchAdaptation(id, selectedLang);
  };

  const speakText = (text, langCode = 'hi-IN') => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map langCode to BCP-47
    const langMap = {
      hi: 'hi-IN',
      bn: 'bn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      or: 'or-IN',
      pa: 'pa-IN'
    };
    utterance.lang = langMap[selectedLang] || 'hi-IN';
    utterance.rate = 0.92;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtered lexicon
  const filteredLexicon = lexicon.filter(item => {
    if (!lexiconSearch.trim()) return true;
    const q = lexiconSearch.toLowerCase();
    return (
      item.english.toLowerCase().includes(q) ||
      (item.hindi && item.hindi.toLowerCase().includes(q)) ||
      (item[selectedLang] && item[selectedLang].toLowerCase().includes(q)) ||
      item.concept.toLowerCase().includes(q)
    );
  });

  const currentLangObj = languages.find(l => l.code === selectedLang) || languages[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50/90 via-white to-indigo-50/90 border border-amber-200 p-6 md:p-8 shadow-sm">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                  <Languages className="w-3.5 h-3.5 text-amber-700" />
                  Digital India Bhashini Language Standard
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-900 border border-indigo-200">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-700" />
                  Field Conversational Scripting
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  NSSO Enumeration Bias Mitigation
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                Bhashini Survey Localizer & Dialect Rephraser
                <span className="text-xs font-bold uppercase px-2.5 py-1 bg-amber-100 text-amber-900 rounded border border-amber-300">
                  NSSO Field Operations
                </span>
              </h1>
              <p className="text-slate-600 text-sm md:text-base max-w-3xl leading-relaxed">
                Empower Field Investigators and Statistical Officers to bridge bureaucratic questionnaire language into natural, respectful, conversational dialect phrasings across 10 Indian languages—eliminating cognitive interview bias while rigorously preserving official MoSPI statutory concepts.
              </p>
            </div>
          </div>
        </div>

        {/* 10-Language Selector Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-600" /> Target Field Language / Region
            </span>
            <span className="text-xs text-amber-800 font-bold">
              Active: {currentLangObj?.name} ({currentLangObj?.native}) • {currentLangObj?.region}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {languages.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 ring-2 ring-amber-400'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base">{lang.native}</span>
                  <span className="text-[11px] opacity-90 font-medium">({lang.name})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Survey Schedule Question Adapter
          </button>
          <button
            onClick={() => setActiveTab('lexicon')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'lexicon'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            MoSPI Official Statistical Lexicon Matrix ({lexicon.length} Terms)
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: SURVEY SCHEDULE QUESTION & CONVERSATIONAL DIALECT ADAPTATION */}
        {/* ============================================================== */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            
            {/* Question Selector Cards */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Official Survey Question to Adapt:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions.map((q) => {
                  const isSelected = selectedQuestionId === q.id;
                  return (
                    <div
                      key={q.id}
                      onClick={() => handleQuestionChange(q.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-400/40 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                        <span>{q.survey}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {q.schedule_code}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {q.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {q.official_english}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Side-by-Side Dual-Card Presentation */}
            {adaptedData && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left 5 Cols: Verbatim English Bureaucratic Prompt */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-400" />
                      Official Bureaucratic Prompt
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {adaptedData.schedule_code}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {adaptedData.title}
                    </h3>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-sm md:text-base leading-relaxed font-serif">
                      "{adaptedData.official_english}"
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Standard Literal Translation ({currentLangObj?.name}):
                    </div>
                    <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-200 text-slate-800 text-sm leading-relaxed">
                      {adaptedData.adaptation.standard_literal}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="text-slate-500 font-semibold">Underlying Statistical Concept:</div>
                    <div className="text-slate-800 font-medium">{adaptedData.target_concept || 'Survey Schedule Standard Metric'}</div>
                  </div>
                </div>

                {/* Right 7 Cols: Field Investigator Conversational Dialogue Script */}
                <div className="lg:col-span-7 bg-gradient-to-b from-white via-amber-50/20 to-white border-2 border-amber-300 rounded-2xl p-6 md:p-8 space-y-6 shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Field Enumerator Conversational Dialogue Script
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakText(adaptedData.adaptation.speech_text)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                          isSpeaking
                            ? 'bg-amber-600 text-white animate-pulse'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        {isSpeaking ? 'Speaking...' : 'Listen in ' + currentLangObj?.name}
                      </button>

                      <button
                        onClick={() => copyToClipboard(adaptedData.adaptation.conversational_field_script)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Big Conversational Speech Bubble */}
                  <div className="p-6 bg-white rounded-2xl border-2 border-amber-400 shadow-sm space-y-3 relative">
                    <span className="absolute -top-3 left-6 px-2.5 py-0.5 rounded bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      Speak directly to respondent:
                    </span>
                    <p className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed font-sans">
                      "{adaptedData.adaptation.conversational_field_script}"
                    </p>
                  </div>

                  {/* Dialect / Colloquial Notes */}
                  {adaptedData.adaptation.dialect_notes && (
                    <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1 text-xs">
                      <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-indigo-700" /> Regional Dialect Guidance:
                      </span>
                      <p className="text-indigo-950 font-medium leading-relaxed">
                        {adaptedData.adaptation.dialect_notes}
                      </p>
                    </div>
                  )}

                  {/* Key Phrases for Quick Prompting */}
                  {adaptedData.adaptation.key_phrases?.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-500">Key Regional Vocabulary Prompts:</span>
                      <div className="flex flex-wrap gap-2">
                        {adaptedData.adaptation.key_phrases.map((phrase, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold border border-amber-300"
                          >
                            ✓ {phrase}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Supervisory Probing Warning */}
                  {adaptedData.adaptation.probing_warning && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-red-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-700" /> Mandatory Field Probing Warning:
                      </div>
                      <p className="text-red-950 leading-relaxed font-medium">
                        {adaptedData.adaptation.probing_warning}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: MOSPI OFFICIAL STATISTICAL LEXICON MATRIX              */}
        {/* ============================================================== */}
        {activeTab === 'lexicon' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  MoSPI Multilingual Statistical Lexicon Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standardized nomenclature aligning English statistical manuals with official regional terms in {currentLangObj?.name}.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search statistical concept..."
                  value={lexiconSearch}
                  onChange={(e) => setLexiconSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-white text-slate-800 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 w-64 shadow-xs"
                />
              </div>
            </div>

            {/* Lexicon Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLexicon.map((term) => (
                <div
                  key={term.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {term.english}
                      </h4>
                      <p className="text-sm font-bold text-amber-800 mt-1">
                        {term[selectedLang] || term.hindi}
                      </p>
                      {selectedLang !== 'hi' && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          Hindi: {term.hindi}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => speakText(term[selectedLang] || term.hindi)}
                      className="p-2 bg-slate-50 hover:bg-amber-100 text-slate-600 hover:text-amber-800 rounded-lg border border-slate-200 transition-all cursor-pointer"
                      title="Audio Pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <strong className="text-slate-800">Concept:</strong> {term.concept}
                  </p>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1 border-t border-slate-100 pt-3">
                    <Bookmark className="w-3 h-3 text-amber-600" />
                    Official Reference: <span className="text-slate-700 font-medium">{term.official_reference}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
