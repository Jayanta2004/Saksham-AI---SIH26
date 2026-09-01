import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, User, Plus, MessageSquare, Trash2, Clock, ChevronRight } from 'lucide-react';
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
    return <div className="text-white font-normal text-sm leading-relaxed">{text}</div>;
  }

  const lines = (text || '').split('\n');

  return (
    <div className="space-y-2 text-sm text-gray-800 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        if (trimmed === '---' || trimmed === '***') {
          return <hr key={idx} className="my-2.5 border-gray-200" />;
        }

        // Mathematical Display Formula Block ($$...$$)
        if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
          const cleanFormula = cleanMathExpression(trimmed);
          return (
            <div key={idx} className="my-2.5 p-3 bg-blue-50/80 border border-blue-200 rounded-lg text-xs font-mono text-blue-950 font-semibold shadow-xs overflow-x-auto">
              <span className="text-[10px] uppercase font-bold text-blue-600 block mb-1 tracking-wider">Formula:</span>
              {cleanFormula}
            </div>
          );
        }

        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="font-bold text-gray-900 text-base mt-3 mb-1 border-b border-gray-100 pb-1">
              {trimmed.replace('# ', '')}
            </h1>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="font-bold text-gray-900 text-sm mt-3 mb-1 text-blue-900">
              {trimmed.replace('## ', '')}
            </h2>
          );
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="font-bold text-gray-900 text-xs uppercase tracking-wider mt-2.5 mb-1 text-slate-800">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        if (trimmed.startsWith('#### ')) {
          return (
            <h4 key={idx} className="font-semibold text-blue-700 text-xs mt-2 mb-0.5">
              {trimmed.replace('#### ', '')}
            </h4>
          );
        }

        if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
          const content = trimmed.replace(/^[\*\-•]\s+/, '');
          return (
            <div key={idx} className="flex items-start space-x-2 pl-1.5 my-0.5">
              <span className="text-blue-500 font-bold leading-tight mt-0.5 shrink-0">•</span>
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start space-x-2 pl-1.5 my-0.5">
              <span className="font-bold text-blue-600 text-xs min-w-4 shrink-0">{numMatch[1]}.</span>
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(numMatch[2]) }} />
            </div>
          );
        }

        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          if (trimmed.includes('---')) return null;
          const cells = trimmed.split('|').filter(Boolean).map((c) => c.trim());
          return (
            <div key={idx} className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs my-1">
              {cells.map((cell, cIdx) => (
                <div key={cIdx} className="font-medium text-gray-800" dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
              ))}
            </div>
          );
        }

        return (
          <p key={idx} className="text-xs text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
        );
      })}
    </div>
  );
};

function formatInline(str) {
  // Replace inline LaTeX math ($...$) cleanly
  let formatted = str.replace(/\$([^$]+)\$/g, (match, expr) => {
    return `<span class="font-mono font-semibold text-blue-900 bg-blue-50 px-1 py-0.5 rounded text-[11px]">${cleanMathExpression(expr)}</span>`;
  });

  return formatted
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
}

const DEFAULT_WELCOME_MSG = {
  sender: 'ai',
  text: 'Namaste! I am your Saksham AI Learning & Capability Assistant. Ask me about official statistical methodologies (SNA 2008, CPI/WPI, Sampling, DPDPA), technical concepts (Docker, Python, SQL), or your personalized iGOT / NSSTA learning pathways.',
  timestamp: 'Just now'
};

