import { CONFIG } from '../core/config';
import { logger } from '../utilities/logger';

// ============================================================================
// Process Monitor - Live updating htop-style process viewer
// ============================================================================

/**
 * Represents a process in the system.
 */
interface ProcessInfo {
  /** Process ID */
  pid: number;
  /** Display name of the process */
  name: string;
  /** CPU usage percentage as string (e.g., "2.5") */
  cpu: string;
  /** Memory usage percentage as string */
  mem: string;
  /** ID of the corresponding DOM element, if any */
  elementId: string | null;
  /** Whether the process window is currently visible */
  visible: boolean;
  /** Whether this is a modal window */
  isModal: boolean;
}

/**
 * Scans the DOM for open windows and modals to generate a process list.
 * @returns An array of ProcessInfo objects representing current processes.
 */
function scanProcesses(): ProcessInfo[] {
  const processes: ProcessInfo[] = [];
  const windows = document.querySelectorAll('.window');
  const modals = document.querySelectorAll('.cde-retro-modal');
  let pid = 1000;

  windows.forEach((win) => {
    if (win.id === 'process-monitor') return;
    const isVisible = (win as HTMLElement).style.display !== 'none';
    const titleEl = win.querySelector('.titlebar-text');
    let name = win.id || 'Window';

    if (win.id === 'terminal') name = 'Terminal';
    else if (win.id === 'fm') name = 'File Manager';
    else if (titleEl) name = titleEl.textContent || name;

    processes.push({
      pid: pid++,
      name,
      cpu: (Math.random() * 5 + 0.1).toFixed(1),
      mem: (Math.random() * 10 + 2).toFixed(1),
      elementId: win.id,
      visible: isVisible,
      isModal: false,
    });
  });

  modals.forEach((modal) => {
    if (modal.id.includes('styleManager')) {
      const isVisible = (modal as HTMLElement).style.display !== 'none';
      let name = 'Style Manager';

      if (modal.id === 'styleManagerMain') name = 'Style Manager (Main)';
      else if (modal.id === 'styleManagerColor') name = 'Style Manager - Color';
      else if (modal.id === 'styleManagerFont') name = 'Style Manager - Font';
      else if (modal.id === 'styleManagerMouse') name = 'Style Manager - Mouse';
      else if (modal.id === 'styleManagerKeyboard') name = 'Style Manager - Keyboard';
      else if (modal.id === 'styleManagerWindow') name = 'Style Manager - Window';
      else if (modal.id === 'styleManagerScreen') name = 'Style Manager - Screen';
      else if (modal.id === 'styleManagerBeep') name = 'Style Manager - Beep';
      else if (modal.id === 'styleManagerStartup') name = 'Style Manager - Startup';
      else if (modal.id === 'styleManagerBackdrop') name = 'Style Manager - Backdrop';

      processes.push({
        pid: pid++,
        name,
        cpu: (Math.random() * 3 + 0.1).toFixed(1),
        mem: (Math.random() * 8 + 1).toFixed(1),
        elementId: modal.id,
        visible: isVisible,
        isModal: true,
      });
    }
  });

  processes.push(
    {
      pid: 1,
      name: 'init',
      cpu: '0.3',
      mem: '1.2',
      elementId: null,
      visible: true,
      isModal: false,
    },
    {
      pid: 2,
      name: 'kthreadd',
      cpu: '0.0',
      mem: '0.0',
      elementId: null,
      visible: true,
      isModal: false,
    }
  );

  return processes;
}

