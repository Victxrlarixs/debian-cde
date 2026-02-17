import { CONFIG } from './config';
import tutorialSequences from '../data/tutorial.json';

// ------------------------------------------------------------------
// CONSTANTES Y CONFIGURACIÓN (desde CONFIG)
// ------------------------------------------------------------------
const HOME_PATH = CONFIG.TERMINAL.HOME_PATH;
const MIN_TYPING_DELAY = CONFIG.TERMINAL.MIN_TYPING_DELAY;
const MAX_TYPING_DELAY = CONFIG.TERMINAL.MAX_TYPING_DELAY;
const POST_COMMAND_DELAY = CONFIG.TERMINAL.POST_COMMAND_DELAY;
const POST_SEQUENCE_DELAY = CONFIG.TERMINAL.POST_SEQUENCE_DELAY;
const MAX_LINES = CONFIG.TERMINAL.MAX_LINES;
const CLEANUP_INTERVAL = CONFIG.TERMINAL.CLEANUP_INTERVAL;
const SCROLL_INTERVAL = CONFIG.TERMINAL.SCROLL_INTERVAL;
const TRANSITION_MESSAGES = CONFIG.TERMINAL.TRANSITION_MESSAGES;

// ------------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------------
interface TutorialStep {
  user: string;
  command: string;
  output: string;
}

type TutorialSequence = TutorialStep[];

// ------------------------------------------------------------------
// SECUENCIAS DEL TUTORIAL (importadas desde JSON)
// ------------------------------------------------------------------
const TUTORIAL_SEQUENCES: TutorialSequence[] = tutorialSequences;

// ------------------------------------------------------------------
// ESTADO INTERNO
// ------------------------------------------------------------------
let terminalBody: HTMLElement | null = null;
let currentPath: string = HOME_PATH;
let tutorialActive: boolean = false;
let sequenceIndex: number = 0;
let stepIndex: number = 0;
let typingActive: boolean = false;
let cleanupInterval: number | undefined;
let scrollInterval: number | undefined;
let pendingTimeout: number | undefined;

// ------------------------------------------------------------------
// FUNCIONES PRIVADAS
// ------------------------------------------------------------------
function print(text: string = '', className: string = ''): void {
  if (!terminalBody) {
    console.error('TerminalTutorial: terminalBody no disponible');
    return;
  }
  if (className) {
    terminalBody.innerHTML += `<span class="${className}">${text}</span>\n`;
  } else {
    terminalBody.innerHTML += text + '\n';
  }
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function typeLine(line: string, callback: () => void): void {
  if (!terminalBody || !tutorialActive) {
    if (callback) setTimeout(callback, 0);
    return;
  }
  let i = 0;
  typingActive = true;
  const interval = setInterval(
    () => {
      if (!tutorialActive) {
        clearInterval(interval);
        typingActive = false;
        return;
      }
      terminalBody!.innerHTML += line[i];
      terminalBody!.scrollTop = terminalBody!.scrollHeight;
      i++;
      if (i >= line.length) {
        clearInterval(interval);
        terminalBody!.innerHTML += '\n';
        typingActive = false;
        if (callback) callback();
      }
    },
    Math.random() * (MAX_TYPING_DELAY - MIN_TYPING_DELAY) + MIN_TYPING_DELAY
  );
}

function runStep(): void {
  if (!tutorialActive || !terminalBody) return;
  const sequence = TUTORIAL_SEQUENCES[sequenceIndex];
  const step = sequence[stepIndex];
  const relativePath = currentPath.replace(HOME_PATH, '~');
  const prompt = `${step.user}@Debian:${relativePath}$ `;

  typeLine(prompt + step.command, () => {
    if (!tutorialActive) return;
    setTimeout(() => {
      if (!tutorialActive) return;
      print(step.output, 'tip');
      stepIndex++;
      if (stepIndex >= sequence.length) {
        const randomMsg =
          TRANSITION_MESSAGES[Math.floor(Math.random() * TRANSITION_MESSAGES.length)];
        print('\n' + randomMsg + '\n', 'transition');
        sequenceIndex = (sequenceIndex + 1) % TUTORIAL_SEQUENCES.length;
        stepIndex = 0;
        pendingTimeout = setTimeout(runStep, POST_SEQUENCE_DELAY);
      } else {
        pendingTimeout = setTimeout(runStep, POST_COMMAND_DELAY);
      }
    }, POST_COMMAND_DELAY);
  });
}

function cleanupTerminal(): void {
  if (!terminalBody) return;
  const lines = terminalBody.innerHTML.split('\n');
  if (lines.length > MAX_LINES) {
    terminalBody.innerHTML = lines.slice(-MAX_LINES).join('\n');
  }
}

function keepScrollBottom(): void {
  if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
}

// ------------------------------------------------------------------
// API PÚBLICA
// ------------------------------------------------------------------
export const TerminalTutorial = {
  start(containerId: string = 'terminalBody'): void {
    if (tutorialActive) return;
    terminalBody = document.getElementById(containerId);

    currentPath = HOME_PATH;
    tutorialActive = true;
    sequenceIndex = 0;
    stepIndex = 0;
    typingActive = false;

    // Limpiar intervalos previos por si acaso
    if (cleanupInterval) clearInterval(cleanupInterval);
    if (scrollInterval) clearInterval(scrollInterval);
    if (pendingTimeout) clearTimeout(pendingTimeout);

    cleanupInterval = setInterval(cleanupTerminal, CLEANUP_INTERVAL);
    scrollInterval = setInterval(keepScrollBottom, SCROLL_INTERVAL);

    print('Terminal Debian-CDE - Tutorial Automático');
    print('Ejecutando comandos en bucle infinito...\n');
    print('Modo automático activado (sin interacción del usuario)\n');

    pendingTimeout = setTimeout(runStep, 1000);
  },

  stop(): void {
    tutorialActive = false;
    if (cleanupInterval) {
      clearInterval(cleanupInterval);
      cleanupInterval = undefined;
    }
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = undefined;
    }
    if (pendingTimeout) {
      clearTimeout(pendingTimeout);
      pendingTimeout = undefined;
    }
  },
};

// ------------------------------------------------------------------
// Funciones globales para abrir/cerrar la terminal desde el HTML
// ------------------------------------------------------------------
declare global {
  interface Window {
    openTerminal: () => void;
    closeTerminal: () => void;
    focusWindow?: (id: string) => void;
  }
}

window.openTerminal = function openTerminal(): void {
  const terminal = document.getElementById('terminal');
  if (!terminal) return;
  // Si la ventana está oculta, la mostramos e iniciamos el tutorial
  if (terminal.style.display === 'none' || !terminal.style.display) {
    terminal.style.display = 'block';
    TerminalTutorial.start();
  } else {
    // Si ya está visible, solo la traemos al frente
    if (window.focusWindow) window.focusWindow('terminal');
  }
};

window.closeTerminal = function closeTerminal(): void {
  const terminal = document.getElementById('terminal');
  if (terminal) {
    terminal.style.display = 'none';
    TerminalTutorial.stop();
  }
};
