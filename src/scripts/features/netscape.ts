// src/scripts/features/netscape.ts
import { WindowManager } from '../core/windowmanager';
import { logger } from '../utilities/logger';
import { openWindow, closeWindow } from '../shared/window-helpers';
import { HistoryManager } from '../shared/history-manager';

// ─── Page content definitions ────────────────────────────────────────────────

const NS_PAGES: Record<string, { title: string; url: string; content: () => string }> = {
  'whats-new': {
    title: "What's New! - Netscape",
    url: 'http://home.netscape.com/home/whats-new.html',
    content: () => `
      <div class="ns-page">
        <img src="/images/NetScape.png" alt="What's New!" class="ns-banner" onerror="this.style.display='none'"/>
        <h1>What's New!</h1>
        <p>New information is available every day on the Internet -- how do you find out about it? One way is to start here. This is a monthly What's New listing that lists interesting Internet resources that first appeared today, last month.</p>
        <ul class="ns-links">
          <li><a class="ns-link" href="#" onclick="return false;">What's New This Month!</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">What's New for September 1994</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">What's New for August 1994</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">What's New for July 1994</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">What's New for June 1994</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">What's New for May 1994</a></li>
        </ul>
        <p>You can also retrieve just the <a class="ns-link" href="#" onclick="return false;">new Web announcements from today</a>.</p>
        <h2>Other Sources of New Information</h2>
        <ul class="ns-links">
          <li><a class="ns-link" href="#" onclick="return false;">comp.infosystems.www.announce</a> - USENET announcements of new Web servers</li>
          <li><a class="ns-link" href="#" onclick="return false;">NCSA's What's New</a> - Original What's New page from NCSA</li>
          <li><a class="ns-link" href="#" onclick="return false;">Global Network Navigator</a> - GNN's daily news and features</li>
          <li><a class="ns-link" href="#" onclick="return false;">The Scout Report</a> - Weekly publication for Internet users</li>
        </ul>
      </div>
    `,
  },
  welcome: {
    title: 'Welcome to Netscape - Netscape',
    url: 'http://home.netscape.com/',
    content: () => `
      <div class="ns-page">
        <div class="ns-welcome-header">
          <span class="ns-welcome-logo">NETSCAPE NAVIGATOR</span>
        </div>
        <h1>Welcome to Netscape Navigator™</h1>
        <p>You have embarked on a journey across the Internet, and Netscape Navigator is your vehicle. This welcome page has been set as your home page. As you explore, you'll soon discover that you can pick any page on the Internet as your home.</p>
        <img src="/images/NetScape-Welcome.png" alt="What's New!" class="ns-banner" onerror="this.style.display='none'"/>
        <h2>Explore the Internet</h2>
        <ul class="ns-links">
          <li><a class="ns-link" onclick="window.Netscape.navigate('whats-new')">What's New!</a> - New sites and resources</li>
          <li><a class="ns-link" onclick="window.Netscape.navigate('whats-cool')">What's Cool!</a> - Cool sites on the Web</li>
          <li><a class="ns-link" onclick="window.Netscape.navigate('net-search')">Net Search</a> - Search the Internet</li>
          <li><a class="ns-link" onclick="window.Netscape.navigate('net-directory')">Net Directory</a> - Browse by subject</li>
        </ul>
      </div>
    `,
  },
  'whats-cool': {
    title: "What's Cool! - Netscape",
    url: 'http://home.netscape.com/home/whats-cool.html',
    content: () => `
      <div class="ns-page">
        <h1>What's Cool!</h1>
        <img src="/images/NetScape-Feedback.png" alt="Feedback" class="ns-banner" onerror="this.style.display='none'"/>
        <p>Someday, we'll all agree on what makes something cool. In the meantime, Netscape's staff is out there on the Internet and keeping an eye out for cool things. This list gets changed from time to time, so check back!</p>
        <ul class="ns-links">
          <li><a class="ns-link" href="#" onclick="return false;">The 1994 World Cup</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Arctic Adventours</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Bianca's Smut Shack</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Consumer World</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Dr. Fun</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">The Fish Cam</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Hack the Planet</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Interactive Patient</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Internet Underground Music Archive</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">The Nando News Server</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Project GeoSim</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Rolling Stones Web Site</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">The Simpsons Archive</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">U.S. Census Bureau</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">The Vatican Exhibit</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Weather World</a></li>
        </ul>
      </div>
    `,
  },
  questions: {
    title: 'Frequently Asked Questions - Netscape',
    url: 'http://home.netscape.com/home/faq.html',
    content: () => `
      <div class="ns-page">
        <h1>Frequently Asked Questions</h1>
        <img src="/images/NetScape-FAQs.png" alt="FAQs" class="ns-banner" onerror="this.style.display='none'"/>
        <h2>About Netscape Navigator</h2>
        <p><strong>Q: What is Netscape Navigator?</strong></p>
        <p>A: Netscape Navigator is a web browser application used to access and navigate the World Wide Web. It was developed by Netscape Communications Corporation.</p>
        <p><strong>Q: Is Netscape Navigator free?</strong></p>
        <p>A: Netscape Navigator is free for educational and non-profit use. Commercial users are asked to pay a license fee after an evaluation period.</p>
        <p><strong>Q: What systems does Navigator run on?</strong></p>
        <p>A: Netscape Navigator runs on: Windows (3.1, NT, 95), Macintosh (System 7+), and various Unix/X11 platforms including Sun, HP, SGI, Linux, and others.</p>
        <p><strong>Q: How do I get the latest version?</strong></p>
        <p>A: You can get the latest version at: <a class="ns-link" href="#" onclick="return false;">ftp.netscape.com</a>.</p>
        <h2>Technical Questions</h2>
        <p><strong>Q: What HTML does Navigator support?</strong></p>
        <p>A: Navigator supports HTML 2.0 plus several Netscape extensions including CENTER, tables, frames, background colors, and more.</p>
      </div>
    `,
  },
  'net-search': {
    title: 'Net Search - Netscape',
    url: 'http://home.netscape.com/home/internet-search.html',
    content: () => `
      <div class="ns-page">
        <h1>Net Search</h1>
        <p>Searching the Internet is easy with these powerful services. Just click on one of the search engines below and follow their instructions.</p>
        <img src="/images/NetScape-About.png" alt="About" class="ns-banner" onerror="this.style.display='none'"/>
        <h2>Search Engines</h2>
        <ul class="ns-links">
          <li><a class="ns-link" href="https://www.google.com" target="_blank">Google</a> - The most popular search engine</li>
          <li><a class="ns-link" href="https://www.yahoo.com" target="_blank">Yahoo!</a> - Search and browse the web</li>
          <li><a class="ns-link" href="https://www.bing.com" target="_blank">Bing</a> - Microsoft's search engine</li>
          <li><a class="ns-link" href="https://www.altavista.com" target="_blank">AltaVista</a> - Classic search engine</li>
          <li><a class="ns-link" href="https://www.lycos.com" target="_blank">Lycos</a> - Web search and directory</li>
          <li><a class="ns-link" href="https://www.excite.com" target="_blank">Excite</a> - Search the web</li>
        </ul>
        <h2>USENET Search</h2>
        <ul class="ns-links">
          <li><a class="ns-link" href="https://groups.google.com" target="_blank">Google Groups</a> - Search USENET newsgroups</li>
        </ul>
      </div>
    `,
  },
  'net-directory': {
    title: 'Net Directory - Netscape',
    url: 'http://home.netscape.com/home/internet-directory.html',
    content: () => `
      <div class="ns-page">
        <h1>Internet Directory</h1>
        <p>The World Wide Web Virtual Library is distributed across the world. It is maintained by a dispersed collective of volunteers, who compile pages of key links for particular areas in which they are experts.</p>
        <h2>Arts &amp; Humanities</h2>
        <ul class="ns-links">
          <li><a class="ns-link" href="#" onclick="return false;">Architecture</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Art History</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Classical Studies</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Dance</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Fine Arts</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Literature</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Museums</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Music</a></li>
        </ul>
        <h2>Science</h2>
        <ul class="ns-links">
          <li><a class="ns-link" href="#" onclick="return false;">Astronomy</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Biosciences</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Chemistry</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Computing</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Earth Science</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Mathematics</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">Physics</a></li>
        </ul>
      </div>
    `,
  },
  about: {
    title: 'About Netscape - Netscape',
    url: 'about:',
    content: () => `
      <div class="ns-page ns-about-page">
        <div class="ns-about-logo">
          <img src="/images/NetScape_classic.png" style="width: 128px; height: 128px; margin-bottom: 10px;" />
          <div class="ns-about-name">NETSCAPE NAVIGATOR™</div>
          <div class="ns-about-version">Version 1.0 (X11; I; Linux 2.0.0 i686)</div>
        </div>
        <p>Netscape Navigator™</p>
        <p>Copyright © 1994-1995 Netscape Communications Corporation. All rights reserved.</p>
        <p>This software is subject to the license agreement provided with the Debian CDE system.</p>
        <hr/>
        <p><em>"The ship of the desert is the camel; the ship of the ocean is the browser."</em></p>
      </div>
    `,
  },
  'net-news': {
    title: 'Newsgroups - Netscape',
    url: 'news:',
    content: () => `
      <div class="ns-page">
        <h1>Newsgroups</h1>
        <p>USENET newsgroups are a collection of discussion forums. Netscape Navigator includes a built-in newsgroup reader. To use it, you need access to a news server.</p>
        <h2>Popular Newsgroups</h2>
        <ul class="ns-links">
          <li><a class="ns-link" href="#" onclick="return false;">comp.infosystems.www.announce</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">comp.infosystems.www.browsers.x</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">comp.infosystems.www.misc</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">alt.internet.services</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">news.announce.newusers</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">rec.humor</a></li>
          <li><a class="ns-link" href="#" onclick="return false;">sci.astro</a></li>
        </ul>
      </div>
    `,
  },
};

