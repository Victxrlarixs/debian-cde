import { logger } from '../utilities/logger';
import { VFS } from '../core/vfs';
import { CDEModal } from '../ui/modals';
import { WindowManager } from '../core/windowmanager';
import { openWindow, closeWindow, createZIndexManager } from '../shared/window-helpers';
import { container } from '../core/container';
import { SystemEvent } from '../core/system-events';
import type { EventBus } from '../core/event-bus';
import type { FileEventData } from '../core/system-events';

import type { EmacsElements, EmacsState } from './emacs/emacs-types';
import { EmacsEditorEngine } from './emacs/emacs-editor-engine';
import { EmacsFileManager } from './emacs/emacs-file-manager';
import { EmacsMinibufferManager } from './emacs/emacs-minibuffer-manager';
import { EmacsKeyboardHandler } from './emacs/emacs-keyboard-handler';
import { EmacsSearchManager } from './emacs/emacs-search-manager';

/**
 */
declare global {
  interface Window {
    closeEmacs: () => void;
    Emacs: {
      open: (filename?: string, content?: string) => Promise<void>;
      openSplash: () => void;
      openFile: () => Promise<void>;
      close: () => void;
      save: () => Promise<void>;
      saveAs: () => Promise<void>;
      newFile: () => Promise<void>;
      undo: () => void;
      cut: () => void;
      copy: () => void;
      paste: () => void;
      selectAll: () => void;
      wrapToggle: () => void;
      setFont: (size: string) => void;
      clearBuffer: () => Promise<void>;
      showHelp: () => void;
      findDialog: () => void;
      closeFindBar: () => void;
      findNext: () => void;
      findPrev: () => void;
    };
  }
}

class EmacsManager {
  private elements!: EmacsElements;
  private state: EmacsState = {
    currentFilePath: '',
    isModified: false,
    ctrlXPressed: false,
    wordWrap: false,
    findIndex: 0,
    lastQuery: '',
    isMinibufferActive: false,
  };

  private editor!: EmacsEditorEngine;
  private fs!: EmacsFileManager;
  private minibuffer!: EmacsMinibufferManager;
  private keyboard!: EmacsKeyboardHandler;
  private search!: EmacsSearchManager;

  private eventBus: EventBus | null = null;
  private unsubscribe: (() => void)[] = [];
  private zIndexManager = createZIndexManager(20000);

  constructor() {
    this.init();
    this.subscribeToEvents();
  }

  private subscribeToEvents(): void {
    this.eventBus = container.has('eventBus') ? container.get<EventBus>('eventBus') : null;
    if (this.eventBus) {
      const unsub = this.eventBus.on<FileEventData>(SystemEvent.FILE_OPENED, this.handleFileOpened);
      this.unsubscribe.push(unsub);
      logger.log('[Emacs] Subscribed to FILE_OPENED events');
    }
  }

  private handleFileOpened = async (data: FileEventData): Promise<void> => {
    if (data.name && data.content !== undefined) {
      await this.open(data.name, data.content, data.path);
    }
  };

