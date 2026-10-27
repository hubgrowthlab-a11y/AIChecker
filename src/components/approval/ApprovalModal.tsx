'use client';

import React, { useState } from 'react';
import { ReviewResult, EmailDraft } from '@/types';
import { 
  ShieldCheck, 
  X, 
  Check, 
  AlertTriangle, 
  UserCheck, 
  FileCheck, 
  Lock, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewResult: ReviewResult;
  draft: EmailDraft;
  defaultApproverName: string;
  onApprove: (approverName: string, notes: string) => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  reviewResult,
  draft,
  defaultApproverName,
  onApprove,
}) => {
  const [approverName, setApproverName] = useState(defaultApproverName || 'Eleanor Vance (Educator)');
  const [notes, setNotes] = useState('');
  const [confirmedPrivacy, setConfirmedPrivacy] = useState(false);
  const [confirmedAccuracy, setConfirmedAccuracy] = useState(false);

  if (!isOpen) return null;

  const criticalIssues = reviewResult.findings.filter(
    f => f.severity === 'Critical' && (f.status === 'Fail' || f.status === 'Needs Review') && !f.applied && !f.dismissed
  );

  const canApprove = confirmedPrivacy && confirmedAccuracy && approverName.trim().length > 0 && criticalIssues.length === 0;

  const handleConfirm = () => {
    if (!canApprove) return;

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    onApprove(approverName, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Approve Final Email Draft</h3>
              <p className="text-xs text-slate-400">Formal quality-assurance verification gate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Critical Issue Guard */}
        {criticalIssues.length > 0 && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-rose-300">Approval Blocked: Unresolved Critical Issues</strong>
              Please resolve or apply the suggested corrections for all Critical quality points before approving.
            </div>
          </div>
        )}

        {/* Draft Summary Card */}
        <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Recipient:</span>
            <span className="text-slate-200 font-medium">{draft.recipient || 'Not specified'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Subject:</span>
            <span className="text-slate-200 font-medium truncate max-w-xs">{draft.subject}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Word Count:</span>
            <span className="text-slate-200 font-medium">{draft.body.split(/\s+/).length} words</span>
          </div>
        </div>

        {/* Verification Checkboxes */}
        <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-xs">
          <label className="flex items-start space-x-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmedPrivacy}
              onChange={e => setConfirmedPrivacy(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900 w-4 h-4"
            />
            <span className="text-slate-300">
              I confirm that no peer student names, private grades, or confidential third-party information are disclosed (FERPA compliance).
            </span>
          </label>

          <label className="flex items-start space-x-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmedAccuracy}
              onChange={e => setConfirmedAccuracy(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900 w-4 h-4"
            />
            <span className="text-slate-300">
              I have verified all dates, submission deadlines, room numbers, and contact details for complete accuracy.
            </span>
          </label>
        </div>

        {/* Approver Details */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Approving Staff Member / Teacher Name
            </label>
            <input
              type="text"
              value={approverName}
              onChange={e => setApproverName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              placeholder="e.g. Ms. Eleanor Vance, Grade 6 Science"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Optional Approval Note / Audit Reference
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              placeholder="e.g. Reviewed against Q1 progress standards"
            />
          </div>
        </div>

        {/* Invalidation Disclaimer */}
        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center space-x-2 text-[11px] text-slate-400">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Note:</strong> Approving locks this exact snapshot. Any future edit to the draft body will automatically invalidate this approval.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={!canApprove}
            className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
              canApprove
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30 cursor-pointer active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Confirm &amp; Stamp Approval</span>
          </button>
        </div>
      </div>
    </div>
  );
};
