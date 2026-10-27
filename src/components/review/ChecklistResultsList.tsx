'use client';

import React, { useState } from 'react';
import { IssueFinding, FindingStatus, SeverityLevel } from '@/types';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  BookOpen, 
  Check, 
  ShieldAlert, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  Filter
} from 'lucide-react';

interface ChecklistResultsListProps {
  findings: IssueFinding[];
  onApplyCorrection: (finding: IssueFinding) => void;
  onDismissFinding: (findingId: string) => void;
  onHighlightIssueInEditor?: (exactText: string) => void;
}

export const ChecklistResultsList: React.FC<ChecklistResultsListProps> = ({
  findings,
  onApplyCorrection,
  onDismissFinding,
  onHighlightIssueInEditor,
}) => {
  const [filter, setFilter] = useState<'all' | 'issues' | 'passed' | 'critical'>('all');
  const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({});

  const toggleDocExcerpt = (id: string) => {
    setExpandedDocs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusBadge = (status: FindingStatus) => {
    switch (status) {
      case 'Pass':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pass</span>
          </span>
        );
      case 'Fail':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            <span>Fail</span>
          </span>
        );
      case 'Needs Review':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Needs Review</span>
          </span>
        );
      case 'Not Applicable':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>N/A</span>
          </span>
        );
    }
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-700/60">
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-700/60">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-800/60">
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
            Low
          </span>
        );
    }
  };

  const filteredFindings = findings.filter(f => {
    if (filter === 'issues') return f.status === 'Fail' || f.status === 'Needs Review';
    if (filter === 'passed') return f.status === 'Pass';
    if (filter === 'critical') return f.severity === 'Critical';
    return true;
  });

  const totalCount = findings.length;
  const passCount = findings.filter(f => f.status === 'Pass').length;
  const issueCount = findings.filter(f => f.status === 'Fail' || f.status === 'Needs Review').length;
  const criticalCount = findings.filter(f => f.severity === 'Critical' && (f.status === 'Fail' || f.status === 'Needs Review')).length;

  return (
    <div className="space-y-4">
      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Points ({totalCount})
          </button>
          <button
            onClick={() => setFilter('issues')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filter === 'issues'
                ? 'bg-amber-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Issues Found ({issueCount})
          </button>
          <button
            onClick={() => setFilter('passed')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filter === 'passed'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Passed ({passCount})
          </button>
          {criticalCount > 0 && (
            <button
              onClick={() => setFilter('critical')}
              className={`px-3 py-1 rounded-lg font-medium transition flex items-center space-x-1 ${
                filter === 'critical'
                  ? 'bg-rose-600 text-white'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              <span>Critical ({criticalCount})</span>
            </button>
          )}
        </div>

        <div className="text-xs text-slate-400">
          Showing {filteredFindings.length} of {totalCount} QC Points
        </div>
      </div>

      {/* Findings Cards List */}
      <div className="space-y-3">
        {filteredFindings.map((finding, index) => {
          const isIssue = finding.status === 'Fail' || finding.status === 'Needs Review';
          const isPassed = finding.status === 'Pass';
          const isDocOpen = expandedDocs[finding.id];

          return (
            <div
              key={finding.id}
              className={`rounded-xl border transition-all p-4 ${
                finding.applied
                  ? 'bg-slate-900/60 border-emerald-500/30 opacity-75'
                  : isPassed
                  ? 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                  : finding.severity === 'Critical'
                  ? 'bg-rose-950/20 border-rose-800/60 shadow-lg shadow-rose-950/20'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top Row: Title, Severity, Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-slate-500">#{index + 1}</span>
                  <h4 className="text-sm font-semibold text-slate-100">{finding.checklistTitle}</h4>
                  {getSeverityBadge(finding.severity)}
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(finding.status)}
                </div>
              </div>

              {/* Explanation of the finding */}
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {finding.explanation}
              </p>

              {/* Issue Details and Suggested Correction if Issue */}
              {isIssue && (
                <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                  {finding.exactText && (
                    <div className="bg-slate-950/90 rounded-lg p-2.5 border border-slate-800">
                      <div className="text-[11px] font-semibold text-rose-400 mb-1 flex items-center justify-between">
                        <span>Original Text with Issue:</span>
                        {onHighlightIssueInEditor && (
                          <button
                            onClick={() => onHighlightIssueInEditor(finding.exactText)}
                            className="text-[10px] text-blue-400 hover:underline"
                          >
                            Highlight in Draft
                          </button>
                        )}
                      </div>
                      <code className="text-xs text-rose-200 font-mono bg-rose-950/40 px-2 py-1 rounded block border border-rose-900/40 break-words">
                        &quot;{finding.exactText}&quot;
                      </code>
                    </div>
                  )}

                  {finding.suggestedCorrection && (
                    <div className="bg-slate-950/90 rounded-lg p-2.5 border border-slate-800">
                      <div className="text-[11px] font-semibold text-emerald-400 mb-1 flex items-center justify-between">
                        <span className="flex items-center space-x-1">
                          <Zap className="w-3 h-3 text-emerald-400" />
                          <span>Suggested AI Correction:</span>
                        </span>
                        {!finding.applied && (
                          <button
                            onClick={() => onApplyCorrection(finding)}
                            className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition cursor-pointer shadow-sm shadow-emerald-600/30"
                          >
                            <Check className="w-3 h-3" />
                            <span>Apply Fix to Draft</span>
                          </button>
                        )}
                        {finding.applied && (
                          <span className="flex items-center space-x-1 text-emerald-400 text-xs font-medium">
                            <Check className="w-3.5 h-3.5" />
                            <span>Applied to Draft</span>
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-emerald-200 font-mono bg-emerald-950/40 p-2 rounded border border-emerald-900/40 break-words">
                        {finding.suggestedCorrection}
                      </div>
                    </div>
                  )}

                  {/* Reference Document Citation */}
                  {finding.referenceDocName && (
                    <div className="pt-1">
                      <button
                        onClick={() => toggleDocExcerpt(finding.id)}
                        className="flex items-center justify-between w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:border-slate-700 transition"
                      >
                        <span className="flex items-center space-x-1.5 truncate">
                          <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="truncate">Reference Policy: <strong>{finding.referenceDocName}</strong></span>
                        </span>
                        {isDocOpen ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isDocOpen && finding.referenceExcerpt && (
                        <div className="mt-1 p-2.5 rounded-lg bg-blue-950/20 border border-blue-900/40 text-xs text-blue-200/90 leading-relaxed font-sans animate-fadeIn">
                          <p className="text-[11px] font-semibold text-blue-400 mb-1">Approved Excerpt:</p>
                          &ldquo;{finding.referenceExcerpt}&rdquo;
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
