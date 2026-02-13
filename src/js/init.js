/**
 * @fileoverview Simulación de arranque Debian CDE.
 * Gestiona la secuencia de boot (duración total ~10s) y la inicialización del escritorio.
 * @author victxrlarixs
 */

let desktopInitialized = false;

/**
 * Simula el arranque de un sistema Debian con CDE.
 * Muestra mensajes estilo kernel en #boot-log-container y finaliza
 * revelando el escritorio (#desktop-ui).
 */
class DebianRealBoot {
    constructor() {
        /** @type {number} Índice del paso actual en la secuencia */
        this.currentStep = 0;

        /** @type {Array<{delay: number, text: string, type: string}>} */
        this.bootSequence = [
            { delay: 177, text: "[    0.000000] Iniciando simulación Debian CDE [debian.com.mx]", type: "kernel" },
            { delay: 221, text: "[    0.227156] smpboot: CPU0: Motor Retro de Renderizado (compatibilidad 1995)", type: "cpu" },
            { delay: 310, text: "[    0.789123] Memoria: 64MB de nostalgia noventera disponible", type: "memory" },
            { delay: 354, text: "[    1.012345] Montando /usr/share/cde/icons ...", type: "fs" },
            { delay: 399, text: "[    1.123456] Cargando temas: Platinum, Olive, Marine...", type: "fs" },
            { delay: 372, text: "[    1.345678] Iniciando Style Manager (esquemas de color)", type: "systemd" },
            { delay: 443, text: "[    1.789012] Iniciando Workspace Manager: pager listo", type: "systemd" },
            { delay: 337, text: "[    2.112345] i915: Inicializando filtro CRT retro", type: "drm" },
            { delay: 461, text: "[    2.667890] Iniciando dtlogin: administrador de sesión CDE (auto-login: victxrlarixs)", type: "service" },
            { delay: 487, text: "[    2.778901] Cargando Panel CDE: selector de espacios, iconos, bandeja", type: "service" },
            { delay: 461, text: "[    3.123456] Iniciando Gestor de Archivos", type: "service" },
            { delay: 638, text: "[    4.111111] dtwm: Gestor de ventanas inicializado", type: "desktop" },
            { delay: 664, text: "[    4.222222] Espacio de trabajo Uno: activo", type: "desktop" },
            { delay: 647, text: "[    4.444444] Style Manager: escuchando cambios de color", type: "desktop" },
            { delay: 700, text: "[    5.000000] Escritorio CDE listo ....", type: "desktop" },
        ];

        /** @type {Array<string>} Historial de líneas mostradas */
        this.bootLog = [];

        /** @type {HTMLElement|null} Contenedor donde se escriben las líneas */
        this.container = document.getElementById('boot-log-container');

        /** @type {HTMLElement|null} Pantalla completa de boot */
        this.bootScreen = document.getElementById('debian-boot-screen');
    }

    /**
     * Inicia la secuencia de arranque.
     * Limpia el contenedor y ejecuta la reproducción de pasos.
     */
    start() {
        this.currentStep = 0;
        this.bootLog = [];

        if (!this.container) {
            console.error('❌ No se encontró #boot-log-container');
            this.completeBoot();
            return;
        }

        this.container.innerHTML = '';
        this.startBootSequence();
    }

    /**
     * Reproduce recursivamente cada línea de la secuencia.
     * @private
     */
    startBootSequence() {
        const showNextStep = () => {
            if (this.currentStep >= this.bootSequence.length) {
                setTimeout(() => this.completeBoot(), 443); // ~0.44s para total 10s
                return;
            }

            const step = this.bootSequence[this.currentStep];
            const line = document.createElement('div');
            line.className = this.getLineClass(step.type);
            line.style.cssText = `
                opacity: 0;
                animation: bootLineAppear 0.1s forwards;
                white-space: pre-wrap;
            `;
            line.textContent = step.text;

            this.container.appendChild(line);
            this.container.scrollTop = this.container.scrollHeight;
            this.bootLog.push(step.text);
            this.currentStep++;

            setTimeout(showNextStep, step.delay);
        };
        showNextStep();
    }

    /**
     * Devuelve el nombre de clase CSS según el tipo de mensaje.
     * @param {string} type
     * @returns {string} Nombre de clase (ej. 'boot-kernel')
     */
    getLineClass(type) {
        const map = {
            'kernel': 'boot-kernel',
            'cpu': 'boot-cpu',
            'memory': 'boot-memory',
            'fs': 'boot-fs',
            'systemd': 'boot-systemd',
            'service': 'boot-service',
            'drm': 'boot-drm',
            'desktop': 'boot-desktop',
        };
        return map[type] || 'boot-default';
    }

    /**
     * Finaliza el boot: oculta la pantalla negra, muestra el escritorio
     * e invoca la inicialización de componentes.
     */
    completeBoot() {
        if (this.bootScreen) {
            this.bootScreen.style.transition = 'opacity 0.5s ease-out';
            this.bootScreen.style.opacity = '0';

            setTimeout(() => {
                this.bootScreen.style.display = 'none';
                const desktop = document.getElementById('desktop-ui');
                if (desktop) desktop.style.display = 'block';
                initDesktop();
            }, 500);
        } else {
            initDesktop();
        }
    }
}

/**
 * Inicializa todos los módulos del escritorio CDE.
 * Se ejecuta una sola vez tras completar el boot.
 */
function initDesktop() {
    if (desktopInitialized) return;

    console.log('🖥️ Initializing CDE Desktop Environment...');

    if (typeof initClock === 'function') initClock();
    if (typeof initTerminal === 'function') initTerminal();
    if (typeof initWindowManager === 'function') initWindowManager();
    if (typeof initUI === 'function') initUI();
    if (window.styleManager?.init === 'function') window.styleManager.init();

    desktopInitialized = true;
    console.log('✅ CDE Desktop initialized successfully!');
}

// ---------------------------------------------------------------------
// Arranque automático al cargar el DOM
// ---------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded');
    window.debianBoot = new DebianRealBoot();
    window.debianBoot.start();
});

// Exposición global para acceso desde consola u otros módulos
window.initDesktop = initDesktop;
window.DebianRealBoot = DebianRealBoot;

console.log('✅ init.js loaded');