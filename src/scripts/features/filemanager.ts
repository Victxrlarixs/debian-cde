// src/scripts/features/filemanager.ts

import { CONFIG } from '../core/config';
import filesystemData from '../../data/filesystem.json';
import { CDEModal } from '../ui/modals';
import { logger } from '../utilities/logger';
import readmeContent from '../../../README.md?raw';
import tutorialData from '../../data/tutorial.json';
import bashBibleContent from '../../data/pure-bash-bible.md?raw';
import themesData from '../../data/themes.json';
import fontsData from '../../data/fonts.json';

declare global {
  interface Window {
    /**
     * Opens the file manager window.
     */
    openFileManager: () => void;

    /**
     * Closes the file manager window.
     */
    closeFileManager: () => void;

    /**
     * Toggles the file manager window visibility.
     */
    toggleFileManager: () => void;

    /**
     * Checks if the file manager is currently open.
     * @returns {boolean} True if the file manager is open, false otherwise.
     */
    isFileManagerOpen: () => boolean;

    /**
     * Navigates to the specified path in the file manager.
     * @param path - The path to navigate to.
     */
    openPath: (path: string) => void;

    /**
     * Navigates back in the file manager history.
     */
    goBack: () => void;

    /**
     * Navigates forward in the file manager history.
     */
    goForward: () => void;

    /**
     * Navigates up one directory level.
     */
    goUp: () => void;

    /**
     * Navigates to the home directory.
     */
    goHome: () => void;

    /**
     * Creates a new file with the given name and content (used by text editor).
     */
    createFile: (name: string, content: string) => Promise<void>;

    /**
     * Saves content to an existing file (used by text editor).
     */
    saveFile: (path: string, content: string) => void;

    /**
     * Virtual Filesystem API
     */
    VirtualFS: {
      getNode: (path: string) => any;
      getChildren: (path: string) => any;
      touch: (name: string, targetPath?: string) => Promise<void>;
      mkdir: (name: string, targetPath?: string) => Promise<void>;
      rm: (name: string, targetPath?: string) => Promise<void>;
      rename: (oldName: string, newName: string, targetPath?: string) => Promise<void>;
    };
    CDEModal: typeof CDEModal;
  }
}

(window as any).CDEModal = CDEModal;
// ------------------------------------------------------------------

/** Represents a file in the virtual filesystem */
type FileType = 'file' | 'folder';

/** Interface for a virtual file */
interface VirtualFile {
  type: 'file';
  /** File content as string */
  content: string;
}

/** Interface for a virtual folder */
interface VirtualFolder {
  type: 'folder';
  /** Children nodes contained in this folder */
  children: Record<string, VirtualFileSystemNode>;
}

/** Union type for filesystem nodes (file or folder) */
type VirtualFileSystemNode = VirtualFile | VirtualFolder;

// ------------------------------------------------------------------
// FLATTENED FILESYSTEM MAP
// ------------------------------------------------------------------

/** Flattened map: full path => node (folder or file) */
const fsMap: Record<string, VirtualFolder | VirtualFile> = {};

/**
 * Recursively flattens the nested filesystem structure.
 * @param basePath - Current base path (e.g., "/home/victxrlarixs/").
 * @param node - Current folder node.
 */
function flattenFilesystem(basePath: string, node: VirtualFolder): void {
  // Store the folder itself
  fsMap[basePath] = node;

  // Process children
  for (const [name, child] of Object.entries(node.children)) {
    const fullPath = basePath + name + (child.type === 'folder' ? '/' : '');
    if (child.type === 'folder') {
      flattenFilesystem(fullPath, child);
    } else {
      fsMap[fullPath] = child;
    }
  }
}

