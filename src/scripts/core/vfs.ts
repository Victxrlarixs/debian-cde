import { CONFIG } from './config';
import { logger } from '../utilities/logger';
// Sync content imports
import tutorialData from '../../data/tutorial.json';
import themesData from '../../data/themes.json';
import fontsData from '../../data/fonts.json';
import filesystemData from '../../data/filesystem.json';

// --- Types ---

export type VFSNodeType = 'file' | 'folder';

export interface VFSFile {
  type: 'file';
  content: string;
}

export interface VFSFolder {
  type: 'folder';
  children: Record<string, VFSNode>;
}

export type VFSNode = VFSFile | VFSFolder;

export interface IVFS {
  init(): void;
  resolvePath(cwd: string, path: string): string;
  getNode(path: string): VFSNode | null;
  getChildren(path: string): Record<string, VFSNode> | null;
  touch(path: string, name: string): Promise<void>;
  mkdir(path: string, name: string): Promise<void>;
  rm(path: string, name: string): Promise<boolean>;
  rename(path: string, oldName: string, newName: string): Promise<void>;
}

declare global {
  interface Window {
    VirtualFS: IVFS;
  }
}

// --- State ---

/** Flattened map for O(1) path lookups */
const fsMap: Record<string, VFSNode> = {};

/** The root node of the virtual filesystem */
let rootNode: VFSFolder | null = null;

// --- Private Helpers ---

/**
 * Recursively flattens the nested filesystem structure.
 */
function flatten(basePath: string, node: VFSNode): void {
  fsMap[basePath] = node;
  if (node.type === 'folder') {
    for (const [name, child] of Object.entries((node as VFSFolder).children)) {
      const fullPath = basePath + name + (child.type === 'folder' ? '/' : '');
      flatten(fullPath, child);
    }
  }
}

/**
 * Notifies the system that the filesystem has changed.
 */
function dispatchChange(path: string): void {
  window.dispatchEvent(
    new CustomEvent('cde-fs-change', {
      detail: { path },
    })
  );
}

// --- Sync Logic ---

async function syncDynamicContent(): Promise<void> {
  // Load heavy assets dynamically to keep initial bundle small
  const [readme, bashBible, shBible] = await Promise.all([
    import('../../../README.md?raw'),
    import('../../data/pure-bash-bible.md?raw'),
    import('../../data/pure-sh-bible.md?raw'),
  ]);

  // README.md
  const readmePath = CONFIG.FS.DESKTOP + 'readme.md';
  const readmeFile = fsMap[readmePath] as VFSFile;
  if (readmeFile?.type === 'file') {
    readmeFile.content = readme.default;
  }

  // Tutorial / Linux Bible
  const manPath = CONFIG.FS.HOME + 'man-pages/linux-bible.md';
  const manFile = fsMap[manPath] as VFSFile;
  if (manFile?.type === 'file') {
    let content = '# Linux Commands Reference\n\n';
    tutorialData.forEach((sequence: any, seqIndex: number) => {
      content += `\n${'='.repeat(60)}\n`;
      content += `SEQUENCE ${seqIndex + 1}\n`;
      content += `${'='.repeat(60)}\n\n`;
      sequence.forEach((step: any) => {
        content += `${step.user}@Debian:~$ ${step.command}\n`;
        content += `${step.output}\n\n`;
      });
    });
    manFile.content = content;
  }

  // Bibles
  const bashPath = CONFIG.FS.HOME + 'man-pages/pure-bash-bible.md';
  if (fsMap[bashPath]) (fsMap[bashPath] as VFSFile).content = bashBible.default;

  const shPath = CONFIG.FS.HOME + 'man-pages/pure-sh-bible.md';
  if (fsMap[shPath]) (fsMap[shPath] as VFSFile).content = shBible.default;

  // Settings
  const themesPath = CONFIG.FS.HOME + 'settings/themes.json';
  if (fsMap[themesPath])
    (fsMap[themesPath] as VFSFile).content = JSON.stringify(themesData, null, 2);

  const fontsPath = CONFIG.FS.HOME + 'settings/fonts.json';
  if (fsMap[fontsPath]) (fsMap[fontsPath] as VFSFile).content = JSON.stringify(fontsData, null, 2);

  logger.log('[VFS] Dynamic content synced (Lazy)');
}

