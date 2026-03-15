# Vim - Vi IMproved

Vi IMproved (Vim) is a highly configurable text editor built to enable efficient text editing. It is an improved version of the vi editor distributed with most UNIX systems.

## Opening Vim

- **Desktop Icon**: Double-click the "Vim" icon on the desktop
- **Application Manager**: Click the Debian menu → Development → Vim
- **CDE Panel**: Click the Vim button in the main panel
- **Keyboard Shortcut**: Press `Ctrl+Alt+V`

## Vim Modes

Vim operates in different modes:

### Normal Mode (Default)

- Navigate and manipulate text
- Press `ESC` to return to Normal mode from any other mode
- Block cursor indicates Normal mode

### Insert Mode

- Type and edit text like a regular editor
- Enter with: `i`, `I`, `a`, `A`, `o`, `O`
- Exit with: `ESC`
- Line cursor indicates Insert mode

### Visual Mode

- Select text character by character
- Enter with: `v`
- Exit with: `ESC`

### Visual Line Mode

- Select text line by line
- Enter with: `V` (Shift+V)
- Exit with: `ESC`

### Command Mode

- Execute commands
- Enter with: `:` or `/`
- Exit with: `ESC`

## Basic Commands

### Entering Insert Mode

- `i` - Insert before cursor
- `I` - Insert at beginning of line
- `a` - Append after cursor
- `A` - Append at end of line
- `o` - Open new line below
- `O` - Open new line above

### Movement (Normal Mode)

#### Basic Movement

- `h` - Move left
- `j` - Move down
- `k` - Move up
- `l` - Move right

#### Line Movement

- `0` - Move to start of line
- `$` - Move to end of line

#### Word Movement

- `w` - Move to next word
- `b` - Move to previous word
- `e` - Move to end of current word

#### File Movement

- `gg` - Move to start of file
- `G` - Move to end of file

### Editing (Normal Mode)

#### Character Operations

- `x` - Delete character under cursor
- `r` + char - Replace character under cursor

#### Line Operations

- `dd` - Delete current line
- `yy` - Yank (copy) current line
- `D` - Delete to end of line

#### Word Operations

- `cw` - Change word (delete word and enter insert mode)

#### Paste Operations

- `p` - Paste after cursor/line
- `P` - Paste before cursor/line

#### Undo/Redo

- `u` - Undo last change
- `.` - Repeat last command

### Visual Mode Operations

#### Visual Selection (v)

- `v` - Enter character-wise visual mode
- `y` - Yank (copy) selection
- `d` or `x` - Delete selection

#### Visual Line Selection (V)

- `V` - Enter line-wise visual mode
- `j`/`k` - Extend selection up/down by lines
- `y` - Yank selected lines
- `d` or `x` - Delete selected lines

### Search and Navigation

- `/pattern` - Search forward for pattern
- `n` - Go to next search result
- `N` - Go to previous search result

### File Operations (Command Mode)

- `:w` - Save file
- `:w filename` - Save as filename
- `:q` - Quit
- `:wq` or `:x` - Save and quit
- `:q!` - Quit without saving
- `:e filename` - Open/create file
- `:e!` - Reload current file (discard changes)
- `:enew` - Create new empty buffer
- `:help` - Show help
- `:version` - Show version information

### Settings (Command Mode)

- `:set number` - Show line numbers
- `:set nonumber` - Hide line numbers

## Working with Files

### Creating a New File

1. Open Vim (from desktop icon, panel, or AppManager)
2. Press `:` to enter command mode
3. Type `e myfile.txt` and press Enter
4. Press `i` to enter Insert mode
5. Type your content
6. Press `ESC` to return to Normal mode
7. Type `:w` and press Enter to save
8. File is saved to `/home/victxrlarixs/Desktop/myfile.txt`

### Editing an Existing File

**Method 1 - From Vim:**

1. Open Vim
2. Press `:` to enter command mode
3. Type `e filename.txt` and press Enter
4. Edit with `i` (Insert mode)
5. Save with `:w`

**Method 2 - From File Manager:**

1. Open File Manager
2. Navigate to your file
3. Double-click a `.txt` or `.md` file
4. Vim opens automatically with the file loaded
5. Edit and save with `:w`

### Save and Exit Workflow

- `:w` - Save current file
- `:wq` - Save and quit
- `:x` - Save and quit (same as :wq)
- `:q` - Quit (only if no changes)
- `:q!` - Quit without saving changes

### File Paths

All files are saved in the Virtual File System (VFS):

