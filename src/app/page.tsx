'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  EmailDraft, 
  ChecklistPoint, 
  ReferenceDocument, 
  ReviewResult, 
  GoogleDriveConfig, 
  AppSettings, 
  SampleEmailDemo,
  IssueFinding 
} from '@/types';
import { 
  loadChecklist, 
  saveChecklist, 
  resetChecklist,
  loadReferenceDocs, 
  saveReferenceDocs, 
  resetReferenceDocs,
  loadDriveConfig, 
  saveDriveConfig,
  loadReviewHistory, 
  saveReviewResult, 
  deleteReviewHistoryItem, 
  clearReviewHistory,
  loadSettings, 
  saveSettings,
  loadSavedDraft,
  saveDraft
} from '@/lib/storage';
import { reviewEmailDraft } from '@/lib/aiReviewEngine';
import { Header } from '@/components/navigation/Header';
import { SampleEmailSelector } from '@/components/editor/SampleEmailSelector';
import { DraftEditor } from '@/components/editor/DraftEditor';
import { ReviewWorkspace } from '@/components/review/ReviewWorkspace';
import { ChecklistManager } from '@/components/checklist/ChecklistManager';
import { GoogleDriveManager } from '@/components/drive/GoogleDriveManager';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ApprovalModal } from '@/components/approval/ApprovalModal';
import { SendEmailModal } from '@/components/approval/SendEmailModal';
import { SettingsModal } from '@/components/settings/SettingsModal';

