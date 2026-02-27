# Technical Documentation

Technical documentation for developers contributing to or learning from CDE Time Capsule.

## Architecture

- [Architecture Overview](architecture.md) - System design and component structure
- [Virtual File System](vfs.md) - VFS implementation details
- [Window Manager](window-manager.md) - Window management system
- [Performance](performance.md) - Optimization techniques and metrics

## Core Systems

- [Storage & Cache](storage.md) - IndexedDB, localStorage, and caching strategies
- [Web Workers](workers.md) - Background processing implementation
- [Accessibility](accessibility.md) - A11y implementation details

## Development

- [Contributing Guide](contributing.md) - How to contribute to the project
- [API Reference](../api/README.md) - Complete API documentation

## Quick Links

### For New Contributors

1. Read [Architecture Overview](architecture.md)
2. Check [Contributing Guide](contributing.md)
3. Review [API Reference](../api/README.md)

### For Learning

- [VFS Implementation](vfs.md) - Learn about virtual filesystems
- [Performance Optimizations](performance.md) - Modern web performance techniques
- [Web Workers](workers.md) - Offloading work to background threads

## Technology Stack

- **Framework:** Astro 5.x
- **Language:** TypeScript 5.x
- **Styling:** Vanilla CSS with CSS Custom Properties
- **Storage:** IndexedDB with localStorage fallback
- **Build:** Vite
- **Testing:** (To be implemented)

## Project Structure

```
src/
├── components/          # Astro components
│   ├── common/         # Shared UI components
│   ├── desktop/        # Desktop shell components
│   └── features/       # Application components
├── scripts/
│   ├── core/           # Core systems (VFS, WindowManager, etc.)
│   ├── features/       # Application logic
│   ├── utilities/      # Helper functions and utilities
│   └── workers/        # Web Workers
├── layouts/            # Astro layouts
└── pages/              # Astro pages

public/
├── backdrops/          # XPM backdrop files
├── palettes/           # Color palette files
├── icons/              # UI icons
└── css/                # Global styles

docs/
├── user-guide/         # End-user documentation
├── technical/          # Developer documentation
└── api/                # API reference
```

## Development Workflow

### Setup

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

### Code Style

- TypeScript strict mode enabled
- ESLint configuration (to be added)
- Prettier for formatting

## Performance Targets

- **FCP:** <2s
- **LCP:** <3s
- **FID:** <100ms
- **CLS:** <0.1
- **Bundle Size:** <200KB (initial)

## Browser Support

- Chrome/Edge 80+
- Firefox 74+
- Safari 13.1+

Graceful degradation for older browsers.

## Contributing

See [Contributing Guide](contributing.md) for detailed information on:

- Code style
- Commit conventions
- Pull request process
- Testing requirements

## License

GPL License - see [LICENSE](../../LICENSE) for details.
