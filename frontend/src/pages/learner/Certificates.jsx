import React, { useState, useEffect } from 'react';
import { Award, Download, Calendar, CheckCircle, X, Printer, Shield, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { skillService } from '../../services/skillService';

export default function Certificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showToast, setShowToast] = useState(null);

  const learnerName = user?.full_name || user?.name || 'Arjun Sharma';
  const designation = user?.designation || 'Senior Statistical Officer';

  useEffect(() => {
    let isMounted = true;
    const fetchCerts = async () => {
      setLoading(true);
      try {
        const certs = await skillService.getUserCertificates();
        if (isMounted) {
          setCertificates(certs || []);
        }
      } catch (err) {
        console.warn('Certificate fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCerts();
    return () => { isMounted = false; };
  }, [user]);

  const handleDownload = (cert) => {
    const certHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${cert.title} - Verified Certificate</title>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 40px; text-align: center; border: 12px double #1e3a8a; margin: 20px; background: #fff; }
          h1 { color: #1e3a8a; font-size: 26px; text-transform: uppercase; margin-bottom: 5px; }
          h3 { color: #475569; font-weight: normal; margin-top: 0; font-size: 16px; }
          .recipient { font-size: 28px; font-weight: bold; color: #0f172a; margin: 25px 0; border-bottom: 2px solid #cbd5e1; display: inline-block; padding-bottom: 5px; }
          .body-text { font-size: 15px; color: #334155; line-height: 1.6; max-width: 650px; margin: 0 auto 20px; }
          .meta { font-size: 13px; color: #64748b; margin-top: 40px; display: flex; justify-content: space-around; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          .badge { font-weight: bold; color: #047857; margin-top: 15px; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>Ministry of Statistics & Programme Implementation</h1>
        <h3>Government of India • National Statistical Systems Training Academy (NSSTA)</h3>
        <p class="body-text">This is to certify that</p>
        <div class="recipient">${cert.recipient_name || learnerName}</div>
        <p class="body-text">(${cert.recipient_designation || designation}) has successfully demonstrated statistical competency and satisfied all evaluation benchmarks for</p>
        <h2>${cert.title}</h2>
        <div class="badge">Verified Score: ${cert.score_percentage || cert.score || 75}% • Status: Verified & Active</div>
        <div class="meta">
          <div><strong>Issuer:</strong> ${cert.issuer}</div>
          <div><strong>Issue Date:</strong> ${cert.issue_date || cert.issueDate}</div>
          <div><strong>Credential ID:</strong> ${cert.credential_id || cert.credentialId}</div>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([certHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cert.credential_id || cert.credentialId || 'Certificate'}.html`;
    a.click();
    URL.revokeObjectURL(url);

    setShowToast(`Downloaded Certificate for ${cert.title}`);
    setTimeout(() => setShowToast(null), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-600">Loading verified certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
        <div>
          <h1 className="font-headline text-xl font-bold text-slate-900">Verified Competency Credentials</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Official government certificates earned through passed assessments and completed courses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl font-mono font-semibold">
            {certificates.length} Verified Credential{certificates.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Certificate Grid or Empty State */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certificates.map((cert, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-500/40 transition-all shadow-sm space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-mono">
                    Score: {cert.score_percentage || cert.score || 75}%
                  </span>
                </div>

                <div>
                  <h3 className="font-headline text-base font-bold text-slate-900 leading-snug">{cert.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{cert.issuer}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Issued To:</span>
                    <span className="font-bold text-slate-900">{cert.recipient_name || learnerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Issue Date:</span>
                    <span className="font-mono">{cert.issue_date || cert.issueDate}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-slate-500">Credential ID:</span>
                    <span className="text-blue-600 font-bold">{cert.credential_id || cert.credentialId}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 transition"
                >
                  View Credential
                </button>
                <button
                  onClick={() => handleDownload(cert)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Award className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="font-headline text-base font-bold text-slate-900">No Certificates Earned Yet</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete diagnostic assessments in the Assessment Arena with a score of 70% or higher to earn your verified MoSPI statistical competency certificates.
            </p>
          </div>
          <Link
            to="/assessments"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <span>Take First Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Modal: View Full Certificate */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-headline font-bold text-slate-900 text-sm">Official MoSPI Verified Credential</span>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 border-4 border-double border-blue-600/60 rounded-xl text-center space-y-4 bg-slate-50">
              <h2 className="font-headline text-lg font-bold text-blue-900 uppercase tracking-wide">
                Ministry of Statistics &amp; Programme Implementation
              </h2>
              <p className="text-xs text-slate-500">Government of India • NSSTA Academy</p>

              <div className="py-2">
                <p className="text-xs text-slate-500">This credential certifies that</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{selectedCert.recipient_name || learnerName}</h3>
                <p className="text-xs text-slate-600 mt-0.5">({selectedCert.recipient_designation || designation})</p>
              </div>

              <p className="text-xs text-slate-600 max-w-md mx-auto">
                has satisfied all official competency benchmarks and demonstrated certified proficiency in
              </p>
              <h4 className="font-headline text-base font-bold text-slate-900">{selectedCert.title}</h4>

              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 text-xs text-slate-500 text-left">
                <div>
                  <span className="block font-medium text-slate-700">Credential ID:</span>
                  <span className="font-mono text-[11px] text-blue-600">{selectedCert.credential_id || selectedCert.credentialId}</span>
                </div>
                <div className="text-right">
                  <span className="block font-medium text-slate-700">Issue Date:</span>
                  <span className="font-mono">{selectedCert.issue_date || selectedCert.issueDate}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(selectedCert)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download HTML Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
