import { logger } from '../utilities/logger';
import { marked } from 'marked';

// ============================================================================
// Text Editor - Markdown and Plain Text viewer
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
export async function openTextEditor(title: string, content: string): Promise<void> {
  if (!initElements()) {
    console.error('[TextEditor] Failed to initialize elements');
    return;
  }

  const displayTitle = title?.trim() || 'Untitled';
  titleElement!.textContent = displayTitle;
  
  const isMarkdown = displayTitle.toLowerCase().endsWith('.md');

  if (isMarkdown && content) {
    // Render Markdown
    try {
      const html = await marked.parse(content);
      contentElement!.innerHTML = html;
      contentElement!.classList.add('markdown-body');
    } catch (err) {
      logger.error('[TextEditor] Error parsing markdown:', err);
      contentElement!.innerText = content;
      contentElement!.classList.remove('markdown-body');
    }
  } else {
    // Plain Text
    contentElement!.innerText = content || '';
    contentElement!.classList.remove('markdown-body');
  }

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

  logger.log(`[TextEditor] Opened: ${displayTitle}`);
}

/**
 * Closes the text editor.
 */
export function closeTextEditor(): void {
  if (winElement) {
    winElement.style.display = 'none';
    logger.log('[TextEditor] Closed');
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
export async function openTutorial(): Promise<void> {
  import('../../data/tutorial.json')
    .then(async (module) => {
      const content = formatTutorial(module.default);
      await openTextEditor('Linux Tutorial - Commands Reference', content);
    })
    .catch(async (error) => {
      console.error('[TextEditor] Failed to load tutorial:', error);
      await openTextEditor('Error', 'Could not load tutorial file.');
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

logger.log('[TextEditor] Module loaded');