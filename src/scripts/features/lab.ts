import tutorialData from '../../data/tutorial.json';
import { VFS, type VFSNode, type VFSFile, type VFSFolder } from '../core/vfs';
import { WindowManager } from '../core/windowmanager';

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = { user: string; command: string; output: string };
type Lesson = { title: string; steps: Step[] };
type TutorialData = { lessons: Lesson[] };

// ─── CLASS ───────────────────────────────────────────────────────────────────
class TerminalLabManager {
  private body!: HTMLElement;
  private input!: HTMLInputElement;
  private prompt!: HTMLElement;
  private hintText!: HTMLElement;
  private lessonLabel!: HTMLElement;
  private progressFill!: HTMLElement;

  private lessons: Lesson[] = (tutorialData as TutorialData).lessons;
  private lessonIndex = 0;
  private stepIndex = 0;
  private freeMode = false;
  private history: string[] = [];
  private historyPos = -1;

  private cwd: string;
  private user = 'victxrlarixs';

  private aliases: Record<string, string> = {};
  private variables: Record<string, string> = {
    HOME: '/home/victxrlarixs',
    USER: 'victxrlarixs',
    PATH: '/usr/local/bin:/usr/bin:/bin',
    SHELL: '/bin/bash',
  };

  private commandMap: Record<string, (args: string[]) => string | Promise<string>>;

