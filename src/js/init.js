/**
 * @fileoverview Simulación de arranque Debian CDE.
 * Muestra el logo de Debian, luego la secuencia de boot (~10s)
 * y finalmente inicializa el escritorio.
 * @author victxrlarixs
 */

let desktopInitialized = false;

class DebianRealBoot {
    constructor() {
        this.currentStep = 0;
        this.logo = CONFIG.BOOT.LOGO;
        this.bootSequence = CONFIG.BOOT.SEQUENCE;
        this.bootLog = [];
        this.container = document.getElementById('boot-log-container');
        this.bootScreen = document.getElementById('debian-boot-screen');
    }

    insertLogo() {
        if (!this.container) return;
        const logoDiv = document.createElement('div');
        logoDiv.className = 'boot-logo';
        logoDiv.style.whiteSpace = 'pre';
        logoDiv.style.fontFamily = 'monospace';
        logoDiv.style.color = '#00AA00';
        logoDiv.style.marginBottom = '20px';
        logoDiv.style.lineHeight = '1.2';
        logoDiv.textContent = this.logo;
        this.container.appendChild(logoDiv);
        this.bootLog.push('[LOGO] Debian ASCII art');
    }

    start() {
        this.currentStep = 0;
        this.bootLog = [];
        if (!this.container) {
            console.error('❌ No se encontró #boot-log-container');
            this.completeBoot();
            return;
        }
        this.container.innerHTML = '';
        this.insertLogo();
        this.startBootSequence();
    }

    startBootSequence() {
        const showNextStep = () => {
            if (this.currentStep >= this.bootSequence.length) {
                setTimeout(() => this.completeBoot(), CONFIG.BOOT.FINAL_DELAY);
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

function initDesktop() {
    if (desktopInitialized) return;
    console.log('🖥️ Initializing CDE Desktop Environment...');
    if (typeof initClock === 'function') initClock();
    if (typeof initTerminal === 'function') initTerminal();
    if (typeof initWindowManager === 'function') initWindowManager();
    if (window.styleManager?.init === 'function') window.styleManager.init();
    desktopInitialized = true;
    console.log('✅ CDE Desktop initialized successfully!');
}

// Arranque automático: primero carga temas, luego boot
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 DOM Content Loaded');
    // Cargar temas desde JSON antes de empezar
    await window.CONFIG.loadThemes();
    window.debianBoot = new DebianRealBoot();
    window.debianBoot.start();
});

window.initDesktop = initDesktop;
window.DebianRealBoot = DebianRealBoot;

console.log('✅ init.js loaded (con carga de temas JSON)');