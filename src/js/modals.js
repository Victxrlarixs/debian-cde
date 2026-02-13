/**
 * @fileoverview Modales estilo CDE – Versión corregida (sin residuos de Style Manager)
 * Reemplaza alert, confirm y prompt con ventanas temáticas centradas y limpias.
 * @author victxrlarixs
 */

const CDEModal = (() => {
    /** @type {HTMLElement|null} Referencia al modal reutilizable */
    let modalElement = null;

    /** @type {Function} Resolve de la última Promise */
    let currentResolver = null;

    /** @type {number} z-index local para el modal */
    let zIndex = 10000;

    /**
     * Inicializa o reutiliza el modal CDE.
     * @returns {HTMLElement}
     */
    function getModal() {
        if (modalElement && document.body.contains(modalElement)) {
            return modalElement;
        }

        const existing = document.querySelector('.cde-retro-modal');
        if (existing) {
            modalElement = existing.cloneNode(true);
            modalElement.id = 'cde-modal-global';

            // Eliminar residuos del Style Manager
            modalElement.querySelector('.cde-sidepanel')?.remove();
            modalElement.querySelector('.cde-statusbar')?.remove();
            modalElement.querySelectorAll('.cde-controlgroup, .cde-controlpanel, .cde-presets, .cde-preset-row, .cde-subtitle')
                .forEach(el => el.remove());

            const body = modalElement.querySelector('.modal-body');
            if (body) {
                body.innerHTML = '';
                body.className = 'modal-body';
                body.style.padding = '20px';
                body.style.minHeight = '80px';
                // 🔥 FORZAR FONDO CDE
                body.style.background = 'var(--modal-bg)';
                body.style.color = 'var(--text-color, #000)';
                body.style.border = 'none'; // opcional, limpia bordes heredados
            }

            let actionbar = modalElement.querySelector('.cde-actionbar');
            if (!actionbar) {
                actionbar = document.createElement('div');
                actionbar.className = 'cde-actionbar';
                actionbar.style.justifyContent = 'center';
                actionbar.style.gap = '10px';
                modalElement.appendChild(actionbar);
            } else {
                actionbar.innerHTML = '';
                actionbar.style.justifyContent = 'center';
                actionbar.style.gap = '10px';
            }

            modalElement.style.top = '';
            modalElement.style.left = '';
            modalElement.style.transform = '';
        } else {
            modalElement = document.createElement('div');
            modalElement.className = 'cde-retro-modal';
            modalElement.id = 'cde-modal-global';
            modalElement.style.background = 'var(--modal-bg)';
            modalElement.style.boxShadow = '4px 4px 0 var(--shadow-color)';
            modalElement.style.width = '400px';

            const titlebar = document.createElement('div');
            titlebar.className = 'titlebar';
            titlebar.innerHTML = `
            <span class="titlebar-text">CDE Dialog</span>
            <div class="close-btn">
                <img src="./src/icons/tab_close.png">
            </div>
        `;

            const body = document.createElement('div');
            body.className = 'modal-body';
            body.style.padding = '20px';
            body.style.minHeight = '80px';
            // 🔥 FORZAR FONDO CDE
            body.style.background = 'var(--modal-bg)';
            body.style.color = 'var(--text-color, #000)';

            const actionbar = document.createElement('div');
            actionbar.className = 'cde-actionbar';
            actionbar.style.justifyContent = 'center';
            actionbar.style.gap = '10px';

            modalElement.appendChild(titlebar);
            modalElement.appendChild(body);
            modalElement.appendChild(actionbar);
        }

        const closeBtn = modalElement.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                CDEModal.close();
            };
        }

        document.body.appendChild(modalElement);
        return modalElement;
    }

    /**
     * Abre el modal con contenido personalizado.
     * @param {string} title
     * @param {string} content
     * @param {Array<{label: string, value?: any, isDefault?: boolean}>} buttons
     * @returns {Promise<any>}
     */
    function open(title, content, buttons = [{ label: 'Aceptar', value: true }]) {
        const modal = getModal();

        // Título
        const titleEl = modal.querySelector('.titlebar-text');
        if (titleEl) titleEl.textContent = title;

        // Cuerpo
        const body = modal.querySelector('.modal-body');
        body.innerHTML = content;

        // Botones
        const actionbar = modal.querySelector('.cde-actionbar');
        actionbar.innerHTML = '';

        return new Promise((resolve) => {
            currentResolver = resolve;

            buttons.forEach((btn) => {
                const button = document.createElement('button');
                button.className = `cde-btn ${btn.isDefault ? 'cde-btn-default' : ''}`;
                button.textContent = btn.label;
                button.onclick = (e) => {
                    e.stopPropagation();
                    CDEModal.close();
                    resolve(btn.value !== undefined ? btn.value : btn.label);
                };
                actionbar.appendChild(button);
            });

            modal.style.display = 'flex';
            modal.style.zIndex = ++zIndex;
        });
    }

    /** Cierra el modal. */
    function close() {
        if (modalElement) {
            modalElement.style.display = 'none';
            currentResolver = null;
        }
    }

    // API pública
    async function alert(message) {
        await open('Alerta CDE', `<p style="margin:0;">${message}</p>`);
    }

    async function confirm(question) {
        return await open(
            'Confirmar CDE',
            `<p style="margin:0;">${question}</p>`,
            [
                { label: 'Aceptar', value: true, isDefault: true },
                { label: 'Cancelar', value: false }
            ]
        );
    }

    async function prompt(question, defaultValue = '') {
        const content = `
            <p style="margin:0 0 10px 0;">${question}</p>
            <input type="text" id="cde-prompt-input" value="${defaultValue}" style="
                width: 100%;
                padding: 4px 6px;
                background: var(--button-active);
                border: 2px solid;
                border-top-color: var(--border-inset-dark);
                border-left-color: var(--border-inset-dark);
                border-right-color: var(--border-inset-light);
                border-bottom-color: var(--border-inset-light);
                font-family: var(--font-family-base);
                font-size: var(--font-size-base);
                box-sizing: border-box;
            ">
        `;
        await open(
            'Entrada CDE',
            content,
            [
                { label: 'Aceptar', value: null, isDefault: true },
                { label: 'Cancelar', value: null }
            ]
        );
        const input = document.getElementById('cde-prompt-input');
        return input ? input.value : null;
    }

    return { alert, confirm, prompt, close };
})();

// Exposición global
window.CDEModal = CDEModal;

console.log('✅ CDE Modal module loaded (limpio y centrado)');