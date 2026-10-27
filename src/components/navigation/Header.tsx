'use client';

import React from 'react';
import { 
  Mail, 
  CheckSquare, 
  LayoutDashboard, 
  FolderSync, 
  Settings, 
  ShieldCheck, 
  Sparkles, 
  Cpu
} from 'lucide-react';
import { AppSettings, GoogleDriveConfig } from '@/types';

interface HeaderProps {
  activeTab: 'workspace' | 'dashboard' | 'checklist' | 'drive' | 'settings';
  setActiveTab: (tab: 'workspace' | 'dashboard' | 'checklist' | 'drive' | 'settings') => void;
  settings: AppSettings;
  driveConfig: GoogleDriveConfig;
  approvedDocsCount: number;
  openSettingsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  settings,
  driveConfig,
  approvedDocsCount,
  openSettingsModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">Parent Email Review Agent</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  AI v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">10-Point Pre-Dispatch Quality Control & FERPA Compliance</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('workspace')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'workspace'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Workspace</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'checklist'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>10-Point QC</span>
            </button>

            <button
              onClick={() => setActiveTab('drive')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'drive'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FolderSync className="w-4 h-4" />
              <span className="hidden md:inline">Google Drive</span>
              <span className="md:hidden">Drive</span>
              <span className="ml-1 px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full">
                {approvedDocsCount}
              </span>
            </button>
          </nav>

          {/* Status Indicators & Settings */}
          <div className="flex items-center space-x-2">
            {/* Engine status indicator */}
            <div 
              onClick={openSettingsModal}
              className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs cursor-pointer hover:border-slate-700 transition"
              title="Click to configure AI Engine & API Keys"
            >
              {settings.openaiApiKey ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-slate-300">OpenAI ({settings.model})</span>
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-300">Smart Local AI (Active)</span>
                </>
              )}
            </div>

            {/* Settings Button */}
            <button
              onClick={openSettingsModal}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition border border-transparent hover:border-slate-700"
              title="Application Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
