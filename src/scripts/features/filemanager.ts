// src/scripts/features/filemanager.ts

import { CONFIG } from '../core/config';
import { VFS, type VFSNode, type VFSFile, type VFSFolder } from '../core/vfs';
import { CDEModal } from '../ui/modals';
import { logger } from '../utilities/logger';

declare global {
  interface Window {
    openFileManager: () => void;
    closeFileManager: () => void;
    toggleFileManager: () => void;
    isFileManagerOpen: () => boolean;
    openPath: (path: string) => void;
    goBack: () => void;
    goForward: () => void;
    goUp: () => void;
    goHome: () => void;
    createFile: (name: string, content: string) => Promise<void>;
    saveFile: (path: string, content: string) => void;
    CDEModal: typeof CDEModal;
  }
}

(window as any).CDEModal = CDEModal;
window.VirtualFS = VFS;

// ------------------------------------------------------------------
// INTERNAL STATE
// ------------------------------------------------------------------

let currentPath: string = CONFIG.FS.HOME;
let history: string[] = [];
let historyIndex: number = -1;
let fmSelected: string | null = null;
let showHidden: boolean = false;
let zIndex: number = CONFIG.FILEMANAGER.BASE_Z_INDEX;
let initialized: boolean = false;
let activeMenu: HTMLElement | null = null;
let activeContextMenu: HTMLElement | null = null;

/**
 * Listens for VFS changes and re-renders if the change affects the current path.
 */
window.addEventListener('cde-fs-change', (e: any) => {
  if (e.detail?.path === currentPath) {
    renderFiles();
  }
});

// ------------------------------------------------------------------
// PRIVATE FUNCTIONS
// ------------------------------------------------------------------

/**
 * Renders the files in the current folder to the UI.
 */
function renderFiles(): void {
  const container = document.getElementById('fmFiles');
  const pathInput = document.getElementById('fmPath') as HTMLInputElement | null;
  const status = document.getElementById('fmStatus');

  if (!container || !pathInput || !status) return;

  pathInput.value = currentPath;
  const folder = VFS.getChildren(currentPath);
  
  if (!folder) {
    logger.warn(`[FileManager] renderFiles: path not found: ${currentPath}`);
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
        openTextWindow(name, (item as VFSFile).content);
      }
    });

    fragment.appendChild(div);
  });

  container.replaceChildren(fragment);
  status.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
}

/**
 * Navigates to the specified filesystem path.
 */
function openPath(path: string): void {
  if (!VFS.getNode(path)) {
    logger.warn(`[FileManager] openPath: path does not exist: ${path}`);
    return;
  }

  if (history.length > 0 && history[historyIndex] === path) return;

  history = history.slice(0, historyIndex + 1);
  history.push(path);
  historyIndex++;
  currentPath = path;

  renderFiles();
}

/**
 * Navigates back in history.
 */
function goBack(): void {
  if (historyIndex > 0) {
    historyIndex--;
    currentPath = history[historyIndex];
    renderFiles();
  }
}

/**
 * Navigates forward in history.
 */
function goForward(): void {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    currentPath = history[historyIndex];
    renderFiles();
  }
}

/**
 * Navigates up one level.
 */
function goUp(): void {
  const parts = currentPath.split('/').filter(Boolean);
  if (parts.length > 0) {
    parts.pop();
    const parent = '/' + parts.join('/') + (parts.length > 0 ? '/' : '');
    if (VFS.getNode(parent)) {
      openPath(parent);
    }
  }
}

/**
 * Navigates to home.
 */
function goHome(): void {
  openPath(CONFIG.FS.HOME);
}

// ------------------------------------------------------------------
// OPERATIONS
// ------------------------------------------------------------------

async function touch(name: string): Promise<void> {
  await VFS.touch(currentPath, name);
}

async function mkdir(name: string): Promise<void> {
  await VFS.mkdir(currentPath, name);
}

async function rm(name: string): Promise<void> {
  if (!name) return;
  const confirmed = await CDEModal.confirm(`Delete ${name}?`);
  if (confirmed) {
    await VFS.rm(currentPath, name);
    fmSelected = null;
  }
}

async function rename(oldName: string, newName: string): Promise<void> {
  await VFS.rename(currentPath, oldName, newName);
  fmSelected = null;
}

async function openTextWindow(name: string, content: string): Promise<void> {
  if (window.openTextEditor) {
    await window.openTextEditor(name, content);
  }
}

// ------------------------------------------------------------------
// MENUS
// ------------------------------------------------------------------

interface MenuItem {
  label: string;
  action: () => Promise<void> | void;
}

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
        renderFiles();
      },
    },
    {
      label: 'Refresh',
      action: () => renderFiles(),
    },
  ],
  Go: [
    { label: 'Back', action: goBack },
    { label: 'Forward', action: goForward },
    { label: 'Up', action: goUp },
    { label: 'Home', action: goHome },
  ],
  Places: [
    {
      label: 'Settings',
      action: () => openPath(CONFIG.FS.HOME + 'settings/'),
    },
    {
      label: 'Manual Pages',
      action: () => openPath(CONFIG.FS.HOME + 'man-pages/'),
    },
    {
      label: 'Desktop',
      action: () => openPath(CONFIG.FS.DESKTOP),
    },
  ],
};

