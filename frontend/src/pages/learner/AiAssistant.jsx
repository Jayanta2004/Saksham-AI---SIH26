import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Loader2,
  User,
  Plus,
  MessageSquare,
  Trash2,
  Clock,
  ChevronRight,
  Sparkles,
  Brain,
  BookOpen,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  Check,
  Copy,
  StopCircle
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Official Indian Languages for MoSPI / Bhashini Voice & Text Assistance
const INDIAN_LANGUAGES = [
  { code: 'en', bcp47: 'en-IN', label: 'English', native: 'English' },
  { code: 'hi', bcp47: 'hi-IN', label: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', bcp47: 'bn-IN', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', bcp47: 'ta-IN', label: 'Tamil', native: 'தமிழ்' },
  { code: 'mr', bcp47: 'mr-IN', label: 'Marathi', native: 'मराठी' },
  { code: 'te', bcp47: 'te-IN', label: 'Telugu', native: 'తెలుగు' },
  { code: 'gu', bcp47: 'gu-IN', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', bcp47: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

const PROMPTS_BY_LANG = {
  en: [
    'How is Gross Value Added (GVA) calculated in SNA 2008?',
    'Explain Multiplier logic in NSSO surveys',
    'Recommend iGOT courses for Python microdata analytics',
    'What are the key provisions of DPDPA 2023 for surveys?',
  ],
  hi: [
    'SNA 2008 में Gross Value Added (GVA) की गणना कैसे होती है?',
    'NSSO सर्वेक्षण में सैंपलिंग मल्टीप्लायर क्या है?',
    'DPDPA 2023 के तहत डेटा गोपनीयता के प्रमुख नियम बताएं',
    'Python माइक्रोडाटा एनालिटिक्स के लिए iGOT कोर्स सुझाएं',
  ],
  bn: [
    'SNA 2008 অনুযায়ী GVA কীভাবে হিসাব করা হয়?',
    'NSSO সমীক্ষায় মাল্টিপ্লায়ার লজিক ব্যাখ্যা করুন',
    'DPDPA 2023 অনুযায়ী ডেটা সুরক্ষার নিয়মাবলী',
    'Python মাইক্রোডাটা অ্যানালিটিক্সের জন্য উপযুক্ত কোর্স',
  ],
  ta: [
    'SNA 2008 இல் GVA எவ்வாறு கணக்கிடப்படுகிறது?',
    'NSSO கணக்கெடுப்பில் மாதிரி பெருக்கியை விளக்குங்கள்',
    'DPDPA 2023 இன் கீழ் தரவு பாதுகாப்பு விதிகள்',
    'Python தரவு பகுப்பாய்வுக்கான iGOT படிப்புகள்',
  ],
  mr: [
    'SNA 2008 अंतर्गत GVA ची गणना कशी केली जाते?',
    'NSSO सर्वेक्षणातील मल्टिप्लायर पद्धत स्पष्ट करा',
    'DPDPA 2023 नुसार डेटा गोपनीयतेचे नियम',
  ],
  te: [
    'SNA 2008 లో GVA ను ఎలా లెక్కిస్తారు?',
    'NSSO సర్వేలలో మల్టీప్లైయర్ విధానాన్ని వివరించండి',
    'DPDPA 2023 డేటా గోప్యతా నిబంధనలు',
  ],
  gu: [
    'SNA 2008 મુજબ GVA ની ગણતરી કેવી રીતે થાય છે?',
    'NSSO સર્વેક્ષણમાં મલ્ટિપ્લાયર પદ્ધતિ સમજાવો',
  ],
  kn: [
    'SNA 2008 ನಲ್ಲಿ GVA ಲೆಕ್ಕಾಚಾರವನ್ನು ಹೇಗೆ ಮಾಡಲಾಗುತ್ತದೆ?',
    'NSSO ಸಮೀಕ್ಷೆಗಳಲ್ಲಿ ಗುಣಕ ತರ್ಕವನ್ನು ವಿವರಿಸಿ',
  ],
};

// Helper to clean and format LaTeX / math expressions into readable presentation
function cleanMathExpression(expr) {
  return expr
    .replace(/\$\$/g, '')
    .replace(/\$/g, '')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\mathit\{([^}]+)\}/g, '$1')
    .replace(/\\mathrm\{([^}]+)\}/g, '$1')
    .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '∑ ($1 to $2)')
    .replace(/\\sum_\{([^}]+)\}/g, '∑ ($1)')
    .replace(/\\sum/g, '∑')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\ge/g, '≥')
    .replace(/\\le/g, '≤')
    .replace(/\\ne/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\hat\{([^}]+)\}/g, '$1̂')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    .replace(/\\quad/g, '   ')
    .replace(/\\,/g, ' ')
    .replace(/\\\\/g, '\n')
    .trim();
}

