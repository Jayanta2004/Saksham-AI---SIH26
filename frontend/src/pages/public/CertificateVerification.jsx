import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
export default function CertificateVerification() {
  const { credentialId } = useParams();
  return <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><section className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-5 shadow-sm">
    <ShieldCheck className="w-14 h-14 mx-auto text-emerald-600" /><div><p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Saksham AI credential registry</p><h1 className="text-2xl font-bold text-slate-900 mt-2">Credential verification</h1></div>
    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4"><p className="text-sm font-semibold text-emerald-800">Verification link is valid</p><p className="text-xs text-emerald-700 mt-1">Credential ID: <span className="font-mono">{credentialId}</span></p></div>
    <p className="text-xs text-slate-500">For a production deployment, this page should validate the credential against the secured gateway registry.</p><Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700"><ArrowLeft className="w-4 h-4" /> Return to Saksham AI</Link>
  </section></main>;
}
