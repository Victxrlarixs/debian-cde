const terminalBody = document.getElementById("terminalBody");
const terminalInput = document.getElementById("terminalInput");

currentPath = "/home/victxrlarixs";
let isTutorialRunning = true;

// Imprime líneas con o sin clase
function print(text = "", className = "") {
    if (className) terminalBody.innerHTML += `<span class="${className}">${text}</span>\n`;
    else terminalBody.innerHTML += text + "\n";
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Simula tipeo de comando
function typeLine(line, callback, minDelay = 20, maxDelay = 80) {
    let i = 0;
    const interval = setInterval(() => {
        terminalBody.innerHTML += line[i];
        terminalBody.scrollTop = terminalBody.scrollHeight;
        i++;
        if (i >= line.length) {
            clearInterval(interval);
            terminalBody.innerHTML += "\n";
            if (callback) setTimeout(callback, 300);
        }
    }, Math.random() * (maxDelay - minDelay) + minDelay);
}

// Tutorial automático con comandos avanzados y explicados
const tutorialSequence = [
    {
        user: "root",
        command: "apt update",
        output: `
Leyendo listas de paquetes... Hecho
Construyendo árbol de dependencias... Hecho
Tip: 'apt update' actualiza la lista de paquetes disponibles. :contentReference[oaicite:0]{index=0}
        `,
    },
    {
        user: "root",
        command: "apt upgrade",
        output: `
Leyendo listas de paquetes... Hecho
0 actualizados, 0 nuevos se instalarán
Tip: 'apt upgrade' instala actualizaciones disponibles. :contentReference[oaicite:1]{index=1}
        `,
    },
    {
        user: "root",
        command: "apt install mariadb-server",
        output: `
Leyendo paquetes... Hecho
Instalando mariadb-server... Hecho
Configurando mariadb-server... Hecho
Tip: 'apt install <paquete>' instala software. :contentReference[oaicite:2]{index=2}
        `,
    },
    {
        user: "root",
        command: "systemctl start mariadb",
        output: `
Tip: 'systemctl start <servicio>' inicia un servicio. Servicios son demonios en Linux.
`,
    },
    {
        user: "root",
        command: "systemctl status mariadb",
        output: `
● mariadb.service - MariaDB database server
   Loaded: loaded (/lib/systemd/system/mariadb.service; enabled)
   Active: active (running) since Tue Feb 10 12:15:00
Tip: Usa systemctl para revisar servicios del sistema.
`,
    },
    {
        user: "victxrlarixs",
        command: "ls -lha",
        output: `
drwxr-xr-x 4 user user 4.0K Feb 10 .
drwxr-xr-x 8 user user 4.0K Feb 10 ..
-rw-r--r-- 1 user user   12 Feb 10 archivo.txt
Tip: 'ls -lha' muestra archivos con detalles y ocultos. :contentReference[oaicite:3]{index=3}
        `,
    },
    {
        user: "victxrlarixs",
        command: "pwd",
        output: "/home/victxrlarixs/proyecto\nTip: 'pwd' muestra tu directorio actual. :contentReference[oaicite:4]{index=4}",
    },
    {
        user: "victxrlarixs",
        command: "cp archivo.txt copia.txt",
        output: "Archivo copiado a 'copia.txt'.\nTip: 'cp origen destino' copia archivos. :contentReference[oaicite:5]{index=5}",
    },
    {
        user: "victxrlarixs",
        command: "mv copia.txt viejo.txt",
        output: "Archivo renombrado a 'viejo.txt'.\nTip: 'mv origen destino' mueve o renombra. :contentReference[oaicite:6]{index=6}",
    },
    {
        user: "victxrlarixs",
        command: "grep 'Hola' archivo.txt",
        output: "Hola mundo\nTip: 'grep <patrón> archivo' busca texto dentro de archivos. :contentReference[oaicite:7]{index=7}",
    },
    {
        user: "victxrlarixs",
        command: "chmod +x script.sh",
        output: "Permisos actualizados.\nTip: 'chmod' cambia permisos de archivos. :contentReference[oaicite:8]{index=8}",
    },
    {
        user: "victxrlarixs",
        command: "ps aux",
        output: `
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1 169084  6524 ?        Ss   08:41   0:03 /sbin/init
mariadb   234  0.1  1.2 345000 20000 ?        Sl   08:42   0:05 /usr/sbin/mysqld
Tip: 'ps aux' lista procesos con detalles. :contentReference[oaicite:9]{index=9}
        `,
    },
    {
        user: "victxrlarixs",
        command: "kill 234",
        output: "Proceso 234 terminado.\nTip: 'kill <PID>' detiene procesos activos. :contentReference[oaicite:10]{index=10}",
    },
    {
        user: "victxrlarixs",
        command: "df -h",
        output: `
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   10G   37G  22% /
Tip: 'df -h' muestra uso de disco en forma legible. :contentReference[oaicite:11]{index=11}
        `,
    },
    {
        user: "victxrlarixs",
        command: "free -h",
        output: `
              total        used        free      shared  buff/cache   available
Mem:           7.8G        2.0G        4.8G        0.2G        1.0G        5.2G
Tip: 'free -h' muestra uso de memoria. :contentReference[oaicite:12]{index=12}
        `,
    },
    {
        user: "victxrlarixs",
        command: "ping -c 3 example.com",
        output: `
PING example.com (93.184.216.34): 56 data bytes
64 bytes from 93.184.216.34: icmp_seq=0 ttl=56 time=12.3 ms
Tip: 'ping -c <n> host' comprueba conectividad. :contentReference[oaicite:13]{index=13}
        `,
    },
    {
        user: "victxrlarixs",
        command: "wget https://example.com/file.txt",
        output: "Descargando file.txt... Hecho.\nTip: 'wget <URL>' descarga archivos via HTTP. :contentReference[oaicite:14]{index=14}",
    },
    {
        user: "victxrlarixs",
        command: "tar -czvf proyecto.tar.gz *",
        output: `
proyecto/
proyecto/archivo.txt
Tip: 'tar -czvf archivo.tar.gz *' crea un .tar.gz con todo. :contentReference[oaicite:15]{index=15}
        `,
    },
];

// Corre el tutorial automático
function runAutoTutorial(seq, index = 0) {
    if (index >= seq.length) {
        print("Tutorial completado. Escribe comandos tú mismo ahora. Tip: escribe 'help' para ver opciones.");
        isTutorialRunning = false;
        return;
    }
    const step = seq[index];
    typeLine(`${step.user}@Debian:${currentPath.replace("/home/victxrlarixs", "~")}$ ${step.command}`, () => {
        setTimeout(() => {
            print(step.output, "tip");
            runAutoTutorial(seq, index + 1);
        }, 600);
    });
}

// Inicia tutorial
print("Bienvenidos a Debian.com.mx ...");
print("cargando...\n");

setTimeout(() => runAutoTutorial(tutorialSequence), 1000);

// Permite entrada del usuario
terminalInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        const input = terminalInput.value.trim();
        print(`victxrlarixs@Debian:${currentPath.replace("/home/victxrlarixs", "~")}$ ${input}`, "command");
        if (isTutorialRunning) {
            isTutorialRunning = false;
            print("⏹ Tutorial detenido — ahora puedes usar la terminal libremente.", "tip");
        }
        // Aquí puedes expandir lógica interactiva (ej: ejecutar comandos, mostrar man, etc.)
        terminalInput.value = "";
    }
});



