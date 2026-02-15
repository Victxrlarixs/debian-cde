/**
 * @fileoverview Modales estilo CDE
 * Reemplaza alert, confirm y prompt con ventanas temáticas centradas y limpias.
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
            // Clonar y limpiar residuos
            modalElement = existing.cloneNode(true);
            modalElement.id = 'cde-modal-global';
            modalElement.classList.add('cde-modal-global'); // Clase adicional para estilos específicos

            // Eliminar elementos heredados del Style Manager
            modalElement.querySelector('.cde-sidepanel')?.remove();
            modalElement.querySelector('.cde-statusbar')?.remove();
            modalElement.querySelectorAll(
                '.cde-controlgroup, .cde-controlpanel, .cde-presets, .cde-preset-row, .cde-subtitle'
            ).forEach(el => el.remove());

            // Limpiar cuerpo
            const body = modalElement.querySelector('.modal-body');
            if (body) {
                body.innerHTML = '';
            }

            // Limpiar barra de acciones
            let actionbar = modalElement.querySelector('.cde-actionbar');
            if (!actionbar) {
                actionbar = document.createElement('div');
                actionbar.className = 'cde-actionbar';
                modalElement.appendChild(actionbar);
            } else {
                actionbar.innerHTML = '';
            }
        } else {
            modalElement = document.createElement('div');
            modalElement.className = 'cde-retro-modal cde-modal-global';
            modalElement.id = 'cde-modal-global';

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

            const actionbar = document.createElement('div');
            actionbar.className = 'cde-actionbar';

            modalElement.appendChild(titlebar);
            modalElement.appendChild(body);
            modalElement.appendChild(actionbar);
        }

        // Asegurar que el botón de cierre funciona
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
    function open(title, content, buttons = [{ label: 'Accept', value: true }]) {
        const modal = getModal();

        const titleEl = modal.querySelector('.titlebar-text');
        if (titleEl) titleEl.textContent = title;

        const body = modal.querySelector('.modal-body');
        body.innerHTML = content;

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

    async function alert(message) {
        await open('CDE Alert', `<p style="margin:0;">${message}</p>`);
    }

    async function confirm(question) {
        return await open(
            'CDE Confirm',
            `<p style="margin:0;">${question}</p>`,
            [
                { label: 'Accept', value: true, isDefault: true },
                { label: 'Cancel', value: false }
            ]
        );
    }

    async function prompt(question, defaultValue = '') {
        const content = `
            <p style="margin:0 0 10px 0;">${question}</p>
            <input type="text" id="cde-prompt-input" value="${defaultValue}">
        `;
        await open(
            'CDE Prompt',
            content,
            [
                { label: 'Accept', value: null, isDefault: true },
                { label: 'Cancel', value: null }
            ]
        );
        const input = document.getElementById('cde-prompt-input');
        return input ? input.value : null;
    }

    return { alert, confirm, prompt, close };
})();

window.CDEModal = CDEModal;

console.log('✅ CDE Modal module loaded');