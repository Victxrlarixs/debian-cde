# Style Manager Guide

The Style Manager is the central customization hub for the CDE Time Capsule, providing comprehensive control over visual appearance, behavior, and system settings.

## Overview

The Style Manager consists of 9 specialized modules, each controlling a specific aspect of the desktop environment. All settings are persisted to localStorage and survive browser sessions.

## Color Module

Manages the global color palette with 76+ authentic CDE themes.

### Available Palettes

The system includes all original CDE color schemes:

**Earth Tones:**
- Africa, Alpine, Arizona, Autumn, Broica, BroicaVUE, BroicaLtVUE
- Cabernet, Camouflage, Charcoal, Chocolate, Cinnamon, Clay, Coalmine
- Dakota, Dalla, DarkGold, Delphinium, Desert, Dusk

**Blues:**
- BlueNight, BlueShades, DarkBlue, Fjord, Glacier, Lilac, Neptune
- NorthernSky, Nutmeg, Olive, Orchid, PaleGreen, Palms, Pbnj

**Neutrals:**
- Ashley, BeigeRose, Canvas, Crimson, Goldenrod, GrayScale, Greige
- Lilac, Mauve, Mustard, Nutmeg, Olive, Orchid, PaleGreen

**Vibrant:**
- Crimson, Delphinium, Fjord, Goldenrod, Lilac, Mauve, Neptune
- Nutmeg, Olive, Orchid, PaleGreen, Palms, Pbnj, Pepper

**Special:**
- BlackWhite, Chocolate, Cinnamon, Clay, Coalmine, Crimson
- Default, Desert, Dusk, Fjord, Glacier, Goldenrod, GrayScale

### Color Variables

Each palette defines 20+ CSS custom properties:

```css
:root {
  --bg-color: #ae9e8e;              /* Primary background */
  --fg-color: #000000;              /* Primary foreground/text */
  --top-shadow: #dfd6c6;            /* Light shadow (3D effect) */
  --bottom-shadow: #5e5e5e;         /* Dark shadow (3D effect) */
  --select-color: #ae9e8e;          /* Selection highlight */
  --active-bg: #ae9e8e;             /* Active element background */
  --active-fg: #000000;             /* Active element foreground */
  --inactive-bg: #ae9e8e;           /* Inactive element background */
  --inactive-fg: #000000;           /* Inactive element foreground */
  --border-color: #000000;          /* Border color */
  --titlebar-bg: #ae9e8e;           /* Window title bar background */
  --titlebar-fg: #000000;           /* Window title bar text */
  --menu-bg: #ae9e8e;               /* Menu background */
  --menu-fg: #000000;               /* Menu text */
  --panel-bg: #ae9e8e;              /* Panel background */
  --panel-fg: #000000;              /* Panel text */
  --desktop-bg: #5e5e5e;            /* Desktop background */
  --shadow-color: #000000;          /* Drop shadow color */
  --highlight-color: #ffffff;       /* Highlight color */
  --input-bg: #ffffff;              /* Input field background */
  --input-fg: #000000;              /* Input field text */
}
```

### Custom Color Creation

Users can create custom palettes by adjusting individual color variables:

1. Open Style Manager → Color
2. Select a base palette
3. Adjust individual colors using color pickers
4. Click "Save" to persist changes

**Color Picker Interface:**

Each color variable has a dedicated picker:

```html
<div class="color-control">
  <label>Background Color</label>
  <input type="color" 
         data-var="--bg-color" 
         value="#ae9e8e">
  <div class="color-swatch" 
       style="background: var(--bg-color)"></div>
</div>
```

### Palette Application

Applying a palette updates all CSS variables simultaneously:

```typescript
public applyCdePalette(paletteName: string): void {
  const palette = this.cdePalettes[paletteName];
  if (!palette) return;
  
  Object.entries(palette.colors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
    this.styles[key] = value;
  });
  
  this.saveColors();
}
```

## Font Module

Controls typography across the entire system.

### Font Families

**Available Fonts:**
- System Default (sans-serif)
- Monospace (monospace)
- Serif (serif)
- Helvetica (Helvetica, Arial, sans-serif)
- Times (Times New Roman, Times, serif)
- Courier (Courier New, Courier, monospace)

### Font Properties

**Base Font Size:**
- Range: 10px - 20px
- Default: 12px
- Affects all UI text

**Font Weight:**
- Normal: 100-900
- Bold: 100-900
- Default: 400 (normal), 700 (bold)

**Line Height:**
- Range: 1.0 - 2.0
- Default: 1.5
- Affects text readability

**Letter Spacing:**
- Range: -2px - 4px
- Default: 0px
- Affects character spacing

### Font Presets

**Small:**
- Size: 10px
- Weight: 400
- Line Height: 1.4

