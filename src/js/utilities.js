/**
 * Captura profesional con opciones optimizadas para CDE
 */
function captureFullPageScreenshot() {
    const btn = document.getElementById('screenshot-btn');
    if (btn) {
        btn.style.opacity = '0.5';
        btn.style.cursor = 'wait';
    }

    const toast = document.createElement('div');
    toast.textContent = '📸 Capturando escritorio...';
    toast.className = 'screenshot-toast';
    document.body.appendChild(toast);

    const options = {
        scale: 2,
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

    html2canvas(document.documentElement, options).then(canvas => {
        const now = new Date();
        const filename = `CDE-${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}.${now.getMinutes().toString().padStart(2, '0')}.${now.getSeconds().toString().padStart(2, '0')}.png`;

        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();

        document.body.removeChild(toast);
        if (btn) {
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    }).catch(error => {
        document.body.removeChild(toast);
        if (btn) {
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
        console.error('Screenshot error:', error);
        if (window.CDEModal) {
            CDEModal.alert('Error al capturar pantalla.');
        } else {
            alert('Error al capturar. Revisa la consola.');
        }
    });
}
/**
 * @fileoverview Task Manager estilo CDE.
 * Usa la ventana estática #taskmanager existente en el DOM.
 * @author victxrlarixs
 */

const TaskManager = (() => {
    // ------------------------------------------------------------------
    // CONFIGURACIÓN
    // ------------------------------------------------------------------
    const BUTTON_ID = 'taskmanager-btn';
    const WINDOW_ID = 'taskmanager';

    let processList = [];
    let zIndex = 2000;
    let initialized = false;

    // ------------------------------------------------------------------
    // FUNCIONES PRIVADAS
    // ------------------------------------------------------------------

    function scanProcesses() {
        const processes = [];
        const windows = document.querySelectorAll('.window');
        let pid = 1000;

        windows.forEach(win => {
            if (win.id === WINDOW_ID) return;
            const isVisible = win.style.display !== 'none';
            const titleEl = win.querySelector('.titlebar-text');
            let name = win.id || 'Window';
            if (titleEl) name = titleEl.textContent;
            else if (win.id === 'terminal') name = 'Terminal';
            else if (win.id === 'fm') name = 'File Manager';
            else if (win.id === 'styleManager') name = 'Style Manager';

            processes.push({
                pid: pid++,
                name: name,
                cpu: (Math.random() * 5 + 0.1).toFixed(1) + '%',
                mem: (Math.random() * 10 + 2).toFixed(1) + ' MB',
                windowId: win.id,
                visible: isVisible
            });
        });

        processes.push(
            { pid: 1, name: 'init', cpu: '0.3%', mem: '1.2 MB', windowId: null, visible: true },
            { pid: 2, name: 'kthreadd', cpu: '0.0%', mem: '0.0 MB', windowId: null, visible: true }
        );

        return processes;
    }

    function renderProcessTable() {
        const content = document.getElementById('taskmanager-content');
        if (!content) return;

        processList = scanProcesses();

        let html = `
            <table style="width:100%; border-collapse: collapse; font-size: var(--font-size-small);">
                <thead>
                    <tr style="background: var(--button-bg); border-bottom: 2px solid var(--separator-color);">
                        <th style="padding: 6px; text-align: left;">PID</th>
                        <th style="padding: 6px; text-align: left;">%CPU</th>
                        <th style="padding: 6px; text-align: left;">%MEM</th>
                        <th style="padding: 6px; text-align: left;">Command</th>
                        <th style="padding: 6px; text-align: left;">Status</th>
                    </tr>
                </thead>
                <tbody>
        `;

        processList.forEach(proc => {
            const status = proc.visible ? '🟢 Running' : '🔴 Stopped';
            const rowStyle = proc.windowId ? 'cursor: pointer;' : '';
            const onclick = proc.windowId ? `onclick="TaskManager.selectProcess('${proc.windowId}')"` : '';

            html += `
                <tr style="border-bottom: 1px solid var(--separator-color); ${rowStyle}" ${onclick}>
                    <td style="padding: 4px 6px;">${proc.pid}</td>
                    <td style="padding: 4px 6px;">${proc.cpu}</td>
                    <td style="padding: 4px 6px;">${proc.mem}</td>
                    <td style="padding: 4px 6px;">${proc.name}</td>
                    <td style="padding: 4px 6px;">${status}</td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        content.innerHTML = html;
    }

    // ------------------------------------------------------------------
    // API PÚBLICA
    // ------------------------------------------------------------------

    function open() {
        const win = document.getElementById(WINDOW_ID);
        if (!win) return;
        win.style.display = 'block';
        win.style.zIndex = ++zIndex;
        renderProcessTable();
        if (window.focusWindow) window.focusWindow(WINDOW_ID);
    }

    function close() {
        const win = document.getElementById(WINDOW_ID);
        if (win) win.style.display = 'none';
    }

    function selectProcess(windowId) {
        if (!windowId) return;
        const win = document.getElementById(windowId);
        if (win && win.style.display !== 'none' && window.focusWindow) {
            window.focusWindow(windowId);
        }
    }

    async function killProcess() {
        const pid = await CDEModal.prompt('Enter PID to kill:');
        if (!pid) return;

        const proc = processList.find(p => p.pid == pid);
        if (!proc) {
            CDEModal.alert(`Process ${pid} not found.`);
            return;
        }
        if (!proc.windowId) {
            CDEModal.alert('Cannot kill system process.');
            return;
        }
        const win = document.getElementById(proc.windowId);
        if (!win) {
            CDEModal.alert('Window not found.');
            return;
        }
        const confirmed = await CDEModal.confirm(`Kill process ${pid} (${proc.name})?`);
        if (confirmed) {
            win.style.display = 'none';
            renderProcessTable();
            CDEModal.alert(`Process ${pid} terminated.`);
        }
    }

    function refresh() {
        renderProcessTable();
    }

    // ------------------------------------------------------------------
    // INICIALIZACIÓN
    // ------------------------------------------------------------------

    function init() {
        if (initialized) return;
        console.log('📊 TaskManager: inicializando...');

        // Asignar evento al botón del panel
        const btn = document.getElementById(BUTTON_ID);
        if (btn) {
            btn.addEventListener('click', open);
            console.log('✅ TaskManager: botón asignado');
        } else {
            console.warn('⚠️ TaskManager: botón no encontrado');
        }

        // No necesitamos crear ventana, ya existe en el HTML.
        // Solo aseguramos que los botones tengan los métodos correctos
        // (ya están con onclick en HTML, así que no es necesario asignar eventos aquí)

        initialized = true;
        console.log('✅ TaskManager: inicializado');
    }

    return {
        init,
        open,
        close,
        refresh,
        killProcess,
        selectProcess
    };
})();

// Exposición global
window.TaskManager = TaskManager;

// Inicializar cuando el DOM esté listo
TaskManager.init();
console.log('✅ TaskManager module loaded');