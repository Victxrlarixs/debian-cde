// src/scripts/features/manviewer.ts
import { WindowManager } from '../core/windowmanager';
import { logger } from '../utilities/logger';
import manpagesData from '../../data/manpages.json';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ManPage {
  name: string;
  section: string;
  description: string;
  synopsis: string;
  content: string;
  examples: Array<{ cmd: string; desc: string }>;
  related: string[];
}

// ─── Man Pages Data ──────────────────────────────────────────────────────────

const MAN_PAGES: Record<string, ManPage> = manpagesData as Record<string, ManPage>;

// ─── Man Viewer class ────────────────────────────────────────────────────────

class ManPageViewer {
  private id = 'man-viewer';
  private currentPage: string | null = null;
  private history: string[] = [];
  private historyIndex = 0;
  private inputMode: 'navigation' | 'prompt' = 'navigation';
  private promptCallback: ((value: string) => void) | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    logger.log('[ManViewer] Initializing...');
    this.setupKeyboard();
    this.setupInput();
  }

  // ── Window controls ──────────────────────────────────────────────────────

  public open(pageName?: string): void {
    WindowManager.showWindow(this.id);

    const win = document.getElementById(this.id);
    if (win) {
      win.style.flexDirection = 'column';

      requestAnimationFrame(() => {
        WindowManager.centerWindow(win);

        setTimeout(() => {
          this.focus();
        }, 50);
      });
    }

    if (window.AudioManager) window.AudioManager.windowOpen();

    // Show index or specific page
    if (pageName && MAN_PAGES[pageName]) {
      this.showPage(pageName);
    } else {
      this.showIndex();
    }

    logger.log('[ManViewer] Window opened');
  }

  public close(): void {
    if (window.minimizeWindow) window.minimizeWindow(this.id);
    else {
      const win = document.getElementById(this.id);
      if (win) win.style.display = 'none';
      if (window.AudioManager) window.AudioManager.windowClose();
    }
    logger.log('[ManViewer] Window closed');
  }

  // ── Page Display ─────────────────────────────────────────────────────────

  private showIndex(): void {
    this.currentPage = null;
    const title = document.getElementById('man-title');
    if (title) title.textContent = 'Man Page Viewer - Index';

    let content = '<div class="man-section">AVAILABLE COMMANDS</div>\n\n';

    const commands = Object.keys(MAN_PAGES).sort();
    commands.forEach((cmd) => {
      const page = MAN_PAGES[cmd];
      content += `  <span class="man-link" data-page="${cmd}">${cmd}(${page.section})</span> - ${page.description}\n`;
    });

    content += '\n<div class="man-section">USAGE</div>\n';
    content += '  Click on a command name to view its manual page\n';
    content += '  Or use the Terminal Lab: man <command>\n';

    this.renderContent(content);
    this.setStatus(`${commands.length} manual pages available`);
  }

  private showPage(pageName: string): void {
    const page = MAN_PAGES[pageName];
    if (!page) {
      this.setStatus(`No manual entry for ${pageName}`);
      this.showIndex();
      return;
    }

    this.currentPage = pageName;
    this.history.push(pageName);
    this.historyIndex = this.history.length - 1;

    const title = document.getElementById('man-title');
    if (title) title.textContent = `Man: ${page.name.toUpperCase()}(${page.section})`;

    // Format content
    let content = `<div class="man-header">${page.name.toUpperCase()}(${page.section})                User Commands                ${page.name.toUpperCase()}(${page.section})</div>\n\n`;

    // Add formatted content with sections highlighted
    const lines = page.content.split('\n');
    lines.forEach((line) => {
      if (line.match(/^[A-Z][A-Z\s]+$/)) {
        // Section header
        content += `<div class="man-section">${line}</div>\n`;
      } else {
        content += `${this.escapeHtml(line)}\n`;
      }
    });

    // Add examples section with clickable examples
    if (page.examples && page.examples.length > 0) {
      content += '\n<div class="man-section">EXAMPLES</div>\n';
      page.examples.forEach((ex, i) => {
        content += `  [${i + 1}] <span class="man-example" data-cmd="${this.escapeHtml(ex.cmd)}" title="Click to copy">${this.escapeHtml(ex.cmd)}</span>\n`;
        content += `      ${this.escapeHtml(ex.desc)}\n\n`;
      });
    }

    // Add related commands
    if (page.related && page.related.length > 0) {
      content += '\n<div class="man-section">SEE ALSO</div>\n  ';
      content += page.related
        .map((cmd) => `<span class="man-link" data-page="${cmd}">${cmd}</span>`)
        .join(', ');
      content += '\n';
    }

    this.renderContent(content);
    this.setStatus(`Manual page ${page.name}(${page.section})`);
  }

  private renderContent(html: string): void {
    const content = document.getElementById('manContent');
    if (!content) return;

    content.innerHTML = html;

    // Add click handlers for links
    content.querySelectorAll('.man-link').forEach((el) => {
      el.addEventListener('click', () => {
        const pageName = (el as HTMLElement).dataset.page;
        if (pageName) this.showPage(pageName);
      });
    });

    // Add click handlers for examples (copy to clipboard)
    content.querySelectorAll('.man-example').forEach((el) => {
      el.addEventListener('click', () => {
        const cmd = (el as HTMLElement).dataset.cmd;
        if (cmd) {
          navigator.clipboard.writeText(cmd).then(() => {
            this.setStatus(`Copied: ${cmd}`);
          });
        }
      });
    });

    content.scrollTop = 0;
  }

  // ── Keyboard navigation ──────────────────────────────────────────────────

  private setupKeyboard(): void {
    document.addEventListener('keydown', (e) => {
      const win = document.getElementById(this.id);
      if (!win || win.style.display === 'none') return;

      const content = document.getElementById('manContent');
      const inputLine = document.getElementById('manInputLine');

      if (this.inputMode === 'prompt' && inputLine?.style.display !== 'none') {
        return;
      }

      if (!content || document.activeElement !== content) return;

      this.handleKey(e);
    });
  }

  private setupInput(): void {
    const input = document.getElementById('manInput') as HTMLInputElement;
    if (!input) return;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = input.value.trim();
        input.value = '';
        this.hidePrompt();

        if (this.promptCallback) {
          this.promptCallback(value);
          this.promptCallback = null;
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        input.value = '';
        this.hidePrompt();
        this.promptCallback = null;
        this.setStatus('Cancelled');
      }
    });
  }

  private handleKey(e: KeyboardEvent): void {
    const key = e.key.toLowerCase();

    switch (key) {
      case 'q':
        e.preventDefault();
        this.close();
        break;
      case 'h':
      case '?':
        e.preventDefault();
        this.showHelp();
        break;
      case '/':
        e.preventDefault();
        this.search();
        break;
      case 'i':
        e.preventDefault();
        this.showIndex();
        break;
      case 'arrowleft':
        e.preventDefault();
        this.goBack();
        break;
    }
  }

  // ── Commands ─────────────────────────────────────────────────────────────

  private showHelp(): void {
    const helpContent = `<div class="man-header">MAN VIEWER HELP</div>\n\n<div class="man-section">KEYBOARD COMMANDS</div>\n\n  q           Quit man viewer\n  h, ?        Show this help\n  /           Search in current page\n  i           Show index of all pages\n  ←           Go back to previous page\n  ↑↓          Scroll up/down\n  PgUp/PgDn   Page up/down\n\n<div class="man-section">MOUSE COMMANDS</div>\n\n  Click on command names to view their manual pages\n  Click on [number] to copy example to clipboard\n  Click on related commands to navigate\n\n<div class="man-section">TERMINAL LAB INTEGRATION</div>\n\n  man <command>   Open manual page for command\n  man             Show index of all pages\n\nPress any key to return`;

    const previousPage = this.currentPage;
    this.currentPage = null;
    this.renderContent(helpContent);
    this.setStatus('Press any key to continue');

    setTimeout(() => {
      document.addEventListener(
        'keydown',
        () => {
          if (previousPage) {
            this.showPage(previousPage);
          } else {
            this.showIndex();
          }
        },
        { once: true }
      );
    }, 100);
  }

  private search(): void {
    this.showPrompt('Search: ', (term) => {
      if (!term) {
        this.setStatus('Cancelled');
        return;
      }

      const content = document.getElementById('manContent');
      if (!content) return;

      const text = content.textContent || '';
      const idx = text.toLowerCase().indexOf(term.toLowerCase());

      if (idx >= 0) {
        this.setStatus(`Found: "${term}"`);
        const html = content.innerHTML;
        const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        content.innerHTML = html.replace(regex, '<mark>$1</mark>');
      } else {
        this.setStatus(`Not found: "${term}"`);
      }
    });
  }

  private goBack(): void {
    if (this.historyIndex <= 0) {
      this.setStatus('No previous page');
      return;
    }
    this.historyIndex--;
    const pageName = this.history[this.historyIndex];
    if (pageName) {
      this.currentPage = pageName;
      this.showPage(pageName);
    }
  }

  // ── Prompt system (reusing Lynx pattern) ────────────────────────────────

  private showPrompt(promptText: string, callback: (value: string) => void): void {
    const inputLine = document.getElementById('manInputLine');
    const inputPrompt = document.getElementById('manInputPrompt');
    const input = document.getElementById('manInput') as HTMLInputElement;

    if (!inputLine || !inputPrompt || !input) return;

    this.inputMode = 'prompt';
    this.promptCallback = callback;

    inputPrompt.textContent = promptText;
    inputLine.style.display = 'flex';
    input.value = '';
    input.focus();
  }

  private hidePrompt(): void {
    const inputLine = document.getElementById('manInputLine');
    if (inputLine) inputLine.style.display = 'none';

    this.inputMode = 'navigation';
    this.focus();
  }

  // ── Utilities ────────────────────────────────────────────────────────────

  private focus(): void {
    const content = document.getElementById('manContent');
    if (content) content.focus();
  }

  private setStatus(text: string): void {
    const el = document.getElementById('manStatus');
    if (el) el.textContent = text;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// ─── Global exposure ─────────────────────────────────────────────────────────

if (typeof window !== 'undefined') {
  const manViewer = new ManPageViewer();
  (window as any).ManViewer = manViewer;
  (window as any).openManViewer = (page?: string) => manViewer.open(page);
}

export {};
