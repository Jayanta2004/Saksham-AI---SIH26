import React, { useState } from 'react';
import { Check, CheckCircle2 } from 'lucide-react';

const AdminSettings = () => {
  const [gapWeight, setGapWeight] = useState(60);
  const [roleWeight, setRoleWeight] = useState(40);
  const [syncInterval, setSyncInterval] = useState('3600');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl pb-12">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
        <h1 className="font-headline text-xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Configure recommendation weights, integration parameters, and background sync intervals.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs sm:text-sm flex items-center space-x-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
        {/* Section 1: AI Recommendation Weights */}
        <div className="space-y-4">
          <div>
            <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">AI Recommendation Weights</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Adjust how the recommendation engine balances individual skill deficits versus role standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Competency Gap Weight (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={gapWeight}
                onChange={(e) => setGapWeight(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-ai-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Role Benchmark Weight (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={roleWeight}
                onChange={(e) => setRoleWeight(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-ai-cyan"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-white/10"></div>

        {/* Section 2: Integration Sync Settings */}
        <div className="space-y-4">
          <div>
            <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">Integration Sync Settings</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Manage data synchronization with external learning portals</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                iGOT Karmayogi Sync Interval
              </label>
              <select
                value={syncInterval}
                onChange={(e) => setSyncInterval(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
              >
                <option value="1800">Every 30 minutes</option>
                <option value="3600">Every 1 hour (Default)</option>
                <option value="21600">Every 6 hours</option>
                <option value="86400">Daily (24 hours)</option>
              </select>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">iGOT API Status</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">Last synchronized 12 minutes ago</div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-success-emerald bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-1 rounded-full">
                Connected
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-600 text-white font-semibold rounded-xl text-xs transition shadow-sm"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
