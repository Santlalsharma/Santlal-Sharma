export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  createdTime?: string;
  iconLink?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  starred?: boolean;
  shared?: boolean;
  owners?: {
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  }[];
  parents?: string[];
}

export interface DriveAbout {
  user: {
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  };
  storageQuota?: {
    limit?: string;
    usage?: string;
    usageInDrive?: string;
    usageInDriveTrash?: string;
  };
}

export type FileFilterType = 'all' | 'folders' | 'documents' | 'spreadsheets' | 'presentations' | 'images' | 'starred';

/**
 * Fetch storage quota and current user details from Drive
 */
export const getDriveAbout = async (token: string): Promise<DriveAbout> => {
  const res = await fetch(
    'https://www.googleapis.com/drive/v3/about?fields=user(displayName,emailAddress,photoLink),storageQuota(limit,usage,usageInDrive,usageInDriveTrash)',
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch Drive information (${res.status})`);
  }

  return res.json();
};

/**
 * List files in the current folder or matching search/filter
 */
export const listDriveFiles = async (
  token: string,
  options: {
    folderId?: string;
    search?: string;
    filterType?: FileFilterType;
    pageToken?: string;
    pageSize?: number;
    orderBy?: string;
  } = {}
): Promise<{ files: DriveFile[]; nextPageToken?: string }> => {
  const {
    folderId = 'root',
    search = '',
    filterType = 'all',
    pageToken,
    pageSize = 40,
    orderBy = 'folder,modifiedTime desc',
  } = options;

  const queryParts: string[] = ['trashed = false'];

  if (search.trim()) {
    const sanitized = search.trim().replace(/'/g, "\\'");
    queryParts.push(`name contains '${sanitized}'`);
  } else if (filterType === 'starred') {
    queryParts.push('starred = true');
  } else {
    queryParts.push(`'${folderId}' in parents`);
  }

  // Filter conditions
  if (filterType === 'folders') {
    queryParts.push("mimeType = 'application/vnd.google-apps.folder'");
  } else if (filterType === 'documents') {
    queryParts.push(
      "(mimeType = 'application/vnd.google-apps.document' or mimeType = 'application/pdf' or mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' or mimeType = 'text/plain')"
    );
  } else if (filterType === 'spreadsheets') {
    queryParts.push(
      "(mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' or mimeType = 'text/csv')"
    );
  } else if (filterType === 'presentations') {
    queryParts.push(
      "(mimeType = 'application/vnd.google-apps.presentation' or mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation')"
    );
  } else if (filterType === 'images') {
    queryParts.push("mimeType contains 'image/'");
  }

  const query = queryParts.join(' and ');

  const url = new URL('https://www.googleapis.com/drive/v3/files');
  url.searchParams.set('q', query);
  url.searchParams.set(
    'fields',
    'nextPageToken, files(id, name, mimeType, size, modifiedTime, createdTime, iconLink, thumbnailLink, webViewLink, webContentLink, starred, shared, owners, parents)'
  );
  url.searchParams.set('pageSize', pageSize.toString());
  url.searchParams.set('orderBy', orderBy);

  if (pageToken) {
    url.searchParams.set('pageToken', pageToken);
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch files (${res.status})`);
  }

  return res.json();
};

/**
 * Get folder metadata (such as folder name for breadcrumbs)
 */
export const getFolderMetadata = async (token: string, folderId: string): Promise<DriveFile> => {
  if (folderId === 'root') {
    return {
      id: 'root',
      name: 'My Drive',
      mimeType: 'application/vnd.google-apps.folder',
      modifiedTime: new Date().toISOString(),
    };
  }

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${folderId}?fields=id,name,mimeType,parents`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    return {
      id: folderId,
      name: 'Folder',
      mimeType: 'application/vnd.google-apps.folder',
      modifiedTime: new Date().toISOString(),
    };
  }

  return res.json();
};

/**
 * Create a new folder inside specified parent
 */
export const createDriveFolder = async (
  token: string,
  name: string,
  parentId: string = 'root'
): Promise<DriveFile> => {
  const metadata = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentId],
  };

  const res = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create folder (${res.status})`);
  }

  return res.json();
};

/**
 * Upload a file from the user's computer into the specified folder
 */
export const uploadDriveFile = async (
  token: string,
  file: File,
  parentId: string = 'root'
): Promise<DriveFile> => {
  const metadata = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    parents: [parentId],
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', file);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,modifiedTime,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to upload file (${res.status})`);
  }

  return res.json();
};

/**
 * Create a new Google Document or Plain Text file
 */
export const createDriveDocument = async (
  token: string,
  name: string,
  type: 'document' | 'spreadsheet' | 'text' = 'document',
  parentId: string = 'root'
): Promise<DriveFile> => {
  let mimeType = 'application/vnd.google-apps.document';
  let defaultName = name || 'Untitled Document';

  if (type === 'spreadsheet') {
    mimeType = 'application/vnd.google-apps.spreadsheet';
    defaultName = name || 'Untitled Spreadsheet';
  } else if (type === 'text') {
    mimeType = 'text/plain';
    defaultName = name.endsWith('.txt') ? name : `${name || 'Untitled'}.txt`;
  }

  const metadata = {
    name: defaultName,
    mimeType,
    parents: [parentId],
  };

  const res = await fetch(
    'https://www.googleapis.com/drive/v3/files?fields=id,name,mimeType,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create file (${res.status})`);
  }

  return res.json();
};

/**
 * Delete a file or move to trash
 */
export const deleteDriveFile = async (
  token: string,
  fileId: string,
  permanent: boolean = false
): Promise<void> => {
  if (permanent) {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok && res.status !== 204) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to delete file permanently (${res.status})`);
    }
  } else {
    // Move to trash safely
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trashed: true }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to trash file (${res.status})`);
    }
  }
};

/**
 * Rename a Drive file or folder
 */
export const renameDriveFile = async (
  token: string,
  fileId: string,
  newName: string
): Promise<DriveFile> => {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to rename file (${res.status})`);
  }

  return res.json();
};

/**
 * Toggle Starred status
 */
export const toggleStarDriveFile = async (
  token: string,
  fileId: string,
  starred: boolean
): Promise<DriveFile> => {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ starred }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to update star (${res.status})`);
  }

  return res.json();
};

/**
 * Format bytes into human-readable string
 */
export const formatBytes = (bytes?: string | number, decimals: number = 1): string => {
  if (!bytes) return '--';
  const num = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (isNaN(num) || num === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(num) / Math.log(k));

  return `${parseFloat((num / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Categorize MIME type into readable badge
 */
export const getMimeTypeLabel = (mimeType: string): string => {
  if (mimeType === 'application/vnd.google-apps.folder') return 'Folder';
  if (mimeType === 'application/vnd.google-apps.document') return 'Google Doc';
  if (mimeType === 'application/vnd.google-apps.spreadsheet') return 'Google Sheet';
  if (mimeType === 'application/vnd.google-apps.presentation') return 'Google Slide';
  if (mimeType.includes('pdf')) return 'PDF Document';
  if (mimeType.includes('image')) return 'Image';
  if (mimeType.includes('video')) return 'Video';
  if (mimeType.includes('audio')) return 'Audio';
  if (mimeType.includes('text') || mimeType.includes('json') || mimeType.includes('javascript') || mimeType.includes('typescript'))
    return 'Code / Text';
  if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('compressed')) return 'Archive';
  return 'File';
};