// Initialize flattening from the root path
const rootPath = CONFIG.FS.HOME;
const rootNode = (filesystemData as Record<string, VirtualFolder>)[rootPath];
if (rootNode) {
  flattenFilesystem(rootPath, rootNode);
  
  // Sync readme.md with README.md content dynamically
  const readmePath = CONFIG.FS.DESKTOP + 'readme.md';
  const readmeFile = fsMap[readmePath] as VirtualFile;
  if (readmeFile && readmeFile.type === 'file') {
    readmeFile.content = readmeContent;
    logger.log(`[FileManager] Synced ${readmePath} with real README.md content`);
  }

  // Sync linux-bible.md with tutorial.json content dynamically
  const manPath = CONFIG.FS.HOME + 'man-pages/linux-bible.md';
  const manFile = fsMap[manPath] as VirtualFile;
  if (manFile && manFile.type === 'file') {
    // Replicate tutorial formatting logic
    let manContent = '# Linux Commands Reference\n\n';
    tutorialData.forEach((sequence: any, seqIndex: number) => {
      manContent += `\n${'='.repeat(60)}\n`;
      manContent += `SEQUENCE ${seqIndex + 1}\n`;
      manContent += `${'='.repeat(60)}\n\n`;
      
      sequence.forEach((step: any) => {
        manContent += `${step.user}@Debian:~$ ${step.command}\n`;
        manContent += `${step.output}\n\n`;
      });
    });
    manFile.content = manContent;
    logger.log(`[FileManager] Synced ${manPath} with tutorial.json content`);
  }

  // Sync bash-bible.md with real content
  const bashPath = CONFIG.FS.HOME + 'man-pages/bash-bible.md';
  const bashFile = fsMap[bashPath] as VirtualFile;
  if (bashFile && bashFile.type === 'file') {
    bashFile.content = bashBibleContent;
    logger.log(`[FileManager] Synced ${bashPath} with pure-bash-bible.md content`);
  }

  // Sync themes.json and fonts.json in settings
  const themesPath = CONFIG.FS.HOME + 'settings/themes.json';
  const themesFile = fsMap[themesPath] as VirtualFile;
  if (themesFile && themesFile.type === 'file') {
    themesFile.content = JSON.stringify(themesData, null, 2);
    logger.log(`[FileManager] Synced ${themesPath} with internal themes data`);
  }

  const fontsPath = CONFIG.FS.HOME + 'settings/fonts.json';
  const fontsFile = fsMap[fontsPath] as VirtualFile;
  if (fontsFile && fontsFile.type === 'file') {
    fontsFile.content = JSON.stringify(fontsData, null, 2);
    logger.log(`[FileManager] Synced ${fontsPath} with internal fonts data`);
  }

  logger.log('[FileManager] Filesystem flattened, entries:', Object.keys(fsMap).length);
} else {
  console.error('[FileManager] Root path not found in filesystem data');
}

// Global VirtualFS exposure
window.VirtualFS = {
  getNode: (path: string) => fsMap[path] || null,
  getChildren: (path: string) => {
    const node = fsMap[path];
    return node && node.type === 'folder' ? (node as VirtualFolder).children : null;
  },
  touch,
  mkdir,
  rm,
  rename
};

// ------------------------------------------------------------------
// INTERNAL STATE
// ------------------------------------------------------------------

/** Current working directory path */
let currentPath: string = CONFIG.FS.HOME;

/** Navigation history stack */
let history: string[] = [];

/** Current index in navigation history */
let historyIndex: number = -1;

/** Currently selected file/folder name */
let fmSelected: string | null = null;

/** Whether to show hidden files (starting with dot) */
let showHidden: boolean = false;

/** Z-index counter for window layering */
let zIndex: number = CONFIG.FILEMANAGER.BASE_Z_INDEX;

/** Whether the file manager has been initialized */
let initialized: boolean = false;

/** Reference to the currently active dropdown menu */
let activeMenu: HTMLElement | null = null;

/** Reference to the currently active context menu */
let activeContextMenu: HTMLElement | null = null;

/**
 * Dispatches a custom event to notify other modules of filesystem changes.
 */
function dispatchFsChange(): void {
  window.dispatchEvent(new CustomEvent('cde-fs-change', { 
    detail: { path: currentPath } 
  }));
}

// ------------------------------------------------------------------
// PRIVATE FUNCTIONS
// ------------------------------------------------------------------

/**
 * Retrieves the contents of the current folder.
 *
 * @returns {Record<string, VirtualFileSystemNode> | null} The folder contents or null if not found
 */
