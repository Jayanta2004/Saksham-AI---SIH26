import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  FileSpreadsheet,
  Cpu,
  GraduationCap,
  Globe,
  ArrowRight,
  Shield,
  Smartphone,
  BookOpen,
  Mic,
  SearchCheck,
  Languages,
  GitPullRequest,
  Terminal,
  TrendingUp,
  FileText
} from 'lucide-react';

const OFFICER_ACTIONS = [
  {
    category: 'MoSPI Survey Schedules & Microdata',
    items: [
      { name: 'PLFS Schedule 10.4 — Labour Force & UPSS Protocols', path: '/survey-localizer', icon: Languages, tag: 'Bhashini / CAPI' },
      { name: 'HCES Schedule 1.0 — Household Consumption Outlays & Farmgate Imputation', path: '/scrutiny-studio', icon: SearchCheck, tag: 'Scrutiny Studio' },
      { name: 'ASI Schedule Block E & H — Factory GVA & Accounting Identity Audit', path: '/code-review', icon: GitPullRequest, tag: 'Code Review' },
      { name: 'ASUSE Schedule 2.1 — Unincorporated Enterprises & Mixed Income', path: '/survey-localizer', icon: Languages, tag: 'Field Protocol' },
      { name: 'NIF 8.5.2 & 5.5.2 — SDG National Indicator Framework Mapping', path: '/sdg-tracker', icon: Globe, tag: 'SDG Tracker' },
    ]
  },
  {
    category: 'Interactive Operational Studios & AI Labs',
    items: [
      { name: 'CAPI Respondent Field Simulator (Farmer, Gig Worker, Factory MD)', path: '/capi-simulator', icon: Smartphone, tag: 'Roleplay' },
      { name: 'NSSTA Oral Viva Examination Board (Voice & Audio)', path: '/viva-examiner', icon: Mic, tag: 'Oral Viva' },
      { name: 'Statistical Forensics & Anomaly Detective (Benford Chi-Square)', path: '/scrutiny-studio', icon: SearchCheck, tag: 'Audit Bot' },
      { name: 'Peer Code Review Room — Python & R Pipeline Scrutinizer', path: '/code-review', icon: GitPullRequest, tag: 'Code Review' },
      { name: 'In-Browser Statistical Sandbox (GVA, Laspeyres CPI, Lorenz)', path: '/playground', icon: Terminal, tag: 'Code Sandbox' },
      { name: 'Synthetic Microdata Studio — Gaussian Copula & DPDPA Masking', path: '/synthetic-data', icon: Shield, tag: 'Privacy Engine' },
      { name: 'Automated Policy Brief Studio — Cabinet Memorandums', path: '/brief-generator', icon: FileText, tag: 'Policy Generator' },
    ]
  },
  {
    category: 'iGOT Karmayogi & NSSTA Training',
    items: [
      { name: 'Skill Gap Radar & Cadre Competency Deficit Matrix', path: '/skill-gap', icon: TrendingUp, tag: 'Competencies' },
      { name: 'Personalized Learning Pathways (Targeted iGOT Modules)', path: '/learning-path', icon: BookOpen, tag: 'Pathways' },
      { name: 'iGOT Karmayogi Course Catalog (Search & Enroll)', path: '/courses', icon: BookOpen, tag: 'iGOT Courses' },
      { name: 'NSSTA Greater Noida Residential Training Calendar', path: '/training', icon: GraduationCap, tag: 'NSSTA TPAC' },
      { name: 'AI Diagnostic Assessment Arena & Timed Quizzes', path: '/assessments', icon: Cpu, tag: 'Assessments' },
      { name: 'Adaptive CAT Testing (Computer Adaptive Multi-tier)', path: '/adaptive-test', icon: Cpu, tag: 'Adaptive Engine' },
      { name: 'Verified Competency Certificates & Credentials', path: '/certificates', icon: GraduationCap, tag: 'Credentials' }
    ]
  }
];

export default function OfficerCommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Flatten filtered list
  const filteredActions = OFFICER_ACTIONS.map(cat => ({
    category: cat.category,
    items: cat.items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.tag.toLowerCase().includes(query.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  const flatItems = filteredActions.flatMap(cat => cat.items);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, flatItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + flatItems.length) % Math.max(1, flatItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatItems[selectedIndex]) {
        navigate(flatItems[selectedIndex].path);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  let runningIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Jump to MoSPI schedule, AI simulator, iGOT course, or NSSTA workshop (e.g. 'PLFS', 'CAPI', 'GVA', 'SDG')..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full text-sm bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {flatItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No matching statistical schedule or tool found for "{query}".
            </div>
          ) : (
            filteredActions.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-1">
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {cat.category}
                </div>
                {cat.items.map((item) => {
                  const itemIndex = runningIndex++;
                  const isSelected = itemIndex === selectedIndex;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.path + item.name}
                      onClick={() => {
                        navigate(item.path);
                        onClose();
                      }}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-900 font-semibold shadow-xs border border-indigo-200'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs truncate">{item.name}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 text-[10px] rounded-md font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          {item.tag}
                        </span>
                        <ArrowRight className={`w-3.5 h-3.5 text-slate-400 ${isSelected ? 'text-indigo-600 translate-x-0.5' : ''}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↵ Enter</kbd> to jump</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">ESC</kbd> to close</span>
          </div>
          <span className="font-semibold text-indigo-600">MoSPI Officer Action Palette</span>
        </div>
      </div>
    </div>
  );
}
