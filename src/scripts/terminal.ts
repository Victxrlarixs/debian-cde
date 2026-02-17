// src/scripts/terminal.ts

import { CONFIG } from './config';

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
// SECUENCIAS DEL TUTORIAL (completas)
// ------------------------------------------------------------------
const TUTORIAL_SEQUENCES: TutorialSequence[] = [
  // SECUENCIA 1: Comandos básicos del sistema
  [
    {
      user: 'victxrlarixs',
      command: 'whoami',
      output: 'victxrlarixs\n📌 Muestra tu usuario actual',
    },
    {
      user: 'victxrlarixs',
      command: 'pwd',
      output: '/home/victxrlarixs\n📌 Muestra el directorio actual',
    },
    {
      user: 'victxrlarixs',
      command: 'ls',
      output:
        'Desktop  Documentos  Descargas  Música  Imágenes  Vídeos\n📌 Lista archivos y directorios',
    },
    {
      user: 'victxrlarixs',
      command: 'ls -la',
      output:
        'total 48\ndrwxr-xr-x 18 victxrlarixs victxrlarixs 4096 Feb 11 10:00 .\n📌 Lista con detalles y archivos ocultos',
    },
    {
      user: 'victxrlarixs',
      command: 'date',
      output: 'Sat Feb 11 14:30:00 CST 2023\n📌 Muestra fecha y hora del sistema',
    },
  ],
  // SECUENCIA 2: Navegación de directorios
  [
    {
      user: 'victxrlarixs',
      command: 'cd Documentos',
      output: '📌 Cambia al directorio Documentos',
    },
    {
      user: 'victxrlarixs',
      command: 'pwd',
      output: '/home/victxrlarixs/Documentos\n📌 Confirmamos ubicación',
    },
    { user: 'victxrlarixs', command: 'mkdir proyecto_web', output: '📌 Crea nuevo directorio' },
    { user: 'victxrlarixs', command: 'cd proyecto_web', output: '📌 Entramos al nuevo proyecto' },
    {
      user: 'victxrlarixs',
      command: 'touch index.html style.css',
      output: '📌 Crea archivos vacíos',
    },
    {
      user: 'victxrlarixs',
      command: 'ls',
      output: 'index.html  style.css\n📌 Verificamos creación',
    },
  ],
  // SECUENCIA 3: Manipulación de archivos
  [
    {
      user: 'victxrlarixs',
      command: "echo '<h1>Hola Mundo</h1>' > index.html",
      output: '📌 Escribe contenido en archivo',
    },
    {
      user: 'victxrlarixs',
      command: 'cat index.html',
      output: '<h1>Hola Mundo</h1>\n📌 Muestra contenido del archivo',
    },
    {
      user: 'victxrlarixs',
      command: 'cp index.html index_backup.html',
      output: '📌 Copia archivo',
    },
    { user: 'victxrlarixs', command: 'mv style.css estilos.css', output: '📌 Renombra archivo' },
    { user: 'victxrlarixs', command: 'rm index_backup.html', output: '📌 Elimina archivo' },
  ],
  // SECUENCIA 4: Permisos y búsqueda
  [
    {
      user: 'victxrlarixs',
      command: 'chmod 755 index.html',
      output: '📌 Cambia permisos del archivo',
    },
    {
      user: 'victxrlarixs',
      command: 'ls -l index.html',
      output:
        '-rwxr-xr-x 1 victxrlarixs victxrlarixs 20 Feb 11 14:35 index.html\n📌 Verifica permisos',
    },
    {
      user: 'victxrlarixs',
      command: "find . -name '*.html'",
      output: './index.html\n📌 Busca archivos por extensión',
    },
    {
      user: 'victxrlarixs',
      command: "grep 'Hola' index.html",
      output: '<h1>Hola Mundo</h1>\n📌 Busca texto dentro de archivos',
    },
  ],
  // SECUENCIA 5: Procesos y sistema
  [
    {
      user: 'victxrlarixs',
      command: 'ps aux | head -5',
      output:
        'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\n📌 Muestra procesos activos',
    },
    {
      user: 'victxrlarixs',
      command: 'top -b -n 1 | head -3',
      output:
        'top - 14:40:00 up 1 day,  5:48,  1 user,  load average: 0.05, 0.10, 0.15\n📌 Monitor de sistema',
    },
    {
      user: 'victxrlarixs',
      command: 'free -h',
      output:
        '              total        used        free      shared  buff/cache   available\nMem:           7.8G        2.0G        4.8G        0.2G        1.0G        5.2G\n📌 Uso de memoria',
    },
    {
      user: 'victxrlarixs',
      command: 'df -h',
      output:
        'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   10G   37G  22% /\n📌 Espacio en disco',
    },
  ],
  // SECUENCIA 6: Red y paquetes
  [
    {
      user: 'root',
      command: 'apt update',
      output: 'Leyendo listas de paquetes... Hecho\n📌 Actualiza lista de paquetes disponibles',
    },
    {
      user: 'root',
      command: 'apt upgrade -y',
      output: 'Actualizando 15 paquetes... Hecho\n📌 Actualiza paquetes instalados',
    },
    {
      user: 'victxrlarixs',
      command: 'ping -c 2 google.com',
      output:
        'PING google.com (142.250.190.14): 56 data bytes\n64 bytes from 142.250.190.14: icmp_seq=0 ttl=117 time=15.3 ms\n📌 Prueba conectividad de red',
    },
    {
      user: 'victxrlarixs',
      command: 'curl -I https://debian.org',
      output: 'HTTP/1.1 200 OK\nServer: nginx\n📌 Obtiene headers HTTP',
    },
  ],
  // SECUENCIA 7: Git y control de versiones
  [
    {
      user: 'victxrlarixs',
      command: 'git init',
      output: 'Initialized empty Git repository\n📌 Inicializa repositorio Git',
    },
    { user: 'victxrlarixs', command: 'git add .', output: '📌 Agrega archivos al stage' },
    {
      user: 'victxrlarixs',
      command: "git commit -m 'Primer commit'",
      output: '[main (root-commit) abc1234] Primer commit\n📌 Crea commit inicial',
    },
    {
      user: 'victxrlarixs',
      command: 'git status',
      output: 'On branch main\nnothing to commit, working tree clean\n📌 Estado del repositorio',
    },
    {
      user: 'victxrlarixs',
      command: 'git log --oneline',
      output: 'abc1234 Primer commit\n📌 Historial de commits',
    },
  ],
  // SECUENCIA 8: Docker y contenedores
  [
    {
      user: 'victxrlarixs',
      command: 'docker ps',
      output:
        'CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES\n📌 Lista contenedores activos',
    },
    {
      user: 'victxrlarixs',
      command: 'docker images',
      output:
        'REPOSITORY   TAG       IMAGE ID       CREATED        SIZE\n📌 Lista imágenes disponibles',
    },
    {
      user: 'victxrlarixs',
      command: 'docker run hello-world',
      output: 'Hello from Docker!\n📌 Ejecuta contenedor de prueba',
    },
    {
      user: 'victxrlarixs',
      command: 'docker-compose up -d',
      output:
        'Creating network... Creating containers... Done\n📌 Levanta servicios con docker-compose',
    },
  ],
  // SECUENCIA 9: Atajos y productividad
  [
    {
      user: 'victxrlarixs',
      command: 'history | tail -5',
      output: ' 1005  ls\n 1006  cd ..\n 1007  pwd\n📌 Muestra últimos comandos',
    },
    {
      user: 'victxrlarixs',
      command: "alias ll='ls -la'",
      output: '📌 Crea alias para comando largo',
    },
    { user: 'victxrlarixs', command: 'cd ~', output: '📌 Vuelve al directorio home' },
    { user: 'victxrlarixs', command: 'clear', output: '📌 Limpia la terminal' },
  ],
];

