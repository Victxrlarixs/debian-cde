export class EmacsEditorEngine {
  constructor(private textarea: HTMLTextAreaElement) {}

  moveCursor(dir: 'home' | 'end' | 'up' | 'down' | 'left' | 'right'): void {
    const ta = this.textarea;
    let pos = ta.selectionStart;
    const text = ta.value;

    switch (dir) {
      case 'home':
        const lineStart = text.lastIndexOf('\n', pos - 1) + 1;
        ta.setSelectionRange(lineStart, lineStart);
        break;
      case 'end':
        const nextNL = text.indexOf('\n', pos);
        const lineEnd = nextNL === -1 ? text.length : nextNL;
        ta.setSelectionRange(lineEnd, lineEnd);
        break;
      case 'up':
      case 'down':
        const event = new KeyboardEvent('keydown', {
          key: dir === 'up' ? 'ArrowUp' : 'ArrowDown',
          bubbles: true,
        });
        ta.dispatchEvent(event);
        break;
      case 'left':
        ta.setSelectionRange(Math.max(0, pos - 1), Math.max(0, pos - 1));
        break;
      case 'right':
        ta.setSelectionRange(Math.min(text.length, pos + 1), Math.min(text.length, pos + 1));
        break;
    }
  }

  deleteChar(): void {
    const ta = this.textarea;
    const s = ta.selectionStart,
      e = ta.selectionEnd;
    if (s === e) {
      ta.value = ta.value.substring(0, s) + ta.value.substring(s + 1);
      ta.setSelectionRange(s, s);
    } else {
      ta.value = ta.value.substring(0, s) + ta.value.substring(e);
      ta.setSelectionRange(s, s);
    }
  }

  killLine(): void {
    const ta = this.textarea;
    const s = ta.selectionStart,
      text = ta.value;
    const next = text.indexOf('\n', s);
    const end = s === next ? s + 1 : next === -1 ? text.length : next;
    ta.value = text.substring(0, s) + text.substring(end);
    ta.setSelectionRange(s, s);
  }

  undo(): void {
    document.execCommand('undo');
  }

  cut(): void {
    document.execCommand('cut');
  }

  copy(): void {
    document.execCommand('copy');
  }

  paste(text: string): void {
    const ta = this.textarea;
    const s = ta.selectionStart,
      e = ta.selectionEnd;
    ta.value = ta.value.substring(0, s) + text + ta.value.substring(e);
    ta.setSelectionRange(s, s + text.length);
  }

  selectAll(): void {
    this.textarea.select();
  }

  setWordWrap(enabled: boolean): void {
    this.textarea.style.whiteSpace = enabled ? 'pre-wrap' : 'pre';
  }

  setFontSize(size: string): void {
    this.textarea.style.fontSize = size;
  }

  getCursorPosition(): { line: number; col: number } {
    const text = this.textarea.value;
    const pos = this.textarea.selectionStart;
    const textBefore = text.substring(0, pos);
    const lines = textBefore.split('\n');
    return {
      line: lines.length,
      col: lines[lines.length - 1].length,
    };
  }
}