  private init(): void {
    if (typeof document === 'undefined') return;

    this.elements = {
      win: document.getElementById('emacs'),
      textarea: document.getElementById('emacs-textarea') as HTMLTextAreaElement,
      minibuffer: document.getElementById('emacs-minibuffer'),
      minibufferContent: document.getElementById('emacs-minibuffer-content'),
      minibufferLabel: document.getElementById('emacs-minibuffer-label'),
      minibufferInput: document.getElementById('emacs-minibuffer-input') as HTMLInputElement,
      minibufferMsg: document.getElementById('emacs-minibuffer-msg'),
      splash: document.getElementById('emacs-splash'),
      editorArea: document.getElementById('emacs-editor-area'),
      title: document.getElementById('emacs-title'),
      fileName: document.getElementById('emacs-file-name'),
      fileStatus: document.getElementById('emacs-file-status'),
      line: document.getElementById('emacs-line'),
      col: document.getElementById('emacs-col'),
      findBar: document.getElementById('te-find-bar'),
      findInput: document.getElementById('te-find-input') as HTMLInputElement,
    };

    if (!this.elements.win || !this.elements.textarea) return;

    // Initialize Managers
    this.editor = new EmacsEditorEngine(this.elements.textarea);
    this.fs = new EmacsFileManager();
    this.minibuffer = new EmacsMinibufferManager(this.elements);
    this.search = new EmacsSearchManager(this.elements, (msg) => this.minibuffer.showMessage(msg));
    this.keyboard = new EmacsKeyboardHandler({
      onSave: () => this.save(),
      onSaveAs: () => this.saveAs(),
      onOpenFile: () => this.openFile(),
      onClose: () => this.close(),
      onSelectAll: () => this.editor.selectAll(),
      onMove: (dir) => this.editor.moveCursor(dir),
      onDelete: () => this.editor.deleteChar(),
      onSearch: () => this.search.toggleDialog(),
      onKillLine: () => this.editor.killLine(),
      onUndo: () => this.editor.undo(),
      onRecenter: () => this.recenter(),
      onExecuteCommand: () => this.executeCommand(),
      onMessage: (msg: string) => this.minibuffer.showMessage(msg),
      onUpdateUI: () => this.updateModeLine(),
    });

    this.setupEventListeners();
    logger.log('[Emacs] Initialized with SOLID architecture');
  }

