// src/scripts/shared/file-icons.ts
import { VFS, type VFSNode, type VFSFile } from '../core/vfs';

/**
 * Icon paths for different file types
 */
export const ICON_PATHS = {
  FOLDER: '/icons/apps/filemanager.png',
  FILE_EMPTY: '/icons/mimetypes/document.png',
  FILE_WITH_CONTENT: '/icons/mimetypes/gtk-file.png',
} as const;

/**
 * Determines the appropriate icon for a file based on its type and content.
 * - Folders: filemanager.png
 * - Empty files: document.png
 * - Files with content: gtk-file.png
 */
export function getFileIcon(node: VFSNode, fullPath?: string): string {
  if (node.type === 'folder') {
    return ICON_PATHS.FOLDER;
  }

  // Check if file is empty
  const fileNode = node as VFSFile;
  const isEmpty = !fileNode.content || fileNode.content.trim() === '';

  return isEmpty ? ICON_PATHS.FILE_EMPTY : ICON_PATHS.FILE_WITH_CONTENT;
}

/**
 * Gets the icon for a file by path
 */
export function getFileIconByPath(path: string): string {
  const node = VFS.getNode(path);

  if (!node) {
    return ICON_PATHS.FILE_WITH_CONTENT;
  }

  return getFileIcon(node, path);
}
