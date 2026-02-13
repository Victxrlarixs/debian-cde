/**
 * @fileoverview Gestor de ventanas CDE.
 * Controla foco, arrastre, reloj del sistema y menú desplegable de utilidades.
 * @author victxrlarixs
 */

const WindowManager = (() => {
    /** @type {number} Nivel z-index global para ventanas en foco */
    let zIndex = 100;

    /** @type {HTMLElement|null} Ventana que se está arrastrando */
    let currentDrag = null;

    /** @type {number} Desplazamiento X del cursor dentro de la ventana */
    let offsetX = 0;

    /** @type {number} Desplazamiento Y del cursor dentro de la ventana */
    let offsetY = 0;

    /** @type {number} Margen mínimo para evitar que la ventana salga de la pantalla */
    const MIN_VISIBLE = 20;

    /**
     * Eleva una ventana al frente (z-index máximo).
     * @param {string} id - ID del elemento ventana.
     */
    function focusWindow(id) {
        const win = document.getElementById(id);
        if (!win) return;
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

        // Restringir para que la ventana no desaparezca completamente
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

    /** Asigna focus a todas las ventanas al hacer clic. */
    function initWindows() {
        document.querySelectorAll(".window").forEach(win => {
            win.addEventListener("mousedown", () => focusWindow(win.id));
        });
    }

    /* ------------------------------------------------------------------
       Reloj del sistema (formato 24h)
    ------------------------------------------------------------------ */

    /** Actualiza el contenido del elemento #clock con la hora actual. */
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

        // Evitar reenganche: si ya es hijo del botón, no mover de nuevo
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

    // Exponer métodos públicos necesarios para onclick en HTML
    return {
        init,
        drag,
        focusWindow
    };
})();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => WindowManager.init());

// Exposición global para compatibilidad con atributos onclick
window.drag = WindowManager.drag;
window.focusWindow = WindowManager.focusWindow;


/**
 * Captura profesional con opciones optimizadas para CDE
 */
/**
 * Captura profesional con opciones optimizadas para CDE
 */
function captureFullPageScreenshot() {
    const btn = document.getElementById('screenshot-btn');
    if (btn) {
        btn.style.opacity = '0.5';
        btn.style.cursor = 'wait';
    }

    // Feedback visual: mensaje flotante estilo CDE
    const toast = document.createElement('div');
    toast.textContent = '📸 Capturando escritorio...';
    toast.className = 'screenshot-toast'; // Única línea de estilo
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