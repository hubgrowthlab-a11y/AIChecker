'use client';

import React from 'react';
import { SAMPLE_EMAILS } from '@/lib/sampleEmails';
import { SampleEmailDemo } from '@/types';
import { CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, FileEdit } from 'lucide-react';

interface SampleEmailSelectorProps {
  onSelectSample: (sample: SampleEmailDemo) => void;
  onClearDraft: () => void;
  activeSampleId: string | null;
}

export const SampleEmailSelector: React.FC<SampleEmailSelectorProps> = ({
  onSelectSample,
  onClearDraft,
  activeSampleId,
}) => {
  return (
    <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Realistic Fictional Demo Emails
          </h3>
          <span className="text-[11px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20 font-medium">
            1-Click Load
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Load realistic sample cases to test the 10-point AI quality control engine
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SAMPLE_EMAILS.map((sample) => {
          const isSelected = activeSampleId === sample.id;
          let icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
          let borderColor = 'border-slate-800 hover:border-emerald-500/50';
          let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

          if (sample.id === 'sample-b') {
            icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
            borderColor = 'border-slate-800 hover:border-amber-500/50';
            badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
          } else if (sample.id === 'sample-c') {
            icon = <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />;
            borderColor = 'border-slate-800 hover:border-rose-500/50';
            badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
          }

          if (isSelected) {
            borderColor = sample.id === 'sample-a' 
              ? 'border-emerald-500 ring-1 ring-emerald-500/30 bg-emerald-950/20' 
              : sample.id === 'sample-b' 
              ? 'border-amber-500 ring-1 ring-amber-500/30 bg-amber-950/20' 
              : 'border-rose-500 ring-1 ring-rose-500/30 bg-rose-950/20';
          }

          return (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className={`text-left p-3.5 rounded-xl border bg-slate-950/60 transition-all cursor-pointer flex flex-col justify-between ${borderColor}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-1.5 font-semibold text-xs sm:text-sm text-slate-100 truncate">
                    {icon}
                    <span className="truncate">{sample.name.split(':')[0]}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium uppercase tracking-wider shrink-0 ${badgeBg}`}>
                    {sample.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 mb-2">
                  {sample.tagline}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate text-slate-300">Student: {sample.studentName}</span>
                <span className="text-blue-400 font-medium hover:underline">Load Draft &rarr;</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          All examples are strictly fictional demo data.
        </span>
        <button
          onClick={onClearDraft}
          className="flex items-center space-x-1 text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition"
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>Clear & Start Blank Email</span>
        </button>
      </div>
    </div>
  );
};