const ProcessMonitor = (() => {
  const WINDOW_ID = 'process-monitor';
  let zIndex = 3000;
  let processes: ProcessInfo[] = [];
  let selectedIndex = 0;
  let contentDiv: HTMLElement | null = null;
  let winElement: HTMLElement | null = null;
  let updateInterval: number | null = null;
  let lastProcessesJSON = '';

  let timeLoadLine: HTMLElement | null = null;
  let tasksLine: HTMLElement | null = null;
  let memBarFill: HTMLElement | null = null;
  let swapBarFill: HTMLElement | null = null;
  let memTextSpan: HTMLElement | null = null;
  let swapTextSpan: HTMLElement | null = null;
  let headerElements: HTMLElement[] = [];
  let rowElements: HTMLElement[] = [];

  /**
   * Gets or creates the window element reference.
   * @returns The window element or null if not found.
   */
  function getWindow(): HTMLElement | null {
    if (!winElement) {
      winElement = document.getElementById(WINDOW_ID);
      if (winElement) {
        contentDiv = document.getElementById('process-monitor-content');
        if (contentDiv) {
          winElement.setAttribute('tabindex', '-1');
          winElement.addEventListener('keydown', handleKeyDown);
        }
      }
    }
    return winElement;
  }

  /**
   * Handles keyboard navigation and commands.
   * @param e - Keyboard event.
   */
  function handleKeyDown(e: KeyboardEvent): void {
    if (!contentDiv) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (selectedIndex > 0) {
          selectedIndex--;
          updateSelectedRow();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (selectedIndex < processes.length - 1) {
          selectedIndex++;
          updateSelectedRow();
        }
        break;
      case 'k':
      case 'K':
        e.preventDefault();
        killSelected();
        break;
      case 'q':
      case 'Q':
      case 'Escape':
        e.preventDefault();
        close();
        break;
      default:
        break;
    }
  }

  /**
   * Updates the visual selection indicator for all rows.
   * Highlights the selected row and updates its text.
   */
  function updateSelectedRow(): void {
    rowElements.forEach((row, idx) => {
      if (idx === selectedIndex) {
        row.classList.add('selected');
        updateRowText(row, processes[idx], true);
      } else {
        row.classList.remove('selected');
        updateRowText(row, processes[idx], false);
      }
    });
  }

  /**
   * Updates the text content of a single process row.
   * @param row - The row element to update.
   * @param p - The process information.
   * @param isSelected - Whether this row is currently selected.
   */
  function updateRowText(row: HTMLElement, p: ProcessInfo, isSelected: boolean): void {
    const user = p.elementId ? 'user' : 'system';
    const virt = Math.floor(Math.random() * 200 + 100).toString().padStart(5);
    const res = Math.floor(Math.random() * 50 + 20).toString().padStart(4);
    const shr = Math.floor(Math.random() * 30 + 10).toString().padStart(4);
    const status = p.visible ? 'R' : 'S';
    const selector = isSelected ? '▶' : ' ';
    row.textContent = `${selector} ${p.pid.toString().padStart(5)} ${user.padEnd(8)} 20   0 ${virt} ${res} ${shr} ${status}  ${p.cpu.padStart(4)} ${p.mem.padStart(5)} 0:00.0 ${p.name}`;
  }

  /**
   * Kills the selected process by hiding its associated window.
   */
  function killSelected(): void {
    if (!processes.length) return;
    const proc = processes[selectedIndex];
    if (!proc.elementId) {
      addMessage(`Cannot kill system process ${proc.pid}.`);
      return;
    }
    const element = document.getElementById(proc.elementId);
    if (!element) {
      addMessage(`Window for process ${proc.pid} not found.`);
      return;
    }
    element.style.display = 'none';
    addMessage(`Process ${proc.pid} (${proc.name}) terminated.`);
    updateDataAndDisplay();
  }

  /**
   * Adds a message to the monitor output.
   * @param msg - Message to display.
   */
  function addMessage(msg: string): void {
    if (!contentDiv) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'monitor-message';
    msgDiv.textContent = msg;
    contentDiv.appendChild(msgDiv);
    contentDiv.scrollTop = contentDiv.scrollHeight;
    adjustWindowHeight();
  }

  /**
   * Adjusts the window height based on the current content.
   */
  function adjustWindowHeight(): void {
    if (!winElement || !contentDiv) return;
    const titlebar = winElement.querySelector('.titlebar');
    const titlebarHeight = titlebar ? (titlebar as HTMLElement).offsetHeight : 28;
    const lineHeight = 18;
    const lines = contentDiv.innerText.split('\n').length;
    const contentHeight = lines * lineHeight + 12;
    const totalHeight = titlebarHeight + contentHeight + 4;
    winElement.style.height = totalHeight + 'px';
  }

  /**
   * Creates a percentage bar element.
   * @param percentage - Value from 0 to 100.
   * @param type - Bar type (e.g., 'cpu', 'mem', 'swap').
   * @returns A span element containing the bar.
   */
  function createBar(percentage: number, type: string): HTMLElement {
    const container = document.createElement('span');
    container.className = `${type}-bar-container`;
    const fill = document.createElement('span');
    fill.className = `${type}-bar-fill`;
    fill.style.width = `${percentage}%`;
    container.appendChild(fill);
    return container;
  }

  /**
   * Renders the static header lines (time, tasks, CPU bars, memory, swap).
   */
  function renderHeader(): void {
    if (!contentDiv) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    const load1 = (Math.random() * 0.5 + 0.05).toFixed(2);
    const load5 = (Math.random() * 0.4 + 0.1).toFixed(2);
    const load15 = (Math.random() * 0.3 + 0.1).toFixed(2);
    const cpuCores = Array(4).fill(0).map(() => Math.random() * 100);
    const memTotal = 7985.5;
    const memUsed = Math.random() * 3000 + 1000;
    const memPercent = (memUsed / memTotal) * 100;
    const swapTotal = 2048;
    const swapUsed = Math.random() * 500;
    const swapPercent = (swapUsed / swapTotal) * 100;

    const addLine = (text: string, className: string = ''): HTMLElement => {
      const line = document.createElement('div');
      if (className) line.className = className;
      line.textContent = text;
      contentDiv!.appendChild(line);
      return line;
    };

    const addBarLine = (label: string, bars: (HTMLElement | Text)[]): HTMLElement => {
      const line = document.createElement('div');
      line.appendChild(document.createTextNode(`  ${label} `));
      bars.forEach((bar) => line.appendChild(bar));
      contentDiv!.appendChild(line);
      return line;
    };

    timeLoadLine = addLine(`${timeStr} up 1 day, load: ${load1}, ${load5}, ${load15}`);
    tasksLine = addLine(`Tasks: ${processes.length} total, 0 running, 0 sleeping`);
    addLine('Threads: 0');
    addLine('');

    const cpuBarElements = cpuCores.map((p) => createBar(p, 'cpu'));
    addBarLine('CPU0', [cpuBarElements[0]]);
    addBarLine('CPU1', [cpuBarElements[1]]);
    addBarLine('CPU2', [cpuBarElements[2]]);
    addBarLine('CPU3', [cpuBarElements[3]]);

    addLine('');

    const memLine = document.createElement('div');
    memLine.appendChild(document.createTextNode('  Memo '));
    const memBarContainer = createBar(memPercent, 'mem');
    memBarFill = memBarContainer.querySelector('.mem-bar-fill');
    memLine.appendChild(memBarContainer);
    memTextSpan = document.createElement('span');
    memTextSpan.textContent = ` ${memUsed.toFixed(1)}/${memTotal.toFixed(1)} MB`;
    memLine.appendChild(memTextSpan);
    contentDiv!.appendChild(memLine);
    headerElements.push(memLine);

    const swapLine = document.createElement('div');
    swapLine.appendChild(document.createTextNode('  Swap '));
    const swapBarContainer = createBar(swapPercent, 'swap');
    swapBarFill = swapBarContainer.querySelector('.swap-bar-fill');
    swapLine.appendChild(swapBarContainer);
    swapTextSpan = document.createElement('span');
    swapTextSpan.textContent = ` ${swapUsed.toFixed(1)}/${swapTotal.toFixed(1)} MB`;
    swapLine.appendChild(swapTextSpan);
    contentDiv!.appendChild(swapLine);
    headerElements.push(swapLine);

    addLine('');
    addLine('  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND');
  }

  /**
   * Updates the dynamic data in the header (time, tasks, bars, memory/swap values).
   */
  function updateHeader(): void {
    if (!contentDiv) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    const load1 = (Math.random() * 0.5 + 0.05).toFixed(2);
    const load5 = (Math.random() * 0.4 + 0.1).toFixed(2);
    const load15 = (Math.random() * 0.3 + 0.1).toFixed(2);
    const cpuCores = Array(4).fill(0).map(() => Math.random() * 100);
    const memTotal = 7985.5;
    const memUsed = Math.random() * 3000 + 1000;
    const memPercent = (memUsed / memTotal) * 100;
    const swapTotal = 2048;
    const swapUsed = Math.random() * 500;
    const swapPercent = (swapUsed / swapTotal) * 100;
    const running = Math.floor(Math.random() * 3) + 1;
    const sleeping = processes.length - running;

    if (timeLoadLine) timeLoadLine.textContent = `${timeStr} up 1 day, load: ${load1}, ${load5}, ${load15}`;
    if (tasksLine) tasksLine.textContent = `Tasks: ${processes.length} total, ${running} running, ${sleeping} sleeping`;

    const cpuLines = contentDiv.querySelectorAll('div:has(.cpu-bar-fill)');
    cpuLines.forEach((line, i) => {
      if (i < 4) {
        const barFill = line.querySelector('.cpu-bar-fill') as HTMLElement;
        if (barFill) barFill.style.width = `${cpuCores[i]}%`;
      }
    });

    if (memBarFill) memBarFill.style.width = `${memPercent}%`;
    if (memTextSpan) memTextSpan.textContent = ` ${memUsed.toFixed(1)}/${memTotal.toFixed(1)} MB`;

    if (swapBarFill) swapBarFill.style.width = `${swapPercent}%`;
    if (swapTextSpan) swapTextSpan.textContent = ` ${swapUsed.toFixed(1)}/${swapTotal.toFixed(1)} MB`;
  }

  /**
   * Updates the process rows to match the current processes array.
   * Adds or removes rows as needed and updates text content.
   */
  function updateProcessRows(): void {
    if (!contentDiv) return;

    while (rowElements.length < processes.length) {
      const newRow = document.createElement('div');
      contentDiv.appendChild(newRow);
      rowElements.push(newRow);
    }
    while (rowElements.length > processes.length) {
      const lastRow = rowElements.pop();
      if (lastRow) lastRow.remove();
    }

    rowElements.forEach((row, idx) => {
      const p = processes[idx];
      const isSelected = (idx === selectedIndex);
      updateRowText(row, p, isSelected);
    });
  }

  /**
   * Full data update: scans processes, updates header and rows.
   * If only random values changed (no new processes), only header is updated.
   */
  function updateDataAndDisplay(): void {
    const newProcesses = scanProcesses();
    const newJSON = JSON.stringify(newProcesses);
    if (newJSON === lastProcessesJSON) {
      updateHeader();
      return;
    }
    processes = newProcesses;
    lastProcessesJSON = newJSON;
    if (selectedIndex >= processes.length) {
      selectedIndex = Math.max(0, processes.length - 1);
    }
    updateHeader();
    updateProcessRows();
  }

  /**
   * Performs the initial render of the monitor when opened.
   */
  function initialRender(): void {
    if (!contentDiv) return;
    contentDiv.innerHTML = '';
    processes = scanProcesses();
    lastProcessesJSON = JSON.stringify(processes);
    selectedIndex = 0;

    renderHeader();

    rowElements = [];
    processes.forEach((p, idx) => {
      const row = document.createElement('div');
      const isSelected = (idx === selectedIndex);
      updateRowText(row, p, isSelected);
      contentDiv!.appendChild(row);
      rowElements.push(row);
    });

    const helpLine = document.createElement('div');
    helpLine.className = 'help-line';
    helpLine.textContent = '  ↑/↓: navigate  k: kill  q: quit';
    contentDiv.appendChild(helpLine);

    adjustWindowHeight();
  }

  /**
   * Opens the process monitor and starts live updates.
   */
  function open(): void {
    getWindow();
    if (!winElement || !contentDiv) return;

    winElement.style.display = 'block';
    winElement.style.zIndex = String(++zIndex);
    winElement.focus();
    if (window.focusWindow) window.focusWindow(WINDOW_ID);

    initialRender();

    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(updateDataAndDisplay, 2000);
    logger.log(`[ProcessMonitor] Opened with live updates`);
  }

  /**
   * Closes the process monitor and stops updates.
   */
  function close(): void {
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
    if (winElement) {
      winElement.style.display = 'none';
      logger.log(`[ProcessMonitor] Closed`);
    }
  }

  return { open, close };
})();

declare global {
  interface Window {
    ProcessMonitor: typeof ProcessMonitor;
    openTaskManagerInTerminal: () => void;
  }
}

window.ProcessMonitor = ProcessMonitor;
window.openTaskManagerInTerminal = () => ProcessMonitor.open();

export { ProcessMonitor };