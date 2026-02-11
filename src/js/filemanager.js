// ================= CDE FILE MANAGER =================

// File system virtual
const fs = {
    "/home/victxrlarixs/": {
        type: "folder",
        children: {
            "Desktop": { type: "folder", children: {} },
            "bienvenida.txt": { type: "file", content: "Bienvenido a Debian WebCDE." },
            "tutoriales": {
                type: "folder",
                children: {
                    "primeros-pasos.txt": { type: "file", content: "Usa ls, cd, cat, mkdir, touch." }
                }
            },
            "configuraciones": {
                type: "folder",
                children: {
                    "tema.txt": { type: "file", content: "Tema actual: CDE Retro" }
                }
            }
        }
    }
};

let currentPath = "/home/victxrlarixs/";
let history = [];
let historyIndex = -1;
let fmSelected = null;
let showHidden = false;
let zIndexFM = 1000;
let fileManagerInitialized = false;

// ================= RENDER FILES =================
function renderFiles() {
    const container = document.getElementById("fmFiles");
    const pathInput = document.getElementById("fmPath");
    const status = document.getElementById("fmStatus");

    if (!container || !pathInput || !status) {
        console.warn("⚠️ File Manager elements not found");
        return;
    }

    container.innerHTML = "";
    pathInput.value = currentPath;

    const folder = fs[currentPath]?.children;
    if (!folder) {
        console.warn("⚠️ Current path not found:", currentPath);
        return;
    }

    let count = 0;

    for (const name in folder) {
        if (!showHidden && name.startsWith(".")) continue;
        const item = folder[name];
        count++;

        const div = document.createElement("div");
        div.className = "fm-file";
        div.dataset.name = name;

        div.onclick = () => {
            document.querySelectorAll(".fm-file").forEach(el => el.classList.remove("selected"));
            div.classList.add("selected");
            fmSelected = name;
        };

        const img = document.createElement("img");
        img.src = item.type === "folder" ? "./src/icons/filemanager.png" : "./src/icons/gedit.png";

        const span = document.createElement("span");
        span.textContent = name;

        div.appendChild(img);
        div.appendChild(span);

        div.ondblclick = () => {
            if (item.type === "folder") openPath(currentPath + name + "/");
            else openTextWindow(name, item.content);
        };

        container.appendChild(div);
    }

    status.textContent = `${count} items`;
}

// ================= NAVIGATION =================
function openPath(path) {
    if (!fs[path]) return;

    history = history.slice(0, historyIndex + 1);
    history.push(path);
    historyIndex++;

    currentPath = path;
    renderFiles();
}

function goBack() {
    if (historyIndex > 0) {
        historyIndex--;
        currentPath = history[historyIndex];
        renderFiles();
    }
}

function goForward() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        currentPath = history[historyIndex];
        renderFiles();
    }
}

function goUp() {
    const parent = currentPath.split("/").slice(0, -2).join("/") + "/";
    if (fs[parent]) openPath(parent);
}

function goHome() {
    openPath("/home/victxrlarixs/");
}

// ================= FILE OPERATIONS =================
function touch(name) {
    if (!fs[currentPath]) return;
    fs[currentPath].children[name] = { type: "file", content: "" };
    renderFiles();
}

function mkdir(name) {
    if (!fs[currentPath]) return;
    fs[currentPath].children[name] = { type: "folder", children: {} };
    renderFiles();
}

function rm(name) {
    if (!fs[currentPath]) return;
    delete fs[currentPath].children[name];
    renderFiles();
}

function rename(oldName, newName) {
    if (!fs[currentPath]) return;
    fs[currentPath].children[newName] = fs[currentPath].children[oldName];
    delete fs[currentPath].children[oldName];
    fmSelected = null;
    renderFiles();
}

