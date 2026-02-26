# Features Documentation

This document provides technical details for each major feature of the CDE Time Capsule.

## XEmacs Text Editor

A faithful recreation of the XEmacs editor with authentic keybindings and minibuffer interaction.

### Architecture

**Components:**

- Main editor window with textarea
- Minibuffer for interactive commands
- Mode line for status display
- Menu bar with File, Edit, Options, Help
- Find bar for search functionality

### Keybinding System

The editor implements a two-stage keybinding system for Emacs-style shortcuts.

**Ctrl+X Prefix:**

```typescript
private ctrlXPressed: boolean = false;

if (isCtrl && key === 'x') {
  e.preventDefault();
  this.ctrlXPressed = true;
  this.message('C-x-');
  return;
}

if (this.ctrlXPressed) {
  this.ctrlXPressed = false;
  // Handle C-x combinations
  if (isCtrl && key === 's') {
    this.save();
  }
}
```

**Supported Keybindings:**

| Category | Binding | Function               |
| -------- | ------- | ---------------------- |
| File     | C-x C-f | Open file (minibuffer) |
| File     | C-x C-s | Save file              |
| File     | C-x C-w | Save as                |
| File     | C-x C-c | Close editor           |
| Edit     | C-x h   | Select all             |
| Edit     | C-k     | Kill line              |
| Edit     | C-\_    | Undo                   |
| Edit     | C-d     | Delete character       |
| Edit     | C-g     | Abort command          |
| Move     | C-a     | Beginning of line      |
| Move     | C-e     | End of line            |
| Move     | C-p     | Previous line          |
| Move     | C-n     | Next line              |
| Move     | C-f     | Forward character      |
| Move     | C-b     | Backward character     |
| Search   | C-s     | Find                   |
| Other    | C-l     | Recenter               |
| Other    | M-x     | Execute command        |

### Minibuffer System

Interactive command prompt at bottom of editor.

**Prompt Types:**

- File operations: `Visit file: ~/Desktop/`
- Save operations: `Write file: ~/Desktop/file.txt`
- Command execution: `M-x save-buffer`

**Implementation:**

```typescript
private promptMinibuffer(label: string, defaultValue: string = ''): Promise<string | null> {
  this.isMinibufferActive = true;
  this.minibufferLabel.textContent = label;
  this.minibufferInput.value = defaultValue;
  this.minibufferContent.style.display = 'flex';
  this.minibufferInput.focus();

  return new Promise((resolve) => {
    this.minibufferResolver = resolve;
  });
}

private resolveMinibuffer(val: string | null): void {
  this.isMinibufferActive = false;
  this.minibufferContent.style.display = 'none';

  if (this.minibufferResolver) {
    this.minibufferResolver(val);
    this.minibufferResolver = null;
  }

  this.textarea.focus();
}
```

**Minibuffer Keybindings:**

- Enter: Accept input
- Escape: Cancel (returns null)
- C-g: Abort (returns null)

### Mode Line

Displays file status and cursor position.

**Format:**

```
** XEmacs: file.txt    (Text)--L12--C5--All
```

**Components:**

- `**`: Modified indicator (`%%` when unmodified)
- Filename: Current file name
- Mode: Major mode (always "Text")
- Line: Current line number
- Column: Current column number
- Position: Percentage through file or "All"

**Update Logic:**

```typescript
private updateModeLine(): void {
  const statusEl = document.getElementById('emacs-file-status');
  statusEl.textContent = this.isModified ? '**' : '%%';

  const pos = this.textarea.selectionStart;
  const textBefore = this.textarea.value.substring(0, pos);
  const lines = textBefore.split('\n');
  const lineNum = lines.length;
  const colNum = lines[lines.length - 1].length;

  document.getElementById('emacs-line').textContent = String(lineNum);
  document.getElementById('emacs-col').textContent = String(colNum);
}
```

### File Operations

**Open File (C-x C-f):**

