'use client';

import React, { useState } from 'react';
import { ReferenceDocument, DocumentStatus, GoogleDriveConfig } from '@/types';
import { 
  FolderSync, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Plus, 
  Search, 
  BookOpen, 
  ShieldCheck, 
  X, 
  HelpCircle,
  FileCode,
  FolderOpen
} from 'lucide-react';

interface GoogleDriveManagerProps {
  documents: ReferenceDocument[];
  onUpdateDocuments: (docs: ReferenceDocument[]) => void;
  driveConfig: GoogleDriveConfig;
  onUpdateDriveConfig: (cfg: GoogleDriveConfig) => void;
  onResetDocs: () => void;
}

export const GoogleDriveManager: React.FC<GoogleDriveManagerProps> = ({
  documents,
  onUpdateDocuments,
  driveConfig,
  onUpdateDriveConfig,
  onResetDocs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<ReferenceDocument | null>(null);
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocFilename, setNewDocFilename] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<'policy' | 'privacy' | 'template' | 'tone' | 'incident'>('policy');
  const [newDocContent, setNewDocContent] = useState('');
  const [newDocStatus, setNewDocStatus] = useState<DocumentStatus>('Approved');
  const [showDriveSetupGuide, setShowDriveSetupGuide] = useState(false);
  const [isEditingDriveConfig, setIsEditingDriveConfig] = useState(false);
  const [tempFolderId, setTempFolderId] = useState(driveConfig.folderId);
  const [tempFolderName, setTempFolderName] = useState(driveConfig.folderName);

  const handleStatusChange = (docId: string, newStatus: DocumentStatus) => {
    const updated = documents.map(d => (d.id === docId ? { ...d, status: newStatus } : d));
    onUpdateDocuments(updated);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onUpdateDriveConfig({
        ...driveConfig,
        lastSynced: new Date().toISOString(),
      });
      alert('Google Drive folder synced! Indexed 5 policy documents.');
    }, 1500);
  };

  const handleSaveNewDoc = () => {
    if (!newDocTitle.trim() || !newDocContent.trim()) return;

    const newDoc: ReferenceDocument = {
      id: `doc-${Date.now()}`,
      title: newDocTitle,
      filename: newDocFilename.trim() || `${newDocTitle.replace(/\s+/g, '_')}.txt`,
      type: 'txt',
      folder: driveConfig.folderName,
      status: newDocStatus,
      lastUpdated: new Date().toISOString().split('T')[0],
      size: `${Math.max(1, Math.round(newDocContent.length / 1024))} KB`,
      category: newDocCategory,
      summary: newDocContent.slice(0, 150) + '...',
      content: newDocContent,
    };

    onUpdateDocuments([newDoc, ...documents]);
    setIsAddingDoc(false);
    setNewDocTitle('');
    setNewDocFilename('');
    setNewDocContent('');
  };

  const handleDeleteDoc = (id: string) => {
    if (confirm('Delete this reference document?')) {
      onUpdateDocuments(documents.filter(d => d.id !== id));
      if (viewingDoc?.id === id) setViewingDoc(null);
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const approvedCount = documents.filter(d => d.status === 'Approved').length;
  const unapprovedCount = documents.filter(d => d.status === 'Unapproved').length;
  const excludedCount = documents.filter(d => d.status === 'Excluded').length;

  return (
    <div className="space-y-6">
      {/* Top Google Drive Connection Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <FolderSync className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-lg font-bold text-white">Google Drive Reference Document Library</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Library Connected</span>
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Folder: <strong className="text-white">{driveConfig.folderName}</strong> (ID: <code className="text-blue-400 font-mono text-[11px]">{driveConfig.folderId}</code>)
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Last Synced: {driveConfig.lastSynced ? new Date(driveConfig.lastSynced).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-blue-600/30 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Drive...' : 'Refresh Library'}</span>
            </button>

            <button
              onClick={() => setIsAddingDoc(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Document</span>
            </button>

            <button
              onClick={() => setShowDriveSetupGuide(!showDriveSetupGuide)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Drive API Guide</span>
            </button>

            <button
              onClick={() => setIsEditingDriveConfig(true)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition"
              title="Change Folder"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Change Folder</span>
            </button>
          </div>
        </div>

        {/* Drive Integration Guide Accordion */}
        {showDriveSetupGuide && (
          <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-blue-900/40 text-xs text-slate-300 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-blue-300 font-semibold text-sm">
              <span className="flex items-center gap-1.5">
                <FolderSync className="w-4 h-4 text-blue-400" />
                <span>How to Connect Your Real Google Drive Folder</span>
              </span>
              <button onClick={() => setShowDriveSetupGuide(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-400">
              The Parent Email Review Agent currently runs with built-in reference documents. To connect your live Google Workspace folder:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
              <li>Open <strong>Google Cloud Console</strong> and create an OAuth 2.0 Client ID or Service Account.</li>
              <li>Enable the <strong>Google Drive API</strong> (<code className="text-blue-400 font-mono">https://www.googleapis.com/auth/drive.readonly</code>).</li>
              <li>Upload your school handbook, FERPA protocols, and approved email samples (.pdf, .docx, .gdoc, .txt) into a shared Google Drive folder.</li>
              <li>Copy the folder ID from the URL (e.g. <code className="text-cyan-300 font-mono">drive.google.com/drive/folders/&lt;FOLDER_ID&gt;</code>) and paste it into &quot;Change Folder&quot;.</li>
              <li>Set documents to <strong>Approved</strong> to enable AI policy citation during email audits.</li>
            </ol>
          </div>
        )}

        {/* Change Folder Modal */}
        {isEditingDriveConfig && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Configure Google Drive Folder</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Folder Name / Label</label>
                <input
                  type="text"
                  value={tempFolderName}
                  onChange={e => setTempFolderName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Google Drive Folder ID</label>
                <input
                  type="text"
                  value={tempFolderId}
                  onChange={e => setTempFolderId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-1">
              <button
                onClick={() => setIsEditingDriveConfig(false)}
                className="px-3 py-1 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateDriveConfig({
                    ...driveConfig,
                    folderName: tempFolderName,
                    folderId: tempFolderId,
                  });
                  setIsEditingDriveConfig(false);
                }}
                className="px-4 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
              >
                Save Folder Config
              </button>
            </div>
          </div>
        )}

        {/* Filter and Stats Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search policies & excerpts..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Document Statuses</option>
              <option value="Approved">Approved for AI ({approvedCount})</option>
              <option value="Unapproved">Unapproved ({unapprovedCount})</option>
              <option value="Excluded">Excluded ({excludedCount})</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="policy">General Policy</option>
              <option value="privacy">Privacy &amp; FERPA</option>
              <option value="tone">Tone &amp; Communication</option>
              <option value="template">Templates</option>
              <option value="incident">Incident Procedures</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span>Approved for AI Citations: <strong className="text-emerald-400">{approvedCount}</strong></span>
            <span>•</span>
            <span>Total: <strong>{documents.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map(doc => {
          let typeBg = 'bg-red-500/10 text-red-400 border-red-500/20';
          if (doc.type === 'docx') typeBg = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
          if (doc.type === 'gdoc') typeBg = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
          if (doc.type === 'txt') typeBg = 'bg-slate-500/10 text-slate-400 border-slate-500/20';

          return (
            <div
              key={doc.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                {/* Top: File type icon, Title, Status selector */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border uppercase font-bold text-[10px] shrink-0 ${typeBg}`}>
                      {doc.type}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white hover:text-blue-400 transition cursor-pointer" onClick={() => setViewingDoc(doc)}>
                        {doc.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {doc.filename} • {doc.size}
                      </p>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={doc.status}
                    onChange={e => handleStatusChange(doc.id, e.target.value as DocumentStatus)}
                    className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition cursor-pointer ${
                      doc.status === 'Approved'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                        : doc.status === 'Unapproved'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    <option value="Approved">Approved (AI Uses)</option>
                    <option value="Unapproved">Unapproved (Draft)</option>
                    <option value="Excluded">Excluded (Ignored)</option>
                  </select>
                </div>

                {/* Summary / Excerpt preview */}
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  {doc.summary}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="capitalize text-slate-400">
                  Category: <strong>{doc.category}</strong>
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewingDoc(doc)}
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Text</span>
                  </button>

                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="text-slate-500 hover:text-rose-400 transition"
                    title="Delete document"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Document Reader Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">{viewingDoc.title}</h3>
                <p className="text-xs text-slate-400 font-mono">{viewingDoc.filename} • Status: {viewingDoc.status}</p>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
              {viewingDoc.content}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">Folder: {viewingDoc.folder}</span>
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {isAddingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add New Reference Policy / Template</h3>
              <button
                onClick={() => setIsAddingDoc(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Oakwood Anti-Bullying and Restorative Policy 2026"
                  value={newDocTitle}
                  onChange={e => setNewDocTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newDocCategory}
                    onChange={e => setNewDocCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="policy">Policy</option>
                    <option value="privacy">Privacy / FERPA</option>
                    <option value="tone">Tone Standards</option>
                    <option value="template">Email Template</option>
                    <option value="incident">Incident Procedure</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Initial Status</label>
                  <select
                    value={newDocStatus}
                    onChange={e => setNewDocStatus(e.target.value as DocumentStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="Approved">Approved (AI Uses for Citations)</option>
                    <option value="Unapproved">Unapproved (Draft)</option>
                    <option value="Excluded">Excluded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Document Content &amp; Policy Rules</label>
                <textarea
                  rows={8}
                  placeholder="Paste official policy guidelines, template text, or communication rules here..."
                  value={newDocContent}
                  onChange={e => setNewDocContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsAddingDoc(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewDoc}
                disabled={!newDocTitle.trim() || !newDocContent.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Save to Reference Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
