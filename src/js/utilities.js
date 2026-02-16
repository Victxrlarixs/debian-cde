/**
 * @fileoverview Utilidades de ventanas, sonido, captura de pantalla y monitor de procesos estilo htop.
 * @author victxrlarixs
 */
// ============================================================================
// WindowManager: control de ventanas (foco, arrastre, reloj, dropdown)
// ============================================================================

const WindowManager = (() => {
    let zIndex = CONFIG.WINDOW.BASE_Z_INDEX;
    let currentDrag = null;
    let offsetX = 0;
    let offsetY = 0;
    const MIN_VISIBLE = CONFIG.WINDOW.MIN_VISIBLE;

    /**
     * Eleva una ventana al frente (z-index máximo) y la marca como activa.
     * @param {string} id - ID del elemento ventana.
     */
    function focusWindow(id) {
        const win = document.getElementById(id);
        if (!win) return;

        // Quitar la clase 'active' de todas las ventanas y modales
        document.querySelectorAll('.window, .cde-retro-modal').forEach(w => {
            w.classList.remove('active');
        });

        // Añadir clase 'active' a la ventana actual
        win.classList.add('active');

        // Incrementar z-index y aplicarlo
        zIndex++;
        win.style.zIndex = zIndex;
    }

    /**
     * Inicia el arrastre de una ventana.
     * @param {Event} e - Evento mousedown.
     * @param {string} id - ID de la ventana a arrastrar.
     */
    function drag(e, id) {
        const el = document.getElementById(id);
        if (!el) return;

        focusWindow(id);
        currentDrag = el;

        const rect = el.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", stopDrag);
    }

    /**
     * Mueve la ventana mientras se arrastra, con límites de pantalla.
     * @param {MouseEvent} e
     */
    function move(e) {
        if (!currentDrag) return;

        let left = e.clientX - offsetX;
        let top = e.clientY - offsetY;

        const winWidth = currentDrag.offsetWidth;
        const winHeight = currentDrag.offsetHeight;
        const maxX = window.innerWidth - MIN_VISIBLE;
        const maxY = window.innerHeight - MIN_VISIBLE;

        left = Math.min(Math.max(left, MIN_VISIBLE - winWidth), maxX);
        top = Math.min(Math.max(top, MIN_VISIBLE - winHeight), maxY);

        currentDrag.style.left = left + "px";
        currentDrag.style.top = top + "px";
    }

    /** Finaliza el arrastre y limpia los eventos. */
    function stopDrag() {
        currentDrag = null;
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", stopDrag);
    }

    /**
     * Inicializa la captura de clics en ventanas usando delegación.
     * Cualquier clic dentro de una ventana la elevará al frente.
     */
    function initWindows() {
        // Escuchamos en el documento para capturar clics incluso si la propagación se detiene
        document.addEventListener('mousedown', (e) => {
            // Buscar el elemento window más cercano (incluye modales)
            const win = e.target.closest('.window, .cde-retro-modal');
            if (win) {
                focusWindow(win.id);
            }
        });
    }

    /* ------------------------------------------------------------------
       Reloj del sistema (formato 24h)
    ------------------------------------------------------------------ */

    function updateClock() {
        const clockEl = document.getElementById("clock");
        if (!clockEl) return;

        const now = new Date();
        const h = now.getHours().toString().padStart(2, "0");
        const m = now.getMinutes().toString().padStart(2, "0");
        clockEl.textContent = `${h}:${m}`;
    }

    function initClock() {
        updateClock();
        setInterval(updateClock, 1000);
    }

    /* ------------------------------------------------------------------
       Menú desplegable de utilidades (dropdown)
    ------------------------------------------------------------------ */

    function initDropdown() {
        const dropdownBtn = document.getElementById('utilitiesBtn');
        const dropdownMenu = document.getElementById('utilitiesDropdown');

        if (!dropdownBtn || !dropdownMenu) return;

        if (dropdownMenu.parentElement !== dropdownBtn) {
            dropdownBtn.appendChild(dropdownMenu);
        }

        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownBtn.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!dropdownBtn.contains(e.target)) {
                dropdownBtn.classList.remove('open');
            }
        });

        dropdownMenu.addEventListener('click', (e) => e.stopPropagation());
    }

    /* ------------------------------------------------------------------
       Inicialización general
    ------------------------------------------------------------------ */

    function init() {
        initWindows();
        initClock();
        initDropdown();
    }

    return { init, drag, focusWindow };
})();

document.addEventListener('DOMContentLoaded', () => WindowManager.init());
window.drag = WindowManager.drag;
window.focusWindow = WindowManager.focusWindow;

// ============================================================================
// Utilidades de sonido (beep retro)
// ============================================================================