```typescript
public async openFile(): Promise<void> {
  const input = await this.promptMinibuffer('Visit file: ', '');
  if (!input) return;

  let fullPath = input.startsWith('/')
    ? input
    : `/home/victxrlarixs/Desktop/${input}`;

  const node = VFS.getNode(fullPath);

  if (!node) {
    // Create new file
    const parts = fullPath.split('/');
    const filename = parts.pop();
    const parentDir = parts.join('/') + '/';
    await VFS.touch(parentDir, filename);
    await this.open(filename, '', fullPath);
    this.message(`(New file) ${fullPath}`);
  } else if (node.type === 'file') {
    const filename = fullPath.split('/').pop();
    await this.open(filename, node.content, fullPath);
  } else {
    this.message(`${fullPath} is a directory.`);
  }
}
```

**Save File (C-x C-s):**

```typescript
public async save(): Promise<void> {
  if (!this.currentFilePath) {
    await this.saveAs();
    return;
  }

  const existing = VFS.getNode(this.currentFilePath);
  if (!existing) {
    const parts = this.currentFilePath.split('/');
    const filename = parts.pop();
    const parentDir = parts.join('/') + '/';
    await VFS.touch(parentDir, filename);
  }

  await VFS.writeFile(this.currentFilePath, this.textarea.value);
  this.isModified = false;
  this.updateModeLine();
  this.message(`Wrote ${this.currentFilePath}`);
}
```

### Find Functionality

**Find Dialog (C-s):**

```typescript
public findDialog(): void {
  const bar = document.getElementById('te-find-bar');
  bar.classList.toggle('te-find-hidden');

  if (!bar.classList.contains('te-find-hidden')) {
    const input = document.getElementById('te-find-input') as HTMLInputElement;
    input.value = '';
    input.focus();
  }
}
```

**Find Next:**

```typescript
private find(dir: 1 | -1): void {
  const query = (document.getElementById('te-find-input') as HTMLInputElement).value;
  if (!query) return;

  const text = this.textarea.value.toLowerCase();
  const q = query.toLowerCase();
  const matches: number[] = [];

  let i = text.indexOf(q);
  while (i !== -1) {
    matches.push(i);
    i = text.indexOf(q, i + 1);
  }

  if (!matches.length) {
    this.message(`Search failed: ${query}`);
    return;
  }

  if (query !== this.lastQuery) {
    this.findIndex = 0;
    this.lastQuery = query;
  } else {
    this.findIndex = (this.findIndex + dir + matches.length) % matches.length;
  }

  const pos = matches[this.findIndex];
  this.textarea.setSelectionRange(pos, pos + query.length);
  this.textarea.focus();
  this.message(`${this.findIndex + 1}/${matches.length}: ${query}`);
}
```

### Splash Screen

Initial screen shown when opening XEmacs without a file.

**Content:**

- XEmacs logo
- Version information
- Quick start links
- Scratch buffer

**Scratch Buffer:**

```
;; This buffer is for text that is not saved, and for Lisp evaluation.
;; To create a file, visit it with C-x C-f and enter text in its buffer.
```

## Netscape Navigator

Fully functional browser replica with internal pages and external link support.

### Page System

**Internal Pages:**

```typescript
const NS_PAGES: Record<string, { title: string; url: string; content: () => string }> = {
  'welcome': {
    title: 'Welcome to Netscape - Netscape',
    url: 'http://home.netscape.com/',
    content: () => `<div class="ns-page">...</div>`
  },
  'whats-new': { ... },
  'whats-cool': { ... },
  'net-search': { ... },
  'net-directory': { ... },
  'questions': { ... },
  'about': { ... }
};
```

### Navigation System

**History Management:**

