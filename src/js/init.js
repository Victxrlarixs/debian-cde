// init.js - Archivo principal de inicialización

let desktopInitialized = false;

// ==================== BOOT LOADER ====================

class DebianRealBoot {
    constructor() {
        this.currentStep = 0;
        this.bootSequence = [
            { delay: 200, text: "[    0.000000] Linux version 6.1.0-18-amd64", type: "kernel" },
            { delay: 300, text: "[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-6.1.0-18-amd64", type: "kernel" },
            { delay: 250, text: "[    0.000000] x86/fpu: Supporting XSAVE feature 0x001", type: "cpu" },
            { delay: 350, text: "[    0.227156] smpboot: CPU0: Intel(R) Core(TM) i5-10400 CPU", type: "cpu" },
            { delay: 400, text: "[    0.789123] Memory: 15904964K/16777216K available", type: "memory" },
            { delay: 450, text: "[    1.012345] EXT4-fs (sda1): mounted filesystem", type: "fs" },
            { delay: 420, text: "[    1.123456] systemd[1]: systemd 252.19-1~deb12u1", type: "systemd" },
            { delay: 500, text: "[    1.234567] systemd[1]: Detected architecture x86-64.", type: "systemd" },
            { delay: 380, text: "[    1.345678] systemd[1]: Set hostname to <debian-cde>.", type: "systemd" },
            { delay: 520, text: "[    2.112345] i915 0000:00:02.0: [drm] VT-d active", type: "drm" },
            { delay: 550, text: "[    2.667890] systemd[1]: Starting Load/Save Random Seed...", type: "service" },
            { delay: 520, text: "[    2.778901] systemd[1]: Started Load/Save Random Seed.", type: "service" },
            { delay: 700, text: "[    4.000000] Starting CDE Desktop Environment...", type: "desktop" },
            { delay: 680, text: "[    4.111111] Loading Common Desktop Environment...", type: "desktop" },
            { delay: 720, text: "[    4.222222] Initializing dtlogin manager...", type: "desktop" },
            { delay: 750, text: "[    4.444444] Loading Workspace Manager...", type: "desktop" },
            { delay: 730, text: "[    4.555555] Starting dtwm window manager...", type: "desktop" },
            { delay: 780, text: "[    4.666666] Initializing Front Panel...", type: "desktop" },
            { delay: 800, text: "[    4.888888] Starting File Manager services...", type: "desktop" },
            { delay: 790, text: "[    5.000000] CDE initialization complete.", type: "desktop" },
        ];
        this.bootLog = [];
    }

    show() {
        const existingBootScreen = document.getElementById('debian-boot-screen');
        if (existingBootScreen) existingBootScreen.remove();

        const bootScreen = document.createElement('div');
        bootScreen.id = 'debian-boot-screen';
        bootScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000000;
            color: #AAAAAA;
            font-family: 'DejaVu Sans Mono', monospace;
            font-size: 12px;
            line-height: 1.1;
            z-index: 99999;
            padding: 10px;
            box-sizing: border-box;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            color: #00AA00;
            border-bottom: 1px solid #333333;
            padding-bottom: 5px;
            margin-bottom: 10px;
            font-weight: bold;
        `;
        header.textContent = 'Debian GNU/Linux 12 (bookworm)';
        bootScreen.appendChild(header);

        const logContainer = document.createElement('div');
        logContainer.id = 'boot-log-container';
        logContainer.style.cssText = `
            height: calc(100% - 30px);
            overflow-y: auto;
            font-family: monospace;
        `;

        bootScreen.appendChild(logContainer);
        document.body.appendChild(bootScreen);

        this.startBootSequence(logContainer);
    }

    startBootSequence(container) {
        const showNextStep = () => {
            if (this.currentStep >= this.bootSequence.length) {
                setTimeout(() => this.completeBoot(), 500);
                return;
            }

            const step = this.bootSequence[this.currentStep];
            const lineElement = document.createElement('div');
            lineElement.style.cssText = `
                opacity: 0;
                animation: bootLineAppear 0.1s forwards;
                white-space: pre-wrap;
                ${this.getLineStyle(step.type)}
            `;
            lineElement.textContent = step.text;
            container.appendChild(lineElement);
            container.scrollTop = container.scrollHeight;
            this.bootLog.push(step.text);
            this.currentStep++;

            setTimeout(showNextStep, step.delay);
        };

        showNextStep();
    }

    getLineStyle(type) {
        const styles = {
            'kernel': 'color: #CCCCCC;',
            'cpu': 'color: #88AAFF;',
            'memory': 'color: #FFAA88;',
            'fs': 'color: #FFFF88;',
            'systemd': 'color: #88FFFF;',
            'service': 'color: #00FF00;',
            'drm': 'color: #FF8888;',
            'desktop': 'color: #00FFAA; font-weight: bold;',
        };
        return styles[type] || 'color: #AAAAAA;';
    }

    completeBoot() {
        const bootScreen = document.getElementById('debian-boot-screen');
        if (!bootScreen) return;

        bootScreen.style.transition = 'opacity 0.5s ease-out';
        bootScreen.style.opacity = '0';

        setTimeout(() => {
            if (bootScreen.parentNode) bootScreen.remove();
            initDesktop();
        }, 500);
    }

    start() {
        this.currentStep = 0;
        this.bootLog = [];
        this.show();
    }
}

// ==================== DESKTOP INITIALIZATION ====================

function initDesktop() {
    if (desktopInitialized) return;

    console.log('🖥️ Initializing CDE Desktop Environment...');

    // Inicializar componentes si existen
    if (typeof initClock === 'function') initClock();
    if (typeof initTerminal === 'function') initTerminal();
    if (typeof initWindowManager === 'function') initWindowManager();
    if (typeof initUI === 'function') initUI();
    if (window.styleManager && typeof window.styleManager.init === 'function') {
        window.styleManager.init();
    }

    desktopInitialized = true;
    console.log('✅ CDE Desktop initialized successfully!');
}

// ==================== MAIN INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded');

    // Añadir estilos minimales
    const bootStyles = document.createElement('style');
    bootStyles.textContent = `@keyframes bootLineAppear { to { opacity: 1; } }`;
    document.head.appendChild(bootStyles);

    // Iniciar boot loader
    window.debianBoot = new DebianRealBoot();
    setTimeout(() => window.debianBoot.start(), 300);
});

// Funciones globales
window.initDesktop = initDesktop;
window.DebianRealBoot = DebianRealBoot;

console.log('✅ init.js loaded successfully');