function retroBeep() {
    console.log('🔊 Intentando reproducir beep...');
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().then(() => playBeep(audioCtx));
        } else {
            playBeep(audioCtx);
        }
    } catch (e) {
        console.error('Error al reproducir beep:', e);
    }
}

function playBeep(audioCtx) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = CONFIG.AUDIO.BEEP_FREQUENCY;
    gainNode.gain.value = CONFIG.AUDIO.BEEP_GAIN;
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + CONFIG.AUDIO.BEEP_DURATION);
    console.log('✅ Beep reproducido');
}

// ============================================================================
// Captura de pantalla
// ============================================================================

function captureFullPageScreenshot() {
    const btn = document.getElementById('screenshot-btn');
    if (btn) {
        btn.style.opacity = '0.5';
        btn.style.cursor = 'wait';
    }
    const toast = document.createElement('div');
    toast.textContent = CONFIG.SCREENSHOT.TOAST_MESSAGE;
    toast.className = 'screenshot-toast';
    document.body.appendChild(toast);
    const options = {
        scale: CONFIG.SCREENSHOT.SCALE,
        backgroundColor: null,
        allowTaint: false,
        useCORS: true,
        logging: false,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        onclone: (clonedDoc) => {
            const clonedToast = clonedDoc.querySelector('.screenshot-toast');
            if (clonedToast) clonedToast.style.display = 'none';
        }
    };
    html2canvas(document.documentElement, options)
        .then(canvas => {
            const now = new Date();
            const filename = `${CONFIG.SCREENSHOT.FILENAME_PREFIX}-${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}.${now.getMinutes().toString().padStart(2, '0')}.${now.getSeconds().toString().padStart(2, '0')}.png`;
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
            document.body.removeChild(toast);
            if (btn) {
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }
        })
        .catch(error => {
            document.body.removeChild(toast);
            if (btn) {
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }
            console.error('Screenshot error:', error);
            // Restauramos el modal de error
            if (window.CDEModal) {
                CDEModal.alert('Error al capturar pantalla.');
            } else {
                alert('Error al capturar. Revisa la consola.');
            }
        });
}

// ============================================================================
// Monitor de procesos estilo htop (sin estilos inline)
// ============================================================================

function scanProcesses() {
    const processes = [];
    const windows = document.querySelectorAll('.window');
    const modals = document.querySelectorAll('.cde-retro-modal');
    let pid = 1000;

    windows.forEach(win => {
        if (win.id === 'top-monitor') return;
        const isVisible = win.style.display !== 'none';
        const titleEl = win.querySelector('.titlebar-text');
        let name = win.id || 'Window';
        if (titleEl) name = titleEl.textContent;
        else if (win.id === 'terminal') name = 'Terminal';
        else if (win.id === 'fm') name = 'File Manager';

        processes.push({
            pid: pid++,
            name: name,
            cpu: (Math.random() * 5 + 0.1).toFixed(1),
            mem: (Math.random() * 10 + 2).toFixed(1),
            elementId: win.id,
            visible: isVisible,
            isModal: false
        });
    });

    modals.forEach(modal => {
        if (modal.id === 'styleManager') {
            const isVisible = modal.style.display !== 'none';
            processes.push({
                pid: pid++,
                name: 'Style Manager',
                cpu: (Math.random() * 3 + 0.1).toFixed(1),
                mem: (Math.random() * 8 + 1).toFixed(1),
                elementId: modal.id,
                visible: isVisible,
                isModal: true
            });
        }
    });

    processes.push(
        { pid: 1, name: 'init', cpu: '0.3', mem: '1.2', elementId: null, visible: true, isModal: false },
        { pid: 2, name: 'kthreadd', cpu: '0.0', mem: '0.0', elementId: null, visible: true, isModal: false }
    );

    return processes;
}

