import React from 'react';
import { AlertTriangle, Trash2, X, AlertCircle } from 'lucide-react';

interface DriveConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  darkMode: boolean;
}

export const DriveConfirmDialog: React.FC<DriveConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  itemName,
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
  darkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
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
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              isDestructive
                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
            }`}
          >
            {isDestructive ? (
              <Trash2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold tracking-tight">{title}</h3>
            <p
              className={`mt-1.5 text-sm leading-relaxed ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              {message}
            </p>

            {itemName && (
              <div
                className={`mt-3 px-3 py-2 rounded-xl text-xs font-mono font-medium truncate border ${
                  darkMode
                    ? 'bg-neutral-950 border-neutral-800 text-neutral-300'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                }`}
              >
                {itemName}
              </div>
            )}
          </div>

          <button
            onClick={onCancel}
            disabled={isLoading}
            className={`p-1.5 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning notice */}
        <div
          className={`mt-5 px-3 py-2.5 rounded-xl text-xs flex items-center gap-2 ${
            isDestructive
              ? 'bg-red-500/5 text-red-400 border border-red-500/20'
              : 'bg-amber-500/5 text-amber-500 border border-amber-500/20'
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            {isDestructive
              ? 'This operation updates your Google Drive cloud storage with user permission.'
              : 'Please verify the changes before proceeding.'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${
              darkMode
                ? 'border-neutral-700 hover:bg-neutral-800 text-neutral-300'
                : 'border-neutral-300 hover:bg-neutral-100 text-neutral-700'
            }`}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-semibold rounded-xl text-white shadow-md transition-all flex items-center gap-2 ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-500 shadow-red-600/25 active:scale-95'
                : 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/25 active:scale-95'
            } ${isLoading ? 'opacity-60 cursor-wait' : ''}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
