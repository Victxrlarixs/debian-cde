# Terminal Lab User Guide

Terminal Lab is an interactive learning environment for Unix commands. Complete 41 lessons to master the command line!

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
2. **Lesson Panel** - Instructions and explanations
3. **Progress Bar** - Your completion status
4. **Command Prompt** - Shows `$` when ready for input

### The Prompt

```
$ _
```

The `$` symbol means the terminal is ready for your command. The cursor (`_`) shows where you'll type.

## How Lessons Work

### Lesson Structure

Each lesson follows this pattern:

1. **Introduction** - What you'll learn
2. **Explanation** - How the command works
3. **Example** - See it in action
4. **Practice** - Try it yourself
5. **Verification** - Check if you got it right

### Typing Commands

1. Read the lesson instructions
2. Type the command exactly as shown
3. Press `Enter` to execute
4. See the result
5. Move to the next lesson

### Getting Help

- Read the lesson text carefully
- Look at the examples
- Try the command step by step
- If stuck, try again

## Lesson Categories

### Basics (Lessons 1-10)

Learn fundamental commands:

- `pwd` - Print working directory
- `ls` - List files
- `cd` - Change directory
- `mkdir` - Make directory
- `touch` - Create file
- `cat` - View file contents
- `echo` - Print text
- `clear` - Clear screen

### File Operations (Lessons 11-20)

Work with files:

- `cp` - Copy files
- `mv` - Move/rename files
- `rm` - Remove files
- `rmdir` - Remove directories
- `find` - Search for files
- `grep` - Search in files
- `wc` - Word count
- `head` - View file start
- `tail` - View file end

### Text Processing (Lessons 21-30)

Manipulate text:

- `sort` - Sort lines
- `uniq` - Remove duplicates
- `cut` - Extract columns
- `paste` - Merge files
- `tr` - Translate characters
- `sed` - Stream editor
- `awk` - Text processing

### Advanced (Lessons 31-41)

Master advanced topics:

- Pipes and redirection
- File permissions
- Process management
- Environment variables
- Shell scripting basics
- Command chaining
- Wildcards and patterns

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

# Delete directory
$ rmdir emptyfolder
```

### Viewing Files

```bash
# View entire file
$ cat file.txt

# View first 10 lines
$ head file.txt

# View last 10 lines
$ tail file.txt

# View file page by page
$ less file.txt
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
| `Ctrl+D` | Exit terminal          |
| `Tab`    | Auto-complete          |
| `↑`      | Previous command       |
| `↓`      | Next command           |

### Editing

| Shortcut | Action                |
| -------- | --------------------- |
| `Ctrl+A` | Move to line start    |
| `Ctrl+E` | Move to line end      |
| `Ctrl+U` | Clear line            |
| `Ctrl+K` | Delete to end of line |
| `Ctrl+W` | Delete previous word  |

## Tips for Success

### Read Carefully

Each lesson explains exactly what to do. Read the instructions before typing.

### Type Exactly

Commands are case-sensitive. `ls` works, `LS` doesn't.

### Use Tab Completion

Start typing a filename and press `Tab` to auto-complete.

### Practice Makes Perfect

Repeat commands until they feel natural.

### Take Notes

Write down commands you find useful.

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

### Wrong Directory

```bash
# Check where you are
$ pwd

# Go to the right place
$ cd /path/to/directory
```

## Progress Tracking

### Completion Status

- **Green checkmark** - Lesson completed
- **Current lesson** - Highlighted
- **Locked lessons** - Complete previous lessons first

### Viewing Progress

Your progress is saved automatically. You can:

- See completed lessons
- Resume where you left off
- Repeat any lesson

## Advanced Features

### Command History

Use arrow keys to navigate through previous commands:

- `↑` - Previous command
- `↓` - Next command

### Auto-completion

Press `Tab` to auto-complete:

- File names
- Directory names
- Commands

### Copy & Paste

- **Copy**: Select text, then `Ctrl+C`
- **Paste**: `Ctrl+V` or right-click

## Lesson Highlights

### Lesson 1: pwd

Learn where you are in the filesystem.

```bash
$ pwd
/home/user
```

### Lesson 5: mkdir

Create your first directory.

```bash
$ mkdir my_project
$ ls
my_project
```

### Lesson 10: cat

View file contents.

```bash
$ cat hello.txt
Hello, World!
```

### Lesson 20: grep

Search for text in files.

```bash
$ grep "error" log.txt
Error: File not found
```

### Lesson 30: pipes

Combine commands with pipes.

```bash
$ ls | grep ".txt"
file1.txt
file2.txt
```

### Lesson 41: Graduation

You've mastered the terminal!

## Practice Exercises

### Exercise 1: File Organization

```bash
# Create project structure
$ mkdir project
$ cd project
$ mkdir src docs tests
$ touch README.md
$ ls
docs  README.md  src  tests
```

### Exercise 2: Finding Files

```bash
# Find all .txt files
$ find . -name "*.txt"

# Search for "TODO" in files
$ grep -r "TODO" .
```

### Exercise 3: Text Processing

```bash
# Count lines in all .txt files
$ wc -l *.txt

# Sort file contents
$ sort names.txt

# Remove duplicates
$ sort names.txt | uniq
```

## Troubleshooting

### Command Not Found

```bash
$ xyz
bash: xyz: command not found
```

**Solution**: Check spelling, or the command doesn't exist.

### Permission Denied

```bash
$ rm system_file
Permission denied
```

**Solution**: You don't have permission for this operation.

### No Such File or Directory

```bash
$ cd nonexistent
No such file or directory
```

**Solution**: Check the path, or create the directory first.

### Terminal Frozen

**Solution**: Press `Ctrl+C` to cancel the current command.

## Completion Rewards

### After 10 Lessons

You understand basic navigation and file operations.

### After 20 Lessons

You can manage files and search effectively.

### After 30 Lessons

You're proficient with text processing.

### After 41 Lessons

You're a terminal master! 🎓

## Next Steps

After completing Terminal Lab:

1. **Practice Daily**
   - Use terminal commands regularly
   - Try them in real projects
   - Experiment with combinations

2. **Learn More**
   - Explore shell scripting
   - Study advanced commands
   - Read Unix documentation

3. **Share Knowledge**
   - Teach others
   - Write about your experience
   - Contribute to projects

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
```

### Command Patterns

```bash
command              # Simple command
command file         # Command with argument
command -option      # Command with flag
command file1 file2  # Multiple arguments
command1 | command2  # Pipe commands
```

## Resources

- [Keyboard Shortcuts](keyboard-shortcuts.md) - Terminal shortcuts
- [Tips & Tricks](tips-and-tricks.md) - Advanced terminal usage
- [XEmacs Guide](xemacs.md) - Edit files you create

## Happy Learning!

Terminal Lab makes learning Unix fun and interactive. Take your time, practice regularly, and you'll master the command line!

Questions? Check our [GitHub repository](https://github.com/Victxrlarixs/debian-cde).