// --- Public API ---

export const VFS: IVFS = {
  init(): void {
    const rootPath = CONFIG.FS.HOME;
    rootNode = (filesystemData as Record<string, VFSFolder>)[rootPath];

    if (rootNode) {
      flatten(rootPath, rootNode);
      syncDynamicContent(); // Non-blocking sync
      logger.log('[VFS] Initialized, entries:', Object.keys(fsMap).length);
    } else {
      logger.error('[VFS] Root path not found in filesystem data');
    }
  },

  resolvePath(cwd: string, path: string): string {
    if (path.startsWith('~')) path = CONFIG.FS.HOME + path.slice(1);
    if (!path.startsWith('/')) path = cwd + (cwd.endsWith('/') ? '' : '/') + path;

    const parts = path.split('/').filter(Boolean);
    const resolved: string[] = [];

    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        resolved.pop();
        continue;
      }
      resolved.push(part);
    }

    return '/' + resolved.join('/') + (path.endsWith('/') && resolved.length > 0 ? '/' : '');
  },

  getNode(path: string): VFSNode | null {
    return fsMap[path] || null;
  },

  getChildren(path: string): Record<string, VFSNode> | null {
    const node = this.getNode(path);
    return node?.type === 'folder' ? node.children : null;
  },

  async touch(path: string, name: string): Promise<void> {
    const dirPath = path.endsWith('/') ? path : path + '/';
    const node = this.getNode(dirPath);
    if (node?.type === 'folder') {
      const newFile: VFSFile = { type: 'file', content: '' };
      node.children[name] = newFile;
      fsMap[dirPath + name] = newFile;
      logger.log(`[VFS] touch: ${dirPath}${name}`);
      dispatchChange(dirPath);
    }
  },

  async mkdir(path: string, name: string): Promise<void> {
    const dirPath = path.endsWith('/') ? path : path + '/';
    const node = this.getNode(dirPath);
    if (node?.type === 'folder') {
      const newFolder: VFSFolder = { type: 'folder', children: {} };
      node.children[name] = newFolder;
      fsMap[dirPath + name + '/'] = newFolder;
      logger.log(`[VFS] mkdir: ${dirPath}${name}/`);
      dispatchChange(dirPath);
    }
  },

  async rm(path: string, name: string): Promise<boolean> {
    const dirPath = path.endsWith('/') ? path : path + '/';
    const node = this.getNode(dirPath);
    if (node?.type === 'folder' && node.children[name]) {
      const item = node.children[name];
      const fullPath = dirPath + name + (item.type === 'folder' ? '/' : '');
      delete fsMap[fullPath];
      delete node.children[name];
      logger.log(`[VFS] rm: ${fullPath}`);
      dispatchChange(dirPath);
      return true;
    }
    return false;
  },

  async rename(path: string, oldName: string, newName: string): Promise<void> {
    const dirPath = path.endsWith('/') ? path : path + '/';
    const node = this.getNode(dirPath);
    if (node?.type === 'folder' && node.children[oldName]) {
      const item = node.children[oldName];
      const oldPath = dirPath + oldName + (item.type === 'folder' ? '/' : '');
      const newPath = dirPath + newName + (item.type === 'folder' ? '/' : '');

      node.children[newName] = item;
      delete node.children[oldName];

      fsMap[newPath] = item;
      delete fsMap[oldPath];

      logger.log(`[VFS] rename: ${oldPath} -> ${newPath}`);
      dispatchChange(dirPath);
    }
  },
};

// Global Exposure
if (typeof window !== 'undefined') {
  window.VirtualFS = VFS;
}