- Default location: `/home/victxrlarixs/Desktop/`
- Files persist in browser localStorage
- Use full paths like `/home/victxrlarixs/Desktop/notes.txt`
- Or relative names like `notes.txt` (saves to Desktop)

## Advanced Features

### Directory Explorer

- `:E` or `:Explore` - Open directory explorer
- `:e .` - Explore current directory
- Navigate with arrow keys, press Enter to open files/folders

### Search and Replace

- `/pattern` - Search forward
- `?pattern` - Search backward (not implemented)
- `n` - Next search result
- `N` - Previous search result

### Copy and Paste Workflow

1. **Copy a line**: Position cursor on line, press `yy`
2. **Copy selection**: Enter visual mode with `v`, select text, press `y`
3. **Paste after**: Press `p`
4. **Paste before**: Press `P`

### Command Repetition

- `.` - Repeat the last editing command
- Works with: `dd`, `yy`, `cw`, `x`, `r`, etc.

## Tips and Tricks

1. **Always know your mode**: Check the bottom status line for mode indicator
2. **ESC is your friend**: Press ESC to return to Normal mode
3. **Practice navigation**: Use `hjkl` instead of arrow keys for efficiency
4. **Word navigation**: Use `w`, `b`, `e` for faster movement
5. **Save often**: Use `:w` frequently to save your work
6. **Visual modes**: Use `v` for character selection, `V` for line selection
7. **Search efficiently**: Use `/` to find text quickly, then `n`/`N` to navigate results
8. **Command repetition**: Use `.` to repeat your last action
9. **Line numbers**: Use `:set number` to show line numbers for easier navigation
10. **Read-only buffers**: Help files and version info cannot be edited

## Common Workflows

### Quick Edit Workflow

```
1. Open Vim (Ctrl+Alt+V or click panel button)
2. :e myfile.txt
3. i (enter insert mode)
4. [type your content]
5. ESC (back to normal mode)
6. :wq (save and quit)
```

### Copy/Paste Between Lines

```
1. Position cursor on line to copy
2. yy (yank line)
3. Move to destination with j/k
4. p (paste after current line)
```

### Search and Edit

```
1. /searchterm (find text)
2. n (go to next occurrence)
3. cw (change word)
4. [type replacement]
5. ESC (back to normal mode)
6. n (find next)
7. . (repeat change)
```

### Visual Selection Edit

```
1. v (enter visual mode)
2. hjkl or arrow keys (select text)
3. d (delete) or y (copy)
4. Move cursor to new location
5. p (paste)
```

## Keyboard Reference

### Normal Mode Commands

| Key       | Action                             |
| --------- | ---------------------------------- |
| `h j k l` | Move left, down, up, right         |
| `w b e`   | Next word, previous word, end word |
| `0 $`     | Start of line, end of line         |
| `gg G`    | Start of file, end of file         |
| `i a o`   | Insert before, after, new line     |
| `I A O`   | Insert line start, end, line above |
| `x`       | Delete character                   |
| `dd yy`   | Delete line, yank line             |
| `p P`     | Paste after, before                |
| `r`       | Replace character                  |
| `cw`      | Change word                        |
| `u`       | Undo                               |
| `.`       | Repeat command                     |
| `v V`     | Visual mode, Visual line mode      |
| `/`       | Search                             |
| `n N`     | Next, previous search result       |
| `:`       | Command mode                       |

### Command Mode

| Command       | Action              |
| ------------- | ------------------- |
| `:w`          | Save                |
| `:q`          | Quit                |
| `:wq`         | Save and quit       |
| `:q!`         | Quit without saving |
| `:e file`     | Edit file           |
| `:help`       | Show help           |
| `:version`    | Show version        |
| `:set number` | Show line numbers   |
| `:E`          | File explorer       |

## Authentic 90s Experience

This Vim implementation recreates the authentic Vi IMproved 5.3 experience from 1998:

- Classic green-on-black terminal colors with authentic phosphor look
- Modal editing with Normal, Insert, Visual, Visual Line, and Command modes
- Block cursor in Normal mode, line cursor in Insert mode
- Traditional status line showing mode, file info, and cursor position
- Command line at the bottom for ex commands and search
- Authentic keyboard-driven workflow with all essential commands
- Original splash screen and help system
- Classic error messages and version information
- Directory explorer with netrw-style listing

## Version

Vi IMproved - Version 5.3 (1998 Oct 31)

---

_For more information about Vim, visit the official Vim documentation or type `:help` in Vim._
