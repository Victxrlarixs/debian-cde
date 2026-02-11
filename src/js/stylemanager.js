// stylemanager.js - VERSIÓN MEJORADA CON TEMAS CDE CLÁSICOS

class StyleManager {
    constructor() {
        this.styles = {
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
        };

        // TEMAS CDE CLÁSICOS - TODOS COLORES SÓLIDOS
        this.presets = {
            'platinum': {
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
                '--scrollbar-color': '#000080'
            },
            'olive': {
                '--topbar-color': '#c0c0a0',
                '--window-color': '#c0c0a0',
                '--titlebar-color': '#006400',
                '--dock-color': '#a0a080',
                '--menu-color': '#c0c0a0',
                '--dock-icon-bg': '#b0b090',
                '--dock-icon-hover': '#d0d0b0',
                '--dock-icon-active': '#e0e0c0',
                '--button-bg': '#b0b090',
                '--button-active': '#d0d0b0',
                '--separator-color': '#808060',
                '--modal-bg': '#c0c0a0',
                '--scrollbar-color': '#006400'
            },
            'marine': {
                '--topbar-color': '#a0c0e0',
                '--window-color': '#a0c0e0',
                '--titlebar-color': '#000060',
                '--dock-color': '#8090c0',
                '--menu-color': '#a0c0e0',
                '--dock-icon-bg': '#90b0d0',
                '--dock-icon-hover': '#c0d8f0',
                '--dock-icon-active': '#d0e8ff',
                '--button-bg': '#90b0d0',
                '--button-active': '#c0d8f0',
                '--separator-color': '#6080a0',
                '--modal-bg': '#a0c0e0',
                '--scrollbar-color': '#000060'
            },
            'sand': {
                '--topbar-color': '#e0d0c0',
                '--window-color': '#e0d0c0',
                '--titlebar-color': '#806040',
                '--dock-color': '#c0b0a0',
                '--menu-color': '#e0d0c0',
                '--dock-icon-bg': '#d0c0b0',
                '--dock-icon-hover': '#f0e0d0',
                '--dock-icon-active': '#f8f0e8',
                '--button-bg': '#d0c0b0',
                '--button-active': '#f0e0d0',
                '--separator-color': '#a09080',
                '--modal-bg': '#e0d0c0',
                '--scrollbar-color': '#806040'
            },
            'graphite': {
                '--topbar-color': '#404040',
                '--window-color': '#505050',
                '--titlebar-color': '#202020',
                '--dock-color': '#303030',
                '--menu-color': '#404040',
                '--dock-icon-bg': '#303030',
                '--dock-icon-hover': '#606060',
                '--dock-icon-active': '#707070',
                '--button-bg': '#303030',
                '--button-active': '#505050',
                '--separator-color': '#202020',
                '--modal-bg': '#404040',
                '--scrollbar-color': '#00ff00',
                '--terminal-bg-color': '#000000',
                '--terminal-text-color': '#00ff00'
            },
            'midnight': {
                '--topbar-color': '#000020',
                '--window-color': '#000030',
                '--titlebar-color': '#000010',
                '--dock-color': '#000040',
                '--menu-color': '#000020',
                '--dock-icon-bg': '#000030',
                '--dock-icon-hover': '#000060',
                '--dock-icon-active': '#000080',
                '--button-bg': '#000030',
                '--button-active': '#000050',
                '--separator-color': '#000010',
                '--modal-bg': '#000020',
                '--scrollbar-color': '#0080ff',
                '--terminal-bg-color': '#000010',
                '--terminal-text-color': '#0080ff'
            },
            'desert': {
                '--topbar-color': '#d8c8a8',
                '--window-color': '#e8d8b8',
                '--titlebar-color': '#a08040',
                '--dock-color': '#c8b898',
                '--menu-color': '#d8c8a8',
                '--dock-icon-bg': '#c8b898',
                '--dock-icon-hover': '#f8e8c8',
                '--dock-icon-active': '#fff8e8',
                '--button-bg': '#c8b898',
                '--button-active': '#e8d8b8',
                '--separator-color': '#a09070',
                '--modal-bg': '#d8c8a8',
                '--scrollbar-color': '#a08040'
            }
        };

        this.defaultStyles = { ...this.styles };
    }

    init() {
        this.loadSavedStyles();
        this.bindEvents();
        this.updateUI();
        console.log('Style Manager initialized with CDE themes');
    }

