import type { EmacsElements } from './emacs-types';

export class EmacsSearchManager {
  private currentIndex: number = 0;
  private lastQuery: string = '';

  constructor(
    private elements: EmacsElements,
    private onMessage: (msg: string) => void
  ) {}

  toggleDialog(): void {
    const { findBar, findInput } = this.elements;
    if (!findBar) return;
    const hidden = findBar.classList.contains('te-find-hidden');
    findBar.classList.toggle('te-find-hidden', !hidden);
    if (hidden && findInput) {
      findInput.value = '';
      findInput.focus();
    }
  }

  close(): void {
    this.elements.findBar?.classList.add('te-find-hidden');
    this.elements.textarea?.focus();
  }

  find(dir: 1 | -1): void {
    const query = this.elements.findInput?.value ?? '';
    if (!query || !this.elements.textarea) return;

    const text = this.elements.textarea.value.toLowerCase();
    const q = query.toLowerCase();
    const matches: number[] = [];
    let i = text.indexOf(q);
    while (i !== -1) {
      matches.push(i);
      i = text.indexOf(q, i + 1);
    }

    if (!matches.length) {
      this.onMessage(`Search failed: ${query}`);
      return;
    }

    if (query !== this.lastQuery) {
      this.currentIndex = 0;
      this.lastQuery = query;
    } else {
      this.currentIndex = (this.currentIndex + dir + matches.length) % matches.length;
    }

    const pos = matches[this.currentIndex];
    this.elements.textarea.setSelectionRange(pos, pos + query.length);
    this.elements.textarea.focus();
    this.onMessage(`${this.currentIndex + 1}/${matches.length}: ${query}`);
  }
}
