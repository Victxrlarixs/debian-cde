export class EmacsKeyboardHandler {
  private ctrlXPressed: boolean = false;

  constructor(
    private actions: {
      onSave: () => void;
      onSaveAs: () => void;
      onOpenFile: () => void;
      onClose: () => void;
      onSelectAll: () => void;
      onMove: (dir: 'home' | 'end' | 'up' | 'down' | 'left' | 'right') => void;
      onDelete: () => void;
      onSearch: () => void;
      onKillLine: () => void;
      onUndo: () => void;
      onRecenter: () => void;
      onExecuteCommand: () => void;
      onMessage: (msg: string) => void;
      onUpdateUI: () => void;
    }
  ) {}

  handleKeydown(e: KeyboardEvent, isMinibufferActive: boolean): void {
    if (isMinibufferActive) return;

    const isCtrl = e.ctrlKey;
    const key = e.key.toLowerCase();

    if (isCtrl && key === 'x') {
      e.preventDefault();
      this.ctrlXPressed = true;
      this.actions.onMessage('C-x-');
      return;
    }

    if (this.ctrlXPressed) {
      this.ctrlXPressed = false;
      this.actions.onMessage('');
      if (isCtrl && key === 's') {
        e.preventDefault();
        this.actions.onSave();
        return;
      }
      if (isCtrl && key === 'c') {
        e.preventDefault();
        this.actions.onClose();
        return;
      }
      if (isCtrl && key === 'f') {
        e.preventDefault();
        this.actions.onOpenFile();
        return;
      }
      if (isCtrl && key === 'w') {
        e.preventDefault();
        this.actions.onSaveAs();
        return;
      }
      if (key === 'h') {
        e.preventDefault();
        this.actions.onSelectAll();
        return;
      }
    }

    if (e.altKey && key === 'x') {
      e.preventDefault();
      this.actions.onExecuteCommand();
      return;
    }

    if (isCtrl) {
      switch (key) {
        case 'a':
          e.preventDefault();
          this.actions.onMove('home');
          break;
        case 'e':
          e.preventDefault();
          this.actions.onMove('end');
          break;
        case 'p':
          e.preventDefault();
          this.actions.onMove('up');
          break;
        case 'n':
          e.preventDefault();
          this.actions.onMove('down');
          break;
        case 'f':
          e.preventDefault();
          this.actions.onMove('right');
          break;
        case 'b':
          e.preventDefault();
          this.actions.onMove('left');
          break;
        case 'd':
          e.preventDefault();
          this.actions.onDelete();
          break;
        case 's':
          e.preventDefault();
          this.actions.onSearch();
          break;
        case 'k':
          e.preventDefault();
          this.actions.onKillLine();
          break;
        case 'g':
          e.preventDefault();
          this.ctrlXPressed = false;
          this.actions.onMessage('Quit');
          break;
        case '_':
          e.preventDefault();
          this.actions.onUndo();
          break;
        case 'l':
          e.preventDefault();
          this.actions.onRecenter();
          break;
      }
    }

    this.actions.onUpdateUI();
  }

  isWaiting(): boolean {
    return this.ctrlXPressed;
  }
}
