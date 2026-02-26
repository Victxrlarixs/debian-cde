# Accessibility Guide

This document details the accessibility features of the CDE Time Capsule, including keyboard shortcuts, screen reader support, and assistive technology compatibility.

## Keyboard Shortcuts

The system provides comprehensive keyboard navigation without requiring a mouse.

### Global Shortcuts

#### Applications

| Shortcut   | Action              | Description                               |
| ---------- | ------------------- | ----------------------------------------- |
| Ctrl+Alt+T | Open Terminal       | Opens the Terminal Lab window             |
| Ctrl+Alt+F | Toggle File Manager | Opens or focuses the File Manager         |
| Ctrl+Alt+E | Open XEmacs         | Opens the XEmacs text editor              |
| Ctrl+Alt+N | Open Netscape       | Opens Netscape Navigator browser          |
| Ctrl+Alt+S | Open Style Manager  | Opens the Style Manager for customization |

#### Window Management

| Shortcut  | Action                   | Description                                |
| --------- | ------------------------ | ------------------------------------------ |
| Ctrl+W    | Close Active Window      | Closes the currently focused window        |
| Ctrl+M    | Minimize Active Window   | Minimizes the currently focused window     |
| Tab       | Focus Next Element       | Cycles through focusable elements          |
| Shift+Tab | Focus Previous Element   | Cycles backward through focusable elements |
| Enter     | Activate Focused Element | Activates buttons, icons, or menu items    |
| Escape    | Unfocus Input            | Removes focus from input fields            |

#### Workspaces

| Shortcut   | Action                | Description                          |
| ---------- | --------------------- | ------------------------------------ |
| Ctrl+Alt+1 | Switch to Workspace 1 | Activates the first virtual desktop  |
| Ctrl+Alt+2 | Switch to Workspace 2 | Activates the second virtual desktop |
| Ctrl+Alt+3 | Switch to Workspace 3 | Activates the third virtual desktop  |
| Ctrl+Alt+4 | Switch to Workspace 4 | Activates the fourth virtual desktop |

#### Accessibility

| Shortcut     | Action               | Description                                  |
| ------------ | -------------------- | -------------------------------------------- |
| Ctrl+Alt+H   | Toggle High Contrast | Enables or disables high contrast mode       |
| Ctrl+Shift+? | Show Shortcuts Help  | Displays a modal with all keyboard shortcuts |

### XEmacs Keybindings

XEmacs follows traditional Emacs keybinding conventions.

#### File Operations

| Shortcut      | Action       | Description                         |
| ------------- | ------------ | ----------------------------------- |
| Ctrl+X Ctrl+F | Open File    | Prompts for file path in minibuffer |
| Ctrl+X Ctrl+S | Save File    | Saves current buffer to disk        |
| Ctrl+X Ctrl+W | Save As      | Prompts for new file path           |
| Ctrl+X Ctrl+C | Close Editor | Closes the XEmacs window            |
| Ctrl+X H      | Select All   | Selects all text in buffer          |

#### Cursor Movement

| Shortcut | Action             | Description                       |
| -------- | ------------------ | --------------------------------- |
| Ctrl+A   | Move to Line Start | Moves cursor to beginning of line |
| Ctrl+E   | Move to Line End   | Moves cursor to end of line       |
| Ctrl+P   | Previous Line      | Moves cursor up one line          |
| Ctrl+N   | Next Line          | Moves cursor down one line        |
| Ctrl+F   | Forward Character  | Moves cursor right one character  |
| Ctrl+B   | Backward Character | Moves cursor left one character   |

#### Editing

| Shortcut | Action           | Description                          |
| -------- | ---------------- | ------------------------------------ |
| Ctrl+D   | Delete Character | Deletes character at cursor          |
| Ctrl+K   | Kill Line        | Deletes from cursor to end of line   |
| Ctrl+\_  | Undo             | Undoes last edit operation           |
| Ctrl+G   | Abort            | Cancels current operation or command |

#### Search and Navigation

| Shortcut | Action          | Description                            |
| -------- | --------------- | -------------------------------------- |
| Ctrl+S   | Find            | Opens find dialog                      |
| Ctrl+L   | Recenter        | Recenters view on cursor               |
| Alt+X    | Execute Command | Opens minibuffer for command execution |

#### Minibuffer Commands

When prompted with `M-x`, the following commands are available:

- `help` - Display help information
- `save-buffer` - Save current file
- `find-file` - Open file
- `kill-emacs` - Close editor
- `eval-buffer` - Evaluate buffer (not implemented)

### Netscape Navigator Shortcuts

| Shortcut | Action        | Description                     |
| -------- | ------------- | ------------------------------- |
| Ctrl+L   | Open Location | Focuses the URL bar             |
| Ctrl+R   | Reload        | Reloads current page            |
| Ctrl+H   | Go Home       | Navigates to home page          |
| Ctrl+F   | Find in Page  | Opens find dialog               |
| Ctrl+P   | Print         | Opens print dialog              |
| Ctrl+S   | Save Page     | Saves current page to disk      |
| Ctrl+U   | View Source   | Opens page source in new window |

## High Contrast Mode

High contrast mode enhances visibility for users with low vision.

### Activation

