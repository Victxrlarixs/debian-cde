# CDE Time Capsule: The Nostalgic Portal
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Astro](https://img.shields.io/badge/Astro-BC52EE?style=flat&logo=astro&logoColor=white)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat)](CONTRIBUTING.md)
![GitHub stars](https://img.shields.io/github/stars/Victxrlarixs/debian-cde?style=flat&logo=github)
![GitHub last commit](https://img.shields.io/github/last-commit/Victxrlarixs/debian-cde?style=flat&logo=github)

Ever wonder what it felt like to sit in front of a $20,000 Unix workstation in 1996? Welcome to a pixel-perfect recreation of the **Common Desktop Environment (CDE)**—living right inside your modern browser.

> [!NOTE]
> This project is a stateful browser-based recreation of the Common Desktop Environment (CDE), featuring a custom Virtual Filesystem and reactive system logic. Built with passion for the pixel.

---

## A Journey Through Time

This isn't just a website; it's a living desktop. From the moment the terminal scrolls past your eyes, you're not just a "visitor"—you're a "user" of a classic Unix system.

### 🎨 Master of Style

The **Style Manager** is your control center for total immersion. It's not just about colors; it's about fine-tuning the virtual hardware:

- **Color Palettes**: 76+ authentic Motif-style themes (Platinum, Alpine, Midnight) that propagate globally via CSS variables.
- **Original Backdrops**: A massive library of authentic dithered XPM textures and solid patterns from the 90s.
- **Mouse & Keyboard**: Tune acceleration curves, handedness, and mechanical audio feedback to match your preference.
- **Window Behavior**: Centralized control over window placement, focus policies, and decorative borders.
- **Audio Synth**: An integrated Web Audio oscillator that mimics the characteristic system "beep" of vintage Unix terminals.
- **Fonts & Data**: Switch between authentic aliased fontsets and use the **Startup** controls to manage or reset your persistent session data.

### 📁 A Responsive World

Everything reacts to you. Drag windows by their title bars, hover over icons to see them glow, and explore a **Virtual Filesystem** where you can create your own digital corner. It's the tactile feel of the 90s with the speed of today.

### XEmacs

A core pillar of the Debian-CDE experience. Much more than a text editor, it's a faithful recreation of the classic environment:

- **Interactive Minibuffer**: No pop-ups for system operations. All commands (`M-x`), file visits (`C-x C-f`), and saves (`C-x C-w`) happen natively in the interactive lower minibuffer.
- **Classic Keybindings**: Support for `C-x`, `C-g` (abort), `C-k` (kill line), `M-w`/`C-y` (copy/paste), and many more.
- **Visual Fidelity**: Accurate mode-line with line/column counters, file status indicators, and the iconic XEmacs splash screen.
- **Scratch Buffer**: Starts with a fully functional `*scratch*` buffer for Lisp-style (or plain text) note-taking.

---

### Netscape Navigator — The Web, Circa 1994

Relive the experience of browsing the World Wide Web at its dawn with a fully functional replica of the legendary **Netscape Navigator™ 1.0**. This isn't a simple iframe—it's a browser within your browser, complete with its own interface, menus, location bar, and internal pages that capture the spirit of the era.

- **Authentic Navigation**: Back/Forward/Home/Reload buttons, location bar, directory buttons, and a fully featured menu bar (File, Edit, View, Go, Bookmarks, Options, Directory, Help).
- **Classic Pages**: Explore "What's New!", "What's Cool!", "Net Search", "Net Directory", frequently asked questions, and an "About" screen with original typography and logo.
- **Realistic Loading Simulation**: As a page "loads," the progress bar advances, the N logo displays animated shooting stars, and the status text changes just like the old modem days.
- **History & Bookmarks**: Add bookmarks, navigate through your recent history, and see the current page highlighted in the menus.

---
## Iconic Experiences

| 🖥️ The Component        | 🌟 The Feeling                                                                         |
| :---------------------- | :------------------------------------------------------------------------------------- |
| **XEmacs Editor**       | A pixelated splash screen and professional coding buffer that feels "real".            |
| **Terminal Lab**        | Watch commands type themselves out in a mesmerizing 41-lesson tutorial loop.           |
| **File Manager**        | Real context menus, renaming, and folder navigation via the RAM-disk VFS.              |
| **Style Manager**       | 76+ authentic Motif palettes and dithered XPM-style backgrounds.                       |
| **Process Monitor**     | Live telemetry with virtual PIDs and a "kill" interface.                               |
| **Screenshot Tool**     | Capture your personalized setup with a single click in the system tray.                |
| **Netscape Navigator**  | Step back to 1994 with a fully interactive Netscape 1.0.                               |

> 💡 **Pro Tip**: Press `Ctrl + Shift + ?` to see all keyboard shortcuts anytime!

---

## Core System Architecture

### 1. Virtual Filesystem (VFS) & Reactive Disk

- **O(1) Path Resolution**: Instantaneous node retrieval ($O(1)$ complexity) using a flattened pointer map.
- **Event-Driven Hub**: Broadcasts `cde-fs-change` signals to keep the Desktop and FileManager in perfect sync.

### 2. WindowManager & Workspace Orchestration

- **Strict Viewport Clamping**: Windows are locked within `0` and `viewportSize`, preventing them from being lost off-screen.
- **Centering Engine**: Intelligent mobile detection triggers automatic window centering for optimal visibility on small screens.
- **Workspace Pager**: A 4-pane virtual desktop switcher with full state preservation.

### 3. Motif Design Engine

- **XPM Parser**: Reverse-engineered logic to handle legacy color tokens and perceive contrast.
- **Scanline Fidelity**: Accurate CRT-style overlays and pixelated branding for an authentic workstation look.

---

## 📲 PWA: Install it like a real desktop

This CDE recreation is also a **Progressive Web App**:

- **Installable**: modern browsers will offer an “Install app” / “Add to Home screen” prompt when you visit `https://debian.com.mx`.
- **Offline-friendly**: the shell of the desktop (HTML, CSS, icons and backdrops) is cached via a Service Worker so the experience can load even with a flaky or missing connection.

Under the hood:

- A web manifest at `/manifest.webmanifest` defines the app name, theme color and icons.
- A Service Worker at `/sw.js` precaches the main shell (`/`, core CSS and icons) and uses:
  - **Network-first** strategy for navigation requests, falling back to cache if you're offline.
  - **Cache-first** strategy for static assets under `/css`, `/icons`, `/backdrops` and `/palettes`.

### Mobile-First Nostalgia

We've spent months ensuring the retro experience doesn't break on modern hardware. Our **Responsive Engine** ensures that whether you're on a 4K monitor or a smartphone, the CDE layout remains proportional and usable.

- **Interaction Parity**: Double-tap to open, long-press for context menus, and tap-to-focus for the terminal virtual keyboard.

---

## Accessibility First

The CDE Desktop is built with accessibility in mind:

- **Full Keyboard Navigation**: Navigate the entire desktop using Tab, Enter, and Escape
- **Global Keyboard Shortcuts**: Quick access to all applications (Ctrl+Alt+T for Terminal, etc.)
- **High Contrast Mode**: Toggle with Ctrl+Alt+H for enhanced visibility
- **Focus Indicators**: Clear visual feedback for keyboard navigation
- **Skip Links**: Quick navigation for screen reader users

---

## ⌨️ Keyboard Shortcuts

Master the CDE Desktop with these powerful keyboard shortcuts. All shortcuts use `Ctrl + Alt` to avoid conflicts with browser shortcuts.

### Quick Launch Applications

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + Alt + T` | **Terminal** | Open the automated terminal with tutorial |
| `Ctrl + Alt + F` | **File Manager** | Toggle the file manager window |
| `Ctrl + Alt + E` | **XEmacs** | Launch the XEmacs text editor |
| `Ctrl + Alt + N` | **Netscape** | Open Netscape Navigator browser |
| `Ctrl + Alt + S` | **Style Manager** | Access the style customization panel |

### Window Management

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + W` | **Close Window** | Close the currently active window |
| `Ctrl + M` | **Minimize** | Minimize the active window to the panel |
| `Tab` | **Navigate Forward** | Move focus to the next interactive element |
| `Shift + Tab` | **Navigate Backward** | Move focus to the previous element |
| `Enter` | **Activate** | Activate the currently focused element |
| `Escape` | **Cancel/Close** | Close dialogs or unfocus input fields |

### Workspace Navigation

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + Alt + 1` | **Workspace One** | Switch to the first workspace |
| `Ctrl + Alt + 2` | **Workspace Two** | Switch to the second workspace |
| `Ctrl + Alt + 3` | **Workspace Three** | Switch to the third workspace |
| `Ctrl + Alt + 4` | **Workspace Four** | Switch to the fourth workspace |

### Accessibility

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + Alt + H` | **High Contrast** | Toggle high contrast mode for better visibility |
| `Ctrl + Shift + ?` | **Shortcuts Help** | Display this keyboard shortcuts reference |

### XEmacs Editor Shortcuts

When XEmacs is active, these classic Emacs keybindings are available:

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + X, Ctrl + F` | **Open File** | Visit a file from the filesystem |
| `Ctrl + X, Ctrl + S` | **Save** | Save the current buffer |
| `Ctrl + X, Ctrl + W` | **Save As** | Save buffer with a new name |
| `Ctrl + X, Ctrl + C` | **Quit** | Exit XEmacs |
| `Ctrl + K` | **Kill Line** | Delete from cursor to end of line |
| `Ctrl + Y` | **Yank** | Paste the last killed text |
| `Ctrl + W` | **Kill Region** | Cut the selected region |
| `Meta + W` | **Copy Region** | Copy the selected region |
| `Ctrl + X, H` | **Select All** | Select entire buffer |
| `Ctrl + _` | **Undo** | Undo the last change |
| `Ctrl + F` | **Find** | Open the search dialog |
| `Meta + X` | **Execute Command** | Run an extended command |

> **Note**: `Meta` key is typically `Alt` on most keyboards.

### Netscape Navigator Shortcuts

When Netscape is active:

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + L` | **Open Location** | Focus the URL bar |
| `Ctrl + R` | **Reload** | Refresh the current page |
| `Ctrl + D` | **Add Bookmark** | Bookmark the current page |
| `Ctrl + F` | **Find in Page** | Search within the page |
| `Ctrl + P` | **Print** | Print the current page |
| `Alt + ←` | **Back** | Navigate to previous page |
| `Alt + →` | **Forward** | Navigate to next page |

### Pro Tips

- **Hover over icons** in the panel to see tooltips with keyboard hints
- **Press `?` while holding Ctrl+Shift** to see all shortcuts in a modal dialog
- **Use Tab navigation** to discover all interactive elements
- **High contrast mode** persists across sessions for consistent accessibility
- **Workspace shortcuts** allow quick multitasking without mouse interaction

### Keyboard-First Workflow

For maximum productivity, try this keyboard-only workflow:

1. **Launch Terminal**: `Ctrl + Alt + T`
2. **Open File Manager**: `Ctrl + Alt + F`
3. **Navigate with Tab**: Move between files and folders
4. **Open in XEmacs**: `Ctrl + Alt + E`, then `Ctrl + X, Ctrl + F`
5. **Switch Workspaces**: `Ctrl + Alt + 1-4` to organize your work
6. **Close Windows**: `Ctrl + W` when done

---

## 🚀 Step Inside

You don't need to install anything. No clones, no builds, just a window to the past.

Just Visit **[debian.com.mx](https://debian.com.mx)**

---

## 🤝 Contributing

We love nostalgia and we love contributors! If you'd like to help improve this portal, check out our **[CONTRIBUTING.md](CONTRIBUTING.md)**

---

<p align="center">
  <b>Built for performance. Crafted for nostalgia. Engineered for the pixel.</b><br />
  <a href="https://debian.com.mx">Experience the legend at debian.com.mx</a>
</p>