const TopMonitor = (() => {
    const WINDOW_ID = 'top-monitor';
    let interval = null;
    let zIndex = 3000;
    let processes = [];
    let selectedIndex = 0;
    let contentDiv = null;
    let winElement = null;

    function getWindow() {
        if (!winElement) {
            winElement = document.getElementById(WINDOW_ID);
            if (winElement) {
                contentDiv = document.getElementById('top-monitor-content');
                winElement.setAttribute('tabindex', '-1');
                winElement.addEventListener('keydown', handleKeyDown);
            }
        }
        return winElement;
    }

    function handleKeyDown(e) {
        if (!contentDiv) return;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (selectedIndex > 0) {
                    selectedIndex--;
                    render();
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (selectedIndex < processes.length - 1) {
                    selectedIndex++;
                    render();
                }
                break;
            case 'k':
            case 'K':
                e.preventDefault();
                killSelected();
                break;
            case 'q':
            case 'Q':
            case 'Escape':
                e.preventDefault();
                close();
                break;
            case '?':
                e.preventDefault();
                showHelp();
                break;
            default:
                break;
        }
    }

    function killSelected() {
        if (!processes.length) return;
        const proc = processes[selectedIndex];
        if (!proc.elementId) {
            addMessage(`Cannot kill system process ${proc.pid}.`);
            return;
        }
        const element = document.getElementById(proc.elementId);
        if (!element) {
            addMessage(`Window for process ${proc.pid} not found.`);
            return;
        }
        element.style.display = 'none';
        addMessage(`Process ${proc.pid} (${proc.name}) terminated.`);
        processes = scanProcesses();
        selectedIndex = Math.min(selectedIndex, processes.length - 1);
        render();
    }

    function addMessage(msg) {
        if (!contentDiv) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = 'monitor-message';
        msgDiv.textContent = msg;
        contentDiv.appendChild(msgDiv);
        contentDiv.scrollTop = contentDiv.scrollHeight;
        adjustWindowHeight();
    }

    function showHelp() {
        if (!contentDiv) return;
        const helpLines = [
            'Help:',
            '  ↑/↓ : Navigate through processes',
            '  k   : Kill selected process',
            '  q/ESC : Quit',
            '  ?   : Show this help'
        ];
        helpLines.forEach(line => {
            const helpDiv = document.createElement('div');
            helpDiv.className = 'help-line';
            helpDiv.textContent = line;
            contentDiv.appendChild(helpDiv);
        });
        contentDiv.scrollTop = contentDiv.scrollHeight;
        adjustWindowHeight();
    }

    function adjustWindowHeight() {
        if (!winElement || !contentDiv) return;
        const titlebar = winElement.querySelector('.titlebar');
        const titlebarHeight = titlebar ? titlebar.offsetHeight : 28;
        const lineHeight = 18; // aprox
        const lines = contentDiv.innerText.split('\n').length;
        const contentHeight = lines * lineHeight + 12;
        const totalHeight = titlebarHeight + contentHeight + 4;
        winElement.style.height = totalHeight + 'px';
    }

    function createBar(percentage, type) {
        const container = document.createElement('span');
        container.className = `${type}-bar-container`;

        const fill = document.createElement('span');
        fill.className = `${type}-bar-fill`;
        fill.style.width = `${percentage}%`;

        container.appendChild(fill);
        return container;
    }

    function render() {
        if (!contentDiv) return;

        processes = scanProcesses();
        const now = new Date();
        const timeStr = now.toLocaleTimeString();

        const load1 = (Math.random() * 0.5 + 0.05).toFixed(2);
        const load5 = (Math.random() * 0.4 + 0.1).toFixed(2);
        const load15 = (Math.random() * 0.3 + 0.1).toFixed(2);

        const cpuCores = [];
        for (let i = 0; i < 4; i++) cpuCores.push(Math.random() * 100);

        const memTotal = 7985.5;
        const memUsed = Math.random() * 3000 + 1000;
        const memPercent = (memUsed / memTotal) * 100;

        const swapTotal = 2048;
        const swapUsed = Math.random() * 500;
        const swapPercent = (swapUsed / swapTotal) * 100;

        const running = Math.floor(Math.random() * 3) + 1;
        const sleeping = processes.length - running;

        // Limpiar contenido
        contentDiv.innerHTML = '';

        function addLine(text, className = '') {
            const line = document.createElement('div');
            if (className) line.className = className;
            line.textContent = text;
            contentDiv.appendChild(line);
        }

        function addBarLine(label, bars) {
            const line = document.createElement('div');
            line.appendChild(document.createTextNode(`  ${label} `));
            bars.forEach(bar => line.appendChild(bar));
            contentDiv.appendChild(line);
        }

        addLine(`${timeStr} up 1 day, load average: ${load1}, ${load5}, ${load15}`);
        addLine(`Tasks: ${processes.length} total, ${running} running, ${sleeping} sleeping`);
        addLine('Threads: 0');
        addLine('');

        // Crear barras de CPU (simuladas con spans)
        const cpuBarElements = cpuCores.map(p => createBar(p, 'cpu'));
        addBarLine('CPU0', [cpuBarElements[0]]);
        addBarLine('CPU1', [cpuBarElements[1]]);
        addBarLine('CPU2', [cpuBarElements[2]]);
        addBarLine('CPU3', [cpuBarElements[3]]);

        const memBar = createBar(memPercent, 'mem');
        const swapBar = createBar(swapPercent, 'swap');
        addBarLine('Mem ', [memBar, document.createTextNode(` ${memUsed.toFixed(1)}/${memTotal.toFixed(1)} MB`)]);
        addBarLine('Swap', [swapBar, document.createTextNode(` ${swapUsed.toFixed(1)}/${swapTotal.toFixed(1)} MB`)]);
        addLine('');
        addLine('  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND');

        processes.forEach((p, idx) => {
            const user = p.elementId ? 'victxr' : 'root';
            const userClass = p.elementId ? 'user-process' : 'system-process';
            const virt = Math.floor(Math.random() * 200 + 100).toString().padStart(5);
            const res = Math.floor(Math.random() * 50 + 20).toString().padStart(4);
            const shr = Math.floor(Math.random() * 30 + 10).toString().padStart(4);
            const cpu = p.cpu.padStart(4);
            const mem = p.mem.padStart(5);
            const time = '0:00.0';
            const status = p.visible ? 'R' : 'S';
            const statusClass = p.visible ? 'status-R' : 'status-S';
            const selector = (idx === selectedIndex) ? '▶' : ' ';
            const rowClass = idx === selectedIndex ? 'selected' : '';

            const row = document.createElement('div');
            row.className = rowClass;

            const pidSpan = document.createElement('span');
            pidSpan.textContent = `${selector} ${p.pid.toString().padStart(5)} `;
            row.appendChild(pidSpan);

            const userSpan = document.createElement('span');
            userSpan.className = userClass;
            userSpan.textContent = user.padEnd(8);
            row.appendChild(userSpan);

            const rest = document.createTextNode(` 20   0 ${virt} ${res} ${shr} `);
            row.appendChild(rest);

            const statusSpan = document.createElement('span');
            statusSpan.className = statusClass;
            statusSpan.textContent = status;
            row.appendChild(statusSpan);

            const tail = document.createTextNode(`  ${cpu} ${mem} ${time} ${p.name}`);
            row.appendChild(tail);

            contentDiv.appendChild(row);
        });

        addLine('');
        addLine('  ↑/↓: navigate  k: kill  q/ESC: quit  ?: help', 'help-line');

        adjustWindowHeight();
    }

    function open() {
        getWindow();
        if (!winElement) return;

        winElement.style.display = 'block';
        winElement.style.zIndex = ++zIndex;
        winElement.focus();
        if (window.focusWindow) window.focusWindow(WINDOW_ID);

        processes = scanProcesses();
        selectedIndex = 0;
        render();

        if (interval) clearInterval(interval);
        interval = setInterval(() => {
            processes = scanProcesses();
            if (selectedIndex >= processes.length) selectedIndex = processes.length - 1;
            render();
        }, 2000);
    }

    function close() {
        if (winElement) winElement.style.display = 'none';
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }

    return { open, close };
})();

