# Architecture Overview

This document provides a technical overview of the CDE Time Capsule system architecture, including core subsystems, data flow patterns, and implementation details.

## System Overview

The CDE Time Capsule is a browser-based recreation of the Common Desktop Environment built with Astro, TypeScript, and vanilla CSS. The architecture follows a modular design with clear separation between core systems, feature modules, and UI components.

## Core Systems

### Virtual Filesystem (VFS)

The VFS provides a complete in-memory filesystem with O(1) path resolution using a flattened pointer map.

**Key Features:**

- O(1) path lookup via pre-computed hash map
- Event-driven architecture with `cde-fs-change` broadcasts
- Full CRUD operations (create, read, update, delete)
- Metadata tracking (size, mtime, owner, permissions)
- Trash management with restore capability
- Lazy content loading for large assets

**Implementation Details:**

```typescript
interface VFSNode {
  type: 'file' | 'folder';
  content?: string;
  children?: Record<string, VFSNode>;
  metadata: {
    size: number;
    mtime: string;
    owner: string;
    permissions: string;
  };
}
```

The filesystem is initialized from `src/data/filesystem.json` and flattened into a map structure:

```typescript
const fsMap: Record<string, VFSNode> = {};
// Example: fsMap['/home/victxrlarixs/Desktop/'] = { type: 'folder', ... }
```

**Path Resolution:**

- Handles absolute paths (`/home/user/file.txt`)
- Tilde expansion (`~/Desktop` → `/home/victxrlarixs/Desktop`)
- Relative path resolution with `.` and `..` support
- Trailing slash normalization for directories

**Event System:**
All filesystem modifications dispatch a `cde-fs-change` event:

```typescript
window.dispatchEvent(
  new CustomEvent('cde-fs-change', {
    detail: { path: '/home/victxrlarixs/Desktop/' },
  })
);
```

This enables reactive updates in FileManager and Desktop components.

### WindowManager

Manages window lifecycle, positioning, focus, dragging, and workspace organization.

**Responsibilities:**

- Window registration and lifecycle management
- Drag-and-drop with pointer event handling
- Z-index management for focus ordering
- Viewport clamping to prevent overflow
- Workspace switching (4 virtual desktops)
- Mobile-responsive centering
- Session persistence via SettingsManager

**Viewport Clamping:**

Windows are strictly constrained within viewport boundaries:

```typescript
const TOP_BAR_HEIGHT = 30;
const PANEL_HEIGHT = 80;

const minX = 0;
const maxX = Math.max(0, viewportWidth - windowWidth);
const minY = TOP_BAR_HEIGHT;
const maxY = Math.max(minY, viewportHeight - windowHeight - PANEL_HEIGHT);

left = Math.max(minX, Math.min(left, maxX));
top = Math.max(minY, Math.min(top, maxY));
```

**Drag Implementation:**

Uses PointerEvent API for unified mouse/touch support:

```typescript
function drag(e: PointerEvent, id: string): void {
  el.setPointerCapture(e.pointerId);
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', stopDrag);
}
```

Mouse acceleration is applied during drag:

```typescript
const acceleration =
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mouse-acceleration')) ||
  1;

let left = currentLeft + deltaX * acceleration;
let top = currentTop + deltaY * acceleration;
```

**Workspace Management:**

Each window has a `data-workspace` attribute (1-4). Switching workspaces:

1. Hide all windows in current workspace
2. Mark visible windows with `data-was-opened="true"`
3. Update `currentWorkspace` state
4. Show windows in new workspace that were previously opened

**Focus Modes:**

- **Click-to-focus** (default): Focus on pointerdown
- **Point-to-focus**: Focus on pointerenter (configurable)

### SettingsManager

Centralized configuration and persistence layer using localStorage.

**Managed Settings:**

- Theme colors and fonts
- Mouse settings (acceleration, handedness, double-click speed)
- Keyboard settings (repeat rate, click sound)
- Audio settings (beep volume, frequency, duration)
- Backdrop selection
- Window behavior (focus mode, opaque dragging)
- Screen saver settings
- Window session state (position, size, maximized)

**Storage Structure:**

```typescript
interface Settings {
  theme: {
    colors: Record<string, string>;
    fonts: Record<string, string>;
  };
  mouse: {
    acceleration: number;
    threshold: number;
    doubleClickTime: number;
    handedness: 'right' | 'left';
  };
  keyboard: {
    repeatRate: number;
    clickSound: boolean;
  };
  audio: {
    volume: number;
    frequency: number;
    duration: number;
  };
  backdrop: {
    current: string;
    style: 'tiled' | 'centered' | 'fit' | 'fill';
  };
  window: {
    focusMode: 'click' | 'point';
    opaqueDragging: boolean;
  };
  screen: {
    timeout: number;
    enabled: boolean;
  };
  session: {
    windows: Record<
      string,
      {
        left: string;
        top: string;
        maximized: boolean;
      }
    >;
  };
}
```

**Persistence:**

Settings are automatically saved to localStorage on change:

```typescript
localStorage.setItem('cde_settings', JSON.stringify(settings));
```

### AudioManager

Web Audio API-based sound synthesis for system feedback.

