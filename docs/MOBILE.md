# Mobile and Responsive Design

This document details the mobile-specific implementations and responsive design patterns used in the CDE Time Capsule.

## Overview

The CDE Time Capsule is fully responsive and optimized for mobile devices while maintaining the authentic desktop experience. The system adapts to various screen sizes without compromising functionality.

## Responsive Breakpoints

### Breakpoint Definitions

```css
/* Mobile: 0-767px */
@media (max-width: 767px) {
  /* Mobile-specific styles */
}

/* Tablet: 768px-1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Tablet-specific styles */
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  /* Desktop-specific styles */
}
```

### Detection

```typescript
function isMobile(): boolean {
  return window.innerWidth < 768;
}

function isTablet(): boolean {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

function isDesktop(): boolean {
  return window.innerWidth >= 1024;
}
```

## Touch Event Handling

### Pointer Events API

The system uses the Pointer Events API for unified mouse/touch handling.

**Advantages:**
- Single event handler for mouse and touch
- Automatic pointer capture
- Pressure sensitivity support
- Multi-touch support

**Implementation:**

```typescript
element.addEventListener('pointerdown', (e: PointerEvent) => {
  if (!e.isPrimary) return; // Only handle primary pointer
  
  e.preventDefault(); // Prevent default touch behavior
  element.setPointerCapture(e.pointerId);
  
  // Handle interaction
});

element.addEventListener('pointermove', (e: PointerEvent) => {
  // Handle drag
});

element.addEventListener('pointerup', (e: PointerEvent) => {
  element.releasePointerCapture(e.pointerId);
  // Handle release
});
```

### Touch Action

Disable browser touch behaviors on interactive elements:

```css
.titlebar {
  touch-action: none; /* Disable pan/zoom */
}

.cde-icon {
  touch-action: manipulation; /* Disable double-tap zoom */
}

.window {
  touch-action: none;
}
```

## Touch Gestures

### Single Tap

Equivalent to mouse click.

**Implementation:**

```typescript
let tapTimeout: number;
let lastTapTime = 0;

element.addEventListener('pointerdown', (e) => {
  const now = Date.now();
  
  tapTimeout = setTimeout(() => {
    // Single tap confirmed
    handleSingleTap(e);
  }, 300);
  
  lastTapTime = now;
});
```

### Double Tap

Equivalent to double-click.

**Implementation:**

```typescript
element.addEventListener('pointerdown', (e) => {
  const now = Date.now();
  
  if (now - lastTapTime < 300) {
    // Double tap detected
    clearTimeout(tapTimeout);
    handleDoubleTap(e);
  }
  
  lastTapTime = now;
});
```

### Long Press

Equivalent to right-click (context menu).

**Implementation:**

```typescript
let longPressTimeout: number;
let longPressTriggered = false;

element.addEventListener('pointerdown', (e) => {
  longPressTriggered = false;
  
  longPressTimeout = setTimeout(() => {
    longPressTriggered = true;
    handleLongPress(e);
  }, 500); // 500ms threshold
});

element.addEventListener('pointermove', (e) => {
  // Cancel long press if finger moves
  const deltaX = Math.abs(e.clientX - startX);
  const deltaY = Math.abs(e.clientY - startY);
  
  if (deltaX > 10 || deltaY > 10) {
    clearTimeout(longPressTimeout);
  }
});

element.addEventListener('pointerup', (e) => {
  clearTimeout(longPressTimeout);
  
  if (!longPressTriggered) {
    // Handle normal tap
  }
});
```

### Drag

Window and icon dragging with touch.

**Implementation:**

```typescript
function drag(e: PointerEvent, id: string): void {
  if (!e.isPrimary) return;
  
  const el = document.getElementById(id);
  e.preventDefault();
  
  el.setPointerCapture(e.pointerId);
  
  const startX = e.clientX;
  const startY = e.clientY;
  const startLeft = parseFloat(el.style.left || '0');
  const startTop = parseFloat(el.style.top || '0');
  
  function move(e: PointerEvent): void {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    el.style.left = (startLeft + deltaX) + 'px';
    el.style.top = (startTop + deltaY) + 'px';
  }
  
  function stopDrag(e: PointerEvent): void {
    el.releasePointerCapture(e.pointerId);
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', stopDrag);
  }
  
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', stopDrag);
}
```

## Window Management

### Automatic Centering

Windows are automatically centered on mobile devices.

**Implementation:**

