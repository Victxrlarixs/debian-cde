
let zIndex = 100;

function focusWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    zIndex++;
    win.style.zIndex = zIndex;
}

document.querySelectorAll(".window").forEach(win => {
    win.addEventListener("mousedown", () => focusWindow(win.id));
});

/* ================= DRAG WINDOWS ================= */

let currentDrag = null;
let offsetX = 0;
let offsetY = 0;

function drag(e, id) {
    const el = document.getElementById(id);
    if (!el) return;

    focusWindow(id);
    currentDrag = el;

    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stopDrag);
}

function move(e) {
    if (!currentDrag) return;
    currentDrag.style.left = e.clientX - offsetX + "px";
    currentDrag.style.top = e.clientY - offsetY + "px";
}

function stopDrag() {
    currentDrag = null;
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", stopDrag);
}


/* ================= CLOCK ================= */

function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    document.getElementById("clock").textContent = `${h}:${m}`;
}

setInterval(updateClock, 1000);
updateClock();


document.addEventListener('DOMContentLoaded', function () {
    const dropdownBtn = document.getElementById('utilitiesBtn');
    const dropdownMenu = document.getElementById('utilitiesDropdown');

    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.appendChild(dropdownMenu);
        dropdownBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            this.classList.toggle('open');
        });

        document.addEventListener('click', function (e) {
            if (!dropdownBtn.contains(e.target)) {
                dropdownBtn.classList.remove('open');
            }
        });

        dropdownMenu.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }
});

function openCalculator() {
    alert('Calculadora CDE - En desarrollo');
}