function getCurrentFolder(): Record<string, VirtualFileSystemNode> | null {
  const current = fsMap[currentPath];
  if (current?.type === 'folder') {
    return current.children;
  }
  return null;
}

/**
 * Renders the files in the current folder to the UI.
 *
 * @remarks
 * Updates the file list display, path input, and status bar.
 * Handles hidden file filtering based on showHidden flag.
 */
function renderFiles(): void {
  const container = document.getElementById('fmFiles');
  const pathInput = document.getElementById('fmPath') as HTMLInputElement | null;
  const status = document.getElementById('fmStatus');

  if (!container || !pathInput || !status) {
    console.warn('[FileManager] renderFiles: required UI elements not found');
    return;
  }

  pathInput.value = currentPath;
  const folder = getCurrentFolder();
  if (!folder) {
    console.warn(`[FileManager] renderFiles: path not found: ${currentPath}`);
    return;
  }

  const fragment = document.createDocumentFragment();
  let count = 0;

  Object.entries(folder).forEach(([name, item]) => {
    if (!showHidden && name.startsWith('.')) return;
    count++;

    const div = document.createElement('div');
    div.className = 'fm-file';
    div.dataset.name = name;

    div.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.fm-file').forEach((el) => el.classList.remove('selected'));
      div.classList.add('selected');
      fmSelected = name;
    });

    const img = document.createElement('img');
    img.src = item.type === 'folder' ? '/icons/filemanager.png' : '/icons/gedit.png';

    const span = document.createElement('span');
    span.textContent = name;

    div.appendChild(img);
    div.appendChild(span);

    div.addEventListener('dblclick', () => {
      if (item.type === 'folder') {
        openPath(currentPath + name + '/');
      } else {
        openTextWindow(name, (item as VirtualFile).content);
      }
    });

    fragment.appendChild(div);
  });

  container.replaceChildren(fragment);
  status.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
  logger.log(`[FileManager] renderFiles: displayed ${count} items at path ${currentPath}`);
}

/**
 * Navigates to the specified filesystem path.
 *
 * @param path - The path to navigate to
 *
 * @remarks
 * Updates navigation history and current path, then re-renders.
 * Does nothing if the path does not exist in the filesystem.
 */
function openPath(path: string): void {
  if (!fsMap[path]) {
    console.warn(`[FileManager] openPath: path does not exist: ${path}`);
    return;
  }

  // Avoid adding consecutive duplicates
  if (history.length > 0 && history[historyIndex] === path) {
    // Already at this path, no need to add to history
    return;
  }

  history = history.slice(0, historyIndex + 1);
  history.push(path);
  historyIndex++;
  currentPath = path;

  logger.log(`[FileManager] openPath: navigated to ${path}`);
  renderFiles();
}

/**
 * Navigates back in the navigation history.
 */
function goBack(): void {
  if (historyIndex > 0) {
    historyIndex--;
    currentPath = history[historyIndex];
    logger.log(`[FileManager] goBack: navigated to ${currentPath}`);
    renderFiles();
  } else {
    logger.log('[FileManager] goBack: no previous history entry');
  }
}

/**
 * Navigates forward in the navigation history.
 */
function goForward(): void {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    currentPath = history[historyIndex];
    logger.log(`[FileManager] goForward: navigated to ${currentPath}`);
    renderFiles();
  } else {
    logger.log('[FileManager] goForward: no forward history entry');
  }
}

/**
 * Navigates to the parent directory.
 */
function goUp(): void {
  const parent = currentPath.split('/').slice(0, -2).join('/') + '/';
  if (fsMap[parent]) {
    logger.log(`[FileManager] goUp: from ${currentPath} to ${parent}`);
    openPath(parent);
  } else {
    logger.log(`[FileManager] goUp: no parent directory for ${currentPath}`);
  }
}

/**
 * Navigates to the home directory.
 */
function goHome(): void {
  logger.log('[FileManager] goHome: navigating to home directory');
  openPath(CONFIG.FS.HOME);
}

// ------------------------------------------------------------------
// ASYNCHRONOUS OPERATIONS WITH MODALS
// ------------------------------------------------------------------

