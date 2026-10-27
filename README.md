# Parent Email Review Agent 🛡️✉️

An intelligent, quality-control web application designed for school staff, teachers, and administrators. It audits parent email drafts against **10 quality-control rules**, detects errors, catches student privacy/FERPA violations, retrieves guidance from **Google Drive reference policies**, and guides educators through a formal approval workflow.

---

## 🌟 Key Features

### 1. Dual AI Review Engine
* **Smart Built-in Offline Intelligence**: Works 100% out of the box with zero setup or API keys required. Performs heuristic, grammatical, tone, and FERPA privacy audits instantly in your browser.
* **Live OpenAI Integration**: Seamlessly switch to OpenAI (`gpt-4o-mini`, `gpt-4o`) for cloud-based deep reasoning by adding your API key in Settings or `.env`.
* **Grounded AI Guarantee**: The agent never fabricates policies, grades, dates, or student facts. Uncertain details are flagged for human teacher verification.

### 2. Interactive Email Draft Workspace
* **Recipient, Student Name, Subject, and Body** editor with live character, word, and reading-time counters.
* **1-Click Demo Email Loader** to test good emails, error-prone drafts, and sensitive privacy breaches.
* **Side-by-Side Diff Comparison** to preview original vs. AI-suggested drafts.
* **1-Click Quick Fixes**: Apply individual corrections, apply all suggestions, or manually refine text.
* **Revert & Undo Stack**: Revert changes back to the original draft with one click.

### 3. Editable 10-Point Checklist Manager
Pre-loaded with 10 editable demo points (ready to replace with your official school board standards):
1. **Professional and respectful tone** (Mandatory, High Severity)
2. **Grammar and spelling** (Mandatory, Medium Severity)
3. **Clear and relevant subject line** (Mandatory, Medium Severity)
4. **Correct parent and student names** (Mandatory, Critical Severity)
5. **Clarity of the message** (Medium Severity)
6. **Correct dates, times, and deadlines** (Mandatory, Critical Severity)
7. **Accuracy and consistency of information** (High Severity)
8. **Appropriate and sensitive language** (Mandatory, High Severity)
9. **Clear next steps for parents** (Medium Severity)
10. **Student privacy and confidentiality / FERPA** (Mandatory, Critical Severity)

* **Management Capabilities**: Add new points, edit descriptions, adjust severity (`Critical`, `High`, `Medium`, `Low`), toggle mandatory flags, reorder rules, and export/import checklists via JSON.
* **Checklist Versioning**: Supports version tags (`v1.0.0-demo`, `v2.0-custom`) without requiring code changes.

### 4. Google Drive & Reference Document Knowledge Base
* **Document Library**: Index, view, and search school handbooks, FERPA directives, tone guidelines, and templates (.pdf, .docx, .gdoc, .txt).
* **Document Status Controls**: Mark documents as **Approved** (actively cited in reviews), **Unapproved** (draft), or **Excluded** (ignored).
* **Live Excerpt Citations**: Shows exact policy document names and quoted excerpts in the review findings.
* **Drive Setup Wizard**: Instructions on connecting Google Cloud OAuth 2.0 or Service Account credentials.

### 5. 3 Realistic Fictional Demo Emails
* **🟢 Example A (Good Email)**: Professional homework reminder with clear subject, polite tone, specific deadline, and teacher contact hours.
* **🟠 Example B (Email with Errors)**: Grammar mistakes, typos, vague subject (`"urgent homework issue"`), accusatory tone, and punitive language.
* **🔴 Example C (Sensitive Email / FERPA Breach)**: Behavioral incident that inappropriately names a peer student (`"Ethan Miller"`), reveals medical details, and mentions third-party parental demands.

### 6. Formal Approval & Security Invalidation Gate
* **Approval Signoff**: Requires resolving or acknowledging critical issues, certifying student privacy, stamping an approver signature, timestamp, and unique verification token.
* **Post-Approval Invalidation**: If the draft text is modified after approval, the approval state is immediately invalidated, preventing unauthorized dispatch.
* **Email Dispatch**: 1-click formatted copy, direct **Gmail Web pre-fill link**, and **Outlook/mailto:** desktop integration.

### 7. Dashboard & Audit History
* Real-time metrics: Total Emails Reviewed, Approved Count, Critical Interceptions, Awaiting Review.
* Searchable audit log of past reviews with score badges and printable compliance reports.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
* Node.js v18+ (tested on Node.js v20 / v26)
* npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd "email checker"
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(You can leave `.env.local` empty to use the built-in offline review engine).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Replacing the 10 Demo Rules with Your School's Requirements

You can customize the checklist in two ways:

### Option A: Using the In-App Checklist Manager
1. Navigate to the **"10-Point QC"** tab in the navigation bar.
2. Click **"Add Checklist Point"** or click the **Edit (pencil)** icon on any existing point.
3. Update the title, description, category, severity level, mandatory status, and AI review instructions.
4. Click **"Export JSON"** to save your school's customized checklist profile.

### Option B: Modifying the Default Code Template
Edit `src/lib/defaultChecklist.ts` to define your organization's permanent defaults:
```typescript
export const DEFAULT_CHECKLIST_POINTS: ChecklistPoint[] = [
  {
    id: 'chk-1',
    order: 1,
    title: 'Your School Official Standard',
    description: 'Specific description of requirement',
    category: 'tone',
    severity: 'High',
    isMandatory: true,
    isActive: true,
    guidelines: 'Instructions for AI evaluation...',
  },
  // ...
];
```

---

## 📁 Google Drive Integration Guide

To connect your organization's Google Drive folder:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and enable the **Google Drive API**.
3. Create an **OAuth 2.0 Client ID** or **Service Account**.
4. In the app, navigate to the **"Google Drive"** tab and click **"Change Folder"**.
5. Enter your Google Drive Folder ID (found in your Drive folder URL: `drive.google.com/drive/folders/<FOLDER_ID>`).
6. Mark your uploaded policy documents as **Approved** so the review agent can cite them.

---

## 🗄️ Database Setup (PostgreSQL with Prisma)

If you wish to deploy with a persistent PostgreSQL database:
1. Set `DATABASE_URL` in `.env.local`.
2. Generate the Prisma client:
```bash
npx prisma generate
```
3. Push schema to your database:
```bash
npx prisma db push
```

---

## 📦 Production Build

```bash
npm run build
npm run start
```
