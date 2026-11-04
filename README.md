# LUKA VANCE — High Fashion Editorial Portfolio

> A luxury, high-fashion editorial portfolio featuring kinetic typography, photographic cutouts, and scroll choreography powered by GSAP, Lenis, and StringTune.

---

## ✦ Overview

**LUKA VANCE** is a luxury digital editorial experience designed for a high-fashion model archive. Built with a monochromatic aesthetic, the website emphasizes fluid motion, layered spatial photography, dynamic pagination reels, and cinematic transitions.

---

## ✦ Key Features

- **Cinematic Blue-Gradient Preloader**:
  - Fullscreen dynamic radial gradient with organic blur orbs and fine grain texture.
  - Kinetic typography where perimeter letters traverse trajectories and assemble cleanly into **LUKA**.
  - Upward sliding curtain transition revealing the hero section with zero layout shifts.

- **Layered Parallax Hero Experience**:
  - Multi-layered foreground subject cutout positioned in front of mountain backdrops and oversized typography.
  - Smooth depth separation creating an authentic 3D parallax effect on scroll.

- **Liquid FlexCarousel (Portrait Collection)**:
  - Custom fluid WebGL/DOM carousel with elastic swipe, velocity lerping, and drag physics.
  - Interactive rolling digit reel pagination (`01 / 06`) with responsive captions and accessible live regions.

- **Spatial Standing Poses Showcase**:
  - Scroll-driven sticky stage showcasing full-body poses with dynamic tracking counters.
  - Preserved aspect ratios and head clearance with high-resolution photography.

- **Editorial Runway Ramp Walk Showcase**:
  - Split-screen stage locking full-screen with sequential Look transitions (Looks 1, 2, 3).
  - Floating vertical slide navigation indicators with smooth look jumping.

- **Monochromatic Luxury Design System**:
  - Strict palette (`#FFFFFF`, `#000000`, `#111111`, `#767676`).
  - Google Sans typography paired with Allura cursive editorial accents.
  - Seamless scroll with hidden browser scrollbars for an immersive full-bleed experience.

---

## ✦ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **HTML5 & CSS3** | Semantic structure, modern CSS variables, clamp fluid typography, sticky frames |
| **Vanilla JavaScript (ES Modules)** | Modular application architecture without heavy framework overhead |
| **GSAP (GreenSock)** | Timeline orchestration, kinetic letter preloader, ScrollTrigger transitions |
| **Lenis** | Smooth momentum-based inertial scrolling |
| **StringTune** | Scroll progress tracking and kinetic choreographies |
| **OGL** | Lightweight WebGL shaders for fluid carousel distortion |

---

## ✦ Project Structure

```bash
EDITORIAL-WEBSITE/
├── index.html              # Main HTML markup & semantic sections
├── style.css               # Core design system & layout styles
├── loader.css              # Cinematic preloader styling & keyframes
├── loader.js               # GSAP kinetic intro timeline logic
├── main.js                 # Primary motion controller & scroll choreography
├── flex-carousel.js        # Liquid drag/swipe carousel implementation
├── FlexCarousel.css        # Carousel layout & reel counter styles
├── assets/                 # Vendored runtime libraries (StringTune)
├── images/                 # High-resolution optimized photographic assets
│   ├── parallax/           # Hero layer cutouts & mountain backdrops
│   ├── portraits/          # Studio close-up portraits
│   ├── standing/           # Full-body standing poses
│   └── runway/             # Runway looks & split backgrounds
└── package.json            # Project dependencies & scripts
```

---

## ✦ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+) or any static HTTP server (e.g., Python 3).

### Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Jishnu09-siuu/EDITORIAL-WEBSITE.git
   cd EDITORIAL-WEBSITE
   ```

2. **Install dependencies** (optional for dev/tooling):
   ```bash
   npm install
   ```

3. **Start a local development server**:
   Using Python:
   ```bash
   python3 -m http.server 8080
   ```
   Or using Node `npx serve`:
   ```bash
   npx serve .
   ```

4. **Open in browser**:
   Navigate to `http://localhost:8080`.

---

## ✦ Security & Performance Audits

- **Dependency Security**: Zero vulnerabilities detected (`npm audit`).
- **DOM Injection & XSS**: All DOM updates utilize safe text bindings or pre-compiled static markup.
- **Privacy First**: Personal files, test artifacts, and OS metadata are excluded via `.gitignore`.
- **Zero Insecure HTTP**: All external fonts and CDN resources are served over secure HTTPS.

---

## ✦ License

This project is licensed under the [MIT License](LICENSE) — feel free to explore, learn, and build upon it.
