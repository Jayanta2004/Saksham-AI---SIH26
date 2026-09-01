import React, { useState } from 'react';
import { Check } from 'lucide-react';

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
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure recommendation weights, integration parameters, and background sync intervals.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
        {/* Section 1: AI Recommendation Weights */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">AI Recommendation Weights</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Adjust how algorithm balances individual skill deficits versus role standards
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1.5">
                Competency Gap Weight (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={gapWeight}
                onChange={(e) => setGapWeight(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1.5">
                Role Benchmark Weight (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={roleWeight}
                onChange={(e) => setRoleWeight(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100"></div>

        {/* Section 2: Integration Sync Settings */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Integration Sync Settings</h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage data synchronization with external learning portals</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1.5">
                iGOT Karmayogi Sync Interval
              </label>
              <select
                value={syncInterval}
                onChange={(e) => setSyncInterval(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-blue-500"
              >
                <option value="1800">Every 30 minutes</option>
                <option value="3600">Every 1 hour (Default)</option>
                <option value="21600">Every 6 hours</option>
                <option value="86400">Daily (24 hours)</option>
              </select>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">iGOT API Status</div>
                <div className="text-xs text-gray-500 mt-0.5">Last synchronized 12 minutes ago</div>
              </div>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                Connected
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