function setupMenuBar(): void {
  const menuBar = document.querySelector('.fm-menubar');
  if (!menuBar) return;

  menuBar.querySelectorAll('span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();

      const name = span.textContent?.trim() || '';
      const items = fmMenus[name];
      if (!items) return;

      const menu = document.createElement('div');
      menu.className = 'fm-dropdown';
      menu.style.zIndex = String(CONFIG.DROPDOWN.Z_INDEX);

      items.forEach((item) => {
        const option = document.createElement('div');
        option.className = 'fm-dropdown-item';
        option.textContent = item.label;
        option.addEventListener('click', async () => {
          await item.action();
          closeMenu();
        });
        menu.appendChild(option);
      });

      document.body.appendChild(menu);
      const rect = span.getBoundingClientRect();
      menu.style.left = rect.left + 'px';
      menu.style.top = rect.bottom + 'px';
      activeMenu = menu;
    });
  });
}

function closeMenu(): void {
  if (activeMenu) {
    activeMenu.remove();
    activeMenu = null;
  }
}

function handleContextMenu(e: MouseEvent): void {
  e.preventDefault();
  if (activeContextMenu) activeContextMenu.remove();

  const target = e.target as HTMLElement;
  const fileEl = target.closest('.fm-file') as HTMLElement | null;

  const menu = document.createElement('div');
  menu.className = 'fm-contextmenu';
  menu.style.zIndex = String(CONFIG.DROPDOWN.Z_INDEX);

  let items: MenuItem[] = [];

  if (fileEl) {
    const name = fileEl.dataset.name;
    if (!name) return;

    fmSelected = name;
    document.querySelectorAll('.fm-file').forEach((el) => el.classList.remove('selected'));
    fileEl.classList.add('selected');

    items = [
      {
        label: 'Open',
        action: () => {
          const item = VFS.getNode(currentPath + name + (VFS.getNode(currentPath + name + '/') ? '/' : ''));
          if (item) {
            if (item.type === 'folder') openPath(currentPath + name + '/');
            else openTextWindow(name, (item as VFSFile).content);
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
        action: () => rm(name),
      },
    ];
  } else {
    items = fmMenus['File'];
  }

  items.forEach((item) => {
    const option = document.createElement('div');
    option.className = 'fm-context-item';
    option.textContent = item.label;
    option.addEventListener('click', async () => {
      await item.action();
      menu.remove();
    });
    menu.appendChild(option);
  });

  document.body.appendChild(menu);
  menu.style.left = e.clientX + 'px';
  menu.style.top = e.clientY + 'px';
  activeContextMenu = menu;
}

// ------------------------------------------------------------------
// INIT & EXPOSURE
// ------------------------------------------------------------------

function initFileManager(): void {
  if (initialized) return;

  setupMenuBar();
  const fmFiles = document.getElementById('fmFiles');
  if (fmFiles) fmFiles.addEventListener('contextmenu', handleContextMenu);

  document.addEventListener('click', () => {
    closeMenu();
    if (activeContextMenu) {
      activeContextMenu.remove();
      activeContextMenu = null;
    }
  });

  const pathInput = document.getElementById('fmPath') as HTMLInputElement | null;
  if (pathInput) {
    pathInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') openPath(pathInput.value);
    });
  }

  initialized = true;
  logger.log('[FileManager] Initialized');
}

// ------------------------------------------------------------------
// EXPOSURE
// ------------------------------------------------------------------

window.openFileManager = () => {
  const win = document.getElementById('fm');
  if (win) {
    win.style.display = 'flex';
    win.style.zIndex = String(++zIndex);
    if (window.AudioManager) window.AudioManager.windowOpen();
    initFileManager();
    openPath(currentPath);
    if (window.focusWindow) window.focusWindow('fm');
  }
};

window.closeFileManager = () => {
  const win = document.getElementById('fm');
  if (win) {
    win.style.display = 'none';
    if (window.AudioManager) window.AudioManager.windowClose();
  }
};

window.toggleFileManager = () => {
  const win = document.getElementById('fm');
  if (win?.style.display === 'none' || !win?.style.display) window.openFileManager();
  else window.closeFileManager();
};

window.isFileManagerOpen = () => {
  const win = document.getElementById('fm');
  return !!win && win.style.display !== 'none';
};

window.openPath = openPath;
window.goBack = goBack;
window.goForward = goForward;
window.goUp = goUp;
window.goHome = goHome;

window.createFile = async (name, content) => {
  await VFS.touch(currentPath, name);
  const node = VFS.getNode(currentPath + name) as VFSFile;
  if (node) node.content = content;
};

window.saveFile = (path, content) => {
  const node = VFS.getNode(path);
  if (node?.type === 'file') {
    node.content = content;
    logger.log(`[FileManager] Saved: ${path}`);
  }
};

export const FileManager = {
  init: initFileManager,
  open: window.openFileManager,
  close: window.closeFileManager,
  toggle: window.toggleFileManager,
  isOpen: window.isFileManagerOpen,
  openPath: openPath
};

logger.log('[FileManager] Module loaded');
