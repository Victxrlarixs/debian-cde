// src/scripts/config.ts

import themesData from '../../data/themes.json';
import fontsData from '../../data/fonts.json';

/**
 * Global configuration for the CDE project.
 * All constants, paths, timings, and default values centralized here.
 */

/**
 * Configuration interface for window management.
 */
export interface WindowConfig {
  /** Minimum visible portion of a window when dragged off-screen (in pixels) */
  MIN_VISIBLE: number;
  /** Base z-index value for windows */
  BASE_Z_INDEX: number;
}

/**
 * Configuration interface for audio/beep settings.
 */
export interface AudioConfig {
  /** Frequency of the beep sound in Hz */
  BEEP_FREQUENCY: number;
  /** Gain/volume of the beep (0.0 to 1.0) */
  BEEP_GAIN: number;
  /** Duration of the beep in seconds */
  BEEP_DURATION: number;
}

/**
 * Configuration interface for screenshot capture.
 */
export interface ScreenshotConfig {
  /** Scale factor for screenshot resolution */
  SCALE: number;
  /** Message displayed during screenshot capture */
  TOAST_MESSAGE: string;
  /** Prefix for generated screenshot filenames */
  FILENAME_PREFIX: string;
}

/**
 * Configuration interface for file manager.
 */
export interface FileManagerConfig {
  /** Base z-index for file manager windows */
  BASE_Z_INDEX: number;
}

/**
 * Configuration interface for virtual filesystem paths.
 */
export interface FSConfig {
  /** Home directory path */
  HOME: string;
  /** Desktop directory path */
  DESKTOP: string;
  /** Trash directory path */
  TRASH: string;
  /** Network directory path */
  NETWORK: string;
}

/**
 * Configuration interface for terminal tutorial.
 */
export interface TerminalConfig {
  /** Home path for terminal prompt */
  HOME_PATH: string;
  /** Minimum typing delay in milliseconds */
  MIN_TYPING_DELAY: number;
  /** Maximum typing delay in milliseconds */
  MAX_TYPING_DELAY: number;
  /** Delay after command execution in milliseconds */
  POST_COMMAND_DELAY: number;
  /** Delay after sequence completion in milliseconds */
  POST_SEQUENCE_DELAY: number;
  /** Maximum number of lines to keep in terminal */
  MAX_LINES: number;
  /** Interval for terminal cleanup in milliseconds */
  CLEANUP_INTERVAL: number;
  /** Interval for keeping terminal scrolled to bottom in milliseconds */
  SCROLL_INTERVAL: number;
  /** Messages displayed between tutorial sequences */
  TRANSITION_MESSAGES: string[];
}

/**
 * Represents a single step in the boot sequence.
 */
export interface BootSequenceItem {
  /** Delay before displaying this item in milliseconds */
  delay: number;
  /** Text to display for this boot item */
  text: string;
  /** Type/category of boot message (kernel, cpu, memory, etc.) */
  type: string;
}

/**
 * Configuration interface for boot sequence.
 */
export interface BootConfig {
  /** ASCII art logo displayed during boot */
  LOGO: string;
  /** Array of boot sequence steps */
  SEQUENCE: BootSequenceItem[];
  /** Final delay after boot completion in milliseconds */
  FINAL_DELAY: number;
}

/**
 * Configuration interface for task manager.
 */
export interface TaskManagerConfig {
  /** ID of the button that opens the task manager */
  BUTTON_ID: string;
  /** ID of the task manager window element */
  WINDOW_ID: string;
  /** Base z-index for task manager */
  BASE_Z_INDEX: number;
}

/**
 * Default color and font styles.
 */
export interface DefaultStyles {
  /** Default color values mapped to CSS variables */
  COLORS: Record<string, string>;
  /** Default font values mapped to CSS variables */
  FONTS: Record<string, string>;
}

/** Theme definition mapping CSS variables to color values */
export type Theme = Record<string, string>;

