import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, User, Plus, MessageSquare, Trash2, Clock, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Helper component to render clean structured Markdown responses
const FormattedMessage = ({ text, isUser }) => {
  if (isUser) {
    return <div className="text-white font-normal text-sm leading-relaxed">{text}</div>;
  }

  const lines = text.split('\n');

  return (
    <div className="space-y-2 text-sm text-gray-800 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        if (trimmed === '---' || trimmed === '***') {
          return <hr key={idx} className="my-3 border-gray-200" />;
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="font-semibold text-gray-900 text-sm mt-3 mb-1 border-b border-gray-100 pb-1">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="font-bold text-gray-900 text-base mt-3 mb-1">
              {trimmed.replace('## ', '')}
            </h2>
          );
        }

        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const content = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start space-x-2 pl-1 my-0.5">
              <span className="text-blue-500 font-bold leading-tight mt-0.5">•</span>
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start space-x-2 pl-1 my-0.5">
              <span className="font-semibold text-blue-600 text-xs min-w-4">{numMatch[1]}.</span>
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(numMatch[2]) }} />
            </div>
          );
        }

        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          if (trimmed.includes('---')) return null;
          const cells = trimmed.split('|').filter(Boolean).map((c) => c.trim());
          return (
            <div key={idx} className="grid grid-cols-3 gap-2 p-1.5 bg-white border border-gray-200 rounded text-xs">
              {cells.map((cell, cIdx) => (
                <div key={cIdx} className="font-medium" dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
              ))}
            </div>
          );
        }

        return (
          <p key={idx} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
        );
      })}
    </div>
  );
};

function formatInline(str) {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
}

const DEFAULT_WELCOME_MSG = {
  sender: 'ai',
  text: 'Namaste! I am your Saksham AI Learning & Capability Assistant. Ask me about official statistical methodologies (SNA 2008, CPI/WPI, Sampling, DPDPA), technical concepts (Docker, Python, SQL), or your personalized iGOT / NSSTA learning pathways.',
  timestamp: 'Just now'
};

