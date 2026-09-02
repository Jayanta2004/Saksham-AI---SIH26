import React, { useState, useEffect } from 'react';
import { Award, Download, Calendar, CheckCircle, X, Shield, Loader2, ArrowRight } from 'lucide-react';
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
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    // Background fill
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1200, 850);

    // Inner paper fill
    ctx.fillStyle = '#fafbfd';
    ctx.fillRect(30, 30, 1140, 790);

    // Double borders
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, 1120, 770);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.strokeRect(52, 52, 1096, 746);

    // Corner flourishes
    const drawFlourish = (x, y) => {
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    };
    drawFlourish(65, 65);
    drawFlourish(1135, 65);
    drawFlourish(65, 785);
    drawFlourish(1135, 785);

    // Government Header
    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 24px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION', 600, 135);

    ctx.fillStyle = '#475569';
    ctx.font = '600 15px "Inter", sans-serif';
    ctx.fillText('GOVERNMENT OF INDIA • NATIONAL STATISTICAL SYSTEMS TRAINING ACADEMY (NSSTA)', 600, 165);

    // Title Accent
    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 18px "Outfit", sans-serif';
    ctx.fillText('OFFICIAL COMPETENCY CERTIFICATE', 600, 215);

    // Certification Body
    ctx.fillStyle = '#64748b';
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillText('This is to certify that', 600, 265);

    // Recipient Name
    const name = cert.recipient_name || learnerName;
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 34px "Outfit", sans-serif';
    ctx.fillText(name, 600, 315);

    // Name Underline
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 330);
    ctx.lineTo(850, 330);
    ctx.stroke();

    // Designation
    const desig = cert.recipient_designation || designation;
    ctx.fillStyle = '#475569';
    ctx.font = '500 16px "Inter", sans-serif';
    ctx.fillText(`(${desig})`, 600, 360);

    // Statement
    ctx.fillStyle = '#334155';
    ctx.font = '15px "Inter", sans-serif';
    ctx.fillText('has successfully satisfied all evaluation benchmarks and demonstrated verified competency in', 600, 410);

    // Course Title
    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 26px "Outfit", sans-serif';
    ctx.fillText(cert.title, 600, 460);

    // Score Badge Box
    const score = cert.score_percentage || cert.score || 85;
    ctx.fillStyle = '#ecfdf5';
    ctx.fillRect(400, 500, 400, 45);
    ctx.strokeStyle = '#a7f3d0';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(400, 500, 400, 45);

    ctx.fillStyle = '#047857';
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.fillText(`VERIFIED SCORE: ${score}% • STATUS: ACTIVE & AUTHENTICATED`, 600, 528);

    // Footer Divider
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 680);
    ctx.lineTo(1100, 680);
    ctx.stroke();

    // Issuer, Date, Credential ID
    ctx.textAlign = 'left';
    ctx.fillStyle = '#475569';
    ctx.font = '14px "Inter", sans-serif';

    ctx.fillText(`Issuer: ${cert.issuer || 'NSSTA Academy'}`, 120, 720);

    ctx.textAlign = 'center';
    ctx.fillText(`Issue Date: ${cert.issue_date || cert.issueDate || '2026-09-01'}`, 600, 720);

    ctx.textAlign = 'right';
    ctx.fillText(`Credential ID: ${cert.credential_id || cert.credentialId}`, 1080, 720);

    // Digital Seal Watermark
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.fillText('DIGITALLY SIGNED & VERIFIED BY SAKSHAM AI GOVERNANCE PLATFORM', 600, 765);

    // Convert Canvas to PNG image blob & trigger download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = `${(cert.credential_id || cert.credentialId || 'Certificate').replace(/[^a-zA-Z0-9_-]/g, '_')}_Certificate.png`;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      setShowToast(`Downloaded Image Certificate (.png)`);
      setTimeout(() => setShowToast(null), 4000);
    }, 'image/png');
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
                  <span>Download Image (PNG)</span>
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
                <span>Download Image (PNG)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
