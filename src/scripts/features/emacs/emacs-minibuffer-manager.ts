import type { EmacsElements } from './emacs-types';

export class EmacsMinibufferManager {
  private resolver: ((val: string | null) => void) | null = null;
  private isActive: boolean = false;

  constructor(private elements: EmacsElements) {
    this.setupListeners();
  }

  private setupListeners(): void {
    const { minibufferInput } = this.elements;
    if (!minibufferInput) return;

    minibufferInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.resolve(minibufferInput.value);
      } else if (e.key === 'Escape' || (e.ctrlKey && e.key === 'g')) {
        e.preventDefault();
        this.resolve(null);
      }
    });
  }

  async prompt(label: string, defaultValue: string = ''): Promise<string | null> {
    const { minibufferContent, minibufferLabel, minibufferInput, minibufferMsg } = this.elements;
    if (!minibufferContent || !minibufferLabel || !minibufferInput) return null;

    this.isActive = true;
    if (minibufferMsg) minibufferMsg.style.display = 'none';

    minibufferLabel.textContent = label;
    minibufferInput.value = defaultValue;
    minibufferContent.style.display = 'flex';
    minibufferInput.focus();

    return new Promise((resolve) => {
      this.resolver = resolve;
    });
  }

  private resolve(val: string | null): void {
    if (!this.isActive) return;

    const { minibufferContent, minibufferLabel, minibufferInput, minibufferMsg } = this.elements;
    this.isActive = false;

    if (minibufferContent) minibufferContent.style.display = 'none';
    if (minibufferLabel) minibufferLabel.textContent = '';
    if (minibufferMsg) {
      minibufferMsg.style.display = 'inline';
      minibufferMsg.textContent = '';
    }
    if (minibufferInput) {
      minibufferInput.value = '';
      minibufferInput.blur();
    }

    if (this.resolver) {
      this.resolver(val);
      this.resolver = null;
    }
  }

  showMessage(msg: string): void {
    const { minibufferMsg } = this.elements;
    if (!minibufferMsg) return;

    minibufferMsg.textContent = msg;
    if (msg && !msg.endsWith('-')) {
      setTimeout(() => {
        if (minibufferMsg.textContent === msg) minibufferMsg.textContent = '';
      }, 5000);
    }
  }

  get isBusy(): boolean {
    return this.isActive;
  }
}
