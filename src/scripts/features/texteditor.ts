// src/scripts/features/text-editor.ts

// ============================================================================
// Text Editor - Read-only file viewer using terminal-body styling
// ============================================================================

let winElement: HTMLElement | null = null;
let titleElement: HTMLElement | null = null;
let contentElement: HTMLElement | null = null;
let zIndex = 4000;

/**
 * Initializes references to DOM elements.
 * @returns {boolean} True if all elements are found.
 */
function initElements(): boolean {
  if (!winElement) {
    winElement = document.getElementById('text-editor');
    if (!winElement) return false;
    titleElement = document.getElementById('text-editor-title');
    contentElement = document.getElementById('text-editor-content');
  }
  return !!(winElement && titleElement && contentElement);
}


/**
 * Opens the text editor with specified content.
 * @param {string} title - Window title (usually filename)
 * @param {string} content - Text content to display
 */
export function openTextEditor(title: string, content: string): void {
  if (!initElements()) {
    console.error('[TextEditor] Failed to initialize elements');
    return;
  }

  const displayTitle = title?.trim() || 'Untitled';
  titleElement!.textContent = displayTitle;
  contentElement!.innerText = content || '';

  winElement!.style.display = 'flex';
  winElement!.style.zIndex = String(++zIndex);

  // Centrar la ventana en la pantalla
  const rect = winElement!.getBoundingClientRect();
  const left = (window.innerWidth - rect.width) / 2;
  const top = (window.innerHeight - rect.height) / 2;
  winElement!.style.left = left + 'px';
  winElement!.style.top = top + 'px';

  contentElement!.scrollTop = 0;

  if (window.focusWindow) {
    window.focusWindow('text-editor');
  }

  console.log(`[TextEditor] Opened: ${displayTitle}`);
}

/**
 * Closes the text editor.
 */
export function closeTextEditor(): void {
  if (winElement) {
    winElement.style.display = 'none';
    console.log('[TextEditor] Closed');
  }
}

/**
 * Formats tutorial JSON into readable text with separators.
 * @param {any} data - The parsed JSON data
 * @returns {string} Formatted text
 */
function formatTutorial(data: any[]): string {
  let result = '';
  
  data.forEach((sequence, seqIndex) => {
    result += `\n${'='.repeat(60)}\n`;
    result += `SEQUENCE ${seqIndex + 1}\n`;
    result += `${'='.repeat(60)}\n\n`;
    
    sequence.forEach((step: any) => {
      result += `${step.user}@Debian:~$ ${step.command}\n`;
      result += `${step.output}\n\n`;
    });
  });
  
  return result;
}

/**
 * Loads and displays the tutorial file.
 */
export function openTutorial(): void {
  import('../../data/tutorial.json')
    .then((module) => {
      const content = formatTutorial(module.default);
      openTextEditor('Linux Tutorial - Commands Reference', content);
    })
    .catch((error) => {
      console.error('[TextEditor] Failed to load tutorial:', error);
      openTextEditor('Error', 'Could not load tutorial file.');
    });
}

// Expose globally
declare global {
  interface Window {
    openTextEditor: typeof openTextEditor;
    closeTextEditor: typeof closeTextEditor;
    openTutorial: typeof openTutorial;
  }
}

window.openTextEditor = openTextEditor;
window.closeTextEditor = closeTextEditor;
window.openTutorial = openTutorial;

console.log('[TextEditor] Module loaded');