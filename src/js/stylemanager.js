// styleManager.js

class StyleManager {
    constructor() {
        this.styles = {
            '--topbar-color': '#c6bdb3',
            '--window-color': '#dcd6cc',
            '--titlebar-color': '#4a6c7a',
            '--terminal-bg-color': '#070b0d',
            '--terminal-text-color': '#c7fbe3',
            '--dock-color': '#e6e1d8',
            '--menu-color': '#bfb6aa'
        };

        this.defaultStyles = { ...this.styles };
        this.init();
    }

    init() {
        this.loadSavedStyles();
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        // Abrir/cerrar el Style Manager
        document.querySelector('.cde-icon[onclick*="styleManager"]').addEventListener('click', (e) => {
            e.preventDefault();
            this.open();
        });

        // Cerrar con el botón
        document.querySelector('.close-btn[onclick*="closeStyleManager"]').addEventListener('click', () => {
            this.close();
        });

        // Cambios en los selectores de color
        document.querySelectorAll('#styleManager input[type="color"]').forEach(input => {
            input.addEventListener('input', (e) => {
                const cssVar = e.target.dataset.var;
                const value = e.target.value;
                this.applyStyle(cssVar, value);

                // Actualizar el valor mostrado
                const valueSpan = e.target.nextElementSibling;
                if (valueSpan && valueSpan.classList.contains('color-value')) {
                    valueSpan.textContent = value;
                }
            });
        });

        // Arrastrar la ventana
        const titlebar = document.querySelector('#styleManager .titlebar');
        titlebar.addEventListener('mousedown', this.startDrag.bind(this));
    }

    open() {
        document.getElementById('styleManager').style.display = 'flex';
    }

    close() {
        document.getElementById('styleManager').style.display = 'none';
    }

    applyStyle(cssVar, value) {
        document.documentElement.style.setProperty(cssVar, value);
        this.styles[cssVar] = value;
    }

    applyAllStyles() {
        for (const [cssVar, value] of Object.entries(this.styles)) {
            document.documentElement.style.setProperty(cssVar, value);
        }
    }

    resetAllStyles() {
        for (const [cssVar, value] of Object.entries(this.defaultStyles)) {
            this.applyStyle(cssVar, value);
        }
        this.updateUI();
    }

    updateUI() {
        for (const [cssVar, value] of Object.entries(this.styles)) {
            const input = document.querySelector(`#styleManager input[data-var="${cssVar}"]`);
            if (input) {
                input.value = value;
                const valueSpan = input.nextElementSibling;
                if (valueSpan && valueSpan.classList.contains('color-value')) {
                    valueSpan.textContent = value;
                }
            }
        }
    }

    saveStyles() {
        localStorage.setItem('cde-styles', JSON.stringify(this.styles));
        alert('Styles saved to browser storage!');
    }

    loadSavedStyles() {
        const saved = localStorage.getItem('cde-styles');
        if (saved) {
            try {
                const savedStyles = JSON.parse(saved);
                this.styles = { ...this.defaultStyles, ...savedStyles };
                this.applyAllStyles();
            } catch (e) {
                console.log('Error loading saved styles:', e);
            }
        }
    }

    startDrag(e) {
        if (e.target.classList.contains('close-btn')) return;

        const modal = document.getElementById('styleManager');
        const rect = modal.getBoundingClientRect();

        let offsetX = e.clientX - rect.left;
        let offsetY = e.clientY - rect.top;

        function onMouseMove(moveEvent) {
            modal.style.left = `${moveEvent.clientX - offsetX}px`;
            modal.style.top = `${moveEvent.clientY - offsetY}px`;
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
}

// Funciones globales para acceso desde HTML
window.openStyleManager = function () {
    styleManager.open();
};

window.closeStyleManager = function () {
    styleManager.close();
};

window.resetAllStyles = function () {
    styleManager.resetAllStyles();
};

window.saveStyles = function () {
    styleManager.saveStyles();
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.styleManager = new StyleManager();
});

