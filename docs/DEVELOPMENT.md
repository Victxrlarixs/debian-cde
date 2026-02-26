# Development Guide

This document provides technical guidance for developers contributing to the CDE Time Capsule project.

## Prerequisites

**Required:**
- Node.js v20 or higher
- npm v10 or higher
- Git

**Recommended:**
- VS Code or similar IDE
- Chrome/Firefox DevTools
- Basic understanding of TypeScript, Astro, and CSS

## Getting Started

### Clone Repository

```bash
git clone https://github.com/Victxrlarixs/debian-cde.git
cd debian-cde
```

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Server runs at `http://localhost:4321`

### Build for Production

```bash
npm run build
```

Output in `./dist` directory

### Preview Production Build

```bash
npm run preview
```

### Format Code

```bash
npm run format
```

## Project Structure

```
debian-cde/
├── .astro/                 # Astro build cache
├── .github/                # GitHub Actions workflows
├── dist/                   # Production build output
├── docs/                   # Documentation
├── node_modules/           # Dependencies
├── public/                 # Static assets
│   ├── backdrops/          # XPM backdrop files (168)
│   ├── css/                # Stylesheets
│   │   ├── base/           # Reset, variables, utilities
│   │   ├── components/     # Component-specific styles
│   │   ├── desktop/        # Desktop and boot screen
│   │   └── responsive/     # Media queries
│   ├── icons/              # System icons (60)
│   ├── images/             # Application images
│   ├── palettes/           # Color palette files (76)
│   ├── manifest.webmanifest # PWA manifest
│   └── sw.js               # Service Worker
├── src/                    # Source code
│   ├── components/         # Astro components
│   │   ├── common/         # Shared components
│   │   ├── desktop/        # Desktop UI components
│   │   └── features/       # Application components
│   ├── data/               # JSON/MD data files
│   ├── layouts/            # Page layouts
│   ├── pages/              # Astro pages
│   └── scripts/            # TypeScript modules
│       ├── boot/           # Initialization
│       ├── core/           # Core systems
│       ├── features/       # Feature modules
│       ├── ui/             # UI utilities
│       └── utilities/      # Helper functions
├── .gitignore              # Git ignore rules
├── .prettierrc.cjs         # Prettier configuration
├── astro.config.mjs        # Astro configuration
├── CONTRIBUTING.md         # Contribution guidelines
├── LICENSE                 # MIT License
├── package.json            # Dependencies and scripts
├── package-lock.json       # Dependency lock file
├── README.md               # Project overview
└── tsconfig.json           # TypeScript configuration
```

## Architecture Patterns

### Component Structure

**Astro Components:**

```astro
---
// Component logic (runs at build time)
interface Props {
  title: string;
  id: string;
}

const { title, id } = Astro.props;
---

<!-- Component template -->
<div class="window" id={id}>
  <div class="titlebar">
    <span class="titlebar-text">{title}</span>
  </div>
  <div class="window-body">
    <slot />
  </div>
</div>

<style>
  /* Scoped styles */
  .window {
    /* ... */
  }
</style>

<script>
  // Client-side JavaScript
  console.log('Window initialized');
</script>
```

### TypeScript Modules

**Module Pattern:**

```typescript
// src/scripts/features/example.ts

import { logger } from '../utilities/logger';
import { CONFIG } from '../core/config';

/**
 * Example feature module
 */
class ExampleManager {
  private state: any = {};
  
  constructor() {
    this.init();
  }
  
  private init(): void {
    logger.log('[Example] Initializing...');
    // Setup code
  }
  
  public doSomething(): void {
    // Public API
  }
}

// Global exposure
declare global {
  interface Window {
    ExampleManager: ExampleManager;
  }
}

const instance = new ExampleManager();
if (typeof window !== 'undefined') {
  window.ExampleManager = instance;
}

export { ExampleManager };
```

### CSS Organization

**File Structure:**

