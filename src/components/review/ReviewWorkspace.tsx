'use client';

import React, { useState } from 'react';
import { ReviewResult, IssueFinding, EmailDraft } from '@/types';
import { ChecklistResultsList } from './ChecklistResultsList';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Copy, 
  Send, 
  RotateCcw, 
  Check, 
  Layers, 
  SplitSquareVertical, 
  FileCheck2, 
  ExternalLink,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';

interface ReviewWorkspaceProps {
  reviewResult: ReviewResult | null;
  draft: EmailDraft;
  onApplyCorrection: (finding: IssueFinding) => void;
  onApplyAllCorrections: () => void;
  onDismissFinding: (findingId: string) => void;
  onOpenApprovalModal: () => void;
  onOpenSendModal: () => void;
  onRerunReview: () => void;
  copiedToast: boolean;
  onCopyFinalEmail: () => void;
}

export const ReviewWorkspace: React.FC<ReviewWorkspaceProps> = ({
  reviewResult,
  draft,
  onApplyCorrection,
  onApplyAllCorrections,
  onDismissFinding,
  onOpenApprovalModal,
  onOpenSendModal,
  onRerunReview,
  copiedToast,
  onCopyFinalEmail,
}) => {
  const [activeViewTab, setActiveViewTab] = useState<'checklist' | 'side-by-side' | 'full-preview'>('checklist');

  if (!reviewResult) {
    return (
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-8 text-center flex flex-col items-center justify-center min-h-[420px]">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 mb-4 animate-pulse">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Review Active Yet</h3>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          Paste or write your email draft on the left and click <strong>&quot;Review Email with AI Agent&quot;</strong>, or pick one of the sample demo emails above to start.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-400 max-w-lg">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">✅ 10 Quality Control Rules</div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">🔒 Strict FERPA Privacy Check</div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">📚 School Policy Citations</div>
        </div>
      </div>
    );
  }

  const criticalIssues = reviewResult.findings.filter(
    f => f.severity === 'Critical' && (f.status === 'Fail' || f.status === 'Needs Review')
  );
  const totalIssues = reviewResult.findings.filter(f => f.status === 'Fail' || f.status === 'Needs Review');
  const unappliedIssues = totalIssues.filter(f => !f.applied);
  const isApproved = reviewResult.isApproved;

  // Compute score color
  let scoreBg = 'from-emerald-500 to-teal-500 text-emerald-400 border-emerald-500/30';
  if (reviewResult.overallScore < 70) {
    scoreBg = 'from-rose-500 to-pink-600 text-rose-400 border-rose-500/30';
  } else if (reviewResult.overallScore < 90) {
    scoreBg = 'from-amber-500 to-orange-500 text-amber-400 border-amber-500/30';
  }

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-5">
      {/* Top Banner: AI Score & Summary */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          {/* Score Circle Gauge */}
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${scoreBg} p-0.5 flex items-center justify-center shrink-0 shadow-lg`}>
            <div className="w-full h-full bg-slate-950 rounded-2xl flex flex-col items-center justify-center">
              <span className="text-xl font-black text-white">{reviewResult.overallScore}%</span>
              <span className="text-[9px] uppercase font-bold text-slate-400">Score</span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm sm:text-base font-bold text-white">AI Quality Control Audit</h3>
              {criticalIssues.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  <span>{criticalIssues.length} Critical Issue(s)</span>
                </span>
              ) : totalIssues.length === 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>All 10 Points Passed</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {totalIssues.length} Finding(s) to Resolve
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {reviewResult.summary}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          {unappliedIssues.length > 0 && (
            <button
              onClick={onApplyAllCorrections}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Apply All ({unappliedIssues.length})</span>
            </button>
          )}

          <button
            onClick={onRerunReview}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
            title="Re-run 10-point review against current draft"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-Review</span>
          </button>
        </div>
      </div>

      {/* Grounding and Privacy Guarantee Note */}
      <div className="px-3.5 py-2 rounded-lg bg-blue-950/20 border border-blue-900/30 text-[11px] text-blue-300/90 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span><strong>Grounded AI Guarantee:</strong> AI suggestions strictly preserve original factual commitments and never fabricate school policies or student details.</span>
        </span>
      </div>

      {/* Workspace View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveViewTab('checklist')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeViewTab === 'checklist'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>10-Point Checklist ({reviewResult.findings.length})</span>
          </button>

          <button
            onClick={() => setActiveViewTab('side-by-side')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeViewTab === 'side-by-side'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Side-by-Side Comparison</span>
          </button>

          <button
            onClick={() => setActiveViewTab('full-preview')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeViewTab === 'full-preview'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Final Polished Email</span>
          </button>
        </div>

        {/* Approval Badge / Trigger */}
        <div className="flex items-center space-x-2">
          {isApproved ? (
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-full text-xs font-bold">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Approved ({reviewResult.approvalDetails?.approverName || 'Educator'})</span>
              </span>

              <button
                onClick={onCopyFinalEmail}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition shadow-sm cursor-pointer"
              >
                {copiedToast ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedToast ? 'Copied!' : 'Copy Final Email'}</span>
              </button>

              <button
                onClick={onOpenSendModal}
                className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Parent</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenApprovalModal}
              disabled={criticalIssues.length > 0}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-md ${
                criticalIssues.length > 0
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/25 cursor-pointer active:scale-95'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{criticalIssues.length > 0 ? 'Resolve Critical Issues to Approve' : 'Approve Final Email Draft'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: 10-Point Checklist Details */}
      {activeViewTab === 'checklist' && (
        <ChecklistResultsList
          findings={reviewResult.findings}
          onApplyCorrection={onApplyCorrection}
          onDismissFinding={onDismissFinding}
        />
      )}

      {/* Tab 2: Side-by-Side Comparison */}
      {activeViewTab === 'side-by-side' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Original Draft */}
          <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-rose-400 flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Original Submitted Draft</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {reviewResult.originalBody.split(/\s+/).length} words
              </span>
            </div>
            <div className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-900 flex-1">
              {reviewResult.originalBody}
            </div>
          </div>

          {/* Right: AI Corrected Version */}
          <div className="bg-slate-950/80 rounded-xl border border-emerald-900/40 p-4 flex flex-col shadow-lg shadow-emerald-950/10">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Suggested &amp; Polished Draft</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {reviewResult.suggestedBody.split(/\s+/).length} words
              </span>
            </div>
            <div className="text-xs font-mono text-emerald-100 whitespace-pre-wrap leading-relaxed bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/30 flex-1">
              {reviewResult.suggestedBody}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Full Preview and Dispatch Ready */}
      {activeViewTab === 'full-preview' && (
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-4">
          <div className="space-y-2 pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-400 w-20">To (Parent):</span>
              <span className="text-slate-200 font-medium">{draft.recipient || 'Not specified'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-400 w-20">Student:</span>
              <span className="text-slate-200 font-medium">{draft.studentName || 'Not specified'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-400 w-20">Subject:</span>
              <span className="text-slate-100 font-bold">{draft.subject}</span>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            {draft.body}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              {isApproved ? '✅ Verified and ready for delivery.' : '⚠️ Pending explicit approval before dispatch.'}
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={onCopyFinalEmail}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
              >
                {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedToast ? 'Copied to Clipboard!' : 'Copy Formatted Email'}</span>
              </button>

              {isApproved && (
                <button
                  onClick={onOpenSendModal}
                  className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Parent</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