function openTextWindow(name, content) {
    const win = document.getElementById("textWindow");
    if (!win) return;

    document.getElementById("textTitle").textContent = name;
    document.getElementById("textContent").textContent = content;
    win.style.display = "block";
    win.style.zIndex = ++zIndexFM;
}

// ================= MENU BAR =================
const fmMenus = {
    File: [
        { label: "New File", action: () => { const n = prompt("Nombre del archivo:"); if (n) touch(n); } },
        { label: "New Folder", action: () => { const n = prompt("Nombre de la carpeta:"); if (n) mkdir(n); } },
        { label: "Delete Selected", action: () => { if (fmSelected) rm(fmSelected); } }
    ],
    Edit: [
        {
            label: "Rename", action: () => {
                if (!fmSelected) return;
                const newName = prompt("Nuevo nombre:", fmSelected);
                if (newName) rename(fmSelected, newName);
            }
        }
    ],
    View: [
        { label: "Toggle Hidden Files", action: () => { showHidden = !showHidden; renderFiles(); } },
        { label: "Refresh", action: () => renderFiles() }
    ],
    Go: [
        { label: "Back", action: goBack },
        { label: "Forward", action: goForward },
        { label: "Up", action: goUp },
        { label: "Home", action: goHome }
    ],
    Help: [
        {
            label: "About",
            action: () => {
                // Asegurarse que openRetroModal existe
                if (typeof openRetroModal === 'function') {
                    openRetroModal(
                        "Information",
                        `<p>Debian With CDE -v1.0.0</p>
                         <p><a href='https://github.com/victxrlarixs' target='_blank'>https://github.com/victxrlarixs</a></p>`,
                        [
                            { label: 'Cerrar', closeOnClick: true },
                            {
                                label: 'Ir a GitHub',
                                onClick: () => window.open('https://github.com/victxrlarixs', '_blank'),
                                closeOnClick: false
                            }
                        ]
                    );
                } else {
                    alert("Debian With CDE -v1.0.0\nhttps://github.com/victxrlarixs");
                }
            }
        }
    ]
};

let activeFMMenu = null;

function setupMenuBar() {
    const fmMenuBar = document.querySelector(".fm-menubar");
    if (!fmMenuBar) return;

    // Limpiar event listeners previos
    fmMenuBar.querySelectorAll("span").forEach(span => {
        span.onclick = null;
    });

    fmMenuBar.querySelectorAll("span").forEach(span => {
        span.addEventListener("click", (e) => {
            e.stopPropagation();
            closeFMMenu();

            const name = span.textContent.trim();
            const items = fmMenus[name];
            if (!items) return;

            const menu = document.createElement("div");
            menu.className = "fm-dropdown";
            menu.style.zIndex = ++zIndexFM;

            items.forEach(item => {
                const opt = document.createElement("div");
                opt.className = "fm-dropdown-item";
                opt.textContent = item.label;
                opt.onclick = () => {
                    item.action();
                    closeFMMenu();
                };
                menu.appendChild(opt);
            });

            document.body.appendChild(menu);
            const rect = span.getBoundingClientRect();
            menu.style.left = rect.left + "px";
            menu.style.top = rect.bottom + "px";

            activeFMMenu = menu;
        });
    });
}

function closeFMMenu() {
    if (activeFMMenu) {
        activeFMMenu.remove();
        activeFMMenu = null;
    }
}

// ================= CONTEXT MENU =================
let fmContextMenu = null;

