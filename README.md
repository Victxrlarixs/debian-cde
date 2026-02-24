# 📟 CDE Time Capsule: The Nostalgic Portal

![Architecture](https://img.shields.io/badge/Architecture-Modular_System-2a4a6a?style=for-the-badge)
![VFS](<https://img.shields.io/badge/Filesystem-O(1)_Search-ff5a03?style=for-the-badge>)
![Fidelity](https://img.shields.io/badge/Fidelity-High_Retrô-blue?style=for-the-badge)
![Mobile](https://img.shields.io/badge/Mobile-Responsive_Engine-success?style=for-the-badge)

Ever wonder what it felt like to sit in front of a $20,000 Unix workstation in 1996? Welcome to a pixel-perfect recreation of the **Common Desktop Environment (CDE)**—living right inside your modern browser.

> [!NOTE]
> This project is a stateful browser-based recreation of the Common Desktop Environment (CDE), featuring a custom Virtual Filesystem and reactive system logic. Built with passion for the pixel.

---

## ✨ A Journey Through Time

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

### 📱 Mobile-First Nostalgia
We've spent months ensuring the retro experience doesn't break on modern hardware. Our **Responsive Engine** ensures that whether you're on a 4K monitor or a smartphone, the CDE layout remains proportional and usable. 
- **Interaction Parity**: Double-tap to open, long-press for context menus, and tap-to-focus for the terminal virtual keyboard.
- **Zero-Overflow**: Strict window clamping ensures no horizontal scroll, ever.

### 📟 GNU Emacs
A core pillar of the Debian-CDE experience. Much more than a text editor, it's a faithful recreation of the classic environment:
- **Interactive Minibuffer**: No pop-ups for system operations. All commands (`M-x`), file visits (`C-x C-f`), and saves (`C-x C-w`) happen natively in the interactive lower minibuffer.
- **Classic Keybindings**: Support for `C-x`, `C-g` (abort), `C-k` (kill line), `M-w`/`C-y` (copy/paste), and many more.
- **Visual Fidelity**: Accurate mode-line with line/column counters, file status indicators, and the iconic GNU Emacs splash screen.
- **Scratch Buffer**: Starts with a fully functional `*scratch*` buffer for Lisp-style (or plain text) note-taking.

---

## 🎯 Iconic Experiences

| 🖥️ The Component | 🌟 The Feeling |
| :--- | :--- |
| **Emacs Editor** | A pixelated splash screen and professional coding buffer that feels "real". |
| **Terminal Lab** | Watch commands type themselves out in a mesmerizing 41-lesson tutorial loop. |
| **File Manager** | Real context menus, renaming, and folder navigation via the RAM-disk VFS. |
| **Style Manager** | 76+ authentic Motif palettes and dithered XPM-style backgrounds. |
| **Process Monitor** | Live telemetry with virtual PIDs and a "kill" interface. |
| **Screenshot Tool** | Capture your personalized setup with a single click in the system tray. |

---

## 🏗️ Core System Architecture

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

## 🚀 Step Inside

You don't need to install anything. No clones, no builds, just a window to the past.

1.  Visit **[debian.com.mx](https://debian.com.mx)**
2.  Double-click **readme.md** on the desktop.
3.  Lose yourself in the scanlines and dithered gradients.

---

## 🤝 Contributing

We love nostalgia and we love contributors! If you'd like to help improve this portal, check out our **[CONTRIBUTING.md](CONTRIBUTING.md)**

---

<p align="center">
  <b>Built for performance. Crafted for nostalgia. Engineered for the pixel.</b><br />
  <a href="https://debian.com.mx">Experience the legend at debian.com.mx</a>
</p>