/** Font preset definition mapping CSS variables to font values */
export type FontPreset = Record<string, string>;

/**
 * Root configuration interface for the entire CDE application.
 */
export interface Config {
  /** Window management configuration */
  WINDOW: WindowConfig;
  /** Audio/beep configuration */
  AUDIO: AudioConfig;
  /** Screenshot capture configuration */
  SCREENSHOT: ScreenshotConfig;
  /** File manager configuration */
  FILEMANAGER: FileManagerConfig;
  /** Virtual filesystem paths */
  FS: FSConfig;
  /** Terminal tutorial configuration */
  TERMINAL: TerminalConfig;
  /** Boot sequence configuration */
  BOOT: BootConfig;
  /** Task manager configuration */
  TASK_MANAGER: TaskManagerConfig;
  /** Default style values */
  DEFAULT_STYLES: DefaultStyles;
  /** Available color themes */
  THEMES: Record<string, Theme>;
  /** Available font presets */
  FONT_PRESETS: Record<string, FontPreset>;
}

// Extract data from JSON files
const { __default__: defaultColors, ...themes } = themesData;
const { __default__: defaultFonts, ...fontPresets } = fontsData;

/**
 * Central configuration object for the CDE application.
 * 
 * @remarks
 * This object aggregates all configuration values from various sources:
 * - Hardcoded constants for window management, audio, filesystem, etc.
 * - Default styles extracted from themes.json and fonts.json
 * - Theme and font preset collections from JSON files
 * 
 * The configuration is exposed globally as `window.CONFIG` for debugging
 * and legacy compatibility purposes.
 * 
 * @example
 * ```typescript
 * import { CONFIG } from './config';
 * 
 * // Access configuration values
 * console.log(CONFIG.TERMINAL.MAX_LINES);
 * console.log(CONFIG.DEFAULT_STYLES.COLORS['--window-color']);
 * 
 * // Iterate through available themes
 * Object.keys(CONFIG.THEMES).forEach(theme => {
 *   console.log(`Theme available: ${theme}`);
 * });
 * ```
 */