// ─── Netscape Navigator class ────────────────────────────────────────────────

class NetscapeNavigator {
  private id = 'netscape';
  private history: HistoryManager<string>;
  private currentPage = 'whats-new';
  private isLoading = false;
  private animationFrame: number | null = null;
  private starInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.history = new HistoryManager<string>('whats-new');
    this.init();
  }

  private init(): void {
    logger.log('[Netscape] Initializing...');
    this.renderPage('whats-new', false);
    this.setupScrollThumb();
  }

  // ── Window controls ─────────────────────────────────────────────────────

  public open(): void {
    openWindow({
      id: this.id,
      zIndex: 10000,
      center: true,
      playSound: false, // Netscape doesn't use standard window sound
    });
    logger.log('[Netscape] Window opened');
  }

  public close(): void {
    closeWindow(this.id);
    logger.log('[Netscape] Window closed');
  }

  // ── Navigation ──────────────────────────────────────────────────────────

  public navigate(pageKey: string): void {
    if (pageKey === this.currentPage) return;

    this.history.push(pageKey);
    this.renderPage(pageKey, true);
    this.updateHistoryMenu();
  }

  public goBack(): void {
    const prev = this.history.back();
    if (prev) {
      this.renderPage(prev, true);
    }
  }

  public goForward(): void {
    if (window.AudioManager) window.AudioManager.click();
    const next = this.history.forward();
    if (next) {
      this.renderPage(next, true);
    }
  }

  public goHome(): void {
    if (window.AudioManager) window.AudioManager.click();
    this.navigate('welcome');
  }

  public reload(): void {
    if (window.AudioManager) window.AudioManager.click();
    this.renderPage(this.currentPage, true);
  }

  private renderPage(pageKey: string, animate: boolean): void {
    const page = NS_PAGES[pageKey];
    if (!page) {
      this.setStatus(`Error: Page not found — ${pageKey}`);
      return;
    }

    this.currentPage = pageKey;

    // Update URL bar
    const urlInput = document.getElementById('nsUrlInput') as HTMLInputElement;
    if (urlInput) urlInput.value = page.url;

    // Update title
    const title = document.getElementById('netscape-title');
    if (title) title.textContent = page.title;

    // Active dir button
    const dirBtns = document.querySelectorAll('.ns-dir-btn');
    dirBtns.forEach((btn) => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.ns-dir-btn[onclick*="${pageKey}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Update nav buttons state
    const backBtn = document.getElementById('ns-btn-back') as HTMLButtonElement | null;
    const fwdBtn = document.getElementById('ns-btn-forward') as HTMLButtonElement | null;
    if (backBtn) backBtn.disabled = !this.history.canGoBack();
    if (fwdBtn) fwdBtn.disabled = !this.history.canGoForward();

    if (animate) {
      this.startLoading(page.content);
    } else {
      const content = document.getElementById('nsContent');
      if (content) content.innerHTML = page.content();
      this.setStatus('Document: Done');
    }
  }

  private startLoading(contentFn: () => string): void {
    if (this.isLoading) this.stopLoading();
    this.isLoading = true;

    const stopBtn = document.getElementById('ns-btn-stop') as HTMLButtonElement | null;
    if (stopBtn) stopBtn.disabled = false;

    const nsLogo = document.getElementById('nsNLogo');
    if (nsLogo) nsLogo.classList.add('ns-loading');

    // Spawn stars on the N logo
    this.starInterval = setInterval(() => {
      const starsContainer = document.getElementById('nsNStars');
      if (!starsContainer || !this.isLoading) return;
      const star = document.createElement('div');
      star.className = 'ns-n-star';
      star.style.left = `${Math.random() * 50}px`;
      star.style.top = `${Math.random() * 10}px`;
      star.style.width = `${Math.random() > 0.5 ? 3 : 2}px`;
      star.style.height = star.style.width;
      starsContainer.appendChild(star);
      setTimeout(() => star.remove(), 800);
    }, 100);

    this.setStatus('Connecting...');
    this.animateProgress(0);

    let progress = 0;
    const steps = [
      { delay: 100, status: 'Connecting to host...', prog: 10 },
      { delay: 250, status: 'Host contacted. Waiting for reply...', prog: 30 },
      { delay: 450, status: 'Receiving data...', prog: 60 },
      { delay: 650, status: 'Loading page...', prog: 80 },
      { delay: 850, status: 'Transferring data...', prog: 95 },
      { delay: 1000, status: 'Document: Done', prog: 100 },
    ];

    steps.forEach(({ delay, status, prog }) => {
      setTimeout(() => {
        if (!this.isLoading) return;
        this.setStatus(status);
        this.animateProgress(prog);
        if (prog === 100) {
          const content = document.getElementById('nsContent');
          if (content) {
            content.innerHTML = contentFn();
            content.scrollTop = 0;
          }
          this.stopLoading();
        }
      }, delay);
    });
  }

  private stopLoading(): void {
    this.isLoading = false;
    const stopBtn = document.getElementById('ns-btn-stop') as HTMLButtonElement | null;
    if (stopBtn) stopBtn.disabled = true;

    const nsLogo = document.getElementById('nsNLogo');
    if (nsLogo) nsLogo.classList.remove('ns-loading');

    if (this.starInterval) {
      clearInterval(this.starInterval);
      this.starInterval = null;
    }

    setTimeout(() => this.animateProgress(0), 500);
  }

  public stop(): void {
    if (window.AudioManager) window.AudioManager.click();
    this.stopLoading();
    this.setStatus('Transfer interrupted.');
  }

  private animateProgress(value: number): void {
    const bar = document.getElementById('nsProgressBar');
    if (bar) bar.style.width = `${value}%`;
  }

  private setStatus(text: string): void {
    const el = document.getElementById('nsStatusText');
    if (el) el.textContent = text;
  }

  // ── URL bar ─────────────────────────────────────────────────────────────

  public handleUrlKey(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      const input = e.target as HTMLInputElement;
      const url = input.value.trim();
      // Internal pages
      const internalMatch = Object.entries(NS_PAGES).find(([, p]) => p.url === url);
      if (internalMatch) {
        this.navigate(internalMatch[0]);
      } else {
        // Open external links in new tab if valid HTTP
        if (url.startsWith('http')) {
          window.open(url, '_blank');
          this.setStatus(`Opening: ${url}`);
        } else {
          this.setStatus(`Cannot open: ${url}`);
        }
      }
    }
  }

  // ── Location dialog ─────────────────────────────────────────────────────

  public openLocation(): void {
    const urlInput = document.getElementById('nsUrlInput') as HTMLInputElement;
    if (urlInput) {
      urlInput.focus();
      urlInput.select();
    }
  }

  public openFile(): void {
    this.setStatus('Open File: not supported in this environment.');
  }

  public savePage(): void {
    const content = document.getElementById('nsContent');
    if (!content) return;
    const blob = new Blob([`<html><body>${content.innerHTML}</body></html>`], {
      type: 'text/html',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${this.currentPage}.html`;
    a.click();
    this.setStatus('Page saved.');
  }

  public printPage(): void {
    window.print();
  }

  public findInPage(): void {
    const term = window.prompt('Find in page:');
    if (!term) return;
    const content = document.getElementById('nsContent');
    if (!content) return;
    const html = content.innerHTML;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    content.innerHTML = html.replace(
      regex,
      '<mark style="background:#ffff00;color:#000">$1</mark>'
    );
    this.setStatus(`Found: "${term}"`);
  }

  public viewSource(): void {
    const content = document.getElementById('nsContent');
    if (!content) return;
    const src = content.innerHTML;
    const w = window.open('', '_blank', 'width=600,height=400');
    if (w) {
      w.document.write(
        `<pre style="font:12px monospace;white-space:pre-wrap">${src.replace(/</g, '&lt;')}</pre>`
      );
    }
  }

  public newWindow(): void {
    // Spawn a clone — just re-open this one for simulation
    this.open();
    this.setStatus('New window opened.');
  }

  public loadImages(): void {
    this.setStatus('Images loaded.');
  }

  // ── Bookmarks ───────────────────────────────────────────────────────────

  public addBookmark(): void {
    const page = NS_PAGES[this.currentPage];
    if (!page) return;
    const placeholder = document.getElementById('ns-bookmarks-placeholder');
    if (placeholder) {
      placeholder.style.display = 'none';
      const menu = placeholder.parentElement;
      if (menu) {
        const item = document.createElement('div');
        item.className = 'ns-item';
        item.textContent = page.title;
        const p = this.currentPage;
        item.onclick = () => this.navigate(p);
        menu.appendChild(item);
      }
    }
    this.setStatus(`Bookmark added: ${page.title}`);
  }

  // ── Toolbar visibility ──────────────────────────────────────────────────

  public toggleToolbar(): void {
    const bar = document.getElementById('nsToolbar');
    if (bar) bar.style.display = bar.style.display === 'none' ? 'flex' : 'none';
  }

  public toggleLocation(): void {
    const bar = document.getElementById('nsLocationBar');
    if (bar) bar.style.display = bar.style.display === 'none' ? 'flex' : 'none';
  }

  public toggleDirectory(): void {
    const bar = document.getElementById('nsDirBar');
    if (bar) bar.style.display = bar.style.display === 'none' ? 'flex' : 'none';
  }

  // ── Scroll thumb ────────────────────────────────────────────────────────

  private setupScrollThumb(): void {
    const content = document.getElementById('nsContent');
    const thumb = document.getElementById('nsScrollThumb');
    if (!content || !thumb) return;
    content.addEventListener('scroll', () => {
      const ratio = content.scrollTop / (content.scrollHeight - content.clientHeight || 1);
      const trackHeight = 200;
      thumb.style.top = `${ratio * (trackHeight - 30)}px`;
    });
  }

  // ── History menu ────────────────────────────────────────────────────────

  private updateHistoryMenu(): void {
    const placeholder = document.getElementById('ns-history-placeholder');
    if (!placeholder) return;
    placeholder.style.display = 'none';
    const menu = placeholder.parentElement;
    if (!menu) return;

    // Remove old dynamic history items
    menu.querySelectorAll('.ns-history-item').forEach((el) => el.remove());

    const sep = document.createElement('div');
    sep.className = 'ns-separator';
    menu.appendChild(sep);

    const recentHistory = this.history.getRecent(10);
    const currentIndex = this.history.getCurrentIndex();
    const totalLength = this.history.length();

    recentHistory.forEach((key, idx) => {
      const page = NS_PAGES[key];
      if (!page) return;
      const item = document.createElement('div');
      item.className = 'ns-item ns-history-item';
      const actualIndex = totalLength - 1 - idx;
      if (actualIndex === currentIndex) {
        item.style.fontWeight = 'bold';
      }
      item.textContent = page.title.replace(' - Netscape', '');
      item.onclick = () => {
        const histItem = this.history.jumpTo(actualIndex);
        if (histItem) {
          this.renderPage(histItem, true);
        }
      };
      menu.appendChild(item);
    });
  }
}

// ─── Global exposure ─────────────────────────────────────────────────────────

if (typeof window !== 'undefined') {
  const netscape = new NetscapeNavigator();
  (window as any).Netscape = netscape;

  // Global open function
  (window as any).openNetscape = () => netscape.open();
}

export {};