// ------------------------------------------------------------------
// ESTADO INTERNO
// ------------------------------------------------------------------
let terminalBody: HTMLElement | null = null;
let currentPath: string = HOME_PATH;
let tutorialActive: boolean = false; // ← ahora empieza en false
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
    console.error('❌ TerminalTutorial: terminalBody no disponible');
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
    console.log('🧹 TerminalTutorial: limpieza automática (', lines.length, '→', MAX_LINES, ')');
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
    console.log('🚀 TerminalTutorial: iniciando...');
    terminalBody = document.getElementById(containerId);
    if (!terminalBody) {
      console.error('❌ TerminalTutorial: no se encontró #' + containerId);
      return;
    }

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

    print('🚀 Terminal Debian-CDE - Tutorial Automático');
    print('📚 Ejecutando comandos en bucle infinito...\n');
    print('⚠️ Modo automático activado (sin interacción del usuario)\n');

    pendingTimeout = setTimeout(runStep, 1000);
    console.log('✅ TerminalTutorial: iniciado correctamente');
  },

  stop(): void {
    console.log('🛑 TerminalTutorial: deteniendo...');
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
    console.log('✅ TerminalTutorial: detenido');
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

console.log('✅ TerminalTutorial module loaded (no auto-start, controlado por ventana)');