/**
 * Creates a new empty file with the specified name.
 *
 * @param name - The name of the file to create
 * @param targetPath - Optional target path (defaults to currentPath)
 * @returns Promise that resolves when the file is created
 */
async function touch(name: string, targetPath: string = currentPath): Promise<void> {
  const path = targetPath.endsWith('/') ? targetPath : targetPath + '/';
  const node = window.VirtualFS.getNode(path);
  if (node && node.type === 'folder' && name) {
    const folder = (node as any).children || node; // Handle both structures if needed, but VirtualFolder uses .children
    const children = (node as VirtualFolder).children;
    children[name] = { type: 'file', content: '' } as VirtualFile;
    
    // Also add to the flattened map
    const filePath = path + name;
    fsMap[filePath] = children[name] as VirtualFile;
    logger.log(`[FileManager] touch: created file "${name}" at ${path}`);
    if (path === currentPath) renderFiles();
    dispatchFsChange();
  }
}

/**
 * Creates a new folder with the specified name.
 *
 * @param name - The name of the folder to create
 * @param targetPath - Optional target path (defaults to currentPath)
 * @returns Promise that resolves when the folder is created
 */
async function mkdir(name: string, targetPath: string = currentPath): Promise<void> {
  const path = targetPath.endsWith('/') ? targetPath : targetPath + '/';
  const node = window.VirtualFS.getNode(path);
  if (node && node.type === 'folder' && name) {
    const children = (node as VirtualFolder).children;
    const newFolder: VirtualFolder = { type: 'folder', children: {} };
    children[name] = newFolder;
    
    const folderPath = path + name + '/';
    fsMap[folderPath] = newFolder;
    logger.log(`[FileManager] mkdir: created folder "${name}" at ${path}`);
    if (path === currentPath) renderFiles();
    dispatchFsChange();
  }
}

/**
 * Deletes the specified file or folder.
 *
 * @param name - The name of the item to delete
 * @param targetPath - Optional target path (defaults to currentPath)
 * @returns Promise that resolves when the deletion is complete
 */
async function rm(name: string, targetPath: string = currentPath): Promise<void> {
  const path = targetPath.endsWith('/') ? targetPath : targetPath + '/';
  const node = window.VirtualFS.getNode(path);
  if (!node || node.type !== 'folder') return;

  const children = (node as VirtualFolder).children;
  if (!children[name]) return;

  const confirmed = await CDEModal.confirm(`Delete ${name}?`);
  if (confirmed) {
    const item = children[name];
    const fullPath = path + name + (item.type === 'folder' ? '/' : '');
    delete fsMap[fullPath];
    delete children[name];
    
    if (path === currentPath) {
      fmSelected = null;
      renderFiles();
    }
    logger.log(`[FileManager] rm: deleted "${name}" from ${path}`);
    dispatchFsChange();
  }
}

/**
 * Renames a file or folder.
 *
 * @param oldName - The current name of the item
 * @param newName - The new name for the item
 * @param targetPath - Optional target path (defaults to currentPath)
 * @returns Promise that resolves when the rename is complete
 */
async function rename(oldName: string, newName: string, targetPath: string = currentPath): Promise<void> {
  const path = targetPath.endsWith('/') ? targetPath : targetPath + '/';
  const node = window.VirtualFS.getNode(path);
  if (!node || node.type !== 'folder') return;

  const children = (node as VirtualFolder).children;
  if (children[oldName] && newName && newName !== oldName) {
    const item = children[oldName];
    const oldFullPath = path + oldName + (item.type === 'folder' ? '/' : '');
    const newFullPath = path + newName + (item.type === 'folder' ? '/' : '');

    children[newName] = item;
    delete children[oldName];
    fsMap[newFullPath] = item;
    delete fsMap[oldFullPath];

    if (path === currentPath) {
      fmSelected = null;
      renderFiles();
    }
    logger.log(`[FileManager] rename: renamed "${oldName}" to "${newName}" at ${path}`);
    dispatchFsChange();
  }
}

