'use client';

import React, { useState } from 'react';
import { ReviewResult } from '@/types';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Mail, 
  Clock, 
  ExternalLink, 
  Trash2, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Download, 
  X,
  Printer
} from 'lucide-react';

interface DashboardProps {
  history: ReviewResult[];
  onOpenReviewInWorkspace: (review: ReviewResult) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearAllHistory: () => void;
  onNavigateToTab: (tab: 'workspace' | 'checklist' | 'drive') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  history,
  onOpenReviewInWorkspace,
  onDeleteHistoryItem,
  onClearAllHistory,
  onNavigateToTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuditResult, setSelectedAuditResult] = useState<ReviewResult | null>(null);

  const totalReviewed = history.length;
  const totalApproved = history.filter(h => h.isApproved || h.status === 'approved' || h.status === 'sent').length;
  const criticalIntercepted = history.filter(h => 
    h.findings.some(f => f.severity === 'Critical' && (f.status === 'Fail' || f.status === 'Needs Review'))
  ).length;
  const pendingReview = history.filter(h => !h.isApproved && h.status !== 'sent').length;

  const averageScore = totalReviewed > 0
    ? Math.round(history.reduce((acc, h) => acc + h.overallScore, 0) / totalReviewed)
    : 0;

  const filteredHistory = history.filter(h =>
    h.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <LayoutDashboard className="w-6 h-6 text-blue-400" />
            <span>Parent Email Quality Control Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Overview of email safety compliance, FERPA risk interception, and recent audit logs
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigateToTab('workspace')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 transition cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>New Email Review</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reviewed */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Reviewed</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white">{totalReviewed}</span>
            <span className="text-xs text-slate-400">emails audited</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Avg Score: {averageScore}%</p>
        </div>

        {/* Emails Approved */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Emails Approved</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-400">{totalApproved}</span>
            <span className="text-xs text-slate-400">ready / dispatched</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Verified with staff signature</p>
        </div>

        {/* Critical Issues Intercepted */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Critical Interceptions</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-rose-400">{criticalIntercepted}</span>
            <span className="text-xs text-slate-400">privacy/tone risks</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Blocked before sending</p>
        </div>

        {/* Awaiting Review */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Awaiting Signoff</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-amber-400">{pendingReview}</span>
            <span className="text-xs text-slate-400">in revision</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Requires teacher signoff</p>
        </div>
      </div>

      {/* Recent Review History Table Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Recent Email Audit &amp; Review History</h3>
            <p className="text-xs text-slate-400">Inspect past quality control reports, scores, and approver stamps</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {history.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Clear all review history logs?')) onClearAllHistory();
                }}
                className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                title="Clear History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <Mail className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p>No email reviews recorded yet. Run your first review in the Workspace tab!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800/80 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Date &amp; Time</th>
                  <th className="py-2.5 px-3">Recipient / Student</th>
                  <th className="py-2.5 px-3">Subject Line</th>
                  <th className="py-2.5 px-3 text-center">Score</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredHistory.map(item => {
                  const criticalCount = item.findings.filter(f => f.severity === 'Critical' && f.status === 'Fail').length;
                  const isAppr = item.isApproved || item.status === 'approved' || item.status === 'sent';

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white truncate max-w-[160px]">{item.recipient || 'Parent'}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[160px]">Student: {item.studentName || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="truncate block max-w-xs text-slate-300 font-medium">
                          {item.subject}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-xs ${
                          item.overallScore >= 90
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                            : item.overallScore >= 70
                            ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                            : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                        }`}>
                          {item.overallScore}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {isAppr ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Approved
                          </span>
                        ) : criticalCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            {criticalCount} Critical
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Reviewed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => setSelectedAuditResult(item)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg text-[11px] font-medium transition"
                        >
                          View Audit
                        </button>
                        <button
                          onClick={() => onOpenReviewInWorkspace(item)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-medium transition"
                        >
                          Load in Editor
                        </button>
                        <button
                          onClick={() => onDeleteHistoryItem(item.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Audit Modal */}
      {selectedAuditResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Full Quality-Control Audit Report</h3>
                <p className="text-xs text-slate-400">
                  ID: {selectedAuditResult.id} • {new Date(selectedAuditResult.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrintAudit}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report</span>
                </button>
                <button
                  onClick={() => setSelectedAuditResult(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Email Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">Recipient:</span>
                <span className="text-white font-medium">{selectedAuditResult.recipient || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Student:</span>
                <span className="text-white font-medium">{selectedAuditResult.studentName || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Overall Score:</span>
                <span className="text-emerald-400 font-bold text-sm">{selectedAuditResult.overallScore}%</span>
              </div>
            </div>

            {/* Approver Stamp if Approved */}
            {selectedAuditResult.approvalDetails && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="font-bold">Approved by: {selectedAuditResult.approvalDetails.approverName}</span>
                    <span className="block text-[11px] text-emerald-400/80">
                      Timestamp: {new Date(selectedAuditResult.approvalDetails.approvedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-emerald-400/70 border border-emerald-800/60 px-2 py-0.5 rounded">
                  Token: {selectedAuditResult.approvalDetails.verificationToken}
                </span>
              </div>
            )}

            {/* Checklist Findings Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">10-Point Checklist Breakdown</h4>
              <div className="space-y-2">
                {selectedAuditResult.findings.map((f, i) => (
                  <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">#{i + 1} {f.checklistTitle}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.status === 'Pass'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          : f.severity === 'Critical'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800/60'
                          : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                      }`}>
                        {f.status} ({f.severity})
                      </span>
                    </div>
                    <p className="text-slate-300">{f.explanation}</p>
                    {f.exactText && (
                      <div className="mt-1 font-mono text-[11px] text-rose-300 bg-rose-950/30 p-1.5 rounded">
                        Issue: &quot;{f.exactText}&quot; &rarr; Suggestion: &quot;{f.suggestedCorrection}&quot;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  onOpenReviewInWorkspace(selectedAuditResult);
                  setSelectedAuditResult(null);
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Open in Review Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