    bindEvents() {
        console.log('Binding events...');

        // Icono para abrir el Style Manager
        const styleManagerIcon = document.querySelector('.cde-icon img[src*="appearance"]')?.parentElement;
        if (styleManagerIcon) {
            styleManagerIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        }

        // Botón de cerrar
        const closeBtn = document.querySelector('#styleManager .cde-window-btn.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Selectores de color - CONECTADOS A LAS VARIABLES CORRECTAS
        this.setupColorInputs();

        // Botones de acción
        const applyBtn = document.querySelector('#styleManager .cde-btn-default');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.apply());
        }

        const resetBtn = document.querySelector('#styleManager .cde-btn:nth-child(2)');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }

        const saveBtn = document.querySelector('#styleManager .cde-btn:nth-child(3)');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.save());
        }

        // Presets de temas
        document.querySelectorAll('.cde-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scheme = e.target.dataset.scheme;
                this.applyPreset(scheme);
            });
        });

        // Categorías
        document.querySelectorAll('.cde-category').forEach(cat => {
            cat.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.setActiveCategory(category);
            });
        });

        // Arrastrar ventana
        const titlebar = document.getElementById('styleManagerTitlebar');
        if (titlebar) {
            titlebar.addEventListener('mousedown', (e) => this.startDrag(e));
        }
    }

    setupColorInputs() {
        // Mapeo de inputs a variables CSS
        const colorMap = {
            'color-topbar': '--topbar-color',
            'color-window': '--window-color',
            'color-titlebar': '--titlebar-color',
            'color-terminal-bg': '--terminal-bg-color',
            'color-terminal-text': '--terminal-text-color',
            'color-dock': '--dock-color',
            'color-menu': '--menu-color',
            'color-dock-icon': '--dock-icon-bg',
            'color-dock-hover': '--dock-icon-hover',
            'color-dock-active': '--dock-icon-active',
            'color-button': '--button-bg',
            'color-button-active': '--button-active',
            'color-separator': '--separator-color',
            'color-modal': '--modal-bg',
            'color-scrollbar': '--scrollbar-color'
        };

        // Crear inputs dinámicamente o usar los existentes
        Object.entries(colorMap).forEach(([inputId, cssVar]) => {
            let input = document.getElementById(inputId);
            if (!input) {
                // Crear input si no existe
                input = document.createElement('input');
                input.type = 'color';
                input.id = inputId;
                input.dataset.var = cssVar;
                input.value = this.styles[cssVar] || '#000000';

                // Añadir al panel de colores
                const colorsPanel = document.getElementById('colors-panel');
                if (colorsPanel) {
                    const row = document.createElement('div');
                    row.className = 'cde-controlrow';

                    const label = document.createElement('label');
                    label.className = 'cde-label';
                    label.textContent = this.getLabelFromId(inputId);

                    const selector = document.createElement('div');
                    selector.className = 'cde-colorselector';

                    const swatch = document.createElement('div');
                    swatch.className = 'cde-colorswatch';
                    swatch.style.backgroundColor = input.value;

                    const name = document.createElement('span');
                    name.className = 'cde-colorname';
                    name.textContent = this.getColorName(input.value);

                    selector.appendChild(input);
                    selector.appendChild(swatch);
                    selector.appendChild(name);
                    row.appendChild(label);
                    row.appendChild(selector);
                    colorsPanel.appendChild(row);
                }
            }

            // Añadir event listener
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                const cssVar = e.target.dataset.var;
                this.applyStyle(cssVar, value);

                // Actualizar swatch y nombre
                const swatch = e.target.nextElementSibling;
                const nameSpan = swatch?.nextElementSibling;
                if (swatch) swatch.style.backgroundColor = value;
                if (nameSpan) nameSpan.textContent = this.getColorName(value);

                this.updateStatus(`Changed: ${this.getLabelFromId(inputId)}`);
            });
        });
    }

    getLabelFromId(id) {
        const labels = {
            'color-topbar': 'Topbar',
            'color-window': 'Window',
            'color-titlebar': 'Titlebar',
            'color-terminal-bg': 'Terminal BG',
            'color-terminal-text': 'Terminal Text',
            'color-dock': 'Dock',
            'color-menu': 'Menu',
            'color-dock-icon': 'Dock Icon',
            'color-dock-hover': 'Dock Hover',
            'color-dock-active': 'Dock Active',
            'color-button': 'Button',
            'color-button-active': 'Button Active',
            'color-separator': 'Separator',
            'color-modal': 'Modal',
            'color-scrollbar': 'Scrollbar'
        };
        return labels[id] || id.replace('color-', '').replace(/-/g, ' ');
    }

    open() {
        const modal = document.getElementById('styleManager');
        if (modal) {
            modal.style.display = 'flex';
            modal.style.zIndex = '10000';
            console.log('Style Manager opened');
        }
    }

    close() {
        const modal = document.getElementById('styleManager');
        if (modal) {
            modal.style.display = 'none';
            console.log('Style Manager closed');
        }
    }

    applyStyle(cssVar, value) {
        document.documentElement.style.setProperty(cssVar, value);
        this.styles[cssVar] = value;
    }

    apply() {
        this.applyAllStyles();
        this.updateStatus('All changes applied');
        this.showMessage('✓ Styles applied successfully');
    }

    applyAllStyles() {
        for (const [cssVar, value] of Object.entries(this.styles)) {
            document.documentElement.style.setProperty(cssVar, value);
        }
    }

    applyPreset(scheme) {
        if (this.presets[scheme]) {
            console.log(`Applying preset: ${scheme}`);
            for (const [cssVar, value] of Object.entries(this.presets[scheme])) {
                this.applyStyle(cssVar, value);

                // Actualizar UI
                const input = document.querySelector(`input[data-var="${cssVar}"]`);
                if (input) {
                    input.value = value;
                    const swatch = input.nextElementSibling;
                    const nameSpan = swatch?.nextElementSibling;
                    if (swatch) swatch.style.backgroundColor = value;
                    if (nameSpan) nameSpan.textContent = this.getColorName(value);
                }
            }
            this.updateStatus(`Applied theme: ${scheme}`);
            this.showMessage(`✓ ${scheme} theme applied`);
        }
    }

    reset() {
        for (const [cssVar, value] of Object.entries(this.defaultStyles)) {
            this.applyStyle(cssVar, value);
        }
        this.updateUI();
        this.updateStatus('Reset to default');
        this.showMessage('✓ Reset to default theme');
    }

    save() {
        try {
            localStorage.setItem('cde-styles', JSON.stringify(this.styles));
            this.updateStatus('Settings saved');
            this.showMessage('✓ Configuration saved');
            console.log('Styles saved to localStorage');
        } catch (e) {
            this.showMessage('✗ Error saving configuration');
            console.error('Error saving styles:', e);
        }
    }

    loadSavedStyles() {
        try {
            const saved = localStorage.getItem('cde-styles');
            if (saved) {
                const savedStyles = JSON.parse(saved);
                Object.assign(this.styles, savedStyles);
                this.applyAllStyles();
                console.log('Loaded saved styles from localStorage');
            }
        } catch (e) {
            console.log('No saved styles found');
        }
    }

    updateUI() {
        for (const [cssVar, value] of Object.entries(this.styles)) {
            const input = document.querySelector(`input[data-var="${cssVar}"]`);
            if (input) {
                input.value = value;
                const swatch = input.nextElementSibling;
                const nameSpan = swatch?.nextElementSibling;
                if (swatch) swatch.style.backgroundColor = value;
                if (nameSpan) nameSpan.textContent = this.getColorName(value);
            }
        }
        console.log('UI updated with current styles');
    }

    setActiveCategory(category) {
        document.querySelectorAll('.cde-category').forEach(cat => {
            cat.classList.remove('active');
        });

        document.querySelectorAll('.cde-controlgroup').forEach(panel => {
            panel.classList.remove('active');
        });

        const activeCat = document.querySelector(`.cde-category[data-category="${category}"]`);
        const activePanel = document.getElementById(`${category}-panel`);

        if (activeCat) activeCat.classList.add('active');
        if (activePanel) activePanel.classList.add('active');

        this.updateStatus(`Viewing: ${category}`);
    }

    getColorName(hex) {
        const colors = {
            '#000000': 'Black', '#ffffff': 'White',
            '#c0c0c0': 'Light Gray', '#808080': 'Gray',
            '#404040': 'Dark Gray', '#000080': 'Navy Blue',
            '#0000ff': 'Blue', '#008000': 'Green',
            '#00ff00': 'Lime', '#800000': 'Maroon',
            '#ff0000': 'Red', '#800080': 'Purple',
            '#ff00ff': 'Magenta', '#808000': 'Olive',
            '#ffff00': 'Yellow', '#008080': 'Teal',
            '#00ffff': 'Cyan', '#a0a0a0': 'Gray',
            '#e0d0c0': 'Sand', '#a0c0e0': 'Marine',
            '#c0c0a0': 'Olive', '#c6bdb3': 'Beige',
            '#dcd6cc': 'Cream', '#4a6c7a': 'Steel Blue',
            '#070b0d': 'Dark Slate', '#c7fbe3': 'Mint',
            '#e6e1d8': 'Pearl', '#bfb6aa': 'Taupe',
            '#bfb9ad': 'Warm Gray', '#e0dad0': 'Light Cream',
            '#d8d1c6': 'Cream Gray', '#8f877d': 'Dark Taupe',
            '#00ff88': 'Cyber Green', '#006400': 'Dark Green',
            '#000060': 'Dark Navy', '#806040': 'Brown',
            '#202020': 'Charcoal', '#303030': 'Dark Gray',
            '#505050': 'Medium Gray', '#000020': 'Midnight Blue',
            '#000030': 'Deep Navy', '#000040': 'Night Blue',
            '#0080ff': 'Azure', '#d8c8a8': 'Desert Sand',
            '#a08040': 'Golden Brown'
        };

        return colors[hex.toLowerCase()] || hex.toUpperCase();
    }

    updateStatus(message) {
        const statusElement = document.getElementById('style-status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    showMessage(message) {
        const msgBox = document.createElement('div');
        msgBox.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--modal-bg, #c0c0c0);
            border: 2px solid;
            border-top-color: var(--border-light, #ffffff);
            border-left-color: var(--border-light, #ffffff);
            border-right-color: var(--border-dark, #404040);
            border-bottom-color: var(--border-dark, #404040);
            padding: 20px;
            z-index: 10001;
            font-family: var(--font-family, monospace);
            font-size: 12px;
            color: #000000;
            box-shadow: 4px 4px 0 var(--shadow-color, #000000);
            min-width: 200px;
            text-align: center;
        `;

        msgBox.innerHTML = `
            <div style="margin-bottom: 10px;">${message}</div>
            <button onclick="this.parentElement.remove()" 
                    style="padding: 4px 16px; margin-top: 10px; cursor: pointer;
                           background: var(--button-bg); border: 1px solid;
                           border-top-color: var(--border-light); border-left-color: var(--border-light);
                           border-right-color: var(--border-dark); border-bottom-color: var(--border-dark);">
                OK
            </button>
        `;

        document.body.appendChild(msgBox);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (msgBox.parentNode) {
                msgBox.parentNode.removeChild(msgBox);
            }
        }, 1000);
    }

    startDrag(e) {
        if (e.target.classList.contains('cde-window-btn')) return;

        const modal = document.getElementById('styleManager');
        if (!modal) return;

        const rect = modal.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        let offsetY = e.clientY - rect.top;

        const onMouseMove = (moveEvent) => {
            modal.style.left = `${moveEvent.clientX - offsetX}px`;
            modal.style.top = `${moveEvent.clientY - offsetY}px`;
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        e.preventDefault();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.styleManager = new StyleManager();

    setTimeout(() => {
        window.styleManager.init();
    }, 100);

    window.openStyleManager = function () {
        if (window.styleManager) {
            window.styleManager.open();
        }
    };

    console.log('CDE Style Manager loaded with 7 classic themes');
});

// Hacer que el Style Manager sea arrastrable
if (document.getElementById('styleManager')) {
    const styleManager = document.getElementById('styleManager');
    const styleManagerTitlebar = document.getElementById('styleManagerTitlebar');

    makeDraggable(styleManager, styleManagerTitlebar);

    // Función para abrir el Style Manager
    window.openStyleManager = function () {
        styleManager.style.display = 'block';
        // Centrar en pantalla
        styleManager.style.top = '50%';
        styleManager.style.left = '50%';
        styleManager.style.transform = 'translate(-50%, -50%)';
    };// stylemanager.js - Solo lógica, NO crea HTML

    // Variables globales
    let currentTab = 'colors';
    let isDraggingStyleManager = false;
    let dragOffset = { x: 0, y: 0 };

    // Función para abrir el Style Manager
    function openStyleManager() {
        const styleManager = document.getElementById('styleManager');
        if (!styleManager) return;

        styleManager.style.display = 'block';
        // Centrar en pantalla
        styleManager.style.top = '50%';
        styleManager.style.left = '50%';
        styleManager.style.transform = 'translate(-50%, -50%)';

        // Inicializar controles
        initColorSwatches();
        initFontControls();

        updateStatus('Style Manager opened');
    }

    // Función para cerrar el Style Manager
    function closeStyleManager() {
        const styleManager = document.getElementById('styleManager');
        if (styleManager) {
            styleManager.style.display = 'none';
        }
        updateStatus('Style Manager closed');
    }

    // Cambiar entre pestañas
    function switchStyleTab(tabName) {
        currentTab = tabName;

        // Actualizar categorías activas
        document.querySelectorAll('.cde-category').forEach(cat => {
            cat.classList.remove('active');
        });

        document.querySelector(`.cde-category[onclick*="${tabName}"]`).classList.add('active');

        // Mostrar/ocultar paneles
        document.querySelectorAll('.cde-controlgroup').forEach(panel => {
            panel.classList.remove('active');
        });

        document.getElementById(`${tabName}-panel`).classList.add('active');

        updateStatus(`Switched to ${tabName} tab`);
    }

    // Inicializar muestras de color
    function initColorSwatches() {
        const colorIds = ['workspace', 'title-active', 'background', 'highlight', 'text'];

        colorIds.forEach(id => {
            const input = document.getElementById(`color-${id}`);
            const swatch = document.getElementById(`${id}-swatch`);

            if (input && swatch) {
                swatch.style.backgroundColor = input.value;

                // Actualizar al cambiar el color
                input.addEventListener('input', function () {
                    swatch.style.backgroundColor = this.value;
                    updateColorName(id, this.value);
                });
            }
        });
    }

    // Actualizar nombre del color
    function updateColorName(id, hexColor) {
        const colorNames = {
            '#a0a0a0': 'Gray',
            '#000080': 'Navy Blue',
            '#c0c0c0': 'Light Gray',
            '#0000ff': 'Blue',
            '#000000': 'Black',
            '#ffffff': 'White',
            '#808080': 'Gray',
            '#008000': 'Green',
            '#800080': 'Purple',
            '#ff0000': 'Red',
            '#ffff00': 'Yellow'
        };

        const nameSpan = document.querySelector(`#color-${id}`).parentNode.querySelector('.cde-colorname');
        if (nameSpan) {
            nameSpan.textContent = colorNames[hexColor.toLowerCase()] || hexColor;
        }
    }

    // Inicializar controles de fuente
    function initFontControls() {
        const fontSizeSlider = document.getElementById('font-size');
        const fontSizeValue = document.getElementById('font-size-value');

        if (fontSizeSlider && fontSizeValue) {
            fontSizeValue.textContent = fontSizeSlider.value;

            fontSizeSlider.addEventListener('input', function () {
                fontSizeValue.textContent = this.value;
            });
        }
    }

    // Aplicar temas predefinidos
    function applyTheme(themeName) {
        const themes = {
            'platinum': {
                workspace: '#a0a0a0',
                titleActive: '#000080',
                background: '#c0c0c0',
                highlight: '#0000ff',
                text: '#000000'
            },
            'olive': {
                workspace: '#808000',
                titleActive: '#004000',
                background: '#c0c0a0',
                highlight: '#008000',
                text: '#000000'
            },
            'marine': {
                workspace: '#000080',
                titleActive: '#000040',
                background: '#a0c0ff',
                highlight: '#0000ff',
                text: '#ffffff'
            },
            'sand': {
                workspace: '#c0a060',
                titleActive: '#804000',
                background: '#f0e0c0',
                highlight: '#a06000',
                text: '#000000'
            },
            'graphite': {
                workspace: '#404040',
                titleActive: '#000000',
                background: '#808080',
                highlight: '#000000',
                text: '#ffffff'
            },
            'midnight': {
                workspace: '#000040',
                titleActive: '#000000',
                background: '#000080',
                highlight: '#0000ff',
                text: '#ffffff'
            },
            'desert': {
                workspace: '#a06040',
                titleActive: '#804000',
                background: '#f0c0a0',
                highlight: '#c08000',
                text: '#000000'
            }
        };

        const theme = themes[themeName];
        if (!theme) return;

        // Aplicar colores a los inputs
        document.getElementById('color-workspace').value = theme.workspace;
        document.getElementById('color-title-active').value = theme.titleActive;
        document.getElementById('color-background').value = theme.background;
        document.getElementById('color-highlight').value = theme.highlight;
        document.getElementById('color-text').value = theme.text;

        // Actualizar swatches
        initColorSwatches();

        updateStatus(`Applied ${themeName} theme`);
    }

    // Aplicar cambios de estilo
    function applyStyleChanges() {
        // Obtener valores
        const workspaceColor = document.getElementById('color-workspace').value;
        const titleActiveColor = document.getElementById('color-title-active').value;
        const backgroundColor = document.getElementById('color-background').value;
        const highlightColor = document.getElementById('color-highlight').value;
        const textColor = document.getElementById('color-text').value;

        // Aplicar a las variables CSS
        const root = document.documentElement;
        root.style.setProperty('--topbar-color', workspaceColor);
        root.style.setProperty('--titlebar-color', titleActiveColor);
        root.style.setProperty('--window-color', backgroundColor);
        root.style.setProperty('--scrollbar-color', highlightColor);
        root.style.setProperty('--terminal-text-color', textColor);

        updateStatus('Style changes applied');
    }

    // Resetear cambios
    function resetStyleChanges() {
        // Restaurar valores por defecto
        const defaultColors = {
            'color-workspace': '#a0a0a0',
            'color-title-active': '#000080',
            'color-background': '#c0c0c0',
            'color-highlight': '#0000ff',
            'color-text': '#000000'
        };

        Object.keys(defaultColors).forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = defaultColors[id];
        });

        initColorSwatches();
        updateStatus('Style reset to defaults');
    }

    // Guardar cambios
    function saveStyleChanges() {
        // Aquí iría la lógica para guardar en localStorage o servidor
        localStorage.setItem('cde-theme', JSON.stringify({
            workspace: document.getElementById('color-workspace').value,
            titleActive: document.getElementById('color-title-active').value,
            background: document.getElementById('color-background').value,
            highlight: document.getElementById('color-highlight').value,
            text: document.getElementById('color-text').value
        }));

        updateStatus('Settings saved');
    }

    // Actualizar barra de estado
    function updateStatus(message) {
        const statusEl = document.getElementById('style-status');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    // Arrastrar ventana
    function startDrag(e, elementId) {
        if (e.target.closest('.cde-window-btn')) return;

        const element = document.getElementById(elementId);
        if (!element) return;

        isDraggingStyleManager = true;

        const rect = element.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;

        document.addEventListener('mousemove', dragStyleManager);
        document.addEventListener('mouseup', stopDragStyleManager);

        e.preventDefault();
    }

    function dragStyleManager(e) {
        if (!isDraggingStyleManager) return;

        const element = document.getElementById('styleManager');
        if (!element) return;

        element.style.left = (e.clientX - dragOffset.x) + 'px';
        element.style.top = (e.clientY - dragOffset.y) + 'px';
        element.style.transform = 'none';
    }

    function stopDragStyleManager() {
        isDraggingStyleManager = false;
        document.removeEventListener('mousemove', dragStyleManager);
        document.removeEventListener('mouseup', stopDragStyleManager);
    }

    // Inicialización cuando se carga la página
    document.addEventListener('DOMContentLoaded', function () {
        // Cargar configuración guardada
        const savedTheme = localStorage.getItem('cde-theme');
        if (savedTheme) {
            try {
                const theme = JSON.parse(savedTheme);
                // Aplicar tema guardado
                if (theme.workspace) document.getElementById('color-workspace').value = theme.workspace;
                if (theme.titleActive) document.getElementById('color-title-active').value = theme.titleActive;
                if (theme.background) document.getElementById('color-background').value = theme.background;
                if (theme.highlight) document.getElementById('color-highlight').value = theme.highlight;
                if (theme.text) document.getElementById('color-text').value = theme.text;
            } catch (e) {
                console.error('Error loading saved theme:', e);
            }
        }

        // Hacer que el icono del Style Manager abra el modal
        const styleIcon = document.querySelector('.cde-icon[onclick*="openStyleManager"]');
        if (styleIcon) {
            styleIcon.onclick = openStyleManager;
        }
    });

    // Función para cerrar
    styleManager.close = function () {
        styleManager.style.display = 'none';
    };

    // Aplicar cambios
    styleManager.apply = function () {
        // Lógica para aplicar cambios de estilo
        console.log('Aplicando cambios de estilo...');
    };

    // Resetear
    styleManager.reset = function () {
        // Lógica para resetear estilos
        console.log('Resetando estilos...');
    };

    // Guardar
    styleManager.save = function () {
        // Lógica para guardar configuración
        console.log('Guardando configuración...');
    };
}