```
public/css/
├── main.css                # Main entry point
├── responsive.css          # Media queries
├── base/
│   ├── reset.css           # CSS reset
│   ├── variables.css       # CSS custom properties
│   ├── utilities.css       # Utility classes
│   ├── accessibility.css   # A11y styles
│   ├── cursors.css         # Custom cursors
│   └── scrollbar.css       # Scrollbar styling
└── components/
    ├── windows.css         # Window system
    ├── panel.css           # Bottom panel
    ├── topbar.css          # Top bar
    ├── modals.css          # Modal dialogs
    ├── menus.css           # Context menus
    ├── emacs.css           # XEmacs editor
    ├── netscape.css        # Netscape Navigator
    ├── terminal.css        # Terminal
    ├── file-manager.css    # File Manager
    └── style-manager.css   # Style Manager
```

**CSS Conventions:**

```css
/* Use CSS custom properties for theming */
:root {
  --bg-color: #ae9e8e;
  --fg-color: #000000;
  --border-color: #000000;
}

/* BEM-like naming for components */
.component-name {
  /* Component styles */
}

.component-name__element {
  /* Element styles */
}

.component-name--modifier {
  /* Modifier styles */
}

/* Utility classes with cde- prefix */
.cde-btn {
  /* Button styles */
}

.cde-icon {
  /* Icon styles */
}
```

## Coding Standards

### TypeScript

**Type Safety:**

```typescript
// Good: Explicit types
interface User {
  name: string;
  id: number;
}

function getUser(id: number): User {
  // ...
}

// Bad: Implicit any
function getUser(id) {
  // ...
}
```

**Null Safety:**

```typescript
// Good: Null checks
const element = document.getElementById('myId');
if (element) {
  element.textContent = 'Hello';
}

// Bad: Assuming non-null
document.getElementById('myId').textContent = 'Hello';
```

**Async/Await:**

```typescript
// Good: Async/await
async function loadData(): Promise<Data> {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    logger.error('Failed to load data', error);
    throw error;
  }
}

// Bad: Promise chains
function loadData() {
  return fetch('/api/data')
    .then(r => r.json())
    .catch(e => console.error(e));
}
```

### Naming Conventions

**Variables:**

```typescript
// camelCase for variables and functions
const userName = 'John';
function getUserName() { }

// PascalCase for classes and interfaces
class WindowManager { }
interface VFSNode { }

// UPPER_SNAKE_CASE for constants
const MAX_RETRIES = 3;
const API_ENDPOINT = '/api';
```

**Files:**

```
// kebab-case for files
window-manager.ts
file-manager.ts
style-manager.ts

// PascalCase for components
WindowControls.astro
DesktopIcons.astro
```

### Comments

**JSDoc for Public APIs:**

```typescript
/**
 * Registers a window for management.
 * 
 * @param win - The window element to register
 * @returns True if registration succeeded
 * 
 * @example
 * ```typescript
 * const win = document.getElementById('myWindow');
 * WindowManager.registerWindow(win);
 * ```
 */
public registerWindow(win: HTMLElement): boolean {
  // Implementation
}
```

**Inline Comments:**

```typescript
// Good: Explain why, not what
// Delay required for animation to complete
setTimeout(callback, 300);

// Bad: Obvious comment
// Set x to 5
const x = 5;
```

## Testing

### Manual Testing

**Checklist:**

- [ ] Run `npm run build` successfully
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] All features work as expected
- [ ] Responsive design works on mobile
- [ ] Keyboard shortcuts work
- [ ] Screen reader compatibility
- [ ] PWA installation works

### Browser Testing

**Required Browsers:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Test Scenarios:**

```typescript
// Window Management
- Open window
- Close window
- Minimize window
- Maximize window
- Drag window
- Focus window
- Switch workspace

// File Operations
- Create file
- Create folder
- Rename item
- Delete item
- Open file in XEmacs
- Save file

// Style Manager
- Apply color palette
- Change font
- Adjust mouse settings
- Change backdrop
- Toggle high contrast
```

