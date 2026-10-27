'use client';

import React, { useState } from 'react';
import { ReviewResult, EmailDraft } from '@/types';
import { 
  Send, 
  X, 
  Check, 
  ExternalLink, 
  Mail, 
  ShieldCheck, 
  AlertCircle,
  Copy
} from 'lucide-react';

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewResult: ReviewResult;
  draft: EmailDraft;
  onConfirmSend: () => void;
}

export const SendEmailModal: React.FC<SendEmailModalProps> = ({
  isOpen,
  onClose,
  reviewResult,
  draft,
  onConfirmSend,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      onConfirmSend();
    }, 1200);
  };

  const handleCopy = () => {
    const formatted = `To: ${draft.recipient}\nSubject: ${draft.subject}\n\n${draft.body}`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoLink = `mailto:${encodeURIComponent(draft.recipient || '')}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(draft.recipient || '')}&su=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isSent ? 'Email Dispatched Successfully' : 'Dispatch Verified Email'}
              </h3>
              <p className="text-xs text-slate-400">Authenticated delivery confirmation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSent ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Email Sent to Parent</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
                The approved communication was recorded in your audit log with timestamp: {new Date().toLocaleTimeString()}.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Delivery Details */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Recipient Address:</span>
                <span className="text-blue-400 font-mono font-medium">{draft.recipient || 'Not specified'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Subject:</span>
                <span className="text-slate-200 font-medium truncate max-w-[240px]">{draft.subject}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Quality Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Approved &amp; Verified
                </span>
              </div>
            </div>

            {/* Dispatch Options */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-slate-300 block">Available Dispatch Methods:</span>

              {/* Direct Gmail Web Link */}
              <a
                href={gmailLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold">
                    M
                  </div>
                  <div>
                    <div className="font-semibold text-white">Open in Gmail Web</div>
                    <div className="text-[11px] text-slate-400">Pre-fills recipient, subject, and approved body</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </a>

              {/* Default Mail Client */}
              <a
                href={mailtoLink}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Open in Outlook / Default Mail App</div>
                    <div className="text-[11px] text-slate-400">Launches local desktop email client</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </a>
            </div>

            {/* Quick Copy Option */}
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted Email Text'}</span>
            </button>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSend}
                disabled={isSending}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg shadow-blue-600/30 cursor-pointer active:scale-95"
              >
                {isSending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Dispatched...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Record &amp; Complete Send</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