**Medium (Default):**
- Size: 12px
- Weight: 400
- Line Height: 1.5

**Large:**
- Size: 14px
- Weight: 400
- Line Height: 1.6

**Extra Large:**
- Size: 16px
- Weight: 500
- Line Height: 1.7

### Font Application

```typescript
public applyFontStyle(cssVar: string, value: string): void {
  document.documentElement.style.setProperty(cssVar, value);
  this.fontStyles[cssVar] = value;
}
```

## Mouse Module

Configures mouse behavior and responsiveness.

### Mouse Acceleration

Controls cursor movement speed multiplier.

**Range:** 0.5 - 3.0
**Default:** 1.0
**Effect:** Higher values = faster cursor movement

**Implementation:**

```typescript
const deltaX = e.clientX - lastX;
const deltaY = e.clientY - lastY;
const acceleration = parseFloat(
  getComputedStyle(document.documentElement)
    .getPropertyValue('--mouse-acceleration')
) || 1;

newX = currentX + deltaX * acceleration;
newY = currentY + deltaY * acceleration;
```

### Mouse Threshold

Minimum movement before acceleration applies.

**Range:** 0 - 20 pixels
**Default:** 4 pixels
**Effect:** Improves precision for small movements

### Double-Click Speed

Time window for detecting double-clicks.

**Range:** 100ms - 1000ms
**Default:** 300ms
**Effect:** Lower values require faster clicking

**Implementation:**

```typescript
const now = Date.now();
if (now - lastClickTime < doubleClickTime) {
  // Double-click detected
  handleDoubleClick();
} else {
  // Single click
  handleSingleClick();
}
lastClickTime = now;
```

### Handedness

Swaps primary and secondary mouse buttons.

**Options:**
- Right-handed (default)
- Left-handed

**Effect:**
- Right: Left button = primary, right button = context menu
- Left: Right button = primary, left button = context menu

## Keyboard Module

Manages keyboard input behavior.

### Key Repeat Rate

Speed of character repetition when key is held.

**Range:** 100ms - 1000ms
**Default:** 300ms
**Effect:** Lower values = faster repetition

### Key Repeat Delay

Initial delay before repetition starts.

**Range:** 200ms - 1000ms
**Default:** 500ms
**Effect:** Time to hold key before repeat begins

### Click Sound

Audible feedback for keyboard input.

**Options:**
- Enabled (default)
- Disabled

**Sound Properties:**
- Frequency: 800Hz
- Duration: 30ms
- Volume: Controlled by Audio module

## Beep Module

Configures system audio feedback.

### Beep Volume

Master volume for all system sounds.

**Range:** 0.0 - 1.0
**Default:** 0.3
**Effect:** 0 = mute, 1 = maximum volume

### Beep Frequency

Pitch of system beep.

**Range:** 200Hz - 2000Hz
**Default:** 800Hz
**Effect:** Higher values = higher pitch

**Frequency Guide:**
- 200-400Hz: Low, bass-like
- 400-800Hz: Mid-range, comfortable
- 800-1200Hz: High, attention-grabbing
- 1200-2000Hz: Very high, piercing

### Beep Duration

Length of system beep.

**Range:** 10ms - 500ms
**Default:** 50ms
**Effect:** Longer duration = more noticeable

### Beep Type

Waveform shape for audio synthesis.

**Options:**
- Sine (default): Smooth, pure tone
- Square: Sharp, retro computer sound
- Sawtooth: Harsh, buzzing sound
- Triangle: Mellow, flute-like sound

**Implementation:**

```typescript
const oscillator = audioContext.createOscillator();
oscillator.type = 'sine'; // or 'square', 'sawtooth', 'triangle'
oscillator.frequency.value = frequency;
```

## Backdrop Module

Manages desktop background appearance.

### Available Backdrops

The system includes 168 authentic XPM backdrop patterns:

**Geometric:**
- Ankh, ArabescaDark, ArabescaLight, ArabianMosaic, Asanoha
- BellFlowers, Bijouterie, Binding, Bloom, Buckles
- Celtic, Chip, CirclePieces, CircleWeave, CircuitBoards

**Textures:**
- Afternoon, Armor, ArtDeco, Background, Bark, Barrack
- BrickWall, BrokenIce, Bubbles, Burl, Canvas, Carpet

**Patterns:**
- Carps, ChitzDk, ChitzLt, Corduroy, Crochet, Daisies
- Diamonds, Dimple, Dolphin, Doodle, Dots, DragonFly

**Nature:**
- Feathers, Ferns, Flowers, Foliage, Forest, Fountain
- Garden, Grass, Greenery, Grove, Hedge, Herbs

**Abstract:**
- Illusion, Infinity, Inlay, Interlock, Interlocking, Intricate
- Kaleidoscope, Knit, Lace, Lattice, Leaves, Lightning

