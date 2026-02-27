# Man Page Viewer

The Man Page Viewer brings authentic Unix manual pages to your CDE desktop. Access comprehensive documentation for essential commands with the same formatting and navigation you'd find on a real Unix system.

## Overview

The Man Viewer provides:

- 28 essential Unix commands with complete documentation
- Authentic man page formatting with sections (NAME, SYNOPSIS, DESCRIPTION, etc.)
- Clickable examples that copy to clipboard
- Related command navigation
- Search functionality
- Keyboard-driven interface

## Opening Man Pages

### From Terminal Lab

```bash
man ls          # Open manual for ls command
man             # Open man page index
```

### From Desktop

- **Application Manager** → Man Pages
- **Panel** → Utilities dropdown → Man Pages

## Available Commands

The viewer includes documentation for these essential commands:

### File Operations

| Command | Description                       |
| ------- | --------------------------------- |
| `ls`    | List directory contents           |
| `cd`    | Change directory                  |
| `pwd`   | Print working directory           |
| `cat`   | Concatenate and display files     |
| `mkdir` | Make directories                  |
| `touch` | Create files or update timestamps |
| `cp`    | Copy files and directories        |
| `mv`    | Move (rename) files               |
| `rm`    | Remove files or directories       |
| `chmod` | Change file permissions           |

### Text Processing

| Command | Description                         |
| ------- | ----------------------------------- |
| `grep`  | Search text patterns                |
| `sed`   | Stream editor for text manipulation |
| `awk`   | Pattern scanning and processing     |
| `head`  | Output first part of files          |
| `tail`  | Output last part of files           |
| `echo`  | Display a line of text              |

### System Information

| Command | Description               |
| ------- | ------------------------- |
| `ps`    | Display process status    |
| `top`   | Display Linux processes   |
| `kill`  | Send signals to processes |
| `df`    | Report disk space usage   |
| `du`    | Estimate file space usage |

### File Search & Archive

| Command | Description      |
| ------- | ---------------- |
| `find`  | Search for files |
| `tar`   | Archive files    |

### Network & Remote

| Command | Description                  |
| ------- | ---------------------------- |
| `wget`  | Network downloader           |
| `curl`  | Transfer data from/to server |
| `ssh`   | Remote login program         |

### Documentation

| Command | Description          |
| ------- | -------------------- |
| `man`   | Display manual pages |

## Navigation

### Keyboard Commands

| Key           | Action                   |
| ------------- | ------------------------ |
| `Q`           | Quit man viewer          |
| `H` or `?`    | Show help                |
| `/`           | Search in current page   |
| `I`           | Show index of all pages  |
| `←`           | Go back to previous page |
| `↑` `↓`       | Scroll up/down           |
| `PgUp` `PgDn` | Page up/down             |

### Mouse Commands

- **Click command names** to view their manual pages
- **Click [number]** to copy example to clipboard
- **Click related commands** to navigate to them

## Features

### Clickable Examples

Each manual page includes practical examples. Click on any example command to copy it to your clipboard:

```
[1] ls -la
    List all files including hidden with details

[2] ls -lh
    List with human-readable file sizes
```

### Related Commands

At the bottom of each page, you'll find related commands. Click any to navigate directly to that manual page.

### Search

Press `/` to search within the current manual page. Matching text will be highlighted.

### History Navigation

The viewer remembers your navigation history. Use `←` to go back to previously viewed pages.

## Manual Page Structure

Each manual page follows the standard Unix format:

- **NAME** - Command name and brief description
- **SYNOPSIS** - Command syntax
- **DESCRIPTION** - Detailed explanation
- **OPTIONS** - Available flags and parameters
- **EXAMPLES** - Practical usage examples
- **SEE ALSO** - Related commands

## Integration with Terminal Lab

The Man Viewer is fully integrated with Terminal Lab. When you type `man <command>` in the terminal, it opens the viewer with that specific page.

```bash
# In Terminal Lab
man grep        # Opens grep manual page
man chmod       # Opens chmod manual page
```

## Mobile Support

The Man Viewer is fully responsive:

- Touch scrolling
- Tap on links to navigate
- Tap on examples to copy
- Optimized text size for mobile screens

## Tips

1. **Start with the index** - Press `I` to see all available commands
2. **Use examples** - Click examples to copy them, then paste in Terminal Lab
3. **Follow related commands** - Explore related commands to learn more
4. **Search when needed** - Use `/` to find specific information quickly
5. **Learn by doing** - Copy examples to Terminal Lab and try them

## Keyboard Shortcuts

| Shortcut       | Action                                     |
| -------------- | ------------------------------------------ |
| None currently | Man Viewer opens via Terminal Lab or menus |

## Authentic Experience

The Man Viewer replicates the authentic Unix man page experience:

- Monospace font (Courier New)
- Black background with green/white text
- Section headers in bold
- Proper formatting and indentation
- Traditional navigation commands

## Future Enhancements

Planned features:

- More manual pages (50+ commands)
- Section navigation (jump to DESCRIPTION, EXAMPLES, etc.)
- Man page search across all pages
- Bookmarks for frequently used pages
- Print/export functionality
- Man page sections 2-8 (system calls, library functions, etc.)

---

**Related Documentation:**

- [Terminal Lab Guide](terminal-lab.md)
- [Keyboard Shortcuts](keyboard-shortcuts.md)
- [Getting Started](getting-started.md)