### Performance Testing

**Lighthouse Audit:**

```bash
npm install -g lighthouse
lighthouse http://localhost:4321 --view
```

**Target Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+
- PWA: 100

**Chrome DevTools:**

1. Open DevTools (F12)
2. Performance tab
3. Record interaction
4. Analyze:
   - Frame rate (target: 60fps)
   - Long tasks (target: <50ms)
   - Memory usage (target: <50MB)

## Debugging

### Console Logging

**Logger Utility:**

```typescript
import { logger } from '../utilities/logger';

logger.log('[Component] Message');
logger.warn('[Component] Warning');
logger.error('[Component] Error', error);
```

**Conditional Logging:**

```typescript
const DEBUG = import.meta.env.DEV;

if (DEBUG) {
  console.log('Debug info');
}
```

### Chrome DevTools

**Breakpoints:**

1. Open Sources tab
2. Find TypeScript file
3. Click line number to set breakpoint
4. Trigger code execution
5. Inspect variables

**Network Tab:**

- Monitor Service Worker requests
- Check cache hits/misses
- Verify asset loading

**Application Tab:**

- Inspect localStorage
- View Service Worker status
- Check cache storage
- Test offline mode

### Common Issues

**Service Worker Not Updating:**

```javascript
// Unregister Service Worker
navigator.serviceWorker.getRegistrations().then((registrations) => {
  registrations.forEach((registration) => {
    registration.unregister();
  });
});

// Clear caches
caches.keys().then((names) => {
  names.forEach((name) => {
    caches.delete(name);
  });
});

// Hard refresh
// Ctrl+Shift+R (Windows/Linux)
// Cmd+Shift+R (macOS)
```

**TypeScript Errors:**

```bash
# Check for errors
npx tsc --noEmit

# Clear Astro cache
rm -rf .astro
npm run dev
```

**Build Failures:**

```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Clear dist
rm -rf dist
npm run build
```

## Git Workflow

### Branch Strategy

**Main Branches:**
- `main`: Production-ready code
- `develop`: Development branch

**Feature Branches:**
- `feature/feature-name`: New features
- `fix/bug-name`: Bug fixes
- `docs/doc-name`: Documentation updates

### Commit Messages

**Format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Testing
- `chore`: Maintenance

**Examples:**

```
feat(window-manager): add workspace switching

Implement 4-workspace virtual desktop system with keyboard shortcuts.

Closes #123
```

```
fix(vfs): resolve path resolution bug

Fix issue where relative paths with .. were not resolved correctly.

Fixes #456
```

### Pull Request Process

1. Create feature branch from `develop`
2. Make changes and commit
3. Push branch to GitHub
4. Create Pull Request to `develop`
5. Wait for review and CI checks
6. Address feedback
7. Merge when approved

**PR Template:**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tested locally
- [ ] Tested on mobile
- [ ] Tested in multiple browsers
- [ ] No console errors

## Screenshots
(if applicable)

## Related Issues
Closes #123
```

## Continuous Integration

### GitHub Actions

**Build Workflow:**

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Pre-commit Hooks

**Husky Setup:**

```bash
npm install --save-dev husky
npx husky install
```

**Pre-commit Hook:**

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run format
npm run build
```

## Performance Optimization

### Bundle Size

**Analyze Bundle:**

```bash
npm run build
npx vite-bundle-visualizer
```

**Optimization Techniques:**

- Code splitting
- Tree shaking
- Minification
- Compression (Brotli/Gzip)
- Lazy loading

### Runtime Performance

**Optimization Checklist:**

- [ ] Use `will-change` for animated elements
- [ ] Debounce resize/scroll handlers
- [ ] Use `requestAnimationFrame` for animations
- [ ] Minimize DOM manipulation
- [ ] Use event delegation
- [ ] Cache DOM queries
- [ ] Avoid layout thrashing

