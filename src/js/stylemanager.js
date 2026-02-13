// stylemanager.js - VERSIÓN COMPLETA CON SOPORTE PARA COLORES Y FUENTES
// AHORA CON MISMA CLASE .cde-preset PARA TODOS LOS BOTONES

class StyleManager {
    constructor() {
        // Estilos de color por defecto
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

        // Estilos de fuente por defecto
        this.fontStyles = {
            '--font-family-base': '"Fixedsys", "Lucida Console", monospace',
            '--font-family-terminal': '"Courier New", monospace',
            '--font-size-base': '12px',
            '--font-size-title': '13px',
            '--font-size-small': '11px',
            '--font-weight-normal': '400',
            '--font-weight-bold': '700',
            '--line-height-base': '1.45'
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

        // Presets de fuentes
        this.fontPresets = {
            'classic-cde': {
                '--font-family-base': '"Fixedsys", "Lucida Console", monospace',
                '--font-family-terminal': '"Courier New", monospace',
                '--font-size-base': '12px',
                '--font-size-title': '13px',
                '--font-size-small': '11px',
                '--font-weight-normal': '400',
                '--font-weight-bold': '700',
                '--line-height-base': '1.45'
            },
            'modern': {
                '--font-family-base': 'Arial, sans-serif',
                '--font-family-terminal': 'Consolas, monospace',
                '--font-size-base': '14px',
                '--font-size-title': '15px',
                '--font-size-small': '12px',
                '--font-weight-normal': '400',
                '--font-weight-bold': '700',
                '--line-height-base': '1.5'
            },
            'retro': {
                '--font-family-base': '"MS Sans Serif", sans-serif',
                '--font-family-terminal': '"Lucida Console", monospace',
                '--font-size-base': '11px',
                '--font-size-title': '12px',
                '--font-size-small': '10px',
                '--font-weight-normal': '700',
                '--font-weight-bold': '900',
                '--line-height-base': '1.3'
            },
            'terminal': {
                '--font-family-base': '"Ubuntu Mono", monospace',
                '--font-family-terminal': '"DejaVu Sans Mono", monospace',
                '--font-size-base': '13px',
                '--font-size-title': '14px',
                '--font-size-small': '12px',
                '--font-weight-normal': '400',
                '--font-weight-bold': '700',
                '--line-height-base': '1.4'
            }
        };

        // Valores por defecto
        this.defaultStyles = { ...this.styles };
        this.defaultFontStyles = { ...this.fontStyles };

        // Todos los estilos combinados
        this.allStyles = { ...this.styles, ...this.fontStyles };
        this.defaultAllStyles = { ...this.defaultStyles, ...this.defaultFontStyles };
    }

    init() {
        this.loadSavedStyles();
        this.bindEvents();
        this.setupColorInputs();
        this.setupFontControls();
        this.updateUI();
        this.updateFontControls();
        console.log('Style Manager initialized with unified preset buttons');
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
        const closeBtn = document.querySelector('#styleManager .close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

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

        // PRESETS DE COLORES - con data-scheme
        document.querySelectorAll('.cde-preset[data-scheme]').forEach(btn => {
            // Eliminar onclick previo si existe
            btn.onclick = null;

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const scheme = e.currentTarget.dataset.scheme;
                this.applyPreset(scheme);
                this.highlightActiveColorPreset(e.currentTarget);
            });
        });

        // PRESETS DE FUENTES - con data-preset Y data-type="font"
        document.querySelectorAll('.cde-preset[data-preset][data-type="font"]').forEach(btn => {
            // Eliminar onclick previo si existe
            btn.onclick = null;

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const presetName = e.currentTarget.dataset.preset;
                this.applyFontPreset(presetName);
                this.highlightActiveFontPreset(e.currentTarget);
            });
        });

        // Alternativa: detectar automáticamente por el nombre del preset
        // Útil si no quieres usar data-type="font"
        const fontPresetNames = ['classic-cde', 'modern', 'retro', 'terminal'];
        document.querySelectorAll('.cde-preset[data-preset]').forEach(btn => {
            const presetName = btn.dataset.preset;
            if (fontPresetNames.includes(presetName)) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.applyFontPreset(presetName);
                    this.highlightActiveFontPreset(e.currentTarget);
                });
            }
        });

        // Categorías
        document.querySelectorAll('.cde-category').forEach(cat => {
            cat.onclick = null;
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

    // Resaltar preset de color activo
    highlightActiveColorPreset(activeButton) {
        // Remover active de todos los presets de color
        document.querySelectorAll('.cde-preset[data-scheme]').forEach(btn => {
            btn.classList.remove('active');
        });

        // Remover active de todos los presets de fuente
        document.querySelectorAll('.cde-preset[data-preset][data-type="font"]').forEach(btn => {
            btn.classList.remove('active');
        });

        // Agregar active al botón clickeado
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    // Resaltar preset de fuente activo
    highlightActiveFontPreset(activeButton) {
        // Remover active de todos los presets de fuente
        document.querySelectorAll('.cde-preset[data-preset][data-type="font"]').forEach(btn => {
            btn.classList.remove('active');
        });

        // Remover active de todos los presets de color
        document.querySelectorAll('.cde-preset[data-scheme]').forEach(btn => {
            btn.classList.remove('active');
        });

        // Agregar active al botón clickeado
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    setupColorInputs() {
        // Mapeo de inputs a variables CSS
        const colorMap = {
            'color-workspace': '--workspace-color',
            'color-title-active': '--titlebar-color',
            'color-background': '--window-color',
            'color-highlight': '--highlight-color',
            'color-text': '--text-color'
        };

        // Crear inputs dinámicamente o usar los existentes
        Object.entries(colorMap).forEach(([inputId, cssVar]) => {
            const input = document.getElementById(inputId);
            if (input) {
                // Añadir event listener
                input.addEventListener('input', (e) => {
                    const value = e.target.value;
                    this.applyStyle(cssVar, value);

                    // Actualizar swatch y nombre
                    const selector = e.target.closest('.cde-colorselector');
                    if (selector) {
                        const swatch = selector.querySelector('.cde-colorswatch');
                        const nameSpan = selector.querySelector('.cde-colorname');
                        if (swatch) swatch.style.backgroundColor = value;
                        if (nameSpan) nameSpan.textContent = this.getColorName(value);
                    }

                    this.updateStatus(`Changed: ${cssVar}`);
                });
            }
        });
    }

    setupFontControls() {
        // Configurar controles de fuente
        this.setupFontSelect('font-family-base', '--font-family-base');
        this.setupFontSelect('font-family-terminal', '--font-family-terminal');
        this.setupSlider('font-size-base', '--font-size-base', 'font-size-value', 'px');
        this.setupSlider('font-size-title', '--font-size-title', 'font-size-title-value', 'px');
        this.setupSlider('line-height-base', '--line-height-base', 'line-height-value', '');
        this.setupFontSelect('font-weight', '--font-weight-normal');

        // Aplicar vista previa automática
        document.querySelectorAll('.cde-select, .cde-slider').forEach(control => {
            control.addEventListener('input', () => this.updateFontPreview());
        });

        // Cargar valores guardados
        this.updateFontControls();
    }

    setupFontSelect(elementId, cssVar) {
        const select = document.getElementById(elementId);
        if (select) {
            select.addEventListener('change', (e) => {
                this.applyFontStyle(cssVar, e.target.value);
                this.updateFontPreview();
                this.updateStatus(`Font changed: ${cssVar}`);
            });
        }
    }

    setupSlider(sliderId, cssVar, valueId, suffix = '') {
        const slider = document.getElementById(sliderId);
        const valueSpan = document.getElementById(valueId);

        if (slider && valueSpan) {
            slider.addEventListener('input', (e) => {
                const value = e.target.value + suffix;
                this.applyFontStyle(cssVar, value);
                valueSpan.textContent = e.target.value + suffix;
                this.updateFontPreview();
            });
        }
    }

    getLabelFromId(id) {
        const labels = {
            'color-workspace': 'Workspace',
            'color-title-active': 'Active Title',
            'color-background': 'Background',
            'color-highlight': 'Highlight',
            'color-text': 'Text Color'
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

    applyFontStyle(cssVar, value) {
        document.documentElement.style.setProperty(cssVar, value);
        this.fontStyles[cssVar] = value;
        this.allStyles[cssVar] = value;
    }

    apply() {
        this.applyAllStyles();
        this.applyAllFontStyles();
        this.updateStatus('All changes applied');
        this.showMessage('✓ Styles applied successfully');
    }

    applyAllStyles() {
        for (const [cssVar, value] of Object.entries(this.styles)) {
            document.documentElement.style.setProperty(cssVar, value);
        }
    }

    applyAllFontStyles() {
        for (const [cssVar, value] of Object.entries(this.fontStyles)) {
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
                    const selector = input.closest('.cde-colorselector');
                    if (selector) {
                        const swatch = selector.querySelector('.cde-colorswatch');
                        const nameSpan = selector.querySelector('.cde-colorname');
                        if (swatch) swatch.style.backgroundColor = value;
                        if (nameSpan) nameSpan.textContent = this.getColorName(value);
                    }
                }
            }
            this.updateStatus(`Applied theme: ${scheme}`);
            this.showMessage(`✓ ${scheme} theme applied`);
        }
    }

    applyFontPreset(presetName) {
        if (this.fontPresets[presetName]) {
            console.log(`Applying font preset: ${presetName}`);
            for (const [cssVar, value] of Object.entries(this.fontPresets[presetName])) {
                this.applyFontStyle(cssVar, value);
            }
            this.updateFontControls();
            this.updateStatus(`Applied font preset: ${presetName}`);
            this.showMessage(`✓ ${presetName} font preset applied`);
        }
    }

    reset() {
        // Resetear colores
        for (const [cssVar, value] of Object.entries(this.defaultStyles)) {
            this.applyStyle(cssVar, value);
        }

        // Resetear fuentes
        for (const [cssVar, value] of Object.entries(this.defaultFontStyles)) {
            this.applyFontStyle(cssVar, value);
        }

        this.updateUI();
        this.updateFontControls();
        this.updateStatus('Reset to default');
        this.showMessage('✓ Reset to default theme and fonts');

        // Remover active de todos los presets
        document.querySelectorAll('.cde-preset.active').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    save() {
        try {
            // Guardar tanto colores como fuentes
            const allSettings = {
                colors: this.styles,
                fonts: this.fontStyles
            };
            localStorage.setItem('cde-styles', JSON.stringify(allSettings));
            this.updateStatus('All settings saved');
            this.showMessage('✓ Configuration saved');
            console.log('Styles and fonts saved to localStorage');
        } catch (e) {
            this.showMessage('✗ Error saving configuration');
            console.error('Error saving styles:', e);
        }
    }

    loadSavedStyles() {
        try {
            const saved = localStorage.getItem('cde-styles');
            if (saved) {
                const savedSettings = JSON.parse(saved);

                // Cargar colores
                if (savedSettings.colors) {
                    Object.assign(this.styles, savedSettings.colors);
                    this.applyAllStyles();
                }

                // Cargar fuentes
                if (savedSettings.fonts) {
                    Object.assign(this.fontStyles, savedSettings.fonts);
                    this.applyAllFontStyles();
                }

                console.log('Loaded saved styles and fonts from localStorage');
            }
        } catch (e) {
            console.log('No saved styles found');
        }
    }

    updateUI() {
        // Actualizar controles de color
        for (const [cssVar, value] of Object.entries(this.styles)) {
            const input = document.querySelector(`input[data-var="${cssVar}"]`);
            if (input) {
                input.value = value;
                const selector = input.closest('.cde-colorselector');
                if (selector) {
                    const swatch = selector.querySelector('.cde-colorswatch');
                    const nameSpan = selector.querySelector('.cde-colorname');
                    if (swatch) swatch.style.backgroundColor = value;
                    if (nameSpan) nameSpan.textContent = this.getColorName(value);
                }
            }
        }

        console.log('UI updated with current styles');
    }

    updateFontControls() {
        // Cargar valores actuales en los controles
        const baseFont = this.fontStyles['--font-family-base'] || '"Fixedsys", "Lucida Console", monospace';
        const terminalFont = this.fontStyles['--font-family-terminal'] || '"Courier New", monospace';
        const fontSize = parseInt(this.fontStyles['--font-size-base'] || '12');
        const titleSize = parseInt(this.fontStyles['--font-size-title'] || '13');
        const lineHeight = parseFloat(this.fontStyles['--line-height-base'] || '1.45');
        const fontWeight = this.fontStyles['--font-weight-normal'] || '400';

        // Actualizar controles
        this.setSelectValue('font-family-base', baseFont);
        this.setSelectValue('font-family-terminal', terminalFont);
        this.setSliderValue('font-size-base', fontSize, 'font-size-value', 'px');
        this.setSliderValue('font-size-title', titleSize, 'font-size-title-value', 'px');
        this.setSliderValue('line-height-base', lineHeight, 'line-height-value', '');
        this.setSelectValue('font-weight', fontWeight);

        this.updateFontPreview();
    }

    setSelectValue(id, value) {
        const select = document.getElementById(id);
        if (select) {
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value === value) {
                    select.selectedIndex = i;
                    break;
                }
            }
        }
    }

    setSliderValue(sliderId, value, valueId, suffix) {
        const slider = document.getElementById(sliderId);
        const valueSpan = document.getElementById(valueId);

        if (slider) slider.value = value;
        if (valueSpan) valueSpan.textContent = value + suffix;
    }

    updateFontPreview() {
        const preview = document.getElementById('font-preview');
        if (!preview) return;

        // Aplicar estilos actuales a la vista previa
        preview.style.fontFamily = this.fontStyles['--font-family-base'];
        preview.style.fontSize = this.fontStyles['--font-size-base'];
        preview.style.lineHeight = this.fontStyles['--line-height-base'];

        // Actualizar elementos específicos
        const title = preview.querySelector('.font-preview-title');
        if (title) {
            title.style.fontSize = this.fontStyles['--font-size-title'];
            title.style.fontWeight = this.fontStyles['--font-weight-bold'] || '700';
            title.style.fontFamily = this.fontStyles['--font-family-base'];
        }

        const text = preview.querySelector('.font-preview-text');
        if (text) {
            text.style.fontSize = this.fontStyles['--font-size-base'];
            text.style.fontWeight = this.fontStyles['--font-weight-normal'] || '400';
            text.style.fontFamily = this.fontStyles['--font-family-base'];
        }

        const terminal = preview.querySelector('.font-preview-terminal');
        if (terminal) {
            terminal.style.fontFamily = this.fontStyles['--font-family-terminal'];
            terminal.style.fontSize = this.fontStyles['--font-size-base'];
        }

        const small = preview.querySelector('.font-preview-small');
        if (small) {
            small.style.fontSize = this.fontStyles['--font-size-small'] || '11px';
            small.style.fontFamily = this.fontStyles['--font-family-base'];
        }
    }

    testFontPreview() {
        this.updateFontPreview();
        this.showMessage('✓ Font preview updated');
    }

    // Este método reemplaza a la función switchStyleTab
    setActiveCategory(category) {
        // Remover clase active de todas las categorías
        document.querySelectorAll('.cde-category').forEach(cat => {
            cat.classList.remove('active');
        });

        // Ocultar todos los paneles
        document.querySelectorAll('.cde-controlgroup').forEach(panel => {
            panel.classList.remove('active');
        });

        // Activar categoría seleccionada
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
            font-family: var(--font-family-base, monospace);
            font-size: 12px;
            color: #000000;
            box-shadow: 4px 4px 0 var(--shadow-color, #000000);
            min-width: 200px;
            text-align: center;
        `;

        msgBox.innerHTML = `
            <div style="margin-bottom: 10px;">${message}</div>
        `;

        document.body.appendChild(msgBox);

        // Auto-remove after 2 seconds
        setTimeout(() => {
            if (msgBox.parentNode) {
                msgBox.parentNode.removeChild(msgBox);
            }
        }, 2000);
    }

    startDrag(e) {
        if (e.target.classList.contains('close-btn')) return;

        const modal = document.getElementById('styleManager');
        if (!modal) return;

        const rect = modal.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        let offsetY = e.clientY - rect.top;

        const onMouseMove = (moveEvent) => {
            modal.style.left = `${moveEvent.clientX - offsetX}px`;
            modal.style.top = `${moveEvent.clientY - offsetY}px`;
            modal.style.transform = 'none';
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

// Función global para compatibilidad con onclick en HTML
window.switchStyleTab = function (category) {
    if (window.styleManager) {
        window.styleManager.setActiveCategory(category);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia global
    window.styleManager = new StyleManager();

    // Pequeño retraso para asegurar que el DOM esté completamente cargado
    setTimeout(() => {
        window.styleManager.init();
    }, 100);

    // Función global para abrir el Style Manager
    window.openStyleManager = function () {
        if (window.styleManager) {
            window.styleManager.open();
        }
    };

    console.log('CDE Style Manager loaded with unified preset buttons');
});

// Función para hacer el Style Manager arrastrable
function makeDraggable(element, handle) {
    if (!element || !handle) return;

    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    handle.addEventListener('mousedown', function (e) {
        if (e.target.classList.contains('close-btn')) return;

        isDragging = true;
        const rect = element.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        e.preventDefault();
    });

    function onMouseMove(e) {
        if (!isDragging) return;

        element.style.left = (e.clientX - dragOffset.x) + 'px';
        element.style.top = (e.clientY - dragOffset.y) + 'px';
        element.style.transform = 'none';
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}

// Inicializar arrastre cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    const styleManager = document.getElementById('styleManager');
    const styleManagerTitlebar = document.getElementById('styleManagerTitlebar');

    if (styleManager && styleManagerTitlebar) {
        makeDraggable(styleManager, styleManagerTitlebar);
    }
});