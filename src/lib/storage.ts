import { ChecklistPoint, ReferenceDocument, ReviewResult, GoogleDriveConfig, AppSettings, EmailDraft } from '@/types';
import { DEFAULT_CHECKLIST_POINTS, CHECKLIST_VERSION } from './defaultChecklist';
import { DEFAULT_REFERENCE_DOCUMENTS } from './referenceDocs';

const STORAGE_KEYS = {
  CHECKLIST: 'parent_email_agent_checklist_v1',
  CHECKLIST_VER: 'parent_email_agent_checklist_version',
  DOCS: 'parent_email_agent_docs_v1',
  DRIVE_CFG: 'parent_email_agent_drive_cfg_v1',
  HISTORY: 'parent_email_agent_history_v1',
  SETTINGS: 'parent_email_agent_settings_v1',
  CURRENT_DRAFT: 'parent_email_agent_current_draft_v1',
};

export const DEFAULT_SETTINGS: AppSettings = {
  openaiApiKey: '',
  model: 'gpt-4o-mini',
  useOfflineEngine: false,
  checklistVersion: CHECKLIST_VERSION,
  teacherName: 'Eleanor Vance',
  schoolName: 'Oakwood Middle School',
};

export const DEFAULT_DRIVE_CONFIG: GoogleDriveConfig = {
  connected: false,
  folderId: '10g-StJude-ParentComms-2026-Archive',
  folderName: 'Oakwood Staff - Parent Communication Policies & Templates',
  lastSynced: '2026-09-18T14:30:00Z',
  accountEmail: 'eleanor.vance@oakwoodschools.edu',
};

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function loadChecklist(): ChecklistPoint[] {
  if (!isClient()) return DEFAULT_CHECKLIST_POINTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load checklist from localStorage:', e);
  }
  return DEFAULT_CHECKLIST_POINTS;
}

export function saveChecklist(points: ChecklistPoint[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(points));
  } catch (e) {
    console.error('Failed to save checklist to localStorage:', e);
  }
}

export function resetChecklist(): ChecklistPoint[] {
  if (isClient()) {
    try {
      localStorage.removeItem(STORAGE_KEYS.CHECKLIST);
    } catch (e) {
      console.error('Failed to reset checklist:', e);
    }
  }
  return DEFAULT_CHECKLIST_POINTS;
}

export function loadReferenceDocs(): ReferenceDocument[] {
  if (!isClient()) return DEFAULT_REFERENCE_DOCUMENTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DOCS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load reference docs:', e);
  }
  return DEFAULT_REFERENCE_DOCUMENTS;
}

export function saveReferenceDocs(docs: ReferenceDocument[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(docs));
  } catch (e) {
    console.error('Failed to save reference docs:', e);
  }
}

export function resetReferenceDocs(): ReferenceDocument[] {
  if (isClient()) {
    try {
      localStorage.removeItem(STORAGE_KEYS.DOCS);
    } catch (e) {
      console.error('Failed to reset reference docs:', e);
    }
  }
  return DEFAULT_REFERENCE_DOCUMENTS;
}

export function loadDriveConfig(): GoogleDriveConfig {
  if (!isClient()) return DEFAULT_DRIVE_CONFIG;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DRIVE_CFG);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load drive config:', e);
  }
  return DEFAULT_DRIVE_CONFIG;
}

export function saveDriveConfig(cfg: GoogleDriveConfig): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.DRIVE_CFG, JSON.stringify(cfg));
  } catch (e) {
    console.error('Failed to save drive config:', e);
  }
}

export function loadReviewHistory(): ReviewResult[] {
  if (!isClient()) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load review history:', e);
  }
  return [];
}

export function saveReviewResult(result: ReviewResult): void {
  if (!isClient()) return;
  try {
    const existing = loadReviewHistory();
    const index = existing.findIndex(r => r.id === result.id);
    let updated: ReviewResult[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = result;
    } else {
      updated = [result, ...existing].slice(0, 50); // Keep last 50
    }
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save review result:', e);
  }
}

export function deleteReviewHistoryItem(id: string): ReviewResult[] {
  if (!isClient()) return [];
  try {
    const existing = loadReviewHistory();
    const updated = existing.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete history item:', e);
    return [];
  }
}

export function clearReviewHistory(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}

export function loadSettings(): AppSettings {
  if (!isClient()) return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadSavedDraft(): EmailDraft | null {
  if (!isClient()) return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_DRAFT);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load draft:', e);
  }
  return null;
}

export function saveDraft(draft: EmailDraft): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_DRAFT, JSON.stringify(draft));
  } catch (e) {
    console.error('Failed to save draft:', e);
  }
}
