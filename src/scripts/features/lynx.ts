// src/scripts/features/lynx.ts
import { WindowManager } from '../core/windowmanager';
import { logger } from '../utilities/logger';
import lynxPagesData from '../../data/lynx-pages.json';

// ─── Types ───────────────────────────────────────────────────────────────────

interface LynxLink {
  num: number;
  text: string;
  url: string;
}

interface LynxPage {
  title: string;
  url: string;
  content: string;
  links: LynxLink[];
}

// ─── Page content ────────────────────────────────────────────────────────────

const LYNX_PAGES: Record<string, LynxPage> = lynxPagesData as Record<string, LynxPage>;

// ─── Lynx Browser class ──────────────────────────────────────────────────────

class LynxBrowser {
  private id = 'lynx';
  private currentUrl = 'lynx://start';
  private currentPage: LynxPage | null = null;
  private selectedLink = 0;
  private history: string[] = ['lynx://start'];
  private historyIndex = 0;
  private bookmarks: string[] = ['lynx://start', 'debian.com.mx', 'gnu.org', 'debian.org'];
  private inputMode: 'navigation' | 'prompt' = 'navigation';
  private promptCallback: ((value: string) => void) | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    logger.log('[Lynx] Initializing...');
    this.navigate('lynx://start', false);
    this.setupKeyboard();
    this.setupInput();
    this.setStatus('Lynx start page - Select a site to visit');
  }

  // ── Window controls ──────────────────────────────────────────────────────

  public open(): void {
    WindowManager.showWindow(this.id);

    const win = document.getElementById(this.id);
    if (win) {
      win.style.flexDirection = 'column';

      // Center window on open with proper timing
      requestAnimationFrame(() => {
        WindowManager.centerWindow(win);

        // Ensure focus after centering
        setTimeout(() => {
          this.focus();
        }, 50);
      });
    }

    if (window.AudioManager) window.AudioManager.windowOpen();
    logger.log('[Lynx] Window opened');
  }

  public close(): void {
    if (window.minimizeWindow) window.minimizeWindow(this.id);
    else {
      const win = document.getElementById(this.id);
      if (win) win.style.display = 'none';
      if (window.AudioManager) window.AudioManager.windowClose();
    }
    logger.log('[Lynx] Window closed');
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  public navigate(url: string, addToHistory = true): void {
    const page = LYNX_PAGES[url];
    if (!page) {
      this.setStatus(`Error: Page not found — ${url}`);
      return;
    }

    this.currentUrl = url;
    this.currentPage = page;
    this.selectedLink = 0;

    if (addToHistory) {
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }
      this.history.push(url);
      this.historyIndex = this.history.length - 1;
    }

    this.render();
    this.setStatus('Document: Done');
  }

  public goBack(): void {
    if (this.historyIndex <= 0) return;
    this.historyIndex--;
    this.navigate(this.history[this.historyIndex], false);
  }

  public followLink(num: number): void {
    if (!this.currentPage) return;
    const link = this.currentPage.links.find((l) => l.num === num);
    if (!link) {
      this.setStatus(`Error: Link ${num} not found`);
      return;
    }

    // External links
    if (link.url.startsWith('http')) {
      window.open(link.url, '_blank');
      this.setStatus(`Opening external: ${link.url}`);
      return;
    }

    this.navigate(link.url);
  }

  // ── Rendering ────────────────────────────────────────────────────────────

  private render(): void {
    if (!this.currentPage) return;

    const content = document.getElementById('lynxContent');
    const title = document.getElementById('lynx-title');

    if (title) title.textContent = `Lynx: ${this.currentPage.title}`;

    if (content) {
      // Header with URL (authentic Lynx style)
      let html = `<div class="lynx-line" style="color: #ffffff; font-weight: bold;">${this.escapeHtml(this.currentPage.url)}</div>`;
      html += `<div class="lynx-line"></div>`;

      const lines = this.currentPage.content.trim().split('\n');

      lines.forEach((line) => {
        // Highlight links
        const linkMatch = line.match(/\[(\d+)\]([^\[]+)/g);
        if (linkMatch) {
          let processedLine = line;
          linkMatch.forEach((match) => {
            const numMatch = match.match(/\[(\d+)\]/);
            if (numMatch) {
              const num = parseInt(numMatch[1]);
              const isSelected = num === this.selectedLink + 1;
              const className = isSelected ? 'lynx-link lynx-link-selected' : 'lynx-link';
              processedLine = processedLine.replace(
                match,
                `<span class="${className}" data-link="${num}">${match}</span>`
              );
            }
          });
          html += `<div class="lynx-line">${processedLine}</div>`;
        } else {
          html += `<div class="lynx-line">${this.escapeHtml(line)}</div>`;
        }
      });

      content.innerHTML = html;

      // Add click handlers to links
      content.querySelectorAll('.lynx-link').forEach((el) => {
        el.addEventListener('click', () => {
          const linkNum = parseInt((el as HTMLElement).dataset.link || '0');
          this.followLink(linkNum);
        });
      });

      content.scrollTop = 0;
    }
  }

  // ── Keyboard navigation ──────────────────────────────────────────────────

  private setupKeyboard(): void {
    document.addEventListener('keydown', (e) => {
      const win = document.getElementById(this.id);
      if (!win || win.style.display === 'none') return;

      const content = document.getElementById('lynxContent');
      const inputLine = document.getElementById('lynxInputLine');

      // If in prompt mode, don't handle navigation keys
      if (this.inputMode === 'prompt' && inputLine?.style.display !== 'none') {
        return;
      }

      if (!content || document.activeElement !== content) return;

      this.handleKey(e);
    });
  }

  private setupInput(): void {
    const input = document.getElementById('lynxInput') as HTMLInputElement;
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

  private showPrompt(promptText: string, callback: (value: string) => void): void {
    const inputLine = document.getElementById('lynxInputLine');
    const inputPrompt = document.getElementById('lynxInputPrompt');
    const input = document.getElementById('lynxInput') as HTMLInputElement;

    if (!inputLine || !inputPrompt || !input) return;

    this.inputMode = 'prompt';
    this.promptCallback = callback;

    inputPrompt.textContent = promptText;
    inputLine.style.display = 'flex';
    input.value = '';
    input.focus();
  }

  private hidePrompt(): void {
    const inputLine = document.getElementById('lynxInputLine');
    if (inputLine) inputLine.style.display = 'none';

    this.inputMode = 'navigation';
    this.focus();
  }

  private handleKey(e: KeyboardEvent): void {
    if (!this.currentPage) return;

    const key = e.key.toLowerCase();

    switch (key) {
      case 'arrowdown':
      case 'j':
        e.preventDefault();
        this.selectNextLink();
        break;
      case 'arrowup':
      case 'k':
        e.preventDefault();
        this.selectPrevLink();
        break;
      case 'enter':
      case 'arrowright':
        e.preventDefault();
        this.followSelectedLink();
        break;
      case 'arrowleft':
        e.preventDefault();
        this.goBack();
        break;
      case 'g':
        e.preventDefault();
        this.openLocation();
        break;
      case 'o':
        e.preventDefault();
        this.showOptions();
        break;
      case 'p':
        e.preventDefault();
        this.printPage();
        break;
      case 'm':
        e.preventDefault();
        this.goHome();
        break;
      case 'q':
        e.preventDefault();
        this.quit();
        break;
      case 'h':
      case '?':
        e.preventDefault();
        this.showHelp();
        break;
      case 'v':
        e.preventDefault();
        this.viewBookmarks();
        break;
      case '/':
        e.preventDefault();
        this.search();
        break;
      case 'delete':
      case 'backspace':
        if (e.key === 'Delete') {
          e.preventDefault();
          this.viewHistory();
        }
        break;
      default:
        // Number keys for direct link access
        if (key >= '0' && key <= '9') {
          e.preventDefault();
          this.followLink(parseInt(key));
        }
        break;
    }
  }

  private selectNextLink(): void {
    if (!this.currentPage) return;
    this.selectedLink = (this.selectedLink + 1) % this.currentPage.links.length;
    this.render();
    this.scrollToSelected();
  }

  private selectPrevLink(): void {
    if (!this.currentPage) return;
    this.selectedLink =
      (this.selectedLink - 1 + this.currentPage.links.length) % this.currentPage.links.length;
    this.render();
    this.scrollToSelected();
  }

  private followSelectedLink(): void {
    if (!this.currentPage) return;
    const link = this.currentPage.links[this.selectedLink];
    if (link) this.followLink(link.num);
  }

  private scrollToSelected(): void {
    const selected = document.querySelector('.lynx-link-selected');
    if (selected) {
      selected.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  // ── Commands ─────────────────────────────────────────────────────────────

  public openLocation(): void {
    this.showPrompt('URL to open: ', (url) => {
      if (!url) {
        this.setStatus('Cancelled');
        return;
      }

      if (LYNX_PAGES[url]) {
        this.navigate(url);
      } else if (url.startsWith('http')) {
        window.open(url, '_blank');
        this.setStatus(`Opening external: ${url}`);
      } else {
        this.setStatus(`Error: Unknown URL — ${url}`);
      }
    });
  }

  public showHelp(): void {
    const helpPage: LynxPage = {
      title: 'Lynx Help',
      url: 'lynx://help',
      content: `
  LYNX KEYBOARD COMMANDS

  Navigation:
  ↑, k         - Move to previous link
  ↓, j         - Move to next link
  →, Enter     - Follow current link
  ←            - Go back to previous page
  0-9          - Jump to link number

  Commands:
  G            - Go to a URL
  O            - Show options menu
  P            - Print to file
  M            - Return to main screen (home)
  H, ?         - Show this help
  Q            - Quit Lynx
  /            - Search for text in page
  Delete       - View history list
  V            - View bookmarks

  Press any key to return to previous page
`,
      links: [],
    };

    const previousPage = this.currentPage;
    const previousUrl = this.currentUrl;

    this.currentPage = helpPage;
    this.currentUrl = 'lynx://help';
    this.render();
    this.setStatus('Press any key to continue');

    // Return to previous page on any key
    const returnHandler = (e: KeyboardEvent) => {
      const win = document.getElementById(this.id);
      if (!win || win.style.display === 'none') return;

      e.preventDefault();
      this.currentPage = previousPage;
      this.currentUrl = previousUrl;
      this.render();
      this.setStatus('Returned to previous page');
      document.removeEventListener('keydown', returnHandler);
    };

    setTimeout(() => {
      document.addEventListener('keydown', returnHandler, { once: true });
    }, 100);
  }

  public showOptions(): void {
    const optionsPage: LynxPage = {
      title: 'Lynx Options',
      url: 'lynx://options',
      content: `
  LYNX OPTIONS MENU

  This is a simplified browser simulation.
  Full options menu not available.

  Available settings:
  - Display: Text-only mode (fixed)
  - Colors: Enabled (fixed)
  - Character set: UTF-8 (fixed)

  Press any key to return
`,
      links: [],
    };

    const previousPage = this.currentPage;
    const previousUrl = this.currentUrl;

    this.currentPage = optionsPage;
    this.currentUrl = 'lynx://options';
    this.render();
    this.setStatus('Press any key to continue');

    setTimeout(() => {
      document.addEventListener(
        'keydown',
        () => {
          this.currentPage = previousPage;
          this.currentUrl = previousUrl;
          this.render();
          this.setStatus('Returned to previous page');
        },
        { once: true }
      );
    }, 100);
  }

  public printPage(): void {
    this.setStatus('Print options not available in browser version');
  }

  public goHome(): void {
    this.navigate('lynx://start');
  }

  public quit(): void {
    this.showPrompt('Are you sure you want to quit? (y/n) ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        this.close();
      } else {
        this.setStatus('Cancelled');
      }
    });
  }

  public viewBookmarks(): void {
    let content = '\n  BOOKMARKS\n  =========\n\n';
    this.bookmarks.forEach((url, i) => {
      content += `  [${i + 1}]${url}\n`;
    });
    content += '\n  Enter number to visit, or press any other key to return';

    const bookmarksPage: LynxPage = {
      title: 'Bookmarks',
      url: 'lynx://bookmarks',
      content,
      links: this.bookmarks.map((url, i) => ({
        num: i + 1,
        text: url,
        url: url,
      })),
    };

    const previousPage = this.currentPage;
    const previousUrl = this.currentUrl;

    this.currentPage = bookmarksPage;
    this.currentUrl = 'lynx://bookmarks';
    this.selectedLink = 0;
    this.render();
    this.setStatus('Select bookmark or press any key to return');
  }

  public viewHistory(): void {
    let content = '\n  HISTORY LIST\n  ============\n\n';
    this.history.forEach((url, i) => {
      const marker = i === this.historyIndex ? ' * ' : '   ';
      content += `${marker}${i + 1}. ${url}\n`;
    });
    content += '\n  * = current page\n  Press any key to return';

    const historyPage: LynxPage = {
      title: 'History',
      url: 'lynx://history',
      content,
      links: [],
    };

    const previousPage = this.currentPage;
    const previousUrl = this.currentUrl;

    this.currentPage = historyPage;
    this.currentUrl = 'lynx://history';
    this.render();
    this.setStatus('Press any key to continue');

    setTimeout(() => {
      document.addEventListener(
        'keydown',
        () => {
          this.currentPage = previousPage;
          this.currentUrl = previousUrl;
          this.render();
          this.setStatus('Returned to previous page');
        },
        { once: true }
      );
    }, 100);
  }

  public search(): void {
    this.showPrompt('Search for: ', (term) => {
      if (!term) {
        this.setStatus('Cancelled');
        return;
      }

      const content = document.getElementById('lynxContent');
      if (!content) return;

      const text = content.textContent || '';
      const idx = text.toLowerCase().indexOf(term.toLowerCase());

      if (idx >= 0) {
        this.setStatus(`Found: "${term}"`);
        // Simple highlight
        const html = content.innerHTML;
        const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        content.innerHTML = html.replace(regex, '<mark>$1</mark>');
      } else {
        this.setStatus(`Not found: "${term}"`);
      }
    });
  }

  // ── Utilities ────────────────────────────────────────────────────────────

  private focus(): void {
    const content = document.getElementById('lynxContent');
    if (content) content.focus();
  }

  private setStatus(text: string): void {
    const el = document.getElementById('lynxStatus');
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
  const lynx = new LynxBrowser();
  (window as any).Lynx = lynx;
  (window as any).openLynx = () => lynx.open();
}

export {};