export default function Home() {
  // State
  const [activeTab, setActiveTab] = useState<'workspace' | 'dashboard' | 'checklist' | 'drive' | 'settings'>('workspace');
  const [checklist, setChecklist] = useState<ChecklistPoint[]>([]);
  const [referenceDocs, setReferenceDocs] = useState<ReferenceDocument[]>([]);
  const [driveConfig, setDriveConfig] = useState<GoogleDriveConfig>({
    connected: true,
    folderId: '10g-Oakwood-ParentComms-2026',
    folderName: 'Oakwood Staff - Parent Communication Policies & Templates',
    lastSynced: '2026-09-18T14:30:00Z',
  });
  const [history, setHistory] = useState<ReviewResult[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    openaiApiKey: '',
    model: 'gpt-4o-mini',
    useOfflineEngine: false,
    checklistVersion: 'v1.0.0-demo',
    teacherName: 'Eleanor Vance',
    schoolName: 'Oakwood Middle School',
  });

  const [draft, setDraft] = useState<EmailDraft>({
    recipient: '',
    studentName: '',
    subject: '',
    body: '',
  });

  const [currentReviewResult, setCurrentReviewResult] = useState<ReviewResult | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [originalSnapshotBeforeFixes, setOriginalSnapshotBeforeFixes] = useState<string | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isInvalidated, setIsInvalidated] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const loadedChecklist = loadChecklist();
    const loadedDocs = loadReferenceDocs();
    const loadedDrive = loadDriveConfig();
    const loadedHistory = loadReviewHistory();
    const loadedSettings = loadSettings();
    const savedDraft = loadSavedDraft();

    setChecklist(loadedChecklist);
    setReferenceDocs(loadedDocs);
    setDriveConfig(loadedDrive);
    setHistory(loadedHistory);
    setSettings(loadedSettings);

    if (savedDraft && savedDraft.body) {
      setDraft(savedDraft);
    }
  }, []);

  // Invalidation detector: if approved email is modified, invalidate approval
  const prevDraftRef = useRef(draft);
  useEffect(() => {
    if (currentReviewResult && currentReviewResult.isApproved && currentReviewResult.approvalDetails) {
      const isBodyChanged = draft.body.trim() !== currentReviewResult.approvalDetails.approvedBody.trim();
      const isSubjChanged = draft.subject.trim() !== currentReviewResult.approvalDetails.approvedSubject.trim();

      if (isBodyChanged || isSubjChanged) {
        setIsInvalidated(true);
        setCurrentReviewResult(prev => prev ? { ...prev, isApproved: false, status: 'invalidated' } : null);
      }
    }
    prevDraftRef.current = draft;
  }, [draft, currentReviewResult]);

  // Handle Review Execution
  const handleRunReview = async () => {
    if (!draft.body.trim()) return;

    setIsReviewing(true);
    setIsInvalidated(false);

    try {
      const result = await reviewEmailDraft(
        draft,
        checklist,
        referenceDocs,
        settings.openaiApiKey,
        settings.model,
        settings.useOfflineEngine
      );

      setCurrentReviewResult(result);
      setOriginalSnapshotBeforeFixes(draft.body);
      saveReviewResult(result);
      setHistory(prev => [result, ...prev.filter(h => h.id !== result.id)]);
      saveDraft(draft);
    } catch (err) {
      console.error('Review failed:', err);
    } finally {
      setIsReviewing(false);
    }
  };

  // Sample email selection
  const handleSelectSample = (sample: SampleEmailDemo) => {
    setDraft({
      recipient: sample.recipient,
      studentName: sample.studentName,
      subject: sample.subject,
      body: sample.body,
    });
    setActiveSampleId(sample.id);
    setCurrentReviewResult(null);
    setIsInvalidated(false);
    setOriginalSnapshotBeforeFixes(null);
  };

  const handleClearDraft = () => {
    setDraft({
      recipient: '',
      studentName: '',
      subject: '',
      body: '',
    });
    setActiveSampleId(null);
    setCurrentReviewResult(null);
    setIsInvalidated(false);
    setOriginalSnapshotBeforeFixes(null);
  };

  // Apply single correction
  const handleApplyCorrection = (finding: IssueFinding) => {
    if (!currentReviewResult) return;

    if (!originalSnapshotBeforeFixes) {
      setOriginalSnapshotBeforeFixes(draft.body);
    }

    let updatedBody = draft.body;
    if (finding.exactText && finding.suggestedCorrection) {
      if (updatedBody.includes(finding.exactText)) {
        updatedBody = updatedBody.replace(finding.exactText, finding.suggestedCorrection);
      }
    }

    setDraft(prev => ({ ...prev, body: updatedBody }));

    // Mark finding as applied
    const updatedFindings = currentReviewResult.findings.map(f =>
      f.id === finding.id ? { ...f, applied: true } : f
    );

    setCurrentReviewResult({
      ...currentReviewResult,
      findings: updatedFindings,
      currentBody: updatedBody,
    });
  };

  // Apply all corrections
  const handleApplyAllCorrections = () => {
    if (!currentReviewResult) return;

    if (!originalSnapshotBeforeFixes) {
      setOriginalSnapshotBeforeFixes(draft.body);
    }

    setDraft(prev => ({
      ...prev,
      subject: currentReviewResult.subject || prev.subject,
      body: currentReviewResult.suggestedBody,
    }));

    const updatedFindings = currentReviewResult.findings.map(f => ({ ...f, applied: true }));

    setCurrentReviewResult({
      ...currentReviewResult,
      findings: updatedFindings,
      currentBody: currentReviewResult.suggestedBody,
    });
  };

  // Reset to original before corrections
  const handleResetToOriginal = () => {
    if (currentReviewResult) {
      setDraft(prev => ({
        ...prev,
        body: currentReviewResult.originalBody,
      }));
      const updatedFindings = currentReviewResult.findings.map(f => ({ ...f, applied: false }));
      setCurrentReviewResult({
        ...currentReviewResult,
        findings: updatedFindings,
        currentBody: currentReviewResult.originalBody,
      });
    }
  };

  // Dismiss finding
  const handleDismissFinding = (findingId: string) => {
    if (!currentReviewResult) return;
    const updatedFindings = currentReviewResult.findings.map(f =>
      f.id === findingId ? { ...f, dismissed: true } : f
    );
    setCurrentReviewResult({
      ...currentReviewResult,
      findings: updatedFindings,
    });
  };

  // Approval flow
  const handleApprove = (approverName: string, notes: string) => {
    if (!currentReviewResult) return;

    const approvalDetails = {
      approvedAt: new Date().toISOString(),
      approverName: approverName.trim() || settings.teacherName || 'Educator',
      verificationToken: `AUTH-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      notes,
      approvedSubject: draft.subject,
      approvedBody: draft.body,
    };

    const updatedResult: ReviewResult = {
      ...currentReviewResult,
      isApproved: true,
      status: 'approved',
      approvalDetails,
    };

    setCurrentReviewResult(updatedResult);
    setIsInvalidated(false);
    saveReviewResult(updatedResult);
    setHistory(prev => [updatedResult, ...prev.filter(h => h.id !== updatedResult.id)]);
  };

  // Send email simulation / confirmation
  const handleConfirmSend = () => {
    if (!currentReviewResult) return;

    const updatedResult: ReviewResult = {
      ...currentReviewResult,
      status: 'sent',
    };

    setCurrentReviewResult(updatedResult);
    saveReviewResult(updatedResult);
    setHistory(prev => [updatedResult, ...prev.filter(h => h.id !== updatedResult.id)]);
  };

  // Copy final email
  const handleCopyFinalEmail = () => {
    const textToCopy = `To: ${draft.recipient}\nSubject: ${draft.subject}\n\n${draft.body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  // Open past review in workspace
  const handleOpenReviewInWorkspace = (review: ReviewResult) => {
    setDraft({
      recipient: review.recipient,
      studentName: review.studentName,
      subject: review.subject,
      body: review.currentBody || review.suggestedBody || review.originalBody,
    });
    setCurrentReviewResult(review);
    setActiveTab('workspace');
    setIsInvalidated(review.status === 'invalidated');
  };

  // Delete history item
  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteReviewHistoryItem(id);
    setHistory(updated);
  };

  // Clear all history
  const handleClearAllHistory = () => {
    clearReviewHistory();
    setHistory([]);
  };

  // Checklist updates
  const handleSaveChecklist = (updated: ChecklistPoint[]) => {
    setChecklist(updated);
    saveChecklist(updated);
  };

  const handleResetChecklist = () => {
    const defaults = resetChecklist();
    setChecklist(defaults);
  };

  // Reference Docs updates
  const handleUpdateDocs = (updated: ReferenceDocument[]) => {
    setReferenceDocs(updated);
    saveReferenceDocs(updated);
  };

  const handleResetDocs = () => {
    const defaults = resetReferenceDocs();
    setReferenceDocs(defaults);
  };

  // Drive config updates
  const handleUpdateDriveConfig = (cfg: GoogleDriveConfig) => {
    setDriveConfig(cfg);
    saveDriveConfig(cfg);
  };

  // Settings updates
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleFactoryReset = () => {
    handleResetChecklist();
    handleResetDocs();
    handleClearAllHistory();
    handleClearDraft();
    alert('Factory reset complete! All defaults restored.');
  };

  const approvedDocsCount = referenceDocs.filter(d => d.status === 'Approved').length;
  const hasCorrectionsApplied = currentReviewResult?.findings.some(f => f.applied) ?? false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        driveConfig={driveConfig}
        approvedDocsCount={approvedDocsCount}
        openSettingsModal={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Workspace Tab */}
        {activeTab === 'workspace' && (
          <div className="space-y-6">
            {/* Demo Email Selector Bar */}
            <SampleEmailSelector
              onSelectSample={handleSelectSample}
              onClearDraft={handleClearDraft}
              activeSampleId={activeSampleId}
            />

            {/* Split Grid: Editor on Left, Review & Diff on Right */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
              {/* Left Column: Draft Editor */}
              <DraftEditor
                draft={draft}
                setDraft={setDraft}
                onReview={handleRunReview}
                isReviewing={isReviewing}
                isApproved={currentReviewResult?.isApproved ?? false}
                isInvalidated={isInvalidated}
                onResetToOriginal={handleResetToOriginal}
                hasCorrectionsApplied={hasCorrectionsApplied}
              />

              {/* Right Column: AI Review Agent Results & Side-by-Side Diff */}
              <ReviewWorkspace
                reviewResult={currentReviewResult}
                draft={draft}
                onApplyCorrection={handleApplyCorrection}
                onApplyAllCorrections={handleApplyAllCorrections}
                onDismissFinding={handleDismissFinding}
                onOpenApprovalModal={() => setIsApprovalModalOpen(true)}
                onOpenSendModal={() => setIsSendModalOpen(true)}
                onRerunReview={handleRunReview}
                copiedToast={copiedToast}
                onCopyFinalEmail={handleCopyFinalEmail}
              />
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <Dashboard
            history={history}
            onOpenReviewInWorkspace={handleOpenReviewInWorkspace}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            onClearAllHistory={handleClearAllHistory}
            onNavigateToTab={setActiveTab}
          />
        )}

        {/* Checklist Settings Tab */}
        {activeTab === 'checklist' && (
          <ChecklistManager
            checklist={checklist}
            onSaveChecklist={handleSaveChecklist}
            onResetChecklist={handleResetChecklist}
            version={settings.checklistVersion}
          />
        )}

        {/* Google Drive Tab */}
        {activeTab === 'drive' && (
          <GoogleDriveManager
            documents={referenceDocs}
            onUpdateDocuments={handleUpdateDocs}
            driveConfig={driveConfig}
            onUpdateDriveConfig={handleUpdateDriveConfig}
            onResetDocs={handleResetDocs}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Parent Email Review Agent • 10-Point Pre-Dispatch Quality Control</span>
          <span className="text-slate-400">Strict Student Privacy &amp; FERPA Grounded Architecture</span>
        </div>
      </footer>

      {/* Approval Modal */}
      {currentReviewResult && (
        <ApprovalModal
          isOpen={isApprovalModalOpen}
          onClose={() => setIsApprovalModalOpen(false)}
          reviewResult={currentReviewResult}
          draft={draft}
          defaultApproverName={settings.teacherName}
          onApprove={handleApprove}
        />
      )}

      {/* Send Email Modal */}
      {currentReviewResult && (
        <SendEmailModal
          isOpen={isSendModalOpen}
          onClose={() => setIsSendModalOpen(false)}
          reviewResult={currentReviewResult}
          draft={draft}
          onConfirmSend={handleConfirmSend}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onFactoryReset={handleFactoryReset}
      />
    </div>
  );
}