const AiAssistant = () => {
  const { user } = useAuth();
  const userId = user?.id || user?.email || 'guest_user';
  const listStorageKey = `saksham_conv_list_${userId}`;
  const activeStorageKey = `saksham_active_conv_id_${userId}`;

  const userName = user?.full_name ? user.full_name.split(' ')[0] : 'Officer';
  const userDept = user?.department || 'Ministry of Statistics & Programme Implementation';
  const isDemoPersona = userId === 'usr_sso_01';

  const createInitialConversations = () => [
    {
      id: `conv_init_${userId}`,
      title: 'Statistical Guidance & Upskilling',
      updatedAt: Date.now(),
      timeLabel: 'now',
      messages: [
        {
          sender: 'ai',
          text: `Namaste **${user?.full_name || 'Officer'}**! I am your Saksham AI Learning & Capability Assistant for the **${userDept}**.\n\nFeel free to ask me about:\n* **Official Methodologies:** SNA 2008 GDP/GVA compilation, Survey Sampling & Multipliers, Price Indices.\n* **Computational Tools:** Python, R, SQL, Survey Anomaly Detection, Docker.\n* **Data Governance:** DPDPA 2023 compliance and statistical confidentiality.\n* **Learning Recommendations:** Relevant courses on iGOT Karmayogi and NSSTA residential workshops.`,
          timestamp: 'Just now'
        }
      ]
    }
  ];

  // Load conversations list
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(listStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If a new non-demo user has legacy seeded demo conversations in localStorage, reset cleanly
          if (!isDemoPersona && parsed.some((c) => c.id === 'conv_docker_01' || c.id === 'conv_sna_02')) {
            localStorage.removeItem(listStorageKey);
            localStorage.removeItem(activeStorageKey);
            return createInitialConversations();
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load conversations:', e);
    }
    return createInitialConversations();
  });

  // Active conversation ID
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

  // Sync conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(listStorageKey, JSON.stringify(conversations));
      localStorage.setItem(activeStorageKey, activeId);
    } catch (e) {
      console.warn('Could not persist conversations:', e);
    }
  }, [conversations, activeId, listStorageKey, activeStorageKey]);

  // Current active conversation object
  const activeConv = conversations.find((c) => c.id === activeId) || conversations[0];
  const messages = activeConv ? activeConv.messages : [DEFAULT_WELCOME_MSG];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Create New Conversation
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

  // Delete Conversation
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
    'Explain my top statistical skill gaps',
    'Recommend iGOT courses for Python and survey data',
    'What are the key provisions of DPDPA 2023 for survey microdata?'
  ];

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading || !activeConv) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user', text: query, timestamp: timeStr };

    // Derive or keep conversation title
    let newTitle = activeConv.title;
    if (activeConv.title === 'New Conversation' || activeConv.messages.length <= 1) {
      newTitle = query.length > 32 ? `${query.slice(0, 32)}...` : query;
    }

    const updatedMessages = [...activeConv.messages, userMsg];

    // Optimistically update conversation
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
        text: `Regarding "${query}":\n\nThis concept is key to modern statistical and data engineering workflows. Reviewing related modules on iGOT Karmayogi is recommended.`,
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
    <div className="flex h-[calc(100vh-130px)] max-w-6xl mx-auto rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* -------------------------------------------------------------------- */}
      {/* LEFT COLUMN: Multi-Session Chat History Sidebar (Light Theme)        */}
      {/* -------------------------------------------------------------------- */}
      <div className="w-64 md:w-72 bg-gray-50 text-gray-800 flex flex-col shrink-0 border-r border-gray-200">
        {/* Header / New Chat Button */}
        <div className="p-3 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Conversations</span>
            <button
              onClick={handleNewChat}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
              title="Start New Conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
          {conversations.map((conv) => {
            const isActive = conv.id === activeId;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-xs cursor-pointer transition text-left select-none ${
                  isActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-700 font-semibold shadow-xs'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5 overflow-hidden flex-1 min-w-0 pr-1 text-left">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="truncate text-left text-xs block w-full" title={conv.title}>
                    {conv.title}
                  </span>
                </div>

                <div className="flex items-center shrink-0 ml-1">
                  <button
                    onClick={(e) => handleDeleteConv(e, conv.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 hover:bg-red-50 rounded text-gray-400 transition"
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
      {/* RIGHT COLUMN: Active Chat Feed & Input Stream                        */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        {/* Active Conversation Top Bar */}
        <div className="flex items-center justify-between bg-white px-5 py-3 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 truncate max-w-md">
              {activeConv?.title || 'Saksham AI Assistant'}
            </h2>
            <p className="text-[11px] text-gray-500">Official Statistical System Assistant</p>
          </div>

          {/* Quick Prompts */}
          <div className="hidden lg:flex items-center space-x-2">
            {suggestedPrompts.slice(0, 2).map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                disabled={loading}
                className="px-2.5 py-1 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 text-gray-600 rounded-full text-xs font-normal transition"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="flex flex-col space-y-1 max-w-2xl">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-normal'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <FormattedMessage text={msg.text} isUser={msg.sender === 'user'} />
                </div>
                {msg.timestamp && (
                  <div
                    className={`flex items-center text-[10px] text-gray-400 px-1 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <Clock className="w-2.5 h-2.5 mr-1" />
                    <span>{msg.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-2xl flex items-center space-x-2 text-sm text-gray-500 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Saksham AI is generating response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-gray-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about statistics, Docker, Python, learning pathways..."
              disabled={loading}
              className="flex-1 px-3 py-1.5 text-sm bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center space-x-1.5 transition shadow-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
