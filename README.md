# CDE Time Capsule

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Astro](https://img.shields.io/badge/Astro-BC52EE?style=flat&logo=astro&logoColor=white)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat)](CONTRIBUTING.md)
![GitHub stars](https://img.shields.io/github/stars/Victxrlarixs/debian-cde?style=flat&logo=github)
![GitHub last commit](https://img.shields.io/github/last-commit/Victxrlarixs/debian-cde?style=flat&logo=github)

A pixel inspired of the Common Desktop Environment (CDE) running entirely in your browser. Experience the Unix workstation era with authentic visuals, behavior, and functionality.

## Highlights

- **76+ Authentic Color Palettes** - Original CDE Motif themes (Platinum, Alpine, Midnight)
- **168 Original Backdrops** - Dithered XPM textures from the 90s
- **XEmacs Text Editor** - Classic Emacs keybindings with minibuffer interaction
- **Netscape Navigator 1.0** - Fully functional 1994 browser replica
- **Virtual Filesystem** - O(1) path resolution with complete CRUD operations
- **4 Virtual Workspaces** - Classic Unix desktop switching
- **Progressive Web App** - Install and use offline
- **Full Accessibility** - 20+ keyboard shortcuts, screen reader support, high contrast mode

## Try It Now

**[debian.com.mx](https://debian.com.mx)** - No installation required

## Documentation

- [Architecture Overview](docs/ARCHITECTURE.md) - System design, VFS, WindowManager, core components
- [Accessibility Guide](docs/ACCESSIBILITY.md) - Keyboard shortcuts, screen reader support, ARIA implementation
- [PWA Implementation](docs/PWA.md) - Service Worker, offline capabilities, caching strategies
- [Style Manager](docs/STYLE-MANAGER.md) - Color palettes, backdrops, fonts, customization
- [Features Documentation](docs/FEATURES.md) - XEmacs, Netscape, Terminal Lab, File Manager
- [Mobile Support](docs/MOBILE.md) - Touch gestures, responsive design, viewport handling
- [Development Guide](docs/DEVELOPMENT.md) - Setup, architecture patterns, testing, deployment

## Key Features

| Component | Description |
|-----------|-------------|
| XEmacs | Text editor with authentic Emacs keybindings (C-x, C-s, M-x) and minibuffer |
| Terminal Lab | 41-lesson interactive tutorial with typing animation |
| File Manager | Context menus, renaming, VFS navigation with tree and icon views |
| Style Manager | Complete theme customization with 76 palettes and 168 backdrops |
| Netscape Navigator | Functional 1994 browser with internal pages and loading animation |
| Process Monitor | Virtual process list with CPU/memory usage and kill functionality |
| Workspace Pager | 4 virtual desktops with keyboard shortcuts (Ctrl+Alt+1-4) |

## Quick Start

```bash
# Clone repository
git clone https://github.com/Victxrlarixs/debian-cde.git
cd debian-cde

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:4321` to see the desktop in action.

## Technology Stack

- **Astro** - Static site generation and component framework
- **TypeScript** - Type-safe JavaScript
- **Vanilla CSS** - No frameworks, pure CSS with custom properties
- **Web Audio API** - System sound synthesis
- **Service Workers** - Offline functionality and caching
- **Pointer Events** - Unified mouse and touch handling

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <b>Built for performance. Crafted for nostalgia. Engineered for the pixel.</b><br />
  <a href="https://debian.com.mx">Experience the legend</a>
</p>