/**
 * Opens a text file in the read-only text editor.
 *
 * @param name - The name of the file
 * @param content - The content of the file to display
 */
async function openTextWindow(name: string, content: string): Promise<void> {
  await window.openTextEditor(name, content);
}

/**
 * Closes the currently active dropdown menu.
 */
function closeMenu(): void {
  if (activeMenu) {
    activeMenu.remove();
    activeMenu = null;
  }
}

/**
 * Closes the currently active context menu.
 */
function closeContextMenu(): void {
  if (activeContextMenu) {
    activeContextMenu.remove();
    activeContextMenu = null;
  }
}

// ------------------------------------------------------------------
// MENUS (UI IN ENGLISH)
// ------------------------------------------------------------------

/** Represents a menu item in the file manager menu bar */
interface MenuItem {
  /** The display label for the menu item */
  label: string;
  /** The action to execute when the menu item is clicked */
  action: () => Promise<void> | void;
}

/** Menu definitions for the file manager menu bar */
const fmMenus: Record<string, MenuItem[]> = {
  File: [
    {
      label: 'New File',
      action: async () => {
        const name = await CDEModal.prompt('File name:');
        if (name) await touch(name);
      },
    },
    {
      label: 'New Folder',
      action: async () => {
        const name = await CDEModal.prompt('Folder name:');
        if (name) await mkdir(name);
      },
    },
    {
      label: 'Delete Selected',
      action: async () => {
        if (fmSelected) await rm(fmSelected);
      },
    },
  ],
  Edit: [
    {
      label: 'Rename',
      action: async () => {
        if (!fmSelected) return;
        const newName = await CDEModal.prompt('New name:', fmSelected);
        if (newName) await rename(fmSelected, newName);
      },
    },
  ],
  View: [
    {
      label: 'Show Hidden Files',
      action: () => {
        showHidden = !showHidden;
        logger.log(`[FileManager] showHidden: toggled to ${showHidden}`);
        renderFiles();
      },
    },
    {
      label: 'Refresh',
      action: () => {
        logger.log('[FileManager] refresh: re-rendering files');
        renderFiles();
      },
    },
  ],
  Go: [
    { label: 'Back', action: goBack },
    { label: 'Forward', action: goForward },
    { label: 'Up', action: goUp },
    { label: 'Home', action: goHome },
  ],
};

/**
 * Sets up the menu bar event listeners.
 */
function setupMenuBar(): void {
  const menuBar = document.querySelector('.fm-menubar');
  if (!menuBar) {
    console.warn('[FileManager] setupMenuBar: menu bar element not found');
    return;
  }

  // Remove previous listeners by cloning and replacing
  menuBar.querySelectorAll('span').forEach((span) => {
    const newSpan = span.cloneNode(true) as HTMLSpanElement;
    span.parentNode?.replaceChild(newSpan, span);
  });

  const spans = menuBar.querySelectorAll('span');
  spans.forEach((span) => {
    span.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();

      const name = span.textContent?.trim() || '';
      const items = fmMenus[name];
      if (!items) {
        logger.log(`[FileManager] setupMenuBar: no items for menu "${name}"`);
        return;
      }

      const menu = document.createElement('div');
      menu.className = 'fm-dropdown';
      menu.style.zIndex = String(CONFIG.DROPDOWN.Z_INDEX);

      items.forEach((item) => {
        const option = document.createElement('div');
        option.className = 'fm-dropdown-item';
        option.textContent = item.label;
        option.addEventListener('click', async () => {
          try {
            await item.action();
          } catch (error) {
            console.error('[FileManager] menu action error:', error);
          }
          closeMenu();
        });
        menu.appendChild(option);
      });

      document.body.appendChild(menu);
      const rect = span.getBoundingClientRect();
      menu.style.left = rect.left + 'px';
      menu.style.top = rect.bottom + 'px';
      activeMenu = menu;

      logger.log(`[FileManager] setupMenuBar: opened "${name}" menu`);
    });
  });

  logger.log('[FileManager] setupMenuBar: menu bar initialized');
}

/**
 * Sets up the context menu for file items.
 */
