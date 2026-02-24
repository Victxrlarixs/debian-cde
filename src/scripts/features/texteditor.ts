// src/scripts/features/texteditor.ts
import { logger } from '../utilities/logger';
import { VFS } from '../core/vfs';
import { CDEModal } from '../ui/modals';

/**
 * Emacs-style Text Editor Manager
 * Supports a splash screen and full editing mode with keybindings, mode line, and minibuffer.
 */
declare global {
  interface Window {
    openTextEditor: (filename: string, content: string, path?: string) => Promise<void>;
    closeTextEditor: () => void;
    TextEditor: {
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

class TextEditorManager {
  private win: HTMLElement | null = null;
  private textarea: HTMLTextAreaElement | null = null;
  private minibuffer: HTMLElement | null = null;
  private splash: HTMLElement | null = null;
  private editorArea: HTMLElement | null = null;

  private currentFilePath: string = '';
  private isModified: boolean = false;
  private zIndex: number = 20000;
  private ctrlXPressed: boolean = false;
  private wordWrap: boolean = false;

  // Find state
  private findIndex: number = 0;
  private lastQuery: string = '';

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof document === 'undefined') return;

    this.win = document.getElementById('text-editor');
    this.textarea = document.getElementById('text-editor-textarea') as HTMLTextAreaElement;
    this.minibuffer = document.getElementById('text-editor-minibuffer');
    this.splash = document.getElementById('emacs-splash');
    this.editorArea = document.getElementById('emacs-editor');

    if (!this.textarea) return;

    this.textarea.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.textarea.addEventListener('input', () => this.onInput());
    this.textarea.addEventListener('keyup', () => this.updateModeLine());
    this.textarea.addEventListener('click', () => this.updateModeLine());

    // Find bar enter / escape
    const findInput = document.getElementById('te-find-input') as HTMLInputElement | null;
    if (findInput) {
      findInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.findNext();
        if (e.key === 'Escape') this.closeFindBar();
      });
    }

    // ── Menubar dropdown toggle ────────────────────────────────────────
    document.querySelectorAll('#text-editor .te-menu-label').forEach((lbl) => {
      lbl.addEventListener('click', () => {
        const menu = lbl.parentElement as HTMLElement | null;
        if (!menu) return;
        const wasOpen = menu.classList.contains('open');
        document.querySelectorAll('#text-editor .te-menu.open').forEach((m) => m.classList.remove('open'));
        if (!wasOpen) menu.classList.add('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!(e.target as Element).closest('#text-editor .te-menubar')) {
        document.querySelectorAll('#text-editor .te-menu.open').forEach((m) => m.classList.remove('open'));
      }
    }, true);

    document.querySelectorAll('#text-editor .te-item').forEach((item) => {
      item.addEventListener('click', () => {
        document.querySelectorAll('#text-editor .te-menu.open').forEach((m) => m.classList.remove('open'));
      });
    });

    logger.log('[Emacs] Initialized');
  }

  // ── Show / hide splash vs editing area ───────────────────────────────────

  private showSplash(): void {
    this.splash?.classList.remove('emacs-hidden');
    this.editorArea?.classList.add('emacs-hidden');
  }

  private showEditor(): void {
    this.splash?.classList.add('emacs-hidden');
    this.editorArea?.classList.remove('emacs-hidden');
  }

  // ── Open / Close ─────────────────────────────────────────────────────────

  /** Opens the splash screen (no file). */
  public openSplash(): void {
    if (!this.win) return;
    this.currentFilePath = '';
    this.isModified = false;
    this.showSplash();
    this.updateTitle('*GNU Emacs*');
    this.updateModeLineName('*GNU Emacs*');
    this.message('');

    this.win.style.display = 'flex';
    this.win.style.zIndex = String(++this.zIndex);
    if (window.centerWindow) window.centerWindow(this.win);
    if (window.focusWindow) window.focusWindow('text-editor');
  }

  /** Opens a specific file for editing. */
  public async open(filename: string, content: string = '', path: string = ''): Promise<void> {
    if (!this.win || !this.textarea) return;

    this.currentFilePath = path || filename;
    this.textarea.value = content;
    this.isModified = false;

    this.showEditor();
    this.updateTitle(`Emacs: ${filename}`);
    this.updateModeLineName(filename);
    this.updateModeLine();
    this.message(`Loaded: ${filename}`);

    this.win.style.display = 'flex';
    this.win.style.zIndex = String(++this.zIndex);
    if (window.centerWindow) window.centerWindow(this.win);
    if (window.focusWindow) window.focusWindow('text-editor');
    this.textarea.focus();
  }

  public close(): void {
    if (!this.win) return;
    this.win.style.display = 'none';
    this.currentFilePath = '';
    this.ctrlXPressed = false;
    this.closeFindBar();
  }

  private updateTitle(text: string): void {
    const titleEl = document.getElementById('text-editor-title');
    if (titleEl) titleEl.textContent = text;
  }

  private updateModeLineName(name: string): void {
    const fileNameEl = document.getElementById('editor-file-name');
    if (fileNameEl) fileNameEl.textContent = name;
  }

  // ── File Menu ─────────────────────────────────────────────────────────────

  /** Called from splash "Open a File" link or File→Open */
  public async openFile(): Promise<void> {
    const input = await CDEModal.prompt('Visit file:', '');
    if (!input) return;

    let fullPath: string;
    if (input.startsWith('/')) {
      fullPath = input;
    } else {
      fullPath = `/home/victxrlarixs/Desktop/${input}`;
    }

    const node = VFS.getNode(fullPath);
    if (!node) {
      // New file
      const parts = fullPath.split('/');
      const filename = parts.pop()!;
      const parentDir = parts.join('/') + '/';
      if (!VFS.getNode(parentDir)) {
        this.message(`No such directory: ${parentDir}`);
        return;
      }
      await VFS.touch(parentDir, filename);
      await this.open(filename, '', fullPath);
      this.message(`(New file) ${fullPath}`);
      return;
    }

    if (node.type !== 'file') {
      this.message(`${fullPath} is a directory.`);
      return;
    }

    const filename = fullPath.split('/').pop()!;
    await this.open(filename, node.content, fullPath);
  }

  public async save(): Promise<void> {
    if (!this.currentFilePath) { await this.saveAs(); return; }
    try {
      const existing = VFS.getNode(this.currentFilePath);
      if (!existing) {
        const parts = this.currentFilePath.split('/');
        const filename = parts.pop()!;
        const parentDir = parts.join('/') + '/';
        await VFS.touch(parentDir, filename);
      }
      await VFS.writeFile(this.currentFilePath, this.textarea!.value);
      this.isModified = false;
      this.updateModeLine();
      this.message(`Wrote ${this.currentFilePath}`);
      if (window.AudioManager) window.AudioManager.success();
    } catch {
      this.message('Error: could not save file.');
    }
  }

  public async saveAs(): Promise<void> {
    const defaultPath = this.currentFilePath || 'untitled.txt';
    const input = await CDEModal.prompt('Write file:', defaultPath);
    if (!input) return;

    const fullPath = input.startsWith('/') ? input : `/home/victxrlarixs/Desktop/${input}`;
    const parts = fullPath.split('/');
    const filename = parts.pop()!;
    const parentDir = parts.join('/') + '/';

    if (!VFS.getNode(parentDir)) {
      this.message(`No such directory: ${parentDir}`);
      return;
    }

    const existing = VFS.getNode(fullPath);
    if (!existing) await VFS.touch(parentDir, filename);

    this.currentFilePath = fullPath;
    this.updateTitle(`Emacs: ${filename}`);
    this.updateModeLineName(filename);
    await this.save();
  }

  public async newFile(): Promise<void> {
    if (this.isModified) {
      const ok = await CDEModal.confirm('Discard unsaved changes and open a new buffer?');
      if (!ok) return;
    }
    this.currentFilePath = '';
    this.textarea!.value = '';
    this.isModified = false;
    this.showEditor();
    this.updateTitle('Emacs: untitled.txt');
    this.updateModeLineName('untitled.txt');
    this.updateModeLine();
    this.message('New file.');
    this.textarea!.focus();
  }

  // ── Edit Menu ─────────────────────────────────────────────────────────────

  public undo(): void { document.execCommand('undo'); this.onInput(); }
  public cut(): void { document.execCommand('cut'); this.onInput(); }
  public copy(): void { document.execCommand('copy'); this.message('Copied.'); }

  public paste(): void {
    navigator.clipboard.readText()
      .then((text) => {
        const ta = this.textarea!;
        const s = ta.selectionStart, e = ta.selectionEnd;
        ta.value = ta.value.substring(0, s) + text + ta.value.substring(e);
        ta.selectionStart = ta.selectionEnd = s + text.length;
        this.onInput();
      })
      .catch(() => this.message('Yank: clipboard unavailable.'));
  }

  public selectAll(): void { this.textarea!.select(); }

  // ── Format / Options ──────────────────────────────────────────────────────

  public wrapToggle(): void {
    this.wordWrap = !this.wordWrap;
    this.textarea!.style.whiteSpace = this.wordWrap ? 'pre-wrap' : 'pre';
    this.message(`Visual Line mode: ${this.wordWrap ? 'enabled' : 'disabled'}`);
  }

  public setFont(size: string): void {
    this.textarea!.style.fontSize = size;
    this.message(`Default font size: ${size}`);
  }

  public async clearBuffer(): Promise<void> {
    const ok = await CDEModal.confirm('Clear the entire buffer?');
    if (!ok) return;
    this.textarea!.value = '';
    this.onInput();
    this.message('Buffer cleared.');
  }

  public showHelp(): void {
    this.message('Bindings: C-x C-s Save  C-x C-c Quit  C-s Search  C-k Kill  C-_ Undo  C-g Abort');
  }

  // ── Find ──────────────────────────────────────────────────────────────────

  public findDialog(): void {
    const bar = document.getElementById('te-find-bar');
    if (!bar) return;
    const hidden = bar.classList.contains('te-find-hidden');
    bar.classList.toggle('te-find-hidden', !hidden);
    if (hidden) {
      const input = document.getElementById('te-find-input') as HTMLInputElement | null;
      if (input) { input.value = ''; input.focus(); }
    }
  }

  public closeFindBar(): void {
    document.getElementById('te-find-bar')?.classList.add('te-find-hidden');
    this.textarea?.focus();
  }

  public findNext(): void { this.find(1); }
  public findPrev(): void { this.find(-1); }

  private find(dir: 1 | -1): void {
    const query = (document.getElementById('te-find-input') as HTMLInputElement | null)?.value ?? '';
    if (!query) return;

    const text = this.textarea!.value.toLowerCase();
    const q = query.toLowerCase();
    const matches: number[] = [];
    let i = text.indexOf(q);
    while (i !== -1) { matches.push(i); i = text.indexOf(q, i + 1); }

    if (!matches.length) { this.message(`Search failed: ${query}`); return; }

    if (query !== this.lastQuery) { this.findIndex = 0; this.lastQuery = query; }
    else { this.findIndex = (this.findIndex + dir + matches.length) % matches.length; }

    const pos = matches[this.findIndex];
    this.textarea!.setSelectionRange(pos, pos + query.length);
    this.textarea!.focus();
    this.message(`${this.findIndex + 1}/${matches.length}: ${query}`);
  }

  // ── Keybindings ───────────────────────────────────────────────────────────

  private handleKeydown(e: KeyboardEvent): void {
    const isCtrl = e.ctrlKey;
    const key = e.key.toLowerCase();

    if (isCtrl && key === 'x') {
      e.preventDefault();
      this.ctrlXPressed = true;
      this.message('C-x-');
      return;
    }

    if (this.ctrlXPressed) {
      this.ctrlXPressed = false;
      this.message('');
      if (isCtrl && key === 's') { e.preventDefault(); this.save(); return; }
      if (isCtrl && key === 'c') { e.preventDefault(); this.close(); return; }
      if (isCtrl && key === 'f') { e.preventDefault(); this.openFile(); return; }
      if (isCtrl && key === 'w') { e.preventDefault(); this.saveAs(); return; }
    }

    if (isCtrl) {
      switch (key) {
        case 's': e.preventDefault(); this.findDialog(); break;
        case 'k': e.preventDefault(); this.killLine(); break;
        case 'g': e.preventDefault(); this.ctrlXPressed = false; this.message('Quit'); break;
        case '_': e.preventDefault(); this.undo(); break;
      }
    }

    this.updateModeLine();
  }

  private onInput(): void {
    if (!this.isModified) { this.isModified = true; this.updateModeLine(); }
  }

  private killLine(): void {
    const ta = this.textarea!;
    const s = ta.selectionStart, text = ta.value;
    const next = text.indexOf('\n', s);
    const end = s === next ? s + 1 : next === -1 ? text.length : next;
    ta.value = text.substring(0, s) + text.substring(end);
    ta.setSelectionRange(s, s);
    this.onInput();
  }

  // ── Mode Line & Minibuffer ────────────────────────────────────────────────

  private updateModeLine(): void {
    if (!this.textarea) return;
    const statusEl = document.getElementById('editor-file-status');
    if (statusEl) statusEl.textContent = this.isModified ? '**' : '%%';

    const text = this.textarea.value;
    const pos = this.textarea.selectionStart;
    const lines = text.substring(0, pos).split('\n');
    const lineEl = document.getElementById('editor-line');
    const colEl = document.getElementById('editor-col');
    if (lineEl) lineEl.textContent = String(lines.length);
    if (colEl) colEl.textContent = String(lines[lines.length - 1].length);
  }

  private message(msg: string): void {
    if (!this.minibuffer) return;
    this.minibuffer.textContent = msg;
    if (msg && !msg.endsWith('-')) {
      setTimeout(() => {
        if (this.minibuffer?.textContent === msg) this.minibuffer.textContent = '';
      }, 5000);
    }
  }
}

// ── Singleton & Global Exposure ───────────────────────────────────────────────

let editorInstance: TextEditorManager | null = null;
function getInstance(): TextEditorManager {
  if (!editorInstance) editorInstance = new TextEditorManager();
  return editorInstance;
}

export async function openTextEditor(filename: string, content: string, path = ''): Promise<void> {
  await getInstance().open(filename, content, path);
}

export function closeTextEditor(): void {
  getInstance().close();
}

if (typeof window !== 'undefined') {
  (window as any).openTextEditor = openTextEditor;
  (window as any).closeTextEditor = closeTextEditor;
  (window as any).TextEditor = {
    // Splash / lifecycle
    open:         (f?: string, c?: string) => getInstance().open(f || 'untitled.txt', c || ''),
    openSplash:   () => getInstance().openSplash(),
    openFile:     () => getInstance().openFile(),
    close:        () => getInstance().close(),
    // File menu
    save:         () => getInstance().save(),
    saveAs:       () => getInstance().saveAs(),
    newFile:      () => getInstance().newFile(),
    // Edit menu
    undo:         () => getInstance().undo(),
    cut:          () => getInstance().cut(),
    copy:         () => getInstance().copy(),
    paste:        () => getInstance().paste(),
    selectAll:    () => getInstance().selectAll(),
    // Options
    wrapToggle:   () => getInstance().wrapToggle(),
    setFont:      (s: string) => getInstance().setFont(s),
    clearBuffer:  () => getInstance().clearBuffer(),
    showHelp:     () => getInstance().showHelp(),
    // Find
    findDialog:   () => getInstance().findDialog(),
    closeFindBar: () => getInstance().closeFindBar(),
    findNext:     () => getInstance().findNext(),
    findPrev:     () => getInstance().findPrev(),
  };
}