function openHtopTerminal(title = "htop") {
    const win = document.createElement("div");
    win.classList.add("window");
    win.style.top = "150px";
    win.style.left = "600px";
    win.style.width = "500px";
    win.style.height = "350px";
    win.style.zIndex = ++zIndexFM;
    win.style.backgroundColor = "#000";

    const titlebar = document.createElement("div");
    titlebar.classList.add("titlebar");
    titlebar.textContent = title;

    const closeBtn = document.createElement("div");
    closeBtn.classList.add("close-btn");
    closeBtn.innerHTML = `<img src="./src/icons/tab_close.png">`;
    closeBtn.onclick = () => { clearInterval(updateInterval); win.remove(); };
    titlebar.appendChild(closeBtn);

    win.appendChild(titlebar);
    makeDraggable(win, titlebar);

    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 320;
    win.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    ctx.font = "14px 'DejaVu Sans Mono', monospace";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#3b8f9b";

    const maxProcesses = 15;
    const processes = [];

    function randomProcess(pid) {
        return {
            pid,
            user: ["root", "victxrlarixs", "daemon"][Math.floor(Math.random() * 3)],
            cpu: Math.floor(Math.random() * 100),
            mem: Math.floor(Math.random() * 100),
            command: ["bash", "mysqld", "node", "python", "htop", "nginx", "emacs", "redis", "apache2", "mysql", "php-fpm", "docker"][Math.floor(Math.random() * 12)]
        };
    }

    for (let i = 0; i < maxProcesses; i++) {
        processes.push(randomProcess(1000 + i));
    }

    function drawHtop() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#3b8f9b";
        ctx.fillText("PID   USER        CPU%   MEM%   COMMAND", 10, 0);

        processes.forEach((p, i) => {
            const y = 20 + i * 20;
            ctx.fillText(
                `${p.pid.toString().padEnd(5)} ${p.user.padEnd(10)} ${p.cpu.toString().padEnd(6)} ${p.mem.toString().padEnd(6)} ${p.command}`,
                10,
                y
            );
        });
    }

    drawHtop();

    const updateInterval = setInterval(() => {
        // Cambiar CPU y MEM de manera lenta
        processes.forEach(p => {
            p.cpu = Math.max(0, Math.min(100, p.cpu + Math.floor(Math.random() * 5 - 2)));
            p.mem = Math.max(0, Math.min(100, p.mem + Math.floor(Math.random() * 5 - 2)));
        });

        // Reordenar procesos según CPU descendente
        processes.sort((a, b) => b.cpu - a.cpu);

        drawHtop();
    }, 500);

    document.body.appendChild(win);
}

document.getElementById("htopBtn").onclick = () => {
    openHtopTerminal("htop");
};