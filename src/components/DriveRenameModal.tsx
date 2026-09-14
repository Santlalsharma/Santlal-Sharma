import React, { useState, useEffect } from 'react';
import { Edit3, X, Loader2, AlertCircle } from 'lucide-react';
import { DriveFile } from '../services/googleDriveService';

interface DriveRenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: DriveFile | null;
  onRename: (fileId: string, newName: string) => Promise<void>;
  darkMode: boolean;
}

export const DriveRenameModal: React.FC<DriveRenameModalProps> = ({
  isOpen,
  onClose,
  file,
  onRename,
  darkMode,
}) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      setName(file.name);
      setError(null);
    }
  }, [file]);

  if (!isOpen || !file) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a valid file name.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onRename(file.id, trimmed);
      onClose();
    } catch (err: any) {
      console.error('Rename error:', err);
      setError(err.message || 'Failed to rename item.');
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
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Rename Item</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Update item name in Google Drive
              </p>
            </div>
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              New Name
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${
                darkMode
                  ? 'bg-neutral-950 border-neutral-800 text-neutral-100'
                  : 'bg-neutral-50 border-neutral-300 text-neutral-900'
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
                  <span>Renaming...</span>
                </>
              ) : (
                <span>Save New Name</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
