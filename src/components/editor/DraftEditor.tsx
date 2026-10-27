'use client';

import React from 'react';
import { EmailDraft } from '@/types';
import { 
  Send, 
  Sparkles, 
  User, 
  GraduationCap, 
  FileText, 
  AlertCircle, 
  Clock, 
  Layers,
  Copy,
  RotateCcw
} from 'lucide-react';

interface DraftEditorProps {
  draft: EmailDraft;
  setDraft: React.Dispatch<React.SetStateAction<EmailDraft>>;
  onReview: () => void;
  isReviewing: boolean;
  isApproved: boolean;
  isInvalidated: boolean;
  onResetToOriginal?: () => void;
  hasCorrectionsApplied?: boolean;
}

export const DraftEditor: React.FC<DraftEditorProps> = ({
  draft,
  setDraft,
  onReview,
  isReviewing,
  isApproved,
  isInvalidated,
  onResetToOriginal,
  hasCorrectionsApplied,
}) => {
  const wordCount = draft.body.trim().length > 0 ? draft.body.trim().split(/\s+/).length : 0;
  const charCount = draft.body.length;
  const readTimeSeconds = Math.max(1, Math.round((wordCount / 200) * 60));

  const handleChange = (field: keyof EmailDraft, value: string) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Email Draft Editor</h2>
            <p className="text-xs text-slate-400">Compose or paste your draft for AI quality inspection</p>
          </div>
        </div>

        {/* Status indicator badges */}
        <div className="flex items-center space-x-2">
          {isApproved && (
            <span className="flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Draft Approved & Locked</span>
            </span>
          )}

          {isInvalidated && (
            <span className="flex items-center space-x-1.5 px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Approval Invalidated (Edited)</span>
            </span>
          )}

          {hasCorrectionsApplied && onResetToOriginal && (
            <button
              onClick={onResetToOriginal}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs border border-slate-700 transition"
              title="Revert back to original uncorrected draft"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revert to Original</span>
            </button>
          )}
        </div>
      </div>

      {/* Post-Approval Invalidation Alert Banner */}
      {isInvalidated && (
        <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-start space-x-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block text-rose-300">Security Gate: Email Content Modified</strong>
            You edited the draft after approval. To maintain compliance and verify no accidental errors were introduced, you must click &quot;Review Email&quot; and re-approve before sending.
          </div>
        </div>
      )}

      {/* Fields Grid */}
      <div className="space-y-3.5 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Recipient */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Parent / Recipient Email or Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g. mr.smith@oakwoodparents.org or Mr. and Mrs. Smith"
              value={draft.recipient}
              onChange={e => handleChange('recipient', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              <span>Student Full Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Lucas Smith"
              value={draft.studentName}
              onChange={e => handleChange('studentName', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Subject Line */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Subject Line</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Lucas Smith - Grade 6 Science Project Update & Submission Deadline"
            value={draft.subject}
            onChange={e => handleChange('subject', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Email Body */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Body (Editable Draft)</span>
            </label>
            <div className="flex items-center space-x-3 text-[11px] text-slate-400">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} chars</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>~{readTimeSeconds}s read</span>
              </span>
            </div>
          </div>

          <textarea
            rows={13}
            placeholder="Type or paste the email draft you plan to send to parents here..."
            value={draft.body}
            onChange={e => handleChange('body', e.target.value)}
            className="w-full flex-1 min-h-[260px] bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono leading-relaxed transition resize-y"
          />
        </div>
      </div>

      {/* Review Action Footer */}
      <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-400">
          Evaluates against <strong>10 Quality Control Rules</strong> &amp; Active School Policies
        </div>

        <button
          onClick={onReview}
          disabled={isReviewing || !draft.body.trim()}
          className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg ${
            isReviewing || !draft.body.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 text-white shadow-blue-500/25 cursor-pointer active:scale-[0.99]'
          }`}
        >
          {isReviewing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Agent Reviewing QC Points...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span>Review Email with AI Agent</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