```typescript
private history: string[] = ['whats-new'];
private historyIndex = 0;

public navigate(pageKey: string): void {
  if (pageKey === this.currentPage) return;

  // Truncate forward history if branching
  if (this.historyIndex < this.history.length - 1) {
    this.history = this.history.slice(0, this.historyIndex + 1);
  }

  this.history.push(pageKey);
  this.historyIndex = this.history.length - 1;
  this.renderPage(pageKey, true);
  this.updateHistoryMenu();
}

public goBack(): void {
  if (this.historyIndex <= 0) return;
  this.historyIndex--;
  this.renderPage(this.history[this.historyIndex], true);
}

public goForward(): void {
  if (this.historyIndex >= this.history.length - 1) return;
  this.historyIndex++;
  this.renderPage(this.history[this.historyIndex], true);
}
```

### Loading Animation

Simulates 1994-era page loading with progress bar and animated logo.

**Loading Sequence:**

```typescript
private startLoading(contentFn: () => string): void {
  this.isLoading = true;

  const steps = [
    { delay: 100, status: 'Connecting to host...', prog: 10 },
    { delay: 250, status: 'Host contacted. Waiting for reply...', prog: 30 },
    { delay: 450, status: 'Receiving data...', prog: 60 },
    { delay: 650, status: 'Loading page...', prog: 80 },
    { delay: 850, status: 'Transferring data...', prog: 95 },
    { delay: 1000, status: 'Document: Done', prog: 100 }
  ];

  steps.forEach(({ delay, status, prog }) => {
    setTimeout(() => {
      if (!this.isLoading) return;
      this.setStatus(status);
      this.animateProgress(prog);
      if (prog === 100) {
        document.getElementById('nsContent').innerHTML = contentFn();
        this.stopLoading();
      }
    }, delay);
  });
}
```

**Shooting Stars Animation:**

```typescript
this.starInterval = setInterval(() => {
  const starsContainer = document.getElementById('nsNStars');
  const star = document.createElement('div');
  star.className = 'ns-n-star';
  star.style.left = `${Math.random() * 50}px`;
  star.style.top = `${Math.random() * 10}px`;
  star.style.width = `${Math.random() > 0.5 ? 3 : 2}px`;
  star.style.height = star.style.width;
  starsContainer.appendChild(star);
  setTimeout(() => star.remove(), 800);
}, 100);
```

### URL Bar

**URL Input Handling:**

```typescript
public handleUrlKey(e: KeyboardEvent): void {
  if (e.key === 'Enter') {
    const input = e.target as HTMLInputElement;
    const url = input.value.trim();

    // Check for internal pages
    const internalMatch = Object.entries(NS_PAGES).find(([, p]) => p.url === url);
    if (internalMatch) {
      this.navigate(internalMatch[0]);
    } else if (url.startsWith('http')) {
      // Open external links in new tab
      window.open(url, '_blank');
      this.setStatus(`Opening: ${url}`);
    } else {
      this.setStatus(`Cannot open: ${url}`);
    }
  }
}
```

### Bookmarks

**Add Bookmark:**

```typescript
public addBookmark(): void {
  const page = NS_PAGES[this.currentPage];
  if (!page) return;

  const placeholder = document.getElementById('ns-bookmarks-placeholder');
  placeholder.style.display = 'none';

  const menu = placeholder.parentElement;
  const item = document.createElement('div');
  item.className = 'ns-item';
  item.textContent = page.title;
  item.onclick = () => this.navigate(this.currentPage);
  menu.appendChild(item);

  this.setStatus(`Bookmark added: ${page.title}`);
}
```

### Menu System

**Dropdown Menus:**

```typescript
document.querySelectorAll('#netscape .ns-menu-label').forEach((lbl) => {
  lbl.addEventListener('click', () => {
    const menu = lbl.parentElement;
    const wasOpen = menu.classList.contains('open');

    // Close all menus
    document.querySelectorAll('#netscape .ns-menu.open').forEach((m) => m.classList.remove('open'));

    // Toggle current menu
    if (!wasOpen) menu.classList.add('open');
  });
});

// Close menus on outside click
document.addEventListener(
  'click',
  (e) => {
    if (!e.target.closest('#netscape .ns-menubar')) {
      document
        .querySelectorAll('#netscape .ns-menu.open')
        .forEach((m) => m.classList.remove('open'));
    }
  },
  true
);
```

