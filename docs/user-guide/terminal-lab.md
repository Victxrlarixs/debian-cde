# Terminal Lab User Guide

Terminal Lab is an interactive learning environment for Unix/Linux commands. Complete 22 lessons to master the command line!

## What is Terminal Lab?

Terminal Lab teaches you Unix/Linux commands through hands-on practice. Each lesson:

- Explains a command
- Shows examples
- Lets you practice
- Provides instant feedback

## Opening Terminal Lab

- Click the Terminal Lab icon in the Front Panel
- Use keyboard shortcut: `Ctrl+Alt+T`
- Open from App Manager

## Interface Overview

### Main Components

1. **Terminal Window** - Where you type commands
2. **Lesson Progress** - Shows current lesson and progress
3. **Hint Banner** - Instructions and tips
4. **Command Prompt** - Shows `$` when ready for input

### The Prompt

```
victxrlarixs@debian:~$ _
```

The `$` symbol means the terminal is ready for your command. The cursor (`_`) shows where you'll type.

## Two Modes

### Tutorial Mode (Default)

- Follow guided lessons step by step
- Type the exact command shown
- Get instant feedback
- Progress through 22 lessons
- Tab autocompletes the current lesson command

### Free Mode

- Practice any Unix/Linux command
- Full bash-like environment
- Use pipes, wildcards, aliases
- Tab autocompletes all available commands
- Type `tutorial` to return to guided mode

## How Lessons Work

### Lesson Structure

Each lesson follows this pattern:

1. **Command Display** - See what command to type
2. **Practice** - Type the command
3. **Verification** - Instant feedback
4. **Advance** - Move to next step automatically

### Typing Commands

1. Read the command shown
2. Type it (or press Tab to autocomplete)
3. Press `Enter` to execute
4. See the result
5. Move to the next step

### Getting Help

- **hint** - Shows the expected command
- **skip** - Skip current step
- **free** - Switch to free exploration mode
- **tutorial** - Return to guided mode
- **clear** - Clear screen (free mode only)

## Lesson Categories

### 22 Unix/Linux Pure Lessons

1. **Navigation Basics** - pwd, ls, whoami, date
2. **Working with Directories** - cd, mkdir, touch
3. **File Operations** - echo, cat, cp, mv, rm
4. **Permissions & Search** - chmod, find, grep
5. **Processes & Resources** - ps, top, free, df
6. **Package Management & Networking** - apt, ping, curl
7. **Shell Tricks & History** - history, alias, clear
8. **System Information** - uname, hostname, uptime, who, last
9. **User Management (Part 1)** - useradd, passwd, groupadd, usermod, id
10. **User Management (Part 2)** - cat, grep, sudo, su
11. **Getting Help** - man, whereis, locate
12. **Archiving Files** - tar, gzip, zip, unzip
13. **Process Signals** - systemctl, journalctl, crontab
14. **Network Interfaces** - ps, kill, pkill, top
15. **DNS & Remote Files** - ifconfig, ip, ss, traceroute
16. **Disk & Filesystem** - nslookup, dig, wget
17. **Text Processing (Part 1)** - df, fdisk, mount, du
18. **Text Processing (Part 2)** - head, tail, wc, sort, cut
19. **Environment Variables** - sed, awk, tr
20. **Symbolic Links & File Info** - env, export, echo, set
21. **Advanced Permissions (ACL)** - ln, ls, readlink, file
22. **Utilities & Job Control** - chown, setfacl, getfacl

## Essential Commands

### Navigation

```bash
# Show current directory
$ pwd

# List files
$ ls

# Change directory
$ cd Documents

# Go to home directory
$ cd ~

# Go up one level
$ cd ..
```

### File Management

```bash
# Create file
$ touch myfile.txt

# Create directory
$ mkdir myfolder

# Copy file
$ cp file.txt backup.txt

# Move/rename file
$ mv old.txt new.txt

# Delete file
$ rm file.txt
```

### Viewing Files

```bash
# View entire file
$ cat file.txt

# View first 10 lines
$ head file.txt

# View last 10 lines
$ tail file.txt
```

### Searching

```bash
# Find files by name
$ find . -name "*.txt"

# Search in files
$ grep "hello" file.txt

# Count lines in file
$ wc -l file.txt
```

## Keyboard Shortcuts

### Terminal Control

| Shortcut | Action                 |
| -------- | ---------------------- |
| `Ctrl+C` | Cancel current command |
| `Ctrl+L` | Clear screen           |
| `Ctrl+U` | Clear line             |
| `Ctrl+A` | Move to line start     |
| `Ctrl+E` | Move to line end       |
| `Tab`    | Auto-complete          |
| `↑`      | Previous command       |
| `↓`      | Next command           |

## Bash-like Features (Free Mode)

### Aliases