export const CONFIG: Config = {
  WINDOW: {
    MIN_VISIBLE: 20,
    BASE_Z_INDEX: 100,
  },
  AUDIO: {
    BEEP_FREQUENCY: 880,
    BEEP_GAIN: 0.1,
    BEEP_DURATION: 0.1,
  },
  SCREENSHOT: {
    SCALE: 2,
    TOAST_MESSAGE: 'Screenshot Desktop...',
    FILENAME_PREFIX: 'CDE',
  },
  FILEMANAGER: {
    BASE_Z_INDEX: 1000,
  },
  FS: {
    HOME: '/home/victxrlarixs/',
    DESKTOP: '/home/victxrlarixs/Desktop/',
    TRASH: '/home/victxrlarixs/.Trash/',
    NETWORK: '/network/',
  },
  TERMINAL: {
    HOME_PATH: '/home/victxrlarixs',
    MIN_TYPING_DELAY: 20,
    MAX_TYPING_DELAY: 80,
    POST_COMMAND_DELAY: 800,
    POST_SEQUENCE_DELAY: 2000,
    MAX_LINES: 50,
    CLEANUP_INTERVAL: 30000,
    SCROLL_INTERVAL: 500,
    TRANSITION_MESSAGES: [
      'Continuing with more useful commands...',
      'Next topic: administration commands...',
      'Moving on to more complex operations...',
      'Learning new functionalities...',
      'Next section: development tools...',
      'Exploring network commands...',
    ],
  },
  BOOT: {
    LOGO: `
                                  _,met$$$$$gg.
                               ,g$$$$$$$$$$$$$$$P.
                             ,g$$P""       """Y$$.".
                            ,$$P'              \`$$$.
                          ',$$P       ,ggs.     \`$$b:
                          \`d$$'     ,$P"'   .    $$$
                           $$P      d$'     ,    $$P
                           $$:      $$.   -    ,d$$'
                           $$;      Y$b._   _,d$P'
                           Y$$.    \`. "Y$$$$P"'
                            \`$$b      "-.__
                             \`Y$$b
                              \`Y$$.
                                \`$$b.
                                  \`Y$$b.
                                    \`"Y$b._
                                        \`""

                       _,           _,      ,'.
                     \`$$'         \`$$'     \`.  ,'
                      $$           $$        \`'
                      $$           $$         _,           _
                ,d$$$g$$  ,d$$$b.  $$,d$$$b.\`$$' g$$$$$b.\`$$,d$$b.
               ,$P'  \`$$ ,$P' \`Y$. $$$'  \`$$ $$  "'   \`$$ $$$' \`$$
               $$'    $$ $$'   \`$$ $$'    $$ $$  ,ggggg$$ $$'   $$
               $$     $$ $$ggggg$$ $$     $$ $$ ,$P"   $$ $$    $$
               $$    ,$$ $$.       $$    ,$P $$ $$'   ,$$ $$    $$
               \`$g. ,$$$ \`$$._ _., $$ _,g$P' $$ \`$b. ,$$$ $$    $$
                \`Y$$P'$$. \`Y$$$$P',$$$$P"'  ,$$. \`Y$$P'$$.$$.  ,$$.
        `,
    SEQUENCE: [
      {
        delay: 177,
        text: '[    0.000000] Starting Debian CDE simulation [debian.com.mx]',
        type: 'kernel',
      },
      {
        delay: 221,
        text: '[    0.227156] smpboot: CPU0: Retro Render Engine (1995 compatibility)',
        type: 'cpu',
      },
      {
        delay: 310,
        text: '[    0.789123] Memory: 64MB of 90s nostalgia available',
        type: 'memory',
      },
      { delay: 354, text: '[    1.012345] Mounting /usr/share/cde/icons ...', type: 'fs' },
      { delay: 399, text: '[    1.123456] Loading themes: Platinum, Olive, Marine...', type: 'fs' },
      {
        delay: 372,
        text: '[    1.345678] Starting Style Manager (color schemes)',
        type: 'systemd',
      },
      {
        delay: 443,
        text: '[    1.789012] Starting Workspace Manager: pager ready',
        type: 'systemd',
      },
      { delay: 337, text: '[    2.112345] i915: Initializing retro CRT filter', type: 'drm' },
      {
        delay: 461,
        text: '[    2.667890] Starting dtlogin: CDE session manager (auto-login: victxrlarixs)',
        type: 'service',
      },
      {
        delay: 487,
        text: '[    2.778901] Loading CDE Panel: workspace switcher, icons, tray',
        type: 'service',
      },
      { delay: 461, text: '[    3.123456] Starting File Manager', type: 'service' },
      { delay: 638, text: '[    4.111111] dtwm: Window manager initialized', type: 'desktop' },
      { delay: 664, text: '[    4.222222] Workspace One: active', type: 'desktop' },
      {
        delay: 647,
        text: '[    4.444444] Style Manager: listening for color changes',
        type: 'desktop',
      },
      { delay: 700, text: '[    5.000000] CDE Desktop ready ....', type: 'desktop' },
    ],
    FINAL_DELAY: 443,
  },
  TASK_MANAGER: {
    BUTTON_ID: 'taskmanager-btn',
    WINDOW_ID: 'taskmanager',
    BASE_Z_INDEX: 2000,
  },
  DEFAULT_STYLES: {
    COLORS: defaultColors,
    FONTS: defaultFonts,
  },
  THEMES: themes,
  FONT_PRESETS: fontPresets,
};

// Expose configuration globally for debugging and legacy compatibility
if (typeof window !== 'undefined') {
  (window as any).CONFIG = CONFIG;
  console.log('[Config] Configuration loaded and attached to window');
}

export default CONFIG;