export interface EmacsElements {
  win: HTMLElement | null;
  textarea: HTMLTextAreaElement | null;
  minibuffer: HTMLElement | null;
  minibufferContent: HTMLElement | null;
  minibufferLabel: HTMLElement | null;
  minibufferInput: HTMLInputElement | null;
  minibufferMsg: HTMLElement | null;
  splash: HTMLElement | null;
  editorArea: HTMLElement | null;
  title: HTMLElement | null;
  fileName: HTMLElement | null;
  fileStatus: HTMLElement | null;
  line: HTMLElement | null;
  col: HTMLElement | null;
  findBar: HTMLElement | null;
  findInput: HTMLInputElement | null;
}

export interface EmacsState {
  currentFilePath: string;
  isModified: boolean;
  ctrlXPressed: boolean;
  wordWrap: boolean;
  findIndex: number;
  lastQuery: string;
  isMinibufferActive: boolean;
}
