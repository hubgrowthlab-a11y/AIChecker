'use client';

import React, { useState } from 'react';
import { ChecklistPoint, SeverityLevel } from '@/types';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  Download, 
  Upload, 
  Eye, 
  EyeOff, 
  X, 
  Save, 
  Tag, 
  Sparkles 
} from 'lucide-react';

interface ChecklistManagerProps {
  checklist: ChecklistPoint[];
  onSaveChecklist: (updated: ChecklistPoint[]) => void;
  onResetChecklist: () => void;
  version: string;
}

export const ChecklistManager: React.FC<ChecklistManagerProps> = ({
  checklist,
  onSaveChecklist,
  onResetChecklist,
  version,
}) => {
  const [editingPoint, setEditingPoint] = useState<ChecklistPoint | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Reordering helpers
  const movePoint = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= checklist.length) return;

    const updated = [...checklist];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Update orders
    const reordered = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    onSaveChecklist(reordered);
  };

  const toggleActive = (id: string) => {
    const updated = checklist.map(p => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    onSaveChecklist(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this quality-control checklist point?')) {
      const updated = checklist.filter(p => p.id !== id).map((item, idx) => ({ ...item, order: idx + 1 }));
      onSaveChecklist(updated);
    }
  };

  const handleSaveModal = (point: ChecklistPoint) => {
    if (isCreatingNew) {
      const newPoint: ChecklistPoint = {
        ...point,
        id: `chk-${Date.now()}`,
        order: checklist.length + 1,
      };
      onSaveChecklist([...checklist, newPoint]);
    } else {
      const updated = checklist.map(p => (p.id === point.id ? point : p));
      onSaveChecklist(updated);
    }
    setEditingPoint(null);
    setIsCreatingNew(false);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(checklist, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `parent_email_checklist_${version}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onSaveChecklist(parsed);
          alert('Checklist imported successfully!');
        }
      } catch (err) {
        alert('Invalid JSON checklist file');
      }
    };
    reader.readAsText(file);
  };

  const openNewModal = () => {
    setIsCreatingNew(true);
    setEditingPoint({
      id: '',
      order: checklist.length + 1,
      title: '',
      description: '',
      category: 'custom',
      severity: 'Medium',
      isMandatory: false,
      isActive: true,
      guidelines: '',
      goodExamples: [''],
      badExamples: [''],
    });
  };

  const filteredChecklist = checklist.filter(
    p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-white">Quality-Control Checklist Rules</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Version {version}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Manage the 10 quality control rules evaluated on every email. Replace placeholders with your official school standards anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={openNewModal}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-blue-600/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Checklist Point</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition"
              title="Export Checklist to JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <label className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={() => {
                if (confirm('Reset checklist to default 10 demo quality-control points?')) {
                  onResetChecklist();
                }
              }}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 text-xs font-medium rounded-xl border border-slate-700 transition"
              title="Reset to original 10 demo points"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Search and Summary */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Search checklist rules, keywords, or categories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />

          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <span>Total Points: <strong>{checklist.length}</strong></span>
            <span>•</span>
            <span>Active: <strong className="text-emerald-400">{checklist.filter(p => p.isActive).length}</strong></span>
            <span>•</span>
            <span>Mandatory: <strong className="text-rose-400">{checklist.filter(p => p.isMandatory).length}</strong></span>
          </div>
        </div>
      </div>

      {/* Checklist Points Table / Cards */}
      <div className="space-y-3">
        {filteredChecklist.map((point, index) => {
          return (
            <div
              key={point.id}
              className={`rounded-2xl border p-4 transition-all ${
                point.isActive
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Left: Reorder, Order number, Title, Badges */}
                <div className="flex items-start space-x-3">
                  {/* Up/Down buttons */}
                  <div className="flex flex-col space-y-1 mt-0.5">
                    <button
                      onClick={() => movePoint(index, 'up')}
                      disabled={index === 0}
                      className={`p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition ${
                        index === 0 ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => movePoint(index, 'down')}
                      disabled={index === checklist.length - 1}
                      className={`p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition ${
                        index === checklist.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-slate-500">#{point.order}</span>
                      <h3 className="text-sm font-bold text-white">{point.title}</h3>
                      
                      {/* Severity Pill */}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        point.severity === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                          : point.severity === 'High'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                          : 'bg-blue-950 text-blue-300 border border-blue-800/60'
                      }`}>
                        {point.severity}
                      </span>

                      {/* Mandatory Badge */}
                      {point.isMandatory && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                          Mandatory
                        </span>
                      )}

                      {/* Category */}
                      <span className="px-2 py-0.5 rounded text-[10px] text-slate-400 bg-slate-950 border border-slate-800 capitalize">
                        {point.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 max-w-3xl">
                      {point.description}
                    </p>
                  </div>
                </div>

                {/* Right: Controls & Toggles */}
                <div className="flex items-center space-x-2 shrink-0 self-end lg:self-center">
                  <button
                    onClick={() => toggleActive(point.id)}
                    className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                      point.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                    }`}
                    title={point.isActive ? 'Disable Point' : 'Enable Point'}
                  >
                    {point.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{point.isActive ? 'Active' : 'Disabled'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsCreatingNew(false);
                      setEditingPoint(point);
                    }}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                    title="Edit Point"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(point.id)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                    title="Delete Point"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Guidelines Snippet Preview */}
              {point.guidelines && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-start space-x-1.5">
                  <strong className="text-slate-300 shrink-0">Agent Instructions:</strong>
                  <span className="truncate">{point.guidelines}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit / Create Modal */}
      {editingPoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {isCreatingNew ? 'Add New Quality-Control Point' : `Edit Point #${editingPoint.order}: ${editingPoint.title}`}
              </h3>
              <button
                onClick={() => setEditingPoint(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Checklist Title</label>
                <input
                  type="text"
                  value={editingPoint.title}
                  onChange={e => setEditingPoint({ ...editingPoint, title: e.target.value })}
                  placeholder="e.g. Accurate meeting time and location"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingPoint.description}
                  onChange={e => setEditingPoint({ ...editingPoint, description: e.target.value })}
                  placeholder="Explain what this rule verifies..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category, Severity, Mandatory Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={editingPoint.category}
                    onChange={e => setEditingPoint({ ...editingPoint, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="tone">Tone &amp; Professionalism</option>
                    <option value="grammar">Grammar &amp; Spelling</option>
                    <option value="structure">Structure &amp; Subject</option>
                    <option value="accuracy">Accuracy &amp; Dates</option>
                    <option value="privacy">Student Privacy &amp; FERPA</option>
                    <option value="custom">Custom Policy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Severity</label>
                  <select
                    value={editingPoint.severity}
                    onChange={e => setEditingPoint({ ...editingPoint, severity: e.target.value as SeverityLevel })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Critical">Critical (Blocks Approval)</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPoint.isMandatory}
                      onChange={e => setEditingPoint({ ...editingPoint, isMandatory: e.target.checked })}
                      className="rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Mandatory Rule</span>
                  </label>
                </div>
              </div>

              {/* Review Guidelines / Instructions for AI */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  AI Review Instructions &amp; Evaluation Guidelines
                </label>
                <textarea
                  rows={3}
                  value={editingPoint.guidelines}
                  onChange={e => setEditingPoint({ ...editingPoint, guidelines: e.target.value })}
                  placeholder="Instructions for how the AI review engine should identify violations and suggest corrections..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingPoint(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveModal(editingPoint)}
                disabled={!editingPoint.title.trim()}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Checklist Point</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
