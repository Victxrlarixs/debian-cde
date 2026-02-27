# Lynx Browser User Guide

Lynx is a text-based web browser that was popular in the early days of the internet. This implementation brings the authentic Lynx experience to your browser.

## What is Lynx?

Lynx is a fully-featured World Wide Web client for users running text-based terminals. It displays web pages as formatted text with numbered links, making it fast and accessible.

## Opening Lynx

### From Application Manager

1. Click the menu button in the Front Panel
2. Click "Lynx" icon

### From Terminal Lab

Type `lynx` in free mode to launch the browser.

### From Panel

Click the browser dropdown button and select "Lynx Browser"

### Keyboard Shortcut

Press `Ctrl+Alt+L` to open Lynx

## Navigation

### Moving Between Links

| Key            | Action                       |
| -------------- | ---------------------------- |
| `↓` or `j`     | Move to next link            |
| `↑` or `k`     | Move to previous link        |
| `→` or `Enter` | Follow selected link         |
| `←`            | Go back to previous page     |
| `0-9`          | Jump directly to link number |

### Commands

| Key        | Command        | Description                |
| ---------- | -------------- | -------------------------- |
| `G`        | Go             | Enter a URL to visit       |
| `M`        | Main screen    | Return to home page        |
| `H` or `?` | Help           | Show help page             |
| `O`        | Options        | Show options menu          |
| `P`        | Print          | Print page (not available) |
| `Q`        | Quit           | Exit Lynx                  |
| `/`        | Search         | Search for text in page    |
| `V`        | View bookmarks | Show bookmarks list        |
| `Delete`   | History        | Show history list          |

## Using Lynx

### Following Links

Links are displayed with numbers in brackets, like `[1]`, `[2]`, etc.

To follow a link:

1. Use arrow keys to highlight the link (turns yellow)
2. Press `Enter` or `→`

Or type the link number directly.

### Entering URLs

1. Press `G` (Go)
2. Type the URL in the prompt at the bottom
3. Press `Enter`

Available internal pages:

- `debian.com.mx` - Home page
- `gnu.org` - GNU Project
- `debian.org` - Debian Linux
- `about:lynx` - About Lynx

External URLs (starting with `http://` or `https://`) will open in a new browser tab.

### Searching

1. Press `/`
2. Type your search term
3. Press `Enter`

Found text will be highlighted in yellow.

### Bookmarks

Press `V` to view your bookmarks. Use arrow keys to select and `Enter` to visit.

Default bookmarks:

- debian.com.mx

### History

Press `Delete` to view your browsing history. The current page is marked with `*`.

### Help

Press `H` or `?` to view the help page with all keyboard commands.

Press any key to return to the previous page.

## Understanding the Interface

### URL Display

The current URL is shown at the top of the page in white text.

### Content Area

The main area shows the page content with:

- Regular text in gray
- Links in blue (bold)
- Selected link in yellow background with black text
- Search results highlighted in yellow

### Status Bar

Shows current status messages:

- "Document: Done" - Page loaded
- "Found: term" - Search result
- "Error: message" - Error occurred

### Command Bars

Two lines at the bottom show available keyboard commands for quick reference.

### Input Line

When you press `G`, `/`, or `Q`, an input line appears at the bottom where you can type your response.

Press `Escape` to cancel any input prompt.

## Tips

### Quick Navigation

- Use number keys to jump directly to links
- Press `M` to quickly return home
- Press `←` to go back

### Reading Long Pages

- Use `Page Up` and `Page Down` to scroll
- Selected link stays visible as you scroll

### External Links

Links to external websites (like GitHub) will open in a new browser tab, keeping Lynx open.

## Differences from Real Lynx

This is a browser-based simulation with some limitations:

- Limited set of pre-loaded pages
- No actual network requests
- Simplified options menu
- Print function not available
- Some advanced Lynx features not implemented

## Keyboard Shortcuts Summary

| Shortcut     | Action         |
| ------------ | -------------- |
| `Ctrl+Alt+L` | Open Lynx      |
| `↑↓`         | Navigate links |
| `Enter`      | Follow link    |
| `G`          | Go to URL      |
| `M`          | Home           |
| `H`          | Help           |
| `Q`          | Quit           |
| `/`          | Search         |
| `V`          | Bookmarks      |
| `Delete`     | History        |

## Troubleshooting

### Can't Type in Input

Make sure the Lynx window is focused. Click on the content area if needed.

### Links Not Responding

Ensure you're in navigation mode (not in an input prompt). Press `Escape` to cancel any active prompt.

### Page Not Found

Only pre-loaded pages are available. Try:

- debian.com.mx
- gnu.org
- debian.org
- about:lynx

## Further Reading

- [Getting Started](getting-started.md)
- [Keyboard Shortcuts](keyboard-shortcuts.md)
- [Terminal Laboratory](terminal-lab.md)
- [Netscape Navigator](netscape.md)

## About Lynx

Lynx was developed in 1992 at the University of Kansas and became one of the oldest web browsers still being maintained. It's particularly useful for:

- Accessibility (screen readers)
- Low bandwidth connections
- Text-only terminals
- Quick browsing without graphics

This implementation honors the original Lynx design and keyboard commands.
