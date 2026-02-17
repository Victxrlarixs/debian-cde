// src/scripts/modals.ts

/**
 * @fileoverview Modales estilo CDE
 * Reemplaza alert, confirm y prompt con ventanas temáticas centradas y limpias.
 */

export interface ModalButton {
  label: string;
  value?: any;
  isDefault?: boolean;
}

class CDEModalClass {
  private modalElement: HTMLElement | null = null;
  private currentResolver: ((value: any) => void) | null = null;
  private zIndex: number = 10000;

  /**
   * Inicializa o reutiliza el modal CDE.
   */
  private getModal(): HTMLElement {
    if (this.modalElement && document.body.contains(this.modalElement)) {
      return this.modalElement;
    }

    const existing = document.querySelector('.cde-retro-modal');
    if (existing) {
      // Clonar y limpiar residuos
      this.modalElement = existing.cloneNode(true) as HTMLElement;
      this.modalElement.id = 'cde-modal-global';
      this.modalElement.classList.add('cde-modal-global');

      // Eliminar elementos heredados del Style Manager
      this.modalElement.querySelector('.cde-sidepanel')?.remove();
      this.modalElement.querySelector('.cde-statusbar')?.remove();
      this.modalElement
        .querySelectorAll(
          '.cde-controlgroup, .cde-controlpanel, .cde-presets, .cde-preset-row, .cde-subtitle'
        )
        .forEach((el) => el.remove());

      // Limpiar cuerpo
      const body = this.modalElement.querySelector('.modal-body');
      if (body) {
        body.innerHTML = '';
      }

      // Limpiar barra de acciones
      let actionbar = this.modalElement.querySelector('.cde-actionbar');
      if (!actionbar) {
        actionbar = document.createElement('div');
        actionbar.className = 'cde-actionbar';
        this.modalElement.appendChild(actionbar);
      } else {
        actionbar.innerHTML = '';
      }
    } else {
      this.modalElement = document.createElement('div');
      this.modalElement.className = 'cde-retro-modal cde-modal-global';
      this.modalElement.id = 'cde-modal-global';

      const titlebar = document.createElement('div');
      titlebar.className = 'titlebar';
      titlebar.innerHTML = `
        <span class="titlebar-text">CDE Dialog</span>
        <div class="close-btn">
          <img src="/icons/tab_close.png">
        </div>
      `;

      const body = document.createElement('div');
      body.className = 'modal-body';

      const actionbar = document.createElement('div');
      actionbar.className = 'cde-actionbar';

      this.modalElement.appendChild(titlebar);
      this.modalElement.appendChild(body);
      this.modalElement.appendChild(actionbar);
    }

    // Asegurar que el botón de cierre funciona
    const closeBtn = this.modalElement.querySelector('.close-btn');
    if (closeBtn) {
      (closeBtn as HTMLElement).onclick = (e: MouseEvent) => {
        e.stopPropagation();
        this.close();
      };
    }

    document.body.appendChild(this.modalElement);
    return this.modalElement;
  }

  /**
   * Abre el modal con contenido personalizado.
   * @param title Título del modal
   * @param content HTML del cuerpo
   * @param buttons Lista de botones
   * @returns Promise con el valor del botón presionado
   */
  public open(
    title: string,
    content: string,
    buttons: ModalButton[] = [{ label: 'Accept', value: true }]
  ): Promise<any> {
    const modal = this.getModal();

    const titleEl = modal.querySelector('.titlebar-text') as HTMLElement;
    if (titleEl) titleEl.textContent = title;

    const body = modal.querySelector('.modal-body') as HTMLElement;
    body.innerHTML = content;

    const actionbar = modal.querySelector('.cde-actionbar') as HTMLElement;
    actionbar.innerHTML = '';

    return new Promise((resolve) => {
      this.currentResolver = resolve;

      buttons.forEach((btn) => {
        const button = document.createElement('button');
        button.className = `cde-btn ${btn.isDefault ? 'cde-btn-default' : ''}`;
        button.textContent = btn.label;
        button.onclick = (e) => {
          e.stopPropagation();
          this.close();
          resolve(btn.value !== undefined ? btn.value : btn.label);
        };
        actionbar.appendChild(button);
      });

      modal.style.display = 'flex';
      modal.style.zIndex = String(++this.zIndex);
    });
  }

  /** Cierra el modal. */
  public close(): void {
    if (this.modalElement) {
      this.modalElement.style.display = 'none';
      this.currentResolver = null;
    }
  }

  public async alert(message: string): Promise<void> {
    await this.open('CDE Alert', `<p style="margin:0;">${message}</p>`);
  }

  public async confirm(question: string): Promise<boolean> {
    return await this.open('CDE Confirm', `<p style="margin:0;">${question}</p>`, [
      { label: 'Accept', value: true, isDefault: true },
      { label: 'Cancel', value: false },
    ]);
  }

  public async prompt(question: string, defaultValue: string = ''): Promise<string | null> {
    const content = `
      <p style="margin:0 0 10px 0;">${question}</p>
      <input type="text" id="cde-prompt-input" value="${defaultValue}">
    `;

    // Usamos open con un valor especial que luego interpretamos
    const result = await this.open('CDE Prompt', content, [
      { label: 'Accept', value: 'ACCEPT', isDefault: true },
      { label: 'Cancel', value: 'CANCEL' },
    ]);

    if (result === 'ACCEPT') {
      const input = document.getElementById('cde-prompt-input') as HTMLInputElement;
      return input ? input.value : null;
    }
    return null;
  }
}

export const CDEModal = new CDEModalClass();

if (typeof window !== 'undefined') {
  (window as any).CDEModal = CDEModal;
}

export default CDEModal;