  constructor() {
    this.cwd = '/home/victxrlarixs/';
    this.commandMap = this.buildCommandMap();
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  public open(): void {
    const win = document.getElementById('terminal-lab');
    if (!win) return;
    win.style.display = 'flex';
    win.style.flexDirection = 'column';

    WindowManager.centerWindow(win);

    this.init();
    if (window.AudioManager) window.AudioManager.windowOpen();
    this.focus();
    if (window.focusWindow) window.focusWindow('terminal-lab');
  }

  public close(): void {
    const win = document.getElementById('terminal-lab');
    if (win) {
      win.style.display = 'none';
      if (window.AudioManager) window.AudioManager.windowClose();
    }
  }

  public showHint(): void {
    if (this.freeMode) return;
    const step = this.currentStep();
    if (!step) return;
    this.print(`<span class="lab-hint">HINT: type --&gt; ${this.escHtml(step.command)}</span>`);
    this.scrollBottom();
  }

  public skip(): void {
    if (this.freeMode) return;
    const step = this.currentStep();
    if (step) this.executeStep(step, true);
  }

  public toggleFreeMode(): void {
    this.freeMode = !this.freeMode;
    const btn = document.getElementById('lab-btn-free');
    if (btn) {
      btn.classList.toggle('lab-btn-active', this.freeMode);
    }
    const banner = document.getElementById('lab-hint-banner');
    if (banner) {
      if (this.freeMode) {
        this.setHint(
          '[FREE MODE] Type any command. Type "tutorial" to return to guided mode or "help".'
        );
      } else {
        this.setHint('Type the command shown below to proceed. Type "hint" or "skip" for help.');
        this.showCurrentPrompt();
      }
    }
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  private init(): void {
    this.body = document.getElementById('lab-terminal-body')!;
    this.input = document.getElementById('lab-input') as HTMLInputElement;
    this.prompt = document.getElementById('lab-prompt')!;
    this.hintText = document.getElementById('lab-hint-text')!;
    this.lessonLabel = document.getElementById('lab-lesson-label')!;
    this.progressFill = document.getElementById('lab-progress-fill')!;

    if (!this.body) return;

    if (this.input.dataset.initialized) return;
    this.input.dataset.initialized = '1';

    this.body.innerHTML = '';
    this.input.value = '';

    this.input.addEventListener('keydown', (e) => this.onKeyDown(e));
    // pointerdown is more responsive on mobile for focusing
    this.body.addEventListener('pointerdown', () => this.focus());

    this.printWelcome();
    this.updateUI();
    this.showCurrentPrompt();
  }

  private printWelcome(): void {
    this.print(`<span class="lab-header">+--------------------------------------------+</span>`);
    this.print(`<span class="lab-header">|  DEBIAN CDE -- TERMINAL LABORATORY         |</span>`);
    this.print(`<span class="lab-header">+--------------------------------------------+</span>`);
    this.print(`<span class="lab-dim">Guided lessons: type each command to advance.</span>`);
    this.print(`<span class="lab-dim">Meta-commands: hint  skip  free  tutorial  clear</span>`);
    this.print(``);
  }

  // ── Tutorial flow ──────────────────────────────────────────────────────────

  private currentLesson(): Lesson | undefined {
    return this.lessons[this.lessonIndex];
  }

  private currentStep() {
    return this.currentLesson()?.steps[this.stepIndex];
  }

  private showCurrentPrompt(): void {
    if (this.freeMode) return;
    const step = this.currentStep();
    if (!step) return;
    this.print(
      `<span class="lab-dim">next --&gt;</span> <span class="lab-cmd">${this.escHtml(step.command)}</span>`
    );
    this.updatePromptDisplay();
  }

  private executeStep(
    step: NonNullable<ReturnType<typeof this.currentStep>>,
    skipped = false
  ): void {
    const promptStr = step.user === 'root' ? 'root@debian:~#' : `${step.user}@debian:~$`;
    const prefix = skipped ? '<span class="lab-dim">[skipped]</span> ' : '';
    this.print(
      `<span class="lab-prompt-str">${promptStr}</span> ${prefix}${this.escHtml(step.command)}`
    );
    if (step.output) {
      step.output
        .split('\\n')
        .forEach((line) => this.print(`<span class="lab-output">${this.escHtml(line)}</span>`));
    }
    this.print(``);
    this.advance();
  }

  private advance(): void {
    const lesson = this.currentLesson();
    if (!lesson) return;

    this.stepIndex++;

    if (this.stepIndex >= lesson.steps.length) {
      this.lessonIndex++;
      this.stepIndex = 0;
      this.updateUI();

      if (this.lessonIndex >= this.lessons.length) {
        this.printCongratulations();
        return;
      }
      this.printLessonIntro();
    } else {
      this.updateUI();
    }

    this.showCurrentPrompt();
    this.scrollBottom();
  }

  private printLessonIntro(): void {
    const lesson = this.currentLesson();
    const title = lesson?.title ?? `Lesson ${this.lessonIndex + 1}`;
    this.print(``);
    this.print(`<span class="lab-header">-------------------------------------------</span>`);
    this.print(
      `<span class="lab-header">LESSON ${this.lessonIndex + 1}: ${title.toUpperCase()}</span>`
    );
    this.print(`<span class="lab-header">-------------------------------------------</span>`);
    this.print(``);
  }

  private printCongratulations(): void {
    this.print(``);
    this.print(`<span class="lab-header">+-------------------------------------------+</span>`);
    this.print(`<span class="lab-header">|  ALL LESSONS COMPLETE                     |</span>`);
    this.print(`<span class="lab-header">+-------------------------------------------+</span>`);
    this.print(
      `<span class="lab-dim">You have completed the Debian CDE Terminal Laboratory.</span>`
    );
    this.print(`<span class="lab-dim">Type "free" to switch to free exploration mode.</span>`);
  }

  private updateUI(): void {
    const total = this.lessons.length;
    const current = Math.min(this.lessonIndex + 1, total);
    const pct = Math.round((this.lessonIndex / total) * 100);
    const lesson = this.currentLesson();
    const title = lesson?.title ?? `Lesson ${current}`;

    if (this.lessonLabel) this.lessonLabel.textContent = `LESSON ${current} / ${total} — ${title}`;
    if (this.progressFill) this.progressFill.style.width = `${pct}%`;
  }

  private updatePromptDisplay(): void {
    const step = this.currentStep();
    const user = step?.user === 'root' ? 'root@debian:~#' : `${this.user}@debian:~$`;
    if (this.prompt) this.prompt.textContent = user;
  }

  // ── Input handling ─────────────────────────────────────────────────────────

  private onKeyDown(e: KeyboardEvent): void {
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      this.input.value = '';
      this
        .print(`<span class="lab-prompt-str">${this.user}@debian:~<file name="src/scripts/features/lab.ts" language="typescript" >
<content>
</span> ${this.escHtml(this.input.value)}^C`);
      this.print(``);
      return;
    }
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      this.body.innerHTML = '';
      return;
    }
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      this.input.value = '';
      return;
    }
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      this.input.selectionStart = 0;
      this.input.selectionEnd = 0;
      return;
    }
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      this.input.selectionStart = this.input.value.length;
      this.input.selectionEnd = this.input.value.length;
      return;
    }
    if (e.key === 'Enter') {
      const raw = this.input.value.trim();
      this.input.value = '';
      this.history.unshift(raw);
      this.historyPos = -1;
      this.handleInput(raw);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.historyPos = Math.min(this.historyPos + 1, this.history.length - 1);
      this.input.value = this.history[this.historyPos] ?? '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.historyPos = Math.max(this.historyPos - 1, -1);
      this.input.value = this.historyPos >= 0 ? (this.history[this.historyPos] ?? '') : '';
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.handleTabCompletion();
    }
  }

  private handleTabCompletion(): void {
    const input = this.input.value;
    const cursorPos = this.input.selectionStart ?? input.length;
    const beforeCursor = input.substring(0, cursorPos);
    const parts = beforeCursor.split(' ');
    const lastPart = parts[parts.length - 1];

    if (parts.length === 1) {
      if (this.freeMode) {
        const commands = Object.keys(this.commandMap);
        const matches = commands.filter((cmd) => cmd.startsWith(lastPart));

        if (matches.length === 1) {
          this.input.value = matches[0] + ' ';
          this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
          requestAnimationFrame(() => this.focus());
        } else if (matches.length > 1) {
          this.print(`<span class="lab-dim">${matches.join('  ')}</span>`);
          this.scrollBottom();
          requestAnimationFrame(() => this.focus());
        }
      } else {
        const step = this.currentStep();
        if (step && step.command.startsWith(lastPart)) {
          this.input.value = step.command;
          this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
          requestAnimationFrame(() => this.focus());
        }
      }
    } else {
      this.completeFilePath(lastPart, parts);
    }
  }

  private completeFilePath(partial: string, parts: string[]): void {
    const node = VFS.getNode(this.cwd);
    if (!node || node.type !== 'folder') return;

    const children = Object.keys(node.children);
    const matches = children.filter((name) => name.startsWith(partial));

    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      const childNode = node.children[matches[0]];
      if (childNode && childNode.type === 'folder') {
        parts[parts.length - 1] += '/';
      } else {
        parts[parts.length - 1] += ' ';
      }
      this.input.value = parts.join(' ');
      this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
      requestAnimationFrame(() => this.focus());
    } else if (matches.length > 1) {
      this.print(`<span class="lab-dim">${matches.join('  ')}</span>`);
      this.scrollBottom();
      requestAnimationFrame(() => this.focus());
    }
  }

  private async handleInput(raw: string): Promise<void> {
    if (!raw) return;

    const promptStr = this.freeMode
      ? `${this.user}@debian:~$`
      : this.currentStep()?.user === 'root'
        ? 'root@debian:~#'
        : `${this.user}@debian:~$`;
    this.print(`<span class="lab-prompt-str">${promptStr}</span> ${this.escHtml(raw)}`);

    if (raw === 'hint') {
      this.showHint();
      return;
    }
    if (raw === 'skip') {
      this.skip();
      return;
    }
    if (raw === 'free') {
      this.toggleFreeMode();
      return;
    }
    if (raw === 'tutorial') {
      if (this.freeMode) this.toggleFreeMode();
      this.showCurrentPrompt();
      return;
    }

    if (this.freeMode) {
      if (raw === 'clear') {
        this.body.innerHTML = '';
        return;
      }
      await this.runFreeModeCommand(raw);
    } else {
      this.runTutorialCommand(raw);
    }

    this.scrollBottom();
  }

  private runTutorialCommand(raw: string): void {
    const step = this.currentStep();
    if (!step) return;

    const normalize = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

    if (normalize(raw) === normalize(step.command)) {
      if (step.output) {
        step.output
          .split('\\n')
          .forEach((line) => this.print(`<span class="lab-output">${this.escHtml(line)}</span>`));
      }
      if (window.AudioManager) window.AudioManager.success();
      this.print(``);
      this.advance();
    } else {
      this.print(`<span class="lab-error">error: expected -- ${this.escHtml(step.command)}</span>`);
      this.print(`<span class="lab-dim">       type "hint" or "skip" to continue.</span>`);
      if (window.AudioManager) window.AudioManager.error();
      this.print(``);
      this.showCurrentPrompt();
    }
  }

  private async runFreeModeCommand(raw: string): Promise<void> {
    let processed = this.expandVariables(raw);
    processed = this.expandAliases(processed);

    if (processed.includes('|')) {
      await this.executePipeline(processed);
      return;
    }

    const [cmd, ...argParts] = processed.split(' ');
    let args = argParts.filter(Boolean);

    args = this.expandWildcards(args);

    const handler = this.commandMap[cmd ?? ''];
    if (handler) {
      const out = await handler(args);
      if (out)
        out
          .split('\n')
          .forEach((l) => this.print(`<span class="lab-output">${this.escHtml(l)}</span>`));
    } else {
      this.print(
        `<span class="lab-error">bash: ${this.escHtml(cmd ?? '')}: command not found</span>`
      );
      if (window.AudioManager) window.AudioManager.error();
    }
    this.print(``);
  }

  private expandVariables(cmd: string): string {
    return cmd.replace(/\$(\w+)/g, (match, varName) => {
      return this.variables[varName] ?? match;
    });
  }

  private expandAliases(cmd: string): string {
    const parts = cmd.split(' ');
    const firstCmd = parts[0];
    if (firstCmd && this.aliases[firstCmd]) {
      parts[0] = this.aliases[firstCmd];
      return parts.join(' ');
    }
    return cmd;
  }

  private expandWildcards(args: string[]): string[] {
    const expanded: string[] = [];
    for (const arg of args) {
      if (arg.includes('*')) {
        const matches = this.matchWildcard(arg);
        if (matches.length > 0) {
          expanded.push(...matches);
        } else {
          expanded.push(arg);
        }
      } else {
        expanded.push(arg);
      }
    }
    return expanded;
  }

  private matchWildcard(pattern: string): string[] {
    const node = VFS.getNode(this.cwd);
    if (!node || node.type !== 'folder') return [];

    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    return Object.keys(node.children).filter((name) => regex.test(name));
  }

  private async executePipeline(cmd: string): Promise<void> {
    const commands = cmd.split('|').map((c) => c.trim());
    let output = '';

    for (let i = 0; i < commands.length; i++) {
      const [cmdName, ...argParts] = commands[i].split(' ');
      const args = argParts.filter(Boolean);

      if (i > 0) {
        args.unshift(output);
      }

      const handler = this.commandMap[cmdName ?? ''];
      if (handler) {
        output = await handler(args);
      } else {
        this.print(
          `<span class="lab-error">bash: ${this.escHtml(cmdName ?? '')}: command not found</span>`
        );
        if (window.AudioManager) window.AudioManager.error();
        this.print(``);
        return;
      }
    }

    if (output) {
      output
        .split('\n')
        .forEach((l) => this.print(`<span class="lab-output">${this.escHtml(l)}</span>`));
    }
    this.print(``);
  }

  // ── Free-mode command map ──────────────────────────────────────────────────

  private buildCommandMap(): Record<string, (args: string[]) => string | Promise<string>> {
    return {
      pwd: () => this.cwd,
      whoami: () => this.user,
      hostname: () => 'debian',
      uname: (a) =>
        a.includes('-a') ? 'Linux debian 5.10.0-20-amd64 #1 SMP Debian x86_64 GNU/Linux' : 'Linux',
      date: () => new Date().toString(),
      echo: (a) => a.join(' '),
      clear: () => {
        this.body.innerHTML = '';
        return '';
      },

      alias: (args) => {
        if (args.length === 0) {
          return Object.entries(this.aliases)
            .map(([k, v]) => `alias ${k}='${v}'`)
            .join('\n');
        }
        const match = args.join(' ').match(/^(\w+)=['"]?(.+?)['"]?$/);
        if (match) {
          this.aliases[match[1]] = match[2];
          return '';
        }
        return 'alias: invalid format. Use: alias name=command';
      },

      unalias: (args) => {
        if (!args[0]) return 'unalias: missing operand';
        delete this.aliases[args[0]];
        return '';
      },

      export: (args) => {
        if (args.length === 0) {
          return Object.entries(this.variables)
            .map(([k, v]) => `export ${k}="${v}"`)
            .join('\n');
        }
        const match = args.join(' ').match(/^(\w+)=['"]?(.+?)['"]?$/);
        if (match) {
          this.variables[match[1]] = match[2];
          return '';
        }
        return 'export: invalid format. Use: export VAR=value';
      },

      env: () => {
        return Object.entries(this.variables)
          .map(([k, v]) => `${k}=${v}`)
          .join('\n');
      },

      grep: (args) => {
        if (args.length < 2) return 'grep: missing operand';
        const pattern = args[0];
        const input = args.slice(1).join(' ');
        const lines = input.split('\n');
        const regex = new RegExp(pattern, 'i');
        return lines.filter((line) => regex.test(line)).join('\n');
      },

      head: (args) => {
        const n = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1] || '10') : 10;
        const input = args.filter((a) => a !== '-n' && !a.match(/^\d+$/)).join(' ');
        return input.split('\n').slice(0, n).join('\n');
      },

      tail: (args) => {
        const n = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1] || '10') : 10;
        const input = args.filter((a) => a !== '-n' && !a.match(/^\d+$/)).join(' ');
        const lines = input.split('\n');
        return lines.slice(-n).join('\n');
      },

      wc: (args) => {
        const input = args.join(' ');
        const lines = input.split('\n').length;
        const words = input.split(/\s+/).filter(Boolean).length;
        const chars = input.length;
        return `${lines} ${words} ${chars}`;
      },

      ls: (args) => {
        const showHidden = args.includes('-la') || args.includes('-a');
        const node = VFS.getNode(this.cwd);
        if (!node || node.type !== 'folder') return 'ls: cannot access directory';

        const children = Object.keys(node.children);
        const base = showHidden ? ['.', '..', ...children] : children;
        return base.join('  ');
      },

      cd: (args) => {
        const target = args[0] ?? '~';
        const resolved = VFS.resolvePath(this.cwd, target);
        const node = VFS.getNode(resolved);
        if (!node) return `bash: cd: ${target}: No such file or directory`;
        if (node.type !== 'folder') return `bash: cd: ${target}: Not a directory`;

        this.cwd = resolved;
        if (this.prompt) this.prompt.textContent = `${this.user}@debian:${this.cwdShort()}$`;
        return '';
      },

      cat: (args) => {
        if (!args[0]) return 'cat: missing operand';
        const resolved = VFS.resolvePath(this.cwd, args[0]);
        const node = VFS.getNode(resolved);
        if (!node) return `cat: ${args[0]}: No such file or directory`;
        if (node.type !== 'file') return `cat: ${args[0]}: Is a directory`;
        return node.content;
      },

      mkdir: async (args) => {
        if (!args[0]) return 'mkdir: missing operand';
        const resolved = VFS.resolvePath(this.cwd, args[0]);
        const parts = resolved.split('/').filter(Boolean);
        const name = parts.pop()!;
        const parentPath = '/' + parts.join('/') + (parts.length > 0 ? '/' : '');

        await VFS.mkdir(parentPath, name);
        return '';
      },

      touch: async (args) => {
        if (!args[0]) return 'touch: missing file operand';
        for (const f of args) {
          const resolved = VFS.resolvePath(this.cwd, f);
          const parts = resolved.split('/').filter(Boolean);
          const name = parts.pop()!;
          const parentPath = '/' + parts.join('/') + (parts.length > 0 ? '/' : '');

          await VFS.touch(parentPath, name);
        }
        return '';
      },

      rm: async (args) => {
        if (!args[0]) return 'rm: missing operand';
        const resolved = VFS.resolvePath(this.cwd, args[0]);
        const parts = resolved.split('/').filter(Boolean);
        const name = parts.pop()!;
        const parentPath = '/' + parts.join('/') + (parts.length > 0 ? '/' : '');

        const ok = await VFS.rm(parentPath, name);
        return ok ? '' : `rm: cannot remove '${args[0]}': No such file or directory`;
      },

      help: () =>
        [
          'Available commands (free mode):',
          '  ls, cd, pwd, cat, mkdir, touch, rm, echo, clear',
          '  whoami, hostname, uname, date, help, lynx',
          '  history, man, alias, unalias, export, env',
          '  grep, head, tail, wc',
          'Bash features:',
          '  Pipes: command1 | command2',
          '  Variables: $HOME, $USER, $PATH',
          '  Wildcards: ls *.txt',
          '  Aliases: alias ll="ls -la"',
          '  Shortcuts: Ctrl+C, Ctrl+L, Ctrl+U, Ctrl+A, Ctrl+E',
          'Type "tutorial" to return to guided mode.',
        ].join('\n'),

      lynx: (args) => {
        if (window.Lynx) {
          window.Lynx.open();
          if (args[0]) {
            return `Lynx browser opened with URL: ${args[0]}`;
          }
          return 'Lynx browser opened';
        }
        return 'lynx: command not found';
      },

      history: () =>
        this.history
          .slice(0, 20)
          .map((c, i) => `  ${i + 1}  ${c}`)
          .join('\n'),

      man: (args) => {
        if (window.ManViewer) {
          window.ManViewer.open(args[0]);
          return args[0] ? `Opening manual page for ${args[0]}...` : 'Opening man page viewer...';
        }
        return args[0]
          ? `No manual entry for ${args[0]} in this lab. Try --help.`
          : 'What manual page do you want?';
      },
    };
  }

  private cwdShort(): string {
    if (this.cwd === '/home/victxrlarixs') return '~';
    if (this.cwd.startsWith('/home/victxrlarixs/')) {
      return '~/' + this.cwd.slice('/home/victxrlarixs/'.length);
    }
    return this.cwd;
  }

  // ── Print / util ───────────────────────────────────────────────────────────

  private print(html: string): void {
    if (!this.body) return;
    const div = document.createElement('div');
    div.className = 'lab-line';
    div.innerHTML = html;
    this.body.appendChild(div);
  }

  private scrollBottom(): void {
    if (this.body) this.body.scrollTop = this.body.scrollHeight;
  }

  private focus(): void {
    if (this.input) this.input.focus();
  }

  private setHint(text: string): void {
    if (this.hintText) this.hintText.innerHTML = text;
  }

  private escHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

// ─── Singleton + Global exposure ─────────────────────────────────────────────
const TerminalLab = new TerminalLabManager();
(window as unknown as Record<string, unknown>)['TerminalLab'] = TerminalLab;
export { TerminalLab };

// ─── Global type declarations ────────────────────────────────────────────────
declare global {
  interface Window {
    TerminalLab: typeof TerminalLab;
    Lynx?: {
      open: () => void;
    };
    ManViewer?: {
      open: (page?: string) => void;
    };
  }
}
