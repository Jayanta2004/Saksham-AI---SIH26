import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Database,
  Lock,
  Sparkles,
  Download,
  Terminal,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  ChevronRight,
  TrendingUp,
  Building2,
  FileSpreadsheet,
  Loader2,
  Info
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SyntheticDataStudio() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [schemas, setSchemas] = useState([]);
  const [selectedSchemaId, setSelectedSchemaId] = useState('hces');
  const [sampleSize, setSampleSize] = useState(40);
  const [epsilon, setEpsilon] = useState(0.5);

  const [generating, setGenerating] = useState(false);
  const [syntheticResult, setSyntheticResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPython, setCopiedPython] = useState(false);

  // Fetch schemas on mount
  useEffect(() => {
    let isMounted = true;
    const fetchSchemas = async () => {
      try {
        const res = await api.get('/api/synthetic/schemas');
        if (isMounted && res.data?.schemas) {
          setSchemas(res.data.schemas);
          setSelectedSchemaId(res.data.schemas[0]?.id || 'hces');
        }
      } catch (err) {
        console.error('Failed to load schemas:', err);
      }
    };
    fetchSchemas();
    return () => { isMounted = false; };
  }, []);

  const activeSchema = schemas.find(s => s.id === selectedSchemaId) || schemas[0];

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/api/synthetic/generate', {
        schema_id: selectedSchemaId,
        sample_size: sampleSize,
        epsilon: parseFloat(epsilon)
      });
      if (res.data?.success) {
        setSyntheticResult(res.data);
      }
    } catch (err) {
      console.error('Failed to generate synthetic data:', err);
    } finally {
      setGenerating(false);
    }
  };

  // Generate initial dataset when schemas load
  useEffect(() => {
    if (schemas.length > 0 && !syntheticResult) {
      handleGenerate();
    }
  }, [schemas]);

  const handleSchemaSelect = (schemaId) => {
    setSelectedSchemaId(schemaId);
  };

  // Export CSV
  const handleDownloadCsv = () => {
    if (!syntheticResult?.records?.length) return;
    const records = syntheticResult.records;
    const headers = Object.keys(records[0]).join(',');
    const rows = records.map(r => Object.values(r).map(v => typeof v === 'string' && v.includes(',') ? `"${v}"` : v).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `synthetic_${selectedSchemaId}_dpdpa_eps${epsilon}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Send to Python Sandbox
  const handleSendToPlayground = () => {
    if (!syntheticResult?.records?.length) return;
    const pythonCode = `# Synthetic ${activeSchema?.name || 'Dataset'} (DPDPA 2023 Compliant)
# Epsilon Privacy Budget: ${epsilon} | Records: ${syntheticResult.records.length}
import pandas as pd
import numpy as np

data = ${JSON.stringify(syntheticResult.records, null, 2)}

df = pd.DataFrame(data)
print("=== Synthetic Microdata Shape & Head ===")
print(df.info())
print("\n=== First 5 Records ===")
print(df.head())

print("\n=== Summary Statistics ===")
print(df.describe())
`;

    localStorage.setItem('saksham_playground_custom_code', pythonCode);
    navigate('/playground');
  };

  // Filter records
  const filteredRecords = syntheticResult?.records?.filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return Object.values(r).some(val => String(val).toLowerCase().includes(q));
  }) || [];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Banner (High-Contrast Light Theme) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50/90 via-white to-indigo-50/90 border border-emerald-200 p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
              <Shield className="w-3.5 h-3.5 text-emerald-700" />
              DPDPA 2023 & Section 3 Collection of Statistics Act
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-900 border border-indigo-200">
              <Lock className="w-3.5 h-3.5 text-indigo-700" />
              Laplace Differential Privacy
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Differential-Privacy Synthetic Microdata Studio
          </h1>
          <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
            Generate mathematical, privacy-preserving synthetic survey datasets for official statistical training, Python exploratory modeling, and AI validation without risking citizen confidentiality.
          </p>
        </div>
      </div>

      {/* Top Configuration & Parameters Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Survey Schema & Differential Privacy Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Select an official MoSPI survey schema and calibrate the privacy-utility budget (&epsilon;).
            </p>
          </div>
          {syntheticResult?.meta && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Statistical Fidelity: {syntheticResult.meta.distribution_fidelity_score}
              </span>
            </div>
          )}
        </div>

        {/* 1. Schema Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {schemas.map(s => (
            <button
              key={s.id}
              onClick={() => handleSchemaSelect(s.id)}
              className={`p-3.5 rounded-xl border text-left transition-all space-y-1.5 ${
                selectedSchemaId === s.id
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 truncate">{s.name.split('(')[0]}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {s.id.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{s.description}</p>
              <span className="text-[10px] text-indigo-700 font-semibold block">{s.privacy_target}</span>
            </button>
          ))}
        </div>

        {/* 2. Generation Controls (Sample Size, Epsilon, Action Button) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
          {/* Sample Size */}
          <div className="md:col-span-4 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">Sample Records (N)</span>
              <span className="font-bold text-indigo-700">{sampleSize} records</span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              step="10"
              value={sampleSize}
              onChange={e => setSampleSize(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Optimized for in-browser client analytics</span>
          </div>

          {/* Privacy Budget Epsilon */}
          <div className="md:col-span-5 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">Privacy Budget (&epsilon; Epsilon)</span>
              <span className="font-bold text-indigo-700">
                &epsilon; = {epsilon} ({epsilon <= 0.3 ? 'Strict Privacy' : epsilon <= 1.0 ? 'Balanced' : 'High Utility'})
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={epsilon}
              onChange={e => setEpsilon(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0.1 (High Laplace Noise)</span>
              <span>2.0 (Lower Noise / Higher Fidelity)</span>
            </div>
          </div>

          {/* Generate Button */}
          <div className="md:col-span-3">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-60"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Applying Laplace Noise...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Synthesize Microdata
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Results Studio & Interactive Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
        
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search across records..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56"
              />
            </div>
            <span className="text-xs text-slate-500">
              Showing <strong>{filteredRecords.length}</strong> of {syntheticResult?.records?.length || 0} synthetic rows
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              disabled={!syntheticResult?.records?.length}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download CSV</span>
            </button>

            <button
              onClick={handleSendToPlayground}
              disabled={!syntheticResult?.records?.length}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all disabled:opacity-50"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Analyze in Python Playground</span>
            </button>
          </div>
        </div>

        {/* Data Grid Table */}
        {syntheticResult?.records?.length ? (
          <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-12 text-center text-slate-400 font-mono">#</th>
                  {Object.keys(syntheticResult.records[0]).map(key => (
                    <th key={key} className="p-3 uppercase text-[10px] tracking-wider text-slate-700">
                      {key.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-indigo-50/40' : 'bg-slate-50/50 hover:bg-indigo-50/40'}>
                    <td className="p-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                    {Object.entries(row).map(([k, val]) => (
                      <td key={k} className="p-3">
                        {typeof val === 'number' ? (
                          <span className="font-mono font-semibold text-slate-900">
                            {val.toLocaleString()}
                          </span>
                        ) : k.includes('id') ? (
                          <span className="font-mono text-[11px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            {val}
                          </span>
                        ) : (
                          <span className="text-slate-800 font-medium">
                            {val}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
            <p className="text-xs">Generating mathematical synthetic dataset...</p>
          </div>
        )}

        {/* Statistical Guarantee Audit Card */}
        {syntheticResult?.meta && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-700">
                <strong>Differential Privacy Verification:</strong> Generated with Laplace scale parameter &beta; = <strong>{syntheticResult.meta.laplace_mechanism_scale}</strong>. Zero re-identification risk against external registry linkage.
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px] shrink-0">
              <span>Timestamp: {new Date(syntheticResult.meta.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
