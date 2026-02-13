/**
 * @fileoverview Gestor de archivos CDE con modales personalizados.
 * Sistema de archivos virtual, navegación, operaciones básicas,
 * menú contextual y barra de menú estilo CDE.
 * @author victxrlarixs
 */

const FileManager = (() => {
    // ------------------------------------------------------------------
    // DEPENDENCIA: CDEModal (con fallback nativo)
    // ------------------------------------------------------------------
    const CDEModal = window.CDEModal || {
        alert: async (msg) => { alert(msg); },
        confirm: async (msg) => confirm(msg),
        prompt: async (msg, def) => prompt(msg, def)
    };

    // ------------------------------------------------------------------
    // SISTEMA DE ARCHIVOS VIRTUAL
    // ------------------------------------------------------------------
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
    let zIndex = 1000;
    let initialized = false;
    let activeMenu = null;
    let activeContextMenu = null;

    // ------------------------------------------------------------------
    // FUNCIONES PRIVADAS
    // ------------------------------------------------------------------
    function getCurrentFolder() {
        return fs[currentPath]?.children || null;
    }

    function renderFiles() {
        const container = document.getElementById("fmFiles");
        const pathInput = document.getElementById("fmPath");
        const status = document.getElementById("fmStatus");

        if (!container || !pathInput || !status) {
            console.warn("⚠️ File Manager: elementos no encontrados");
            return;
        }

        container.innerHTML = "";
        pathInput.value = currentPath;

        const folder = getCurrentFolder();
        if (!folder) {
            console.warn(`⚠️ File Manager: ruta no encontrada: ${currentPath}`);
            return;
        }

        let count = 0;

        Object.entries(folder).forEach(([name, item]) => {
            if (!showHidden && name.startsWith(".")) return;
            count++;

            const div = document.createElement("div");
            div.className = "fm-file";
            div.dataset.name = name;

            div.addEventListener("click", (e) => {
                e.stopPropagation();
                document.querySelectorAll(".fm-file").forEach(el => el.classList.remove("selected"));
                div.classList.add("selected");
                fmSelected = name;
            });

            const img = document.createElement("img");
            img.src = item.type === "folder"
                ? "./src/icons/filemanager.png"
                : "./src/icons/gedit.png";

            const span = document.createElement("span");
            span.textContent = name;

            div.appendChild(img);
            div.appendChild(span);

            div.addEventListener("dblclick", () => {
                if (item.type === "folder") {
                    openPath(currentPath + name + "/");
                } else {
                    openTextWindow(name, item.content);
                }
            });

            container.appendChild(div);
        });

        status.textContent = `${count} ${count === 1 ? 'elemento' : 'elementos'}`;
    }

    /**
     * Abre una ruta del sistema de archivos.
     * @param {string} path - Ruta absoluta a abrir.
     */
    function openPath(path) {
        if (!fs[path]) return;
        history = history.slice(0, historyIndex + 1);
        history.push(path);
        historyIndex++;
        currentPath = path;
        renderFiles();
    }

    /**
     * Navega hacia atrás en el historial.
     */
    function goBack() {
        if (historyIndex > 0) {
            historyIndex--;
            currentPath = history[historyIndex];
            renderFiles();
        }
    }

    /**
     * Navega hacia adelante en el historial.
     */
    function goForward() {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            currentPath = history[historyIndex];
            renderFiles();
        }
    }

    /**
     * Navega al directorio padre.
     */
    function goUp() {
        const parent = currentPath.split("/").slice(0, -2).join("/") + "/";
        if (fs[parent]) openPath(parent);
    }

    /**
     * Navega al directorio home.
     */
    function goHome() {
        openPath("/home/victxrlarixs/");
    }

    // ------------------------------------------------------------------
    // OPERACIONES ASÍNCRONAS CON MODALES
    // ------------------------------------------------------------------
    async function touch(name) {
        const folder = getCurrentFolder();
        if (folder && name) {
            folder[name] = { type: "file", content: "" };
            renderFiles();
        }
    }

    async function mkdir(name) {
        const folder = getCurrentFolder();
        if (folder && name) {
            folder[name] = { type: "folder", children: {} };
            renderFiles();
        }
    }

    async function rm(name) {
        const folder = getCurrentFolder();
        if (!folder) return;
        const confirmed = await CDEModal.confirm(`¿Eliminar ${name}?`);
        if (confirmed) {
            delete folder[name];
            fmSelected = null;
            renderFiles();
        }
    }

    async function rename(oldName, newName) {
        const folder = getCurrentFolder();
        if (folder && folder[oldName] && newName && newName !== oldName) {
            folder[newName] = folder[oldName];
            delete folder[oldName];
            fmSelected = null;
            renderFiles();
        }
    }

    function openTextWindow(name, content) {
        const win = document.getElementById("textWindow");
        if (!win) {
            console.warn("⚠️ File Manager: elemento #textWindow no encontrado");
            return;
        }
        const titleEl = document.getElementById("textTitle");
        const contentEl = document.getElementById("textContent");
        if (titleEl) titleEl.textContent = name;
        if (contentEl) contentEl.textContent = content;
        win.style.display = "block";
        win.style.zIndex = ++zIndex;
    }

    function closeMenu() {
        if (activeMenu) {
            activeMenu.remove();
            activeMenu = null;
        }
    }

    function closeContextMenu() {
        if (activeContextMenu) {
            activeContextMenu.remove();
            activeContextMenu = null;
        }
    }

    // ------------------------------------------------------------------
    // MENÚS
    // ------------------------------------------------------------------
    const fmMenus = {
        Archivo: [
            {
                label: "Nuevo archivo",
                action: async () => {
                    const name = await CDEModal.prompt("Nombre del archivo:");
                    if (name) await touch(name);
                }
            },
            {
                label: "Nueva carpeta",
                action: async () => {
                    const name = await CDEModal.prompt("Nombre de la carpeta:");
                    if (name) await mkdir(name);
                }
            },
            {
                label: "Eliminar seleccionado",
                action: async () => {
                    if (fmSelected) await rm(fmSelected);
                }
            }
        ],
        Editar: [
            {
                label: "Renombrar",
                action: async () => {
                    if (!fmSelected) return;
                    const newName = await CDEModal.prompt("Nuevo nombre:", fmSelected);
                    if (newName) await rename(fmSelected, newName);
                }
            }
        ],
        Ver: [
            {
                label: "Mostrar archivos ocultos",
                action: () => {
                    showHidden = !showHidden;
                    renderFiles();
                }
            },
            {
                label: "Actualizar",
                action: () => renderFiles()
            }
        ],
        Ir: [
            { label: "Atrás", action: goBack },
            { label: "Adelante", action: goForward },
            { label: "Subir", action: goUp },
            { label: "Inicio", action: goHome }
        ],
        Ayuda: [
            {
                label: "Acerca de",
                action: () => {
                    if (typeof openRetroModal === 'function') {
                        openRetroModal(
                            "Información",
                            `<p>Debian con CDE - v1.0.0</p>
                             <p><a href='https://github.com/victxrlarixs' target='_blank'>GitHub</a></p>`,
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
                        CDEModal.alert("Debian con CDE - v1.0.0\nhttps://github.com/victxrlarixs");
                    }
                }
            }
        ]
    };

    function setupMenuBar() {
        const menuBar = document.querySelector(".fm-menubar");
        if (!menuBar) return;
        menuBar.querySelectorAll("span").forEach(span => span.replaceWith(span.cloneNode(true)));
        const spans = menuBar.querySelectorAll("span");
        spans.forEach(span => {
            span.addEventListener("click", (e) => {
                e.stopPropagation();
                closeMenu();
                const name = span.textContent.trim();
                const items = fmMenus[name];
                if (!items) return;
                const menu = document.createElement("div");
                menu.className = "fm-dropdown";
                menu.style.zIndex = ++zIndex;
                items.forEach(item => {
                    const option = document.createElement("div");
                    option.className = "fm-dropdown-item";
                    option.textContent = item.label;
                    option.addEventListener("click", async () => {
                        try {
                            await item.action();
                        } catch (error) {
                            console.error("Error en acción del menú:", error);
                        }
                        closeMenu();
                    });
                    menu.appendChild(option);
                });
                document.body.appendChild(menu);
                const rect = span.getBoundingClientRect();
                menu.style.left = rect.left + "px";
                menu.style.top = rect.bottom + "px";
                activeMenu = menu;
            });
        });
    }

    function setupContextMenu() {
        const fmFiles = document.getElementById("fmFiles");
        if (!fmFiles) return;
        fmFiles.removeEventListener("contextmenu", handleContextMenu);
        fmFiles.addEventListener("contextmenu", handleContextMenu);
    }

    async function handleContextMenu(e) {
        e.preventDefault();
        closeContextMenu();

        const fileEl = e.target.closest(".fm-file");
        if (!fileEl) return;
        const name = fileEl.dataset.name;
        fmSelected = name;

        document.querySelectorAll(".fm-file").forEach(el => el.classList.remove("selected"));
        fileEl.classList.add("selected");

        const menu = document.createElement("div");
        menu.className = "fm-contextmenu";
        menu.style.zIndex = ++zIndex;

        const items = [
            {
                label: "Abrir",
                action: () => {
                    const item = getCurrentFolder()?.[name];
                    if (item) {
                        if (item.type === "folder") openPath(currentPath + name + "/");
                        else openTextWindow(name, item.content);
                    }
                }
            },
            {
                label: "Renombrar",
                action: async () => {
                    const newName = await CDEModal.prompt("Nuevo nombre:", name);
                    if (newName) await rename(name, newName);
                }
            },
            {
                label: "Eliminar",
                action: async () => await rm(name)
            },
            {
                label: "Propiedades",
                action: async () => {
                    const item = getCurrentFolder()?.[name];
                    if (item) {
                        await CDEModal.alert(`Nombre: ${name}\nTipo: ${item.type}\nRuta: ${currentPath}${name}`);
                    }
                }
            }
        ];

        items.forEach(item => {
            const div = document.createElement("div");
            div.className = "fm-context-item";
            div.textContent = item.label;
            div.addEventListener("click", async () => {
                try {
                    await item.action();
                } catch (error) {
                    console.error("Error en menú contextual:", error);
                }
                closeContextMenu();
            });
            menu.appendChild(div);
        });

        // Posicionamiento inteligente
        menu.style.left = e.pageX + "px";
        menu.style.top = e.pageY + "px";
        document.body.appendChild(menu);
        const menuRect = menu.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        if (menuRect.right > vw) menu.style.left = (e.pageX - menuRect.width) + "px";
        if (menuRect.bottom > vh) menu.style.top = (e.pageY - menuRect.height) + "px";

        activeContextMenu = menu;
    }

    // ------------------------------------------------------------------
    // API PÚBLICA
    // ------------------------------------------------------------------
    function init() {
        if (initialized) {
            console.log("⚠️ File Manager: ya inicializado");
            return;
        }
        console.log("📁 File Manager: inicializando...");
        currentPath = "/home/victxrlarixs/";
        history = [currentPath];
        historyIndex = 0;
        fmSelected = null;
        showHidden = false;
        setupMenuBar();
        setupContextMenu();

        const sidebarItems = document.querySelectorAll(".fm-item");
        sidebarItems.forEach(item => {
            const path = item.dataset.path;
            if (path) {
                // Remover onclick previo y usar addEventListener
                item.onclick = null;
                item.addEventListener("click", () => openPath(path));
            }
        });

        renderFiles();
        document.addEventListener("click", (e) => {
            if (activeMenu && !activeMenu.contains(e.target)) closeMenu();
            closeContextMenu();
        });
        initialized = true;
        console.log("✅ File Manager: inicializado");
    }

    function open() {
        const win = document.getElementById("fm");
        if (!win) return;
        if (!initialized) init();
        win.style.display = "block";
        win.style.zIndex = ++zIndex;
        renderFiles();
    }

    function close() {
        const win = document.getElementById("fm");
        if (win) win.style.display = "none";
    }

    function toggle() {
        const win = document.getElementById("fm");
        if (!win) return;
        if (!initialized) init();
        if (win.style.display === "none" || win.style.display === "") {
            win.style.display = "block";
            win.style.zIndex = ++zIndex;
        } else {
            win.style.zIndex = ++zIndex;
        }
        renderFiles();
    }

    function isOpen() {
        const win = document.getElementById("fm");
        return win?.style.display !== "none" && win?.style.display !== "";
    }

    // ------------------------------------------------------------------
    // RETORNO DE API PÚBLICA (incluye funciones de navegación)
    // ------------------------------------------------------------------
    return {
        init,
        open,
        close,
        toggle,
        isOpen,
        openPath,
        goBack,
        goForward,
        goUp,
        goHome
    };
})();

// ------------------------------------------------------------------
// EXPOSICIÓN GLOBAL PARA COMPATIBILIDAD CON EVENTOS HTML
// ------------------------------------------------------------------
window.openFileManager = FileManager.open;
window.closeFileManager = FileManager.close;
window.toggleFileManager = FileManager.toggle;
window.isFileManagerOpen = FileManager.isOpen;
window.openPath = FileManager.openPath;
window.goBack = FileManager.goBack;
window.goForward = FileManager.goForward;
window.goUp = FileManager.goUp;
window.goHome = FileManager.goHome;

console.log("✅ FileManager module loaded (call FileManager.init() to start)");