```typescript
function centerWindow(win: HTMLElement): void {
  const winWidth = win.offsetWidth;
  const winHeight = win.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const TOP_BAR_HEIGHT = 30;
  
  let left = (viewportWidth - winWidth) / 2;
  let top = (viewportHeight - winHeight) / 2;
  
  // Strict clamping for mobile
  const PANEL_OFFSET = isMobile() ? 65 : 85;
  const maxX = Math.max(0, viewportWidth - winWidth);
  const maxY = Math.max(TOP_BAR_HEIGHT, viewportHeight - winHeight - PANEL_OFFSET);
  
  left = Math.max(0, Math.min(left, maxX));
  top = Math.max(TOP_BAR_HEIGHT, Math.min(top, maxY));
  
  win.style.position = 'absolute';
  win.style.left = `${left}px`;
  win.style.top = `${top}px`;
  win.style.transform = 'none';
}
```

### Viewport Clamping

Prevents windows from extending beyond screen boundaries.

**Implementation:**

```typescript
function clampToViewport(win: HTMLElement): void {
  const rect = win.getBoundingClientRect();
  const TOP_BAR_HEIGHT = 30;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  const minY = TOP_BAR_HEIGHT;
  const minX = 0;
  const maxX = Math.max(0, viewportWidth - rect.width);
  const maxY = Math.max(minY, viewportHeight - rect.height);
  
  let newTop = Math.max(rect.top, minY);
  newTop = Math.min(newTop, maxY);
  
  let newLeft = Math.max(rect.left, minX);
  newLeft = Math.min(newLeft, maxX);
  
  win.style.top = newTop + 'px';
  win.style.left = newLeft + 'px';
}
```

### Window Resizing

Windows automatically resize to fit mobile screens.

**CSS:**

```css
@media (max-width: 767px) {
  .window {
    max-width: 95vw !important;
    max-height: 85vh !important;
    min-width: 280px;
  }
  
  .window.maximized {
    width: 100vw !important;
    height: calc(100vh - 60px) !important;
    top: 30px !important;
    left: 0 !important;
  }
}
```

## Desktop Icons

### Icon Layout

Icons automatically reflow on mobile.

**CSS:**

```css
.desktop-icons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
  padding: 16px;
}

@media (max-width: 767px) {
  .desktop-icons {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 12px;
    padding: 12px;
  }
}
```

### Touch Targets

Icons meet WCAG 2.1 minimum touch target size (44x44px).

**CSS:**

```css
.cde-icon {
  min-width: 44px;
  min-height: 44px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cde-icon img {
  width: 32px;
  height: 32px;
  pointer-events: none;
}
```

## Panel Adaptation

### Mobile Panel

Panel adapts to mobile screen width.

**CSS:**

```css
.panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
}

@media (max-width: 767px) {
  .panel {
    height: 50px;
    padding: 0 4px;
  }
  
  .panel-btn {
    min-width: 40px;
    padding: 4px 8px;
    font-size: 11px;
  }
  
  .panel-btn img {
    width: 20px;
    height: 20px;
  }
}
```

### Workspace Pager

Pager buttons are touch-friendly.

**CSS:**

```css
.pager-workspace {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border-color);
  cursor: pointer;
}

@media (max-width: 767px) {
  .pager-workspace {
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
  }
}
```

## Virtual Keyboard

### Input Focus

Automatically shows virtual keyboard when focusing inputs.

**Implementation:**

```typescript
input.addEventListener('focus', () => {
  // Scroll input into view
  input.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest'
  });
  
  // Adjust viewport if needed
  if (isMobile()) {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 300);
  }
});
```

### Keyboard Avoidance

Adjust layout when virtual keyboard appears.

**CSS:**

```css
@media (max-width: 767px) {
  .window:has(input:focus),
  .window:has(textarea:focus) {
    max-height: 50vh !important;
  }
}
```

**JavaScript:**

```typescript
window.visualViewport?.addEventListener('resize', () => {
  const keyboardHeight = window.innerHeight - window.visualViewport.height;
  
  if (keyboardHeight > 100) {
    // Keyboard is visible
    document.documentElement.style.setProperty(
      '--keyboard-height',
      `${keyboardHeight}px`
    );
  } else {
    // Keyboard is hidden
    document.documentElement.style.setProperty('--keyboard-height', '0px');
  }
});
```

## Orientation Handling

### Orientation Detection

```typescript
function getOrientation(): 'portrait' | 'landscape' {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

window.addEventListener('orientationchange', () => {
  const orientation = getOrientation();
  
  if (orientation === 'landscape') {
    // Adjust layout for landscape
    document.body.classList.add('landscape');
    document.body.classList.remove('portrait');
  } else {
    // Adjust layout for portrait
    document.body.classList.add('portrait');
    document.body.classList.remove('landscape');
  }
  
  // Recenter windows
  document.querySelectorAll('.window').forEach((win) => {
    if (win.style.display !== 'none') {
      centerWindow(win as HTMLElement);
    }
  });
});
```

