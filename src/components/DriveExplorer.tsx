import React, { useState, useEffect, useCallback } from 'react';
import {
  Folder,
  FileText,
  Sheet,
  Presentation,
  Image as ImageIcon,
  FileCode,
  File,
  Search,
  Upload,
  FolderPlus,
  RefreshCw,
  Star,
  ExternalLink,
  Download,
  Trash2,
  Edit3,
  ChevronRight,
  HardDrive,
  LayoutGrid,
  List,
  AlertCircle,
  CheckCircle2,
  LogOut,
  Plus,
  ShieldCheck,
  Cloud,
  FileCheck
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
} from '../services/googleAuth';
import {
  DriveFile,
  DriveAbout,
  FileFilterType,
  listDriveFiles,
  getDriveAbout,
  createDriveFolder,
  uploadDriveFile,
  createDriveDocument,
  deleteDriveFile,
  renameDriveFile,
  toggleStarDriveFile,
  getFolderMetadata,
  formatBytes,
  getMimeTypeLabel,
} from '../services/googleDriveService';
import { GoogleSignInButton } from './GoogleSignInButton';
import { DriveConfirmDialog } from './DriveConfirmDialog';
import { DriveUploadModal } from './DriveUploadModal';
import { DriveNewItemModal } from './DriveNewItemModal';
import { DriveRenameModal } from './DriveRenameModal';

interface DriveExplorerProps {
  darkMode: boolean;
  onShowToast: (message: string) => void;
}

interface BreadcrumbItem {
  id: string;
  name: string;
}

