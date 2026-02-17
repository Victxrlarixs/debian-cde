// src/scripts/config.ts

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
            '🔄 Continuando con más comandos útiles...',
            '📚 Siguiente tema: comandos de administración...',
            '🚀 Avanzando a operaciones más complejas...',
            '💡 Aprendiendo nuevas funcionalidades...',
            '🛠️ Próxima sección: herramientas de desarrollo...',
            '🌐 Explorando comandos de red...',
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
            { delay: 177, text: "[    0.000000] Starting Debian CDE simulation [debian.com.mx]", type: "kernel" },
            { delay: 221, text: "[    0.227156] smpboot: CPU0: Retro Render Engine (1995 compatibility)", type: "cpu" },
            { delay: 310, text: "[    0.789123] Memory: 64MB of 90s nostalgia available", type: "memory" },
            { delay: 354, text: "[    1.012345] Mounting /usr/share/cde/icons ...", type: "fs" },
            { delay: 399, text: "[    1.123456] Loading themes: Platinum, Olive, Marine...", type: "fs" },
            { delay: 372, text: "[    1.345678] Starting Style Manager (color schemes)", type: "systemd" },
            { delay: 443, text: "[    1.789012] Starting Workspace Manager: pager ready", type: "systemd" },
            { delay: 337, text: "[    2.112345] i915: Initializing retro CRT filter", type: "drm" },
            { delay: 461, text: "[    2.667890] Starting dtlogin: CDE session manager (auto-login: victxrlarixs)", type: "service" },
            { delay: 487, text: "[    2.778901] Loading CDE Panel: workspace switcher, icons, tray", type: "service" },
            { delay: 461, text: "[    3.123456] Starting File Manager", type: "service" },
            { delay: 638, text: "[    4.111111] dtwm: Window manager initialized", type: "desktop" },
            { delay: 664, text: "[    4.222222] Workspace One: active", type: "desktop" },
            { delay: 647, text: "[    4.444444] Style Manager: listening for color changes", type: "desktop" },
            { delay: 700, text: "[    5.000000] CDE Desktop ready ....", type: "desktop" },
        ],
        FINAL_DELAY: 443,
    },
    TASK_MANAGER: {
        BUTTON_ID: 'taskmanager-btn',
        WINDOW_ID: 'taskmanager',
        BASE_Z_INDEX: 2000,
    },
    DEFAULT_STYLES: {
        COLORS: {
            '--topbar-color': '#c6bdb3',
            '--window-color': '#dcd6cc',
            '--titlebar-color': '#4a6c7a',
            '--terminal-bg-color': '#070b0d',
            '--terminal-text-color': '#c7fbe3',
            '--dock-color': '#e6e1d8',
            '--menu-color': '#bfb6aa',
            '--dock-icon-bg': '#bfb9ad',
            '--dock-icon-hover': '#e0dad0',
            '--dock-icon-active': '#d8d1c6',
            '--button-bg': '#bfb6aa',
            '--button-active': '#d6cec4',
            '--separator-color': '#8f877d',
            '--modal-bg': '#dcd6cc',
            '--scrollbar-color': '#00ff88',
        },
        FONTS: {
            '--font-family-base': '"Fixedsys", "Lucida Console", monospace',
            '--font-family-terminal': '"Courier New", monospace',
            '--font-size-base': '12px',
            '--font-size-title': '13px',
            '--font-size-small': '11px',
            '--font-weight-normal': '400',
            '--font-weight-bold': '700',
            '--line-height-base': '1.45',
        },
    },
    THEMES: {
        platinum: {
            '--topbar-color': '#c0c0c0',
            '--window-color': '#c0c0c0',
            '--titlebar-color': '#000080',
            '--dock-color': '#a0a0a0',
            '--menu-color': '#c0c0c0',
            '--dock-icon-bg': '#b0b0b0',
            '--dock-icon-hover': '#d0d0d0',
            '--dock-icon-active': '#e0e0e0',
            '--button-bg': '#b0b0b0',
            '--button-active': '#d0d0d0',
            '--separator-color': '#808080',
            '--modal-bg': '#c0c0c0',
            '--scrollbar-color': '#000080',
            '--terminal-bg-color': '#000000',
            '--terminal-text-color': '#00ff00',
        },
        olive: {
            '--topbar-color': '#c0c0a0',
            '--window-color': '#c0c0a0',
            '--titlebar-color': '#3c5a3c',
            '--dock-color': '#a0a080',
            '--menu-color': '#c0c0a0',
            '--dock-icon-bg': '#b0b090',
            '--dock-icon-hover': '#d0d0b0',
            '--dock-icon-active': '#e0e0c0',
            '--button-bg': '#b0b090',
            '--button-active': '#d0d0b0',
            '--separator-color': '#808060',
            '--modal-bg': '#c0c0a0',
            '--scrollbar-color': '#3c5a3c',
            '--terminal-bg-color': '#1e2a1e',
            '--terminal-text-color': '#c0ffc0',
        },
        marine: {
            '--topbar-color': '#a0c0e0',
            '--window-color': '#a0c0e0',
            '--titlebar-color': '#2a4a6a',
            '--dock-color': '#8090c0',
            '--menu-color': '#a0c0e0',
            '--dock-icon-bg': '#90b0d0',
            '--dock-icon-hover': '#c0d8f0',
            '--dock-icon-active': '#d0e8ff',
            '--button-bg': '#90b0d0',
            '--button-active': '#c0d8f0',
            '--separator-color': '#6080a0',
            '--modal-bg': '#a0c0e0',
            '--scrollbar-color': '#2a4a6a',
            '--terminal-bg-color': '#0a1a2a',
            '--terminal-text-color': '#a0d0ff',
        },
        sand: {
            '--topbar-color': '#e0d0c0',
            '--window-color': '#e0d0c0',
            '--titlebar-color': '#8b6b4b',
            '--dock-color': '#c0b0a0',
            '--menu-color': '#e0d0c0',
            '--dock-icon-bg': '#d0c0b0',
            '--dock-icon-hover': '#f0e0d0',
            '--dock-icon-active': '#f8f0e8',
            '--button-bg': '#d0c0b0',
            '--button-active': '#f0e0d0',
            '--separator-color': '#a09080',
            '--modal-bg': '#e0d0c0',
            '--scrollbar-color': '#8b6b4b',
            '--terminal-bg-color': '#2a1e14',
            '--terminal-text-color': '#e0d0a0',
        },
        midnight: {
            '--topbar-color': '#1a2b3c',
            '--window-color': '#1e2f40',
            '--titlebar-color': '#2c4c6c',
            '--dock-color': '#1a2b3c',
            '--menu-color': '#2a3b4c',
            '--dock-icon-bg': '#2a3b4c',
            '--dock-icon-hover': '#3a4b5c',
            '--dock-icon-active': '#4a5b6c',
            '--button-bg': '#2a3b4c',
            '--button-active': '#3a4b5c',
            '--separator-color': '#3a4b5c',
            '--modal-bg': '#1e2f40',
            '--scrollbar-color': '#5a9eff',
            '--terminal-bg-color': '#0a1a2a',
            '--terminal-text-color': '#5a9eff',
            '--text-color': '#ffffff',
            '--button-text': '#ffffff',
        },
        cobalt: {
            '--topbar-color': '#003366',
            '--window-color': '#004080',
            '--titlebar-color': '#1a5c9e',
            '--dock-color': '#003366',
            '--menu-color': '#004080',
            '--dock-icon-bg': '#004d99',
            '--dock-icon-hover': '#0066cc',
            '--dock-icon-active': '#1a8cff',
            '--button-bg': '#004d99',
            '--button-active': '#0066cc',
            '--separator-color': '#002244',
            '--modal-bg': '#004080',
            '--scrollbar-color': '#ffaa00',
            '--terminal-bg-color': '#001a33',
            '--terminal-text-color': '#ffaa00',
            '--text-color': '#ffffff',
        },
        forest: {
            '--topbar-color': '#2a5a2a',
            '--window-color': '#2e6230',
            '--titlebar-color': '#4a784a',
            '--dock-color': '#2a5a2a',
            '--menu-color': '#3a6a3a',
            '--dock-icon-bg': '#3a6a3a',
            '--dock-icon-hover': '#4a7a4a',
            '--dock-icon-active': '#5a8a5a',
            '--button-bg': '#3a6a3a',
            '--button-active': '#4a7a4a',
            '--separator-color': '#1a3a1a',
            '--modal-bg': '#2e6230',
            '--scrollbar-color': '#ffcc66',
            '--terminal-bg-color': '#0a1a0a',
            '--terminal-text-color': '#ccff99',
            '--text-color': '#ffffff',
        },
        sunset: {
            '--topbar-color': '#b84c4c',
            '--window-color': '#c45c5c',
            '--titlebar-color': '#9c3c3c',
            '--dock-color': '#b84c4c',
            '--menu-color': '#c45c5c',
            '--dock-icon-bg': '#b84c4c',
            '--dock-icon-hover': '#d46c6c',
            '--dock-icon-active': '#e47c7c',
            '--button-bg': '#b84c4c',
            '--button-active': '#c45c5c',
            '--separator-color': '#8c3c3c',
            '--modal-bg': '#c45c5c',
            '--scrollbar-color': '#ffd700',
            '--terminal-bg-color': '#2a1a1a',
            '--terminal-text-color': '#ffb347',
            '--text-color': '#ffffff',
        },
        amber: {
            '--topbar-color': '#c49a6c',
            '--window-color': '#d4aa7c',
            '--titlebar-color': '#a07a4a',
            '--dock-color': '#c49a6c',
            '--menu-color': '#d4aa7c',
            '--dock-icon-bg': '#c49a6c',
            '--dock-icon-hover': '#e4ba8c',
            '--dock-icon-active': '#f4ca9c',
            '--button-bg': '#c49a6c',
            '--button-active': '#d4aa7c',
            '--separator-color': '#947a4a',
            '--modal-bg': '#d4aa7c',
            '--scrollbar-color': '#6a4a2a',
            '--terminal-bg-color': '#2a1e0a',
            '--terminal-text-color': '#ffbf00',
            '--text-color': '#000000',
        },
        monochrome: {
            '--topbar-color': '#e0e0e0',
            '--window-color': '#f0f0f0',
            '--titlebar-color': '#808080',
            '--dock-color': '#d0d0d0',
            '--menu-color': '#e0e0e0',
            '--dock-icon-bg': '#d0d0d0',
            '--dock-icon-hover': '#ffffff',
            '--dock-icon-active': '#c0c0c0',
            '--button-bg': '#d0d0d0',
            '--button-active': '#e0e0e0',
            '--separator-color': '#a0a0a0',
            '--modal-bg': '#f0f0f0',
            '--scrollbar-color': '#404040',
            '--terminal-bg-color': '#000000',
            '--terminal-text-color': '#00ff00',
            '--text-color': '#000000',
        },
    },
    FONT_PRESETS: {
        'classic-cde': {
            '--font-family-base': '"Fixedsys", "Lucida Console", monospace',
            '--font-family-terminal': '"Courier New", monospace',
            '--font-size-base': '12px',
            '--font-size-title': '13px',
            '--font-size-small': '11px',
            '--font-weight-normal': '400',
            '--font-weight-bold': '700',
            '--line-height-base': '1.45',
        },
        modern: {
            '--font-family-base': 'Arial, sans-serif',
            '--font-family-terminal': 'Consolas, monospace',
            '--font-size-base': '14px',
            '--font-size-title': '15px',
            '--font-size-small': '12px',
            '--font-weight-normal': '400',
            '--font-weight-bold': '700',
            '--line-height-base': '1.5',
        },
        retro: {
            '--font-family-base': '"MS Sans Serif", sans-serif',
            '--font-family-terminal': '"Lucida Console", monospace',
            '--font-size-base': '11px',
            '--font-size-title': '12px',
            '--font-size-small': '10px',
            '--font-weight-normal': '700',
            '--font-weight-bold': '900',
            '--line-height-base': '1.3',
        },
        terminal: {
            '--font-family-base': '"Ubuntu Mono", monospace',
            '--font-family-terminal': '"DejaVu Sans Mono", monospace',
            '--font-size-base': '13px',
            '--font-size-title': '14px',
            '--font-size-small': '12px',
            '--font-weight-normal': '400',
            '--font-weight-bold': '700',
            '--line-height-base': '1.4',
        },
    },
};

if (typeof window !== 'undefined') {
    (window as any).CONFIG = CONFIG;
}

export default CONFIG;