```bash
# Create alias
$ alias ll='ls -la'

# Use alias
$ ll

# List all aliases
$ alias

# Remove alias
$ unalias ll
```

### Environment Variables

```bash
# Use predefined variables
$ echo $HOME
/home/victxrlarixs

$ echo $USER
victxrlarixs

# Set new variable
$ export MY_VAR='Hello'

# Use variable
$ echo $MY_VAR
Hello

# List all variables
$ env
```

### Pipes

```bash
# Combine commands
$ ls | grep txt

# Chain multiple commands
$ cat file.txt | grep error | wc -l
```

### Wildcards

```bash
# Match all .txt files
$ ls *.txt

# Match files starting with test
$ rm test*
```

### Text Processing Commands

```bash
# Search pattern
$ grep "error" log.txt

# First 5 lines
$ head -n 5 file.txt

# Last 10 lines
$ tail -n 10 file.txt

# Count lines, words, chars
$ wc file.txt
```

## Tab Completion

### Tutorial Mode

- Press `Tab` to autocomplete the current lesson command
- Completes the entire command for you

### Free Mode

- Press `Tab` after typing part of a command name
- Shows all matching commands if multiple options
- Press `Tab` after command to autocomplete file/directory names

## Tips for Success

### Read Carefully

Each lesson shows exactly what to type. Use Tab to autocomplete!

### Type Exactly

Commands are case-sensitive. `ls` works, `LS` doesn't.

### Use Tab Completion

Press `Tab` to autocomplete commands and avoid typos.

### Practice Makes Perfect

Switch to free mode to practice without guidance.

### Experiment

Try combining commands with pipes and wildcards.

## Common Mistakes

### Typos

```bash
# Wrong
$ sl

# Right
$ ls
```

### Case Sensitivity

```bash
# Wrong
$ CD documents

# Right
$ cd documents
```

### Missing Spaces

```bash
# Wrong
$ cdDocuments

# Right
$ cd Documents
```

## Progress Tracking

Your progress through the 22 lessons is shown in the progress bar at the top of Terminal Lab.

## Meta Commands

Available in both modes:

- `hint` - Show the expected command (tutorial mode)
- `skip` - Skip current step (tutorial mode)
- `free` - Switch to free exploration mode
- `tutorial` - Return to guided lessons
- `clear` - Clear screen (free mode only)

## Practice Exercises (Free Mode)

### Exercise 1: File Organization

```bash
$ mkdir project
$ cd project
$ mkdir src docs tests
$ touch README.md
$ ls
```

### Exercise 2: Using Pipes

```bash
$ ls | grep txt
$ cat file.txt | head -5
$ env | grep HOME
```

### Exercise 3: Aliases

```bash
$ alias ll='ls -la'
$ alias home='cd ~'
$ ll
$ home
```

## Troubleshooting

### Command Not Found

```bash
$ xyz
bash: xyz: command not found
```

**Solution**: Check spelling, or the command doesn't exist in this environment.

### Lost Focus After Tab

If Tab completion removes focus, this is a known issue. Click back in the terminal or it should refocus automatically.

### Lesson Not Advancing

Make sure you're typing the exact command shown. Use `hint` to see it again, or `skip` to move forward.

## Completion Rewards

### After 22 Lessons

You've mastered fundamental Unix/Linux commands! 🎓

Switch to free mode to practice and experiment with:

- Pipes and command chaining
- Aliases for shortcuts
- Environment variables
- Wildcards for file matching

## Next Steps

After completing Terminal Lab:

1. **Practice in Free Mode**
   - Experiment with pipes
   - Create useful aliases
   - Combine commands creatively

2. **Learn More**
   - Explore shell scripting
   - Study advanced commands
   - Read man pages

3. **Apply Knowledge**
   - Use terminal in real projects
   - Automate repetitive tasks
   - Share what you learned

## Quick Reference

### Most Used Commands

```bash
ls      # List files
cd      # Change directory
pwd     # Print working directory
mkdir   # Make directory
touch   # Create file
cat     # View file
cp      # Copy
mv      # Move/rename
rm      # Remove
grep    # Search
find    # Find files
man     # Manual pages
```

### Bash Features

```bash
alias name='command'  # Create alias
export VAR=value      # Set variable
echo $VAR             # Use variable
cmd1 | cmd2           # Pipe commands
ls *.txt              # Wildcards
```

## Resources

- [Keyboard Shortcuts](keyboard-shortcuts.md) - Terminal shortcuts
- [Tips & Tricks](tips-and-tricks.md) - Advanced terminal usage
- [Man Viewer](man-viewer.md) - Read manual pages

## Happy Learning!

Terminal Lab makes learning Unix/Linux fun and interactive. Complete the 22 lessons, then explore freely with bash-like features!

Questions? Check our [GitHub repository](https://github.com/Victxrlarixs/debian-cde).
