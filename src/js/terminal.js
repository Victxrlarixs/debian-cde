const terminalBody = document.getElementById("terminalBody");
// Verificar si terminalInput existe antes de intentar ocultarlo
let terminalInput = document.getElementById("terminalInput");

currentPath = "/home/victxrlarixs";
let tutorialActive = true;
let sequenceIndex = 0;
let stepIndex = 0;
let typingActive = true;

// Ocultar el input del usuario solo si existe
if (terminalInput) {
    terminalInput.style.display = "none";
} else {
    console.log("⚠️ terminalInput no encontrado - continuando sin input de usuario");
}

// Imprime líneas con o sin clase
function print(text = "", className = "") {
    if (!terminalBody) {
        console.error("❌ terminalBody no encontrado");
        return;
    }

    if (className) terminalBody.innerHTML += `<span class="${className}">${text}</span>\n`;
    else terminalBody.innerHTML += text + "\n";
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Simula tipeo de comando
function typeLine(line, callback, minDelay = 20, maxDelay = 80) {
    if (!terminalBody) {
        console.error("❌ terminalBody no encontrado");
        return;
    }

    let i = 0;
    typingActive = true;

    const interval = setInterval(() => {
        if (!tutorialActive) {
            clearInterval(interval);
            return;
        }

        terminalBody.innerHTML += line[i];
        terminalBody.scrollTop = terminalBody.scrollHeight;
        i++;

        if (i >= line.length) {
            clearInterval(interval);
            terminalBody.innerHTML += "\n";
            typingActive = false;
            if (callback) setTimeout(callback, 300);
        }
    }, Math.random() * (maxDelay - minDelay) + minDelay);
}

// Tutorial infinito con múltiples secuencias que se repiten
const tutorialSequences = [
    // SECUENCIA 1: Comandos básicos del sistema
    [
        {
            user: "victxrlarixs",
            command: "whoami",
            output: "victxrlarixs\n📌 Muestra tu usuario actual",
        },
        {
            user: "victxrlarixs",
            command: "pwd",
            output: "/home/victxrlarixs\n📌 Muestra el directorio actual",
        },
        {
            user: "victxrlarixs",
            command: "ls",
            output: "Desktop  Documentos  Descargas  Música  Imágenes  Vídeos\n📌 Lista archivos y directorios",
        },
        {
            user: "victxrlarixs",
            command: "ls -la",
            output: "total 48\ndrwxr-xr-x 18 victxrlarixs victxrlarixs 4096 Feb 11 10:00 .\n📌 Lista con detalles y archivos ocultos",
        },
        {
            user: "victxrlarixs",
            command: "date",
            output: "Sat Feb 11 14:30:00 CST 2023\n📌 Muestra fecha y hora del sistema",
        },
    ],

    // SECUENCIA 2: Navegación de directorios
    [
        {
            user: "victxrlarixs",
            command: "cd Documentos",
            output: "📌 Cambia al directorio Documentos",
        },
        {
            user: "victxrlarixs",
            command: "pwd",
            output: "/home/victxrlarixs/Documentos\n📌 Confirmamos ubicación",
        },
        {
            user: "victxrlarixs",
            command: "mkdir proyecto_web",
            output: "📌 Crea nuevo directorio",
        },
        {
            user: "victxrlarixs",
            command: "cd proyecto_web",
            output: "📌 Entramos al nuevo proyecto",
        },
        {
            user: "victxrlarixs",
            command: "touch index.html style.css",
            output: "📌 Crea archivos vacíos",
        },
        {
            user: "victxrlarixs",
            command: "ls",
            output: "index.html  style.css\n📌 Verificamos creación",
        },
    ],

    // SECUENCIA 3: Manipulación de archivos
    [
        {
            user: "victxrlarixs",
            command: "echo '<h1>Hola Mundo</h1>' > index.html",
            output: "📌 Escribe contenido en archivo",
        },
        {
            user: "victxrlarixs",
            command: "cat index.html",
            output: "<h1>Hola Mundo</h1>\n📌 Muestra contenido del archivo",
        },
        {
            user: "victxrlarixs",
            command: "cp index.html index_backup.html",
            output: "📌 Copia archivo",
        },
        {
            user: "victxrlarixs",
            command: "mv style.css estilos.css",
            output: "📌 Renombra archivo",
        },
        {
            user: "victxrlarixs",
            command: "rm index_backup.html",
            output: "📌 Elimina archivo",
        },
    ],

    // SECUENCIA 4: Permisos y búsqueda
    [
        {
            user: "victxrlarixs",
            command: "chmod 755 index.html",
            output: "📌 Cambia permisos del archivo",
        },
        {
            user: "victxrlarixs",
            command: "ls -l index.html",
            output: "-rwxr-xr-x 1 victxrlarixs victxrlarixs 20 Feb 11 14:35 index.html\n📌 Verifica permisos",
        },
        {
            user: "victxrlarixs",
            command: "find . -name '*.html'",
            output: "./index.html\n📌 Busca archivos por extensión",
        },
        {
            user: "victxrlarixs",
            command: "grep 'Hola' index.html",
            output: "<h1>Hola Mundo</h1>\n📌 Busca texto dentro de archivos",
        },
    ],

    // SECUENCIA 5: Procesos y sistema
    [
        {
            user: "victxrlarixs",
            command: "ps aux | head -5",
            output: "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\n📌 Muestra procesos activos",
        },
        {
            user: "victxrlarixs",
            command: "top -b -n 1 | head -3",
            output: "top - 14:40:00 up 1 day,  5:48,  1 user,  load average: 0.05, 0.10, 0.15\n📌 Monitor de sistema",
        },
        {
            user: "victxrlarixs",
            command: "free -h",
            output: "              total        used        free      shared  buff/cache   available\nMem:           7.8G        2.0G        4.8G        0.2G        1.0G        5.2G\n📌 Uso de memoria",
        },
        {
            user: "victxrlarixs",
            command: "df -h",
            output: "Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   10G   37G  22% /\n📌 Espacio en disco",
        },
    ],

    // SECUENCIA 6: Red y paquetes
    [
        {
            user: "root",
            command: "apt update",
            output: "Leyendo listas de paquetes... Hecho\n📌 Actualiza lista de paquetes disponibles",
        },
        {
            user: "root",
            command: "apt upgrade -y",
            output: "Actualizando 15 paquetes... Hecho\n📌 Actualiza paquetes instalados",
        },
        {
            user: "victxrlarixs",
            command: "ping -c 2 google.com",
            output: "PING google.com (142.250.190.14): 56 data bytes\n64 bytes from 142.250.190.14: icmp_seq=0 ttl=117 time=15.3 ms\n📌 Prueba conectividad de red",
        },
        {
            user: "victxrlarixs",
            command: "curl -I https://debian.org",
            output: "HTTP/1.1 200 OK\nServer: nginx\n📌 Obtiene headers HTTP",
        },
    ],

    // SECUENCIA 7: Git y control de versiones
    [
        {
            user: "victxrlarixs",
            command: "git init",
            output: "Initialized empty Git repository\n📌 Inicializa repositorio Git",
        },
        {
            user: "victxrlarixs",
            command: "git add .",
            output: "📌 Agrega archivos al stage",
        },
        {
            user: "victxrlarixs",
            command: "git commit -m 'Primer commit'",
            output: "[main (root-commit) abc1234] Primer commit\n📌 Crea commit inicial",
        },
        {
            user: "victxrlarixs",
            command: "git status",
            output: "On branch main\nnothing to commit, working tree clean\n📌 Estado del repositorio",
        },
        {
            user: "victxrlarixs",
            command: "git log --oneline",
            output: "abc1234 Primer commit\n📌 Historial de commits",
        },
    ],

    // SECUENCIA 8: Docker y contenedores
    [
        {
            user: "victxrlarixs",
            command: "docker ps",
            output: "CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES\n📌 Lista contenedores activos",
        },
        {
            user: "victxrlarixs",
            command: "docker images",
            output: "REPOSITORY   TAG       IMAGE ID       CREATED        SIZE\n📌 Lista imágenes disponibles",
        },
        {
            user: "victxrlarixs",
            command: "docker run hello-world",
            output: "Hello from Docker!\n📌 Ejecuta contenedor de prueba",
        },
        {
            user: "victxrlarixs",
            command: "docker-compose up -d",
            output: "Creating network... Creating containers... Done\n📌 Levanta servicios con docker-compose",
        },
    ],

    // SECUENCIA 9: Atajos y productividad
    [
        {
            user: "victxrlarixs",
            command: "history | tail -5",
            output: " 1005  ls\n 1006  cd ..\n 1007  pwd\n📌 Muestra últimos comandos",
        },
        {
            user: "victxrlarixs",
            command: "alias ll='ls -la'",
            output: "📌 Crea alias para comando largo",
        },
        {
            user: "victxrlarixs",
            command: "cd ~",
            output: "📌 Vuelve al directorio home",
        },
        {
            user: "victxrlarixs",
            command: "clear",
            output: "📌 Limpia la terminal",
        },
    ],
];

// Mensajes de transición entre secuencias
const transitionMessages = [
    "🔄 Continuando con más comandos útiles...",
    "📚 Siguiente tema: comandos de administración...",
    "🚀 Avanzando a operaciones más complejas...",
    "💡 Aprendiendo nuevas funcionalidades...",
    "🛠️ Próxima sección: herramientas de desarrollo...",
    "🌐 Explorando comandos de red...",
];

// Ejecuta un paso del tutorial
function runTutorialStep() {
    if (!tutorialActive) return;
    if (!terminalBody) {
        console.error("❌ terminalBody no encontrado - no se puede ejecutar tutorial");
        return;
    }

    const sequence = tutorialSequences[sequenceIndex];
    const step = sequence[stepIndex];
    const prompt = `${step.user}@Debian:${currentPath.replace("/home/victxrlarixs", "~")}$ `;

    typeLine(prompt + step.command, () => {
        setTimeout(() => {
            print(step.output, "tip");

            // Avanzar al siguiente paso
            stepIndex++;

            // Si terminamos la secuencia actual
            if (stepIndex >= sequence.length) {
                // Mostrar mensaje de transición
                const transition = transitionMessages[Math.floor(Math.random() * transitionMessages.length)];
                print("\n" + transition + "\n", "transition");

                // Avanzar a siguiente secuencia (loop)
                sequenceIndex = (sequenceIndex + 1) % tutorialSequences.length;
                stepIndex = 0;

                // Pequeña pausa antes de empezar nueva secuencia
                setTimeout(runTutorialStep, 2000);
            } else {
                // Continuar con siguiente paso de la misma secuencia
                setTimeout(runTutorialStep, 1500);
            }
        }, 800);
    });
}

// Inicia el tutorial infinito
function startInfiniteTutorial() {
    if (!terminalBody) {
        console.error("❌ terminalBody no encontrado - no se puede iniciar tutorial");
        return;
    }

    print("🚀 Terminal Debian-CDE - Tutorial Automático");
    print("📚 Ejecutando comandos en bucle infinito...\n");
    print("⚠️ Modo automático activado (sin interacción del usuario)\n");

    // Pequeño delay antes de empezar
    setTimeout(() => {
        runTutorialStep();
    }, 1000);
}

// Verificar que los elementos existan antes de iniciar
if (!terminalBody) {
    console.error("❌ No se encontró terminalBody - verifica el HTML");
} else {
    // Limpiar la terminal periódicamente para evitar sobrecarga
    setInterval(() => {
        if (terminalBody.children.length > 100) {
            // Mantener solo los últimos 50 elementos
            const lines = terminalBody.innerHTML.split('\n');
            if (lines.length > 50) {
                terminalBody.innerHTML = lines.slice(-50).join('\n');
            }
        }
    }, 30000); // Cada 30 segundos

    // Mantener el scroll al final
    setInterval(() => {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }, 500);

    // Iniciar el tutorial automático
    startInfiniteTutorial();
}

console.log("✅ Terminal tutorial infinito cargado (modo automático)");