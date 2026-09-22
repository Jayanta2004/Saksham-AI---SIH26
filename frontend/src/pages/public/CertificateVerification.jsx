import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  Calendar,
  User,
  Building2,
  Award,
  Hash,
  Copy,
  Check,
  Download,
  Share2,
  Printer,
  ExternalLink,
  ArrowLeft,
  Loader2,
  FileCode,
  QrCode,
  Lock,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';

export default function CertificateVerification() {
  const { credentialId: paramId } = useParams();
  const navigate = useNavigate();

  const [searchId, setSearchId] = useState(paramId || 'SAKSHAM-NAD-SNA001-101');
  const [activeId, setActiveId] = useState(paramId || 'SAKSHAM-NAD-SNA001-101');
  const [loading, setLoading] = useState(true);
  const [certData, setCertData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier' | 'w3c' | 'audit'
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Sync state if URL param changes
  useEffect(() => {
    if (paramId) {
      setSearchId(paramId);
      setActiveId(paramId);
    }
  }, [paramId]);

  // Fetch certificate verification from API
  useEffect(() => {
    let isMounted = true;
    const verifyCredential = async () => {
      if (!activeId) return;
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/api/certificates/verify/${encodeURIComponent(activeId)}`);
        if (isMounted) {
          if (response.data?.valid && response.data?.credential) {
            setCertData(response.data.credential);
          } else {
            setError(response.data?.error || 'Credential verification failed.');
            setCertData(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[Verification] Fetch error:', err);
          setError(
            err.response?.data?.error ||
              `No valid credential found with ID "${activeId}". Please verify the identifier.`
          );
          setCertData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifyCredential();
    return () => {
      isMounted = false;
    };
  }, [activeId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const clean = searchId.trim();
    setActiveId(clean);
    navigate(`/verify/${encodeURIComponent(clean)}`, { replace: true });
  };

  const selectQuickSample = (sampleId) => {
    setSearchId(sampleId);
    setActiveId(sampleId);
    navigate(`/verify/${encodeURIComponent(sampleId)}`, { replace: true });
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2500);
    } else if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } else if (type === 'json') {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2500);
    }
  };

  const handleDownloadW3C = () => {
    if (!certData?.w3c_payload) return;
    const blob = new Blob([JSON.stringify(certData.w3c_payload, null, 2)], {
      type: 'application/ld+json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${certData.credential_id}_W3C_Credential.jsonld`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Government Emblem Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Return to Saksham AI"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-700 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-headline font-bold text-sm text-slate-900 leading-tight">
                  Saksham AI Credential Registry
                </div>
                <div className="text-[10px] text-slate-500 font-medium leading-tight">
                  Ministry of Statistics &amp; Programme Implementation (MoSPI) • Govt. of India
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleCopy(window.location.href, 'link')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Verification'}</span>
            </button>
            <Link
              to="/login"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Search & Quick Samples Card */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3.5 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="font-headline font-bold text-lg text-slate-900">
                Official Credential Verification &amp; Ledger Lookup
              </h1>
              <p className="text-xs text-slate-500">
                Validate cryptographic authenticity of competency certificates issued under the MoSPI Statistical Framework.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Blockchain / Ledger Online
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Credential ID (e.g. SAKSHAM-NAD-SNA001-101)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition"
            >
              <Search className="w-4 h-4" />
              <span>Verify</span>
            </button>
          </form>

          {/* Quick Demo Samples */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Sample Credentials:</span>
            {[
              { id: 'SAKSHAM-NAD-SNA001-101', label: 'SNA 2008 & GVA (NAD)' },
              { id: 'SAKSHAM-SDRD-SMP004-102', label: 'Survey Sampling (SDRD)' },
              { id: 'SAKSHAM-DPDP-SEC003-103', label: 'DPDPA 2023 Compliance' },
            ].map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => selectQuickSample(sample.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition ${
                  activeId === sample.id
                    ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-3 shadow-xs">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <div className="font-headline font-bold text-slate-900 text-base">Verifying Cryptographic Ledger...</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Connecting to Saksham AI Central Credential Registry and checking tamper-evident signatures.
            </p>
          </div>
        )}

        {/* Error / Not Found State */}
        {!loading && error && (
          <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h2 className="font-headline text-lg font-bold text-slate-900">Credential Not Found</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{error}</p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => selectQuickSample('SAKSHAM-NAD-SNA001-101')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                Load Verified Sample Credential
              </button>
            </div>
          </div>
        )}

        {/* Verified Credential Presentation */}
        {!loading && certData && (
          <div className="space-y-6">
            {/* Status Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-start sm:items-center gap-4 z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0 shadow-inner">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 border border-white/30">
                      Authenticity Confirmed
                    </span>
                    <span className="text-xs text-emerald-100 flex items-center gap-1 font-mono">
                      <Lock className="w-3 h-3" /> SHA-256 Validated
                    </span>
                  </div>
                  <h2 className="font-headline text-xl sm:text-2xl font-bold mt-1 tracking-tight">
                    Official MoSPI Verified Credential
                  </h2>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Issued under the National Statistical Systems Training Academy (NSSTA) &amp; MoSPI Competency Framework.
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-6 shrink-0 z-10">
                <div className="text-left sm:text-right">
                  <div className="text-[11px] text-emerald-100 uppercase tracking-wider">Score Achieved</div>
                  <div className="text-2xl font-extrabold font-mono leading-tight">
                    {certData.score_percentage}%
                  </div>
                </div>
                <div className="text-right sm:mt-1">
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-800/60 text-[10px] font-semibold text-emerald-200">
                    Grade: Distinction
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 print:hidden">
              <button
                onClick={() => setActiveTab('dossier')}
                className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition ${
                  activeTab === 'dossier'
                    ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Credential Dossier</span>
              </button>
              <button
                onClick={() => setActiveTab('w3c')}
                className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition ${
                  activeTab === 'w3c'
                    ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>W3C Verifiable Credential (JSON-LD)</span>
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition ${
                  activeTab === 'audit'
                    ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Cryptographic Proof &amp; Audit Trail</span>
              </button>
            </div>

            {/* TAB 1: Credential Dossier */}
            {activeTab === 'dossier' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                {/* Certificate Formal Certificate View (Print-Ready) */}
                <div className="p-8 sm:p-12 relative bg-gradient-to-b from-white to-slate-50/50">
                  <div className="border-4 border-double border-blue-900/30 rounded-2xl p-6 sm:p-10 text-center space-y-6 bg-white shadow-xs relative">
                    {/* Watermark Emblem */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                      <Award className="w-96 h-96 text-blue-900" />
                    </div>

                    {/* Government Header */}
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Official Digital Credential
                      </div>
                      <h3 className="font-headline text-lg sm:text-xl font-extrabold text-blue-950 uppercase tracking-wide">
                        Ministry of Statistics &amp; Programme Implementation
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium">
                        Government of India • National Statistical Systems Training Academy (NSSTA)
                      </p>
                    </div>

                    <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />

                    {/* Recipient Details */}
                    <div className="space-y-2 py-2">
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                        This is to certify that
                      </p>
                      <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {certData.recipient_name}
                      </h2>
                      <p className="text-xs sm:text-sm font-semibold text-slate-600">
                        {certData.recipient_designation}
                      </p>
                      <p className="text-xs text-slate-500">
                        {certData.department}
                      </p>
                    </div>

                    {/* Competency Statement */}
                    <div className="max-w-xl mx-auto space-y-2">
                      <p className="text-xs text-slate-500 leading-relaxed">
                        has successfully cleared the national diagnostic benchmark and proved validated proficiency in
                      </p>
                      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="font-headline text-base sm:text-lg font-bold text-blue-950">
                          {certData.title}
                        </div>
                      </div>
                    </div>

                    {/* Skills Covered */}
                    {certData.skills_covered && certData.skills_covered.length > 0 && (
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Competencies Validated:
                        </span>
                        {certData.skills_covered.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Seal & QR Code Footer Grid */}
                    <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-left text-xs">
                      <div className="space-y-1">
                        <div className="text-slate-400 text-[11px] uppercase font-semibold">Credential ID</div>
                        <div className="font-mono text-xs font-bold text-blue-700 break-all">
                          {certData.credential_id}
                        </div>
                        <div className="text-slate-400 text-[11px] uppercase font-semibold pt-2">Issue Date</div>
                        <div className="font-mono text-xs text-slate-700">{certData.issue_date}</div>
                      </div>

                      <div className="flex flex-col items-center justify-center text-center space-y-1.5">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                            window.location.href
                          )}`}
                          alt="Verification QR Code"
                          className="w-20 h-20 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs"
                        />
                        <span className="text-[10px] text-slate-400 font-mono">Scan to Re-verify</span>
                      </div>

                      <div className="text-left sm:text-right space-y-1">
                        <div className="text-slate-400 text-[11px] uppercase font-semibold">Issuing Body</div>
                        <div className="font-semibold text-slate-800 text-xs">
                          {certData.issuer}
                        </div>
                        <div className="text-slate-400 text-[11px] uppercase font-semibold pt-2">Ledger Status</div>
                        <div className="inline-flex items-center gap-1 font-semibold text-emerald-700 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{certData.status || 'Verified & Active'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print and Export Actions */}
                <div className="p-5 bg-slate-50 flex flex-wrap items-center justify-between gap-3 print:hidden">
                  <div className="text-xs text-slate-500 font-mono">
                    SHA-256: <span className="font-semibold text-slate-700">{certData.sha256_hash?.slice(0, 24)}...</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handlePrint}
                      className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Certificate</span>
                    </button>
                    <button
                      onClick={handleDownloadW3C}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export W3C Credential</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: W3C Verifiable Credential */}
            {activeTab === 'w3c' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-headline font-bold text-base text-slate-900">
                      W3C Verifiable Credential Standard Representation
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standardized cryptographic JSON-LD schema conforming to W3C Verifiable Credentials Data Model v1.1.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(JSON.stringify(certData.w3c_payload, null, 2), 'json')}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedJson ? 'Copied!' : 'Copy JSON-LD'}</span>
                    </button>
                    <button
                      onClick={handleDownloadW3C}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .jsonld</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 text-emerald-400 p-5 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed max-h-[500px]">
                  <pre>{JSON.stringify(certData.w3c_payload, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* TAB 3: Cryptographic Proof & Audit Trail */}
            {activeTab === 'audit' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-headline font-bold text-base text-slate-900">
                    Cryptographic Integrity &amp; Audit Trail
                  </h3>
                  <p className="text-xs text-slate-500">
                    Every certificate is cryptographically hashed with SHA-256 and bound to the recipient's institutional ID.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      SHA-256 Digital Fingerprint
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-800 break-all select-all flex items-start justify-between gap-2">
                      <span>{certData.sha256_hash}</span>
                      <button
                        onClick={() => handleCopy(certData.sha256_hash, 'hash')}
                        className="text-slate-400 hover:text-slate-700 p-1 shrink-0"
                        title="Copy Hash"
                      >
                        {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Calculated from Credential ID + Recipient Full Name + Validated Benchmark Score + Timestamp.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Decentralized Identifier (DID)
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-800 break-all select-all">
                      {certData.w3c_payload?.credentialSubject?.id || `did:india:cadre:${certData.credential_id.toLowerCase()}`}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Registered in the Indian Statistical Cadre Decentralized Identifier Registry.
                    </p>
                  </div>
                </div>

                {/* Audit Stages Timeline */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-headline font-bold text-sm text-slate-900">
                    Verification Milestones
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        title: 'Assessment Benchmarking Completed',
                        desc: `Recipient attained ${certData.score_percentage}% score satisfying the threshold (≥ 70%).`,
                        time: certData.issue_date,
                        icon: Award,
                      },
                      {
                        title: 'Tamper-Evident SHA-256 Signature Generated',
                        desc: 'Payload cryptographically sealed by MoSPI DIID verification service.',
                        time: certData.issue_date,
                        icon: Lock,
                      },
                      {
                        title: 'Live Ledger Verification Queried',
                        desc: 'Public query executed and verified against active database state.',
                        time: 'Just now (Real-time)',
                        icon: ShieldCheck,
                      },
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <step.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-slate-900">{step.title}</span>
                            <span className="text-[10px] font-mono text-slate-400">{step.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 print:hidden text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 space-y-1">
          <p className="font-medium text-slate-700">
            Saksham AI — Skill Intelligence &amp; Learning Platform for India's Official Statistical System
          </p>
          <p className="text-[11px]">
            Data Informatics &amp; Innovation Division (DIID) &bull; National Statistical Systems Training Academy (NSSTA) &bull; MoSPI
          </p>
        </div>
      </footer>
    </div>
  );
}