function setupContextMenu() {
    const fmFiles = document.getElementById("fmFiles");
    if (!fmFiles) return;

    // Remover event listeners previos
    fmFiles.oncontextmenu = null;
    fmFiles.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (fmContextMenu) fmContextMenu.remove();

        const fileEl = e.target.closest(".fm-file");
        if (!fileEl) return;

        const name = fileEl.dataset.name;
        fmSelected = name;

        document.querySelectorAll(".fm-file").forEach(el => el.classList.remove("selected"));
        fileEl.classList.add("selected");

        const menu = document.createElement("div");
        menu.className = "fm-contextmenu";
        menu.style.zIndex = ++zIndexFM;

        const items = [
            {
                label: "Open", action: () => {
                    const item = fs[currentPath].children[name];
                    if (item.type === "folder") openPath(currentPath + name + "/");
                    else openTextWindow(name, item.content);
                }
            },
            {
                label: "Rename", action: () => {
                    const newName = prompt("Nuevo nombre:", name);
                    if (newName) rename(name, newName);
                }
            },
            {
                label: "Delete", action: () => {
                    if (confirm(`¿Eliminar ${name}?`)) rm(name);
                }
            },
            {
                label: "Properties", action: () => {
                    const item = fs[currentPath].children[name];
                    alert(`Nombre: ${name}\nTipo: ${item.type}\nRuta: ${currentPath}${name}`);
                }
            }
        ];

        items.forEach(item => {
            const div = document.createElement("div");
            div.className = "fm-context-item";
            div.textContent = item.label;
            div.onclick = () => {
                item.action();
                if (fmContextMenu) fmContextMenu.remove();
            };
            menu.appendChild(div);
        });

        menu.style.left = e.pageX + "px";
        menu.style.top = e.pageY + "px";
        document.body.appendChild(menu);
        fmContextMenu = menu;
    });
}

// ================= INITIALIZATION =================
function initFileManager() {
    if (fileManagerInitialized) {
        console.log("⚠️ File Manager already initialized");
        return;
    }

    console.log("📁 Initializing File Manager...");

    // Reset estado
    currentPath = "/home/victxrlarixs/";
    history = [currentPath];
    historyIndex = 0;
    fmSelected = null;
    showHidden = false;

    // Configurar menú bar
    setupMenuBar();

    // Configurar contexto menu
    setupContextMenu();

    // Configurar navegación
    const sidebarItems = document.querySelectorAll(".fm-item");
    if (sidebarItems.length > 0) {
        sidebarItems.forEach(item => {
            item.onclick = () => {
                const path = item.dataset.path;
                if (path) openPath(path);
            };
        });
    }

    // Renderizar archivos
    renderFiles();

    // Event listeners para menús
    document.addEventListener("click", closeFMMenu);
    document.addEventListener("click", () => {
        if (fmContextMenu) fmContextMenu.remove();
    });

    fileManagerInitialized = true;
    console.log("✅ File Manager initialized");
}

// ================= FUNCIONES PÚBLICAS =================
function openFileManager() {
    if (!fileManagerInitialized) {
        initFileManager();
    }

    const fmWindow = document.getElementById("fm");
    if (fmWindow) {
        fmWindow.style.display = "block";
        fmWindow.style.zIndex = ++zIndexFM;
    }

    renderFiles();
}

function closeFileManager() {
    const fmWindow = document.getElementById("fm");
    if (fmWindow) {
        fmWindow.style.display = "none";
    }
}

function isFileManagerOpen() {
    const fmWindow = document.getElementById("fm");
    return fmWindow && fmWindow.style.display !== "none";
}

// Toggle tipo CDE: abre si está cerrado, si ya está abierto solo lo trae al frente
function toggleFileManager() {
    const fmWindow = document.getElementById("fm");

    if (!fileManagerInitialized) {
        initFileManager();
    }

    if (!fmWindow) return;

    if (fmWindow.style.display === "none" || fmWindow.style.display === "") {
        fmWindow.style.display = "block";
        fmWindow.style.zIndex = ++zIndexFM;
    } else {
        fmWindow.style.zIndex = ++zIndexFM; // traer al frente
    }

    renderFiles();
}

// Exponer globalmente
window.openFileManager = openFileManager;
window.closeFileManager = closeFileManager;
window.toggleFileManager = toggleFileManager;
window.isFileManagerOpen = isFileManagerOpen;


console.log("✅ File Manager module loaded (not auto-initialized)");