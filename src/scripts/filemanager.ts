// src/scripts/filemanager.ts

import { CONFIG } from './config';

/**
 * Interfaz para el objeto CDEModal (definido en modals.ts)
 * Se asume que window.CDEModal tiene estos métodos.
 */
interface CDEModalInterface {
  alert(message: string): Promise<void>;
  confirm(question: string): Promise<boolean>;
  prompt(question: string, defaultValue?: string): Promise<string | null>;
}

declare global {
  interface Window {
    CDEModal?: CDEModalInterface;
    openFileManager: () => void;
    closeFileManager: () => void;
    toggleFileManager: () => void;
    isFileManagerOpen: () => boolean;
    openPath: (path: string) => void;
    goBack: () => void;
    goForward: () => void;
    goUp: () => void;
    goHome: () => void;
  }
}

// ------------------------------------------------------------------
// DEPENDENCIA: CDEModal (con fallback nativo)
// ------------------------------------------------------------------
const CDEModal: CDEModalInterface = window.CDEModal || {
  alert: async (msg: string) => {
    alert(msg);
  },
  confirm: async (msg: string) => confirm(msg),
  prompt: async (msg: string, def: string = '') => prompt(msg, def),
};

// ------------------------------------------------------------------
// TIPOS DEL SISTEMA DE ARCHIVOS VIRTUAL
// ------------------------------------------------------------------
type FileType = 'file' | 'folder';

interface VirtualFile {
  type: 'file';
  content: string;
}

interface VirtualFolder {
  type: 'folder';
  children: Record<string, VirtualFileSystemNode>;
}

type VirtualFileSystemNode = VirtualFile | VirtualFolder;

// Sistema de archivos virtual (estructura)
const fs: Record<string, VirtualFolder> = {
  [CONFIG.FS.HOME]: {
    type: 'folder',
    children: {
      Desktop: { type: 'folder', children: {} },
      'welcome.txt': { type: 'file', content: 'Welcome to Debian WebCDE.' },
      tutorials: {
        type: 'folder',
        children: {
          'getting-started.txt': {
            type: 'file',
            content: 'Use ls, cd, cat, mkdir, touch.',
          },
        },
      },
      settings: {
        type: 'folder',
        children: {
          'theme.txt': { type: 'file', content: 'Current theme: CDE Retro' },
        },
      },
    },
  },
};

let currentPath: string = CONFIG.FS.HOME;
let history: string[] = [];
let historyIndex: number = -1;
let fmSelected: string | null = null;
let showHidden: boolean = false;
let zIndex: number = CONFIG.FILEMANAGER.BASE_Z_INDEX;
let initialized: boolean = false;
let activeMenu: HTMLElement | null = null;
let activeContextMenu: HTMLElement | null = null;

// ------------------------------------------------------------------
// FUNCIONES PRIVADAS
// ------------------------------------------------------------------

/**
 * Obtiene el contenido de la carpeta actual.
 */
function getCurrentFolder(): Record<string, VirtualFileSystemNode> | null {
  return fs[currentPath]?.children || null;
}

/**
 * Renderiza los archivos en la interfaz.
 */
function renderFiles(): void {
  const container = document.getElementById('fmFiles');
  const pathInput = document.getElementById('fmPath') as HTMLInputElement | null;
  const status = document.getElementById('fmStatus');

  if (!container || !pathInput || !status) {
    console.warn('⚠️ File Manager: elementos no encontrados');
    return;
  }

  container.innerHTML = '';
  pathInput.value = currentPath;

  const folder = getCurrentFolder();
  if (!folder) {
    console.warn(`⚠️ File Manager: ruta no encontrada: ${currentPath}`);
    return;
  }

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

    container.appendChild(div);
  });

  status.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
}

/**
 * Abre una ruta del sistema de archivos.
 */
function openPath(path: string): void {
  if (!fs[path]) return;
  history = history.slice(0, historyIndex + 1);
  history.push(path);
  historyIndex++;
  currentPath = path;
  renderFiles();
}

/**
 * Navega hacia atrás en el historial.
 */
function goBack(): void {
  if (historyIndex > 0) {
    historyIndex--;
    currentPath = history[historyIndex];
    renderFiles();
  }
}

/**
 * Navega hacia adelante en el historial.
 */
function goForward(): void {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    currentPath = history[historyIndex];
    renderFiles();
  }
}

/**
 * Navega al directorio padre.
 */
function goUp(): void {
  const parent = currentPath.split('/').slice(0, -2).join('/') + '/';
  if (fs[parent]) openPath(parent);
}

/**
 * Navega al directorio home.
 */
function goHome(): void {
  openPath(CONFIG.FS.HOME);
}

// ------------------------------------------------------------------
// OPERACIONES ASÍNCRONAS CON MODALES
// ------------------------------------------------------------------

async function touch(name: string): Promise<void> {
  const folder = getCurrentFolder();
  if (folder && name) {
    folder[name] = { type: 'file', content: '' } as VirtualFile;
    renderFiles();
  }
}

async function mkdir(name: string): Promise<void> {
  const folder = getCurrentFolder();
  if (folder && name) {
    folder[name] = { type: 'folder', children: {} } as VirtualFolder;
    renderFiles();
  }
}