## Terminal Lab

Automated tutorial system with 41 command sequences demonstrating Linux commands.

### Tutorial Structure

**Data Format:**

```json
[
  [
    {
      "user": "victx",
      "command": "ls -la",
      "output": "total 48\ndrwxr-xr-x  12 victx  staff   384 Jan 15 10:30 .\ndrwxr-xr-x   6 victx  staff   192 Jan 15 10:30 .."
    },
    {
      "user": "victx",
      "command": "cd Documents",
      "output": ""
    }
  ],
  [
    /* Next sequence */
  ]
]
```

### Typing Animation

**Character-by-Character Typing:**

```typescript
function typeLine(line: string, callback: () => void): void {
  let i = 0;
  typingActive = true;

  const interval = setInterval(
    () => {
      if (!tutorialActive) {
        clearInterval(interval);
        typingActive = false;
        return;
      }

      terminalBody.innerHTML += line[i];
      terminalBody.scrollTop = terminalBody.scrollHeight;
      i++;

      if (i >= line.length) {
        clearInterval(interval);
        terminalBody.innerHTML += '\n';
        typingActive = false;
        callback();
      }
    },
    Math.random() * (MAX_TYPING_DELAY - MIN_TYPING_DELAY) + MIN_TYPING_DELAY
  );
}
```

**Timing Constants:**

```typescript
const MIN_TYPING_DELAY = 30; // Minimum ms between characters
const MAX_TYPING_DELAY = 80; // Maximum ms between characters
const POST_COMMAND_DELAY = 800; // Delay after command output
const POST_SEQUENCE_DELAY = 3000; // Delay between sequences
```

### Step Execution

```typescript
function runStep(): void {
  if (!tutorialActive || !terminalBody) return;

  const sequence = TUTORIAL_SEQUENCES[sequenceIndex];
  const step = sequence[stepIndex];
  const relativePath = currentPath.replace(HOME_PATH, '~');
  const prompt = `${step.user}@Debian:${relativePath}$ `;

  typeLine(prompt + step.command, () => {
    if (!tutorialActive) return;

    setTimeout(() => {
      print(step.output, 'tip');
      stepIndex++;

      if (stepIndex >= sequence.length) {
        // Sequence complete, show transition message
        const randomMsg =
          TRANSITION_MESSAGES[Math.floor(Math.random() * TRANSITION_MESSAGES.length)];
        print('\n' + randomMsg + '\n', 'transition');

        sequenceIndex = (sequenceIndex + 1) % TUTORIAL_SEQUENCES.length;
        stepIndex = 0;

        pendingTimeout = setTimeout(runStep, POST_SEQUENCE_DELAY);
      } else {
        pendingTimeout = setTimeout(runStep, POST_COMMAND_DELAY);
      }
    }, POST_COMMAND_DELAY);
  });
}
```

### Cleanup System

**Line Truncation:**

```typescript
function cleanupTerminal(): void {
  if (!terminalBody) return;

  const lines = terminalBody.innerHTML.split('\n');
  if (lines.length > MAX_LINES) {
    terminalBody.innerHTML = lines.slice(-MAX_LINES).join('\n');
  }
}

// Run cleanup every 10 seconds
cleanupInterval = setInterval(cleanupTerminal, CLEANUP_INTERVAL);
```

**Auto-Scroll:**

```typescript
function keepScrollBottom(): void {
  if (terminalBody) {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }
}

// Run scroll every 100ms
scrollInterval = setInterval(keepScrollBottom, SCROLL_INTERVAL);
```

### Transition Messages

Random messages displayed between sequences:

```typescript
const TRANSITION_MESSAGES = [
  '─────────────────────────────────────────────────────────────',
  '═════════════════════════════════════════════════════════════',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░',
  '>>> Next sequence loading...',
  '<<< Continuing tutorial...',
  '[========================================]',
  '// ─────────────────────────────────────',
];
```

## File Manager

Full-featured file browser with VFS integration.

### Tree View

**Recursive Tree Building:**

```typescript
function buildTree(path: string, depth: number = 0): string {
  const node = VFS.getNode(path);
  if (!node || node.type !== 'folder') return '';

  let html = '';
  const children = node.children;

  for (const [name, child] of Object.entries(children)) {
    const fullPath = path + name + (child.type === 'folder' ? '/' : '');
    const indent = '  '.repeat(depth);
    const icon = child.type === 'folder' ? '📁' : '📄';

    html += `
      <div class="tree-item" data-path="${fullPath}">
        ${indent}${icon} ${name}
      </div>
    `;

    if (child.type === 'folder') {
      html += buildTree(fullPath, depth + 1);
    }
  }

  return html;
}
```

### Content View

**Icon View:**

```typescript
function renderIconView(path: string): void {
  const children = VFS.getChildren(path);
  if (!children) return;

  let html = '';
  for (const [name, node] of Object.entries(children)) {
    const icon = node.type === 'folder' ? 'folder_open.png' : 'gtk-file.png';
    html += `
      <div class="fm-icon" data-name="${name}">
        <img src="/icons/${icon}" alt="${name}">
        <span>${name}</span>
      </div>
    `;
  }

  document.getElementById('fmContent').innerHTML = html;
}
```

**List View:**

```typescript
function renderListView(path: string): void {
  const children = VFS.getChildren(path);
  if (!children) return;

  let html =
    '<table class="fm-list"><thead><tr><th>Name</th><th>Size</th><th>Modified</th></tr></thead><tbody>';

  for (const [name, node] of Object.entries(children)) {
    const size = node.metadata?.size || 0;
    const mtime = node.metadata?.mtime || '';
    const date = new Date(mtime).toLocaleString();

    html += `
      <tr class="fm-list-item" data-name="${name}">
        <td>${name}</td>
        <td>${formatSize(size)}</td>
        <td>${date}</td>
      </tr>
    `;
  }

  html += '</tbody></table>';
  document.getElementById('fmContent').innerHTML = html;
}
```

### Context Menus

**Right-Click Menu:**

```typescript
document.addEventListener('contextmenu', (e) => {
  const target = e.target.closest('.fm-icon, .fm-list-item');
  if (!target) return;

  e.preventDefault();

  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.left = e.clientX + 'px';
  menu.style.top = e.clientY + 'px';
  menu.innerHTML = `
    <div class="menu-item" onclick="openItem()">Open</div>
    <div class="menu-item" onclick="renameItem()">Rename</div>
    <div class="menu-item" onclick="deleteItem()">Delete</div>
    <div class="menu-separator"></div>
    <div class="menu-item" onclick="propertiesItem()">Properties</div>
  `;

  document.body.appendChild(menu);

  // Close on outside click
  document.addEventListener('click', () => menu.remove(), { once: true });
});
```

### File Operations

**Create File:**

```typescript
async function createFile(): Promise<void> {
  const name = prompt('Enter file name:');
  if (!name) return;

  await VFS.touch(currentPath, name);
  refreshView();
}
```

**Create Folder:**

```typescript
async function createFolder(): Promise<void> {
  const name = prompt('Enter folder name:');
  if (!name) return;

  await VFS.mkdir(currentPath, name);
  refreshView();
}
```

**Rename:**

```typescript
async function renameItem(oldName: string): Promise<void> {
  const newName = prompt('Enter new name:', oldName);
  if (!newName || newName === oldName) return;

  await VFS.rename(currentPath, oldName, newName);
  refreshView();
}
```