- Keyboard: `Ctrl+Alt+H`
- Style Manager: Accessibility section

### Visual Changes

When enabled, the system applies:

```css
.high-contrast {
  --bg-color: #000000;
  --fg-color: #ffffff;
  --top-shadow: #ffffff;
  --bottom-shadow: #ffffff;
  --select-color: #ffff00;
  --border-color: #ffffff;
}
```

Additional enhancements:

- Increased border widths (2px → 3px)
- Stronger shadows for depth perception
- Higher contrast text (WCAG AAA compliant)
- Thicker focus indicators

### Persistence

High contrast preference is saved to localStorage:

```typescript
localStorage.setItem('cde_high_contrast', 'true');
```

## Focus Management

### Focus Indicators

All focusable elements display a visible focus indicator:

```css
.cde-icon:focus,
.cde-btn:focus,
.menu-item:focus {
  outline: 2px solid var(--select-color);
  outline-offset: 2px;
}
```

### Focus Order

Tab navigation follows logical reading order:

1. Desktop icons (left to right, top to bottom)
2. Panel buttons (left to right)
3. Window controls (title bar, content, buttons)
4. Menu items (top to bottom)

### Focus Trapping

Modal dialogs trap focus within their boundaries:

```typescript
dialog.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    const focusable = dialog.querySelectorAll('[tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

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

## Keyboard Navigation Patterns

### Desktop Icons

- **Tab**: Focus next icon
- **Shift+Tab**: Focus previous icon
- **Enter**: Open icon (double-click equivalent)
- **Arrow Keys**: Navigate between icons (planned)
- **Context Menu Key**: Open context menu (planned)

### Windows

- **Tab**: Focus next control within window
- **Shift+Tab**: Focus previous control
- **Escape**: Close dialog or cancel operation
- **Enter**: Activate default button

### Menus

- **Tab**: Focus next menu item
- **Shift+Tab**: Focus previous menu item
- **Enter**: Activate menu item
- **Escape**: Close menu

### File Manager

- **Tab**: Switch between tree and content views
- **Arrow Keys**: Navigate tree structure
- **Enter**: Open selected file or folder
- **Backspace**: Navigate to parent directory
- **Delete**: Move selected item to trash

## Touch and Mobile Accessibility

### Touch Targets

All interactive elements meet WCAG 2.1 minimum touch target size (44x44 CSS pixels):

```css
.cde-icon {
  min-width: 44px;
  min-height: 44px;
}

.cde-btn {
  min-width: 44px;
  min-height: 44px;
  padding: 8px 16px;
}
```

### Touch Gestures

- **Single Tap**: Select or focus
- **Double Tap**: Open or activate
- **Long Press**: Context menu (500ms threshold)
- **Drag**: Move window or icon

### Mobile Keyboard

On mobile devices, the system automatically shows the virtual keyboard when focusing text inputs:

```typescript
input.addEventListener('focus', () => {
  input.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
```

## Reduced Motion

The system respects the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This disables:

- Window opening/closing animations
- Typing animations in Terminal Lab
- Loading animations in Netscape
- Smooth scrolling

## Color Contrast

All text meets WCAG 2.1 Level AA contrast requirements:

- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum

High contrast mode meets WCAG 2.1 Level AAA:

- Normal text: 7:1 minimum
- Large text: 4.5:1 minimum

## Assistive Technology Testing

The system has been tested with:

- **NVDA** (Windows): Full compatibility
- **JAWS** (Windows): Full compatibility
- **VoiceOver** (macOS/iOS): Full compatibility
- **TalkBack** (Android): Full compatibility
- **Narrator** (Windows): Partial compatibility

### Known Issues

- Narrator may not announce all window state changes
- Some screen readers may not announce workspace switches
- Terminal Lab typing animation may be verbose with screen readers (can be disabled)

## Accessibility Configuration

### Style Manager Settings

The Style Manager provides accessibility-focused options:

**Keyboard Section:**

- Repeat rate adjustment
- Click sound toggle
- Key preview (planned)

**Mouse Section:**

- Acceleration adjustment
- Double-click speed
- Handedness (left/right)

**Screen Section:**

- Screen saver timeout
- Disable animations (planned)

**Audio Section:**

- Beep volume
- Beep frequency
- Beep duration
- Mute option

## Compliance

The CDE Time Capsule aims for WCAG 2.1 Level AA compliance:

- ✅ 1.1.1 Non-text Content
- ✅ 1.3.1 Info and Relationships
- ✅ 1.4.1 Use of Color
- ✅ 1.4.3 Contrast (Minimum)
- ✅ 2.1.1 Keyboard
- ✅ 2.1.2 No Keyboard Trap
- ✅ 2.4.3 Focus Order
- ✅ 2.4.7 Focus Visible
- ✅ 3.2.1 On Focus
- ✅ 4.1.2 Name, Role, Value

Note: Full WCAG compliance requires manual testing with assistive technologies and cannot be automatically validated.

## Reporting Accessibility Issues

If you encounter accessibility barriers, please report them via:

- GitHub Issues: Tag with `accessibility` label

## Future Enhancements

Planned accessibility improvements:

- Arrow key navigation for desktop icons
- Customizable keyboard shortcuts