window.TopMonitor = TopMonitor;
window.openTaskManagerInTerminal = () => TopMonitor.open();

console.log('✅ Utilities module loaded (WindowManager + beep + screenshot + htop monitor)');

// ============================================================================
// Minimizar y maximizar ventanas
// ============================================================================

// Almacena el estado anterior de las ventanas para restaurar posición y tamaño
const windowStates = {};

/**
 * Minimiza una ventana (la oculta)
 * @param {string} id - ID de la ventana
 */
function minimizeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    // Guardar estado actual si no está minimizada (por si queremos restaurar después)
    if (win.style.display !== 'none') {
        windowStates[id] = {
            display: win.style.display,
            left: win.style.left,
            top: win.style.top,
            width: win.style.width,
            height: win.style.height,
            maximized: win.classList.contains('maximized')
        };
    }

    win.style.display = 'none';
}

/**
 * Maximiza o restaura una ventana
 * @param {string} id - ID de la ventana
 */
function maximizeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    // Si ya está maximizada, restaurar
    if (win.classList.contains('maximized')) {
        win.classList.remove('maximized');
        // Restaurar posición y tamaño guardados
        if (windowStates[id]) {
            win.style.left = windowStates[id].left || '';
            win.style.top = windowStates[id].top || '';
            win.style.width = windowStates[id].width || '';
            win.style.height = windowStates[id].height || '';
        }
        // Traer al frente
        if (window.focusWindow) window.focusWindow(id);
    } else {
        // Guardar estado actual antes de maximizar
        windowStates[id] = {
            left: win.style.left,
            top: win.style.top,
            width: win.style.width,
            height: win.style.height,
            maximized: false
        };
        // Aplicar clase maximizada
        win.classList.add('maximized');
        // Ajustar z-index
        if (window.focusWindow) window.focusWindow(id);
    }
}

// Exponer globalmente
window.minimizeWindow = minimizeWindow;
window.maximizeWindow = maximizeWindow;