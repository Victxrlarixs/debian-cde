import { logger } from '../utilities/logger';
import { VFS } from '../core/vfs';
import { CDEModal } from '../ui/modals';
import { WindowManager } from '../core/windowmanager';
import { openWindow, closeWindow, createZIndexManager } from '../shared/window-helpers';
import { container } from '../core/container';
import { SystemEvent } from '../core/system-events';
import type { EventBus } from '../core/event-bus';
import type { FileEventData } from '../core/system-events';
import { ErrorSeverity } from '../core/error-handler';

/**
 * Vi IMproved (Vim) - 90s authentic modal editor
 * Implements Normal, Insert, and Visual modes with classic keybindings
 */

type VimMode = 'normal' | 'insert' | 'visual' | 'visual-line' | 'command';

declare global {
  interface Window {
    Vim: {
      open: (filename?: string, content?: string, path?: string) => Promise<void>;
      close: () => void;
    };
  }
}

class VimManager {
  private win: HTMLElement | null = null;
  private textarea: HTMLTextAreaElement | null = null;
  private modeDisplay: HTMLElement | null = null;
  private positionDisplay: HTMLElement | null = null;
  private fileInfoDisplay: HTMLElement | null = null;
  private commandLine: HTMLElement | null = null;
  private commandInput: HTMLInputElement | null = null;
  private eventBus: EventBus | null = null;
  private unsubscribe: (() => void)[] = [];

  private mode: VimMode = 'normal';
  private currentFilePath: string = '';
  private isModified: boolean = false;
  private zIndexManager = createZIndexManager(20000);
  private visualStartPos: number = 0;
  private isModifiable: boolean = true;
  private clipboard: string = '';
  private lastCommand: string = '';
  private searchTerm: string = '';
  private searchDirection: 'forward' | 'backward' = 'forward';
  private showLineNumbers: boolean = false;

  constructor() {
    this.init();
    this.subscribeToEvents();
  }

  private subscribeToEvents(): void {
    this.eventBus = container.has('eventBus') ? container.get<EventBus>('eventBus') : null;
    if (this.eventBus) {
      const unsub = this.eventBus.on<FileEventData>(SystemEvent.FILE_OPENED, this.handleFileOpened);
      this.unsubscribe.push(unsub);
      logger.log('[Vim] Subscribed to FILE_OPENED events');
    }
  }

  private handleFileOpened = async (data: FileEventData): Promise<void> => {
    if (data.name && data.content !== undefined) {
      await this.open(data.name, data.content, data.path);
    }
  };

  private init(): void {
    if (typeof document === 'undefined') return;

    this.win = document.getElementById('vim');
    this.textarea = document.getElementById('vim-textarea') as HTMLTextAreaElement;
    this.modeDisplay = document.getElementById('vim-mode');
    this.positionDisplay = document.getElementById('vim-position');
    this.fileInfoDisplay = document.getElementById('vim-file-info');
    this.commandLine = document.getElementById('vim-command');
    this.commandInput = document.getElementById('vim-command-input') as HTMLInputElement;

    if (!this.win || !this.textarea) return;

    this.setMode('normal');

    this.textarea.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.textarea.addEventListener('click', () => this.updatePosition());
    this.textarea.addEventListener('input', () => this.onInput());

    if (this.commandInput) {
      this.commandInput.addEventListener('keydown', (e) => this.handleCommandKeydown(e));
    }

    logger.log('[Vim] Initialized');
  }

  public async open(filename: string = '', content: string = '', path: string = ''): Promise<void> {
    if (!this.win || !this.textarea) return;

    this.currentFilePath = path || filename || '';
    this.isModified = false;
    this.isModifiable = true;
    this.setMode('normal');

    if (!filename && !content) {
      this.showSplash();
    } else {
      this.textarea.value = content;
      this.updateTitle(filename || '[No Name]');
      this.updateFileInfo();
    }

    this.updatePosition();

    openWindow({
      id: 'vim',
      zIndex: this.zIndexManager.increment(),
      center: true,
      playSound: true,
      focus: true,
      onOpen: () => {
        if (this.win) {
          this.win.style.width = 'min(800px, 90vw)';
          this.win.style.height = 'min(600px, 80vh)';
          WindowManager.centerWindow(this.win);
          this.textarea?.focus();
        }
      },
    });
  }

  private clearSplashIfNeeded(): void {
    if (!this.textarea) return;
    if (this.textarea.value.includes('VIM - Vi IMproved')) {
      this.textarea.value = '';
      this.isModifiable = true;
    }
  }

  private showSplash(): void {
    if (!this.textarea) return;

    const splash = `~
~
~                     VIM - Vi IMproved
~
~                       version 5.3
~                  by Bram Moolenaar et al.
~           Vim is open source and freely distributable
~
~              Help poor children in Uganda!
~          type  :help<Enter>       for information
~
~          type  :q<Enter>               to exit
~          type  :help<Enter>  or  <F1>  for on-line help
~          type  :help version5<Enter>   for version info
~
~
~
~
~
~
~
~
~`;

    this.textarea.value = splash;
    this.isModifiable = false;
    this.updateTitle('[No Name]');
    this.updateFileInfo();
  }

  public close(): void {
    if (!this.win) return;

    if (this.isModified) {
      CDEModal.confirm('No write since last change. Quit anyway?').then((confirmed) => {
        if (confirmed) {
          closeWindow('vim');
          this.currentFilePath = '';
          this.isModified = false;
          this.unsubscribe.forEach((fn) => fn());
          this.unsubscribe = [];
        }
      });
    } else {
      closeWindow('vim');
      this.currentFilePath = '';
      this.unsubscribe.forEach((fn) => fn());
      this.unsubscribe = [];
    }
  }

