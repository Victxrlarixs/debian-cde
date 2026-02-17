// src/scripts/config.ts

import themesData from '../data/themes.json';
import fontsData from '../data/fonts.json';

/**
 * Configuración global del proyecto CDE.
 * Todas las constantes, rutas, tiempos y valores por defecto centralizados.
 */

export interface WindowConfig {
  MIN_VISIBLE: number;
  BASE_Z_INDEX: number;
}

export interface AudioConfig {
  BEEP_FREQUENCY: number;
  BEEP_GAIN: number;
  BEEP_DURATION: number;
}

export interface ScreenshotConfig {
  SCALE: number;
  TOAST_MESSAGE: string;
  FILENAME_PREFIX: string;
}

export interface FileManagerConfig {
  BASE_Z_INDEX: number;
}

export interface FSConfig {
  HOME: string;
  DESKTOP: string;
  TRASH: string;
  NETWORK: string;
}

export interface TerminalConfig {
  HOME_PATH: string;
  MIN_TYPING_DELAY: number;
  MAX_TYPING_DELAY: number;
  POST_COMMAND_DELAY: number;
  POST_SEQUENCE_DELAY: number;
  MAX_LINES: number;
  CLEANUP_INTERVAL: number;
  SCROLL_INTERVAL: number;
  TRANSITION_MESSAGES: string[];
}

export interface BootSequenceItem {
  delay: number;
  text: string;
  type: string;
}

export interface BootConfig {
  LOGO: string;
  SEQUENCE: BootSequenceItem[];
  FINAL_DELAY: number;
}

export interface TaskManagerConfig {
  BUTTON_ID: string;
  WINDOW_ID: string;
  BASE_Z_INDEX: number;
}

export interface DefaultStyles {
  COLORS: Record<string, string>;
  FONTS: Record<string, string>;
}

export type Theme = Record<string, string>;
export type FontPreset = Record<string, string>;

export interface Config {
  WINDOW: WindowConfig;
  AUDIO: AudioConfig;
  SCREENSHOT: ScreenshotConfig;
  FILEMANAGER: FileManagerConfig;
  FS: FSConfig;
  TERMINAL: TerminalConfig;
  BOOT: BootConfig;
  TASK_MANAGER: TaskManagerConfig;
  DEFAULT_STYLES: DefaultStyles;
  THEMES: Record<string, Theme>;
  FONT_PRESETS: Record<string, FontPreset>;
}

// Extraer datos de los JSON
const { __default__: defaultColors, ...themes } = themesData;
const { __default__: defaultFonts, ...fontPresets } = fontsData;

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
    TOAST_MESSAGE: '📸 Capturando escritorio...',
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
      'Continuando con más comandos útiles...',
      'Siguiente tema: comandos de administración...',
      'Avanzando a operaciones más complejas...',
      'Aprendiendo nuevas funcionalidades...',
      'Próxima sección: herramientas de desarrollo...',
      'Explorando comandos de red...',
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

if (typeof window !== 'undefined') {
  (window as any).CONFIG = CONFIG;
}

export default CONFIG;
