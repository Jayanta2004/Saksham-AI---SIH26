import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, User, Plus, MessageSquare, Trash2, Clock, ChevronRight, Sparkles, Brain, BookOpen } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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
            <div key={idx} className="my-2.5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-mono text-blue-900 font-semibold shadow-xs overflow-x-auto">
              <span className="text-[10px] uppercase font-bold text-blue-700 block mb-1 tracking-wider">Formula:</span>
              {cleanFormula}
            </div>
          );
        }

        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="font-headline font-bold text-slate-900 text-base mt-3 mb-1 border-b border-slate-200 pb-1">
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
            <div key={idx} className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs my-1">
              {cells.map((cell, cIdx) => (
                <div key={cIdx} className="font-medium text-slate-800" dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
              ))}
            </div>
          );
        }

        return (
          <p key={idx} className="text-xs text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
        );
      })}
    </div>
  );
};

function formatInline(str) {
  let formatted = str.replace(/\$([^$]+)\$/g, (match, expr) => {
    return `<span class="font-mono font-semibold text-blue-800 bg-blue-50 px-1 py-0.5 rounded text-[11px]">${cleanMathExpression(expr)}</span>`;
  });

  return formatted
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-200 text-slate-900 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
}

const DEFAULT_WELCOME_MSG = {
  sender: 'ai',
  text: 'Namaste! I am your Saksham AI Statistical Assistant. Ask me about official statistical methodologies (SNA 2008 GDP/GVA compilation, Survey Sampling & Multipliers, CPI/IIP), computational workflows (Python, R, Microdata), or your personalized iGOT / NSSTA learning pathways.',
  timestamp: 'Just now'
};

export default function AiAssistant() {
  const { user } = useAuth();
  const userId = user?.id || user?.email || 'guest_user';
  const listStorageKey = `saksham_conv_list_${userId}`;
  const activeStorageKey = `saksham_active_conv_id_${userId}`;

  const userName = user?.full_name ? user.full_name.split(' ')[0] : 'Officer';
  const userDept = user?.department || 'National Accounts Division (NAD)';

  const createInitialConversations = () => [
    {
      id: `conv_init_${userId}`,
      title: 'Statistical Guidance & Upskilling',
      updatedAt: Date.now(),
      timeLabel: 'now',
      messages: [
        {
          sender: 'ai',
          text: `Namaste **${user?.full_name || 'Officer'}**! I am your Saksham AI Statistical Assistant for the **${userDept}**.\n\nFeel free to ask me about:\n* **Official Methodologies:** SNA 2008 GDP/GVA compilation, Multi-Stage Sampling & Multipliers, Price Indices.\n* **Computational Tools:** Python Pandas, R Survey Pipelines, Microdata Imputation.\n* **Data Governance:** DPDPA 2023 compliance & statistical confidentiality.\n* **Learning Pathways:** Recommended modules on iGOT Karmayogi and NSSTA residential workshops.`,
          timestamp: 'Just now'
        }
      ]
    }
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

  useEffect(() => {
    try {
      localStorage.setItem(listStorageKey, JSON.stringify(conversations));
      localStorage.setItem(activeStorageKey, activeId);
    } catch (e) {
      console.warn('Could not persist conversations:', e);
    }
  }, [conversations, activeId, listStorageKey, activeStorageKey]);

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
      messages: [{
        ...DEFAULT_WELCOME_MSG,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]
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

  const suggestedPrompts = [
    'How is Gross Value Added (GVA) calculated in SNA 2008?',
    'Explain Multiplier logic in NSSO surveys',
    'Recommend iGOT courses for Python microdata analytics',
    'What are the key provisions of DPDPA 2023 for surveys?'
  ];

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading || !activeConv) return;

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
      const response = await api.post('/api/ai/assistant/chat', { message: query });
      const aiReply = response.data?.reply || response.data?.message || 'I processed your request.';
      const aiTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const aiMsg = { sender: 'ai', text: aiReply, timestamp: aiTimeStr };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: [...updatedMessages, aiMsg], updatedAt: Date.now() }
            : c
        )
      );
    } catch (err) {
      const aiTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const fallbackMsg = {
        sender: 'ai',
        text: `Regarding "${query}":\n\nThis concept is foundational to official statistical compilation. You can explore full training modules on iGOT Karmayogi and NSSTA-TPAC.`,
        timestamp: aiTimeStr
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: [...updatedMessages, fallbackMsg], updatedAt: Date.now() }
            : c
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] max-w-6xl mx-auto rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xl">
      
      {/* -------------------------------------------------------------------- */}
      {/* LEFT COLUMN: Multi-Session Chat History Sidebar                      */}
      {/* -------------------------------------------------------------------- */}
      <div className="w-64 md:w-72 bg-slate-50 flex flex-col shrink-0 border-r border-slate-200">
        {/* Header / New Chat Button */}
        <div className="p-3.5 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Conversations
            </span>
            <button
              onClick={handleNewChat}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-600 transition"
              title="Start New Conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => {
            const isActive = conv.id === activeId;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition select-none ${
                  isActive
                    ? 'bg-blue-50 border border-blue-300 text-blue-700 font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0 pr-1">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="truncate text-xs block w-full" title={conv.title}>
                    {conv.title}
                  </span>
                </div>

                <div className="flex items-center shrink-0 ml-1">
                  <button
                    onClick={(e) => handleDeleteConv(e, conv.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 hover:bg-red-50 rounded transition"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* RIGHT COLUMN: Chat Area with Stitch Copilot Design                   */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col bg-slate-50/50">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-purple-50 border border-purple-200">
              <Bot className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-sm text-slate-900">
                Statistical AI Copilot
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                <span className="text-[10px] font-mono text-slate-600">
                  Online • MoSPI Guidelines Grounded
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 shadow-sm ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <FormattedMessage text={msg.text} isUser={isUser} />
                  <div className={`mt-2 text-[10px] font-mono ${isUser ? 'text-blue-100 text-right' : 'text-slate-500'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-none flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span className="text-xs text-slate-600 font-mono">Synthesizing statistical rationale...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestion Chips */}
        {messages.length <= 3 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {suggestedPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="text-[11px] bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-blue-500 text-slate-700 hover:text-blue-600 transition-all text-left shadow-xs"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input Pill */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-300 focus-within:border-blue-500 transition-colors"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about SNA 2008, Sampling, Python/R, or iGOT courses..."
              className="flex-1 bg-transparent px-4 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl disabled:opacity-40 shadow-sm transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