function setupContextMenu(): void {
  const fmFiles = document.getElementById('fmFiles');
  if (!fmFiles) {
    console.warn('[FileManager] setupContextMenu: fmFiles element not found');
    return;
  }

  fmFiles.removeEventListener('contextmenu', handleContextMenu);
  fmFiles.addEventListener('contextmenu', handleContextMenu);

  logger.log('[FileManager] setupContextMenu: context menu initialized');
}

/**
 * Handles right-click context menu events on file items.
 *
 * @param e - The mouse event that triggered the context menu
 */
async function handleContextMenu(e: MouseEvent): Promise<void> {
  e.preventDefault();
  closeContextMenu();

  const target = e.target as HTMLElement;
  const fileEl = target.closest('.fm-file') as HTMLElement | null;
  if (!fileEl) return;

  const name = fileEl.dataset.name;
  if (!name) return;

  fmSelected = name;

  document.querySelectorAll('.fm-file').forEach((el) => el.classList.remove('selected'));
  fileEl.classList.add('selected');

  const menu = document.createElement('div');
  menu.className = 'fm-contextmenu';
  menu.style.zIndex = String(CONFIG.DROPDOWN.Z_INDEX);

  const items: MenuItem[] = [
    {
      label: 'Open',
      action: () => {
        const folder = getCurrentFolder();
        if (!folder) return;
        const item = folder[name];
        if (item) {
          if (item.type === 'folder') {
            openPath(currentPath + name + '/');
          } else {
            openTextWindow(name, (item as VirtualFile).content);
          }
        }
      },
    },
    {
      label: 'Rename',
      action: async () => {
        const newName = await CDEModal.prompt('New name:', name);
        if (newName) await rename(name, newName);
      },
    },
    {
      label: 'Delete',
      action: async () => await rm(name),
    },
    {
      label: 'Properties',
      action: async () => {
        const folder = getCurrentFolder();
        if (!folder) return;
        const item = folder[name];
        if (item) {
          await CDEModal.alert(`Name: ${name}\nType: ${item.type}\nPath: ${currentPath}${name}`);
        }
      },
    },
  ];

  items.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'fm-context-item';
    div.textContent = item.label;
    div.addEventListener('click', async () => {
      try {
        await item.action();
      } catch (error) {
        console.error('[FileManager] context menu action error:', error);
      }
      closeContextMenu();
    });
    menu.appendChild(div);
  });

  menu.style.left = e.pageX + 'px';
  menu.style.top = e.pageY + 'px';
  document.body.appendChild(menu);

  // Adjust position if menu goes off screen
  const menuRect = menu.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (menuRect.right > vw) {
    menu.style.left = e.pageX - menuRect.width + 'px';
  }
  if (menuRect.bottom > vh) {
    menu.style.top = e.pageY - menuRect.height + 'px';
  }

  activeContextMenu = menu;
  logger.log(`[FileManager] handleContextMenu: opened context menu for "${name}"`);
}

// ------------------------------------------------------------------
// PUBLIC API (exposed to global scope)
// ------------------------------------------------------------------

/**
 * Initializes the file manager.
 *
 * @remarks
 * Sets up the menu bar, context menu, sidebar navigation, and renders the initial files.
 * Should be called once before using the file manager.
 */
function init(): void {
  logger.log('[FileManager] init: initializing file manager');

  currentPath = CONFIG.FS.HOME;
  history = [currentPath];
  historyIndex = 0;
  fmSelected = null;
  showHidden = false;

  setupMenuBar();
  setupContextMenu();

  const sidebarItems = document.querySelectorAll('.fm-item');
  sidebarItems.forEach((item) => {
    const path = (item as HTMLElement).dataset.path;
    if (path) {
      (item as HTMLElement).onclick = null;
      item.addEventListener('click', () => openPath(path));
    }
  });

  renderFiles();

  document.addEventListener('click', (e) => {
    if (activeMenu && !activeMenu.contains(e.target as Node)) closeMenu();
    closeContextMenu();
  });

  initialized = true;
  logger.log('[FileManager] init: initialization complete');
}

/**
 * Opens the file manager window.
 */