**Industrial:**
- Machinery, Marble, Matrix, Maze, Mesh, Metal, Mosaic
- Network, Nuts, Octagon, Origami, Paisley, Panels

### Backdrop Styles

**Tiled (Default):**
- Repeats pattern across desktop
- Best for small patterns
- No distortion

**Centered:**
- Single instance at center
- Best for large images
- Maintains aspect ratio

**Fit:**
- Scales to fit screen
- Maintains aspect ratio
- May show background color

**Fill:**
- Scales to fill screen
- May crop image
- No background color visible

**Stretched:**
- Scales to exact screen size
- May distort image
- Fills entire screen

### Backdrop Application

```typescript
public applyBackdrop(name: string, style: string = 'tiled'): void {
  const backdropUrl = `/backdrops/${name}.pm`;
  
  document.documentElement.style.setProperty(
    '--desktop-backdrop',
    `url('${backdropUrl}')`
  );
  
  document.documentElement.style.setProperty(
    '--backdrop-style',
    style
  );
  
  this.saveBackdrop(name, style);
}
```

### XPM Parsing

Backdrops are stored in XPM format and parsed at runtime:

```typescript
public parseXPM(xpmData: string): string {
  // Extract dimensions and colors
  const lines = xpmData.split('\n');
  const [width, height, colorCount, charsPerPixel] = 
    lines[0].match(/\d+/g).map(Number);
  
  // Parse color definitions
  const colors: Record<string, string> = {};
  for (let i = 1; i <= colorCount; i++) {
    const [char, color] = parseColorLine(lines[i]);
    colors[char] = color;
  }
  
  // Build pixel grid
  const pixels: string[][] = [];
  for (let i = colorCount + 1; i < lines.length; i++) {
    pixels.push(lines[i].split('').map(c => colors[c]));
  }
  
  // Convert to base64 PNG
  return canvasToDataURL(pixels, width, height);
}
```

## Window Module

Controls window behavior and appearance.

### Focus Mode

Determines how windows receive focus.

**Click-to-Focus (Default):**
- Window focuses on click
- Explicit user action required
- Traditional desktop behavior

**Point-to-Focus:**
- Window focuses on mouse hover
- No click required
- X11-style behavior

**Implementation:**

```typescript
if (focusMode === 'point') {
  document.addEventListener('pointerenter', (e) => {
    const win = e.target.closest('.window');
    if (win) focusWindow(win.id);
  }, true);
}
```

### Opaque Dragging

Controls window appearance during drag.

**Opaque (Default):**
- Full window content visible while dragging
- Higher visual fidelity
- May impact performance on slow devices

**Wireframe:**
- Only window outline visible while dragging
- Better performance
- Classic X11 behavior

**Implementation:**

```typescript
if (!opaqueDragging) {
  window.classList.add('dragging-wireframe');
}
```

```css
.dragging-wireframe {
  opacity: 0.5;
  background: transparent !important;
  border: 2px dashed var(--border-color);
}
```

### Window Placement

Controls initial window position.

**Centered (Default):**
- Windows open at screen center
- Consistent placement
- Mobile-friendly

**Cascading:**
- Windows offset from previous position
- Classic desktop behavior
- Prevents overlap

**Smart:**
- Avoids existing windows
- Maximizes visible area
- Complex algorithm

## Screen Module

Manages screen saver and power settings.

### Screen Saver Timeout

Time of inactivity before screen saver activates.

**Range:** 1 - 60 minutes
**Default:** 10 minutes
**Effect:** 0 = disabled

**Implementation:**

```typescript
let idleTimer: number;

function resetTimer(): void {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(activateScreenSaver, timeout * 60 * 1000);
}

document.addEventListener('mousemove', resetTimer);
document.addEventListener('keydown', resetTimer);
document.addEventListener('pointerdown', resetTimer);
document.addEventListener('wheel', resetTimer);
```

### Screen Saver Type

Visual effect displayed during screen saver.

**Options:**
- Blank Screen (default): Solid black
- Starfield: Moving stars
- Matrix: Falling characters
- Pipes: 3D pipe maze
- Bouncing Logo: CDE logo bouncing

### Screen Saver Preview

Test screen saver without waiting for timeout.

**Button:** "Preview" in Screen module

**Implementation:**

```typescript
public previewScreenSaver(): void {
  activateScreenSaver();
  
  // Exit on any input
  const exitHandler = () => {
    deactivateScreenSaver();
    document.removeEventListener('pointermove', exitHandler);
    document.removeEventListener('keydown', exitHandler);
  };
  
  document.addEventListener('pointermove', exitHandler, { once: true });
  document.addEventListener('keydown', exitHandler, { once: true });
}
```

## Startup Module

Manages session data and system initialization.

### Session Management

