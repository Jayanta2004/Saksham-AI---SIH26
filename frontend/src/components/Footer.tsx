import React from 'react';
import { Shield, Sparkles, Database, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight">SAKSHAM AI</span>
              <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 text-[10px] font-semibold">
                SIH26101
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              AI-Enabled Skill Intelligence & Personalized Learning Ecosystem designed for India&apos;s Official Statistical System.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400/90 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Smart India Hackathon 2026 Initiative
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <p className="font-semibold text-white uppercase text-[11px] tracking-wider">Ecosystem Integration</p>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <ExternalLink className="w-3 h-3 text-blue-400" />
                <a href="https://igotkarmayogi.gov.in" target="_blank" rel="noreferrer">iGOT Karmayogi Portal</a>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <ExternalLink className="w-3 h-3 text-blue-400" />
                <a href="https://nssta.gov.in" target="_blank" rel="noreferrer">NSSTA Greater Noida</a>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <ExternalLink className="w-3 h-3 text-blue-400" />
                <a href="https://mospi.gov.in" target="_blank" rel="noreferrer">MoSPI Official Portal</a>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <ExternalLink className="w-3 h-3 text-blue-400" />
                <span>Training Policy Advisory Committee (TPAC)</span>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <p className="font-semibold text-white uppercase text-[11px] tracking-wider">Core Capabilities</p>
            <ul className="space-y-1.5 text-slate-400">
              <li>Role-Aware Competency Graph</li>
              <li>RAG-Driven MCQ & Quiz Generator</li>
              <li>SNA 2008 & NSS 79th Round Ingestion</li>
              <li>Workforce Deficit Predictive Analytics</li>
              <li>DPDPA & AES-256 Field Security</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <p className="font-semibold text-white uppercase text-[11px] tracking-wider">Developed By</p>
            <p className="text-white font-medium text-xs">Team 404 not founders</p>
            <p className="text-slate-400 text-xs">IIT Madras BS Degree Programme</p>
            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>MoSPI & NIC Compatible Architecture</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 Saksham AI. Built for Smart India Hackathon (SIH26101). All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>Official Statistical Framework v2.4</span>
            <span>•</span>
            <span>AES-256 GCM Compliant</span>
            <span>•</span>
            <span>DPDPA 2023 Aligned</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