// Helper component to render clean structured Markdown responses
const FormattedMessage = ({ text, isUser }) => {
  if (isUser) {
    return <div className="text-white font-normal text-xs sm:text-sm leading-relaxed">{text}</div>;
  }

  const lines = (text || '').split('\n');

  return (
    <div className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        if (trimmed === '---' || trimmed === '***') {
          return <hr key={idx} className="my-2.5 border-slate-200" />;
        }

        // Mathematical Display Formula Block ($$...$$)
        if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
          const cleanFormula = cleanMathExpression(trimmed);
          return (
            <div
              key={idx}
              className="my-2.5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-mono text-blue-900 font-semibold shadow-xs overflow-x-auto"
            >
              <span className="text-[10px] uppercase font-bold text-blue-700 block mb-1 tracking-wider">
                Formula:
              </span>
              {cleanFormula}
            </div>
          );
        }

        if (trimmed.startsWith('# ')) {
          return (
            <h1
              key={idx}
              className="font-headline font-bold text-slate-900 text-base mt-3 mb-1 border-b border-slate-200 pb-1"
            >
              {trimmed.replace('# ', '')}
            </h1>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="font-headline font-bold text-blue-700 text-sm mt-3 mb-1">
              {trimmed.replace('## ', '')}
            </h2>
          );
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="font-bold text-slate-900 text-xs uppercase tracking-wider mt-2.5 mb-1">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        if (trimmed.startsWith('#### ')) {
          return (
            <h4 key={idx} className="font-semibold text-purple-700 text-xs mt-2 mb-0.5">
              {trimmed.replace('#### ', '')}
            </h4>
          );
        }

        if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
          const content = trimmed.replace(/^[\*\-•]\s+/, '');
          return (
            <div key={idx} className="flex items-start space-x-2 pl-1.5 my-0.5">
              <span className="text-blue-600 font-bold leading-tight mt-0.5 shrink-0">•</span>
              <span className="flex-1 text-slate-700" dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start space-x-2 pl-1.5 my-0.5">
              <span className="font-bold text-blue-600 text-xs min-w-4 shrink-0">{numMatch[1]}.</span>
              <span className="flex-1 text-slate-700" dangerouslySetInnerHTML={{ __html: formatInline(numMatch[2]) }} />
            </div>
          );
        }

        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          if (trimmed.includes('---')) return null;
          const cells = trimmed.split('|').filter(Boolean).map((c) => c.trim());
          return (
            <div
              key={idx}
              className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs my-1"
            >
              {cells.map((cell, cIdx) => (
                <div
                  key={cIdx}
                  className="font-medium text-slate-800"
                  dangerouslySetInnerHTML={{ __html: formatInline(cell) }}
                />
              ))}
            </div>
          );
        }

        return (
          <p
            key={idx}
            className="text-xs text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
          />
        );
      })}
    </div>
  );
};

function formatInline(str) {
  let formatted = str.replace(/\$([^$]+)\$/g, (match, expr) => {
    return `<span class="font-mono font-semibold text-blue-800 bg-blue-50 px-1 py-0.5 rounded text-[11px]">${cleanMathExpression(
      expr
    )}</span>`;
  });

  return formatted
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-200 text-slate-900 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
}

const DEFAULT_WELCOME_MSG = {
  sender: 'ai',
  text: 'Namaste! I am your Saksham AI Statistical Assistant. Ask me questions by typing or using your microphone in your preferred regional language (हिन्दी, বাংলা, தமிழ், etc.). I provide in-depth explanations on SNA 2008, Sampling, CPI/IIP, and Python microdata pipelines.',
  timestamp: 'Just now',
};

