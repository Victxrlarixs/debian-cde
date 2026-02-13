# 🖥️ Simulación CDE en Debian

[![Licencia: GPL v3](https://img.shields.io/badge/Licencia-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![PRs Bienvenidos](https://img.shields.io/badge/PRs-bienvenidos-brightgreen.svg)]()

[![Linux](https://img.shields.io/badge/Linux-FCC624?style=flat&logo=linux&logoColor=black)](https://www.kernel.org/)
[![Debian](https://img.shields.io/badge/Debian-A81D33?style=flat&logo=debian&logoColor=white)](https://www.debian.org/)
[![GNU](https://img.shields.io/badge/GNU-000000?style=flat&logo=gnu&logoColor=white)](https://www.gnu.org/)


> Una simulación web nostálgica del **Common Desktop Environment (CDE)** — el clásico escritorio Unix — reinventado para el navegador moderno.

---

## 🧠 Sobre el Proyecto

**Simulación CDE en Debian** es un experimento front-end que da vida al icónico **Common Desktop Environment** dentro del navegador. Inspirado en la estética vintage de CDE, este proyecto recrea su inconfundible interfaz, con el **Style Manager**, temas de color clásicos y una terminal con aspecto funcional — todo corriendo bajo una simulación con sabor a Debian.

El proyecto vive en **[debian.com.mx](https://debian.com.mx)** y sirve como homenaje a los primeros entornos de escritorio Unix y como campo de juego para el desarrollo de interfaces retro.

---

## ✨ Características

- 🎨 **Temas clásicos CDE** – Platinum, Olive, Marine, Sand, Graphite  
- 🖱️ **Style Manager interactivo** – Cambia el título activo, fondo y colores del espacio de trabajo al vuelo  
- 💻 **Emulación de terminal** – Terminal en modo automático con contexto de usuario Debian  
- 📸 **Captura tu experiencia** Captura de pantalla integrada – Haz clic en el icono de la cámara y descarga un PNG de todo el escritorio.
---

## 🚀 Comenzar

Solo visita **[debian.com.mx](https://debian.com.mx)** y empieza a explorar.  

## 🌐 Despliegue

El despliegue es **totalmente automatizado**:

- **Fusión a `alpha`** → despliegue de vista previa (subdominio opcional).
- **Fusión a `beta`** → despliegue de pruebas para validación final.
- **Tras aprobación, `beta` se fusiona en `main`** → **en vivo en [debian.com.mx](https://debian.com.mx)**.

Usamos [GitHub Actions](https://github.com/features/actions) para gestionar el proceso de despliegue sin fricciones.

---

## 📄 Licencia

Distribuido bajo la **Licencia Pública General de GNU v3.0**.  
Consulta el archivo [`LICENSE`](LICENSE) para más información.

---

## 🙏 Agradecimientos

- El equipo de **CDE** por diseñar uno de los entornos de escritorio más memorables.
- **Debian** – por mantener vivo el espíritu del Unix libre.
- Todos los **contribuyentes** que ayudan a hacer esta simulación más auténtica y divertida.

---

<p align="center">
  Hecho con ☕️ y 🖥️ nostalgia<br />
  <a href="https://debian.com.mx">debian.com.mx</a>
</p>


## 🚀 Si deseas ejecutar el proyecto localmente:

```bash
# Descarga el código
git clone https://github.com/victxrlarixs/deban-cde.git
cd debian-cde

# Abre index.html en tu navegador favorito
open index.html