**Sound Types:**

- Click: 800Hz, 30ms (UI interactions)
- Success: 1000Hz, 50ms (successful operations)
- Error: 400Hz, 100ms (error conditions)
- Window open: 600Hz, 40ms
- Window close: 500Hz, 40ms

**Implementation:**

```typescript
const audioContext = new AudioContext();
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

oscillator.type = 'sine';
oscillator.frequency.value = frequency;
gainNode.gain.value = volume;

oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

oscillator.start();
oscillator.stop(audioContext.currentTime + duration);
```

**Auto-unlock:**

AudioContext requires user interaction. The system auto-unlocks on first pointer/key event:

```typescript
window.addEventListener('pointerdown', unlock, { once: true });
window.addEventListener('keydown', unlock, { once: true });
```

### XPM Parser

Parses X PixMap (XPM) format backdrop files and converts them to CSS.

**XPM Format:**

```c
static char * backdrop[] = {
  "4 4 2 1",
  "  c #FFFFFF",
  ". c #000000",
  "  . ",
  " .. ",
  " .. ",
  "  . "
};
```

**Parser Logic:**

1. Extract dimensions and color count
2. Parse color definitions (symbolic names, hex values)
3. Build pixel grid
4. Convert to base64-encoded PNG via Canvas API
5. Apply as CSS background-image

**Color Token Handling:**

The parser recognizes CDE symbolic color tokens:

```typescript
const colorMap: Record<string, string> = {
  topShadowColor: 'var(--top-shadow)',
  bottomShadowColor: 'var(--bottom-shadow)',
  selectColor: 'var(--select-color)',
  background: 'var(--bg-color)',
  // ... etc
};
```

This allows backdrops to adapt to theme changes dynamically.

## Component Architecture

### Desktop Icons

Desktop icons are reactive to VFS changes:

```typescript
window.addEventListener('cde-fs-change', (e: CustomEvent) => {
  if (e.detail.path === CONFIG.FS.DESKTOP) {
    refreshDesktopIcons();
  }
});
```

**Icon Actions:**

- Single click: Select
- Double click: Open (file → XEmacs, folder → FileManager)
- Right click: Context menu (rename, delete, properties)
- Drag: Move icon position (saved to session)

### File Manager

Full-featured file browser with VFS integration.

**Features:**

- Tree navigation with expandable folders
- Icon and list view modes
- Context menus (new file, new folder, rename, delete, properties)
- Path bar with manual navigation
- Up/Home navigation buttons
- File operations (cut, copy, paste, delete)
- Trash integration

**View Synchronization:**

Tree and content views stay synchronized via VFS events:

```typescript
window.addEventListener('cde-fs-change', () => {
  refreshTreeView();
  refreshContentView();
});
```

### XEmacs Editor

Emacs-style text editor with authentic keybindings.

**Keybindings:**

| Binding | Action                        |
| ------- | ----------------------------- |
| C-x C-s | Save file                     |
| C-x C-f | Open file (minibuffer prompt) |
| C-x C-w | Save as                       |
| C-x C-c | Close editor                  |
| C-x h   | Select all                    |
| C-s     | Find                          |
| C-g     | Abort/Quit                    |
| C-k     | Kill line                     |
| C-\_    | Undo                          |
| C-a     | Move to line start            |
| C-e     | Move to line end              |
| C-p     | Previous line                 |
| C-n     | Next line                     |
| C-f     | Forward char                  |
| C-b     | Backward char                 |
| C-d     | Delete char                   |
| M-x     | Execute command               |

**Minibuffer:**

Interactive command prompt at bottom of editor:

```typescript
async promptMinibuffer(label: string, defaultValue: string): Promise<string | null> {
  // Show minibuffer input
  // Wait for Enter or Escape
  // Return value or null
}
```

**Mode Line:**

Displays file status, line/column position:

```
** XEmacs: file.txt    (Text)--L12--C5--All
```

- `**`: Modified, `%%`: Unmodified
- Line and column numbers update on cursor movement

### Terminal Lab

Automated tutorial system with 41 command sequences.

**Tutorial Structure:**

```typescript
interface TutorialStep {
  user: string;
  command: string;
  output: string;
}
```

**Animation:**

Commands are typed character-by-character with randomized delays (30-80ms):

```typescript
function typeLine(line: string, callback: () => void): void {
  const delay = Math.random() * (MAX_TYPING_DELAY - MIN_TYPING_DELAY) + MIN_TYPING_DELAY;
  // Type each character with delay
}
```

**Cleanup:**

Terminal content is truncated to 500 lines every 10 seconds to prevent memory bloat.

### Netscape Navigator

Functional browser replica with internal pages and external link support.

**Internal Pages:**

- Welcome
- What's New!
- What's Cool!
- Net Search
- Net Directory
- Frequently Asked Questions
- About

**Loading Animation:**

Simulates 1994-era page loading:

1. "Connecting to host..." (10%)
2. "Host contacted. Waiting for reply..." (30%)
3. "Receiving data..." (60%)
4. "Loading page..." (80%)
5. "Transferring data..." (95%)
6. "Document: Done" (100%)