**Save Session:**
- Window positions
- Window sizes
- Maximized states
- Open applications
- Current workspace

**Restore Session:**
- Reopens windows at saved positions
- Restores maximized states
- Switches to last workspace

**Clear Session:**
- Removes all saved window states
- Resets to default layout
- Useful for troubleshooting

### Data Management

**Export Settings:**
- Downloads JSON file with all settings
- Includes theme, fonts, mouse, keyboard, etc.
- Useful for backup or sharing

**Import Settings:**
- Uploads JSON file
- Applies all settings
- Validates format before applying

**Reset to Defaults:**
- Clears all localStorage data
- Resets to factory settings
- Requires confirmation

**Implementation:**

```typescript
public exportSettings(): void {
  const settings = settingsManager.getAllSettings();
  const json = JSON.stringify(settings, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cde-settings.json';
  a.click();
}

public importSettings(file: File): void {
  const reader = new FileReader();
  reader.onload = (e) => {
    const settings = JSON.parse(e.target.result as string);
    settingsManager.setAllSettings(settings);
    location.reload();
  };
  reader.readAsText(file);
}

public resetToDefaults(): void {
  if (confirm('Reset all settings to defaults? This cannot be undone.')) {
    localStorage.clear();
    location.reload();
  }
}
```

## Settings Persistence

All Style Manager settings are automatically saved to localStorage.

### Storage Structure

```typescript
{
  "theme": {
    "colors": { "--bg-color": "#ae9e8e", ... },
    "fonts": { "--font-family-base": "sans-serif", ... }
  },
  "mouse": {
    "acceleration": 1.0,
    "threshold": 4,
    "doubleClickTime": 300,
    "handedness": "right"
  },
  "keyboard": {
    "repeatRate": 300,
    "clickSound": true
  },
  "audio": {
    "volume": 0.3,
    "frequency": 800,
    "duration": 50,
    "type": "sine"
  },
  "backdrop": {
    "current": "Background",
    "style": "tiled"
  },
  "window": {
    "focusMode": "click",
    "opaqueDragging": true
  },
  "screen": {
    "timeout": 10,
    "enabled": true,
    "type": "blank"
  },
  "session": {
    "windows": {
      "emacs": {
        "left": "100px",
        "top": "100px",
        "maximized": false
      }
    }
  }
}
```

### Save Triggers

Settings are saved immediately on change:

- Color picker input
- Font control change
- Slider adjustment
- Checkbox toggle
- Dropdown selection
- Button click (Apply/Save)

### Load Sequence

Settings are loaded during initialization:

```typescript
public init(): void {
  const settings = settingsManager.getAllSettings();
  
  // Apply theme
  this.theme.loadSavedColors(settings.theme.colors);
  this.font.loadSavedFonts(settings.theme.fonts);
  
  // Apply behavior
  this.mouse.load(settings.mouse);
  this.keyboard.load(settings.keyboard);
  this.audio.load(settings.audio);
  this.backdrop.load(settings.backdrop);
  this.window.load(settings.window);
  this.screen.load(settings.screen);
  
  // Restore session
  this.startup.restoreSession(settings.session);
}
```

## Keyboard Shortcuts

Style Manager can be accessed via keyboard:

- **Ctrl+Alt+S**: Open Style Manager main window
- **Escape**: Close current Style Manager window
- **Tab**: Navigate between controls
- **Enter**: Activate focused button
- **Arrow Keys**: Adjust sliders

## Accessibility

All Style Manager controls are keyboard-accessible and screen reader compatible:

- Labels for all inputs
- ARIA attributes for custom controls
- Focus indicators
- Logical tab order
- Keyboard shortcuts documented

## Performance Considerations

### CSS Variable Updates

Changing CSS variables triggers style recalculation:

```typescript
// Efficient: Batch updates
document.documentElement.style.cssText = `
  --bg-color: #ae9e8e;
  --fg-color: #000000;
  --top-shadow: #dfd6c6;
`;

// Inefficient: Individual updates
document.documentElement.style.setProperty('--bg-color', '#ae9e8e');
document.documentElement.style.setProperty('--fg-color', '#000000');
document.documentElement.style.setProperty('--top-shadow', '#dfd6c6');
```

### Backdrop Parsing

XPM parsing is CPU-intensive. Backdrops are cached after first parse:

```typescript
const backdropCache: Record<string, string> = {};

public getBackdrop(name: string): string {
  if (backdropCache[name]) {
    return backdropCache[name];
  }
  
  const parsed = this.parseXPM(xpmData);
  backdropCache[name] = parsed;
  return parsed;
}
```

### LocalStorage Limits

LocalStorage has a 5-10MB limit. Settings are kept minimal:

- Colors: ~2KB
- Fonts: ~1KB
- Other settings: ~2KB
- Session data: ~5KB
- Total: ~10KB (well under limit)
