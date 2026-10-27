'use client';

import React, { useState } from 'react';
import { AppSettings } from '@/types';
import { Settings, X, Save, Key, User, Building, Sparkles, Cpu, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onFactoryReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onFactoryReset,
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Application &amp; AI Settings</h3>
              <p className="text-xs text-slate-400">Configure AI review provider, models, and teacher profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* AI Provider Section */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-white font-semibold">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Engine &amp; OpenAI Configuration</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">OpenAI API Key (Optional)</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={formData.openaiApiKey}
                  onChange={e => setFormData({ ...formData, openaiApiKey: e.target.value })}
                  placeholder="sk-proj-... (Leave empty to use Smart Built-in Offline Engine)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-2 text-[10px] text-slate-400 hover:text-white"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                No key required! When left blank, the app uses its high-accuracy offline heuristic intelligence engine.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">OpenAI Model</label>
                <select
                  value={formData.model}
                  onChange={e => setFormData({ ...formData, model: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="gpt-4o-mini">GPT-4o Mini (Fast &amp; Accurate)</option>
                  <option value="gpt-4o">GPT-4o (Deep Reasoning)</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Engine Mode</label>
                <label className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.useOfflineEngine}
                    onChange={e => setFormData({ ...formData, useOfflineEngine: e.target.checked })}
                    className="rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Force Offline Engine</span>
                </label>
              </div>
            </div>
          </div>

          {/* Teacher Profile Section */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-white font-semibold">
              <User className="w-4 h-4 text-blue-400" />
              <span>Educator Profile &amp; School Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Teacher / Staff Name</label>
                <input
                  type="text"
                  value={formData.teacherName}
                  onChange={e => setFormData({ ...formData, teacherName: e.target.value })}
                  placeholder="e.g. Ms. Eleanor Vance"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">School / Organization</label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                  placeholder="e.g. Oakwood Middle School"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Reset All App Data */}
          <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-xl flex items-center justify-between">
            <span className="text-slate-300 text-[11px]">Factory Reset all local storage, checklist, and history:</span>
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to reset all data and history back to default?')) {
                  onFactoryReset();
                  onClose();
                }
              }}
              className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg text-xs font-medium transition"
            >
              Reset All
            </button>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