**Example:**

```typescript
// Bad: Layout thrashing
elements.forEach(el => {
  const height = el.offsetHeight; // Read
  el.style.height = height + 10 + 'px'; // Write
});

// Good: Batch reads and writes
const heights = elements.map(el => el.offsetHeight); // Read
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px'; // Write
});
```

## Accessibility

### ARIA Attributes

**Required Attributes:**

```html
<!-- Buttons -->
<button aria-label="Close window">×</button>

<!-- Icons -->
<div class="cde-icon" role="button" tabindex="0" aria-label="File Manager">
  <img src="/icons/filemanager.png" alt="">
</div>

<!-- Windows -->
<div class="window" role="dialog" aria-label="XEmacs">
  <!-- Content -->
</div>

<!-- Live regions -->
<div role="status" aria-live="polite" aria-atomic="true">
  File saved successfully
</div>
```

### Keyboard Navigation

**Focus Management:**

```typescript
// Trap focus in modal
modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    const focusable = modal.querySelectorAll('[tabindex]:not([tabindex="-1"])');
    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;
    
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
```

### Testing with Screen Readers

**NVDA (Windows):**

```
1. Download from https://www.nvaccess.org/
2. Install and launch
3. Navigate with Tab/Shift+Tab
4. Activate with Enter/Space
5. Listen to announcements
```

**VoiceOver (macOS):**

```
1. System Preferences → Accessibility → VoiceOver
2. Enable VoiceOver (Cmd+F5)
3. Navigate with VO+Arrow keys
4. Activate with VO+Space
5. Listen to announcements
```

## Documentation

### Code Documentation

**JSDoc Comments:**

```typescript
/**
 * Calculates the distance between two points.
 * 
 * @param x1 - X coordinate of first point
 * @param y1 - Y coordinate of first point
 * @param x2 - X coordinate of second point
 * @param y2 - Y coordinate of second point
 * @returns The Euclidean distance between the points
 * 
 * @example
 * ```typescript
 * const distance = calculateDistance(0, 0, 3, 4);
 * console.log(distance); // 5
 * ```
 */
function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
```

### README Updates

When adding new features, update:

- Feature list
- Screenshots (if applicable)
- Usage instructions
- Configuration options

### Documentation Files

Keep documentation up to date:

- `docs/ARCHITECTURE.md`: System design
- `docs/ACCESSIBILITY.md`: A11y features
- `docs/PWA.md`: PWA implementation
- `docs/STYLE-MANAGER.md`: Customization
- `docs/FEATURES.md`: Feature details
- `docs/MOBILE.md`: Mobile support
- `docs/DEVELOPMENT.md`: This file

## Release Process

### Version Bumping

```bash
# Patch release (1.0.0 → 1.0.1)
npm version patch

# Minor release (1.0.0 → 1.1.0)
npm version minor

# Major release (1.0.0 → 2.0.0)
npm version major
```

### Changelog

Update `CHANGELOG.md`:

```markdown
## [1.1.0] 

### Added
- Workspace switching with Ctrl+Alt+1-4
- High contrast mode
- Mobile touch gestures

### Fixed
- Window positioning on mobile
- VFS path resolution bug

### Changed
- Improved performance of Terminal Lab
- Updated color palettes
```

### Deployment

```bash
# Build production
npm run build

# Test production build
npm run preview

# Deploy (automatic via GitHub Actions)
git push origin main
```

## Resources

### Documentation
- [Astro Docs](https://docs.astro.build/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Tools
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Can I Use](https://caniuse.com/)
- [TypeScript Playground](https://www.typescriptlang.org/play)

### Community
- [GitHub Discussions](https://github.com/Victxrlarixs/debian-cde/discussions)
- [GitHub Issues](https://github.com/Victxrlarixs/debian-cde/issues)
- [Contributing Guide](../CONTRIBUTING.md)
