import { CONFIG } from '../core/config';

// ============================================================================
// Process Monitor - Static htop-style process viewer
// No automatic updates, only updates on user interaction
// ============================================================================

/** Represents a process in the system */
interface ProcessInfo {
  pid: number;
  name: string;
  cpu: string;
  mem: string;
  elementId: string | null;
  visible: boolean;
  isModal: boolean;
}

/**
 * Scans the DOM for open windows and modals to generate a process list.
 * @returns An array of ProcessInfo objects.
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
    if (titleEl) name = titleEl.textContent || name;
    else if (win.id === 'terminal') name = 'Terminal';
    else if (win.id === 'fm') name = 'File Manager';

    processes.push({
      pid: pid++,
      name: name,
      cpu: (Math.random() * 5 + 0.1).toFixed(1),
      mem: (Math.random() * 10 + 2).toFixed(1),
      elementId: win.id,
      visible: isVisible,
      isModal: false,
    });
  });

  modals.forEach((modal) => {
    if (modal.id === 'styleManager') {
      const isVisible = (modal as HTMLElement).style.display !== 'none';
      processes.push({
        pid: pid++,
        name: 'Style Manager',
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

  /**
   * Gets or creates the window element reference.
   * @returns The window element or null if not found
   */
  function getWindow(): HTMLElement | null {
    if (!winElement) {
      winElement = document.getElementById(WINDOW_ID);
      if (winElement) {
        contentDiv = document.getElementById('process-monitor-content');
        winElement.setAttribute('tabindex', '-1');
        winElement.addEventListener('keydown', handleKeyDown);
      }
    }
    return winElement;
  }

  /**
   * Handles keyboard navigation and commands.
   * @param e - Keyboard event
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
   * Updates the visual selection indicator.
   */
  function updateSelectedRow(): void {
    if (!contentDiv) return;

    contentDiv.querySelectorAll('.selected').forEach((el) => {
      el.classList.remove('selected');
    });

    const rows = contentDiv.children;
    if (rows.length > selectedIndex + 7) {
      const rowIndex = selectedIndex + 7;
      if (rowIndex < rows.length) {
        (rows[rowIndex] as HTMLElement).classList.add('selected');
      }
    }
  }

  /**
   * Kills the selected process (hides its window).
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

    // Rescan processes after kill
    processes = scanProcesses();
    selectedIndex = Math.min(selectedIndex, processes.length - 1);
    fullRender();
  }

  /**
   * Adds a message to the monitor output.
   * @param msg - Message to display
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
   * Adjusts window height based on content.
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
   * @param percentage - Value from 0-100
   * @param type - Bar type (cpu, mem, swap)
   * @returns HTML element
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
   * Performs a full render of the monitor content.
   */
  function fullRender(): void {
    if (!contentDiv) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    const load1 = (Math.random() * 0.5 + 0.05).toFixed(2);
    const load5 = (Math.random() * 0.4 + 0.1).toFixed(2);
    const load15 = (Math.random() * 0.3 + 0.1).toFixed(2);
    const cpuCores = Array(4)
      .fill(0)
      .map(() => Math.random() * 100);
    const memTotal = 7985.5;
    const memUsed = Math.random() * 3000 + 1000;
    const memPercent = (memUsed / memTotal) * 100;
    const swapTotal = 2048;
    const swapUsed = Math.random() * 500;
    const swapPercent = (swapUsed / swapTotal) * 100;
    const running = Math.floor(Math.random() * 3) + 1;
    const sleeping = processes.length - running;

    contentDiv.innerHTML = '';

    const addLine = (text: string, className: string = ''): void => {
      const line = document.createElement('div');
      if (className) line.className = className;
      line.textContent = text;
      contentDiv!.appendChild(line);
    };

    const addBarLine = (label: string, bars: (HTMLElement | Text)[]): void => {
      const line = document.createElement('div');
      line.appendChild(document.createTextNode(`  ${label} `));
      bars.forEach((bar) => line.appendChild(bar));
      contentDiv!.appendChild(line);
    };

    addLine(`${timeStr} up 1 day, load: ${load1}, ${load5}, ${load15}`);
    addLine(`Tasks: ${processes.length} total, ${running} running, ${sleeping} sleeping`);
    addLine('Threads: 0');
    addLine('');

    const cpuBarElements = cpuCores.map((p) => createBar(p, 'cpu'));
    addBarLine('CPU0', [cpuBarElements[0]]);
    addBarLine('CPU1', [cpuBarElements[1]]);
    addBarLine('CPU2', [cpuBarElements[2]]);
    addBarLine('CPU3', [cpuBarElements[3]]);

    const memBar = createBar(memPercent, 'mem');
    const swapBar = createBar(swapPercent, 'swap');
    addBarLine('Mem ', [
      memBar,
      document.createTextNode(` ${memUsed.toFixed(1)}/${memTotal.toFixed(1)} MB`),
    ]);
    addBarLine('Swap', [
      swapBar,
      document.createTextNode(` ${swapUsed.toFixed(1)}/${swapTotal.toFixed(1)} MB`),
    ]);
    addLine('');
    addLine('  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND');

    processes.forEach((p, idx) => {
      const user = p.elementId ? 'user' : 'system';
      const virt = Math.floor(Math.random() * 200 + 100)
        .toString()
        .padStart(5);
      const res = Math.floor(Math.random() * 50 + 20)
        .toString()
        .padStart(4);
      const shr = Math.floor(Math.random() * 30 + 10)
        .toString()
        .padStart(4);
      const status = p.visible ? 'R' : 'S';
      const selector = idx === selectedIndex ? '▶' : ' ';
      const rowClass = idx === selectedIndex ? 'selected' : '';

      const row = document.createElement('div');
      row.className = rowClass;
      row.textContent = `${selector} ${p.pid.toString().padStart(5)} ${user.padEnd(8)} 20   0 ${virt} ${res} ${shr} ${status}  ${p.cpu.padStart(4)} ${p.mem.padStart(5)} 0:00.0 ${p.name}`;
      contentDiv!.appendChild(row);
    });

    addLine('');
    addLine('  ↑/↓: navigate  k: kill  q: quit', 'help-line');

    adjustWindowHeight();
  }

  /**
   * Opens the process monitor.
   */
  function open(): void {
    getWindow();
    if (!winElement) return;

    winElement.style.display = 'block';
    winElement.style.zIndex = String(++zIndex);
    winElement.focus();
    if (window.focusWindow) window.focusWindow(WINDOW_ID);

    processes = scanProcesses();
    selectedIndex = 0;
    fullRender();
    console.log(`[ProcessMonitor] Opened`);
  }

  /**
   * Closes the process monitor.
   */
  function close(): void {
    if (winElement) {
      winElement.style.display = 'none';
      console.log(`[ProcessMonitor] Closed`);
    }
  }

  return { open, close };
})();

// ============================================================================
// Global exposure
// ============================================================================

declare global {
  interface Window {
    ProcessMonitor: typeof ProcessMonitor;
    openTaskManagerInTerminal: () => void;
  }
}

window.ProcessMonitor = ProcessMonitor;
window.openTaskManagerInTerminal = () => ProcessMonitor.open();

export { ProcessMonitor };
