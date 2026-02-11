
function openTextWindow(title, content) {
    const win = document.getElementById("textWindow");
    focusWindow("textWindow");
    document.getElementById("textTitle").textContent = title;
    document.getElementById("textContent").textContent = content;
    win.style.display = "block";
}

/* ================= CDE MENU ================= */

const menuBtn = document.getElementById("cde-menu-btn");
const cdeMenu = document.getElementById("cde-menu");

menuBtn.addEventListener("click", () => {
    cdeMenu.classList.toggle("hidden");
    focusWindow("cde-menu");
});

document.addEventListener("click", (e) => {
    if (!menuBtn.contains(e.target) && !cdeMenu.contains(e.target)) {
        cdeMenu.classList.add("hidden");
    }
});

/* ================= CLOCK ================= */

function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    document.getElementById("clock").textContent = `${h}:${m}`;
}

setInterval(updateClock, 1000);
updateClock();


function openRetroModal(title, content, buttons = []) {
    // Crear modal base
    const modal = document.createElement("div");
    modal.classList.add("cde-retro-modal");
    modal.style.top = "100px";
    modal.style.left = "100px";
    modal.style.width = "300px";

    // Titlebar
    const titlebar = document.createElement("div");
    titlebar.classList.add("titlebar");
    titlebar.textContent = title;

    // Botón cerrar
    const closeBtn = document.createElement("div");
    closeBtn.classList.add("close-btn");
    closeBtn.innerHTML = `<img src="./src/icons/tab_close.png">`;
    closeBtn.onclick = () => modal.remove();
    titlebar.appendChild(closeBtn);

    modal.appendChild(titlebar);

    // Body
    const body = document.createElement("div");
    body.classList.add("modal-body");
    if (typeof content === "string") {
        body.innerHTML = content;
    } else {
        body.appendChild(content);
    }
    modal.appendChild(body);

    // Actions (botones)
    if (buttons.length) {
        const actions = document.createElement("div");
        actions.classList.add("modal-actions");
        buttons.forEach(btn => {
            const button = document.createElement("button");
            button.classList.add("modal-btn");
            button.textContent = btn.label;
            button.onclick = () => {
                if (btn.onClick) btn.onClick();
                if (btn.closeOnClick) modal.remove();
            };
            actions.appendChild(button);
        });
        modal.appendChild(actions);
    }

    document.body.appendChild(modal);

    // Drag
    makeDraggable(modal, titlebar);
}

// Función de arrastrar ventana (igual que tus windows)
function makeDraggable(win, handle) {
    let offsetX = 0, offsetY = 0, dragging = false;
    handle.addEventListener("mousedown", e => {
        dragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        document.body.style.userSelect = "none";
    });
    document.addEventListener("mouseup", () => dragging = false);
    document.addEventListener("mousemove", e => {
        if (dragging) {
            win.style.left = e.clientX - offsetX + "px";
            win.style.top = e.clientY - offsetY + "px";
        }
    });
}

