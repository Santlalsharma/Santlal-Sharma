import React, { useState, useRef } from 'react';
import { Upload, X, File, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { formatBytes } from '../services/googleDriveService';

interface DriveUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  currentFolderName: string;
  darkMode: boolean;
}

export const DriveUploadModal: React.FC<DriveUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  currentFolderName,
  darkMode,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      await onUpload(selectedFile);
      setSelectedFile(null);
      onClose();
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to upload file to Google Drive.');
    } finally {
      setIsUploading(false);
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
        className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl border transition-all ${
          darkMode
            ? 'bg-neutral-900 border-neutral-800 text-neutral-100'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Upload to Google Drive</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Destination folder: <span className="font-semibold text-orange-500">{currentFolderName}</span>
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

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Drag and drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-orange-500 bg-orange-500/5'
                : darkMode
                ? 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/50'
                : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50/70'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Drag and drop your file here, or{' '}
                <span className="text-orange-500 hover:underline">browse files</span>
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Upload resumes, case studies, project assets, documents, and spreadsheets directly to Drive
              </p>
            </div>
          </div>

          {/* Selected File Details */}
          {selectedFile && (
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between ${
                darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 shrink-0">
                  <File className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{selectedFile.name}</p>
                  <p className="text-xs text-neutral-500">
                    {formatBytes(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
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
              disabled={!selectedFile || isUploading}
              className={`px-5 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all ${
                !selectedFile || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading to Drive...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload File</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