During loading, the N logo displays animated shooting stars.

**History Management:**

```typescript
private history: string[] = ['whats-new'];
private historyIndex = 0;

public navigate(pageKey: string): void {
  if (this.historyIndex < this.history.length - 1) {
    this.history = this.history.slice(0, this.historyIndex + 1);
  }
  this.history.push(pageKey);
  this.historyIndex = this.history.length - 1;
}
```

### Style Manager

Comprehensive theme customization system with 9 modules.

**Modules:**

- **Theme**: Color palette management (76+ CDE palettes)
- **Font**: Typography controls (family, size, weight)
- **Mouse**: Acceleration, handedness, double-click speed
- **Keyboard**: Repeat rate, click sound
- **Beep**: Audio feedback (volume, frequency, duration)
- **Backdrop**: Background selection (168 XPM patterns)
- **Window**: Focus mode, opaque dragging
- **Screen**: Screen saver timeout
- **Startup**: Session management, data reset

**Color System:**

CSS custom properties enable global theme changes:

```css
:root {
  --bg-color: #ae9e8e;
  --fg-color: #000000;
  --top-shadow: #dfd6c6;
  --bottom-shadow: #5e5e5e;
  --select-color: #ae9e8e;
  /* ... 20+ more variables */
}
```

Palette application updates all variables simultaneously:

```typescript
Object.entries(palette.colors).forEach(([key, value]) => {
  document.documentElement.style.setProperty(key, value);
});
```

## Data Flow

### Application Initialization

```
1. Boot sequence (BootSequence.astro)
   ↓
2. Core systems init (init.ts)
   - VFS.init()
   - WindowManager.init()
   - AudioManager.init()
   - SettingsManager.load()
   - AccessibilityManager.init()
   ↓
3. Feature modules init
   - StyleManager.init()
   - Desktop.init()
   - FileManager.init()
   - etc.
   ↓
4. Window registration
   - WindowManager.registerWindow() for each .window element
   ↓
5. Event listeners attached
   - Keyboard shortcuts
   - VFS change listeners
   - Window focus handlers
```

### File Operation Flow

```
User Action (FileManager)
   ↓
VFS API call (e.g., VFS.touch(), VFS.mkdir())
   ↓
VFS updates internal state (fsMap)
   ↓
VFS dispatches 'cde-fs-change' event
   ↓
Listeners update UI
   - FileManager refreshes tree/content
   - Desktop refreshes icons
```

### Window Lifecycle

```
User opens application
   ↓
showWindow(id) called
   ↓
WindowManager.registerWindow(element)
   - Attach drag handlers
   - Restore session position
   - Assign to current workspace
   ↓
WindowManager.centerWindow(element)
   - Calculate center position
   - Apply viewport clamping
   ↓
WindowManager.focusWindow(id)
   - Remove .active from other windows
   - Add .active to target
   - Increment z-index
   ↓
Window displayed and interactive
```

## Performance Optimizations

### VFS Flattening

Instead of recursive tree traversal (O(n) depth), paths are pre-computed into a flat map:

```typescript
// Slow: O(n) depth traversal
function getNode(path: string): VFSNode {
  let node = root;
  for (const part of path.split('/')) {
    node = node.children[part];
  }
  return node;
}

// Fast: O(1) lookup
function getNode(path: string): VFSNode {
  return fsMap[path];
}
```

### Lazy Content Loading

Large assets (README.md, man pages) are loaded asynchronously after initial render:

```typescript
async function syncDynamicContent(): Promise<void> {
  const [readme, bashBible, shBible] = await Promise.all([
    import('../../../README.md?raw'),
    import('../../data/pure-bash-bible.md?raw'),
    import('../../data/pure-sh-bible.md?raw'),
  ]);
  // Populate VFS nodes
}
```

### Window Drag Optimization

- `will-change: transform` hint during drag
- Pointer capture prevents event loss
- Throttled position updates (per-frame)
- Wireframe mode for non-opaque dragging

### Terminal Cleanup

Automatic line truncation prevents unbounded memory growth:

```typescript
setInterval(() => {
  const lines = terminalBody.innerHTML.split('\n');
  if (lines.length > MAX_LINES) {
    terminalBody.innerHTML = lines.slice(-MAX_LINES).join('\n');
  }
}, CLEANUP_INTERVAL);
```

## Build and Deployment

### Build Process

```bash
npm run build
```

Astro compiles:

1. TypeScript → JavaScript (esbuild)
2. Astro components → HTML
3. CSS → Minified CSS
4. Static assets → `/dist`

### Output Structure

```
dist/
├── index.html
├── _astro/
│   ├── [hash].js
│   └── [hash].css
├── css/
├── icons/
├── backdrops/
├── palettes/
└── sw.js
```

### Deployment

Static site deployed to GitHub Pages via GitHub Actions:

```yaml
- name: Build
  run: npm run build
- name: Deploy
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

## Browser Compatibility

**Minimum Requirements:**

- ES2020 support
- CSS Custom Properties
- Pointer Events API
- Web Audio API
- LocalStorage
- Service Workers (for PWA)

**Tested Browsers:**

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+
- Chrome Android 90+