export default function AiAssistant() {
  const { user } = useAuth();
  const userId = user?.id || user?.email || 'guest_user';
  const listStorageKey = `saksham_conv_list_${userId}`;
  const activeStorageKey = `saksham_active_conv_id_${userId}`;
  const langStorageKey = `saksham_ai_lang_${userId}`;

  const userName = user?.full_name ? user.full_name.split(' ')[0] : 'Officer';
  const userDept = user?.department || 'National Accounts Division (NAD)';

  // Multilingual State
  const [selectedLang, setSelectedLang] = useState(() => {
    return localStorage.getItem(langStorageKey) || 'en';
  });
  const activeLangObj = INDIAN_LANGUAGES.find((l) => l.code === selectedLang) || INDIAN_LANGUAGES[0];

  // Voice Input (Speech-to-Text) State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Text-to-Speech (TTS Audio Playback) State
  const [speakingMsgIdx, setSpeakingMsgIdx] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const createInitialConversations = () => [
    {
      id: `conv_init_${userId}`,
      title: 'Statistical Guidance & Upskilling',
      updatedAt: Date.now(),
      timeLabel: 'now',
      messages: [
        {
          sender: 'ai',
          text: `Namaste **${user?.full_name || 'Officer'}**! I am your Saksham AI Statistical Assistant for the **${userDept}**.\n\nYou can speak via microphone or type in **${activeLangObj.label}** (${activeLangObj.native}) or switch languages anytime above.\n\nFeel free to ask me about:\n* **Official Methodologies:** SNA 2008 GDP/GVA compilation, Multi-Stage Sampling & Multipliers, Price Indices.\n* **Computational Tools:** Python Pandas, R Survey Pipelines, Microdata Imputation.\n* **Data Governance:** DPDPA 2023 compliance & statistical confidentiality.\n* **Learning Pathways:** Recommended modules on iGOT Karmayogi and NSSTA residential workshops.`,
          timestamp: 'Just now',
        },
      ],
    },
  ];

  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(listStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load conversations:', e);
    }
    return createInitialConversations();
  });

  const [activeId, setActiveId] = useState(() => {
    try {
      const savedId = localStorage.getItem(activeStorageKey);
      if (savedId && conversations.some((c) => c.id === savedId)) {
        return savedId;
      }
    } catch (e) {}
    return conversations[0]?.id || `conv_init_${userId}`;
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Persist conversations & language preference
  useEffect(() => {
    try {
      localStorage.setItem(listStorageKey, JSON.stringify(conversations));
      localStorage.setItem(activeStorageKey, activeId);
      localStorage.setItem(langStorageKey, selectedLang);
    } catch (e) {
      console.warn('Could not persist conversations:', e);
    }
  }, [conversations, activeId, selectedLang, listStorageKey, activeStorageKey, langStorageKey]);

  // Clean up audio speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const activeConv = conversations.find((c) => c.id === activeId) || conversations[0];
  const messages = activeConv ? activeConv.messages : [DEFAULT_WELCOME_MSG];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleNewChat = () => {
    const newId = `conv_${Date.now()}`;
    const newConv = {
      id: newId,
      title: 'New Conversation',
      updatedAt: Date.now(),
      timeLabel: 'now',
      messages: [
        {
          ...DEFAULT_WELCOME_MSG,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    setConversations([newConv, ...conversations]);
    setActiveId(newId);
    setInput('');
  };

  const handleDeleteConv = (e, convId) => {
    e.stopPropagation();
    if (conversations.length <= 1) {
      handleNewChat();
      return;
    }
    const filtered = conversations.filter((c) => c.id !== convId);
    setConversations(filtered);
    if (activeId === convId) {
      setActiveId(filtered[0].id);
    }
  };

  // Voice Input: Web Speech Recognition
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari for voice input.'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = activeLangObj.bcp47;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event) => {
        console.warn('[SpeechRecognition] error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      setIsListening(false);
    }
  };

  // Text-to-Speech: Web SpeechSynthesis
  const handleToggleSpeak = (idx, text) => {
    if (!window.speechSynthesis) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (speakingMsgIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIdx(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Strip markdown formatting and formulas for clean speech playback
    const cleanSpeech = text
      .replace(/###/g, '')
      .replace(/##/g, '')
      .replace(/#/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\$\$[\s\S]*?\$\$/g, 'Formula omitted in speech.')
      .replace(/\$[^$]+\$/g, '')
      .replace(/---/g, '')
      .replace(/•/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = activeLangObj.bcp47;
    utterance.rate = 0.95;

    // Match best voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice =
      voices.find((v) => v.lang === activeLangObj.bcp47) ||
      voices.find((v) => v.lang.startsWith(activeLangObj.code)) ||
      voices.find((v) => v.lang === 'en-IN');
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => setSpeakingMsgIdx(null);
    utterance.onerror = () => setSpeakingMsgIdx(null);

    setSpeakingMsgIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIdx(null);
    }
  };

  const handleCopyMessage = (idx, text) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading || !activeConv) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user', text: query, timestamp: timeStr };

    let newTitle = activeConv.title;
    if (activeConv.title === 'New Conversation' || activeConv.messages.length <= 1) {
      newTitle = query.length > 32 ? `${query.slice(0, 32)}...` : query;
    }

    const updatedMessages = [...activeConv.messages, userMsg];

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, title: newTitle, messages: updatedMessages, updatedAt: Date.now(), timeLabel: 'now' }
          : c
      )
    );

    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/api/ai/assistant/chat', {
        message: query,
        language: selectedLang,
      });

      const aiReply = response.data?.reply || response.data?.message || 'I processed your statistical inquiry.';
      const aiTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const aiMsg = { sender: 'ai', text: aiReply, timestamp: aiTimeStr };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, messages: [...updatedMessages, aiMsg], updatedAt: Date.now() } : c
        )
      );
    } catch (err) {
      const aiTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const fallbackMsg = {
        sender: 'ai',
        text: `Regarding "${query}":\n\nThis concept is foundational to official statistical compilation. You can explore full training modules on iGOT Karmayogi and NSSTA-TPAC.`,
        timestamp: aiTimeStr,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, messages: [...updatedMessages, fallbackMsg], updatedAt: Date.now() } : c
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const currentPrompts = PROMPTS_BY_LANG[selectedLang] || PROMPTS_BY_LANG.en;

  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs relative">
      {/* -------------------------------------------------------------------- */}
      {/* LEFT COLUMN: Conversation Sessions List                              */}
      {/* -------------------------------------------------------------------- */}
      <div className="w-72 border-r border-slate-200 bg-slate-50/70 hidden md:flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <span className="font-headline font-bold text-xs uppercase tracking-wider text-slate-500">
            Chat Sessions
          </span>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((c) => {
            const isActive = c.id === activeId;
            return (
              <div
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition ${
                  isActive ? 'bg-white text-blue-700 shadow-2xs font-semibold border border-slate-200' : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="text-xs truncate">{c.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteConv(e, c.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* RIGHT COLUMN: Chat Area with Voice & Multilingual Controls           */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col bg-slate-50/50 relative">
        {/* Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-purple-50 border border-purple-200">
              <Bot className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline font-bold text-sm text-slate-900">
                  Statistical AI Copilot
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Voice &amp; Bhashini Ready
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                <span className="text-[10px] font-mono text-slate-600">
                  Online &bull; Grounded in MoSPI SNA 2008 &amp; NSS Standards
                </span>
              </div>
            </div>
          </div>

          {/* Regional Indian Language Selector Dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
              <Languages className="w-4 h-4 text-blue-600 shrink-0" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer pr-1"
                title="Select official Indian language for AI responses & voice input"
              >
                {INDIAN_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} ({lang.label})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            const isSpeaking = speakingMsgIdx === idx;

            return (
              <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 shadow-sm space-y-2 ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <FormattedMessage text={msg.text} isUser={isUser} />

                  {/* Actions & Timestamp Bar */}
                  <div
                    className={`pt-1 border-t flex items-center justify-between text-[10px] font-mono ${
                      isUser ? 'border-blue-500/40 text-blue-100' : 'border-slate-100 text-slate-500'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {/* AI Response Tools: TTS & Copy */}
                    {!isUser && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyMessage(idx, msg.text)}
                          className="hover:text-blue-600 flex items-center gap-1 transition"
                          title="Copy message"
                        >
                          {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => handleToggleSpeak(idx, msg.text)}
                          className={`flex items-center gap-1 transition px-1.5 py-0.5 rounded ${
                            isSpeaking
                              ? 'bg-purple-100 text-purple-700 font-bold'
                              : 'hover:text-blue-600'
                          }`}
                          title={isSpeaking ? 'Stop speaking' : 'Read aloud (Voice TTS)'}
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="w-3 h-3 text-purple-700 animate-pulse" />
                              <span>Stop Audio</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>Read Aloud</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-none flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span className="text-xs text-slate-600 font-mono">
                  Synthesizing statistical rationale in {activeLangObj.label}...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Global Floating Audio Player Notification when speaking */}
        {speakingMsgIdx !== null && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-purple-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-lg border border-purple-700 flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <Volume2 className="w-4 h-4 text-purple-300" />
            <span>Narrating response in {activeLangObj.label}...</span>
            <button
              onClick={handleStopSpeaking}
              className="ml-2 px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded-md text-[11px] font-bold transition flex items-center gap-1"
            >
              <StopCircle className="w-3 h-3" /> Stop
            </button>
          </div>
        )}

        {/* Prompt Suggestion Chips (Localized) */}
        {messages.length <= 3 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {currentPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="text-[11px] bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-blue-500 text-slate-700 hover:text-blue-600 transition-all text-left shadow-2xs"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Voice Recording Active Toast */}
        {isListening && (
          <div className="px-4 pb-1 flex items-center gap-2 text-xs font-semibold text-rose-600 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            <span>Listening... Speak clearly in {activeLangObj.native} ({activeLangObj.label})</span>
          </div>
        )}

        {/* Input Pill with Voice Dictation (Mic) */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className={`flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border transition-colors ${
              isListening ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/20' : 'border-slate-300 focus-within:border-blue-500'
            }`}
          >
            {/* Microphone Voice Button */}
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`p-2.5 rounded-xl transition-all shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white shadow-md animate-bounce'
                  : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700 hover:text-slate-900'
              }`}
              title={
                isListening
                  ? 'Click to stop voice listening'
                  : `Click to speak via microphone in ${activeLangObj.label}`
              }
            >
              {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-slate-700" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isListening
                  ? `Listening to your voice in ${activeLangObj.native}...`
                  : `Ask in ${activeLangObj.native} (${activeLangObj.label}) or type formula...`
              }
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl disabled:opacity-40 shadow-sm transition-all shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