function open(): void {
  const win = document.getElementById('fm') as HTMLElement | null;
  if (!win) {
    console.warn('[FileManager] open: file manager window element not found');
    return;
  }

  if (!initialized) {
    logger.log('[FileManager] open: not initialized, initializing now');
    init();
  }

  win.style.display = 'block';
  win.style.zIndex = String(++zIndex);

  logger.log('[FileManager] open: file manager window opened');
  renderFiles();
}

/**
 * Closes the file manager window.
 */
function close(): void {
  const win = document.getElementById('fm') as HTMLElement | null;
  if (win) {
    win.style.display = 'none';
    logger.log('[FileManager] close: file manager window closed');
  } else {
    console.warn('[FileManager] close: file manager window element not found');
  }
}

/**
 * Toggles the file manager window visibility.
 */
function toggle(): void {
  const win = document.getElementById('fm') as HTMLElement | null;
  if (!win) {
    console.warn('[FileManager] toggle: file manager window element not found');
    return;
  }

  if (!initialized) {
    logger.log('[FileManager] toggle: not initialized, initializing now');
    init();
  }

  if (win.style.display === 'none' || win.style.display === '') {
    win.style.display = 'block';
    win.style.zIndex = String(++zIndex);
    logger.log('[FileManager] toggle: file manager opened');
  } else {
    win.style.zIndex = String(++zIndex);
    logger.log('[FileManager] toggle: file manager brought to front');
  }

  renderFiles();
}

/**
 * Checks if the file manager is currently open.
 *
 * @returns {boolean} True if the file manager is open, false otherwise
 */
function isOpen(): boolean {
  const win = document.getElementById('fm') as HTMLElement | null;
  const isVisible = win?.style.display !== 'none' && win?.style.display !== '';
  logger.log(`[FileManager] isOpen: ${isVisible}`);
  return isVisible;
}

/**
 * File Manager module for navigating and managing a virtual filesystem.
 *
 * @remarks
 * Provides a complete file manager interface with navigation history,
 * context menus, file operations (create, delete, rename), and a modal
 * system for user interactions.
 */
export const FileManager = {
  /** Initializes the file manager */
  init,
  /** Opens the file manager window */
  open,
  /** Closes the file manager window */
  close,
  /** Toggles the file manager window visibility */
  toggle,
  /** Checks if the file manager is open */
  isOpen,
  /** Navigates to the specified path */
  openPath,
  /** Navigates back in history */
  goBack,
  /** Navigates forward in history */
  goForward,
  /** Navigates up one directory level */
  goUp,
  /** Navigates to the home directory */
  goHome,
};

// Expose to global scope
window.openFileManager = open;
window.closeFileManager = close;
window.toggleFileManager = toggle;
window.isFileManagerOpen = isOpen;
window.openPath = openPath;
window.goBack = goBack;
window.goForward = goForward;
window.goUp = goUp;
window.goHome = goHome;

// ------------------------------------------------------------------
// EDITOR INTEGRATION FUNCTIONS
// ------------------------------------------------------------------

/**
 * Creates a new file with the given name and content.
 * Used by the text editor when saving a new file.
 *
 * @param name - The file name.
 * @param content - The file content.
 */
window.createFile = async (name: string, content: string): Promise<void> => {
  const folder = getCurrentFolder();
  if (folder && name) {
    const newFile: VirtualFile = { type: 'file', content };
    folder[name] = newFile;
    const filePath = currentPath + name;
    fsMap[filePath] = newFile;
    renderFiles();
    logger.log(`[FileManager] Created file "${name}" from editor`);
  }
};

/**
 * Saves content to an existing file.
 * Used by the text editor when saving an existing file.
 *
 * @param path - The file name or full path (simplified: we assume it's the name in the current folder).
 * @param content - The new content.
 */
window.saveFile = (path: string, content: string): void => {
  const folder = getCurrentFolder();
  if (folder && folder[path]) {
    (folder[path] as VirtualFile).content = content;
    logger.log(`[FileManager] Saved file "${path}"`);
  } else {
    console.warn(`[FileManager] saveFile: file "${path}" not found in current folder`);
  }
};