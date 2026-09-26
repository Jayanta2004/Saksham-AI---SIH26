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
    <div className="flex h-[calc(100vh-8rem)] rounded-3xl border border-slate-200/60 bg-slate-50/30 overflow-hidden shadow-xl shadow-slate-200/40 relative backdrop-blur-2xl">
      {/* -------------------------------------------------------------------- */}
      {/* LEFT COLUMN: Conversation Sessions List                              */}
      {/* -------------------------------------------------------------------- */}
      <div className="w-72 border-r border-slate-200/60 bg-white/60 backdrop-blur-xl hidden md:flex flex-col z-10">
        <div className="p-5 border-b border-slate-200/60 flex items-center justify-between">
          <span className="font-headline font-bold text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-400" />
            Chat History
          </span>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition-all transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200">
          {conversations.map((c) => {
            const isActive = c.id === activeId;
            return (
              <div
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 shadow-sm' 
                    : 'bg-transparent border border-transparent hover:bg-slate-100/50 hover:border-slate-200/50'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className={`text-sm truncate font-medium ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>{c.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">{c.timeLabel}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteConv(e, c.id)}
                  className={`p-1.5 rounded-md transition-all ${isActive ? 'opacity-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50' : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 hover:bg-slate-200'}`}
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
      <div className="flex-1 flex flex-col relative bg-slate-50/30 overflow-hidden">
        
        {/* Abstract Background Elements for Premium Feel */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none z-0" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-40 -left-32 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200/60 flex items-center justify-between bg-white/80 backdrop-blur-xl z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
              <Bot className="w-6 h-6 text-white" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline font-bold text-lg text-slate-900 tracking-tight">
                  Saksham AI Copilot
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100/80 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Bhashini Ready
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" /> Official Statistical & Governance Assistant
              </div>
            </div>
          </div>

          {/* Regional Indian Language Selector Dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm transition-all hover:shadow-md hover:border-blue-300">
              <Languages className="w-4 h-4 text-indigo-600 shrink-0" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 z-10 pb-40 scrollbar-thin scrollbar-thumb-slate-200">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            const isSpeaking = speakingMsgIdx === idx;

            return (
              <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className="flex gap-4 max-w-[85%] lg:max-w-[75%]">
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Bot className="w-4 h-4 text-indigo-700" />
                    </div>
                  )}
                  
                  <div
                    className={`rounded-3xl p-5 sm:p-6 shadow-sm relative group ${
                      isUser
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-blue-600/20'
                        : 'bg-white border border-slate-200/80 rounded-bl-sm shadow-slate-200/50'
                    }`}
                  >
                    <FormattedMessage text={msg.text} isUser={isUser} />

                    {/* Actions & Timestamp Bar */}
                    <div
                      className={`pt-3 mt-3 border-t flex items-center justify-between text-[11px] font-mono opacity-60 group-hover:opacity-100 transition-opacity ${
                        isUser ? 'border-white/20 text-blue-50' : 'border-slate-100 text-slate-500'
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {/* AI Response Tools: TTS & Copy */}
                      {!isUser && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleCopyMessage(idx, msg.text)}
                            className="hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
                            title="Copy message"
                          >
                            {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span className="font-semibold">{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                          </button>

                          <button
                            onClick={() => handleToggleSpeak(idx, msg.text)}
                            className={`flex items-center gap-1.5 transition-all px-2 py-1 rounded-md ${
                              isSpeaking
                                ? 'bg-indigo-100 text-indigo-700 font-bold shadow-sm'
                                : 'hover:bg-slate-100 hover:text-indigo-600 font-semibold'
                            }`}
                            title={isSpeaking ? 'Stop speaking' : 'Read aloud (Voice TTS)'}
                          >
                            {isSpeaking ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5 text-indigo-700 animate-pulse" />
                                <span>Stop Audio</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Read Aloud</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start animate-in fade-in">
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4 text-indigo-700" />
                </div>
                <div className="bg-white border border-slate-200/80 p-5 rounded-3xl rounded-bl-sm flex items-center gap-4 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Analyzing in {activeLangObj.label}...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Global Floating Audio Player Notification when speaking */}
        {speakingMsgIdx !== null && (
           <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-xl text-white px-5 py-2.5 rounded-full shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-4">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </div>
            <span>Narrating response in {activeLangObj.label}...</span>
            <button
              onClick={handleStopSpeaking}
              className="ml-3 px-3 py-1 bg-white/10 hover:bg-rose-500/80 hover:text-white rounded-full transition-all flex items-center gap-1.5"
            >
              <StopCircle className="w-3.5 h-3.5" /> Stop
            </button>
          </div>
        )}

        {/* Floating Input Area (ChatGPT Style) */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent pt-10 pb-6 px-4 z-20">
          <div className="max-w-4xl mx-auto w-full relative">
            
            {/* Prompt Suggestion Chips (Localized) */}
            {messages.length <= 3 && (
              <div className="absolute -top-14 left-0 w-full flex flex-wrap justify-center gap-2 px-2 animate-in fade-in slide-in-from-bottom-4">
                {currentPrompts.slice(0, 3).map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(p)}
                    className="text-[11px] font-medium bg-white/80 backdrop-blur-md border border-slate-200/80 px-4 py-2 rounded-full hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-500/10 text-slate-600 hover:text-indigo-700 transition-all transform hover:-translate-y-0.5"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Voice Recording Active Toast */}
            {isListening && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-rose-100 text-rose-700 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm border border-rose-200 animate-in fade-in zoom-in-95">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                Listening... Speak in {activeLangObj.native}
              </div>
            )}

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className={`flex items-end gap-2 bg-white p-2 rounded-3xl border shadow-lg transition-all duration-300 ${
                isListening 
                  ? 'border-rose-400 shadow-rose-500/20 ring-4 ring-rose-50' 
                  : 'border-slate-200 shadow-slate-200/50 focus-within:border-indigo-400 focus-within:shadow-indigo-500/20 focus-within:ring-4 focus-within:ring-indigo-50'
              }`}
            >
              {/* Microphone Voice Button */}
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`p-3.5 rounded-full transition-all shrink-0 ml-1 mb-1 ${
                  isListening
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                }`}
                title={isListening ? 'Stop listening' : `Speak in ${activeLangObj.label}`}
              >
                {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-slate-700" />}
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={
                  isListening
                    ? `Listening in ${activeLangObj.native}...`
                    : `Message Saksham AI in ${activeLangObj.native} or type a statistical query...`
                }
                className="flex-1 bg-transparent px-3 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none resize-none max-h-32 min-h-[56px] scrollbar-thin scrollbar-thumb-slate-200"
                rows={1}
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className={`p-3.5 rounded-full transition-all shrink-0 mr-1 mb-1 shadow-sm ${
                  !input.trim() || loading
                    ? 'bg-slate-100 text-slate-400'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md hover:shadow-indigo-500/30 transform hover:scale-105 active:scale-95'
                }`}
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <div className="text-center mt-3 text-[10px] text-slate-400 font-medium">
              Saksham AI can make mistakes. Verify critical statistical facts against official MoSPI & NSSO guidelines.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