  private setMode(mode: VimMode): void {
    this.mode = mode;

    if (!this.textarea || !this.modeDisplay) return;

    // Remove all mode classes
    this.textarea.classList.remove('vim-normal-mode', 'vim-insert-mode', 'vim-visual-mode', 'vim-visual-line-mode');

    switch (mode) {
      case 'normal':
        this.textarea.readOnly = false;
        this.textarea.classList.add('vim-normal-mode');
        this.modeDisplay.textContent = '';
        if (this.commandLine) this.commandLine.style.display = 'none';
        // Ensure focus stays on textarea
        setTimeout(() => this.textarea?.focus(), 10);
        break;

      case 'insert':
        this.textarea.readOnly = false;
        this.textarea.classList.add('vim-insert-mode');
        this.modeDisplay.textContent = '-- INSERT --';
        if (this.commandLine) this.commandLine.style.display = 'none';
        setTimeout(() => this.textarea?.focus(), 10);
        break;

      case 'visual':
        this.textarea.readOnly = false;
        this.textarea.classList.add('vim-visual-mode');
        this.modeDisplay.textContent = '-- VISUAL --';
        this.visualStartPos = this.textarea.selectionStart;
        if (this.commandLine) this.commandLine.style.display = 'none';
        setTimeout(() => this.textarea?.focus(), 10);
        break;

      case 'visual-line':
        this.textarea.readOnly = false;
        this.textarea.classList.add('vim-visual-line-mode');
        this.modeDisplay.textContent = '-- VISUAL LINE --';
        this.selectCurrentLine();
        if (this.commandLine) this.commandLine.style.display = 'none';
        setTimeout(() => this.textarea?.focus(), 10);
        break;

      case 'command':
        this.textarea.readOnly = false;
        if (this.commandLine) {
          this.commandLine.style.display = 'flex';
          setTimeout(() => this.commandInput?.focus(), 10);
        }
        break;
    }

    this.updatePosition();
  }

  private handleKeydown(e: KeyboardEvent): void {
    if (this.mode === 'command') return;

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.setMode('normal');
      // Force focus with a small delay to ensure mode change completes
      setTimeout(() => {
        this.textarea?.focus();
      }, 0);
      return;
    }

    if (this.mode === 'normal') {
      this.handleNormalMode(e);
    } else if (this.mode === 'insert') {
      this.handleInsertMode();
    } else if (this.mode === 'visual' || this.mode === 'visual-line') {
      this.handleVisualMode(e);
    }

