import React, { useState } from 'react';
import { Award, Download, ExternalLink, Calendar, CheckCircle, X, Printer, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const certificates = [
  {
    id: 1,
    title: 'Advanced Public Policy & Statistical Modeling',
    issuer: 'National Institute of Public Finance & Policy',
    issueDate: 'November 24, 2024',
    credentialId: 'NIPFP-CERT-2024-8841',
    score: '94%',
    domain: 'Statistical Competencies'
  },
  {
    id: 2,
    title: 'Digital Personal Data Protection (DPDP) Certified Specialist',
    issuer: 'iGOT Karmayogi Bharat & NeGD',
    issueDate: 'July 15, 2024',
    credentialId: 'IGOT-DPDP-2024-1049',
    score: '98%',
    domain: 'Digital Governance'
  },
  {
    id: 3,
    title: 'National Survey Sampling & Variance Estimation Practice',
    issuer: 'Indian Statistical Institute (ISI), Kolkata',
    issueDate: 'February 10, 2024',
    credentialId: 'ISI-KOL-STAT-2024-039',
    score: '91%',
    domain: 'Survey Sampling'
  },
  {
    id: 4,
    title: 'Digital Public Infrastructure & Open API Architecture',
    issuer: 'National Informatics Centre (NIC)',
    issueDate: 'October 05, 2023',
    credentialId: 'NIC-DPI-2023-5592',
    score: '89%',
    domain: 'Technical Architecture'
  }
];

export default function Certificates() {
  const { user } = useAuth();
  const [selectedCert, setSelectedCert] = useState(null);
  const [showToast, setShowToast] = useState(null);

  const learnerName = user?.full_name || user?.name || 'Arjun Sharma';
  const designation = user?.designation || 'Senior Statistical Officer';

  const handleDownload = (cert) => {
    // Generate text/html blob for instant certificate download
    const certHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${cert.title} - Certificate</title>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 40px; text-align: center; border: 12px double #1e3a8a; margin: 20px; }
          h1 { color: #1e3a8a; font-size: 28px; text-transform: uppercase; margin-bottom: 5px; }
          h3 { color: #475569; font-weight: normal; margin-top: 0; }
          .recipient { font-size: 26px; font-weight: bold; color: #0f172a; margin: 25px 0; border-bottom: 2px solid #cbd5e1; display: inline-block; padding-bottom: 5px; }
          .body-text { font-size: 16px; color: #334155; line-height: 1.6; max-width: 600px; margin: 0 auto 20px; }
          .meta { font-size: 14px; color: #64748b; margin-top: 40px; display: flex; justify-content: space-around; }
          .badge { font-weight: bold; color: #047857; margin-top: 15px; }
        </style>
      </head>
      <body>
        <h1>Ministry of Statistics & Programme Implementation</h1>
        <h3>Government of India • Saksham AI Verified Credential</h3>
        <p class="body-text">This is to certify that</p>
        <div class="recipient">${learnerName}</div>
        <p class="body-text">has successfully satisfied all competency benchmarks and assessment evaluations for the curriculum</p>
        <h2>${cert.title}</h2>
        <div class="badge">Verified Score: ${cert.score} • Domain: ${cert.domain}</div>
        <div class="meta">
          <div><strong>Issuer:</strong> ${cert.issuer}</div>
          <div><strong>Date:</strong> ${cert.issueDate}</div>
          <div><strong>Credential ID:</strong> ${cert.credentialId}</div>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([certHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cert.credentialId}_Certificate.html`;
    a.click();
    URL.revokeObjectURL(url);

    setShowToast(`Downloaded Certificate for ${cert.title}`);
    setTimeout(() => setShowToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Certificates & Credentials</h1>
          <p className="text-sm text-gray-500 mt-1">
            Access, view, and download your government-verified competency credentials.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-white border border-gray-200 px-3 py-2 rounded-lg">
          <Shield className="w-4 h-4 text-blue-600" />
          <span>4 Verified Credentials On Record</span>
        </div>
      </div>

      {/* Grid of Certificate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-5 hover:border-gray-300 transition"
          >
            <div className="space-y-3">
              {/* Header Icon + Issuer */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Verified ({cert.score})
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">{cert.issuer}</p>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                  {cert.domain}
                </span>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-base font-semibold text-gray-900 leading-snug">
                  {cert.title}
                </h2>
              </div>

              {/* Issue Date & ID */}
              <div className="space-y-1.5 pt-1 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>Issued on {cert.issueDate}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-gray-600">
                  <span className="text-gray-400">ID:</span> {cert.credentialId}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedCert(cert)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Credential
              </button>
              <button
                onClick={() => handleDownload(cert)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-gray-200 relative space-y-6">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center border-4 border-double border-blue-900 p-8 rounded-xl bg-gradient-to-b from-blue-50/30 to-white space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto text-lg font-bold">
                S
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Ministry of Statistics & Programme Implementation
                </h3>
                <h2 className="text-lg font-bold text-blue-900">
                  Certificate of Competency Achievement
                </h2>
              </div>

              <p className="text-xs text-gray-500">This credential is presented to</p>
              <h4 className="text-xl font-bold text-gray-900 border-b border-gray-200 inline-block pb-1 px-4">
                {learnerName}
              </h4>
              <p className="text-xs text-gray-600">{designation}</p>

              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                For demonstrating proficiency in <span className="font-semibold text-gray-900">{selectedCert.title}</span> with a certified score of <span className="font-semibold text-emerald-600">{selectedCert.score}</span>.
              </p>

              <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-500 pt-4 border-t border-gray-200">
                <div>
                  <span className="block text-gray-400">Issuer</span>
                  <span className="font-medium text-gray-800">{selectedCert.issuer}</span>
                </div>
                <div>
                  <span className="block text-gray-400">Date</span>
                  <span className="font-medium text-gray-800">{selectedCert.issueDate}</span>
                </div>
                <div>
                  <span className="block text-gray-400">Credential ID</span>
                  <span className="font-mono font-medium text-gray-800">{selectedCert.credentialId}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleDownload(selectedCert)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                <Download className="w-4 h-4" /> Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