  private setupEventListeners(): void {
    this.elements.win?.addEventListener('keydown', (e) =>
      this.keyboard.handleKeydown(e, this.minibuffer.isBusy)
    );
    this.elements.textarea?.addEventListener('input', () => this.onInput());
    this.elements.textarea?.addEventListener('keyup', () => this.updateModeLine());
    this.elements.textarea?.addEventListener('click', () => {
      this.elements.textarea?.focus();
      this.updateModeLine();
    });

    this.elements.findInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.search.find(1);
      if (e.key === 'Escape') this.search.close();
    });

    this.setupMenus();
  }

  private setupMenus(): void {
    document.querySelectorAll('#emacs .te-menu-label').forEach((lbl) => {
      lbl.addEventListener('click', () => {
        const menu = lbl.parentElement as HTMLElement | null;
        if (!menu) return;
        const wasOpen = menu.classList.contains('open');
        document
          .querySelectorAll('#emacs .te-menu.open')
          .forEach((m) => m.classList.remove('open'));
        if (!wasOpen) menu.classList.add('open');
      });
    });

    document.addEventListener(
      'click',
      (e) => {
        if (!(e.target as Element).closest('#emacs .te-menubar')) {
          document
            .querySelectorAll('#emacs .te-menu.open')
            .forEach((m) => m.classList.remove('open'));
        }
      },
      true
    );

    document.querySelectorAll('#emacs .te-item').forEach((item) => {
      item.addEventListener('click', () => {
        document
          .querySelectorAll('#emacs .te-menu.open')
          .forEach((m) => m.classList.remove('open'));
      });
    });
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  public openSplash(): void {
    if (!this.elements.win) return;
    this.state.currentFilePath = '';
    this.state.isModified = false;
    this.toggleUI('splash');
    this.updateTitle('XEmacs');
    this.setModeLineName('*scratch*');

    if (this.elements.textarea) {
      this.elements.textarea.value =
        ';; This buffer is for text that is not saved, and for Lisp evaluation.\n;; To create a file, visit it with C-x C-f and enter text in its buffer.\n\n';
      this.elements.textarea.setSelectionRange(
        this.elements.textarea.value.length,
        this.elements.textarea.value.length
      );
    }

    this.minibuffer.showMessage('Welcome to XEmacs');

    openWindow({
      id: 'emacs',
      zIndex: this.zIndexManager.increment(),
      center: true,
      playSound: true,
      focus: true,
      onOpen: () => {
        if (this.elements.win) {
          this.elements.win.style.width = 'min(800px, 90vw)';
          this.elements.win.style.height = 'min(600px, 80vh)';
          WindowManager.centerWindow(this.elements.win);
          this.elements.win.focus();
        }
      },
    });
  }

  public async open(filename: string, content: string = '', path: string = ''): Promise<void> {
    if (!this.elements.win || !this.elements.textarea) return;

    this.state.currentFilePath = path || filename;
    this.elements.textarea.value = content;
    this.state.isModified = false;

    this.toggleUI('editor');
    this.updateTitle(`XEmacs: ${filename}`);
    this.setModeLineName(filename);
    this.updateModeLine();
    this.minibuffer.showMessage(`Loaded: ${filename}`);

    WindowManager.showWindow('emacs');
    this.elements.win.style.width = 'min(900px, 95vw)';
    this.elements.win.style.height = 'min(700px, 85vh)';
    WindowManager.centerWindow(this.elements.win);
    this.elements.textarea.focus();
  }

  public close(): void {
    if (!this.elements.win) return;
    closeWindow('emacs');
    this.state.currentFilePath = '';
    this.search.close();
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  public async openFile(): Promise<void> {
    const input = await this.minibuffer.prompt('Visit file: ', '');
    if (!input) {
      this.minibuffer.showMessage('Quit');
      return;
    }

    const fullPath = input.startsWith('/') ? input : `/home/victxrlarixs/Desktop/${input}`;
    const node = await this.fs.getNode(fullPath);

    if (!node) {
      const parts = fullPath.split('/');
      const filename = parts.pop()!;
      const parentDir = parts.join('/') + '/';
      if (!(await this.fs.getNode(parentDir))) {
        this.minibuffer.showMessage(`No such directory: ${parentDir}`);
        return;
      }
      await this.fs.touch(parentDir, filename);
      await this.open(filename, '', fullPath);
      this.minibuffer.showMessage(`(New file) ${fullPath}`);
      return;
    }

    if (node.type !== 'file') {
      this.minibuffer.showMessage(`${fullPath} is a directory.`);
      return;
    }

    await this.open(fullPath.split('/').pop()!, node.content, fullPath);
  }

  public async save(): Promise<void> {
    if (!this.state.currentFilePath) {
      await this.saveAs();
      return;
    }

    const ok = await this.fs.save(this.state.currentFilePath, this.elements.textarea!.value);
    if (ok) {
      this.state.isModified = false;
      this.updateModeLine();
      this.minibuffer.showMessage(`Wrote ${this.state.currentFilePath}`);
    } else {
      this.minibuffer.showMessage('Error: could not save file.');
    }
  }

  public async saveAs(): Promise<void> {
    const defaultPath = this.state.currentFilePath || 'untitled.txt';
    const input = await this.minibuffer.prompt('Write file: ', defaultPath);
    if (!input) {
      this.minibuffer.showMessage('Quit');
      return;
    }

    const fullPath = input.startsWith('/') ? input : `/home/victxrlarixs/Desktop/${input}`;
    this.state.currentFilePath = fullPath;
    this.updateTitle(`XEmacs: ${fullPath.split('/').pop()}`);
    this.setModeLineName(fullPath.split('/').pop()!);
    await this.save();
  }

  public async newFile(): Promise<void> {
    if (this.state.isModified) {
      const ok = await CDEModal.confirm('Discard unsaved changes and open a new buffer?');
      if (!ok) return;
    }
    this.state.currentFilePath = '';
    this.elements.textarea!.value = '';
    this.state.isModified = false;
    this.toggleUI('editor');
    this.updateTitle('XEmacs: untitled.txt');
    this.setModeLineName('untitled.txt');
    this.updateModeLine();
    this.minibuffer.showMessage('New file.');
    this.elements.textarea!.focus();
  }

  public async clearBuffer(): Promise<void> {
    const ok = await CDEModal.confirm('Clear the entire buffer?');
    if (!ok) return;
    this.elements.textarea!.value = '';
    this.onInput();
    this.minibuffer.showMessage('Buffer cleared.');
  }

  public showHelp(): void {
    this.minibuffer.showMessage(
      'Bindings: C-x C-s Save  C-x C-c Quit  C-s Search  C-k Kill  C-_ Undo  C-g Abort'
    );
  }

  private async executeCommand(): Promise<void> {
    const cmd = await this.minibuffer.prompt('M-x ', '');
    if (!cmd) {
      this.minibuffer.showMessage('Quit');
      return;
    }

    switch (cmd.toLowerCase()) {
      case 'help':
        this.showHelp();
        break;
      case 'save-buffer':
        this.save();
        break;
      case 'find-file':
        this.openFile();
        break;
      case 'kill-emacs':
        this.close();
        break;
      case 'eval-buffer':
        this.minibuffer.showMessage('Lisp evaluation not implemented.');
        break;
      default:
        this.minibuffer.showMessage(`[M-x] [No match]: ${cmd}`);
        break;
    }
  }

  private recenter(): void {
    if (this.elements.textarea) {
      this.elements.textarea.blur();
      this.elements.textarea.focus();
      this.minibuffer.showMessage('Recently focused.');
    }
  }

  // ── UI Helpers ────────────────────────────────────────────────────────────

  private toggleUI(mode: 'splash' | 'editor'): void {
    if (mode === 'splash') {
      this.elements.splash?.classList.remove('emacs-hidden');
      this.elements.editorArea?.classList.add('emacs-hidden');
    } else {
      this.elements.splash?.classList.add('emacs-hidden');
      this.elements.editorArea?.classList.remove('emacs-hidden');
    }
  }

  private updateTitle(text: string): void {
    if (this.elements.title) this.elements.title.textContent = text;
  }

  private setModeLineName(name: string): void {
    if (this.elements.fileName) this.elements.fileName.textContent = name;
  }

  private updateModeLine(): void {
    if (this.elements.fileStatus)
      this.elements.fileStatus.textContent = this.state.isModified ? '**' : '%%';
    const pos = this.editor.getCursorPosition();
    if (this.elements.line) this.elements.line.textContent = String(pos.line);
    if (this.elements.col) this.elements.col.textContent = String(pos.col);
  }

  private onInput(): void {
    if (!this.state.isModified) {
      this.state.isModified = true;
      this.updateModeLine();
    }
  }

  // ── Global Proxies (for Menubar) ──────────────────────────────────────────

  public undo = () => this.editor.undo();
  public cut = () => this.editor.cut();
  public copy = () => this.editor.copy();
  public paste = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        this.editor.paste(text);
        this.onInput();
      })
      .catch(() => this.minibuffer.showMessage('Yank: clipboard unavailable.'));
  };
  public selectAll = () => this.editor.selectAll();
  public wrapToggle = () => {
    this.state.wordWrap = !this.state.wordWrap;
    this.editor.setWordWrap(this.state.wordWrap);
    this.minibuffer.showMessage(
      `Visual Line mode: ${this.state.wordWrap ? 'enabled' : 'disabled'}`
    );
  };
  public setFont = (s: string) => this.editor.setFontSize(s);
  public findDialog = () => this.search.toggleDialog();
  public closeFindBar = () => this.search.close();
  public findNext = () => this.search.find(1);
  public findPrev = () => this.search.find(-1);
}