### Landscape Optimizations

```css
@media (max-width: 767px) and (orientation: landscape) {
  .window {
    max-height: 70vh !important;
  }
  
  .panel {
    height: 40px;
  }
  
  .topbar {
    height: 25px;
  }
}
```

## Performance Optimizations

### Touch Delay Elimination

Remove 300ms tap delay on mobile.

**CSS:**

```css
* {
  touch-action: manipulation;
}
```

**Meta Tag:**

```html
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
```

### Passive Event Listeners

Improve scroll performance.

```typescript
element.addEventListener('touchstart', handler, { passive: true });
element.addEventListener('touchmove', handler, { passive: true });
```

### Hardware Acceleration

Enable GPU acceleration for animations.

```css
.window {
  will-change: transform;
  transform: translateZ(0);
}

.window.dragging {
  will-change: transform, left, top;
}
```

### Debounced Resize

Prevent excessive reflows on resize.

```typescript
let resizeTimeout: number;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  
  resizeTimeout = setTimeout(() => {
    // Recalculate layouts
    document.querySelectorAll('.window').forEach((win) => {
      if (isMobile()) {
        centerWindow(win as HTMLElement);
      } else {
        normalizeWindowPosition(win as HTMLElement);
      }
    });
  }, 250);
});
```

## Accessibility on Mobile

### Screen Reader Support

Mobile screen readers are fully supported.

**VoiceOver (iOS):**
- Swipe right/left to navigate
- Double-tap to activate
- Three-finger swipe to scroll

**TalkBack (Android):**
- Swipe right/left to navigate
- Double-tap to activate
- Two-finger swipe to scroll

### Focus Management

Ensure focus is visible on mobile.

```css
@media (max-width: 767px) {
  *:focus {
    outline: 3px solid var(--select-color);
    outline-offset: 2px;
  }
}
```

### Zoom Prevention

Prevent accidental zoom while allowing accessibility zoom.

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
```

## Testing

### Device Testing

**Physical Devices:**
- iPhone 12/13/14 (iOS 15+)
- Samsung Galaxy S21/S22 (Android 11+)
- iPad Pro (iOS 15+)
- Google Pixel 6/7 (Android 12+)

**Emulators:**
- Chrome DevTools Device Mode
- Safari Responsive Design Mode
- Firefox Responsive Design Mode

### Test Scenarios

**Window Management:**
- [ ] Windows center on open
- [ ] Windows stay within viewport
- [ ] Drag works with touch
- [ ] Maximize/minimize works
- [ ] Windows resize appropriately

**Touch Gestures:**
- [ ] Single tap selects
- [ ] Double tap opens
- [ ] Long press shows context menu
- [ ] Drag moves windows/icons
- [ ] Pinch zoom disabled on UI elements

**Virtual Keyboard:**
- [ ] Keyboard shows on input focus
- [ ] Layout adjusts for keyboard
- [ ] Inputs scroll into view
- [ ] Keyboard dismisses on blur

**Orientation:**
- [ ] Layout adapts to portrait
- [ ] Layout adapts to landscape
- [ ] Windows reposition on rotation
- [ ] No content overflow

**Performance:**
- [ ] Smooth scrolling
- [ ] Responsive touch feedback
- [ ] No lag during drag
- [ ] Animations run at 60fps

## Known Issues

### iOS Safari

**Issue:** Service Worker limitations
**Impact:** Limited offline functionality
**Workaround:** Use Chrome or Edge on iOS

**Issue:** 100vh includes address bar
**Impact:** Content may be hidden behind address bar
**Workaround:** Use `window.innerHeight` instead of `100vh`

```typescript
function setViewportHeight(): void {
  document.documentElement.style.setProperty(
    '--viewport-height',
    `${window.innerHeight}px`
  );
}

window.addEventListener('resize', setViewportHeight);
setViewportHeight();
```

```css
.window {
  max-height: var(--viewport-height);
}
```

### Android Chrome

**Issue:** Address bar auto-hide affects layout
**Impact:** Content jumps when address bar hides
**Workaround:** Use fixed positioning with viewport units

**Issue:** Touch delay on some devices
**Impact:** Slight lag on tap
**Workaround:** Use `touch-action: manipulation`

### Small Screens (<360px)

**Issue:** Windows may be too large
**Impact:** Difficult to interact with UI
**Workaround:** Minimum width enforcement

```css
@media (max-width: 359px) {
  .window {
    min-width: 280px;
    max-width: 100vw;
    font-size: 10px;
  }
}
```

## Future Enhancements

**Planned Features:**
- Swipe gestures for workspace switching