**Delete:**

```typescript
async function deleteItem(name: string): Promise<void> {
  if (!confirm(`Delete ${name}?`)) return;

  await VFS.rm(currentPath, name);
  refreshView();
}
```

## Process Monitor

System process viewer with virtual PIDs and resource usage.

### Process List

**Virtual Processes:**

```typescript
const SYSTEM_PROCESSES = [
  { pid: 1, name: 'init', user: 'root', cpu: 0.1, mem: 0.5, status: 'running' },
  { pid: 2, name: 'kthreadd', user: 'root', cpu: 0.0, mem: 0.0, status: 'sleeping' },
  { pid: 3, name: 'ksoftirqd/0', user: 'root', cpu: 0.0, mem: 0.0, status: 'sleeping' },
  // ... more processes
];
```

**Dynamic Processes:**

```typescript
function getActiveProcesses(): Process[] {
  const processes = [...SYSTEM_PROCESSES];

  // Add process for each open window
  document.querySelectorAll('.window').forEach((win) => {
    if (win.style.display !== 'none') {
      processes.push({
        pid: generatePID(),
        name: win.id,
        user: 'victx',
        cpu: Math.random() * 5,
        mem: Math.random() * 10,
        status: 'running',
      });
    }
  });

  return processes;
}
```

### Resource Usage

**CPU Usage Animation:**

```typescript
function updateCPU(): void {
  const processes = getActiveProcesses();
  const totalCPU = processes.reduce((sum, p) => sum + p.cpu, 0);

  document.getElementById('cpu-usage').textContent = `${totalCPU.toFixed(1)}%`;
  document.getElementById('cpu-bar').style.width = `${Math.min(totalCPU, 100)}%`;
}

setInterval(updateCPU, 1000);
```

**Memory Usage:**

```typescript
function updateMemory(): void {
  const processes = getActiveProcesses();
  const totalMem = processes.reduce((sum, p) => sum + p.mem, 0);

  document.getElementById('mem-usage').textContent = `${totalMem.toFixed(1)} MB`;
  document.getElementById('mem-bar').style.width = `${((totalMem / 512) * 100).toFixed(1)}%`;
}

setInterval(updateMemory, 1000);
```

### Kill Process

**Process Termination:**

```typescript
function killProcess(pid: number): void {
  const process = processes.find((p) => p.pid === pid);
  if (!process) return;

  if (process.user === 'root') {
    alert('Cannot kill system process');
    return;
  }

  // Find and close corresponding window
  const win = document.getElementById(process.name);
  if (win && window.minimizeWindow) {
    window.minimizeWindow(process.name);
  }

  refreshProcessList();
}
```

## Calendar

Interactive calendar with date selection and navigation.

### Month View

**Calendar Generation:**

```typescript
function generateCalendar(year: number, month: number): string {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  let html = '<table class="calendar-grid"><thead><tr>';
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((day) => {
    html += `<th>${day}</th>`;
  });
  html += '</tr></thead><tbody><tr>';

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    html += '<td></td>';
  }

  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    if ((firstDay + day - 1) % 7 === 0 && day !== 1) {
      html += '</tr><tr>';
    }

    const isToday =
      day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    html += `<td class="${isToday ? 'today' : ''}">${day}</td>`;
  }

  html += '</tr></tbody></table>';
  return html;
}
```

### Navigation

**Month Navigation:**

```typescript
function previousMonth(): void {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
}

function nextMonth(): void {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
}
```

## Time Manager

System clock and timezone configuration.

### Clock Display

**Real-Time Update:**

```typescript
function updateClock(): void {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  document.getElementById('clock-display').textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
```

### Date Display

**Formatted Date:**

```typescript
function updateDate(): void {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  document.getElementById('date-display').textContent = now.toLocaleDateString('en-US', options);
}

updateDate();
setInterval(updateDate, 60000); // Update every minute
```