// ── Singleton & Interface ───────────────────────────────────────────────────

let editorInstance: EmacsManager | null = null;
function getInstance(): EmacsManager {
  if (!editorInstance) editorInstance = new EmacsManager();
  return editorInstance;
}

if (typeof window !== 'undefined') {
  getInstance();
  (window as any).closeEmacs = () => getInstance().close();
  (window as any).Emacs = {
    open: (f?: string, c?: string) => getInstance().open(f || 'untitled.txt', c || ''),
    openSplash: () => getInstance().openSplash(),
    openFile: () => getInstance().openFile(),
    close: () => getInstance().close(),
    save: () => getInstance().save(),
    saveAs: () => getInstance().saveAs(),
    newFile: () => getInstance().newFile(),
    undo: () => getInstance().undo(),
    cut: () => getInstance().cut(),
    copy: () => getInstance().copy(),
    paste: () => getInstance().paste(),
    selectAll: () => getInstance().selectAll(),
    wrapToggle: () => getInstance().wrapToggle(),
    setFont: (s: string) => getInstance().setFont(s),
    clearBuffer: () => getInstance().clearBuffer(),
    showHelp: () => getInstance().showHelp(),
    findDialog: () => getInstance().findDialog(),
    closeFindBar: () => getInstance().closeFindBar(),
    findNext: () => getInstance().findNext(),
    findPrev: () => getInstance().findPrev(),
  };
}
