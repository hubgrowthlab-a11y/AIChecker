export type FindingStatus = 'Pass' | 'Fail' | 'Needs Review' | 'Not Applicable';
export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type DocumentStatus = 'Approved' | 'Unapproved' | 'Excluded';

export interface ChecklistPoint {
  id: string;
  order: number;
  title: string;
  description: string;
  category: 'tone' | 'grammar' | 'accuracy' | 'privacy' | 'structure' | 'custom';
  severity: SeverityLevel;
  isMandatory: boolean;
  isActive: boolean;
  guidelines: string;
  goodExamples?: string[];
  badExamples?: string[];
}

export interface IssueFinding {
  id: string;
  checklistId: string;
  checklistTitle: string;
  status: FindingStatus;
  severity: SeverityLevel;
  explanation: string;
  exactText: string;
  suggestedCorrection: string;
  applied?: boolean;
  dismissed?: boolean;
  referenceDocName?: string;
  referenceExcerpt?: string;
  confidenceScore?: number;
}

export interface ApprovalDetails {
  approvedAt: string;
  approverName: string;
  verificationToken: string;
  notes?: string;
  approvedSubject: string;
  approvedBody: string;
}

export interface ReviewResult {
  id: string;
  timestamp: string;
  recipient: string;
  studentName: string;
  subject: string;
  originalBody: string;
  suggestedBody: string;
  currentBody: string; // The active editable body with applied corrections
  findings: IssueFinding[];
  overallScore: number;
  summary: string;
  isApproved: boolean;
  approvalDetails?: ApprovalDetails;
  status: 'draft' | 'reviewed' | 'approved' | 'sent' | 'invalidated';
  checklistVersion: string;
}

export interface EmailDraft {
  recipient: string;
  studentName: string;
  subject: string;
  body: string;
}

export interface SampleEmailDemo {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  recipient: string;
  studentName: string;
  subject: string;
  body: string;
  description: string;
  expectedOutcome: string;
  keyIssues: string[];
}

export interface ReferenceDocument {
  id: string;
  title: string;
  filename: string;
  type: 'gdoc' | 'pdf' | 'docx' | 'txt';
  folder: string;
  status: DocumentStatus;
  lastUpdated: string;
  size: string;
  summary: string;
  content: string;
  category: 'policy' | 'privacy' | 'template' | 'tone' | 'incident';
}

export interface GoogleDriveConfig {
  connected: boolean;
  folderId: string;
  folderName: string;
  lastSynced: string | null;
  accountEmail?: string;
}

export interface AppSettings {
  openaiApiKey: string;
  model: string;
  useOfflineEngine: boolean;
  checklistVersion: string;
  teacherName: string;
  schoolName: string;
}
