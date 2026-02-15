/**
 * @fileoverview Configuración global del proyecto CDE.
 * Todas las constantes, rutas, tiempos y valores por defecto centralizados.
 * @author victxrlarixs
 */

const CONFIG = {
    // ==================================================================
    // UTILITIES
    // ==================================================================
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

    // ==================================================================
    // SISTEMA DE ARCHIVOS VIRTUAL
    // ==================================================================
    FILEMANAGER: {
        BASE_Z_INDEX: 1000,
    },

    FS: {
        HOME: '/home/victxrlarixs/',
        DESKTOP: '/home/victxrlarixs/Desktop/',
        TRASH: '/home/victxrlarixs/.Trash/',
        NETWORK: '/network/',
    },

    // ==================================================================
    // TERMINAL Y TUTORIAL
    // ==================================================================
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
            '🌐 Explorando comandos de red...'
        ],
    },

    // ==================================================================
    // ARRANQUE (BOOT)
    // ==================================================================
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

    // ==================================================================
    // VENTANAS (WINDOW MANAGER) – duplicado, dejamos uno solo
    // ==================================================================
    WINDOW: {
        MIN_VISIBLE: 20,
        BASE_Z_INDEX: 100,
    },

    // ==================================================================
    // TASK MANAGER
    // ==================================================================
    TASK_MANAGER: {
        BUTTON_ID: 'taskmanager-btn',
        WINDOW_ID: 'taskmanager',
        BASE_Z_INDEX: 2000,
    },

    // ==================================================================
    // ESTILOS POR DEFECTO (colores y fuentes base)
    // ==================================================================
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
            '--scrollbar-color': '#00ff88'
        },
        FONTS: {
            '--font-family-base': '"Fixedsys", "Lucida Console", monospace',
            '--font-family-terminal': '"Courier New", monospace',
            '--font-size-base': '12px',
            '--font-size-title': '13px',
            '--font-size-small': '11px',
            '--font-weight-normal': '400',
            '--font-weight-bold': '700',
            '--line-height-base': '1.45'
        }
    },

    // Espacios para los datos que vendrán del JSON
    THEMES: {},
    FONT_PRESETS: {},

    // Método para cargar temas desde JSON
    async loadThemes() {
        try {
            const response = await fetch('./src/themes.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            this.THEMES = data.THEMES;
            this.FONT_PRESETS = data.FONT_PRESETS;
            console.log('✅ Temas cargados desde JSON');
        } catch (e) {
            console.error('❌ Error cargando temas:', e);
            // Opcional: asignar fallback con temas vacíos o por defecto
        }
    }
};

// Exponer globalmente
window.CONFIG = CONFIG;