import{l as o}from"./logger.BTmUhr6C.js";const j={"--topbar-color":"#8b8ba5","--window-color":"#8b8ba5","--titlebar-color":"#a54a4a","--titlebar-text-color":"#ffffff","--terminal-bg-color":"#000000","--terminal-text-color":"#00ff00","--dock-color":"#8b8ba5","--menu-color":"#8b8ba5","--dock-icon-bg":"#7a7a9a","--dock-icon-hover":"#9a9ac5","--dock-icon-active":"#6a6a8a","--button-bg":"#8b8ba5","--button-active":"#6a6a8a","--separator-color":"#4a4a5a","--modal-bg":"#8b8ba5","--scrollbar-color":"#a54a4a","--text-color":"#000000","--border-light":"#b4b4c3","--border-dark":"#4a4a5a","--border-inset-light":"#9a9ab5","--border-inset-dark":"#3a3a4a","--shadow-color":"rgba(0, 0, 0, 0.3)"},X={"--topbar-color":"#aeaeae","--window-color":"#aeaeae","--titlebar-color":"#4a6c7a","--titlebar-text-color":"#ffffff","--dock-color":"#aeaeae","--menu-color":"#aeaeae","--button-bg":"#aeaeae","--scrollbar-color":"#4a6c7a","--text-color":"#000000","--border-light":"#dfdfdf","--border-dark":"#606060","--shadow-color":"rgba(0, 0, 0, 0.3)"},K={"--topbar-color":"#93a58b","--window-color":"#93a58b","--titlebar-color":"#1b842c","--titlebar-text-color":"#ffffff","--dock-color":"#93a58b","--menu-color":"#93a58b","--button-bg":"#93a58b","--scrollbar-color":"#1b842c","--text-color":"#000000","--border-light":"#b8c3b4","--border-dark":"#4a5a4a","--shadow-color":"rgba(0, 0, 0, 0.3)"},Y={"--topbar-color":"#c3b2ae","--window-color":"#c3b2ae","--titlebar-color":"#8b5a2b","--titlebar-text-color":"#ffffff","--dock-color":"#c3b2ae","--menu-color":"#c3b2ae","--button-bg":"#c3b2ae","--scrollbar-color":"#8b5a2b","--text-color":"#000000","--border-light":"#d8cdc9","--border-dark":"#5a4a46","--shadow-color":"rgba(0, 0, 0, 0.3)"},Q={"--topbar-color":"#aeaeae","--window-color":"#aeaeae","--titlebar-color":"#606060","--titlebar-text-color":"#ffffff","--dock-color":"#aeaeae","--menu-color":"#aeaeae","--button-bg":"#aeaeae","--scrollbar-color":"#606060","--text-color":"#000000","--border-light":"#dfdfdf","--border-dark":"#404040","--shadow-color":"rgba(0, 0, 0, 0.3)"},J={"--topbar-color":"#a5a5c3","--window-color":"#a5a5c3","--titlebar-color":"#4a4a7a","--titlebar-text-color":"#ffffff","--dock-color":"#a5a5c3","--menu-color":"#a5a5c3","--button-bg":"#a5a5c3","--scrollbar-color":"#4a4a7a","--text-color":"#000000","--border-light":"#c9c9d8","--border-dark":"#4a4a5a","--shadow-color":"rgba(0, 0, 0, 0.3)"},Z={"--topbar-color":"#8b8ba5","--window-color":"#8b8ba5","--titlebar-color":"#a54a4a","--titlebar-text-color":"#ffffff","--dock-color":"#8b8ba5","--menu-color":"#8b8ba5","--button-bg":"#8b8ba5","--scrollbar-color":"#a54a4a","--text-color":"#000000","--border-light":"#b4b4c3","--border-dark":"#4a4a5a","--shadow-color":"rgba(0, 0, 0, 0.3)"},nn={"--topbar-color":"#4a4a4a","--window-color":"#4a4a4a","--titlebar-color":"#2a2a2a","--titlebar-text-color":"#ffffff","--dock-color":"#4a4a4a","--menu-color":"#4a4a4a","--button-bg":"#4a4a4a","--scrollbar-color":"#2a2a2a","--text-color":"#ffffff","--border-light":"#7a7a7a","--border-dark":"#1a1a1a","--shadow-color":"rgba(0, 0, 0, 0.6)"},F={__default__:j,broica:X,emerald:K,gold:Y,grayscale:Q,alpine:J,skyred:Z,charcoal:nn},en={"--font-family-base":'"Fixedsys", "Lucida Console", monospace',"--font-family-terminal":'"Courier New", monospace',"--font-size-base":"12px","--font-size-title":"13px","--font-size-small":"11px","--font-weight-normal":"400","--font-weight-bold":"700","--line-height-base":"1.45"},tn={"--font-family-base":"Arial, sans-serif","--font-family-terminal":"Consolas, monospace","--font-size-base":"14px","--font-size-title":"15px","--font-size-small":"12px","--font-weight-normal":"400","--font-weight-bold":"700","--line-height-base":"1.5"},sn={"--font-family-base":'"MS Sans Serif", sans-serif',"--font-family-terminal":'"Lucida Console", monospace',"--font-size-base":"11px","--font-size-title":"12px","--font-size-small":"10px","--font-weight-normal":"700","--font-weight-bold":"900","--line-height-base":"1.3"},an={"--font-family-base":'"Ubuntu Mono", monospace',"--font-family-terminal":'"DejaVu Sans Mono", monospace',"--font-size-base":"13px","--font-size-title":"14px","--font-size-small":"12px","--font-weight-normal":"400","--font-weight-bold":"700","--line-height-base":"1.4"},O={__default__:en,"classic-cde":{"--font-family-base":'"Fixedsys", "Lucida Console", monospace',"--font-family-terminal":'"Courier New", monospace',"--font-size-base":"12px","--font-size-title":"13px","--font-size-small":"11px","--font-weight-normal":"400","--font-weight-bold":"700","--line-height-base":"1.45"},modern:tn,retro:sn,terminal:an},{__default__:rn,...on}=F,{__default__:ln,...cn}=O,u={WINDOW:{MIN_VISIBLE:20,BASE_Z_INDEX:1e4,TOP_BAR_HEIGHT:30},AUDIO:{BEEP_FREQUENCY:880,BEEP_GAIN:.1,BEEP_DURATION:.1},SCREENSHOT:{SCALE:2,TOAST_MESSAGE:"Screenshot Desktop...",FILENAME_PREFIX:"CDE"},FILEMANAGER:{BASE_Z_INDEX:1e4},FS:{HOME:"/home/victxrlarixs/",DESKTOP:"/home/victxrlarixs/Desktop/",TRASH:"/home/victxrlarixs/.Trash/",NETWORK:"/network/"},TERMINAL:{HOME_PATH:"/home/victxrlarixs",MIN_TYPING_DELAY:20,MAX_TYPING_DELAY:80,POST_COMMAND_DELAY:800,POST_SEQUENCE_DELAY:2e3,MAX_LINES:50,CLEANUP_INTERVAL:3e4,SCROLL_INTERVAL:500,TRANSITION_MESSAGES:["Continuing with more useful commands...","Next topic: administration commands...","Moving on to more complex operations...","Learning new functionalities...","Next section: development tools...","Exploring network commands..."]},BOOT:{LOGO:`#> 
#>  _______________________________________________________
#> /                                                       | 
#> | Ready to explore Debian CDE project ?                  | 
#> \\                                                      | 
#>  -------------------------------------------------------
#>                  \\
#>                   \\
#>             ,        ,
#>             /(        )\`
#>             \\ \\___   / |
#>             /- _  \`-/  '
#>            (/\\/ \\ \\   /\\
#>            / /   | \`    
#>            O O   ) /    |
#>            \`-^--'\`<     '
#>           (_.)  _  )   /
#>            \`.___/\`    /
#>              \`-----' /
#> <----.     __ / __   \\
#> <----|====O)))==) \\) /====
#> <----'    \`--' \`.__,' \\
#>              |        |
#>               \\       /
#>         ______( (_  / \\______
#>       ,'  ,-----'   |        \\
#>       \`--{__________)        \\/`,FINAL_DELAY:443},TASK_MANAGER:{BUTTON_ID:"taskmanager-btn",WINDOW_ID:"taskmanager",BASE_Z_INDEX:1e4},DEFAULT_STYLES:{COLORS:rn,FONTS:ln},THEMES:on,FONT_PRESETS:cn,DROPDOWN:{Z_INDEX:2e4,OFFSET:6},META:{GITHUB_REPO:"https://github.com/Victxrlarixs/debian-cde",ISSUES_URL:"https://github.com/Victxrlarixs/debian-cde/issues"},TIMINGS:{SCANNING_DELAY:200,NORMALIZATION_DELAY:100},DESKTOP_ICONS:{BASE_Z_INDEX:10,STORAGE_KEY:"cde_desktop_icons",GRID_SIZE:80,ICON_GAP:20}};typeof window<"u"&&(window.CONFIG=u,o.log("[Config] Configuration loaded and attached to window"));class dn{modalElement=null;currentResolver=null;zIndex=1e4;getModal(){if(this.modalElement&&document.body.contains(this.modalElement))return o.log("[CDEModal] Reusing existing modal element"),this.modalElement;o.log("[CDEModal] Creating new modal instance");const e=document.querySelector(".cde-retro-modal");if(e){o.log("[CDEModal] Cloning existing modal and cleaning artifacts"),this.modalElement=e.cloneNode(!0),this.modalElement.id="cde-modal-global",this.modalElement.classList.add("cde-modal-global"),this.modalElement.querySelector(".cde-sidepanel")?.remove(),this.modalElement.querySelector(".cde-statusbar")?.remove(),this.modalElement.querySelectorAll(".cde-controlgroup, .cde-controlpanel, .cde-presets, .cde-preset-row, .cde-subtitle").forEach(r=>r.remove());const t=this.modalElement.querySelector(".modal-body");t&&(t.innerHTML="");let a=this.modalElement.querySelector(".cde-actionbar");a?a.innerHTML="":(a=document.createElement("div"),a.className="cde-actionbar",this.modalElement.appendChild(a))}else{o.log("[CDEModal] Creating new modal from scratch"),this.modalElement=document.createElement("div"),this.modalElement.className="cde-retro-modal cde-modal-global",this.modalElement.id="cde-modal-global";const t=document.createElement("div");t.className="titlebar",t.innerHTML=`
        <span class="titlebar-text">CDE Dialog</span>
        <div class="close-btn">
          <img src="/icons/tab_close.png">
        </div>
      `;const a=document.createElement("div");a.className="modal-body";const r=document.createElement("div");r.className="cde-actionbar",this.modalElement.appendChild(t),this.modalElement.appendChild(a),this.modalElement.appendChild(r)}const s=this.modalElement.querySelector(".close-btn");return s&&(s.onclick=t=>{t.stopPropagation(),o.log("[CDEModal] Close button clicked"),this.close()}),document.body.appendChild(this.modalElement),o.log("[CDEModal] Modal appended to DOM"),this.modalElement}open(e,s,t=[{label:"Accept",value:!0}]){o.log(`[CDEModal] Opening dialog: "${e}" with ${t.length} buttons`);const a=this.getModal(),r=a.querySelector(".titlebar-text");r&&(r.textContent=e);const i=a.querySelector(".modal-body");i.innerHTML=s;const h=a.querySelector(".cde-actionbar");return h.innerHTML="",new Promise(l=>{this.currentResolver=l,t.forEach((d,T)=>{const v=document.createElement("button");v.className=`cde-btn ${d.isDefault?"cde-btn-default":""}`,v.textContent=d.label,v.onclick=A=>{A.stopPropagation();const k=d.value!==void 0?d.value:d.label;o.log(`[CDEModal] Button "${d.label}" clicked, resolving with value:`,k),this.close(),l(k)},h.appendChild(v),o.log(`[CDEModal] Added button ${T+1}/${t.length}: "${d.label}"`)}),a.style.display="flex";const x=++this.zIndex;a.style.zIndex=String(x),requestAnimationFrame(()=>{window.centerWindow&&window.centerWindow(a)}),o.log(`[CDEModal] Modal displayed with z-index: ${x}`)})}close(){o.log("[CDEModal] Closing modal"),this.modalElement?(this.modalElement.style.display="none",this.currentResolver=null,o.log("[CDEModal] Modal closed and hidden")):console.warn("[CDEModal] Attempted to close modal but no modal element exists")}async alert(e){o.log("[CDEModal] Displaying alert:",e),await this.open("CDE Alert",`<p style="margin:0;">${e}</p>`),o.log("[CDEModal] Alert acknowledged")}async confirm(e){o.log("[CDEModal] Displaying confirm dialog:",e);const s=await this.open("CDE Confirm",`<p style="margin:0;">${e}</p>`,[{label:"Accept",value:!0,isDefault:!0},{label:"Cancel",value:!1}]);return o.log(`[CDEModal] Confirm result: ${s}`),s}async prompt(e,s=""){o.log(`[CDEModal] Displaying prompt dialog: "${e}" (default: "${s}")`);const t=`
      <p style="margin:0 0 10px 0;">${e}</p>
      <input type="text" id="cde-prompt-input" value="${s}">
    `;if(await this.open("CDE Prompt",t,[{label:"Accept",value:"ACCEPT",isDefault:!0},{label:"Cancel",value:"CANCEL"}])==="ACCEPT"){const r=document.getElementById("cde-prompt-input"),i=r?r.value:null;return o.log(`[CDEModal] Prompt accepted with value: "${i}"`),i}return o.log("[CDEModal] Prompt cancelled"),null}}const y=new dn;typeof window<"u"&&(window.CDEModal=y,o.log("[CDEModal] Global instance attached to window"));const un={"/home/victxrlarixs/":{type:"folder",children:{Desktop:{type:"folder",children:{"readme.md":{type:"file",content:"[Dinamic content: README.md]"}}},"man-pages":{type:"folder",children:{"pure-sh-bible.md":{type:"file",content:"[Dinamic content: pure-sh-bible.md]"},"pure-bash-bible.md":{type:"file",content:"[Dinamic content: pure-bash-bible.md]"}}},settings:{type:"folder",children:{"themes.json":{type:"file",content:"[Dinamic content: themes.json]"},"fonts.json":{type:"file",content:"[Dinamic content: fonts.json]"}}}}}},mn=`# 📟 The Nostalgic Portal: CDE Time Capsule

![CDE Banner](https://img.shields.io/badge/Experience-Retro_Power-2a4a6a?style=for-the-badge)
[![Launch Desktop](https://img.shields.io/badge/🖱️_Enter-Simulation-ff5a03?style=for-the-badge)](https://debian.com.mx)
![User Rating](https://img.shields.io/badge/Vibe-1996_Nostalgia-blue?style=for-the-badge)

> Ever wonder what it felt like to sit in front of a $20,000 Unix workstation in 1996? Welcome to a pixel-perfect recreation of the **Common Desktop Environment (CDE)**—living right inside your modern browser.

---

## ✨ A Journey Through Time

This isn't just a website; it's a living desktop. From the moment the terminal scrolls past your eyes, you're not just a "visitor"—you're a "user" of a classic Unix system.

### 🎨 Your Desktop, Your Rules

Open the **Style Manager** to instantly repaint your environment. Whether it's the professional _Platinum_, the high-contrast _Midnight_, or the vibrant _Sunset_, the entire OS follows your lead without a single reload.

### 📁 A Responsive World

Everything reacts to you. Drag windows by their title bars, hover over icons to see them glow, and explore a **Virtual Filesystem** where you can create your own digital corner. It's the tactile feel of the 90s with the speed of today.

---

## 🎯 Iconic Experiences

| 🖥️ The Component      | 🌟 The Feeling                                                           |
| :-------------------- | :----------------------------------------------------------------------- |
| **Terminal Emulator** | Watch commands type themselves out in a mesmerizing tutorial loop.       |
| **Process Monitor**   | Manage the "soul" of the machine. Move between tasks with your keyboard. |
| **File Manager**      | Real context menus, renaming, and folder navigation that feels "real".   |
| **Screenshot Tool**   | Capture your personalized setup with a single click in the system tray.  |

---

## 📱 Mobile-First Nostalgia

We've spent months ensuring that the retro experience doesn't break on modern hardware. Our **Responsive Engine** ensures that whether you're on a 4K monitor or a smartphone, the CDE layout remains proportional and usable. No horizontal scroll, no broken icons—just clean, retro computing.

---

## 🚀 Step Inside

You don't need to install anything. No clones, no builds, just a window to the past.

1.  **Visit [debian.com.mx](https://debian.com.mx)**
2.  **Double-click \`readme.md\`** on the desktop.
3.  **Lose yourself** in the scanlines and dithered gradients.

---

<p align="center">
  Experience the legend. Built with passion for the pixel.<br />
  <a href="https://debian.com.mx">debian.com.mx</a>
</p>
`,M=JSON.parse(`[[{"user":"victxrlarixs","command":"whoami","output":"victxrlarixs\\nShows current user"},{"user":"victxrlarixs","command":"pwd","output":"/home/victxrlarixs\\nShows current directory"},{"user":"victxrlarixs","command":"ls","output":"Desktop  Documents  Downloads  Music  Pictures  Videos\\nLists files and directories"},{"user":"victxrlarixs","command":"ls -la","output":"total 48\\ndrwxr-xr-x 18 victxrlarixs victxrlarixs 4096 Feb 11 10:00 .\\ndrwxr-xr-x  3 root        root        4096 Feb 10 08:00 ..\\n-rw-------  1 victxrlarixs victxrlarixs  567 Feb 11 09:30 .bash_history\\n-rw-r--r--  1 victxrlarixs victxrlarixs  220 Feb 11 08:00 .bash_logout\\n-rw-r--r--  1 victxrlarixs victxrlarixs 3526 Feb 11 08:00 .bashrc\\n-rw-r--r--  1 victxrlarixs victxrlarixs  807 Feb 11 08:00 .profile\\ndrwxr-xr-x  2 victxrlarixs victxrlarixs 4096 Feb 11 09:00 Desktop\\ndrwxr-xr-x  2 victxrlarixs victxrlarixs 4096 Feb 11 09:00 Documents\\n...\\nLists all files with details, including hidden ones"},{"user":"victxrlarixs","command":"date","output":"Sat Feb 11 14:30:00 CST 2023\\nShows system date and time"}],[{"user":"victxrlarixs","command":"cd Documents","output":"Changes to Documents directory"},{"user":"victxrlarixs","command":"pwd","output":"/home/victxrlarixs/Documents\\nConfirms location"},{"user":"victxrlarixs","command":"mkdir project_web","output":"Creates new directory"},{"user":"victxrlarixs","command":"cd project_web","output":"Enters the new project folder"},{"user":"victxrlarixs","command":"touch index.html style.css script.js","output":"Creates empty files"},{"user":"victxrlarixs","command":"ls","output":"index.html  script.js  style.css\\nVerifies creation"}],[{"user":"victxrlarixs","command":"echo '<h1>Hello World</h1>' > index.html","output":"Writes content to file"},{"user":"victxrlarixs","command":"cat index.html","output":"<h1>Hello World</h1>\\nDisplays file content"},{"user":"victxrlarixs","command":"cp index.html index_backup.html","output":"Copies file"},{"user":"victxrlarixs","command":"mv style.css styles.css","output":"Renames file"},{"user":"victxrlarixs","command":"rm index_backup.html","output":"Deletes file"}],[{"user":"victxrlarixs","command":"chmod 755 index.html","output":"Changes file permissions"},{"user":"victxrlarixs","command":"ls -l index.html","output":"-rwxr-xr-x 1 victxrlarixs victxrlarixs 20 Feb 11 14:35 index.html\\nVerifies permissions"},{"user":"victxrlarixs","command":"find . -name '*.html'","output":"./index.html\\nFinds files by extension"},{"user":"victxrlarixs","command":"grep 'Hello' index.html","output":"<h1>Hello World</h1>\\nSearches text inside files"}],[{"user":"victxrlarixs","command":"ps aux | head -5","output":"USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\\nroot         1  0.0  0.1 169668 13028 ?        Ss   Feb10   0:03 /sbin/init\\nroot         2  0.0  0.0      0     0 ?        S    Feb10   0:00 [kthreadd]\\nroot         3  0.0  0.0      0     0 ?        I<   Feb10   0:00 [rcu_gp]\\nroot         4  0.0  0.0      0     0 ?        I<   Feb10   0:00 [rcu_par_gp]\\nShows active processes (first 5)"},{"user":"victxrlarixs","command":"top -b -n 1 | head -5","output":"top - 14:40:00 up 1 day,  5:48,  1 user,  load average: 0.05, 0.10, 0.15\\nTasks: 120 total,   1 running, 119 sleeping,   0 stopped,   0 zombie\\n%Cpu(s):  2.5 us,  1.2 sy,  0.0 ni, 96.0 id,  0.2 wa,  0.0 hi,  0.1 si,  0.0 st\\nMiB Mem :   7980.3 total,   4500.2 free,   1800.1 used,   1680.0 buff/cache\\nMiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   5780.2 avail Mem\\nSystem monitor snapshot"},{"user":"victxrlarixs","command":"free -h","output":"              total        used        free      shared  buff/cache   available\\nMem:           7.8G        2.0G        4.8G        0.2G        1.0G        5.2G\\nSwap:          2.0G        0.0G        2.0G\\nMemory usage"},{"user":"victxrlarixs","command":"df -h","output":"Filesystem      Size  Used Avail Use% Mounted on\\nudev            3.9G     0  3.9G   0% /dev\\ntmpfs           798M  1.3M  797M   1% /run\\n/dev/sda1        50G   10G   37G  22% /\\nDisk space usage"}],[{"user":"root","command":"apt update","output":"Hit:1 http://deb.debian.org/debian bullseye InRelease\\nGet:2 http://security.debian.org/debian-security bullseye-security InRelease [48.4 kB]\\nGet:3 http://deb.debian.org/debian bullseye-updates InRelease [44.1 kB]\\nFetched 92.5 kB in 1s (92.5 kB/s)\\nReading package lists... Done\\nUpdates package list from repositories"},{"user":"root","command":"apt upgrade -y","output":"Reading package lists... Done\\nBuilding dependency tree... Done\\nReading state information... Done\\nCalculating upgrade... Done\\nThe following packages will be upgraded:\\n  linux-image-amd64 openssh-server ...\\n15 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.\\nNeed to get 25.3 MB of archives.\\nAfter this operation, 12.5 MB of additional disk space will be used.\\nGet:1 http://deb.debian.org/debian bullseye/main amd64 linux-image-amd64 amd64 5.10.0-20-amd64 [1,600 B]\\n...\\nUpgrades installed packages"},{"user":"victxrlarixs","command":"ping -c 3 google.com","output":"PING google.com (142.250.190.14): 56 data bytes\\n64 bytes from 142.250.190.14: icmp_seq=0 ttl=117 time=15.3 ms\\n64 bytes from 142.250.190.14: icmp_seq=1 ttl=117 time=14.8 ms\\n64 bytes from 142.250.190.14: icmp_seq=2 ttl=117 time=15.1 ms\\n\\n--- google.com ping statistics ---\\n3 packets transmitted, 3 packets received, 0% packet loss\\nround-trip min/avg/max/stddev = 14.8/15.1/15.3/0.2 ms\\nTests network connectivity"},{"user":"victxrlarixs","command":"curl -I https://debian.org","output":"HTTP/1.1 200 OK\\nConnection: keep-alive\\nContent-Length: 38681\\nServer: nginx\\nContent-Type: text/html\\nDate: Sat, 11 Feb 2023 20:45:12 GMT\\nFetches HTTP headers"}],[{"user":"victxrlarixs","command":"git init","output":"Initialized empty Git repository in /home/victxrlarixs/Documents/project_web/.git/\\nInitializes Git repository"},{"user":"victxrlarixs","command":"git add .","output":"Adds files to staging area"},{"user":"victxrlarixs","command":"git commit -m 'Initial commit'","output":"[main (root-commit) abc1234] Initial commit\\n 3 files changed, 1 insertion(+)\\n create mode 100644 index.html\\n create mode 100644 script.js\\n create mode 100644 styles.css\\nCreates initial commit"},{"user":"victxrlarixs","command":"git status","output":"On branch main\\nnothing to commit, working tree clean\\nShows repository status"},{"user":"victxrlarixs","command":"git log --oneline","output":"abc1234 (HEAD -> main) Initial commit\\nCommit history"}],[{"user":"victxrlarixs","command":"docker ps","output":"CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES\\nLists running containers"},{"user":"victxrlarixs","command":"docker images","output":"REPOSITORY    TAG       IMAGE ID       CREATED        SIZE\\nhello-world   latest    feb5d9fea6a5   3 months ago   13.3kB\\nLists Docker images"},{"user":"victxrlarixs","command":"docker run hello-world","output":"Hello from Docker!\\nThis message shows that your installation appears to be working correctly.\\n\\nTo generate this message, Docker took the following steps:\\n 1. The Docker client contacted the Docker daemon.\\n 2. The Docker daemon pulled the \\"hello-world\\" image from the Docker Hub.\\n    (amd64)\\n 3. The Docker daemon created a new container from that image which runs the\\n    executable that produces the output you are currently reading.\\n 4. The Docker daemon streamed that output to the Docker client, which sent it\\n    to your terminal.\\n\\nTo try something more ambitious, you can run an Ubuntu container with:\\n $ docker run -it ubuntu bash\\n\\nShare images, automate workflows, and more with a free Docker ID:\\n https://hub.docker.com/\\n\\nFor more examples and ideas, visit:\\n https://docs.docker.com/get-started/\\nRuns a test container"},{"user":"victxrlarixs","command":"docker-compose up -d","output":"Creating network \\"project_web_default\\" with the default driver\\nCreating project_web_web_1 ... done\\nCreating project_web_db_1  ... done\\nStarts services with docker-compose in detached mode"}],[{"user":"victxrlarixs","command":"history | tail -5","output":" 1010  ls -la\\n 1011  cd Documents/project_web/\\n 1012  git status\\n 1013  docker ps\\n 1014  history | tail -5\\nShows last 5 commands"},{"user":"victxrlarixs","command":"alias ll='ls -la'","output":"Creates alias for long listing"},{"user":"victxrlarixs","command":"cd ~","output":"Returns to home directory"},{"user":"victxrlarixs","command":"clear","output":"Clears the terminal screen"}],[{"user":"victxrlarixs","command":"uname -a","output":"Linux debian 5.10.0-20-amd64 #1 SMP Debian 5.10.158-2 (2023-01-21) x86_64 GNU/Linux\\nShows system kernel and architecture"},{"user":"victxrlarixs","command":"hostname","output":"debian\\nShows system hostname"},{"user":"victxrlarixs","command":"uptime","output":" 14:55:00 up 1 day,  6:03,  1 user,  load average: 0.08, 0.12, 0.15\\nShows system uptime and load"},{"user":"victxrlarixs","command":"who","output":"victxrlarixs tty7         2023-02-11 08:00 (:0)\\nShows logged-in users"},{"user":"victxrlarixs","command":"last -5","output":"victxrlarixs tty7         :0               Sat Feb 11 08:00   still logged in\\nreboot   system boot  5.10.0-20-amd64  Sat Feb 11 08:00   still running\\nvictxrlarixs tty7         :0               Fri Feb 10 18:00 - crash (14:00)\\nreboot   system boot  5.10.0-20-amd64  Fri Feb 10 08:00 - 08:00 (1+00:00)\\nwtmp begins Fri Feb 10 08:00:00 2023\\nShows last user logins"}],[{"user":"root","command":"useradd -m -s /bin/bash alice","output":"Creates new user alice with home directory and bash shell"},{"user":"root","command":"passwd alice","output":"New password: \\nRetype new password: \\npasswd: password updated successfully\\nSets password for alice"},{"user":"root","command":"groupadd developers","output":"Creates new group developers"},{"user":"root","command":"usermod -aG developers alice","output":"Adds alice to developers group"},{"user":"victxrlarixs","command":"id alice","output":"uid=1001(alice) gid=1001(alice) groups=1001(alice),1002(developers)\\nShows user and group IDs"}],[{"user":"victxrlarixs","command":"cat /etc/passwd | grep alice","output":"alice:x:1001:1001:,,,:/home/alice:/bin/bash\\nShows user entry in passwd"},{"user":"victxrlarixs","command":"grep '^developers' /etc/group","output":"developers:x:1002:alice\\nShows group entry"},{"user":"victxrlarixs","command":"sudo -l","output":"Matching Defaults entries for victxrlarixs on debian:\\n    env_reset, mail_badpass, secure_path=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\\n\\nUser victxrlarixs may run the following commands on debian:\\n    (ALL : ALL) ALL\\nLists sudo privileges"},{"user":"victxrlarixs","command":"su - alice","output":"Switches to user alice (prompts for password)"}],[{"user":"alice","command":"whoami","output":"alice\\nConfirms user switch"},{"user":"alice","command":"pwd","output":"/home/alice\\nHome directory"},{"user":"alice","command":"touch test.txt","output":"Creates empty file"},{"user":"alice","command":"ls -l test.txt","output":"-rw-r--r-- 1 alice alice 0 Feb 11 15:10 test.txt\\nFile ownership"},{"user":"alice","command":"exit","output":"Returns to previous user"}],[{"user":"victxrlarixs","command":"man ls","output":"LS(1)                            User Commands                           LS(1)\\n\\nNAME\\n       ls - list directory contents\\n\\nSYNOPSIS\\n       ls [OPTION]... [FILE]...\\n\\nDESCRIPTION\\n       List  information  about  the FILEs (the current directory by default).\\n       Sort entries alphabetically if none of -cftuvSUX nor --sort  is  speci‐\\n       fied.\\n\\n       Mandatory  arguments  to  long  options are mandatory for short options\\n       too.\\n\\n       -a, --all\\n              do not ignore entries starting with .\\n\\n... (press q to quit)\\nDisplays manual page for ls (truncated)"},{"user":"victxrlarixs","command":"which git","output":"/usr/bin/git\\nShows path to git executable"},{"user":"victxrlarixs","command":"whereis bash","output":"bash: /bin/bash /etc/bash.bashrc /usr/share/man/man1/bash.1.gz\\nLocates binary, source, and manual for bash"},{"user":"victxrlarixs","command":"locate crontab","output":"/etc/crontab\\n/usr/bin/crontab\\n/usr/share/man/man1/crontab.1.gz\\n/usr/share/man/man5/crontab.5.gz\\nFinds files named crontab"}],[{"user":"victxrlarixs","command":"tar -czf archive.tar.gz Documents/","output":"Creates compressed tarball of Documents folder"},{"user":"victxrlarixs","command":"tar -tzf archive.tar.gz | head -3","output":"Documents/\\nDocuments/project_web/\\nDocuments/project_web/index.html\\nLists contents of tarball (first 3)"},{"user":"victxrlarixs","command":"gzip -l archive.tar.gz","output":"         compressed        uncompressed  ratio uncompressed_name\\n              10240               20480  50.0% archive.tar\\nShows compression info"},{"user":"victxrlarixs","command":"zip -r project.zip Documents/","output":"  adding: Documents/ (stored 0%)\\n  adding: Documents/project_web/ (stored 0%)\\n  adding: Documents/project_web/index.html (deflated 45%)\\n  ...\\nCreates zip archive"},{"user":"victxrlarixs","command":"unzip -l project.zip | head -5","output":"Archive:  project.zip\\n  Length      Date    Time    Name\\n---------  ---------- -----   ----\\n        0  2023-02-11 14:30   Documents/\\n        0  2023-02-11 14:35   Documents/project_web/\\n       20  2023-02-11 14:35   Documents/project_web/index.html\\nLists zip contents (first 5)"}],[{"user":"root","command":"systemctl status ssh","output":"● ssh.service - OpenBSD Secure Shell server\\n     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; vendor preset: enabled)\\n     Active: active (running) since Sat 2023-02-11 08:01:23 CST; 7h ago\\n       Docs: man:sshd(8)\\n             man:sshd_config(5)\\n   Main PID: 1234 (sshd)\\n      Tasks: 1 (limit: 2281)\\n     Memory: 5.2M\\n        CPU: 123ms\\n     CGroup: /system.slice/ssh.service\\n             └─1234 sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups\\n\\nFeb 11 08:01:22 debian systemd[1]: Starting OpenBSD Secure Shell server...\\nFeb 11 08:01:23 debian sshd[1234]: Server listening on 0.0.0.0 port 22.\\nFeb 11 08:01:23 debian sshd[1234]: Server listening on :: port 22.\\nFeb 11 08:01:23 debian systemd[1]: Started OpenBSD Secure Shell server.\\nShows SSH service status"},{"user":"root","command":"journalctl -n 5","output":"-- Logs begin at Fri 2023-02-10 08:00:00 CST, end at Sat 2023-02-11 15:20:00 CST. --\\nFeb 11 15:18:22 debian kernel: [UFW BLOCK] IN=eth0 OUT=...\\nFeb 11 15:19:01 debian CRON[5678]: (root) CMD (   cd / && run-parts --report /etc/cron.hourly)\\nFeb 11 15:19:22 debian sshd[1234]: Accepted password for alice from 192.168.1.10 port 54321 ssh2\\nFeb 11 15:20:00 debian systemd[1]: Starting system activity accounting tool...\\nFeb 11 15:20:01 debian systemd[1]: Started system activity accounting tool.\\nShows last 5 journal entries"},{"user":"victxrlarixs","command":"crontab -l","output":"no crontab for victxrlarixs\\nLists cron jobs for user (none)"},{"user":"victxrlarixs","command":"echo '* * * * * echo hello' | crontab -","output":"Installs a cron job that runs every minute"},{"user":"victxrlarixs","command":"crontab -l","output":"* * * * * echo hello\\nVerifies cron job"}],[{"user":"victxrlarixs","command":"ps aux | grep ssh","output":"root      1234  0.0  0.1  16432  7892 ?        Ss   08:01   0:00 sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups\\nvictx+    7890  0.0  0.0   6432   720 pts/0    S+   15:25   0:00 grep ssh\\nFinds SSH-related processes"},{"user":"victxrlarixs","command":"kill -9 1234","output":"Kills process with SIGKILL (requires appropriate permissions)"},{"user":"root","command":"pkill -f sshd","output":"Kills all processes matching name sshd"},{"user":"victxrlarixs","command":"top -b -n 1 | grep 'Cpu(s)'","output":"%Cpu(s):  3.2 us,  1.5 sy,  0.0 ni, 94.8 id,  0.5 wa,  0.0 hi,  0.0 si,  0.0 st\\nCPU usage line from top"}],[{"user":"victxrlarixs","command":"ifconfig","output":"eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\\n        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255\\n        inet6 fe80::cafe:1234:5678:9abc  prefixlen 64  scopeid 0x20<link>\\n        ether 08:00:27:ab:cd:ef  txqueuelen 1000  (Ethernet)\\n        RX packets 12345  bytes 15000000 (14.3 MiB)\\n        RX errors 0  dropped 0  overruns 0  frame 0\\n        TX packets 6789  bytes 800000 (781.2 KiB)\\n        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0\\n\\nlo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536\\n        inet 127.0.0.1  netmask 255.0.0.0\\n        inet6 ::1  prefixlen 128  scopeid 0x10<host>\\n        loop  txqueuelen 1000  (Local Loopback)\\n        RX packets 100  bytes 5000 (4.8 KiB)\\n        RX errors 0  dropped 0  overruns 0  frame 0\\n        TX packets 100  bytes 5000 (4.8 KiB)\\n        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0\\nShows network interfaces"},{"user":"victxrlarixs","command":"ip addr show","output":"1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000\\n    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00\\n    inet 127.0.0.1/8 scope host lo\\n       valid_lft forever preferred_lft forever\\n    inet6 ::1/128 scope host \\n       valid_lft forever preferred_lft forever\\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000\\n    link/ether 08:00:27:ab:cd:ef brd ff:ff:ff:ff:ff:ff\\n    inet 192.168.1.100/24 brd 192.168.1.255 scope global dynamic eth0\\n       valid_lft 86399sec preferred_lft 86399sec\\n    inet6 fe80::cafe:1234:5678:9abc/64 scope link \\n       valid_lft forever preferred_lft forever\\nAlternative network info"},{"user":"victxrlarixs","command":"ss -tuln","output":"Netid  State   Recv-Q  Send-Q  Local Address:Port   Peer Address:Port\\ntcp    LISTEN  0       128         0.0.0.0:22          0.0.0.0:*\\ntcp    LISTEN  0       128            [::]:22             [::]:*\\nudp    UNCONN  0       0           0.0.0.0:68          0.0.0.0:*\\nShows listening ports"},{"user":"victxrlarixs","command":"traceroute -m 3 google.com","output":"traceroute to google.com (142.250.190.14), 3 hops max, 60 byte packets\\n 1  192.168.1.1 (192.168.1.1)  1.234 ms  1.123 ms  1.045 ms\\n 2  10.0.0.1 (10.0.0.1)  10.234 ms  10.123 ms  10.045 ms\\n 3  72.14.215.85 (72.14.215.85)  15.123 ms  15.045 ms  15.067 ms\\nTraces route to host (max 3 hops)"}],[{"user":"victxrlarixs","command":"nslookup debian.org","output":"Server:         8.8.8.8\\nAddress:        8.8.8.8#53\\n\\nNon-authoritative answer:\\nName:   debian.org\\nAddress: 140.211.15.34\\nName:   debian.org\\nAddress: 2001:41c8:10:1e::34\\nDNS lookup for debian.org"},{"user":"victxrlarixs","command":"dig debian.org","output":"; <<>> DiG 9.16.33-Debian <<>> debian.org\\n;; global options: +cmd\\n;; Got answer:\\n;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345\\n;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1\\n\\n;; OPT PSEUDOSECTION:\\n; EDNS: version: 0, flags:; udp: 512\\n;; QUESTION SECTION:\\n;debian.org.                    IN      A\\n\\n;; ANSWER SECTION:\\ndebian.org.             300     IN      A       140.211.15.34\\n\\n;; Query time: 23 msec\\n;; SERVER: 8.8.8.8#53(8.8.8.8)\\n;; WHEN: Sat Feb 11 15:30:00 CST 2023\\n;; MSG SIZE  rcvd: 55\\nDetailed DNS query"},{"user":"victxrlarixs","command":"wget -O- https://httpbin.org/ip | head -3","output":"--2023-02-11 15:31:00--  https://httpbin.org/ip\\nResolving httpbin.org (httpbin.org)... 3.223.115.185\\nConnecting to httpbin.org (httpbin.org)|3.223.115.185|:443... connected.\\nHTTP request sent, awaiting response... 200 OK\\nLength: 34 [application/json]\\nSaving to: ‘STDOUT’\\n\\n-                   100%[===================>]      34  --.-KB/s    in 0s      \\n\\n{\\n  \\"origin\\": \\"192.168.1.100\\"\\n}\\nDownloads and prints first 3 lines of JSON"}],[{"user":"victxrlarixs","command":"df -i","output":"Filesystem      Inodes  IUsed   IFree IUse% Mounted on\\nudev             998352    405  997947    1% /dev\\ntmpfs            1000000    612  999388    1% /run\\n/dev/sda1       3276800 123456 3153344    4% /\\nShows inode usage"},{"user":"root","command":"fdisk -l /dev/sda","output":"Disk /dev/sda: 50 GiB, 53687091200 bytes, 104857600 sectors\\nDisk model: VBOX HARDDISK\\nUnits: sectors of 1 * 512 = 512 bytes\\nSector size (logical/physical): 512 bytes / 512 bytes\\nI/O size (minimum/optimal): 512 bytes / 512 bytes\\nDisklabel type: dos\\nDisk identifier: 0x1234abcd\\n\\nDevice     Boot Start       End   Sectors Size Id Type\\n/dev/sda1  *     2048 104857599 104855552  50G 83 Linux\\nShows disk partition info"},{"user":"root","command":"mount | head -3","output":"sysfs on /sys type sysfs (rw,nosuid,nodev,noexec,relatime)\\nproc on /proc type proc (rw,nosuid,nodev,noexec,relatime)\\nudev on /dev type devtmpfs (rw,nosuid,relatime,size=4078324k,nr_inodes=1019581,mode=755)\\nShows mounted filesystems (first 3)"},{"user":"victxrlarixs","command":"du -sh ~","output":"2.5G    /home/victxrlarixs\\nShows total disk usage of home directory"}],[{"user":"victxrlarixs","command":"head -3 index.html","output":"<h1>Hello World</h1>\\nShows first 3 lines of file"},{"user":"victxrlarixs","command":"tail -2 script.js","output":"// TODO: add functionality\\nconsole.log('Hello');\\nShows last 2 lines of file"},{"user":"victxrlarixs","command":"wc -l index.html","output":"1 index.html\\nCounts lines in file"},{"user":"victxrlarixs","command":"sort names.txt | uniq -c","output":"      3 Alice\\n      2 Bob\\n      1 Charlie\\nCounts unique sorted lines"},{"user":"victxrlarixs","command":"cut -d: -f1 /etc/passwd | head -3","output":"root\\ndaemon\\nbin\\nExtracts first field from passwd (usernames), first 3"}],[{"user":"victxrlarixs","command":"sed 's/Hello/Hi/' index.html","output":"<h1>Hi World</h1>\\nReplaces text using sed"},{"user":"victxrlarixs","command":"awk '{print $1}' /etc/passwd | head -3","output":"root:x:0:0:root:/root:/bin/bash\\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\\nPrints first field (but with awk default field separator is whitespace, so better to use -F:) – we'll adjust to realistic output:"},{"user":"victxrlarixs","command":"awk -F: '{print $1}' /etc/passwd | head -3","output":"root\\ndaemon\\nbin\\nPrints usernames using awk"},{"user":"victxrlarixs","command":"tr '[:lower:]' '[:upper:]' < index.html","output":"<H1>HELLO WORLD</H1>\\nConverts text to uppercase"}],[{"user":"victxrlarixs","command":"env | head -3","output":"SHELL=/bin/bash\\nUSER=victxrlarixs\\nPATH=/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games\\nShows environment variables (first 3)"},{"user":"victxrlarixs","command":"export MY_VAR='Hello'","output":"Sets an environment variable"},{"user":"victxrlarixs","command":"echo $MY_VAR","output":"Hello\\nPrints variable"},{"user":"victxrlarixs","command":"set | head -3","output":"BASH=/bin/bash\\nBASHOPTS=cmdhist:complete_fullquote:extquote:force_fignore:hostcomplete:interactive_comments:progcomp:promptvars:sourcepath\\nBASH_ALIASES=()\\nShows all shell variables (first 3)"}],[{"user":"victxrlarixs","command":"ln -s /home/victxrlarixs/Documents/project_web/index.html link_to_index","output":"Creates a symbolic link"},{"user":"victxrlarixs","command":"ls -l link_to_index","output":"lrwxrwxrwx 1 victxrlarixs victxrlarixs 49 Feb 11 15:45 link_to_index -> /home/victxrlarixs/Documents/project_web/index.html\\nShows symlink details"},{"user":"victxrlarixs","command":"readlink link_to_index","output":"/home/victxrlarixs/Documents/project_web/index.html\\nPrints target of symlink"},{"user":"victxrlarixs","command":"file index.html","output":"index.html: HTML document, ASCII text\\nDetermines file type"}],[{"user":"root","command":"chown alice:developers /home/victxrlarixs/Documents/project_web/index.html","output":"Changes file owner and group"},{"user":"victxrlarixs","command":"ls -l /home/victxrlarixs/Documents/project_web/index.html","output":"-rwxr-xr-x 1 alice developers 20 Feb 11 14:35 /home/victxrlarixs/Documents/project_web/index.html\\nVerifies ownership change"},{"user":"root","command":"setfacl -m u:victxrlarixs:rw /home/victxrlarixs/Documents/project_web/index.html","output":"Sets ACL to give victxrlarixs read/write access"},{"user":"victxrlarixs","command":"getfacl index.html","output":"# file: index.html\\n# owner: alice\\n# group: developers\\nuser::rwx\\nuser:victxrlarixs:rw-\\ngroup::r-x\\nmask::rwx\\nother::r-x\\nShows ACL entries"}],[{"user":"victxrlarixs","command":"cal 2023","output":"                            2023\\n      January               February               March\\nSu Mo Tu We Th Fr Sa  Su Mo Tu We Th Fr Sa  Su Mo Tu We Th Fr Sa\\n 1  2  3  4  5  6  7            1  2  3  4            1  2  3  4\\n 8  9 10 11 12 13 14   5  6  7  8  9 10 11   5  6  7  8  9 10 11\\n15 16 17 18 19 20 21  12 13 14 15 16 17 18  12 13 14 15 16 17 18\\n22 23 24 25 26 27 28  19 20 21 22 23 24 25  19 20 21 22 23 24 25\\n29 30 31              26 27 28              26 27 28 29 30 31\\n...\\nDisplays calendar for 2023"},{"user":"victxrlarixs","command":"bc <<< 'scale=2; 10/3'","output":"3.33\\nCalculator"},{"user":"victxrlarixs","command":"expr 5 + 3","output":"8\\nEvaluates expression"}],[{"user":"victxrlarixs","command":"jobs","output":"[1]+  Running                 sleep 100 &\\nLists background jobs"},{"user":"victxrlarixs","command":"bg %1","output":"Resumes job 1 in background"},{"user":"victxrlarixs","command":"fg %1","output":"Brings job 1 to foreground"},{"user":"victxrlarixs","command":"nohup sleep 1000 &","output":"nohup: ignoring input and appending output to 'nohup.out'\\nRuns command immune to hangups"}],[{"user":"victxrlarixs","command":"ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ''","output":"Generating public/private rsa key pair.\\nYour identification has been saved in /home/victxrlarixs/.ssh/id_rsa\\nYour public key has been saved in /home/victxrlarixs/.ssh/id_rsa.pub\\nThe key fingerprint is:\\nSHA256:abc123def456... victxrlarixs@debian\\nThe key's randomart image is:\\n+---[RSA 4096]----+\\n| .o+..           |\\n|  o. .           |\\n|   . . .         |\\n|    . o .        |\\n|   . . .S        |\\n|    . .  .       |\\n|     o  .+ .     |\\n|    . .+.=o      |\\n|     o+==+E.     |\\n+----[SHA256]-----+\\nGenerates SSH key pair"},{"user":"victxrlarixs","command":"ssh-copy-id user@remote","output":"/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: \\"/home/victxrlarixs/.ssh/id_rsa.pub\\"\\n/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed\\n/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys\\nuser@remote's password: \\n\\nNumber of key(s) added: 1\\n\\nNow try logging into the machine, with:   \\"ssh 'user@remote'\\"\\nand check to make sure that only the key(s) you wanted were added.\\nCopies public key to remote host"},{"user":"victxrlarixs","command":"ssh user@remote 'ls -la'","output":"total 32\\ndrwxr-xr-x 5 user user 4096 Feb 11 10:00 .\\n...\\nExecutes command on remote host via SSH"},{"user":"victxrlarixs","command":"scp index.html user@remote:~/","output":"index.html                                    100%   20     0.1KB/s   00:00    \\nCopies file to remote host"}],[{"user":"victxrlarixs","command":"rsync -av Documents/ user@remote:/backup/","output":"sending incremental file list\\n./\\nproject_web/\\nproject_web/index.html\\nproject_web/styles.css\\nproject_web/script.js\\n\\nsent 1,234 bytes  received 45 bytes  2,558.00 bytes/sec\\ntotal size is 20  speedup is 0.02\\nSyncs directory to remote"},{"user":"victxrlarixs","command":"wget -O debian.iso https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-11.6.0-amd64-netinst.iso","output":"--2023-02-11 15:50:00--  https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-11.6.0-amd64-netinst.iso\\nResolving cdimage.debian.org... 5.153.231.4, 2001:41c8:10:1e::4\\nConnecting to cdimage.debian.org|5.153.231.4|:443... connected.\\nHTTP request sent, awaiting response... 200 OK\\nLength: 385875968 (368M) [application/octet-stream]\\nSaving to: ‘debian.iso’\\n\\ndebian.iso          1%[                    ]   4.5M  1.5MB/s    eta 4m\\nDownloads file (truncated)"}],[{"user":"victxrlarixs","command":"git branch feature","output":"Creates a new branch"},{"user":"victxrlarixs","command":"git checkout feature","output":"Switched to branch 'feature'\\nSwitches to feature branch"},{"user":"victxrlarixs","command":"git branch","output":"  feature\\n* main\\nLists branches with current marked"},{"user":"victxrlarixs","command":"git merge feature","output":"Updating abc1234..def5678\\nFast-forward\\n index.html | 2 +-\\n 1 file changed, 1 insertion(+), 1 deletion(-)\\nMerges feature branch into current"},{"user":"victxrlarixs","command":"git remote add origin https://github.com/user/repo.git","output":"Adds remote repository"},{"user":"victxrlarixs","command":"git push -u origin main","output":"Enumerating objects: 3, done.\\nCounting objects: 100% (3/3), done.\\nWriting objects: 100% (3/3), 232 bytes | 232.00 KiB/s, done.\\nTotal 3 (delta 0), reused 0 (delta 0)\\nTo https://github.com/user/repo.git\\n * [new branch]      main -> main\\nBranch 'main' set up to track remote branch 'main' from 'origin'.\\nPushes to remote"}],[{"user":"victxrlarixs","command":"docker build -t myapp .","output":"Sending build context to Docker daemon  2.048kB\\nStep 1/2 : FROM nginx:alpine\\n ---> 123abc456def\\nStep 2/2 : COPY index.html /usr/share/nginx/html/\\n ---> 789ghi012jkl\\nSuccessfully built 789ghi012jkl\\nSuccessfully tagged myapp:latest\\nBuilds Docker image"},{"user":"victxrlarixs","command":"docker run -d -p 8080:80 --name myapp_container myapp","output":"abc123def4567890abcdef1234567890abcdef1234567890abcdef1234\\nRuns container"},{"user":"victxrlarixs","command":"docker ps","output":"CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                  NAMES\\nabc123def456   myapp     \\"/docker-entrypoint.…\\"   2 seconds ago   Up 1 second    0.0.0.0:8080->80/tcp   myapp_container\\nLists running containers"},{"user":"victxrlarixs","command":"docker exec -it myapp_container /bin/sh","output":"# ls\\nbin   dev  etc   home  lib   media  mnt   proc  root  run   srv   sys   tmp   usr   var\\n# exit\\nExecutes interactive shell in container"},{"user":"victxrlarixs","command":"docker stop myapp_container","output":"myapp_container\\nStops container"},{"user":"victxrlarixs","command":"docker rm myapp_container","output":"myapp_container\\nRemoves container"}],[{"user":"root","command":"apt install -y nginx","output":"Reading package lists... Done\\nBuilding dependency tree... Done\\nReading state information... Done\\nThe following additional packages will be installed:\\n  ...\\nSuggested packages:\\n  ...\\nThe following NEW packages will be installed:\\n  nginx nginx-common nginx-core\\n0 upgraded, 3 newly installed, 0 to remove and 0 not upgraded.\\nNeed to get 1,234 kB of archives.\\nAfter this operation, 5,678 kB of additional disk space will be used.\\nGet:1 http://deb.debian.org/debian bullseye/main amd64 nginx-common all 1.18.0-6.1 [108 kB]\\n...\\nUnpacking nginx (1.18.0-6.1) ...\\nSetting up nginx (1.18.0-6.1) ...\\nInstalls nginx package"},{"user":"root","command":"systemctl start nginx","output":"Starts nginx service"},{"user":"root","command":"systemctl enable nginx","output":"Synchronizing state of nginx.service with SysV service script with /lib/systemd/systemd-sysv-install.\\nExecuting: /lib/systemd/systemd-sysv-install enable nginx\\nEnables nginx to start at boot"},{"user":"victxrlarixs","command":"curl -I http://localhost","output":"HTTP/1.1 200 OK\\nServer: nginx/1.18.0\\nDate: Sat, 11 Feb 2023 16:00:00 GMT\\nContent-Type: text/html\\nContent-Length: 612\\nLast-Modified: Sat, 11 Feb 2023 15:55:00 GMT\\nConnection: keep-alive\\nETag: \\"63e7f9c4-264\\"\\nAccept-Ranges: bytes\\nChecks local web server"}],[{"user":"victxrlarixs","command":"sudo tail -f /var/log/nginx/access.log","output":"192.168.1.100 - - [11/Feb/2023:16:01:00 +0000] \\"GET / HTTP/1.1\\" 200 612 \\"-\\" \\"curl/7.74.0\\"\\n192.168.1.101 - - [11/Feb/2023:16:02:00 +0000] \\"GET /index.html HTTP/1.1\\" 200 612 \\"-\\" \\"Mozilla/5.0\\"\\n... (press Ctrl+C to stop)\\nTails nginx access log"},{"user":"root","command":"ufw status verbose","output":"Status: active\\nLogging: on (low)\\nDefault: deny (incoming), allow (outgoing), disabled (routed)\\nNew profiles: skip\\n\\nTo                         Action      From\\n--                         ------      ----\\n22/tcp                     ALLOW IN    Anywhere\\n80/tcp                     ALLOW IN    Anywhere\\n443/tcp                    ALLOW IN    Anywhere\\nShows firewall status"},{"user":"root","command":"ufw allow 8080/tcp","output":"Rule added\\nRule added (v6)\\nAllows port 8080 on firewall"}],[{"user":"victxrlarixs","command":"htop","output":"  1  [|||||||||||||||||||||||||||||||||||||100.0%]   Tasks: 25, 12 thr; 1 running\\n  2  [||||||||||||||||||||||||||||||||||||||| 95.0%]   Load average: 0.52 0.58 0.59 \\n  Mem[||||||||||||||||||||||||||||||||||||||1.23G/7.80G]   Uptime: 1 day, 07:23\\n  Swp[                                        0K/2.00G]\\n\\n  PID USER      PRI  NI  VIRT   RES   SHR S CPU% MEM%   TIME+  Command\\n 1234 root       20   0  169M  130T  123T S  0.0  0.1  0:03.12 /sbin/init\\n 5678 victx+     20   0 1234M 456M 123M R 99.9  5.7  1:23.45 /usr/bin/htop\\n ... (interactive)\\nInteractive process viewer (sample output)"},{"user":"victxrlarixs","command":"killall htop","output":"Kills all htop processes"}],[{"user":"victxrlarixs","command":"nice -n 10 sleep 100 &","output":"[1] 12345\\nRuns sleep with low priority"},{"user":"victxrlarixs","command":"renice 5 12345","output":"12345 (process ID) old priority 10, new priority 5\\nChanges priority of running process"},{"user":"victxrlarixs","command":"ps -l -p 12345","output":"F S   UID   PID  PPID  C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD\\n0 S  1000 12345  2345  0  75   5 -   273 hrtime pts/0    00:00:00 sleep\\nShows process priority"}],[{"user":"victxrlarixs","command":"dmesg | tail -5","output":"[12345.678901] usb 1-1: new high-speed USB device number 2 using ehci-pci\\n[12345.789012] input: Logitech USB Optical Mouse as /devices/pci0000:00/0000:00:0b.0/usb1/1-1/1-1:1.0/0003:046D:C077.0001/input/input2\\n[12345.789123] hid-generic 0003:046D:C077.0001: input,hidraw0: USB HID v1.11 Mouse [Logitech USB Optical Mouse] on usb-0000:00:0b.0-1/input0\\n[12346.123456] IPv6: ADDRCONF(NETDEV_CHANGE): eth0: link becomes ready\\n[12346.234567] random: crng init done\\nShows last 5 kernel messages"},{"user":"victxrlarixs","command":"lscpu","output":"Architecture:                    x86_64\\nCPU op-mode(s):                  32-bit, 64-bit\\nByte Order:                      Little Endian\\nAddress sizes:                   43 bits physical, 48 bits virtual\\nCPU(s):                          2\\nOn-line CPU(s) list:             0,1\\nThread(s) per core:              1\\nCore(s) per socket:              2\\nSocket(s):                       1\\nNUMA node(s):                    1\\nVendor ID:                       GenuineIntel\\nCPU family:                      6\\nModel:                           142\\nModel name:                      Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz\\nStepping:                        10\\nCPU MHz:                         1799.998\\nBogoMIPS:                        3600.00\\nVirtualization:                   VT-x\\nHypervisor vendor:                KVM\\nVirtualization type:              full\\nL1d cache:                       64 KiB\\nL1i cache:                       64 KiB\\nL2 cache:                        512 KiB\\nL3 cache:                        6 MiB\\nNUMA node0 CPU(s):                0,1\\nVulnerability Itlb multihit:      KVM: Mitigation: VMX unsupported\\nVulnerability L1tf:               Mitigation; PTE Inversion\\n...\\nCPU information"},{"user":"victxrlarixs","command":"lsblk","output":"NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT\\nsda      8:0    0    50G  0 disk \\n└─sda1   8:1    0    50G  0 part /\\nsr0     11:0    1  1024M  0 rom  \\nLists block devices"},{"user":"victxrlarixs","command":"lspci | grep -i vga","output":"00:02.0 VGA compatible controller: Intel Corporation UHD Graphics 620 (rev 07)\\nShows graphics card"}],[{"user":"root","command":"crontab -u alice -l","output":"no crontab for alice\\nLists alice's crontab"},{"user":"root","command":"echo '0 2 * * * /usr/bin/backup.sh' | crontab -u alice -","output":"Installs cron job for alice"},{"user":"alice","command":"crontab -l","output":"0 2 * * * /usr/bin/backup.sh\\nVerifies"}],[{"user":"victxrlarixs","command":"find /etc -name '*.conf' -type f -size +10k -exec ls -lh {} \\\\; | head -3","output":"-rw-r--r-- 1 root root  12K Feb 10 08:00 /etc/apt/apt.conf.d/00CDMountPoint\\n-rw-r--r-- 1 root root  15K Jan 15 10:30 /etc/ssh/sshd_config\\n-rw-r--r-- 1 root root  20K Dec 20 2022 /etc/ld.so.conf.d/x86_64-linux-gnu.conf\\nFinds large .conf files"},{"user":"victxrlarixs","command":"grep -r 'Listen' /etc/apache2/ | head -3","output":"/etc/apache2/ports.conf:Listen 80\\n/etc/apache2/sites-available/000-default.conf:        # but it is usually better to use Listen directives\\n/etc/apache2/sites-available/default-ssl.conf:Listen 443\\nSearches recursively for pattern"},{"user":"victxrlarixs","command":"time ls -R /usr/share/doc > /dev/null","output":"real    0m0.123s\\nuser    0m0.045s\\nsys     0m0.078s\\nMeasures command execution time"}],[{"user":"victxrlarixs","command":"xargs -n 3 echo < <(seq 6)","output":"1 2 3\\n4 5 6\\nBuilds and executes command lines from input"},{"user":"victxrlarixs","command":"seq 1 5 | paste -s -d+ | bc","output":"15\\nSums numbers 1 to 5"},{"user":"victxrlarixs","command":"shuf -i 1-10 -n 3","output":"7\\n2\\n9\\nRandomly selects 3 numbers"}],[{"user":"victxrlarixs","command":"tput setaf 2; echo 'Green text'; tput sgr0","output":"Green text\\nPrints colored text (terminal dependent)"},{"user":"victxrlarixs","command":"stty -a | head -3","output":"speed 38400 baud; rows 40; columns 120; line = 0;\\nintr = ^C; quit = ^\\\\; erase = ^?; kill = ^U; eof = ^D; eol = <undef>; eol2 = <undef>;\\nstart = ^Q; stop = ^S; susp = ^Z; rprnt = ^R; werase = ^W; lnext = ^V; flush = ^O;\\nShows terminal settings"},{"user":"victxrlarixs","command":"script session.log","output":"Script started, file is session.log\\nStarts recording terminal session (type 'exit' to stop)"}],[{"user":"root","command":"adduser testuser","output":"Adding user \`testuser' ...\\nAdding new group \`testuser' (1002) ...\\nAdding new user \`testuser' (1002) with group \`testuser' ...\\nCreating home directory \`/home/testuser' ...\\nCopying files from \`/etc/skel' ...\\nNew password: \\nRetype new password: \\npasswd: password updated successfully\\nChanging the user information for testuser\\nEnter the new value, or press ENTER for the default\\n        Full Name []: Test User\\n        Room Number []: \\n        Work Phone []: \\n        Home Phone []: \\n        Other []: \\nIs the information correct? [Y/n] y\\nAdds a new user interactively"},{"user":"root","command":"deluser testuser","output":"Removing user \`testuser' ...\\nWarning: group \`testuser' has no more members.\\nDone.\\nDeletes user"},{"user":"root","command":"groupadd devops","output":"Adds group devops"},{"user":"root","command":"gpasswd -a victxrlarixs devops","output":"Adding user victxrlarixs to group devops\\nAdds user to group"},{"user":"victxrlarixs","command":"groups","output":"victxrlarixs adm cdrom sudo dip plugdev lpadmin lxd sambashare devops\\nShows groups of current user"}],[{"user":"victxrlarixs","command":"sudo fsck /dev/sda1","output":"fsck from util-linux 2.36.1\\ne2fsck 1.46.2 (28-Feb-2021)\\n/dev/sda1: clean, 123456/3276800 files, 1234567/104855552 blocks\\nChecks filesystem (requires unmount or forced check)"},{"user":"root","command":"mkfs.ext4 /dev/sdb1","output":"mke2fs 1.46.2 (28-Feb-2021)\\nCreating filesystem with 2621440 4k blocks and 655360 inodes\\nFilesystem UUID: 12345678-1234-1234-1234-123456789abc\\nSuperblock backups stored on blocks: \\n\\t32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632\\n\\nAllocating group tables: done                            \\nWriting inode tables: done                            \\nCreating journal (16384 blocks): done\\nWriting superblocks and filesystem accounting information: done\\nCreates ext4 filesystem"},{"user":"root","command":"mount /dev/sdb1 /mnt/data","output":"Mounts device to directory"},{"user":"root","command":"umount /mnt/data","output":"Unmounts filesystem"}],[{"user":"victxrlarixs","command":"cat /etc/os-release","output":"PRETTY_NAME=\\"Debian GNU/Linux 11 (bullseye)\\"\\nNAME=\\"Debian GNU/Linux\\"\\nVERSION_ID=\\"11\\"\\nVERSION=\\"11 (bullseye)\\"\\nVERSION_CODENAME=bullseye\\nID=debian\\nHOME_URL=\\"https://www.debian.org/\\"\\nSUPPORT_URL=\\"https://www.debian.org/support\\"\\nBUG_REPORT_URL=\\"https://bugs.debian.org/\\"\\nShows OS release info"},{"user":"victxrlarixs","command":"lsb_release -a","output":"No LSB modules are available.\\nDistributor ID: Debian\\nDescription:    Debian GNU/Linux 11 (bullseye)\\nRelease:        11\\nCodename:       bullseye\\nShows LSB release info"},{"user":"victxrlarixs","command":"hostnamectl","output":"   Static hostname: debian\\n         Icon name: computer-vm\\n           Chassis: vm\\n        Machine ID: abc123def4567890\\n           Boot ID: 123abc456def7890\\n    Virtualization: kvm\\n  Operating System: Debian GNU/Linux 11 (bullseye)\\n            Kernel: Linux 5.10.0-20-amd64\\n      Architecture: x86-64\\nShows system information"}],[{"user":"victxrlarixs","command":"wc /etc/passwd","output":"  45   98 2345 /etc/passwd\\nCounts lines, words, characters"},{"user":"victxrlarixs","command":"sort -k3 -n /etc/passwd | head -3","output":"root:x:0:0:root:/root:/bin/bash\\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\\nSorts by numeric UID (field 3)"},{"user":"victxrlarixs","command":"uniq -d duplicates.txt","output":"apple\\nbanana\\nShows duplicate lines only"},{"user":"victxrlarixs","command":"comm -12 file1 file2","output":"common_line\\nShows lines common to both sorted files"}],[{"user":"victxrlarixs","command":"tee output.txt <<< 'Hello'","output":"Hello\\nWrites to file and stdout"},{"user":"victxrlarixs","command":"cat output.txt","output":"Hello\\nVerifies file content"},{"user":"victxrlarixs","command":"md5sum output.txt","output":"8b1a9953c4611296a827abf8c47804d7  output.txt\\nComputes MD5 checksum"},{"user":"victxrlarixs","command":"sha256sum output.txt","output":"5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03  output.txt\\nSHA256 checksum"}],[{"user":"victxrlarixs","command":"ln -f output.txt hardlink.txt","output":"Creates hard link"},{"user":"victxrlarixs","command":"ls -li output.txt hardlink.txt","output":"12345 -rw-r--r-- 2 victxrlarixs victxrlarixs 6 Feb 11 16:30 hardlink.txt\\n12345 -rw-r--r-- 2 victxrlarixs victxrlarixs 6 Feb 11 16:30 output.txt\\nShows inode numbers (same)"},{"user":"victxrlarixs","command":"stat output.txt","output":"  File: output.txt\\n  Size: 6          \\tBlocks: 8          IO Block: 4096   regular file\\nDevice: 801h/2049d\\tInode: 12345       Links: 2\\nAccess: (0644/-rw-r--r--)  Uid: ( 1000/victxrlarixs)   Gid: ( 1000/victxrlarixs)\\nAccess: 2023-02-11 16:30:00.000000000 -0600\\nModify: 2023-02-11 16:30:00.000000000 -0600\\nChange: 2023-02-11 16:35:00.000000000 -0600\\n Birth: -\\nDetailed file stats"}],[{"user":"root","command":"visudo","output":"Opens /etc/sudoers in editor (sample, not actual output)"},{"user":"root","command":"echo 'victxrlarixs ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers.d/victx","output":"Adds sudo rule without password (requires careful editing)"},{"user":"victxrlarixs","command":"sudo -k","output":"Revokes sudo timestamp"}],[{"user":"victxrlarixs","command":"python3 -c 'print(\\"Hello from Python\\")'","output":"Hello from Python\\nRuns Python one-liner"},{"user":"victxrlarixs","command":"perl -e 'print \\"Hello from Perl\\\\n\\"'","output":"Hello from Perl\\nRuns Perl one-liner"},{"user":"victxrlarixs","command":"ruby -e 'puts \\"Hello from Ruby\\"'","output":"Hello from Ruby\\nRuns Ruby one-liner"}],[{"user":"victxrlarixs","command":"journalctl -u ssh --since '1 hour ago'","output":"-- Logs begin at Fri 2023-02-10 08:00:00 CST, end at Sat 2023-02-11 16:45:00 CST. --\\nFeb 11 15:50:22 debian sshd[1234]: Accepted password for alice from 192.168.1.10 port 54321 ssh2\\nFeb 11 16:00:01 debian sshd[1234]: Received disconnect from 192.168.1.10: 11: disconnected by user\\nShows ssh logs from last hour"},{"user":"root","command":"systemctl reload nginx","output":"Reloads nginx configuration"},{"user":"root","command":"systemctl restart ssh","output":"Restarts SSH service"}],[{"user":"victxrlarixs","command":"rsync --progress --stats archive.tar.gz user@remote:/backup/","output":"sending incremental file list\\narchive.tar.gz\\n        102,400 100%   10.24MB/s    0:00:00 (xfr#1, to-chk=0/1)\\n\\nNumber of files: 1\\nNumber of files transferred: 1\\nTotal file size: 102,400 bytes\\nTotal transferred file size: 102,400 bytes\\nLiteral data: 102,400 bytes\\nMatched data: 0 bytes\\nFile list size: 0\\nFile list generation time: 0.001 seconds\\nFile list transfer time: 0.000 seconds\\nTotal bytes sent: 102,540\\nTotal bytes received: 35\\n\\nsent 102,540 bytes  received 35 bytes  205,150.00 bytes/sec\\ntotal size is 102,400  speedup is 1.00\\nSyncs with progress"},{"user":"victxrlarixs","command":"scp -r Documents/ user@remote:~/backup/","output":"index.html                                    100%   20     0.1KB/s   00:00\\nstyles.css                                     100%   30     0.2KB/s   00:00\\nscript.js                                      100%   50     0.3KB/s   00:00\\nCopies directory recursively"}],[{"user":"victxrlarixs","command":"screen -S mysession","output":"Starts a new screen session (attaches)"},{"user":"victxrlarixs","command":"screen -ls","output":"There is a screen on:\\n\\t12345.mysession\\t(02/11/23 16:50:00)\\t(Attached)\\n1 Socket in /run/screen/S-victxrlarixs.\\nLists screen sessions"},{"user":"victxrlarixs","command":"screen -r mysession","output":"Reattaches to screen session"}],[{"user":"victxrlarixs","command":"tmux new -s mysession","output":"Creates new tmux session"},{"user":"victxrlarixs","command":"tmux ls","output":"mysession: 1 windows (created Sat Feb 11 16:52:00 2023)\\nLists tmux sessions"},{"user":"victxrlarixs","command":"tmux attach -t mysession","output":"Attaches to tmux session"}],[{"user":"victxrlarixs","command":"alias","output":"alias ll='ls -la'\\nalias ls='ls --color=auto'\\nLists current aliases"},{"user":"victxrlarixs","command":"unalias ll","output":"Removes alias"},{"user":"victxrlarixs","command":"type ls","output":"ls is aliased to \`ls --color=auto'\\nShows how command is interpreted"}],[{"user":"victxrlarixs","command":"history -c","output":"Clears command history"},{"user":"victxrlarixs","command":"history -w","output":"Writes history to file"}],[{"user":"victxrlarixs","command":"echo $?","output":"0\\nShows exit status of last command"},{"user":"victxrlarixs","command":"false; echo $?","output":"1\\nExit status of false"}]]`),Tn=Object.freeze(Object.defineProperty({__proto__:null,default:M},Symbol.toStringTag,{value:"Module"})),hn=`<p align="center"><img src="https://raw.githubusercontent.com/odb/official-bash-logo/master/assets/Logos/Icons/PNG/512x512.png" width="200px"></p>
<h1 align="center">pure bash bible</h1> <p
align="center">A collection of pure bash alternatives to external
processes.</p>
<p align="center"> <a
href="https://travis-ci.com/dylanaraps/pure-bash-bible"><img
src="https://travis-ci.com/dylanaraps/pure-bash-bible.svg?branch=master"></a>
<br>
<a href="https://leanpub.com/bash/">
<img src="https://s3.amazonaws.com/titlepages.leanpub.com/bash/hero" width="40%" align="right">
</a>

The goal of this book is to document commonly-known and lesser-known methods of doing various tasks using only built-in \`bash\` features. Using the snippets from this bible can help remove unneeded dependencies from scripts and in most cases make them faster. I came across these tips and discovered a few while developing [neofetch](https://github.com/dylanaraps/neofetch), [pxltrm](https://github.com/dylanaraps/pxltrm) and other smaller projects.

The snippets below are linted using \`shellcheck\` and tests have been written where applicable. Want to contribute? Read the [CONTRIBUTING.md](https://github.com/dylanaraps/pure-bash-bible/blob/master/CONTRIBUTING.md). It outlines how the unit tests work and what is required when adding snippets to the bible.

See something incorrectly described, buggy or outright wrong? Open an issue or send a pull request. If the bible is missing something, open an issue and a solution will be found.

<br>
<p align="center"><b>This book is also available to purchase on leanpub. https://leanpub.com/bash</b></p>
<p align="center"><b>Or you can buy me a coffee.</b>
<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=V7QNJNKS3WYVS"><img src="https://img.shields.io/badge/don-paypal-yellow.svg"></a> <a href="https://www.patreon.com/dyla"><img src="https://img.shields.io/badge/don-patreon-yellow.svg"> </a><a href="https://liberapay.com/2211/"><img src="https://img.shields.io/badge/don-liberapay-yellow.svg"></a>
</p>

<br>

# Table of Contents

<!-- vim-markdown-toc GFM -->

- [FOREWORD](#foreword)
- [STRINGS](#strings)
  - [Trim leading and trailing white-space from string](#trim-leading-and-trailing-white-space-from-string)
  - [Trim all white-space from string and truncate spaces](#trim-all-white-space-from-string-and-truncate-spaces)
  - [Use regex on a string](#use-regex-on-a-string)
  - [Split a string on a delimiter](#split-a-string-on-a-delimiter)
  - [Change a string to lowercase](#change-a-string-to-lowercase)
  - [Change a string to uppercase](#change-a-string-to-uppercase)
  - [Reverse a string case](#reverse-a-string-case)
  - [Trim quotes from a string](#trim-quotes-from-a-string)
  - [Strip all instances of pattern from string](#strip-all-instances-of-pattern-from-string)
  - [Strip first occurrence of pattern from string](#strip-first-occurrence-of-pattern-from-string)
  - [Strip pattern from start of string](#strip-pattern-from-start-of-string)
  - [Strip pattern from end of string](#strip-pattern-from-end-of-string)
  - [Percent-encode a string](#percent-encode-a-string)
  - [Decode a percent-encoded string](#decode-a-percent-encoded-string)
  - [Check if string contains a sub-string](#check-if-string-contains-a-sub-string)
  - [Check if string starts with sub-string](#check-if-string-starts-with-sub-string)
  - [Check if string ends with sub-string](#check-if-string-ends-with-sub-string)
- [ARRAYS](#arrays)
  - [Reverse an array](#reverse-an-array)
  - [Remove duplicate array elements](#remove-duplicate-array-elements)
  - [Random array element](#random-array-element)
  - [Cycle through an array](#cycle-through-an-array)
  - [Toggle between two values](#toggle-between-two-values)
- [LOOPS](#loops)
  - [Loop over a range of numbers](#loop-over-a-range-of-numbers)
  - [Loop over a variable range of numbers](#loop-over-a-variable-range-of-numbers)
  - [Loop over an array](#loop-over-an-array)
  - [Loop over an array with an index](#loop-over-an-array-with-an-index)
  - [Loop over the contents of a file](#loop-over-the-contents-of-a-file)
  - [Loop over files and directories](#loop-over-files-and-directories)
- [FILE HANDLING](#file-handling)
  - [Read a file to a string](#read-a-file-to-a-string)
  - [Read a file to an array (_by line_)](#read-a-file-to-an-array-by-line)
  - [Get the first N lines of a file](#get-the-first-n-lines-of-a-file)
  - [Get the last N lines of a file](#get-the-last-n-lines-of-a-file)
  - [Get the number of lines in a file](#get-the-number-of-lines-in-a-file)
  - [Count files or directories in directory](#count-files-or-directories-in-directory)
  - [Create an empty file](#create-an-empty-file)
  - [Extract lines between two markers](#extract-lines-between-two-markers)
- [FILE PATHS](#file-paths)
  - [Get the directory name of a file path](#get-the-directory-name-of-a-file-path)
  - [Get the base-name of a file path](#get-the-base-name-of-a-file-path)
- [VARIABLES](#variables)
  - [Assign and access a variable using a variable](#assign-and-access-a-variable-using-a-variable)
  - [Name a variable based on another variable](#name-a-variable-based-on-another-variable)
- [ESCAPE SEQUENCES](#escape-sequences)
  - [Text Colors](#text-colors)
  - [Text Attributes](#text-attributes)
  - [Cursor Movement](#cursor-movement)
  - [Erasing Text](#erasing-text)
- [PARAMETER EXPANSION](#parameter-expansion)
  - [Indirection](#indirection)
  - [Replacement](#replacement)
  - [Length](#length)
  - [Expansion](#expansion)
  - [Case Modification](#case-modification)
  - [Default Value](#default-value)
- [BRACE EXPANSION](#brace-expansion)
  - [Ranges](#ranges)
  - [String Lists](#string-lists)
- [CONDITIONAL EXPRESSIONS](#conditional-expressions)
  - [File Conditionals](#file-conditionals)
  - [File Comparisons](#file-comparisons)
  - [Variable Conditionals](#variable-conditionals)
  - [Variable Comparisons](#variable-comparisons)
- [ARITHMETIC OPERATORS](#arithmetic-operators)
  - [Assignment](#assignment)
  - [Arithmetic](#arithmetic)
  - [Bitwise](#bitwise)
  - [Logical](#logical)
  - [Miscellaneous](#miscellaneous)
- [ARITHMETIC](#arithmetic-1)
  - [Simpler syntax to set variables](#simpler-syntax-to-set-variables)
  - [Ternary Tests](#ternary-tests)
- [TRAPS](#traps)
  - [Do something on script exit](#do-something-on-script-exit)
  - [Ignore terminal interrupt (CTRL+C, SIGINT)](#ignore-terminal-interrupt-ctrlc-sigint)
  - [React to window resize](#react-to-window-resize)
  - [Do something before every command](#do-something-before-every-command)
  - [Do something when a shell function or a sourced file finishes executing](#do-something-when-a-shell-function-or-a-sourced-file-finishes-executing)
- [PERFORMANCE](#performance)
  - [Disable Unicode](#disable-unicode)
- [OBSOLETE SYNTAX](#obsolete-syntax)
  - [Shebang](#shebang)
  - [Command Substitution](#command-substitution)
  - [Function Declaration](#function-declaration)
- [INTERNAL VARIABLES](#internal-variables)
  - [Get the location to the \`bash\` binary](#get-the-location-to-the-bash-binary)
  - [Get the version of the current running \`bash\` process](#get-the-version-of-the-current-running-bash-process)
  - [Open the user's preferred text editor](#open-the-users-preferred-text-editor)
  - [Get the name of the current function](#get-the-name-of-the-current-function)
  - [Get the host-name of the system](#get-the-host-name-of-the-system)
  - [Get the architecture of the Operating System](#get-the-architecture-of-the-operating-system)
  - [Get the name of the Operating System / Kernel](#get-the-name-of-the-operating-system--kernel)
  - [Get the current working directory](#get-the-current-working-directory)
  - [Get the number of seconds the script has been running](#get-the-number-of-seconds-the-script-has-been-running)
  - [Get a pseudorandom integer](#get-a-pseudorandom-integer)
- [INFORMATION ABOUT THE TERMINAL](#information-about-the-terminal)
  - [Get the terminal size in lines and columns (_from a script_)](#get-the-terminal-size-in-lines-and-columns-from-a-script)
  - [Get the terminal size in pixels](#get-the-terminal-size-in-pixels)
  - [Get the current cursor position](#get-the-current-cursor-position)
- [CONVERSION](#conversion)
  - [Convert a hex color to RGB](#convert-a-hex-color-to-rgb)
  - [Convert an RGB color to hex](#convert-an-rgb-color-to-hex)
- [CODE GOLF](#code-golf)
  - [Shorter \`for\` loop syntax](#shorter-for-loop-syntax)
  - [Shorter infinite loops](#shorter-infinite-loops)
  - [Shorter function declaration](#shorter-function-declaration)
  - [Shorter \`if\` syntax](#shorter-if-syntax)
  - [Simpler \`case\` statement to set variable](#simpler-case-statement-to-set-variable)
- [OTHER](#other)
  - [Use \`read\` as an alternative to the \`sleep\` command](#use-read-as-an-alternative-to-the-sleep-command)
  - [Check if a program is in the user's PATH](#check-if-a-program-is-in-the-users-path)
  - [Get the current date using \`strftime\`](#get-the-current-date-using-strftime)
  - [Get the username of the current user](#get-the-username-of-the-current-user)
  - [Generate a UUID V4](#generate-a-uuid-v4)
  - [Progress bars](#progress-bars)
  - [Get the list of functions in a script](#get-the-list-of-functions-in-a-script)
  - [Bypass shell aliases](#bypass-shell-aliases)
  - [Bypass shell functions](#bypass-shell-functions)
  - [Run a command in the background](#run-a-command-in-the-background)
  - [Capture function return without command substitution](#capture-the-return-value-of-a-function-without-command-substitution)
- [AFTERWORD](#afterword)

<!-- vim-markdown-toc -->

<br>

<!-- CHAPTER START -->

# FOREWORD

A collection of pure \`bash\` alternatives to external processes and programs. The \`bash\` scripting language is more powerful than people realise and most tasks can be accomplished without depending on external programs.

Calling an external process in \`bash\` is expensive and excessive use will cause a noticeable slowdown. Scripts and programs written using built-in methods (_where applicable_) will be faster, require fewer dependencies and afford a better understanding of the language itself.

The contents of this book provide a reference for solving problems encountered when writing programs and scripts in \`bash\`. Examples are in function formats showcasing how to incorporate these solutions into code.

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# STRINGS

## Trim leading and trailing white-space from string

This is an alternative to \`sed\`, \`awk\`, \`perl\` and other tools. The
function below works by finding all leading and trailing white-space and
removing it from the start and end of the string. The \`:\` built-in is used in place of a temporary variable.

**Example Function:**

\`\`\`sh
trim_string() {
    # Usage: trim_string "   example   string    "
    : "\${1#"\${1%%[![:space:]]*}"}"
    : "\${_%"\${_##*[![:space:]]}"}"
    printf '%s\\n' "$_"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ trim_string "    Hello,  World    "
Hello,  World

$ name="   John Black  "
$ trim_string "$name"
John Black
\`\`\`

## Trim all white-space from string and truncate spaces

This is an alternative to \`sed\`, \`awk\`, \`perl\` and other tools. The
function below works by abusing word splitting to create a new string
without leading/trailing white-space and with truncated spaces.

**Example Function:**

\`\`\`sh
# shellcheck disable=SC2086,SC2048
trim_all() {
    # Usage: trim_all "   example   string    "
    set -f
    set -- $*
    printf '%s\\n' "$*"
    set +f
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ trim_all "    Hello,    World    "
Hello, World

$ name="   John   Black  is     my    name.    "
$ trim_all "$name"
John Black is my name.
\`\`\`

## Use regex on a string

The result of \`bash\`'s regex matching can be used to replace \`sed\` for a
large number of use-cases.

**CAVEAT**: This is one of the few platform dependent \`bash\` features.
\`bash\` will use whatever regex engine is installed on the user's system.
Stick to POSIX regex features if aiming for compatibility.

**CAVEAT**: This example only prints the first matching group. When using
multiple capture groups some modification is needed.

**Example Function:**

\`\`\`sh
regex() {
    # Usage: regex "string" "regex"
    [[ $1 =~ $2 ]] && printf '%s\\n' "\${BASH_REMATCH[1]}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ # Trim leading white-space.
$ regex '    hello' '^\\s*(.*)'
hello

$ # Validate a hex color.
$ regex "#FFFFFF" '^(#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3}))$'
#FFFFFF

$ # Validate a hex color (invalid).
$ regex "red" '^(#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3}))$'
# no output (invalid)
\`\`\`

**Example Usage in script:**

\`\`\`shell
is_hex_color() {
    if [[ $1 =~ ^(#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3}))$ ]]; then
        printf '%s\\n' "\${BASH_REMATCH[1]}"
    else
        printf '%s\\n' "error: $1 is an invalid color."
        return 1
    fi
}

read -r color
is_hex_color "$color" || color="#FFFFFF"

# Do stuff.
\`\`\`

## Split a string on a delimiter

**CAVEAT:** Requires \`bash\` 4+

This is an alternative to \`cut\`, \`awk\` and other tools.

**Example Function:**

\`\`\`sh
split() {
   # Usage: split "string" "delimiter"
   IFS=$'\\n' read -d "" -ra arr <<< "\${1//$2/$'\\n'}"
   printf '%s\\n' "\${arr[@]}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ split "apples,oranges,pears,grapes" ","
apples
oranges
pears
grapes

$ split "1, 2, 3, 4, 5" ", "
1
2
3
4
5

# Multi char delimiters work too!
$ split "hello---world---my---name---is---john" "---"
hello
world
my
name
is
john
\`\`\`

## Change a string to lowercase

**CAVEAT:** Requires \`bash\` 4+

**Example Function:**

\`\`\`sh
lower() {
    # Usage: lower "string"
    printf '%s\\n' "\${1,,}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ lower "HELLO"
hello

$ lower "HeLlO"
hello

$ lower "hello"
hello
\`\`\`

## Change a string to uppercase

**CAVEAT:** Requires \`bash\` 4+

**Example Function:**

\`\`\`sh
upper() {
    # Usage: upper "string"
    printf '%s\\n' "\${1^^}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ upper "hello"
HELLO

$ upper "HeLlO"
HELLO

$ upper "HELLO"
HELLO
\`\`\`

## Reverse a string case

**CAVEAT:** Requires \`bash\` 4+

**Example Function:**

\`\`\`sh
reverse_case() {
    # Usage: reverse_case "string"
    printf '%s\\n' "\${1~~}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ reverse_case "hello"
HELLO

$ reverse_case "HeLlO"
hElLo

$ reverse_case "HELLO"
hello
\`\`\`

## Trim quotes from a string

**Example Function:**

\`\`\`sh
trim_quotes() {
    # Usage: trim_quotes "string"
    : "\${1//\\'}"
    printf '%s\\n' "\${_//\\"}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ var="'Hello', \\"World\\""
$ trim_quotes "$var"
Hello, World
\`\`\`

## Strip all instances of pattern from string

**Example Function:**

\`\`\`sh
strip_all() {
    # Usage: strip_all "string" "pattern"
    printf '%s\\n' "\${1//$2}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ strip_all "The Quick Brown Fox" "[aeiou]"
Th Qck Brwn Fx

$ strip_all "The Quick Brown Fox" "[[:space:]]"
TheQuickBrownFox

$ strip_all "The Quick Brown Fox" "Quick "
The Brown Fox
\`\`\`

## Strip first occurrence of pattern from string

**Example Function:**

\`\`\`sh
strip() {
    # Usage: strip "string" "pattern"
    printf '%s\\n' "\${1/$2}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ strip "The Quick Brown Fox" "[aeiou]"
Th Quick Brown Fox

$ strip "The Quick Brown Fox" "[[:space:]]"
TheQuick Brown Fox
\`\`\`

## Strip pattern from start of string

**Example Function:**

\`\`\`sh
lstrip() {
    # Usage: lstrip "string" "pattern"
    printf '%s\\n' "\${1##$2}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ lstrip "The Quick Brown Fox" "The "
Quick Brown Fox
\`\`\`

## Strip pattern from end of string

**Example Function:**

\`\`\`sh
rstrip() {
    # Usage: rstrip "string" "pattern"
    printf '%s\\n' "\${1%%$2}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ rstrip "The Quick Brown Fox" " Fox"
The Quick Brown
\`\`\`

## Percent-encode a string

**Example Function:**

\`\`\`sh
urlencode() {
    # Usage: urlencode "string"
    local LC_ALL=C
    for (( i = 0; i < \${#1}; i++ )); do
        : "\${1:i:1}"
        case "$_" in
            [a-zA-Z0-9.~_-])
                printf '%s' "$_"
            ;;

            *)
                printf '%%%02X' "'$_"
            ;;
        esac
    done
    printf '\\n'
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ urlencode "https://github.com/dylanaraps/pure-bash-bible"
https%3A%2F%2Fgithub.com%2Fdylanaraps%2Fpure-bash-bible
\`\`\`

## Decode a percent-encoded string

**Example Function:**

\`\`\`sh
urldecode() {
    # Usage: urldecode "string"
    : "\${1//+/ }"
    printf '%b\\n' "\${_//%/\\\\x}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ urldecode "https%3A%2F%2Fgithub.com%2Fdylanaraps%2Fpure-bash-bible"
https://github.com/dylanaraps/pure-bash-bible
\`\`\`

## Check if string contains a sub-string

**Using a test:**

\`\`\`shell
if [[ $var == *sub_string* ]]; then
    printf '%s\\n' "sub_string is in var."
fi

# Inverse (substring not in string).
if [[ $var != *sub_string* ]]; then
    printf '%s\\n' "sub_string is not in var."
fi

# This works for arrays too!
if [[ \${arr[*]} == *sub_string* ]]; then
    printf '%s\\n' "sub_string is in array."
fi
\`\`\`

**Using a case statement:**

\`\`\`shell
case "$var" in
    *sub_string*)
        # Do stuff
    ;;

    *sub_string2*)
        # Do more stuff
    ;;

    *)
        # Else
    ;;
esac
\`\`\`

## Check if string starts with sub-string

\`\`\`shell
if [[ $var == sub_string* ]]; then
    printf '%s\\n' "var starts with sub_string."
fi

# Inverse (var does not start with sub_string).
if [[ $var != sub_string* ]]; then
    printf '%s\\n' "var does not start with sub_string."
fi
\`\`\`

## Check if string ends with sub-string

\`\`\`shell
if [[ $var == *sub_string ]]; then
    printf '%s\\n' "var ends with sub_string."
fi

# Inverse (var does not end with sub_string).
if [[ $var != *sub_string ]]; then
    printf '%s\\n' "var does not end with sub_string."
fi
\`\`\`

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# ARRAYS

## Reverse an array

Enabling \`extdebug\` allows access to the \`BASH_ARGV\` array which stores
the current function’s arguments in reverse.

**CAVEAT**: Requires \`shopt -s compat44\` in \`bash\` 5.0+.

**Example Function:**

\`\`\`sh
reverse_array() {
    # Usage: reverse_array "array"
    shopt -s extdebug
    f()(printf '%s\\n' "\${BASH_ARGV[@]}"); f "$@"
    shopt -u extdebug
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ reverse_array 1 2 3 4 5
5
4
3
2
1

$ arr=(red blue green)
$ reverse_array "\${arr[@]}"
green
blue
red
\`\`\`

## Remove duplicate array elements

Create a temporary associative array. When setting associative array
values and a duplicate assignment occurs, bash overwrites the key. This
allows us to effectively remove array duplicates.

**CAVEAT:** Requires \`bash\` 4+

**CAVEAT:** List order may not stay the same.

**Example Function:**

\`\`\`sh
remove_array_dups() {
    # Usage: remove_array_dups "array"
    declare -A tmp_array

    for i in "$@"; do
        [[ $i ]] && IFS=" " tmp_array["\${i:- }"]=1
    done

    printf '%s\\n' "\${!tmp_array[@]}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ remove_array_dups 1 1 2 2 3 3 3 3 3 4 4 4 4 4 5 5 5 5 5 5
1
2
3
4
5

$ arr=(red red green blue blue)
$ remove_array_dups "\${arr[@]}"
red
green
blue
\`\`\`

## Random array element

**Example Function:**

\`\`\`sh
random_array_element() {
    # Usage: random_array_element "array"
    local arr=("$@")
    printf '%s\\n' "\${arr[RANDOM % $#]}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ array=(red green blue yellow brown)
$ random_array_element "\${array[@]}"
yellow

# Multiple arguments can also be passed.
$ random_array_element 1 2 3 4 5 6 7
3
\`\`\`

## Cycle through an array

Each time the \`printf\` is called, the next array element is printed. When
the print hits the last array element it starts from the first element
again.

\`\`\`sh
arr=(a b c d)

cycle() {
    printf '%s ' "\${arr[\${i:=0}]}"
    ((i=i>=\${#arr[@]}-1?0:++i))
}
\`\`\`

## Toggle between two values

This works the same as above, this is just a different use case.

\`\`\`sh
arr=(true false)

cycle() {
    printf '%s ' "\${arr[\${i:=0}]}"
    ((i=i>=\${#arr[@]}-1?0:++i))
}
\`\`\`

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# LOOPS

## Loop over a range of numbers

Alternative to \`seq\`.

\`\`\`shell
# Loop from 0-100 (no variable support).
for i in {0..100}; do
    printf '%s\\n' "$i"
done
\`\`\`

## Loop over a variable range of numbers

Alternative to \`seq\`.

\`\`\`shell
# Loop from 0-VAR.
VAR=50
for ((i=0;i<=VAR;i++)); do
    printf '%s\\n' "$i"
done
\`\`\`

## Loop over an array

\`\`\`shell
arr=(apples oranges tomatoes)

# Just elements.
for element in "\${arr[@]}"; do
    printf '%s\\n' "$element"
done
\`\`\`

## Loop over an array with an index

\`\`\`shell
arr=(apples oranges tomatoes)

# Elements and index.
for i in "\${!arr[@]}"; do
    printf '%s\\n' "\${arr[i]}"
done

# Alternative method.
for ((i=0;i<\${#arr[@]};i++)); do
    printf '%s\\n' "\${arr[i]}"
done
\`\`\`

## Loop over the contents of a file

\`\`\`shell
while read -r line; do
    printf '%s\\n' "$line"
done < "file"
\`\`\`

## Loop over files and directories

Don’t use \`ls\`.

\`\`\`shell
# Greedy example.
for file in *; do
    printf '%s\\n' "$file"
done

# PNG files in dir.
for file in ~/Pictures/*.png; do
    printf '%s\\n' "$file"
done

# Iterate over directories.
for dir in ~/Downloads/*/; do
    printf '%s\\n' "$dir"
done

# Brace Expansion.
for file in /path/to/parentdir/{file1,file2,subdir/file3}; do
    printf '%s\\n' "$file"
done

# Iterate recursively.
shopt -s globstar
for file in ~/Pictures/**/*; do
    printf '%s\\n' "$file"
done
shopt -u globstar
\`\`\`

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# FILE HANDLING

**CAVEAT:** \`bash\` does not handle binary data properly in versions \`< 4.4\`.

## Read a file to a string

Alternative to the \`cat\` command.

\`\`\`shell
file_data="$(<"file")"
\`\`\`

## Read a file to an array (_by line_)

Alternative to the \`cat\` command.

\`\`\`shell
# Bash <4 (discarding empty lines).
IFS=$'\\n' read -d "" -ra file_data < "file"

# Bash <4 (preserving empty lines).
while read -r line; do
    file_data+=("$line")
done < "file"

# Bash 4+
mapfile -t file_data < "file"
\`\`\`

## Get the first N lines of a file

Alternative to the \`head\` command.

**CAVEAT:** Requires \`bash\` 4+

**Example Function:**

\`\`\`sh
head() {
    # Usage: head "n" "file"
    mapfile -tn "$1" line < "$2"
    printf '%s\\n' "\${line[@]}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ head 2 ~/.bashrc
# Prompt
PS1='➜ '

$ head 1 ~/.bashrc
# Prompt
\`\`\`

## Get the last N lines of a file

Alternative to the \`tail\` command.

**CAVEAT:** Requires \`bash\` 4+

**Example Function:**

\`\`\`sh
tail() {
    # Usage: tail "n" "file"
    mapfile -tn 0 line < "$2"
    printf '%s\\n' "\${line[@]: -$1}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ tail 2 ~/.bashrc
# Enable tmux.
# [[ -z "$TMUX"  ]] && exec tmux

$ tail 1 ~/.bashrc
# [[ -z "$TMUX"  ]] && exec tmux
\`\`\`

## Get the number of lines in a file

Alternative to \`wc -l\`.

**Example Function (bash 4):**

\`\`\`sh
lines() {
    # Usage: lines "file"
    mapfile -tn 0 lines < "$1"
    printf '%s\\n' "\${#lines[@]}"
}
\`\`\`

**Example Function (bash 3):**

This method uses less memory than the \`mapfile\` method and works in \`bash\` 3 but it is slower for bigger files.

\`\`\`sh
lines_loop() {
    # Usage: lines_loop "file"
    count=0
    while IFS= read -r _; do
        ((count++))
    done < "$1"
    printf '%s\\n' "$count"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ lines ~/.bashrc
48

$ lines_loop ~/.bashrc
48
\`\`\`

## Count files or directories in directory

This works by passing the output of the glob to the function and then counting the number of arguments.

**Example Function:**

\`\`\`sh
count() {
    # Usage: count /path/to/dir/*
    #        count /path/to/dir/*/
    printf '%s\\n' "$#"
}
\`\`\`

**Example Usage:**

\`\`\`shell
# Count all files in dir.
$ count ~/Downloads/*
232

# Count all dirs in dir.
$ count ~/Downloads/*/
45

# Count all jpg files in dir.
$ count ~/Pictures/*.jpg
64
\`\`\`

## Create an empty file

Alternative to \`touch\`.

\`\`\`shell
# Shortest.
>file

# Longer alternatives:
:>file
echo -n >file
printf '' >file
\`\`\`

## Extract lines between two markers

**Example Function:**

\`\`\`sh
extract() {
    # Usage: extract file "opening marker" "closing marker"
    while IFS=$'\\n' read -r line; do
        [[ $extract && $line != "$3" ]] &&
            printf '%s\\n' "$line"

        [[ $line == "$2" ]] && extract=1
        [[ $line == "$3" ]] && extract=
    done < "$1"
}
\`\`\`

**Example Usage:**

\`\`\`\`shell
# Extract code blocks from MarkDown file.
$ extract ~/projects/pure-bash/README.md '\`\`\`sh' '\`\`\`'
# Output here...
\`\`\`\`

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# FILE PATHS

## Get the directory name of a file path

Alternative to the \`dirname\` command.

**Example Function:**

\`\`\`sh
dirname() {
    # Usage: dirname "path"
    local tmp=\${1:-.}

    [[ $tmp != *[!/]* ]] && {
        printf '/\\n'
        return
    }

    tmp=\${tmp%%"\${tmp##*[!/]}"}

    [[ $tmp != */* ]] && {
        printf '.\\n'
        return
    }

    tmp=\${tmp%/*}
    tmp=\${tmp%%"\${tmp##*[!/]}"}

    printf '%s\\n' "\${tmp:-/}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ dirname ~/Pictures/Wallpapers/1.jpg
/home/black/Pictures/Wallpapers

$ dirname ~/Pictures/Downloads/
/home/black/Pictures
\`\`\`

## Get the base-name of a file path

Alternative to the \`basename\` command.

**Example Function:**

\`\`\`sh
basename() {
    # Usage: basename "path" ["suffix"]
    local tmp

    tmp=\${1%"\${1##*[!/]}"}
    tmp=\${tmp##*/}
    tmp=\${tmp%"\${2/"$tmp"}"}

    printf '%s\\n' "\${tmp:-/}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ basename ~/Pictures/Wallpapers/1.jpg
1.jpg

$ basename ~/Pictures/Wallpapers/1.jpg .jpg
1

$ basename ~/Pictures/Downloads/
Downloads
\`\`\`

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# VARIABLES

## Assign and access a variable using a variable

\`\`\`shell
$ hello_world="value"

# Create the variable name.
$ var="world"
$ ref="hello_$var"

# Print the value of the variable name stored in 'hello_$var'.
$ printf '%s\\n' "\${!ref}"
value
\`\`\`

Alternatively, on \`bash\` 4.3+:

\`\`\`shell
$ hello_world="value"
$ var="world"

# Declare a nameref.
$ declare -n ref=hello_$var

$ printf '%s\\n' "$ref"
value
\`\`\`

## Name a variable based on another variable

\`\`\`shell
$ var="world"
$ declare "hello_$var=value"
$ printf '%s\\n' "$hello_world"
value
\`\`\`

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# ESCAPE SEQUENCES

Contrary to popular belief, there is no issue in utilizing raw escape sequences. Using \`tput\` abstracts the same ANSI sequences as if printed manually. Worse still, \`tput\` is not actually portable. There are a number of \`tput\` variants each with different commands and syntaxes (_try \`tput setaf 3\` on a FreeBSD system_). Raw sequences are fine.

## Text Colors

**NOTE:** Sequences requiring RGB values only work in True-Color Terminal Emulators.

| Sequence               | What does it do?                        | Value         |
| ---------------------- | --------------------------------------- | ------------- |
| \`\\e[38;5;<NUM>m\`       | Set text foreground color.              | \`0-255\`       |
| \`\\e[48;5;<NUM>m\`       | Set text background color.              | \`0-255\`       |
| \`\\e[38;2;<R>;<G>;<B>m\` | Set text foreground color to RGB color. | \`R\`, \`G\`, \`B\` |
| \`\\e[48;2;<R>;<G>;<B>m\` | Set text background color to RGB color. | \`R\`, \`G\`, \`B\` |

## Text Attributes

**NOTE:** Prepend 2 to any code below to turn it's effect off
(examples: 21=bold text off, 22=faint text off, 23=italic text off).

| Sequence | What does it do?                  |
| -------- | --------------------------------- |
| \`\\e[m\`   | Reset text formatting and colors. |
| \`\\e[1m\`  | Bold text.                        |
| \`\\e[2m\`  | Faint text.                       |
| \`\\e[3m\`  | Italic text.                      |
| \`\\e[4m\`  | Underline text.                   |
| \`\\e[5m\`  | Blinking text.                    |
| \`\\e[7m\`  | Highlighted text.                 |
| \`\\e[8m\`  | Hidden text.                      |
| \`\\e[9m\`  | Strike-through text.              |

## Cursor Movement

| Sequence              | What does it do?                      | Value            |
| --------------------- | ------------------------------------- | ---------------- |
| \`\\e[<LINE>;<COLUMN>H\` | Move cursor to absolute position.     | \`line\`, \`column\` |
| \`\\e[H\`                | Move cursor to home position (\`0,0\`). |
| \`\\e[<NUM>A\`           | Move cursor up N lines.               | \`num\`            |
| \`\\e[<NUM>B\`           | Move cursor down N lines.             | \`num\`            |
| \`\\e[<NUM>C\`           | Move cursor right N columns.          | \`num\`            |
| \`\\e[<NUM>D\`           | Move cursor left N columns.           | \`num\`            |
| \`\\e[s\`                | Save cursor position.                 |
| \`\\e[u\`                | Restore cursor position.              |

## Erasing Text

| Sequence    | What does it do?                                         |
| ----------- | -------------------------------------------------------- |
| \`\\e[K\`      | Erase from cursor position to end of line.               |
| \`\\e[1K\`     | Erase from cursor position to start of line.             |
| \`\\e[2K\`     | Erase the entire current line.                           |
| \`\\e[J\`      | Erase from the current line to the bottom of the screen. |
| \`\\e[1J\`     | Erase from the current line to the top of the screen.    |
| \`\\e[2J\`     | Clear the screen.                                        |
| \`\\e[2J\\e[H\` | Clear the screen and move cursor to \`0,0\`.               |

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# PARAMETER EXPANSION

## Indirection

| Parameter  | What does it do?                                                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| \`\${!VAR}\`  | Access a variable based on the value of \`VAR\`.                                                                                         |
| \`\${!VAR*}\` | Expand to \`IFS\` separated list of variable names starting with \`VAR\`.                                                                  |
| \`\${!VAR@}\` | Expand to \`IFS\` separated list of variable names starting with \`VAR\`. If double-quoted, each variable name expands to a separate word. |

## Replacement

| Parameter                 | What does it do?                                       |
| ------------------------- | ------------------------------------------------------ |
| \`\${VAR#PATTERN}\`          | Remove shortest match of pattern from start of string. |
| \`\${VAR##PATTERN}\`         | Remove longest match of pattern from start of string.  |
| \`\${VAR%PATTERN}\`          | Remove shortest match of pattern from end of string.   |
| \`\${VAR%%PATTERN}\`         | Remove longest match of pattern from end of string.    |
| \`\${VAR/PATTERN/REPLACE}\`  | Replace first match with string.                       |
| \`\${VAR//PATTERN/REPLACE}\` | Replace all matches with string.                       |
| \`\${VAR/PATTERN}\`          | Remove first match.                                    |
| \`\${VAR//PATTERN}\`         | Remove all matches.                                    |

## Length

| Parameter    | What does it do?             |
| ------------ | ---------------------------- |
| \`\${#VAR}\`    | Length of var in characters. |
| \`\${#ARR[@]}\` | Length of array in elements. |

## Expansion

| Parameter               | What does it do?                                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------- |
| \`\${VAR:OFFSET}\`         | Remove first \`N\` chars from variable.                                                                                |
| \`\${VAR:OFFSET:LENGTH}\`  | Get substring from \`N\` character to \`N\` character. <br> (\`\${VAR:10:10}\`: Get sub-string from char \`10\` to char \`20\`) |
| \`\${VAR:: OFFSET}\`       | Get first \`N\` chars from variable.                                                                                   |
| \`\${VAR:: -OFFSET}\`      | Remove last \`N\` chars from variable.                                                                                 |
| \`\${VAR: -OFFSET}\`       | Get last \`N\` chars from variable.                                                                                    |
| \`\${VAR:OFFSET:-OFFSET}\` | Cut first \`N\` chars and last \`N\` chars.                                                                              | \`bash 4.2+\` |

## Case Modification

| Parameter  | What does it do?                 | CAVEAT    |
| ---------- | -------------------------------- | --------- |
| \`\${VAR^}\`  | Uppercase first character.       | \`bash 4+\` |
| \`\${VAR^^}\` | Uppercase all characters.        | \`bash 4+\` |
| \`\${VAR,}\`  | Lowercase first character.       | \`bash 4+\` |
| \`\${VAR,,}\` | Lowercase all characters.        | \`bash 4+\` |
| \`\${VAR~}\`  | Reverse case of first character. | \`bash 4+\` |
| \`\${VAR~~}\` | Reverse case of all characters.  | \`bash 4+\` |

## Default Value

| Parameter        | What does it do?                                                |
| ---------------- | --------------------------------------------------------------- |
| \`\${VAR:-STRING}\` | If \`VAR\` is empty or unset, use \`STRING\` as its value.          |
| \`\${VAR-STRING}\`  | If \`VAR\` is unset, use \`STRING\` as its value.                   |
| \`\${VAR:=STRING}\` | If \`VAR\` is empty or unset, set the value of \`VAR\` to \`STRING\`. |
| \`\${VAR=STRING}\`  | If \`VAR\` is unset, set the value of \`VAR\` to \`STRING\`.          |
| \`\${VAR:+STRING}\` | If \`VAR\` is not empty, use \`STRING\` as its value.               |
| \`\${VAR+STRING}\`  | If \`VAR\` is set, use \`STRING\` as its value.                     |
| \`\${VAR:?STRING}\` | Display an error if empty or unset.                             |
| \`\${VAR?STRING}\`  | Display an error if unset.                                      |

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# BRACE EXPANSION

## Ranges

\`\`\`shell
# Syntax: {<START>..<END>}

# Print numbers 1-100.
echo {1..100}

# Print range of floats.
echo 1.{1..9}

# Print chars a-z.
echo {a..z}
echo {A..Z}

# Nesting.
echo {A..Z}{0..9}

# Print zero-padded numbers.
# CAVEAT: bash 4+
echo {01..100}

# Change increment amount.
# Syntax: {<START>..<END>..<INCREMENT>}
# CAVEAT: bash 4+
echo {1..10..2} # Increment by 2.
\`\`\`

## String Lists

\`\`\`shell
echo {apples,oranges,pears,grapes}

# Example Usage:
# Remove dirs Movies, Music and ISOS from ~/Downloads/.
rm -rf ~/Downloads/{Movies,Music,ISOS}
\`\`\`

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# CONDITIONAL EXPRESSIONS

## File Conditionals

| Expression | Value  | What does it do?                                       |
| ---------- | ------ | ------------------------------------------------------ |
| \`-a\`       | \`file\` | If file exists.                                        |
| \`-b\`       | \`file\` | If file exists and is a block special file.            |
| \`-c\`       | \`file\` | If file exists and is a character special file.        |
| \`-d\`       | \`file\` | If file exists and is a directory.                     |
| \`-e\`       | \`file\` | If file exists.                                        |
| \`-f\`       | \`file\` | If file exists and is a regular file.                  |
| \`-g\`       | \`file\` | If file exists and its set-group-id bit is set.        |
| \`-h\`       | \`file\` | If file exists and is a symbolic link.                 |
| \`-k\`       | \`file\` | If file exists and its sticky-bit is set               |
| \`-p\`       | \`file\` | If file exists and is a named pipe (_FIFO_).           |
| \`-r\`       | \`file\` | If file exists and is readable.                        |
| \`-s\`       | \`file\` | If file exists and its size is greater than zero.      |
| \`-t\`       | \`fd\`   | If file descriptor is open and refers to a terminal.   |
| \`-u\`       | \`file\` | If file exists and its set-user-id bit is set.         |
| \`-w\`       | \`file\` | If file exists and is writable.                        |
| \`-x\`       | \`file\` | If file exists and is executable.                      |
| \`-G\`       | \`file\` | If file exists and is owned by the effective group ID. |
| \`-L\`       | \`file\` | If file exists and is a symbolic link.                 |
| \`-N\`       | \`file\` | If file exists and has been modified since last read.  |
| \`-O\`       | \`file\` | If file exists and is owned by the effective user ID.  |
| \`-S\`       | \`file\` | If file exists and is a socket.                        |

## File Comparisons

| Expression       | What does it do?                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| \`file -ef file2\` | If both files refer to the same inode and device numbers.                                         |
| \`file -nt file2\` | If \`file\` is newer than \`file2\` (_uses modification time_) or \`file\` exists and \`file2\` does not. |
| \`file -ot file2\` | If \`file\` is older than \`file2\` (_uses modification time_) or \`file2\` exists and \`file\` does not. |

## Variable Conditionals

| Expression | Value | What does it do?                     |
| ---------- | ----- | ------------------------------------ |
| \`-o\`       | \`opt\` | If shell option is enabled.          |
| \`-v\`       | \`var\` | If variable has a value assigned.    |
| \`-R\`       | \`var\` | If variable is a name reference.     |
| \`-z\`       | \`var\` | If the length of string is zero.     |
| \`-n\`       | \`var\` | If the length of string is non-zero. |

## Variable Comparisons

| Expression    | What does it do?                              |
| ------------- | --------------------------------------------- |
| \`var = var2\`  | Equal to.                                     |
| \`var == var2\` | Equal to (_synonym for \`=\`_).                 |
| \`var != var2\` | Not equal to.                                 |
| \`var < var2\`  | Less than (_in ASCII alphabetical order._)    |
| \`var > var2\`  | Greater than (_in ASCII alphabetical order._) |

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# ARITHMETIC OPERATORS

## Assignment

| Operators | What does it do?                              |
| --------- | --------------------------------------------- |
| \`=\`       | Initialize or change the value of a variable. |

## Arithmetic

| Operators | What does it do?                                |
| --------- | ----------------------------------------------- |
| \`+\`       | Addition                                        |
| \`-\`       | Subtraction                                     |
| \`*\`       | Multiplication                                  |
| \`/\`       | Division                                        |
| \`**\`      | Exponentiation                                  |
| \`%\`       | Modulo                                          |
| \`+=\`      | Plus-Equal (_Increment a variable._)            |
| \`-=\`      | Minus-Equal (_Decrement a variable._)           |
| \`*=\`      | Times-Equal (_Multiply a variable._)            |
| \`/=\`      | Slash-Equal (_Divide a variable._)              |
| \`%=\`      | Mod-Equal (_Remainder of dividing a variable._) |

## Bitwise

| Operators | What does it do?    |
| --------- | ------------------- |
| \`<<\`      | Bitwise Left Shift  |
| \`<<=\`     | Left-Shift-Equal    |
| \`>>\`      | Bitwise Right Shift |
| \`>>=\`     | Right-Shift-Equal   |
| \`&\`       | Bitwise AND         |
| \`&=\`      | Bitwise AND-Equal   |
| \`\\|\`      | Bitwise OR          |
| \`\\|=\`     | Bitwise OR-Equal    |
| \`~\`       | Bitwise NOT         |
| \`^\`       | Bitwise XOR         |
| \`^=\`      | Bitwise XOR-Equal   |

## Logical

| Operators | What does it do? |
| --------- | ---------------- |
| \`!\`       | NOT              |
| \`&&\`      | AND              |
| \`\\|\\|\`    | OR               |

## Miscellaneous

| Operators | What does it do? | Example           |
| --------- | ---------------- | ----------------- |
| \`,\`       | Comma Separator  | \`((a=1,b=2,c=3))\` |

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# ARITHMETIC

## Simpler syntax to set variables

\`\`\`shell
# Simple math
((var=1+2))

# Decrement/Increment variable
((var++))
((var--))
((var+=1))
((var-=1))

# Using variables
((var=var2*arr[2]))
\`\`\`

## Ternary Tests

\`\`\`shell
# Set the value of var to var2 if var2 is greater than var.
# var: variable to set.
# var2>var: Condition to test.
# ?var2: If the test succeeds.
# :var: If the test fails.
((var=var2>var?var2:var))
\`\`\`

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# TRAPS

Traps allow a script to execute code on various signals. In [pxltrm](https://github.com/dylanaraps/pxltrm) (_a pixel art editor written in bash_) traps are used to redraw the user interface on window resize. Another use case is cleaning up temporary files on script exit.

Traps should be added near the start of scripts so any early errors are also caught.

**NOTE:** For a full list of signals, see \`trap -l\`.

## Do something on script exit

\`\`\`shell
# Clear screen on script exit.
trap 'printf \\\\e[2J\\\\e[H\\\\e[m' EXIT
\`\`\`

## Ignore terminal interrupt (CTRL+C, SIGINT)

\`\`\`shell
trap '' INT
\`\`\`

## React to window resize

\`\`\`shell
# Call a function on window resize.
trap 'code_here' SIGWINCH
\`\`\`

## Do something before every command

\`\`\`shell
trap 'code_here' DEBUG
\`\`\`

## Do something when a shell function or a sourced file finishes executing

\`\`\`shell
trap 'code_here' RETURN
\`\`\`

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# PERFORMANCE

## Disable Unicode

If unicode is not required, it can be disabled for a performance increase. Results may vary however there have been noticeable improvements in [neofetch](https://github.com/dylanaraps/neofetch) and other programs.

\`\`\`shell
# Disable unicode.
LC_ALL=C
LANG=C
\`\`\`

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# OBSOLETE SYNTAX

## Shebang

Use \`#!/usr/bin/env bash\` instead of \`#!/bin/bash\`.

- The former searches the user's \`PATH\` to find the \`bash\` binary.
- The latter assumes it is always installed to \`/bin/\` which can cause issues.

**NOTE**: There are times when one may have a good reason for using \`#!/bin/bash\` or another direct path to the binary.

\`\`\`shell
# Right:

    #!/usr/bin/env bash

# Less right:

    #!/bin/bash
\`\`\`

## Command Substitution

Use \`$()\` instead of \`\` \` \` \`\`.

\`\`\`shell
# Right.
var="$(command)"

# Wrong.
var=\`command\`

# $() can easily be nested whereas \`\` cannot.
var="$(command "$(command)")"
\`\`\`

## Function Declaration

Do not use the \`function\` keyword, it reduces compatibility with older versions of \`bash\`.

\`\`\`shell
# Right.
do_something() {
    # ...
}

# Wrong.
function do_something() {
    # ...
}
\`\`\`

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# INTERNAL VARIABLES

## Get the location to the \`bash\` binary

\`\`\`shell
"$BASH"
\`\`\`

## Get the version of the current running \`bash\` process

\`\`\`shell
# As a string.
"$BASH_VERSION"

# As an array.
"\${BASH_VERSINFO[@]}"
\`\`\`

## Open the user's preferred text editor

\`\`\`shell
"$EDITOR" "$file"

# NOTE: This variable may be empty, set a fallback value.
"\${EDITOR:-vi}" "$file"
\`\`\`

## Get the name of the current function

\`\`\`shell
# Current function.
"\${FUNCNAME[0]}"

# Parent function.
"\${FUNCNAME[1]}"

# So on and so forth.
"\${FUNCNAME[2]}"
"\${FUNCNAME[3]}"

# All functions including parents.
"\${FUNCNAME[@]}"
\`\`\`

## Get the host-name of the system

\`\`\`shell
"$HOSTNAME"

# NOTE: This variable may be empty.
# Optionally set a fallback to the hostname command.
"\${HOSTNAME:-$(hostname)}"
\`\`\`

## Get the architecture of the Operating System

\`\`\`shell
"$HOSTTYPE"
\`\`\`

## Get the name of the Operating System / Kernel

This can be used to add conditional support for different Operating
Systems without needing to call \`uname\`.

\`\`\`shell
"$OSTYPE"
\`\`\`

## Get the current working directory

This is an alternative to the \`pwd\` built-in.

\`\`\`shell
"$PWD"
\`\`\`

## Get the number of seconds the script has been running

\`\`\`shell
"$SECONDS"
\`\`\`

## Get a pseudorandom integer

Each time \`$RANDOM\` is used, a different integer between \`0\` and \`32767\` is returned. This variable should not be used for anything related to security (_this includes encryption keys etc_).

\`\`\`shell
"$RANDOM"
\`\`\`

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# INFORMATION ABOUT THE TERMINAL

## Get the terminal size in lines and columns (_from a script_)

This is handy when writing scripts in pure bash and \`stty\`/\`tput\` can’t be
called.

**Example Function:**

\`\`\`sh
get_term_size() {
    # Usage: get_term_size

    # (:;:) is a micro sleep to ensure the variables are
    # exported immediately.
    shopt -s checkwinsize; (:;:)
    printf '%s\\n' "$LINES $COLUMNS"
}
\`\`\`

**Example Usage:**

\`\`\`shell
# Output: LINES COLUMNS
$ get_term_size
15 55
\`\`\`

## Get the terminal size in pixels

**CAVEAT**: This does not work in some terminal emulators.

**Example Function:**

\`\`\`sh
get_window_size() {
    # Usage: get_window_size
    printf '%b' "\${TMUX:+\\\\ePtmux;\\\\e}\\\\e[14t\${TMUX:+\\\\e\\\\\\\\}"
    IFS=';t' read -d t -t 0.05 -sra term_size
    printf '%s\\n' "\${term_size[1]}x\${term_size[2]}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
# Output: WIDTHxHEIGHT
$ get_window_size
1200x800

# Output (fail):
$ get_window_size
x
\`\`\`

## Get the current cursor position

This is useful when creating a TUI in pure bash.

**Example Function:**

\`\`\`sh
get_cursor_pos() {
    # Usage: get_cursor_pos
    IFS='[;' read -p $'\\e[6n' -d R -rs _ y x _
    printf '%s\\n' "$x $y"
}
\`\`\`

**Example Usage:**

\`\`\`shell
# Output: X Y
$ get_cursor_pos
1 8
\`\`\`

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# CONVERSION

## Convert a hex color to RGB

**Example Function:**

\`\`\`sh
hex_to_rgb() {
    # Usage: hex_to_rgb "#FFFFFF"
    #        hex_to_rgb "000000"
    : "\${1/\\#}"
    ((r=16#\${_:0:2},g=16#\${_:2:2},b=16#\${_:4:2}))
    printf '%s\\n' "$r $g $b"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ hex_to_rgb "#FFFFFF"
255 255 255
\`\`\`

## Convert an RGB color to hex

**Example Function:**

\`\`\`sh
rgb_to_hex() {
    # Usage: rgb_to_hex "r" "g" "b"
    printf '#%02x%02x%02x\\n' "$1" "$2" "$3"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ rgb_to_hex "255" "255" "255"
#FFFFFF
\`\`\`

# CODE GOLF

## Shorter \`for\` loop syntax

\`\`\`shell
# Tiny C Style.
for((;i++<10;)){ echo "$i";}

# Undocumented method.
for i in {1..10};{ echo "$i";}

# Expansion.
for i in {1..10}; do echo "$i"; done

# C Style.
for((i=0;i<=10;i++)); do echo "$i"; done
\`\`\`

## Shorter infinite loops

\`\`\`shell
# Normal method
while :; do echo hi; done

# Shorter
for((;;)){ echo hi;}
\`\`\`

## Shorter function declaration

\`\`\`shell
# Normal method
f(){ echo hi;}

# Using a subshell
f()(echo hi)

# Using arithmetic
# This can be used to assign integer values.
# Example: f a=1
#          f a++
f()(($1))

# Using tests, loops etc.
# NOTE: ‘while’, ‘until’, ‘case’, ‘(())’, ‘[[]]’ can also be used.
f()if true; then echo "$1"; fi
f()for i in "$@"; do echo "$i"; done
\`\`\`

## Shorter \`if\` syntax

\`\`\`shell
# One line
# Note: The 3rd statement may run when the 1st is true
[[ $var == hello ]] && echo hi || echo bye
[[ $var == hello ]] && { echo hi; echo there; } || echo bye

# Multi line (no else, single statement)
# Note: The exit status may not be the same as with an if statement
[[ $var == hello ]] &&
    echo hi

# Multi line (no else)
[[ $var == hello ]] && {
    echo hi
    # ...
}
\`\`\`

## Simpler \`case\` statement to set variable

The \`:\` built-in can be used to avoid repeating \`variable=\` in a case statement. The \`$_\` variable stores the last argument of the last command. \`:\` always succeeds so it can be used to store the variable value.

\`\`\`shell
# Modified snippet from Neofetch.
case "$OSTYPE" in
    "darwin"*)
        : "MacOS"
    ;;

    "linux"*)
        : "Linux"
    ;;

    *"bsd"* | "dragonfly" | "bitrig")
        : "BSD"
    ;;

    "cygwin" | "msys" | "win32")
        : "Windows"
    ;;

    *)
        printf '%s\\n' "Unknown OS detected, aborting..." >&2
        exit 1
    ;;
esac

# Finally, set the variable.
os="$_"
\`\`\`

<!-- CHAPTER END -->

<!-- CHAPTER START -->

# OTHER

## Use \`read\` as an alternative to the \`sleep\` command

Surprisingly, \`sleep\` is an external command and not a \`bash\` built-in.

**CAVEAT:** Requires \`bash\` 4+

**Example Function:**

\`\`\`sh
read_sleep() {
    # Usage: read_sleep 1
    #        read_sleep 0.2
    read -rt "$1" <> <(:) || :
}
\`\`\`

**Example Usage:**

\`\`\`shell
read_sleep 1
read_sleep 0.1
read_sleep 30
\`\`\`

For performance-critical situations, where it is not economic to open and close an excessive number of file descriptors, the allocation of a file descriptor may be done only once for all invocations of \`read\`:

(See the generic original implementation at https://blog.dhampir.no/content/sleeping-without-a-subprocess-in-bash-and-how-to-sleep-forever)

\`\`\`shell
exec {sleep_fd}<> <(:)
while some_quick_test; do
    # equivalent of sleep 0.001
    read -t 0.001 -u $sleep_fd
done
\`\`\`

## Check if a program is in the user's PATH

\`\`\`shell
# There are 3 ways to do this and either one can be used.
type -p executable_name &>/dev/null
hash executable_name &>/dev/null
command -v executable_name &>/dev/null

# As a test.
if type -p executable_name &>/dev/null; then
    # Program is in PATH.
fi

# Inverse.
if ! type -p executable_name &>/dev/null; then
    # Program is not in PATH.
fi

# Example (Exit early if program is not installed).
if ! type -p convert &>/dev/null; then
    printf '%s\\n' "error: convert is not installed, exiting..."
    exit 1
fi
\`\`\`

## Get the current date using \`strftime\`

Bash’s \`printf\` has a built-in method of getting the date which can be used in place of the \`date\` command.

**CAVEAT:** Requires \`bash\` 4+

**Example Function:**

\`\`\`sh
date() {
    # Usage: date "format"
    # See: 'man strftime' for format.
    printf "%($1)T\\\\n" "-1"
}
\`\`\`

**Example Usage:**

\`\`\`shell
# Using above function.
$ date "%a %d %b  - %l:%M %p"
Fri 15 Jun  - 10:00 AM

# Using printf directly.
$ printf '%(%a %d %b  - %l:%M %p)T\\n' "-1"
Fri 15 Jun  - 10:00 AM

# Assigning a variable using printf.
$ printf -v date '%(%a %d %b  - %l:%M %p)T\\n' '-1'
$ printf '%s\\n' "$date"
Fri 15 Jun  - 10:00 AM
\`\`\`

## Get the username of the current user

**CAVEAT:** Requires \`bash\` 4.4+

\`\`\`shell
$ : \\\\u
# Expand the parameter as if it were a prompt string.
$ printf '%s\\n' "\${_@P}"
black
\`\`\`

## Generate a UUID V4

**CAVEAT**: The generated value is not cryptographically secure.

**Example Function:**

\`\`\`sh
uuid() {
    # Usage: uuid
    C="89ab"

    for ((N=0;N<16;++N)); do
        B="$((RANDOM%256))"

        case "$N" in
            6)  printf '4%x' "$((B%16))" ;;
            8)  printf '%c%x' "\${C:$RANDOM%\${#C}:1}" "$((B%16))" ;;

            3|5|7|9)
                printf '%02x-' "$B"
            ;;

            *)
                printf '%02x' "$B"
            ;;
        esac
    done

    printf '\\n'
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ uuid
d5b6c731-1310-4c24-9fe3-55d556d44374
\`\`\`

## Progress bars

This is a simple way of drawing progress bars without needing a for loop
in the function itself.

**Example Function:**

\`\`\`sh
bar() {
    # Usage: bar 1 10
    #            ^----- Elapsed Percentage (0-100).
    #               ^-- Total length in chars.
    ((elapsed=$1*$2/100))

    # Create the bar with spaces.
    printf -v prog  "%\${elapsed}s"
    printf -v total "%$(($2-elapsed))s"

    printf '%s\\r' "[\${prog// /-}\${total}]"
}
\`\`\`

**Example Usage:**

\`\`\`shell
for ((i=0;i<=100;i++)); do
    # Pure bash micro sleeps (for the example).
    (:;:) && (:;:) && (:;:) && (:;:) && (:;:)

    # Print the bar.
    bar "$i" "10"
done

printf '\\n'
\`\`\`

## Get the list of functions in a script

\`\`\`sh
get_functions() {
    # Usage: get_functions
    IFS=$'\\n' read -d "" -ra functions < <(declare -F)
    printf '%s\\n' "\${functions[@]//declare -f }"
}
\`\`\`

## Bypass shell aliases

\`\`\`shell
# alias
ls

# command
# shellcheck disable=SC1001
\\ls
\`\`\`

## Bypass shell functions

\`\`\`shell
# function
ls

# command
command ls
\`\`\`

## Run a command in the background

This will run the given command and keep it running, even after the terminal or SSH connection is terminated. All output is ignored.

\`\`\`sh
bkr() {
    (nohup "$@" &>/dev/null &)
}

bkr ./some_script.sh # some_script.sh is now running in the background
\`\`\`

## Capture the return value of a function without command substitution

**CAVEAT:** Requires \`bash\` 4+

This uses local namerefs to avoid using \`var=$(some_func)\` style command substitution for function output capture.

\`\`\`sh
to_upper() {
  local -n ptr=\${1}

  ptr=\${ptr^^}
}

foo="bar"
to_upper foo
printf "%s\\n" "\${foo}" # BAR
\`\`\`

<!-- CHAPTER END -->
`,pn=`<p align="center"><b>Also see: <a href="https://github.com/dylanaraps/pure-bash-bible">pure bash bible (📖 A collection of pure bash alternatives to external processes).</a></b></p>

<br>

<p align="center"><img src="https://user-images.githubusercontent.com/6799467/65238742-e0ba4c80-dacc-11e9-9c2a-3dd20a6f138d.png" width="300px"></p>
<h1 align="center">pure sh bible</h1> <p
align="center">A collection of pure POSIX sh alternatives to external processes.</p><br><br>

<img src="https://user-images.githubusercontent.com/6799467/65239338-4eb34380-dace-11e9-8fe2-7b5e28f1bced.png" width="40%" align="right">

The goal of this book is to document commonly-known and lesser-known methods of doing various tasks using only built-in POSIX \`sh\` features. Using the snippets from this bible can help remove unneeded dependencies from scripts and in most cases make them faster. I came across these tips and discovered a few while developing [KISS Linux](https://kisslinux.xyz/) and other smaller projects.

The snippets below are all linted using \`shellcheck\`.

See something incorrectly described, buggy or outright wrong? Open an issue or send a pull request. If the bible is missing something, open an issue and a solution will be found.

- Leanpub book: (*coming soon*)
- Buy me a coffee: <a href="https://www.patreon.com/dyla"><img src="https://img.shields.io/badge/donate-patreon-yellow.svg"> </a>

<br>

# Table of Contents

<!-- vim-markdown-toc GFM -->

* [STRINGS](#strings)
    * [Strip pattern from start of string](#strip-pattern-from-start-of-string)
    * [Strip pattern from end of string](#strip-pattern-from-end-of-string)
    * [Trim leading and trailing white-space from string](#trim-leading-and-trailing-white-space-from-string)
    * [Trim all white-space from string and truncate spaces](#trim-all-white-space-from-string-and-truncate-spaces)
    * [Check if string contains a sub-string](#check-if-string-contains-a-sub-string)
    * [Check if string starts with sub-string](#check-if-string-starts-with-sub-string)
    * [Check if string ends with sub-string](#check-if-string-ends-with-sub-string)
    * [Split a string on a delimiter](#split-a-string-on-a-delimiter)
    * [Trim quotes from a string](#trim-quotes-from-a-string)
* [FILES](#files)
    * [Parsing a \`key=val\` file.](#parsing-a-keyval-file)
    * [Get the first N lines of a file](#get-the-first-n-lines-of-a-file)
    * [Get the number of lines in a file](#get-the-number-of-lines-in-a-file)
    * [Count files or directories in directory](#count-files-or-directories-in-directory)
    * [Create an empty file](#create-an-empty-file)
* [FILE PATHS](#file-paths)
    * [Get the directory name of a file path](#get-the-directory-name-of-a-file-path)
    * [Get the base-name of a file path](#get-the-base-name-of-a-file-path)
* [LOOPS](#loops)
    * [Loop over a (*small*) range of numbers](#loop-over-a-small-range-of-numbers)
    * [Loop over a variable range of numbers](#loop-over-a-variable-range-of-numbers)
    * [Loop over the contents of a file](#loop-over-the-contents-of-a-file)
    * [Loop over files and directories](#loop-over-files-and-directories)
* [VARIABLES](#variables)
    * [Name a variable based on another variable](#name-a-variable-based-on-another-variable)
* [ESCAPE SEQUENCES](#escape-sequences)
    * [Text Colors](#text-colors)
    * [Text Attributes](#text-attributes)
    * [Cursor Movement](#cursor-movement)
    * [Erasing Text](#erasing-text)
* [PARAMETER EXPANSION](#parameter-expansion)
    * [Prefix and Suffix Deletion](#prefix-and-suffix-deletion)
    * [Length](#length)
    * [Default Value](#default-value)
* [CONDITIONAL EXPRESSIONS](#conditional-expressions)
    * [File Conditionals](#file-conditionals)
    * [Variable Conditionals](#variable-conditionals)
    * [Variable Comparisons](#variable-comparisons)
* [ARITHMETIC OPERATORS](#arithmetic-operators)
    * [Assignment](#assignment)
    * [Arithmetic](#arithmetic)
    * [Bitwise](#bitwise)
    * [Logical](#logical)
    * [Miscellaneous](#miscellaneous)
* [ARITHMETIC](#arithmetic-1)
    * [Ternary Tests](#ternary-tests)
    * [Check if a number is a float](#check-if-a-number-is-a-float)
    * [Check if a number is an integer](#check-if-a-number-is-an-integer)
* [TRAPS](#traps)
    * [Do something on script exit](#do-something-on-script-exit)
    * [Ignore terminal interrupt (CTRL+C, SIGINT)](#ignore-terminal-interrupt-ctrlc-sigint)
* [OBSOLETE SYNTAX](#obsolete-syntax)
    * [Command Substitution](#command-substitution)
* [INTERNAL AND ENVIRONMENT VARIABLES](#internal-and-environment-variables)
    * [Open the user's preferred text editor](#open-the-users-preferred-text-editor)
    * [Get the current working directory](#get-the-current-working-directory)
    * [Get the PID of the current shell](#get-the-pid-of-the-current-shell)
    * [Get the current shell options](#get-the-current-shell-options)
* [AFTERWORD](#afterword)

<!-- vim-markdown-toc -->


# STRINGS

## Strip pattern from start of string

**Example Function:**

\`\`\`sh
lstrip() {
    # Usage: lstrip "string" "pattern"
    printf '%s\\n' "\${1##$2}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ lstrip "The Quick Brown Fox" "The "
Quick Brown Fox
\`\`\`

## Strip pattern from end of string

**Example Function:**

\`\`\`sh
rstrip() {
    # Usage: rstrip "string" "pattern"
    printf '%s\\n' "\${1%%$2}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ rstrip "The Quick Brown Fox" " Fox"
The Quick Brown
\`\`\`

## Trim leading and trailing white-space from string

This is an alternative to \`sed\`, \`awk\`, \`perl\` and other tools. The
function below works by finding all leading and trailing white-space and
removing it from the start and end of the string.

**Example Function:**

\`\`\`sh
trim_string() {
    # Usage: trim_string "   example   string    "

    # Remove all leading white-space.
    # '\${1%%[![:space:]]*}': Strip everything but leading white-space.
    # '\${1#\${XXX}}': Remove the white-space from the start of the string.
    trim=\${1#\${1%%[![:space:]]*}}

    # Remove all trailing white-space.
    # '\${trim##*[![:space:]]}': Strip everything but trailing white-space.
    # '\${trim%\${XXX}}': Remove the white-space from the end of the string.
    trim=\${trim%\${trim##*[![:space:]]}}

    printf '%s\\n' "$trim"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ trim_string "    Hello,  World    "
Hello,  World

$ name="   John Black  "
$ trim_string "$name"
John Black
\`\`\`

## Trim all white-space from string and truncate spaces

This is an alternative to \`sed\`, \`awk\`, \`perl\` and other tools. The
function below works by abusing word splitting to create a new string
without leading/trailing white-space and with truncated spaces.

**Example Function:**

\`\`\`sh
# shellcheck disable=SC2086,SC2048
trim_all() {
    # Usage: trim_all "   example   string    "

    # Disable globbing to make the word-splitting below safe.
    set -f

    # Set the argument list to the word-splitted string.
    # This removes all leading/trailing white-space and reduces
    # all instances of multiple spaces to a single ("  " -> " ").
    set -- $*

    # Print the argument list as a string.
    printf '%s\\n' "$*"

    # Re-enable globbing.
    set +f
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ trim_all "    Hello,    World    "
Hello, World

$ name="   John   Black  is     my    name.    "
$ trim_all "$name"
John Black is my name.
\`\`\`

## Check if string contains a sub-string

**Using a case statement:**

\`\`\`shell
case $var in
    *sub_string1*)
        # Do stuff
    ;;

    *sub_string2*)
        # Do other stuff
    ;;

    *)
        # Else
    ;;
esac
\`\`\`

## Check if string starts with sub-string

**Using a case statement:**

\`\`\`shell
case $var in
    sub_string1*)
        # Do stuff
    ;;

    sub_string2*)
        # Do other stuff
    ;;

    *)
        # Else
    ;;
esac
\`\`\`

## Check if string ends with sub-string

**Using a case statement:**

\`\`\`shell
case $var in
    *sub_string1)
        # Do stuff
    ;;

    *sub_string2)
        # Do other stuff
    ;;

    *)
        # Else
    ;;
esac
\`\`\`

## Split a string on a delimiter

This is an alternative to \`cut\`, \`awk\` and other tools.

**Example Function:**

\`\`\`sh
split() {
    # Disable globbing.
    # This ensures that the word-splitting is safe.
    set -f

    # Store the current value of 'IFS' so we
    # can restore it later.
    old_ifs=$IFS

    # Change the field separator to what we're
    # splitting on.
    IFS=$2

    # Create an argument list splitting at each
    # occurance of '$2'.
    #
    # This is safe to disable as it just warns against
    # word-splitting which is the behavior we expect.
    # shellcheck disable=2086
    set -- $1

    # Print each list value on its own line.
    printf '%s\\n' "$@"

    # Restore the value of 'IFS'.
    IFS=$old_ifs

    # Re-enable globbing.
    set +f
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ split "apples,oranges,pears,grapes" ","
apples
oranges
pears
grapes

$ split "1, 2, 3, 4, 5" ", "
1
2
3
4
5
\`\`\`

## Trim quotes from a string

**Example Function:**

\`\`\`sh
trim_quotes() {
    # Usage: trim_quotes "string"

    # Disable globbing.
    # This makes the word-splitting below safe.
    set -f

    # Store the current value of 'IFS' so we
    # can restore it later.
    old_ifs=$IFS

    # Set 'IFS' to ["'].
    IFS=\\"\\'

    # Create an argument list, splitting the
    # string at ["'].
    #
    # Disable this shellcheck error as it only
    # warns about word-splitting which we expect.
    # shellcheck disable=2086
    set -- $1

    # Set 'IFS' to blank to remove spaces left
    # by the removal of ["'].
    IFS=

    # Print the quote-less string.
    printf '%s\\n' "$*"

    # Restore the value of 'IFS'.
    IFS=$old_ifs

    # Re-enable globbing.
    set +f
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ var="'Hello', \\"World\\""
$ trim_quotes "$var"
Hello, World
\`\`\`

# FILES

## Parsing a \`key=val\` file.

This could be used to parse a simple \`key=value\` configuration file.

\`\`\`shell
# Setting 'IFS' tells 'read' where to split the string.
while IFS='=' read -r key val; do
    # Skip over lines containing comments.
    # (Lines starting with '#').
    [ "\${key##\\#*}" ] || continue

    # '$key' stores the key.
    # '$val' stores the value.
    printf '%s: %s\\n' "$key" "$val"

    # Alternatively replacing 'printf' with the following
    # populates variables called '$key' with the value of '$val'.
    #
    # NOTE: I would extend this with a check to ensure 'key' is
    #       a valid variable name.
    # export "$key=$val"
    #
    # Example with error handling:
    # export "$key=$val" 2>/dev/null ||
    #     printf 'warning %s is not a valid variable name\\n' "$key"
done < "file"
\`\`\`

## Get the first N lines of a file

Alternative to the \`head\` command.

**Example Function:**

\`\`\`sh
head() {
    # Usage: head "n" "file"
    while IFS= read -r line; do
        printf '%s\\n' "$line"
        i=$((i+1))
        [ "$i" = "$1" ] && return
    done < "$2"

    # 'read' used in a loop will skip over
    # the last line of a file if it does not contain
    # a newline and instead contains EOF.
    #
    # The final line iteration is skipped as 'read'
    # exits with '1' when it hits EOF. 'read' however,
    # still populates the variable.
    #
    # This ensures that the final line is always printed
    # if applicable.
    [ -n "$line" ] && printf %s "$line"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ head 2 ~/.bashrc
# Prompt
PS1='➜ '

$ head 1 ~/.bashrc
# Prompt
\`\`\`

## Get the number of lines in a file

Alternative to \`wc -l\`.

**Example Function:**

\`\`\`sh
lines() {
    # Usage: lines "file"

    # '|| [ -n "$line" ]': This ensures that lines
    # ending with EOL instead of a newline are still
    # operated on in the loop.
    #
    # 'read' exits with '1' when it sees EOL and
    # without the added test, the line isn't sent
    # to the loop.
    while IFS= read -r line || [ -n "$line" ]; do
        lines=$((lines+1))
    done < "$1"

    printf '%s\\n' "$lines"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ lines ~/.bashrc
48
\`\`\`

## Count files or directories in directory

This works by passing the output of the glob to the function and then counting the number of arguments.

**Example Function:**

\`\`\`sh
count() {
    # Usage: count /path/to/dir/*
    #        count /path/to/dir/*/
    [ -e "$1" ] \\
        && printf '%s\\n' "$#" \\
        || printf '%s\\n' 0
}
\`\`\`

**Example Usage:**

\`\`\`shell
# Count all files in dir.
$ count ~/Downloads/*
232

# Count all dirs in dir.
$ count ~/Downloads/*/
45

# Count all jpg files in dir.
$ count ~/Pictures/*.jpg
64
\`\`\`

## Create an empty file

Alternative to \`touch\`.

\`\`\`shell
:>file

# OR (shellcheck warns for this)
>file
\`\`\`

# FILE PATHS

## Get the directory name of a file path

Alternative to the \`dirname\` command.

**Example Function:**

\`\`\`sh
dirname() {
    # Usage: dirname "path"

    # If '$1' is empty set 'dir' to '.', else '$1'.
    dir=\${1:-.}

    # Strip all trailing forward-slashes '/' from
    # the end of the string.
    #
    # "\${dir##*[!/]}": Remove all non-forward-slashes
    # from the start of the string, leaving us with only
    # the trailing slashes.
    # "\${dir%%"\${}"}": Remove the result of the above
    # substitution (a string of forward slashes) from the
    # end of the original string.
    dir=\${dir%%"\${dir##*[!/]}"}

    # If the variable *does not* contain any forward slashes
    # set its value to '.'.
    [ "\${dir##*/*}" ] && dir=.

    # Remove everything *after* the last forward-slash '/'.
    dir=\${dir%/*}

    # Again, strip all trailing forward-slashes '/' from
    # the end of the string (see above).
    dir=\${dir%%"\${dir##*[!/]}"}

    # Print the resulting string and if it is empty,
    # print '/'.
    printf '%s\\n' "\${dir:-/}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ dirname ~/Pictures/Wallpapers/1.jpg
/home/black/Pictures/Wallpapers/

$ dirname ~/Pictures/Downloads/
/home/black/Pictures/
\`\`\`

## Get the base-name of a file path

Alternative to the \`basename\` command.

**Example Function:**

\`\`\`sh
basename() {
    # Usage: basename "path" ["suffix"]

    # Strip all trailing forward-slashes '/' from
    # the end of the string.
    #
    # "\${1##*[!/]}": Remove all non-forward-slashes
    # from the start of the string, leaving us with only
    # the trailing slashes.
    # "\${1%%"\${}"}:  Remove the result of the above
    # substitution (a string of forward slashes) from the
    # end of the original string.
    dir=\${1%\${1##*[!/]}}

    # Remove everything before the final forward-slash '/'.
    dir=\${dir##*/}

    # If a suffix was passed to the function, remove it from
    # the end of the resulting string.
    dir=\${dir%"$2"}

    # Print the resulting string and if it is empty,
    # print '/'.
    printf '%s\\n' "\${dir:-/}"
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ basename ~/Pictures/Wallpapers/1.jpg
1.jpg

$ basename ~/Pictures/Wallpapers/1.jpg .jpg
1

$ basename ~/Pictures/Downloads/
Downloads
\`\`\`

# LOOPS

## Loop over a (*small*) range of numbers

Alternative to \`seq\` and only suitable for small and static number ranges. The number list can also be replaced with a list of words, variables etc.

\`\`\`shell
# Loop from 0-10.
for i in 0 1 2 3 4 5 6 7 8 9 10; do
    printf '%s\\n' "$i"
done
\`\`\`

## Loop over a variable range of numbers

Alternative to \`seq\`.

\`\`\`shell
# Loop from var-var.
start=0
end=50

while [ "$start" -le "$end" ]; do
    printf '%s\\n' "$start"
    start=$((start+1))
done
\`\`\`

## Loop over the contents of a file

\`\`\`shell
while IFS= read -r line || [ -n "$line" ]; do
    printf '%s\\n' "$line"
done < "file"
\`\`\`

## Loop over files and directories

Don’t use \`ls\`.

**CAVEAT:** When the glob does not match anything (empty directory or no matching files) the variable will contain the unexpanded glob. To avoid working on unexpanded globs check the existence of the file contained in the variable using the appropriate [file conditional](#file-conditionals). Be aware that symbolic links are resolved.

\`\`\`shell
# Greedy example.
for file in *; do
    [ -e "$file" ] || [ -L "$file" ] || continue
    printf '%s\\n' "$file"
done

# PNG files in dir.
for file in ~/Pictures/*.png; do
    [ -f "$file" ] || continue
    printf '%s\\n' "$file"
done

# Iterate over directories.
for dir in ~/Downloads/*/; do
    [ -d "$dir" ] || continue
    printf '%s\\n' "$dir"
done
\`\`\`

# VARIABLES

## Name and access a variable based on another variable

\`\`\`shell
$ var="world"
$ eval "hello_$var=value"
$ eval printf '%s\\n' "\\$hello_$var"
value
\`\`\`

# ESCAPE SEQUENCES

Contrary to popular belief, there is no issue in utilizing raw escape sequences. Using \`tput\` abstracts the same ANSI sequences as if printed manually. Worse still, \`tput\` is not actually portable. There are a number of \`tput\` variants each with different commands and syntaxes (*try \`tput setaf 3\` on a FreeBSD system*). Raw sequences are fine.

## Text Colors

**NOTE:** Sequences requiring RGB values only work in True-Color Terminal Emulators.

| Sequence | What does it do? | Value |
| -------- | ---------------- | ----- |
| \`\\033[38;5;<NUM>m\` | Set text foreground color. | \`0-255\`
| \`\\033[48;5;<NUM>m\` | Set text background color. | \`0-255\`
| \`\\033[38;2;<R>;<G>;<B>m\` | Set text foreground color to RGB color. | \`R\`, \`G\`, \`B\`
| \`\\033[48;2;<R>;<G>;<B>m\` | Set text background color to RGB color. | \`R\`, \`G\`, \`B\`

## Text Attributes

| Sequence | What does it do? |
| -------- | ---------------- |
| \`\\033[m\`  | Reset text formatting and colors.
| \`\\033[1m\` | Bold text. |
| \`\\033[2m\` | Faint text. |
| \`\\033[3m\` | Italic text. |
| \`\\033[4m\` | Underline text. |
| \`\\033[5m\` | Slow blink. |
| \`\\033[7m\` | Swap foreground and background colors. |
| \`\\033[8m\` | Hidden text. |
| \`\\033[9m\` | Strike-through text. |


## Cursor Movement

| Sequence | What does it do? | Value |
| -------- | ---------------- | ----- |
| \`\\033[<LINE>;<COLUMN>H\` | Move cursor to absolute position. | \`line\`, \`column\`
| \`\\033[H\` | Move cursor to home position (\`0,0\`). |
| \`\\033[<NUM>A\` | Move cursor up N lines. | \`num\`
| \`\\033[<NUM>B\` | Move cursor down N lines. | \`num\`
| \`\\033[<NUM>C\` | Move cursor right N columns. | \`num\`
| \`\\033[<NUM>D\` | Move cursor left N columns. | \`num\`
| \`\\033[s\` | Save cursor position. |
| \`\\033[u\` | Restore cursor position. |


## Erasing Text

| Sequence | What does it do? |
| -------- | ---------------- |
| \`\\033[K\` | Erase from cursor position to end of line.
| \`\\033[1K\` | Erase from cursor position to start of line.
| \`\\033[2K\` | Erase the entire current line.
| \`\\033[J\` | Erase from the current line to the bottom of the screen.
| \`\\033[1J\` | Erase from the current line to the top of the screen.
| \`\\033[2J\` | Clear the screen.
| \`\\033[2J\\033[H\` | Clear the screen and move cursor to \`0,0\`.


# PARAMETER EXPANSION

## Prefix and Suffix Deletion

| Parameter | What does it do? |
| --------- | ---------------- |
| \`\${VAR#PATTERN}\` | Remove shortest match of pattern from start of string. |
| \`\${VAR##PATTERN}\` | Remove longest match of pattern from start of string. |
| \`\${VAR%PATTERN}\` | Remove shortest match of pattern from end of string. |
| \`\${VAR%%PATTERN}\` | Remove longest match of pattern from end of string. |

## Length

| Parameter | What does it do? |
| --------- | ---------------- |
| \`\${#VAR}\` | Length of var in characters.

## Default Value

| Parameter | What does it do? |
| --------- | ---------------- |
| \`\${VAR:-STRING}\` | If \`VAR\` is empty or unset, use \`STRING\` as its value.
| \`\${VAR-STRING}\` | If \`VAR\` is unset, use \`STRING\` as its value.
| \`\${VAR:=STRING}\` | If \`VAR\` is empty or unset, set the value of \`VAR\` to \`STRING\`.
| \`\${VAR=STRING}\` | If \`VAR\` is unset, set the value of \`VAR\` to \`STRING\`.
| \`\${VAR:+STRING}\` | If \`VAR\` is not empty, use \`STRING\` as its value.
| \`\${VAR+STRING}\` | If \`VAR\` is set, use \`STRING\` as its value.
| \`\${VAR:?STRING}\` | Display an error if empty or unset.
| \`\${VAR?STRING}\` | Display an error if unset.


# CONDITIONAL EXPRESSIONS

For use in \`[ ]\` \`if [ ]; then\` and \`test\`.

## File Conditionals

| Expression | Value  | What does it do? |
| ---------- | ------ | ---------------- |
| \`-b\`       | \`file\` | If file exists and is a block special file.
| \`-c\`       | \`file\` | If file exists and is a character special file.
| \`-d\`       | \`file\` | If file exists and is a directory.
| \`-e\`       | \`file\` | If file exists.
| \`-f\`       | \`file\` | If file exists and is a regular file.
| \`-g\`       | \`file\` | If file exists and its set-group-id bit is set.
| \`-h\`       | \`file\` | If file exists and is a symbolic link.
| \`-p\`       | \`file\` | If file exists and is a named pipe (*FIFO*).
| \`-r\`       | \`file\` | If file exists and is readable.
| \`-s\`       | \`file\` | If file exists and its size is greater than zero.
| \`-t\`       | \`fd\`   | If file descriptor is open and refers to a terminal.
| \`-u\`       | \`file\` | If file exists and its set-user-id bit is set.
| \`-w\`       | \`file\` | If file exists and is writable.
| \`-x\`       | \`file\` | If file exists and is executable.
| \`-L\`       | \`file\` | If file exists and is a symbolic link.
| \`-S\`       | \`file\` | If file exists and is a socket.

## Variable Conditionals

| Expression | Value | What does it do? |
| ---------- | ----- | ---------------- |
| \`-z\`       | \`var\` | If the length of string is zero.
| \`-n\`       | \`var\` | If the length of string is non-zero.

## Variable Comparisons

| Expression | What does it do? |
| ---------- | ---------------- |
| \`var = var2\` | Equal to.
| \`var != var2\` | Not equal to.
| \`var -eq var2\` | Equal to (*algebraically*).
| \`var -ne var2\` | Not equal to (*algebraically*).
| \`var -gt var2\` | Greater than (*algebraically*).
| \`var -ge var2\` | Greater than or equal to (*algebraically*).
| \`var -lt var2\` | Less than (*algebraically*).
| \`var -le var2\` | Less than or equal to (*algebraically*).


# ARITHMETIC OPERATORS

## Assignment

| Operators | What does it do? |
| --------- | ---------------- |
| \`=\`       | Initialize or change the value of a variable.

## Arithmetic

| Operators | What does it do? |
| --------- | ---------------- |
| \`+\` | Addition
| \`-\` | Subtraction
| \`*\` | Multiplication
| \`/\` | Division
| \`%\` | Modulo
| \`+=\` | Plus-Equal (*Increment a variable.*)
| \`-=\` | Minus-Equal (*Decrement a variable.*)
| \`*=\` | Times-Equal (*Multiply a variable.*)
| \`/=\` | Slash-Equal (*Divide a variable.*)
| \`%=\` | Mod-Equal (*Remainder of dividing a variable.*)

## Bitwise

| Operators | What does it do? |
| --------- | ---------------- |
| \`<<\` | Bitwise Left Shift
| \`<<=\` | Left-Shift-Equal
| \`>>\` | Bitwise Right Shift
| \`>>=\` | Right-Shift-Equal
| \`&\` | Bitwise AND
| \`&=\` | Bitwise AND-Equal
| \`\\|\` | Bitwise OR
| \`\\|=\` | Bitwise OR-Equal
| \`~\` | Bitwise NOT
| \`^\` | Bitwise XOR
| \`^=\` | Bitwise XOR-Equal

## Logical

| Operators | What does it do? |
| --------- | ---------------- |
| \`!\` | NOT
| \`&&\` | AND
| \`\\|\\|\` | OR

## Miscellaneous

| Operators | What does it do? | Example |
| --------- | ---------------- | ------- |
| \`,\` | Comma Separator | \`((a=1,b=2,c=3))\`


# ARITHMETIC

## Ternary Tests

\`\`\`shell
# Set the value of var to var2 if var2 is greater than var.
# 'var2 > var': Condition to test.
# '? var2': If the test succeeds.
# ': var': If the test fails.
var=$((var2 > var ? var2 : var))
\`\`\`

## Check if a number is a float

**Example Function:**

\`\`\`sh
is_float() {
    # Usage: is_float "number"

    # The test checks to see that the input contains
    # a '.'. This filters out whole numbers.
    [ -z "\${1##*.*}" ] &&
        printf %f "$1" >/dev/null 2>&1
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ is_float 1 && echo true
$

$ is_float 1.1 && echo true
$ true
\`\`\`

## Check if a number is an integer

**Example Function:**

\`\`\`sh
is_int() {
    # usage: is_int "number"
    printf %d "$1" >/dev/null 2>&1
}
\`\`\`

**Example Usage:**

\`\`\`shell
$ is_int 1 && echo true
$ true

$ is_int 1.1 && echo true
$
\`\`\`

# TRAPS

Traps allow a script to execute code on various signals. In [pxltrm](https://github.com/dylanaraps/pxltrm) (*a pixel art editor written in bash*)  traps are used to redraw the user interface on window resize. Another use case is cleaning up temporary files on script exit.

Traps should be added near the start of scripts so any early errors are also caught.

## Do something on script exit

\`\`\`shell
# Clear screen on script exit.
trap 'printf \\\\033[2J\\\\033[H\\\\033[m' EXIT

# Run a function on script exit.
# 'clean_up' is the name of a function.
trap clean_up EXIT
\`\`\`

## Ignore terminal interrupt (CTRL+C, SIGINT)

\`\`\`shell
trap '' INT
\`\`\`

# OBSOLETE SYNTAX

## Command Substitution

Use \`$()\` instead of \`\` \` \` \`\`.

\`\`\`shell
# Right.
var="$(command)"

# Wrong.
var=\`command\`

# $() can easily be nested whereas \`\` cannot.
var="$(command "$(command)")"
\`\`\`

# INTERNAL AND ENVIRONMENT VARIABLES

## Open the user's preferred text editor

\`\`\`shell
"$EDITOR" "$file"

# NOTE: This variable may be empty, set a fallback value.
"\${EDITOR:-vi}" "$file"
\`\`\`

## Get the current working directory

This is an alternative to the \`pwd\` built-in.

\`\`\`shell
"$PWD"
\`\`\`

## Get the PID of the current shell

\`\`\`
"$$"
\`\`\`

## Get the current shell options

\`\`\`
"$-"
\`\`\`

# AFTERWORD

Thanks for reading! If this bible helped you in any way and you'd like to give back, consider donating. Donations give me the time to make this the best resource possible. Can't donate? That's OK, star the repo and share it with your friends!

<a href="https://www.patreon.com/dyla"><img src="https://img.shields.io/badge/donate-patreon-yellow.svg"></a>


Rock on. 🤘
`,m={};let C=null;function P(n,e){if(m[n]=e,e.type==="folder")for(const[s,t]of Object.entries(e.children)){const a=n+s+(t.type==="folder"?"/":"");P(a,t)}}function R(n){window.dispatchEvent(new CustomEvent("cde-fs-change",{detail:{path:n}}))}function fn(){const n=u.FS.DESKTOP+"readme.md",e=m[n];e?.type==="file"&&(e.content=mn);const s=u.FS.HOME+"man-pages/linux-bible.md",t=m[s];if(t?.type==="file"){let d=`# Linux Commands Reference

`;M.forEach((T,v)=>{d+=`
${"=".repeat(60)}
`,d+=`SEQUENCE ${v+1}
`,d+=`${"=".repeat(60)}

`,T.forEach(A=>{d+=`${A.user}@Debian:~$ ${A.command}
`,d+=`${A.output}

`})}),t.content=d}const a=u.FS.HOME+"man-pages/pure-bash-bible.md",r=m[a];r?.type==="file"&&(r.content=hn);const i=u.FS.HOME+"man-pages/pure-sh-bible.md",h=m[i];h?.type==="file"&&(h.content=pn);const l=u.FS.HOME+"settings/themes.json";m[l]&&(m[l].content=JSON.stringify(F,null,2));const x=u.FS.HOME+"settings/fonts.json";m[x]&&(m[x].content=JSON.stringify(O,null,2)),o.log("[VFS] Dynamic content synced")}const p={init(){const n=u.FS.HOME;C=un[n],C?(P(n,C),fn(),o.log("[VFS] Initialized, entries:",Object.keys(m).length)):o.error("[VFS] Root path not found in filesystem data")},resolvePath(n,e){e.startsWith("~")&&(e=u.FS.HOME+e.slice(1)),e.startsWith("/")||(e=n+(n.endsWith("/")?"":"/")+e);const s=e.split("/").filter(Boolean),t=[];for(const a of s)if(a!=="."){if(a===".."){t.pop();continue}t.push(a)}return"/"+t.join("/")+(e.endsWith("/")&&t.length>0?"/":"")},getNode(n){return m[n]||null},getChildren(n){const e=this.getNode(n);return e?.type==="folder"?e.children:null},async touch(n,e){const s=n.endsWith("/")?n:n+"/",t=this.getNode(s);if(t?.type==="folder"){const a={type:"file",content:""};t.children[e]=a,m[s+e]=a,o.log(`[VFS] touch: ${s}${e}`),R(s)}},async mkdir(n,e){const s=n.endsWith("/")?n:n+"/",t=this.getNode(s);if(t?.type==="folder"){const a={type:"folder",children:{}};t.children[e]=a,m[s+e+"/"]=a,o.log(`[VFS] mkdir: ${s}${e}/`),R(s)}},async rm(n,e){const s=n.endsWith("/")?n:n+"/",t=this.getNode(s);if(t?.type==="folder"&&t.children[e]){const a=t.children[e],r=s+e+(a.type==="folder"?"/":"");return delete m[r],delete t.children[e],o.log(`[VFS] rm: ${r}`),R(s),!0}return!1},async rename(n,e,s){const t=n.endsWith("/")?n:n+"/",a=this.getNode(t);if(a?.type==="folder"&&a.children[e]){const r=a.children[e],i=t+e+(r.type==="folder"?"/":""),h=t+s+(r.type==="folder"?"/":"");a.children[s]=r,delete a.children[e],m[h]=r,delete m[i],o.log(`[VFS] rename: ${i} -> ${h}`),R(t)}}};typeof window<"u"&&(window.VirtualFS=p);window.CDEModal=y;window.VirtualFS=p;let c=u.FS.HOME,w=[],b=-1,g=null,I=!1,gn=u.FILEMANAGER.BASE_Z_INDEX,D=!1,_=null,E=null,$=null;function bn(){$&&window.clearTimeout($),$=window.setTimeout(()=>{S(),$=null},50)}window.addEventListener("cde-fs-change",n=>{n.detail?.path===c&&bn()});function S(){const n=document.getElementById("fmFiles"),e=document.getElementById("fmPath"),s=document.getElementById("fmStatus");if(!n||!e||!s)return;e.value=c;const t=p.getChildren(c);if(!t){o.warn(`[FileManager] renderFiles: path not found: ${c}`);return}const a=document.createDocumentFragment();let r=0;Object.entries(t).forEach(([i,h])=>{if(!I&&i.startsWith("."))return;r++;const l=document.createElement("div");l.className="fm-file",l.dataset.name=i,l.addEventListener("click",T=>{T.stopPropagation(),document.querySelectorAll(".fm-file").forEach(v=>v.classList.remove("selected")),l.classList.add("selected"),g=i});const x=document.createElement("img");x.src=h.type==="folder"?"/icons/filemanager.png":"/icons/gedit.png";const d=document.createElement("span");d.textContent=i,l.appendChild(x),l.appendChild(d),l.addEventListener("dblclick",()=>{h.type==="folder"?f(c+i+"/"):W(i,h.content)}),a.appendChild(l)}),n.replaceChildren(a),s.textContent=`${r} ${r===1?"item":"items"}`}function f(n){if(!p.getNode(n)){o.warn(`[FileManager] openPath: path does not exist: ${n}`);return}w.length>0&&w[b]===n||(w=w.slice(0,b+1),w.push(n),b++,c=n,S())}function L(){b>0&&(b--,c=w[b],S())}function U(){b<w.length-1&&(b++,c=w[b],S())}function G(){const n=c.split("/").filter(Boolean);if(n.length>0){n.pop();const e="/"+n.join("/")+(n.length>0?"/":"");p.getNode(e)&&f(e)}}function B(){f(u.FS.HOME)}async function xn(n){await p.touch(c,n)}async function vn(n){await p.mkdir(c,n)}async function H(n){if(!n)return;await y.confirm(`Delete ${n}?`)&&(await p.rm(c,n),g=null)}async function V(n,e){await p.rename(c,n,e),g=null}async function W(n,e){window.openTextEditor&&await window.openTextEditor(n,e)}const q={File:[{label:"New File",action:async()=>{const n=await y.prompt("File name:");n&&await xn(n)}},{label:"New Folder",action:async()=>{const n=await y.prompt("Folder name:");n&&await vn(n)}},{label:"Delete Selected",action:async()=>{g&&await H(g)}}],Edit:[{label:"Rename",action:async()=>{if(!g)return;const n=await y.prompt("New name:",g);n&&await V(g,n)}}],View:[{label:"Show Hidden Files",action:()=>{I=!I,S()}},{label:"Refresh",action:()=>S()}],Go:[{label:"Back",action:L},{label:"Forward",action:U},{label:"Up",action:G},{label:"Home",action:B}],Places:[{label:"Settings",action:()=>f(u.FS.HOME+"settings/")},{label:"Manual Pages",action:()=>f(u.FS.HOME+"man-pages/")},{label:"Desktop",action:()=>f(u.FS.DESKTOP)}]};function wn(){const n=document.querySelector(".fm-menubar");n&&n.querySelectorAll("span").forEach(e=>{e.addEventListener("click",s=>{s.stopPropagation(),N();const t=e.textContent?.trim()||"",a=q[t];if(!a)return;const r=document.createElement("div");r.className="fm-dropdown",r.style.zIndex=String(u.DROPDOWN.Z_INDEX),a.forEach(h=>{const l=document.createElement("div");l.className="fm-dropdown-item",l.textContent=h.label,l.addEventListener("click",async()=>{await h.action(),N()}),r.appendChild(l)}),document.body.appendChild(r);const i=e.getBoundingClientRect();r.style.left=i.left+"px",r.style.top=i.bottom+"px",_=r})})}function N(){_&&(_.remove(),_=null)}function yn(n){n.preventDefault(),E&&E.remove();const e=n.target,s=e&&typeof e.closest=="function"?e.closest(".fm-file"):null,t=document.createElement("div");t.className="fm-contextmenu",t.style.zIndex=String(u.DROPDOWN.Z_INDEX);let a=[];if(s){const r=s.dataset.name;if(!r)return;g=r,document.querySelectorAll(".fm-file").forEach(i=>i.classList.remove("selected")),s.classList.add("selected"),a=[{label:"Open",action:()=>{const i=p.getNode(c+r+(p.getNode(c+r+"/")?"/":""));i&&(i.type==="folder"?f(c+r+"/"):W(r,i.content))}},{label:"Rename",action:async()=>{const i=await y.prompt("New name:",r);i&&await V(r,i)}},{label:"Delete",action:()=>H(r)}]}else a=q.File;a.forEach(r=>{const i=document.createElement("div");i.className="fm-context-item",i.textContent=r.label,i.addEventListener("click",async()=>{await r.action(),t.remove()}),t.appendChild(i)}),document.body.appendChild(t),t.style.left=n.clientX+"px",t.style.top=n.clientY+"px",E=t}function z(){if(D)return;wn();const n=document.getElementById("fmFiles");n&&n.addEventListener("contextmenu",yn),document.addEventListener("click",()=>{N(),E&&(E.remove(),E=null)});const e=document.getElementById("fmPath");e&&e.addEventListener("keydown",s=>{s.key==="Enter"&&f(e.value)}),D=!0,o.log("[FileManager] Initialized")}window.openFileManager=()=>{const n=document.getElementById("fm");n&&(n.style.display="flex",n.style.zIndex=String(++gn),window.AudioManager&&window.AudioManager.windowOpen(),z(),f(c),window.focusWindow&&window.focusWindow("fm"))};window.closeFileManager=()=>{const n=document.getElementById("fm");n&&(n.style.display="none",window.AudioManager&&window.AudioManager.windowClose())};window.toggleFileManager=()=>{const n=document.getElementById("fm");n?.style.display==="none"||!n?.style.display?window.openFileManager():window.closeFileManager()};window.isFileManagerOpen=()=>{const n=document.getElementById("fm");return!!n&&n.style.display!=="none"};window.openPath=f;window.goBack=L;window.goForward=U;window.goUp=G;window.goHome=B;window.createFile=async(n,e)=>{await p.touch(c,n);const s=p.getNode(c+n);s&&(s.content=e)};window.saveFile=(n,e)=>{const s=p.getNode(n);s?.type==="file"&&(s.content=e,o.log(`[FileManager] Saved: ${n}`))};const En={init:z,open:window.openFileManager,close:window.closeFileManager,toggle:window.toggleFileManager,isOpen:window.isFileManagerOpen,openPath:f};o.log("[FileManager] Module loaded");const An=Object.freeze(Object.defineProperty({__proto__:null,FileManager:En},Symbol.toStringTag,{value:"Module"}));export{u as C,p as V,y as a,Tn as b,An as f,M as t};