async function rm(name: string): Promise<void> {
  const folder = getCurrentFolder();
  if (!folder) return;
  const confirmed = await CDEModal.confirm(`Delete ${name}?`);
  if (confirmed) {
    delete folder[name];
    fmSelected = null;
    renderFiles();
  }
}

async function rename(oldName: string, newName: string): Promise<void> {
  const folder = getCurrentFolder();
  if (folder && folder[oldName] && newName && newName !== oldName) {
    folder[newName] = folder[oldName];
    delete folder[oldName];
    fmSelected = null;
    renderFiles();
  }
}

function openTextWindow(name: string, content: string): void {
  const win = document.getElementById('textWindow') as HTMLElement | null;
  if (!win) {
    console.warn('⚠️ File Manager: elemento #textWindow no encontrado');
    return;
  }
  const titleEl = document.getElementById('textTitle') as HTMLElement | null;
  const contentEl = document.getElementById('textContent') as HTMLElement | null;
  if (titleEl) titleEl.textContent = name;
  if (contentEl) contentEl.textContent = content;
  win.style.display = 'block';
  win.style.zIndex = String(++zIndex);
}

function closeMenu(): void {
  if (activeMenu) {
    activeMenu.remove();
    activeMenu = null;
  }
}

function closeContextMenu(): void {
  if (activeContextMenu) {
    activeContextMenu.remove();
    activeContextMenu = null;
  }
}

// ------------------------------------------------------------------
// MENÚS (INTERFAZ DE USUARIO EN INGLÉS)
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
};

function setupMenuBar(): void {
  const menuBar = document.querySelector('.fm-menubar');
  if (!menuBar) return;

  // Eliminar listeners anteriores clonando y reemplazando
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
      if (!items) return;

      const menu = document.createElement('div');
      menu.className = 'fm-dropdown';
      menu.style.zIndex = String(++zIndex);

      items.forEach((item) => {
        const option = document.createElement('div');
        option.className = 'fm-dropdown-item';
        option.textContent = item.label;
        option.addEventListener('click', async () => {
          try {
            await item.action();
          } catch (error) {
            console.error('Error en acción del menú:', error);
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
    });
  });
}

function setupContextMenu(): void {
  const fmFiles = document.getElementById('fmFiles');
  if (!fmFiles) return;

  fmFiles.removeEventListener('contextmenu', handleContextMenu);
  fmFiles.addEventListener('contextmenu', handleContextMenu);
}

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
  menu.style.zIndex = String(++zIndex);

  const items: MenuItem[] = [
    {
      label: 'Open',
      action: () => {
        const folder = getCurrentFolder();
        if (!folder) return;
        const item = folder[name];
        if (item) {
          if (item.type === 'folder') openPath(currentPath + name + '/');
          else openTextWindow(name, (item as VirtualFile).content);
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
        console.error('Error en menú contextual:', error);
      }
      closeContextMenu();
    });
    menu.appendChild(div);
  });

  menu.style.left = e.pageX + 'px';
  menu.style.top = e.pageY + 'px';
  document.body.appendChild(menu);

  // Ajustar posición si se sale de la pantalla
  const menuRect = menu.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (menuRect.right > vw) menu.style.left = e.pageX - menuRect.width + 'px';
  if (menuRect.bottom > vh) menu.style.top = e.pageY - menuRect.height + 'px';

  activeContextMenu = menu;
}

// ------------------------------------------------------------------
// API PÚBLICA (expuesta al ámbito global)
// ------------------------------------------------------------------

function init(): void {
  if (initialized) {
    console.log('⚠️ File Manager: ya inicializado');
    return;
  }
  console.log('📁 File Manager: inicializando...');
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

  // Cerrar menús al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (activeMenu && !activeMenu.contains(e.target as Node)) closeMenu();
    closeContextMenu();
  });

  initialized = true;
  console.log('✅ File Manager: inicializado');
}

function open(): void {
  const win = document.getElementById('fm') as HTMLElement | null;
  if (!win) return;
  if (!initialized) init();
  win.style.display = 'block';
  win.style.zIndex = String(++zIndex);
  renderFiles();
}

function close(): void {
  const win = document.getElementById('fm') as HTMLElement | null;
  if (win) win.style.display = 'none';
}

function toggle(): void {
  const win = document.getElementById('fm') as HTMLElement | null;
  if (!win) return;
  if (!initialized) init();
  if (win.style.display === 'none' || win.style.display === '') {
    win.style.display = 'block';
    win.style.zIndex = String(++zIndex);
  } else {
    win.style.zIndex = String(++zIndex);
  }
  renderFiles();
}

function isOpen(): boolean {
  const win = document.getElementById('fm') as HTMLElement | null;
  return win?.style.display !== 'none' && win?.style.display !== '';
}

console.log('✅ FileManager module loaded (call FileManager.init() to start)');


export const FileManager = {
  init,
  open,
  close,
  toggle,
  isOpen,
  openPath,
  goBack,
  goForward,
  goUp,
  goHome,
};

// Exponer al ámbito global
window.openFileManager = open;
window.closeFileManager = close;
window.toggleFileManager = toggle;
window.isFileManagerOpen = isOpen;
window.openPath = openPath;
window.goBack = goBack;
window.goForward = goForward;
window.goUp = goUp;
window.goHome = goHome;