const INITIAL_CONVERSATIONS = [
  {
    id: 'conv_docker_01',
    title: 'Docker Containerization Guide',
    updatedAt: Date.now(),
    timeLabel: 'now',
    messages: [
      {
        sender: 'ai',
        text: 'Namaste! I am your Saksham AI Learning & Capability Assistant. Ask me about official statistical methodologies (SNA 2008, CPI/WPI, Sampling, DPDPA), technical concepts (Docker, Python, SQL), or your personalized iGOT / NSSTA learning pathways.',
        timestamp: '02:00 PM'
      },
      {
        sender: 'user',
        text: 'Explain how Docker containerization works',
        timestamp: '02:05 PM'
      },
      {
        sender: 'ai',
        text: `**Docker containerization** is a lightweight virtualization technology that packages an application along with all its required dependencies, libraries, configuration files, and runtime environment into a single, standardized unit called a **container**.

This ensures that applications run consistently and reliably across different computing environments, from a data analyst's local workstation to cloud-based statistical servers.

---

### Core Components of Docker Architecture

1. **Dockerfile:** A declarative text document containing sequential instructions used to build a Docker image (acts as the blueprint).
2. **Docker Image:** An immutable, read-only executable package containing application code, runtimes, system tools, and configuration layers.
3. **Docker Container:** A runnable, isolated instance of a Docker image in memory.
4. **Docker Daemon (\`dockerd\`):** The persistent background service on the host OS that manages images, containers, networks, and storage volumes.

---

### How Docker Works Under the Hood

Unlike traditional Virtual Machines (VMs) that require a full Guest Operating System and Hypervisor, Docker utilizes **OS-level virtualization**. It directly leverages the host machine's OS kernel using primary Linux kernel primitives:

* **Namespaces (Isolation):** Provides segregated workspaces for Process IDs (\`pid\`), Networking (\`net\`), Mount points (\`mnt\`), and Inter-Process Communication (\`ipc\`).
* **Control Groups / cgroups (Resource Constraints):** Restricts and monitors physical hardware usage (CPU, RAM, Disk I/O, Network bandwidth) per container.
* **Union File Systems (Layering):** Employs layered storage drivers (e.g., \`Overlay2\`) so multiple containers share underlying read-only base layers without duplicating disk footprint.

---

### Relevance to Statistical Data Pipelines & MoSPI Workflows

* **Environment Reproducibility:** Eliminates discrepancies between local test scripts and server production runs across Python, R, and SQL pipelines.
* **Microservices Architecture:** Isolates distinct survey stages (data ingestion, validation, imputation, microdata tabulation) into modular, independently maintainable units.
* **Scalability:** Integrates seamlessly with container orchestration systems (like Kubernetes) for high-throughput batch processing of national survey rounds.

---

### Recommended Learning Pathways

* **iGOT Karmayogi:** *"Introduction to Docker & Containerization for Data Pipelines"* under the Data Engineering Track.
* **NSSTA Training Calendar:** Specialized residential workshops on Cloud Infrastructure and Modern Statistical Computing.`,
        timestamp: '02:06 PM'
      }
    ]
  },
  {
    id: 'conv_sna_02',
    title: 'SNA 2008 GVA Methodology',
    updatedAt: Date.now() - 86400000 * 2,
    timeLabel: '2d',
    messages: [
      {
        sender: 'ai',
        text: 'Namaste! How can I assist with your National Accounts questions?',
        timestamp: '10:15 AM'
      },
      {
        sender: 'user',
        text: 'How is Gross Value Added (GVA) calculated at basic prices?',
        timestamp: '10:16 AM'
      },
      {
        sender: 'ai',
        text: `**Gross Value Added (GVA) at Basic Prices** is the measure of the value of goods and services produced by an economy, less the value of intermediate inputs used up in that production.\n\n### Formula:\n**GVA at Basic Prices = Gross Output at Basic Prices − Intermediate Consumption at Purchasers\' Prices**\n\n### Transition to GDP:\n**GDP at Market Prices = GVA at Basic Prices + Net Product Taxes (Product Taxes − Product Subsidies)**`,
        timestamp: '10:17 AM'
      }
    ]
  },
  {
    id: 'conv_sampling_03',
    title: 'Multi-Stage Stratified Sampling',
    updatedAt: Date.now() - 86400000 * 6,
    timeLabel: '6d',
    messages: [
      {
        sender: 'ai',
        text: 'Namaste! Ready to explore survey sampling and estimation.',
        timestamp: '03:30 PM'
      },
      {
        sender: 'user',
        text: 'What is the rationale for stratifying First Stage Units (FSUs)?',
        timestamp: '03:31 PM'
      },
      {
        sender: 'ai',
        text: `Stratifying **First Stage Units (FSUs)** partitions heterogeneous populations into homogeneous sub-groups (strata). This minimizes within-stratum variance and significantly improves the precision of national survey multipliers.`,
        timestamp: '03:32 PM'
      }
    ]
  }
];

const AiAssistant = () => {
  const { user } = useAuth();
  const listStorageKey = `saksham_conv_list_${user?.id || 'usr_sso_01'}`;
  const activeStorageKey = `saksham_active_conv_id_${user?.id || 'usr_sso_01'}`;

  // Load conversations list
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(listStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not load conversations:', e);
    }
    return INITIAL_CONVERSATIONS;
  });

  // Active conversation ID
  const [activeId, setActiveId] = useState(() => {
    try {
      const savedId = localStorage.getItem(activeStorageKey);
      if (savedId && conversations.some((c) => c.id === savedId)) {
        return savedId;
      }
    } catch (e) {}
    return conversations[0]?.id || 'conv_docker_01';
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
      <div className="w-64 bg-gray-50 text-gray-800 flex flex-col shrink-0 border-r border-gray-200">
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
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => {
            const isActive = conv.id === activeId;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs cursor-pointer transition ${
                  isActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-700 font-semibold shadow-xs'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5 overflow-hidden flex-1 min-w-0 mr-1.5">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="truncate">{conv.title}</span>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <span className={`text-[10px] ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                    {conv.timeLabel || 'now'}
                  </span>
                  <button
                    onClick={(e) => handleDeleteConv(e, conv.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-600 text-gray-400 transition"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-gray-200 text-[11px] text-gray-600 bg-white flex items-center justify-between shrink-0">
          <span className="truncate font-medium">{user?.full_name || 'Statistical Officer'}</span>
          <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-medium">MoSPI</span>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* RIGHT COLUMN: Active Chat Feed & Input Stream                        */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        {/* Active Conversation Top Bar */}
        <div className="flex items-center justify-between bg-white px-5 py-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 truncate max-w-md">
                {activeConv?.title || 'Saksham AI Assistant'}
              </h2>
              <p className="text-[11px] text-gray-500">Official Statistical System AI Assistant</p>
            </div>
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
