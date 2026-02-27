# XEmacs User Guide

XEmacs is a powerful text editor with authentic Emacs keybindings from the 1990s Unix era.

## Opening XEmacs

- Click the XEmacs icon in the Front Panel
- Use keyboard shortcut: `Ctrl+Alt+E`
- Double-click a text file in File Manager

## Basic Usage

### Creating a New File

1. Open XEmacs
2. Start typing immediately
3. Save with `Ctrl+X Ctrl+S`

### Opening a File

- `Ctrl+X Ctrl+F` - Open file dialog
- Type the filename in the minibuffer
- Press Enter to open

### Saving Files

- `Ctrl+X Ctrl+S` - Save current file
- `Ctrl+X Ctrl+W` - Save as (new filename)

## Essential Keyboard Shortcuts

### Navigation

| Shortcut | Action                      |
| -------- | --------------------------- |
| `Ctrl+F` | Move forward one character  |
| `Ctrl+B` | Move backward one character |
| `Ctrl+N` | Move to next line           |
| `Ctrl+P` | Move to previous line       |
| `Ctrl+A` | Move to beginning of line   |
| `Ctrl+E` | Move to end of line         |
| `Alt+F`  | Move forward one word       |
| `Alt+B`  | Move backward one word      |
| `Alt+<`  | Go to beginning of buffer   |
| `Alt+>`  | Go to end of buffer         |

### Editing

| Shortcut        | Action                      |
| --------------- | --------------------------- |
| `Ctrl+D`        | Delete character forward    |
| `Backspace`     | Delete character backward   |
| `Alt+D`         | Delete word forward         |
| `Alt+Backspace` | Delete word backward        |
| `Ctrl+K`        | Kill (cut) to end of line   |
| `Ctrl+Y`        | Yank (paste)                |
| `Ctrl+W`        | Kill region (cut selection) |
| `Alt+W`         | Copy region                 |

### Selection

| Shortcut     | Action                     |
| ------------ | -------------------------- |
| `Ctrl+Space` | Set mark (start selection) |
| `Ctrl+X H`   | Select all                 |

### Search & Replace

| Shortcut | Action          |
| -------- | --------------- |
| `Ctrl+S` | Search forward  |
| `Ctrl+R` | Search backward |
| `Alt+%`  | Query replace   |

### File Operations

| Shortcut        | Action               |
| --------------- | -------------------- |
| `Ctrl+X Ctrl+F` | Find file (open)     |
| `Ctrl+X Ctrl+S` | Save file            |
| `Ctrl+X Ctrl+W` | Write file (save as) |
| `Ctrl+X Ctrl+C` | Exit XEmacs          |

### Undo/Redo

| Shortcut             | Action                 |
| -------------------- | ---------------------- |
| `Ctrl+_` or `Ctrl+/` | Undo                   |
| `Ctrl+G`             | Cancel current command |

## The Minibuffer

The minibuffer is the small input area at the bottom of XEmacs. It's used for:

- Entering commands
- File names
- Search terms
- Responses to prompts

### Using the Minibuffer

1. Press a command that needs input (e.g., `Ctrl+X Ctrl+F`)
2. The minibuffer activates with a prompt
3. Type your input
4. Press `Enter` to confirm or `Ctrl+G` to cancel

## Features

### Syntax Highlighting

XEmacs automatically detects file types and applies syntax highlighting:

- `.js`, `.ts` - JavaScript/TypeScript
- `.html`, `.css` - Web files
- `.md` - Markdown
- `.json` - JSON
- `.sh` - Shell scripts

### Auto-Save

XEmacs automatically saves your work every few seconds to prevent data loss.

### Line Numbers

Line numbers are displayed on the left side of the editor for easy navigation.

### Word Wrap

Long lines automatically wrap to fit the window width.

## Tips & Tricks

### Quick Save and Exit

Press `Ctrl+X Ctrl+S` then `Ctrl+X Ctrl+C` to save and exit quickly.

### Cancel Any Command

If you start a command by mistake, press `Ctrl+G` to cancel it.

### Repeat Commands

Some commands can be repeated by pressing them multiple times:

- `Ctrl+K` twice kills the entire line including newline
- `Ctrl+D` multiple times deletes multiple characters

### Select and Delete

1. Set mark with `Ctrl+Space`
2. Move cursor to select text
3. Press `Ctrl+W` to cut or `Alt+W` to copy

### Search Tips

- Press `Ctrl+S` then type to search
- Press `Ctrl+S` again to find next occurrence
- Press `Enter` to stop searching at current position

## Common Tasks

### Writing Code

1. Open XEmacs
2. Start typing your code
3. Use `Tab` for indentation
4. Save with `Ctrl+X Ctrl+S`

### Editing Configuration Files

1. Open file with `Ctrl+X Ctrl+F`
2. Navigate with arrow keys or Emacs shortcuts
3. Make changes
4. Save with `Ctrl+X Ctrl+S`

### Taking Notes

1. Open XEmacs
2. Type your notes
3. Save as `.txt` or `.md` file
4. Use `Ctrl+K` to delete lines quickly

## Troubleshooting

### I pressed the wrong key combination

Press `Ctrl+G` to cancel any command.

### My changes aren't saving

Make sure you press `Ctrl+X Ctrl+S` to save. Look for "Saved" message in the minibuffer.

### I can't find my file

Use `Ctrl+X Ctrl+F` and type the full path in the minibuffer.

### The cursor is in the minibuffer

Press `Ctrl+G` to return to the main editor area.

## Differences from Modern Editors

XEmacs uses classic Emacs keybindings which differ from modern editors:

| Modern           | XEmacs               |
| ---------------- | -------------------- |
| `Ctrl+C` (copy)  | `Alt+W`              |
| `Ctrl+V` (paste) | `Ctrl+Y`             |
| `Ctrl+X` (cut)   | `Ctrl+W`             |
| `Ctrl+Z` (undo)  | `Ctrl+_` or `Ctrl+/` |
| `Ctrl+F` (find)  | `Ctrl+S`             |
| `Ctrl+S` (save)  | `Ctrl+X Ctrl+S`      |

## Learning Path

### Beginner (Day 1)

- Learn basic navigation: `Ctrl+F`, `Ctrl+B`, `Ctrl+N`, `Ctrl+P`
- Learn to save: `Ctrl+X Ctrl+S`
- Learn to undo: `Ctrl+_`

### Intermediate (Week 1)

- Master word movement: `Alt+F`, `Alt+B`
- Learn selection: `Ctrl+Space`, `Ctrl+W`, `Alt+W`
- Practice search: `Ctrl+S`

### Advanced (Month 1)

- Use all shortcuts without thinking
- Customize your workflow
- Explore advanced features

## Quick Reference Card

Print this for your desk:

```
NAVIGATION          EDITING             FILE
Ctrl+F  Forward     Ctrl+D  Delete      Ctrl+X Ctrl+F  Open
Ctrl+B  Backward    Ctrl+K  Kill line   Ctrl+X Ctrl+S  Save
Ctrl+N  Next line   Ctrl+Y  Yank        Ctrl+X Ctrl+W  Save as
Ctrl+P  Prev line   Ctrl+W  Cut         Ctrl+X Ctrl+C  Exit
Ctrl+A  Line start  Alt+W   Copy
Ctrl+E  Line end    Ctrl+_  Undo
Alt+<   Buffer top  Ctrl+G  Cancel
Alt+>   Buffer end
```

## Further Reading

- [Keyboard Shortcuts](keyboard-shortcuts.md) - All CDE shortcuts
- [Tips & Tricks](tips-and-tricks.md) - Advanced XEmacs usage