export const DriveExplorer: React.FC<DriveExplorerProps> = ({
  darkMode,
  onShowToast,
}) => {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Drive state
  const [about, setAbout] = useState<DriveAbout | null>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Navigation & Filtering
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: 'root', name: 'My Drive' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FileFilterType>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newItemModalOpen, setNewItemModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState<DriveFile | null>(null);

  // Destructive Confirmation Dialog state (MANDATORY per Workspace Skill)
  const [confirmDialogState, setConfirmDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    itemName: string;
    action: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    itemName: '',
    action: async () => {},
  });
  const [isConfirmingAction, setIsConfirmingAction] = useState(false);

  // Initialize auth listener on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setAuthInitialized(true);
      },
      () => {
        setUser(null);
        setToken(null);
        setAbout(null);
        setFiles([]);
        setAuthInitialized(true);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch Drive Files and About data
  const loadDriveData = useCallback(async () => {
    const currentToken = token || (await getAccessToken());
    if (!currentToken) return;

    try {
      setIsLoading(true);
      setError(null);

      // Load files and user storage info in parallel
      const [filesRes, aboutRes] = await Promise.all([
        listDriveFiles(currentToken, {
          folderId: currentFolderId,
          search: searchQuery,
          filterType,
        }),
        getDriveAbout(currentToken).catch((err) => {
          console.warn('Could not fetch storage quota:', err);
          return null;
        }),
      ]);

      setFiles(filesRes.files || []);
      if (aboutRes) {
        setAbout(aboutRes);
      }
    } catch (err: any) {
      console.error('Failed to load Drive contents:', err);
      setError(err.message || 'Failed to load Google Drive files. Please check connection.');
    } finally {
      setIsLoading(false);
    }
  }, [token, currentFolderId, searchQuery, filterType]);

  // Load data whenever token, folder, search, or filter changes
  useEffect(() => {
    if (token) {
      loadDriveData();
    }
  }, [token, loadDriveData]);

  // Sign in handler
  const handleSignIn = async () => {
    try {
      setIsLoggingIn(true);
      setError(null);
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        onShowToast(`Connected to Google Drive as ${res.user.displayName || res.user.email}`);
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setError(err.message || 'Google Sign-In was cancelled or failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setFiles([]);
      setAbout(null);
      setCurrentFolderId('root');
      setBreadcrumbs([{ id: 'root', name: 'My Drive' }]);
      onShowToast('Signed out of Google Drive');
    } catch (err: any) {
      console.error('Sign-out failed:', err);
    }
  };

  // Folder navigation
  const navigateToFolder = async (folderId: string, folderName?: string) => {
    setSearchQuery('');
    setCurrentFolderId(folderId);

    if (folderId === 'root') {
      setBreadcrumbs([{ id: 'root', name: 'My Drive' }]);
      return;
    }

    // Check if clicked folder is already in breadcrumbs
    const existingIndex = breadcrumbs.findIndex((b) => b.id === folderId);
    if (existingIndex !== -1) {
      setBreadcrumbs(breadcrumbs.slice(0, existingIndex + 1));
    } else {
      let resolvedName = folderName;
      if (!resolvedName && token) {
        const meta = await getFolderMetadata(token, folderId);
        resolvedName = meta.name;
      }
      setBreadcrumbs((prev) => [
        ...prev,
        { id: folderId, name: resolvedName || 'Folder' },
      ]);
    }
  };

  // Create Folder handler
  const handleCreateFolder = async (name: string) => {
    const currentToken = token || (await getAccessToken());
    if (!currentToken) throw new Error('Not authenticated');

    await createDriveFolder(currentToken, name, currentFolderId);
    onShowToast(`Folder "${name}" created successfully`);
    await loadDriveData();
  };

  // Upload File handler
  const handleUploadFile = async (file: File) => {
    const currentToken = token || (await getAccessToken());
    if (!currentToken) throw new Error('Not authenticated');

    await uploadDriveFile(currentToken, file, currentFolderId);
    onShowToast(`Uploaded "${file.name}" to Google Drive`);
    await loadDriveData();
  };

  // Create Document handler
  const handleCreateDoc = async (
    name: string,
    type: 'document' | 'spreadsheet' | 'text'
  ) => {
    const currentToken = token || (await getAccessToken());
    if (!currentToken) throw new Error('Not authenticated');

    const created = await createDriveDocument(currentToken, name, type, currentFolderId);
    onShowToast(`Created "${created.name}" in Google Drive`);
    await loadDriveData();
  };

  // Rename File handler
  const handleRename = async (fileId: string, newName: string) => {
    const currentToken = token || (await getAccessToken());
    if (!currentToken) throw new Error('Not authenticated');

    await renameDriveFile(currentToken, fileId, newName);
    onShowToast(`Renamed to "${newName}"`);
    await loadDriveData();
  };

  // Star Toggle handler
  const handleToggleStar = async (file: DriveFile) => {
    const currentToken = token || (await getAccessToken());
    if (!currentToken) return;

    try {
      const nextStarred = !file.starred;
      await toggleStarDriveFile(currentToken, file.id, nextStarred);
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, starred: nextStarred } : f))
      );
      onShowToast(nextStarred ? `Starred "${file.name}"` : `Unstarred "${file.name}"`);
    } catch (err: any) {
      console.error('Star toggle failed:', err);
      onShowToast('Could not update star status');
    }
  };

  // Trigger Delete Confirmation Dialog (Workspace Mandate: explicit user confirmation)
  const promptDeleteFile = (file: DriveFile) => {
    setConfirmDialogState({
      isOpen: true,
      title: 'Remove from Google Drive?',
      message: `Are you sure you want to move this ${
        file.mimeType === 'application/vnd.google-apps.folder' ? 'folder' : 'file'
      } to trash? This will remove it from your Google Drive with your permission.`,
      itemName: file.name,
      action: async () => {
        const currentToken = token || (await getAccessToken());
        if (!currentToken) throw new Error('Not authenticated');
        await deleteDriveFile(currentToken, file.id, false);
        onShowToast(`Moved "${file.name}" to Trash`);
        await loadDriveData();
      },
    });
  };

  const handleExecuteConfirmedAction = async () => {
    try {
      setIsConfirmingAction(true);
      await confirmDialogState.action();
      setConfirmDialogState((prev) => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      console.error('Action failed:', err);
      onShowToast(`Operation failed: ${err.message}`);
    } finally {
      setIsConfirmingAction(false);
    }
  };

  // Helper icon renderer based on MIME type
  const renderFileIcon = (file: DriveFile, sizeClass: string = 'w-5 h-5') => {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className={`${sizeClass} text-amber-500 fill-amber-500/20`} />;
    }
    if (file.mimeType === 'application/vnd.google-apps.document' || file.mimeType.includes('word')) {
      return <FileText className={`${sizeClass} text-blue-500 fill-blue-500/20`} />;
    }
    if (file.mimeType === 'application/vnd.google-apps.spreadsheet' || file.mimeType.includes('sheet') || file.mimeType.includes('csv')) {
      return <Sheet className={`${sizeClass} text-emerald-500 fill-emerald-500/20`} />;
    }
    if (file.mimeType === 'application/vnd.google-apps.presentation' || file.mimeType.includes('presentation')) {
      return <Presentation className={`${sizeClass} text-orange-500 fill-orange-500/20`} />;
    }
    if (file.mimeType.includes('pdf')) {
      return <FileText className={`${sizeClass} text-red-500 fill-red-500/20`} />;
    }
    if (file.mimeType.includes('image/')) {
      return <ImageIcon className={`${sizeClass} text-purple-500 fill-purple-500/20`} />;
    }
    if (
      file.mimeType.includes('json') ||
      file.mimeType.includes('javascript') ||
      file.mimeType.includes('typescript') ||
      file.mimeType.includes('text')
    ) {
      return <FileCode className={`${sizeClass} text-cyan-500 fill-cyan-500/20`} />;
    }
    return <File className={`${sizeClass} text-neutral-400`} />;
  };

  // Quota percentages
  const quotaLimit = about?.storageQuota?.limit ? parseInt(about.storageQuota.limit, 10) : 0;
  const quotaUsage = about?.storageQuota?.usage ? parseInt(about.storageQuota.usage, 10) : 0;
  const quotaPercentage = quotaLimit > 0 ? Math.min(100, Math.round((quotaUsage / quotaLimit) * 100)) : 0;

  const currentFolder = breadcrumbs[breadcrumbs.length - 1] || { name: 'My Drive' };

  return (
    <section
      id="drive"
      className={`py-20 border-t transition-colors ${
        darkMode
          ? 'bg-neutral-900/40 border-neutral-800 text-neutral-100'
          : 'bg-neutral-50/70 border-neutral-200 text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-500 border border-orange-500/20 mb-3">
              <Cloud className="w-3.5 h-3.5" />
              <span>Google Drive Integration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Cloud Document & Asset Hub
            </h2>
            <p className={`mt-2 text-sm sm:text-base max-w-2xl ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Seamlessly browse, manage, and share client briefs, project deliverables, contracts, and digital portfolios directly from Google Drive.
            </p>
          </div>

          {/* User Auth Status Pill / Quick Button */}
          {user && (
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-3 px-3.5 py-2 rounded-2xl border ${
                  darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
                }`}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-8 h-8 rounded-full border border-orange-500/30 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                    {(user.displayName || user.email || 'G')[0].toUpperCase()}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold leading-tight truncate max-w-[140px]">
                    {user.displayName || 'Google Account'}
                  </p>
                  <p className="text-[10px] text-neutral-400 truncate max-w-[140px]">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Sign out of Google Drive"
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Not Logged In State: Compelling Welcome Card with Official Sign-in Button */}
        {!user && (
          <div
            className={`rounded-3xl p-8 sm:p-12 text-center border shadow-xl transition-all ${
              darkMode
                ? 'bg-neutral-900/80 border-neutral-800 text-neutral-100'
                : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <div className="max-w-xl mx-auto flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center text-orange-500 mb-6 shadow-inner">
                <HardDrive className="w-8 h-8" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Connect Your Google Drive
              </h3>
              <p
                className={`mt-3 text-sm leading-relaxed ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Sign in with Google to explore your files and folders, upload project specifications, view case studies, and organize work artifacts with user permission.
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full my-8 text-left">
                <div
                  className={`p-3.5 rounded-2xl border ${
                    darkMode ? 'bg-neutral-950 border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <FileCheck className="w-4 h-4 text-orange-500 mb-1.5" />
                  <p className="text-xs font-bold">Secure Access</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Token cached in-memory only</p>
                </div>
                <div
                  className={`p-3.5 rounded-2xl border ${
                    darkMode ? 'bg-neutral-950 border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <FolderPlus className="w-4 h-4 text-amber-500 mb-1.5" />
                  <p className="text-xs font-bold">Full Management</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Upload, create, rename & star</p>
                </div>
                <div
                  className={`p-3.5 rounded-2xl border ${
                    darkMode ? 'bg-neutral-950 border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500 mb-1.5" />
                  <p className="text-xs font-bold">Safety Confirmation</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Explicit checks on deletion</p>
                </div>
              </div>

              {/* Official Google Sign-in Button */}
              <div className="pt-2">
                <GoogleSignInButton
                  onClick={handleSignIn}
                  isLoading={isLoggingIn}
                  text="Sign in with Google to Access Drive"
                />
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Authenticated State: Google Drive Explorer Workspace */}
        {user && (
          <div
            className={`rounded-3xl border shadow-xl overflow-hidden transition-all ${
              darkMode
                ? 'bg-neutral-900/90 border-neutral-800'
                : 'bg-white border-neutral-200'
            }`}
          >
            {/* Top Toolbar: Breadcrumbs & Storage Quota */}
            <div
              className={`p-4 sm:p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                darkMode ? 'border-neutral-800 bg-neutral-950/50' : 'border-neutral-200 bg-neutral-50/80'
              }`}
            >
              {/* Breadcrumb path */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-xs sm:text-sm font-medium">
                {breadcrumbs.map((crumb, idx) => {
                  const isLast = idx === breadcrumbs.length - 1;
                  return (
                    <React.Fragment key={crumb.id}>
                      {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
                      <button
                        onClick={() => navigateToFolder(crumb.id, crumb.name)}
                        className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                          isLast
                            ? 'font-bold text-orange-500 bg-orange-500/10'
                            : darkMode
                            ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                            : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200'
                        }`}
                      >
                        {crumb.name}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Storage Quota Bar */}
              {about?.storageQuota && (
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-semibold">
                      {formatBytes(quotaUsage)} of {formatBytes(quotaLimit)} used
                    </p>
                    <div className="w-32 sm:w-40 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          quotaPercentage > 85 ? 'bg-red-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${Math.max(3, quotaPercentage)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar: Search, Filters, View Modes & Operations */}
            <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files and folders in Drive..."
                  className={`w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-100 placeholder-neutral-500'
                      : 'bg-neutral-100/80 border-neutral-300 text-neutral-900 placeholder-neutral-400'
                  }`}
                />
              </div>

              {/* Action Buttons: New Folder, Upload, New Doc, Refresh, Layout */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={() => setNewItemModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border border-orange-500/30 transition-all"
                  title="Create a new folder or document in Drive"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>

                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-sm shadow-orange-500/20 transition-all"
                  title="Upload a file from your computer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>

                <button
                  onClick={loadDriveData}
                  disabled={isLoading}
                  title="Refresh files"
                  className={`p-2 rounded-xl border transition-colors ${
                    darkMode
                      ? 'border-neutral-800 hover:bg-neutral-800 text-neutral-400'
                      : 'border-neutral-300 hover:bg-neutral-100 text-neutral-600'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-orange-500' : ''}`} />
                </button>

                <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />

                {/* View Switcher */}
                <div
                  className={`flex items-center p-0.5 rounded-xl border ${
                    darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
                  }`}
                >
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                    title="List view"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Category Pills */}
            <div className="px-4 sm:px-5 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
              {(
                [
                  { id: 'all', label: 'All Items' },
                  { id: 'folders', label: 'Folders' },
                  { id: 'documents', label: 'Documents' },
                  { id: 'spreadsheets', label: 'Spreadsheets' },
                  { id: 'presentations', label: 'Presentations' },
                  { id: 'images', label: 'Images' },
                  { id: 'starred', label: 'Starred' },
                ] as { id: FileFilterType; label: string }[]
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterType(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                    filterType === cat.id
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                      : darkMode
                      ? 'bg-neutral-950/60 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-950 border border-neutral-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Files Grid / List Content */}
            <div className="p-4 sm:p-6 min-h-[320px]">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
                  <p className="text-xs sm:text-sm text-neutral-400 font-medium">
                    Loading Google Drive items...
                  </p>
                </div>
              )}

              {!isLoading && error && (
                <div className="p-6 text-center max-w-md mx-auto">
                  <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-red-500">{error}</p>
                  <button
                    onClick={loadDriveData}
                    className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!isLoading && !error && files.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-200 dark:bg-neutral-800/60 flex items-center justify-center text-neutral-400 mb-3">
                    <Folder className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold">No files found</h4>
                  <p className="text-xs text-neutral-500 mt-1 mb-5 leading-relaxed">
                    {searchQuery
                      ? `No items match "${searchQuery}". Try a different search term.`
                      : 'This folder is empty. Upload project assets, case studies, or create a new document.'}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setUploadModalOpen(true)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-xl"
                    >
                      Upload File
                    </button>
                    <button
                      onClick={() => setNewItemModalOpen(true)}
                      className="px-4 py-2 text-xs font-semibold border border-neutral-300 dark:border-neutral-700 rounded-xl"
                    >
                      New Folder
                    </button>
                  </div>
                </div>
              )}

              {/* Render Grid View */}
              {!isLoading && !error && files.length > 0 && viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {files.map((file) => {
                    const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

                    return (
                      <div
                        key={file.id}
                        onClick={() => {
                          if (isFolder) {
                            navigateToFolder(file.id, file.name);
                          }
                        }}
                        className={`group relative rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                          isFolder ? 'cursor-pointer' : ''
                        } ${
                          darkMode
                            ? 'bg-neutral-950/60 hover:bg-neutral-950 border-neutral-800/80 hover:border-orange-500/40'
                            : 'bg-white hover:bg-neutral-50/80 border-neutral-200 hover:border-orange-500/40 shadow-xs'
                        }`}
                      >
                        {/* Top: Icon & Star Toggle */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            {renderFileIcon(file, 'w-6 h-6')}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStar(file);
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${
                                file.starred
                                  ? 'text-amber-400 hover:text-amber-500'
                                  : 'text-neutral-400 hover:text-neutral-200 opacity-0 group-hover:opacity-100'
                              }`}
                              title={file.starred ? 'Unstar file' : 'Star file'}
                            >
                              <Star
                                className={`w-4 h-4 ${file.starred ? 'fill-amber-400' : ''}`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Middle: File Name & Category */}
                        <div className="my-3 min-w-0">
                          <p
                            className="font-semibold text-xs sm:text-sm truncate"
                            title={file.name}
                          >
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] uppercase font-bold text-orange-500">
                              {getMimeTypeLabel(file.mimeType)}
                            </span>
                            {!isFolder && file.size && (
                              <span className="text-[10px] text-neutral-400">
                                • {formatBytes(file.size)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom: Date & Actions */}
                        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between text-[10px] text-neutral-400">
                          <span>
                            {new Date(file.modifiedTime).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>

                          {/* Quick Action Icons */}
                          <div className="flex items-center gap-1">
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-orange-500"
                                title="Open in Google Drive"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}

                            {file.webContentLink && (
                              <a
                                href={file.webContentLink}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-emerald-500"
                                title="Download file"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFileToRename(file);
                                setRenameModalOpen(true);
                              }}
                              className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-blue-500"
                              title="Rename"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                promptDeleteFile(file);
                              }}
                              className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-red-500"
                              title="Move to trash"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Render List View */}
              {!isLoading && !error && files.length > 0 && viewMode === 'list' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr
                        className={`border-b text-[11px] uppercase tracking-wider font-semibold ${
                          darkMode
                            ? 'border-neutral-800 text-neutral-400'
                            : 'border-neutral-200 text-neutral-500'
                        }`}
                      >
                        <th className="py-3 px-3">Name</th>
                        <th className="py-3 px-3 hidden sm:table-cell">Type</th>
                        <th className="py-3 px-3 hidden md:table-cell">Size</th>
                        <th className="py-3 px-3 hidden lg:table-cell">Last Modified</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850">
                      {files.map((file) => {
                        const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

                        return (
                          <tr
                            key={file.id}
                            onClick={() => {
                              if (isFolder) {
                                navigateToFolder(file.id, file.name);
                              }
                            }}
                            className={`group transition-colors ${
                              isFolder ? 'cursor-pointer' : ''
                            } ${
                              darkMode
                                ? 'hover:bg-neutral-950/80'
                                : 'hover:bg-neutral-50'
                            }`}
                          >
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="shrink-0">{renderFileIcon(file, 'w-4 h-4')}</div>
                                <span className="font-semibold truncate max-w-[180px] sm:max-w-xs md:max-w-sm">
                                  {file.name}
                                </span>
                                {file.starred && (
                                  <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 hidden sm:table-cell text-neutral-500 text-xs">
                              {getMimeTypeLabel(file.mimeType)}
                            </td>
                            <td className="py-3 px-3 hidden md:table-cell text-neutral-400 font-mono text-xs">
                              {isFolder ? '--' : formatBytes(file.size)}
                            </td>
                            <td className="py-3 px-3 hidden lg:table-cell text-neutral-400 text-xs">
                              {new Date(file.modifiedTime).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleStar(file);
                                  }}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    file.starred
                                      ? 'text-amber-400'
                                      : 'text-neutral-400 hover:text-neutral-200'
                                  }`}
                                  title={file.starred ? 'Unstar' : 'Star'}
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 ${
                                      file.starred ? 'fill-amber-400' : ''
                                    }`}
                                  />
                                </button>

                                {file.webViewLink && (
                                  <a
                                    href={file.webViewLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1.5 rounded-lg text-neutral-400 hover:text-orange-500 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                                    title="Open in Drive"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}

                                {file.webContentLink && (
                                  <a
                                    href={file.webContentLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-500 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                                    title="Download"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                )}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFileToRename(file);
                                    setRenameModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-500 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                                  title="Rename"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    promptDeleteFile(file);
                                  }}
                                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                                  title="Trash"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Upload File Modal */}
      <DriveUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUploadFile}
        currentFolderName={currentFolder.name}
        darkMode={darkMode}
      />

      {/* Create New Item Modal (Folder, Doc, Sheet, Note) */}
      <DriveNewItemModal
        isOpen={newItemModalOpen}
        onClose={() => setNewItemModalOpen(false)}
        onCreateFolder={handleCreateFolder}
        onCreateDoc={handleCreateDoc}
        currentFolderName={currentFolder.name}
        darkMode={darkMode}
      />

      {/* Rename Modal */}
      <DriveRenameModal
        isOpen={renameModalOpen}
        onClose={() => {
          setRenameModalOpen(false);
          setFileToRename(null);
        }}
        file={fileToRename}
        onRename={handleRename}
        darkMode={darkMode}
      />

      {/* MANDATORY Workspace User Confirmation Dialog for Destructive Operations */}
      <DriveConfirmDialog
        isOpen={confirmDialogState.isOpen}
        title={confirmDialogState.title}
        message={confirmDialogState.message}
        itemName={confirmDialogState.itemName}
        confirmText="Move to Trash"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isConfirmingAction}
        onConfirm={handleExecuteConfirmedAction}
        onCancel={() => setConfirmDialogState((prev) => ({ ...prev, isOpen: false }))}
        darkMode={darkMode}
      />
    </section>
  );
};