    this.updatePosition();
  }

  private handleNormalMode(e: KeyboardEvent): void {
    const key = e.key.toLowerCase();

    // Prevent typing in normal mode (but allow navigation and commands)
    if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && 
        key !== 'h' && key !== 'j' && key !== 'k' && key !== 'l' && 
        key !== 'i' && key !== 'a' && key !== 'o' && key !== 'v' && 
        key !== 'x' && key !== 'd' && key !== 'u' && key !== 'g' &&
        key !== '0' && key !== '$' && key !== ':' && key !== 'y' &&
        key !== 'p' && key !== 'r' && key !== 'c' && key !== 'w' &&
        key !== 'b' && key !== 'e' && key !== '/' && key !== 'n' &&
        key !== '.') {
      e.preventDefault();
      return;
    }

    if (key === 'h' || key === 'arrowleft') {
      e.preventDefault();
      this.moveCursor('left');
      this.lastCommand = 'h';
    } else if (key === 'j' || key === 'arrowdown') {
      e.preventDefault();
      this.moveCursor('down');
      this.lastCommand = 'j';
    } else if (key === 'k' || key === 'arrowup') {
      e.preventDefault();
      this.moveCursor('up');
      this.lastCommand = 'k';
    } else if (key === 'l' || key === 'arrowright') {
      e.preventDefault();
      this.moveCursor('right');
      this.lastCommand = 'l';
    } else if (key === 'w') {
      e.preventDefault();
      this.moveCursor('nextWord');
      this.lastCommand = 'w';
    } else if (key === 'b') {
      e.preventDefault();
      this.moveCursor('prevWord');
      this.lastCommand = 'b';
    } else if (key === 'e') {
      e.preventDefault();
      this.moveCursor('endWord');
      this.lastCommand = 'e';
    } else if (key === '0') {
      e.preventDefault();
      this.moveCursor('home');
      this.lastCommand = '0';
    } else if (key === '$') {
      e.preventDefault();
      this.moveCursor('end');
      this.lastCommand = '$';
    } else if (key === 'g' && !e.shiftKey) {
      e.preventDefault();
      this.moveCursor('fileStart');
      this.lastCommand = 'gg';
    } else if (key === 'g' && e.shiftKey) {
      e.preventDefault();
      this.moveCursor('fileEnd');
      this.lastCommand = 'G';
    } else if (key === 'i') {
      e.preventDefault();
      if (!this.isModifiable) {
        this.showMessage("E21: Cannot make changes, 'modifiable' is off", true);
        return;
      }
      this.clearSplashIfNeeded();
      this.setMode('insert');
      this.lastCommand = 'i';
    } else if (key === 'a') {
      e.preventDefault();
      if (!this.isModifiable) {
        this.showMessage("E21: Cannot make changes, 'modifiable' is off", true);
        return;
      }
      this.clearSplashIfNeeded();
      this.moveCursor('right');
      this.setMode('insert');
      this.lastCommand = 'a';
    } else if (key === 'o') {
      e.preventDefault();
      if (!this.isModifiable) {
        this.showMessage("E21: Cannot make changes, 'modifiable' is off", true);
        return;
      }
      this.clearSplashIfNeeded();
      this.insertNewLine('below');
      this.setMode('insert');
      this.lastCommand = 'o';
    } else if (key === 'o' && e.shiftKey) {
      e.preventDefault();
      if (!this.isModifiable) {
        this.showMessage("E21: Cannot make changes, 'modifiable' is off", true);
        return;
      }
      this.clearSplashIfNeeded();
      this.insertNewLine('above');
      this.setMode('insert');
      this.lastCommand = 'O';
    } else if (key === 'v' && !e.shiftKey) {
      e.preventDefault();
      this.clearSplashIfNeeded();
      this.setMode('visual');
      this.lastCommand = 'v';
    } else if (key === 'v' && e.shiftKey) {
      e.preventDefault();
      this.clearSplashIfNeeded();
      this.setMode('visual-line');
      this.lastCommand = 'V';
    } else if (key === 'x') {
      e.preventDefault();
      if (!this.isModifiable) {
        this.showMessage("E21: Cannot make changes, 'modifiable' is off", true);
        return;
      }
      this.deleteChar();
      this.lastCommand = 'x';
    } else if (key === 'd') {
      e.preventDefault();
      if (!this.isModifiable) {
        this.showMessage("E21: Cannot make changes, 'modifiable' is off", true);
        return;
      }
      // Check for dd (delete line)
      if (this.lastCommand === 'd') {
        this.deleteLine();
        this.lastCommand = 'dd';
      } else {
        this.lastCommand = 'd';
        setTimeout(() => {
          if (this.lastCommand === 'd') this.lastCommand = '';
        }, 1000);
      }
    } else if (key === 'y') {
      e.preventDefault();
      // Check for yy (yank line)
      if (this.lastCommand === 'y') {
        this.yankLine();
        this.lastCommand = 'yy';
      } else {
        this.lastCommand = 'y';
        setTimeout(() => {
          if (this.lastCommand === 'y') this.lastCommand = '';
        }, 1000);
      }
    } else if (key === 'p') {
      e.preventDefault();
      if (!this.isModifiable) {
        this.showMessage("E21: Cannot make changes, 'modifiable' is off", true);
        return;
      }
      this.paste();
      this.lastCommand = 'p';
    } else if (key === 'p' && e.shiftKey) {
      e.preventDefault();
      if (!this.isModifiable) {
        this.showMessage("E21: Cannot make changes, 'modifiable' is off", true);
        return;
      }
      this.pasteBefore();
      this.lastCommand = 'P';
    } else if (key === 'r') {
      e.preventDefault();
      if (!this.isModifiable) {
        this.showMessage("E21: Cannot make changes, 'modifiable' is off", true);
        return;
      }
      this.showMessage('-- REPLACE --');
      this.waitForReplaceChar();
      this.lastCommand = 'r';
    } else if (key === 'c') {
      e.preventDefault();
      if (!this.isModifiable) {
        this.showMessage("E21: Cannot make changes, 'modifiable' is off", true);
        return;
      }
      // Check for cw (change word)
      if (this.lastCommand === 'c') {
        this.changeWord();
        this.lastCommand = 'cw';
      } else {
        this.lastCommand = 'c';
        setTimeout(() => {
          if (this.lastCommand === 'c') this.lastCommand = '';
        }, 1000);
      }
    } else if (key === '/') {
      e.preventDefault();
      this.startSearch();
    } else if (key === 'n') {
      e.preventDefault();
      this.searchNext();
      this.lastCommand = 'n';
    } else if (key === 'n' && e.shiftKey) {
      e.preventDefault();
      this.searchPrev();
      this.lastCommand = 'N';
    } else if (key === '.') {
      e.preventDefault();
      this.repeatLastCommand();
    } else if (key === 'u') {
      e.preventDefault();
      if (!this.isModifiable) {
        this.showMessage("E21: Cannot make changes, 'modifiable' is off", true);
        return;
      }
      document.execCommand('undo');
      this.lastCommand = 'u';
    } else if (key === ':') {
      e.preventDefault();
      this.setMode('command');
    }
  }

  private handleInsertMode(): void {
    this.onInput();
  }

  private handleVisualMode(e: KeyboardEvent): void {
    const key = e.key.toLowerCase();

    if (key === 'h' || key === 'arrowleft') {
      e.preventDefault();
      if (this.mode === 'visual-line') {
        this.extendLineSelection('up');
      } else {
        this.extendSelection('left');
      }
    } else if (key === 'j' || key === 'arrowdown') {
      e.preventDefault();
      if (this.mode === 'visual-line') {
        this.extendLineSelection('down');
      } else {
        this.extendSelection('down');
      }
    } else if (key === 'k' || key === 'arrowup') {
      e.preventDefault();
      if (this.mode === 'visual-line') {
        this.extendLineSelection('up');
      } else {
        this.extendSelection('up');
      }
    } else if (key === 'l' || key === 'arrowright') {
      e.preventDefault();
      if (this.mode === 'visual-line') {
        this.extendLineSelection('down');
      } else {
        this.extendSelection('right');
      }
    } else if (key === 'd' || key === 'x') {
      e.preventDefault();
      if (!this.isModifiable) {
        this.showMessage("E21: Cannot make changes, 'modifiable' is off", true);
        this.setMode('normal');
        return;
      }
      this.deleteSelection();
      this.setMode('normal');
    } else if (key === 'y') {
      e.preventDefault();
      this.yankSelection();
      this.setMode('normal');
    } else if (key === 'v' && !e.shiftKey) {
      e.preventDefault();
      this.setMode('visual');
    } else if (key === 'v' && e.shiftKey) {
      e.preventDefault();
      this.setMode('visual-line');
    }
  }

  private handleCommandKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      const command = this.commandInput?.value || '';
      this.executeCommand(command);
      if (this.commandInput) this.commandInput.value = '';
      this.setMode('normal');
      this.textarea?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (this.commandInput) this.commandInput.value = '';
      this.setMode('normal');
      this.textarea?.focus();
    }
  }

  private async executeCommand(cmd: string): Promise<void> {
    cmd = cmd.trim();

    if (cmd === 'q' || cmd === 'quit') {
      this.close();
    } else if (cmd === 'qa' || cmd === 'qall') {
      this.close();
    } else if (cmd === 'q!' || cmd === 'quit!') {
      this.isModified = false;
      this.close();
    } else if (cmd === 'qa!' || cmd === 'qall!') {
      this.isModified = false;
      this.close();
    } else if (cmd === 'w' || cmd === 'write') {
      await this.save();
    } else if (cmd.startsWith('w ')) {
      const filename = cmd.substring(2).trim();
      if (!filename) {
        this.showMessage('E32: No file name', true);
        return;
      }
      await this.saveAs(filename);
    } else if (cmd === 'wq' || cmd === 'x' || cmd === 'exit') {
      await this.save();
      this.close();
    } else if (cmd === 'e' || cmd === 'edit') {
      this.showMessage('E32: No file name', true);
    } else if (cmd.startsWith('e ') || cmd.startsWith('edit ')) {
      const filename = cmd.substring(cmd.indexOf(' ') + 1).trim();
      if (!filename) {
        this.showMessage('E32: No file name', true);
        return;
      }
      if (filename === '.') {
        this.showExplorer('/home/victxrlarixs/Desktop/');
        return;
      }
      await this.openFile(filename);
    } else if (cmd === 'e!' || cmd === 'edit!') {
      if (!this.currentFilePath) {
        this.showMessage('E32: No file name', true);
        return;
      }
      const node = VFS.getNode(this.currentFilePath);
      if (node && node.type === 'file') {
        this.textarea!.value = node.content;
        this.isModified = false;
        this.updateFileInfo();
        this.showMessage('File reloaded');
      }
    } else if (cmd === 'E' || cmd === 'Explore' || cmd === 'e.') {
      this.showExplorer('/home/victxrlarixs/Desktop/');
    } else if (cmd.startsWith('E ') || cmd.startsWith('Explore ')) {
      const dir = cmd.substring(cmd.indexOf(' ') + 1).trim();
      this.showExplorer(dir.endsWith('/') ? dir : dir + '/');
    } else if (cmd === 'enew') {
      if (this.isModified) {
        this.showMessage('E37: No write since last change (add ! to override)', true);
        return;
      }
      await this.open('', '', '');
    } else if (cmd === 'enew!') {
      await this.open('', '', '');
    } else if (cmd === 'help' || cmd === 'h') {
      await this.showHelp();
    } else if (cmd.startsWith('help ') || cmd.startsWith('h ')) {
      await this.showHelp();
    } else if (cmd.startsWith('set ')) {
      const option = cmd.substring(4).trim();
      this.handleSetCommand(option);
    } else if (cmd === 'version' || cmd === 'ver') {
      this.showVersion();
    } else {
      this.showMessage(`Not an editor command: ${cmd}`, true);
    }
  }

  private async save(): Promise<void> {
    if (!this.currentFilePath) {
      this.showMessage('E32: No file name', true);
      return;
    }

    const { errorHandler } = await import('../core/error-handler');
    const result = await errorHandler.wrapAsync(
      async () => {
        const existing = VFS.getNode(this.currentFilePath);
        if (!existing) {
          const parts = this.currentFilePath.split('/');
          const filename = parts.pop()!;
          const parentDir = parts.join('/') + '/';
          await VFS.touch(parentDir, filename);
        }
        await VFS.writeFile(this.currentFilePath, this.textarea!.value);
        this.isModified = false;
        this.updateFileInfo();
        this.showMessage(`"${this.currentFilePath}" written`);
        if (window.AudioManager) window.AudioManager.success();
      },
      {
        module: 'Vim',
        action: 'save',
        severity: ErrorSeverity.HIGH,
        data: { path: this.currentFilePath },
      }
    );

    if (!result) {
      this.showMessage('Error writing file', true);
      if (window.AudioManager) window.AudioManager.error();
    }
  }

  private async saveAs(filename: string): Promise<void> {
    let fullPath: string;
    if (filename.startsWith('/')) {
      fullPath = filename;
    } else {
      fullPath = `/home/victxrlarixs/Desktop/${filename}`;
    }

    const parts = fullPath.split('/');
    const fname = parts.pop()!;
    const parentDir = parts.join('/') + '/';

    if (!VFS.getNode(parentDir)) {
      this.showMessage(`E212: Can't open file for writing`, true);
      if (window.AudioManager) window.AudioManager.error();
      return;
    }

    const { errorHandler } = await import('../core/error-handler');
    const result = await errorHandler.wrapAsync(
      async () => {
        const existing = VFS.getNode(fullPath);
        if (!existing) await VFS.touch(parentDir, fname);

        this.currentFilePath = fullPath;
        this.updateTitle(fname);
        await this.save();
      },
      {
        module: 'Vim',
        action: 'saveAs',
        severity: ErrorSeverity.HIGH,
        data: { path: fullPath },
      }
    );

    if (!result) {
      this.showMessage('Error writing file', true);
      if (window.AudioManager) window.AudioManager.error();
    }
  }

  private handleSetCommand(option: string): void {
    if (option === 'number' || option === 'nu') {
      this.showLineNumbers = true;
      this.showMessage('Line numbers enabled');
      this.updateDisplay();
    } else if (option === 'nonumber' || option === 'nonu') {
      this.showLineNumbers = false;
      this.showMessage('Line numbers disabled');
      this.updateDisplay();
    } else if (option.startsWith('mouse=')) {
      this.showMessage('Mouse support: always enabled');
    } else {
      this.showMessage(`Unknown option: ${option}`);
    }
  }

  private showVersion(): void {
    if (!this.textarea) return;

    const versionText = `VIM - Vi IMproved 5.3 (1998 Oct 31, compiled Dec 10 1998 12:00:00)
Included patches: 1-73
Compiled by team+vim@tracker.debian.org
Normal version without GUI.  Features included (+) or not (-):
+autocmd +digraphs +insert_expand +mouse +syntax +wildmenu
+browse +emacs_tags +jumplist +mouse_dec +tag_binary +writebackup
+builtin_terms +eval +langmap +mouse_xterm +tag_old_static +X11
-clientserver +ex_extra +linebreak +multi_byte +terminfo
+clipboard +extra_search +lispindent +perl +textobjects
+cmdline_compl +farsi +listcmds +postscript +title
+cmdline_hist +file_in_path +localmap +printer +user_commands
+cmdline_info +find_in_path +menu +python +vertsplit
+comments +folding +mksession +quickfix +viminfo
+cryptv +fork() +modify_fname +rightleft +visual
+cscope +gettext +mouse_gpm +scrollbind +visualextra
+dialog +hangul_input +mouseshape +signs +vreplace

   system vimrc file: "$VIM/vimrc"
     user vimrc file: "$HOME/.vimrc"
      user exrc file: "$HOME/.exrc"
  fall-back for $VIM: "/usr/share/vim"

Press ENTER or type command to continue`;

    this.textarea.value = versionText;
    this.isModifiable = false;
    this.currentFilePath = '';
    this.isModified = false;
    this.updateTitle('[Version Info]');
    this.updateFileInfo();
    this.setMode('normal');
  }

  private async openFile(filename: string): Promise<void> {
    let fullPath: string;
    if (filename.startsWith('/')) {
      fullPath = filename;
    } else {
      fullPath = `/home/victxrlarixs/Desktop/${filename}`;
    }

    const node = VFS.getNode(fullPath);
    if (!node) {
      await this.open(filename, '', fullPath);
      this.showMessage(`"${fullPath}" [New File]`);
      return;
    }

    if (node.type !== 'file') {
      this.showMessage(`E502: "${fullPath}" is a directory`, true);
      return;
    }

    const fname = fullPath.split('/').pop()!;
    await this.open(fname, node.content, fullPath);
  }

  private async showHelp(): Promise<void> {
    if (!this.textarea) return;

    const helpText = `*help.txt*      For Vim version 5.3.  Last change: 1998 Dec 21


                        VIM - main help file
                                                                      k
      Move around:  Use the cursor keys, or "h" to go left,       h   l
                    "j" to go down, "k" to go up, "l" to go right.   j
Close this window:  Use ":q<Enter>".
   Get out of Vim:  Use ":qa!<Enter>" (careful, all changes are lost!).

Jump to a subject:  Position the cursor on a tag (e.g. bars) and hit CTRL-].
   With the mouse:  ":set mouse=a" to enable the mouse (in xterm or GUI).
                    Double-click the left mouse button on a tag, e.g. bars.
        Jump back:  Type CTRL-O.  Repeat to go further back.

Get specific help:  It is possible to go directly to whatever you want help
                    on, by giving an argument to the :help command.
                    Prepend something to specify the context:  help-context

                          WHAT                  PREPEND    EXAMPLE
                          Normal mode command            :help x
                          Visual mode command      v_    :help v_u
                          Insert mode command      i_    :help i_<Esc>
                          Command-line command     :     :help :quit
                          Command-line editing     c_    :help c_<Del>
                          Vim command argument     -     :help -r
                          Option                   '     :help 'textwidth'

Search for help:  Type ":help word", then hit CTRL-D to see matching
                  help entries for "word".

VIM stands for Vi IMproved.  Most of VIM was made by Bram Moolenaar, but only
through the help of many others.  See :help credits.
------------------------------------------------------------------------------
                                                                vim-modes
Vim has six BASIC modes:

                        Normal mode             In Normal mode you can enter all the normal
                                                editor commands.  If you start the editor
                                                you are in this mode (unless you have set
                                                the 'insertmode' option, see below).
                                                This is also known as command mode.

                        Visual mode             This is like Normal mode, but the movement
                                                commands extend a highlighted area.  When
                                                a non-movement command is used, it is
                                                executed for the highlighted area.
                                                See Visual-mode.

                        Insert mode             In Insert mode the text you type is inserted
                                                into the buffer.  See Insert-mode.

                        Command-line mode       In Command-line mode (also called Cmdline
                                                mode) you can enter one line of text at the
                                                bottom of the window.  This is for the Ex
                                                commands, ":", the pattern search commands,
                                                "?" and "/", and the filter command, "!".
                                                Cmdline-mode

Press :q<Enter> to close this help.
~
~
~
~`;

    this.textarea.value = helpText;
    this.isModifiable = false;
    this.currentFilePath = '';
    this.isModified = false;
    this.updateTitle('help.txt [Help] [RO]');
    this.updateFileInfo();
    this.setMode('normal');
  }

  private showExplorer(dirPath: string): void {
    if (!this.textarea) return;

    const node = VFS.getNode(dirPath);
    if (!node || node.type !== 'folder') {
      this.showMessage(`E344: Can't find directory "${dirPath}" in cdpath`, true);
      return;
    }

    let listing = `" ============================================================================\n`;
    listing += `" Netrw Directory Listing                                        (netrw v53)\n`;
    listing += `"   ${dirPath}\n`;
    listing += `"   Sorted by      name\n`;
    listing += `"   Sort sequence: [/]$,*,\\.bak$,\\.o$,\\.h$,\\.info$,\\.swp$,\\.obj$\n`;
    listing += `"   Quick Help: <F1>:help  -:go up dir  D:delete  R:rename  s:sort-by  x:exec\n`;
    listing += `" ============================================================================\n`;
    listing += `../\n`;

    // List directories first
    const dirs: string[] = [];
    const files: string[] = [];

    if (node.type === 'folder' && node.children) {
      Object.keys(node.children).forEach(name => {
        const child = node.children![name];
        if (child.type === 'folder') {
          dirs.push(name + '/');
        } else {
          files.push(name);
        }
      });
    }

    dirs.sort().forEach(dir => listing += dir + '\n');
    files.sort().forEach(file => listing += file + '\n');

    this.textarea.value = listing;
    this.isModifiable = false;
    this.currentFilePath = '';
    this.isModified = false;
    this.updateTitle(`${dirPath} [Directory]`);
    this.updateFileInfo();
    this.setMode('normal');
  }

  private moveCursor(dir: 'left' | 'right' | 'up' | 'down' | 'home' | 'end' | 'fileStart' | 'fileEnd' | 'nextWord' | 'prevWord' | 'endWord'): void {
    if (!this.textarea) return;

    const ta = this.textarea;
    let pos = ta.selectionStart;
    const text = ta.value;

    switch (dir) {
      case 'left':
        pos = Math.max(0, pos - 1);
        break;
      case 'right':
        pos = Math.min(text.length, pos + 1);
        break;
      case 'up':
      case 'down': {
        const lines = text.split('\n');
        const textBefore = text.substring(0, pos);
        const linesBefore = textBefore.split('\n');
        const currentLine = linesBefore.length - 1;
        const currentCol = linesBefore[linesBefore.length - 1].length;

        if (dir === 'up' && currentLine > 0) {
          const prevLineLength = lines[currentLine - 1].length;
          const targetCol = Math.min(currentCol, prevLineLength);
          let newPos = 0;
          for (let i = 0; i < currentLine - 1; i++) {
            newPos += lines[i].length + 1;
          }
          newPos += targetCol;
          pos = newPos;
        } else if (dir === 'down' && currentLine < lines.length - 1) {
          const nextLineLength = lines[currentLine + 1].length;
          const targetCol = Math.min(currentCol, nextLineLength);
          let newPos = 0;
          for (let i = 0; i <= currentLine; i++) {
            newPos += lines[i].length + 1;
          }
          newPos += targetCol;
          pos = newPos;
        }
        break;
      }
      case 'home': {
        const lineStart = text.lastIndexOf('\n', pos - 1) + 1;
        pos = lineStart;
        break;
      }
      case 'end': {
        const nextNL = text.indexOf('\n', pos);
        pos = nextNL === -1 ? text.length : nextNL;
        break;
      }
      case 'fileStart':
        pos = 0;
        break;
      case 'fileEnd':
        pos = text.length;
        break;
      case 'nextWord': {
        const wordRegex = /\w+/g;
        wordRegex.lastIndex = pos;
        const match = wordRegex.exec(text);
        if (match) {
          pos = match.index;
        } else {
          pos = text.length;
        }
        break;
      }
      case 'prevWord': {
        const textBefore = text.substring(0, pos);
        const words = [...textBefore.matchAll(/\w+/g)];
        if (words.length > 0) {
          const lastWord = words[words.length - 1];
          if (lastWord.index !== undefined && lastWord.index < pos - 1) {
            pos = lastWord.index;
          } else if (words.length > 1) {
            const prevWord = words[words.length - 2];
            pos = prevWord.index || 0;
          } else {
            pos = 0;
          }
        } else {
          pos = 0;
        }
        break;
      }
      case 'endWord': {
        const wordRegex = /\w+/g;
        wordRegex.lastIndex = pos;
        const match = wordRegex.exec(text);
        if (match) {
          pos = match.index + match[0].length - 1;
        } else {
          pos = text.length;
        }
        break;
      }
    }

    ta.setSelectionRange(pos, pos);
  }

  private extendSelection(dir: 'left' | 'right' | 'up' | 'down'): void {
    if (!this.textarea) return;

    const ta = this.textarea;
    const start = Math.min(this.visualStartPos, ta.selectionEnd);
    let end = ta.selectionEnd;

    switch (dir) {
      case 'left':
        end = Math.max(start, end - 1);
        break;
      case 'right':
        end = Math.min(ta.value.length, end + 1);
        break;
      case 'up':
      case 'down': {
        const lineLength = 80;
        end = dir === 'up' ? Math.max(start, end - lineLength) : Math.min(ta.value.length, end + lineLength);
        break;
      }
    }

    ta.setSelectionRange(start, end);
  }

  private deleteChar(): void {
    if (!this.textarea) return;
    const ta = this.textarea;
    const pos = ta.selectionStart;
    if (pos < ta.value.length) {
      ta.value = ta.value.substring(0, pos) + ta.value.substring(pos + 1);
      ta.setSelectionRange(pos, pos);
      this.onInput();
    }
  }

  private deleteLine(): void {
    if (!this.textarea) return;
    const ta = this.textarea;
    const pos = ta.selectionStart;
    const text = ta.value;
    const lineStart = text.lastIndexOf('\n', pos - 1) + 1;
    const lineEnd = text.indexOf('\n', pos);
    const end = lineEnd === -1 ? text.length : lineEnd + 1;

    ta.value = text.substring(0, lineStart) + text.substring(end);
    ta.setSelectionRange(lineStart, lineStart);
    this.onInput();
  }

  private deleteSelection(): void {
    if (!this.textarea) return;
    const ta = this.textarea;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    ta.value = ta.value.substring(0, start) + ta.value.substring(end);
    ta.setSelectionRange(start, start);
    this.onInput();
  }

  private yankSelection(): void {
    if (!this.textarea) return;
    const selected = this.textarea.value.substring(
      this.textarea.selectionStart,
      this.textarea.selectionEnd
    );
    this.clipboard = selected;
    navigator.clipboard.writeText(selected).catch(() => {
      // Fallback if clipboard API fails
    });
    this.showMessage(`${selected.length} characters yanked`);
  }

  private insertNewLine(where: 'above' | 'below'): void {
    if (!this.textarea) return;
    const ta = this.textarea;
    const pos = ta.selectionStart;
    const text = ta.value;

    if (where === 'below') {
      const lineEnd = text.indexOf('\n', pos);
      const insertPos = lineEnd === -1 ? text.length : lineEnd;
      ta.value = text.substring(0, insertPos) + '\n' + text.substring(insertPos);
      ta.setSelectionRange(insertPos + 1, insertPos + 1);
    } else {
      const lineStart = text.lastIndexOf('\n', pos - 1) + 1;
      ta.value = text.substring(0, lineStart) + '\n' + text.substring(lineStart);
      ta.setSelectionRange(lineStart, lineStart);
    }
  }

  private updateTitle(filename: string): void {
    const titleEl = document.getElementById('vim-title');
    if (titleEl) titleEl.textContent = `Vi IMproved - ${filename}`;
  }

  private updatePosition(): void {
    if (!this.textarea || !this.positionDisplay) return;

    const text = this.textarea.value;
    const pos = this.textarea.selectionStart;
    const textBefore = text.substring(0, pos);
    const lines = textBefore.split('\n');
    const lineNum = lines.length;
    const colNum = lines[lines.length - 1].length + 1;

    this.positionDisplay.textContent = `${lineNum},${colNum}`;
  }

  private updateFileInfo(): void {
    if (!this.fileInfoDisplay) return;

    const modified = this.isModified ? '[+]' : '';
    const filename = this.currentFilePath ? this.currentFilePath.split('/').pop() : '[No Name]';
    const lines = this.textarea?.value.split('\n').length || 0;
    
    this.fileInfoDisplay.textContent = `${filename} ${modified}`.trim();
  }

  private onInput(): void {
    if (!this.isModified) {
      this.isModified = true;
      this.updateFileInfo();
    }
  }

  private selectCurrentLine(): void {
    if (!this.textarea) return;
    const ta = this.textarea;
    const pos = ta.selectionStart;
    const text = ta.value;
    const lineStart = text.lastIndexOf('\n', pos - 1) + 1;
    const lineEnd = text.indexOf('\n', pos);
    const end = lineEnd === -1 ? text.length : lineEnd + 1;
    
    this.visualStartPos = lineStart;
    ta.setSelectionRange(lineStart, end);
  }

  private extendLineSelection(dir: 'up' | 'down'): void {
    if (!this.textarea) return;
    const ta = this.textarea;
    const text = ta.value;
    let start = this.visualStartPos;
    let end = ta.selectionEnd;

    if (dir === 'up') {
      const lineStart = text.lastIndexOf('\n', start - 2);
      start = lineStart === -1 ? 0 : lineStart + 1;
    } else {
      const lineEnd = text.indexOf('\n', end);
      end = lineEnd === -1 ? text.length : lineEnd + 1;
    }

    ta.setSelectionRange(start, end);
  }

  private yankLine(): void {
    if (!this.textarea) return;
    const ta = this.textarea;
    const pos = ta.selectionStart;
    const text = ta.value;
    const lineStart = text.lastIndexOf('\n', pos - 1) + 1;
    const lineEnd = text.indexOf('\n', pos);
    const end = lineEnd === -1 ? text.length : lineEnd + 1;
    
    const line = text.substring(lineStart, end);
    this.clipboard = line;
    navigator.clipboard.writeText(line).catch(() => {});
    this.showMessage('1 line yanked');
  }

  private paste(): void {
    if (!this.textarea) return;
    const ta = this.textarea;
    const pos = ta.selectionStart;
    
    if (this.clipboard.includes('\n')) {
      // Line paste - insert after current line
      const text = ta.value;
      const lineEnd = text.indexOf('\n', pos);
      const insertPos = lineEnd === -1 ? text.length : lineEnd;
      ta.value = text.substring(0, insertPos) + '\n' + this.clipboard.trimEnd() + text.substring(insertPos);
      ta.setSelectionRange(insertPos + 1, insertPos + 1);
    } else {
      // Character paste - insert at cursor
      ta.value = ta.value.substring(0, pos) + this.clipboard + ta.value.substring(pos);
      ta.setSelectionRange(pos + this.clipboard.length, pos + this.clipboard.length);
    }
    this.onInput();
  }

  private pasteBefore(): void {
    if (!this.textarea) return;
    const ta = this.textarea;
    const pos = ta.selectionStart;
    
    if (this.clipboard.includes('\n')) {
      // Line paste - insert before current line
      const text = ta.value;
      const lineStart = text.lastIndexOf('\n', pos - 1) + 1;
      ta.value = text.substring(0, lineStart) + this.clipboard.trimEnd() + '\n' + text.substring(lineStart);
      ta.setSelectionRange(lineStart, lineStart);
    } else {
      // Character paste - insert at cursor
      ta.value = ta.value.substring(0, pos) + this.clipboard + ta.value.substring(pos);
      ta.setSelectionRange(pos, pos);
    }
    this.onInput();
  }

  private waitForReplaceChar(): void {
    if (!this.textarea) return;
    
    const handleReplace = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key.length === 1) {
        const ta = this.textarea!;
        const pos = ta.selectionStart;
        if (pos < ta.value.length) {
          ta.value = ta.value.substring(0, pos) + e.key + ta.value.substring(pos + 1);
          ta.setSelectionRange(pos, pos);
          this.onInput();
        }
      }
      this.textarea!.removeEventListener('keydown', handleReplace);
      this.showMessage('');
    };
    
    this.textarea.addEventListener('keydown', handleReplace);
  }

  private changeWord(): void {
    if (!this.textarea) return;
    const ta = this.textarea;
    const pos = ta.selectionStart;
    const text = ta.value;
    
    // Find word boundaries
    const wordRegex = /\w+/g;
    let match;
    while ((match = wordRegex.exec(text)) !== null) {
      if (match.index <= pos && pos <= match.index + match[0].length) {
        // Delete the word and enter insert mode
        ta.value = text.substring(0, match.index) + text.substring(match.index + match[0].length);
        ta.setSelectionRange(match.index, match.index);
        this.setMode('insert');
        this.onInput();
        return;
      }
    }
  }

  private startSearch(): void {
    if (!this.commandLine || !this.commandInput) return;
    
    this.commandLine.style.display = 'flex';
    this.commandInput.value = '';
    this.commandInput.placeholder = 'Search: ';
    
    const handleSearch = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.searchTerm = this.commandInput!.value;
        this.searchDirection = 'forward';
        this.performSearch();
        this.commandInput!.removeEventListener('keydown', handleSearch);
        this.commandLine!.style.display = 'none';
        this.setMode('normal');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.commandInput!.removeEventListener('keydown', handleSearch);
        this.commandLine!.style.display = 'none';
        this.setMode('normal');
      }
    };
    
    this.commandInput.addEventListener('keydown', handleSearch);
    this.commandInput.focus();
  }

  private performSearch(): void {
    if (!this.textarea || !this.searchTerm) return;
    
    const text = this.textarea.value;
    const currentPos = this.textarea.selectionStart;
    let searchPos = this.searchDirection === 'forward' ? currentPos + 1 : currentPos - 1;
    
    const index = this.searchDirection === 'forward' 
      ? text.indexOf(this.searchTerm, searchPos)
      : text.lastIndexOf(this.searchTerm, searchPos);
    
    if (index !== -1) {
      this.textarea.setSelectionRange(index, index + this.searchTerm.length);
      this.showMessage(`/${this.searchTerm}`);
    } else {
      this.showMessage(`Pattern not found: ${this.searchTerm}`, true);
    }
  }

  private searchNext(): void {
    if (!this.searchTerm) {
      this.showMessage('No previous search pattern', true);
      return;
    }
    this.searchDirection = 'forward';
    this.performSearch();
  }

  private searchPrev(): void {
    if (!this.searchTerm) {
      this.showMessage('No previous search pattern', true);
      return;
    }
    this.searchDirection = 'backward';
    this.performSearch();
  }

  private repeatLastCommand(): void {
    if (!this.lastCommand) {
      this.showMessage('No previous command', true);
      return;
    }
    
    // Simulate the last command
    const event = new KeyboardEvent('keydown', { 
      key: this.lastCommand.slice(-1),
      shiftKey: this.lastCommand.includes('O') || this.lastCommand.includes('P') || this.lastCommand.includes('V')
    });
    
    if (this.lastCommand === 'dd') {
      this.deleteLine();
    } else if (this.lastCommand === 'yy') {
      this.yankLine();
    } else if (this.lastCommand === 'cw') {
      this.changeWord();
    } else {
      this.handleNormalMode(event);
    }
  }

  private updateDisplay(): void {
    if (!this.textarea) return;
    
    if (this.showLineNumbers) {
      const lines = this.textarea.value.split('\n');
      const numberedLines = lines.map((line, index) => {
        const lineNum = (index + 1).toString().padStart(3, ' ');
        return `${lineNum} ${line}`;
      });
      
      // Store original content and cursor position
      const originalContent = this.textarea.value;
      const originalPos = this.textarea.selectionStart;
      
      // Update display with line numbers
      this.textarea.value = numberedLines.join('\n');
      this.textarea.readOnly = true;
      
      // Restore functionality when line numbers are disabled
      this.textarea.dataset.originalContent = originalContent;
      this.textarea.dataset.originalPos = originalPos.toString();
    } else {
      // Restore original content
      if (this.textarea.dataset.originalContent) {
        this.textarea.value = this.textarea.dataset.originalContent;
        const pos = parseInt(this.textarea.dataset.originalPos || '0');
        this.textarea.setSelectionRange(pos, pos);
        delete this.textarea.dataset.originalContent;
        delete this.textarea.dataset.originalPos;
      }
      this.textarea.readOnly = false;
    }
  }

  private showMessage(msg: string, isError: boolean = false): void {
    if (this.modeDisplay) {
      const originalText = this.modeDisplay.textContent;
      const originalColor = this.modeDisplay.style.color;
      
      this.modeDisplay.textContent = msg;
      if (isError) {
        this.modeDisplay.style.color = '#ff0000';
      }
      
      setTimeout(() => {
        if (this.modeDisplay) {
          this.modeDisplay.textContent = originalText;
          this.modeDisplay.style.color = originalColor;
        }
      }, 3000);
    }
  }
}

// ── Singleton & Global Exposure ───────────────────────────────────────────────

let vimInstance: VimManager | null = null;
function getInstance(): VimManager {
  if (!vimInstance) vimInstance = new VimManager();
  return vimInstance;
}

if (typeof window !== 'undefined') {
  (window as any).Vim = {
    open: (filename?: string, content?: string, path?: string) => getInstance().open(filename, content, path),
    close: () => getInstance().close(),
  };
  
  logger.log('[Vim] Exposed globally');
}
