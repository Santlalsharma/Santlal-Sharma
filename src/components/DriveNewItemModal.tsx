import React, { useState } from 'react';
import { FolderPlus, FileText, Sheet, FileCode, X, Loader2, AlertCircle } from 'lucide-react';

interface DriveNewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (name: string) => Promise<void>;
  onCreateDoc: (name: string, type: 'document' | 'spreadsheet' | 'text') => Promise<void>;
  currentFolderName: string;
  darkMode: boolean;
}

export const DriveNewItemModal: React.FC<DriveNewItemModalProps> = ({
  isOpen,
  onClose,
  onCreateFolder,
  onCreateDoc,
  currentFolderName,
  darkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'folder' | 'document' | 'spreadsheet' | 'text'>('folder');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a name.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      if (activeTab === 'folder') {
        await onCreateFolder(trimmed);
      } else {
        await onCreateDoc(trimmed, activeTab);
      }
      setName('');
      onClose();
    } catch (err: any) {
      console.error('Creation error:', err);
      setError(err.message || 'Failed to create item in Google Drive.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-all ${
          darkMode
            ? 'bg-neutral-900 border-neutral-800 text-neutral-100'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="font-bold text-base sm:text-lg">Create New Item</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Inside: <span className="font-semibold text-orange-500">{currentFolderName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Selectors */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('folder');
              setError(null);
            }}
            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all ${
              activeTab === 'folder'
                ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                : darkMode
                ? 'border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-neutral-300'
                : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50 text-neutral-700'
            }`}
          >
            <FolderPlus className="w-4 h-4 text-amber-500" />
            <span>New Folder</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('document');
              setError(null);
            }}
            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all ${
              activeTab === 'document'
                ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                : darkMode
                ? 'border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-neutral-300'
                : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50 text-neutral-700'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-500" />
            <span>Google Doc</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('spreadsheet');
              setError(null);
            }}
            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all ${
              activeTab === 'spreadsheet'
                ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                : darkMode
                ? 'border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-neutral-300'
                : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50 text-neutral-700'
            }`}
          >
            <Sheet className="w-4 h-4 text-emerald-500" />
            <span>Google Sheet</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('text');
              setError(null);
            }}
            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all ${
              activeTab === 'text'
                ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                : darkMode
                ? 'border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-neutral-300'
                : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50 text-neutral-700'
            }`}
          >
            <FileCode className="w-4 h-4 text-purple-500" />
            <span>Text / Note</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              {activeTab === 'folder' ? 'Folder Name' : 'Document Title'}
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                activeTab === 'folder'
                  ? 'e.g., Client Proposals 2026'
                  : activeTab === 'document'
                  ? 'e.g., Project Specification'
                  : activeTab === 'spreadsheet'
                  ? 'e.g., Milestone Budget & Rates'
                  : 'e.g., notes.txt'
              }
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${
                darkMode
                  ? 'bg-neutral-950 border-neutral-800 text-neutral-100 placeholder-neutral-600'
                  : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
              }`}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${
                darkMode
                  ? 'border-neutral-700 hover:bg-neutral-800 text-neutral-300'
                  : 'border-neutral-300 hover:bg-neutral-100 text-neutral-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className={`px-5 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all ${
                !name.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating in Drive...</span>
                </>
              ) : (
                <span>Create in Drive</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
