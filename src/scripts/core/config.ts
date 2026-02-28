// src/scripts/config.ts

import fontsData from '../../data/fonts.json';
import { logger } from '../utilities/logger';

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
  /** Height of the top bar (in pixels) */
  TOP_BAR_HEIGHT: number;
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
  /** Array of boot sequence steps (optional if generated dynamically) */
  SEQUENCE?: BootSequenceItem[];
  /** Final delay after boot completion in milliseconds */
  FINAL_DELAY: number;
}

/**
 * Configuration interface for backdrop/wallpaper.
 */
export interface BackdropConfig {
  /** Default backdrop file path */
  DEFAULT_BACKDROP: string;
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
 * Configuration for Desktop Icons.
 */
export interface DesktopIconsConfig {
  /** Base z-index for desktop icons (behind windows) */
  BASE_Z_INDEX: number;
  /** Key used in SettingsManager for icon positions */
  STORAGE_KEY: string;
  /** Grid cell size (width/height) for snapping if implemented */
  GRID_SIZE: number;
  /** Gap between icons */
  ICON_GAP: number;
}

/**
 * Configuration for the dropdown utilities menu.
 */
export interface DropdownConfig {
  /** Z-index for floating menus */
  Z_INDEX: number;
  /** Vertical offset from the button (in pixels) */
  OFFSET: number;
}

/**
 * Project metadata and external URLs.
 */
export interface MetaConfig {
  /** Main project repository URL */
  GITHUB_REPO: string;
  /** Issues tracking URL */
  ISSUES_URL: string;
}

/**
 * Global timings and delays for various system operations.
 */
export interface TimingsConfig {
  /** Delay before scanning for dynamic windows (ms) */
  SCANNING_DELAY: number;
  /** Delay before normalizing window positions (ms) */
  NORMALIZATION_DELAY: number;
}

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
  /** Backdrop/wallpaper configuration */
  BACKDROP: BackdropConfig;
  /** Task manager configuration */
  TASK_MANAGER: TaskManagerConfig;
  /** Default style values */
  DEFAULT_STYLES: DefaultStyles;
  /** Available font presets */
  FONT_PRESETS: Record<string, FontPreset>;
  /** Dropdown menu configuration */
  DROPDOWN: DropdownConfig;
  /** Project metadata */
  META: MetaConfig;
  /** System timings */
  TIMINGS: TimingsConfig;
  /** Desktop icons configuration */
  DESKTOP_ICONS: DesktopIconsConfig;
}

// Extract data from JSON files
const { __default__: defaultFonts, ...fontPresets } = fontsData;

/**
 * Default internal colors based on "Ashley" CDE Palette.
 */
const defaultColors = {
  '--window-color': '#4d648d',
  '--topbar-color': '#4d648d',
  '--titlebar-color': '#faad49',
  '--titlebar-text-color': '#000000',
  '--terminal-bg-color': '#000000',
  '--terminal-text-color': '#00ff00',
  '--dock-color': '#4d648d',
  '--menu-color': '#4d648d',
  '--dock-icon-bg': '#495f86',
  '--dock-icon-hover': '#5f7498',
  '--dock-icon-active': '#354662',
  '--button-bg': '#4d648d',
  '--button-active': '#354662',
  '--separator-color': '#354662',
  '--modal-bg': '#4d648d',
  '--scrollbar-color': '#faad49',
  '--text-color': '#FFFFFF',
  '--border-light': '#6f8fb8',
  '--border-dark': '#354662',
  '--border-inset-light': '#5f7498',
  '--border-inset-dark': '#3d4f70',
  '--shadow-color': 'rgba(0, 0, 0, 0.3)',
};

/**
 * Central configuration object for the CDE application.
 *
 * @remarks
 * This object aggregates all configuration values from various sources:
 * - Hardcoded constants for window management, audio, filesystem, etc.
 * - Default styles based on Ashley palette.
 * - Font preset collections from fonts.json
 *
 * The configuration is exposed globally as `window.CONFIG` for debugging
 * and legacy compatibility purposes.
 *
 * @example
 * ```typescript
 * import { CONFIG } from './config';
 *
 * // Access configuration values
 * logger.log(CONFIG.TERMINAL.MAX_LINES);
 * logger.log(CONFIG.DEFAULT_STYLES.COLORS['--window-color']);
 *
 * // Iterate through available themes
 * Object.keys(CONFIG.THEMES).forEach(theme => {
 *   logger.log(`Theme available: ${theme}`);
 * });
 * ```
 */
export const CONFIG: Config = {
  WINDOW: {
    MIN_VISIBLE: 20,
    BASE_Z_INDEX: 10000,
    TOP_BAR_HEIGHT: 30,
  },
  AUDIO: {
    BEEP_FREQUENCY: 880,
    BEEP_GAIN: 0.9,
    BEEP_DURATION: 0.1,
  },
  SCREENSHOT: {
    SCALE: 2,
    TOAST_MESSAGE: 'Screenshot Desktop...',
    FILENAME_PREFIX: 'CDE',
  },
  FILEMANAGER: {
    BASE_Z_INDEX: 10000,
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
    LOGO: `#> 
#>  _______________________________________________________
#> /                                                       | 
#> | Time travel initiated... Loading 1995 Unix experience  | 
#> \\                                                      | 
#>  -------------------------------------------------------
#>                  \\
#>                   \\
#>             ,        ,
#>             /(        )\`
#>             \\ \\___   / |
#>             /- _  \`-/  '
#>            (/\\/ \\ \\   /\\
#>            / /   | \`    
#>            O O   ) /    |
#>            \`-^--'\`<     '
#>           (_.)  _  )   /
#>            \`.___/\`    /
#>              \`-----' /
#> <----.     __ / __   \\
#> <----|====O)))==) \\) /====
#> <----'    \`--' \`.__,' \\
#>              |        |
#>               \\       /
#>         ______( (_  / \\______
#>       ,'  ,-----'   |        \\
#>       \`--{__________)        \\/`,
    FINAL_DELAY: 443,
  },
  BACKDROP: {
    DEFAULT_BACKDROP: import.meta.env.DEFAULT_BACKDROP || '/backdrops/SkyDarkTall.pm',
  },
  TASK_MANAGER: {
    BUTTON_ID: 'taskmanager-btn',
    WINDOW_ID: 'taskmanager',
    BASE_Z_INDEX: 10000,
  },
  DEFAULT_STYLES: {
    COLORS: defaultColors,
    FONTS: defaultFonts,
  },
  FONT_PRESETS: fontPresets,
  DROPDOWN: {
    Z_INDEX: 20000,
    OFFSET: 6,
  },
  META: {
    GITHUB_REPO: 'https://github.com/Victxrlarixs/debian-cde',
    ISSUES_URL: 'https://github.com/Victxrlarixs/debian-cde/issues',
  },
  TIMINGS: {
    SCANNING_DELAY: 200,
    NORMALIZATION_DELAY: 100,
  },
  DESKTOP_ICONS: {
    BASE_Z_INDEX: 10,
    STORAGE_KEY: 'cde_desktop_icons',
    GRID_SIZE: 80,
    ICON_GAP: 20,
  },
};

// Expose configuration globally for debugging and legacy compatibility
if (typeof window !== 'undefined') {
  (window as any).CONFIG = CONFIG;
  logger.log('[Config] Configuration loaded and attached to window');
}

export default CONFIG;
