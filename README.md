# FocusTube — Distraction-Free YouTube Player

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A lightweight, distraction-free YouTube viewer designed to help students, developers, and researchers watch educational videos and playlists without recommendation algorithms, comment sections, sidebar distractions, or targeted ads.

---

## 🎯 Why FocusTube?

When studying or learning new technologies on YouTube, recommendation feeds and comment threads are prime sources of distraction. **FocusTube** solves this by encapsulating YouTube's official iframe embedding API inside a clean, single-purpose environment. By setting key embed variables, it suppresses default recommendations and interface clutter to help you stay focused on your learning goals.

---

## 🌟 Key Features

* **Distraction-Free Playback**: Strips away recommended feeds, comment panels, and video annotations using targeted YouTube Iframe parameters (`rel=0`, `iv_load_policy=3`, `modestbranding=1`).
* **Focus Mode (Theater Mode)**: With one click, fade out all UI inputs, headers, and footers, centering the video player in a minimal, dark viewport.
* **YouTube Playlists & Shorts Support**: Seamlessly parses playlists, traditional video links, shortened mobile links (`youtu.be`), and YouTube Shorts (`/shorts/`).
* **One-Click Paste & Play**: Automatically fetches contents from your clipboard and immediately parses/plays the video, reducing friction.
* **Embed Customizer**: Toggle **Autoplay** and **Loop** controls. (Includes playlist workarounds to loop single videos correctly).
* **URL Parameter Integration**: Share or bookmark pre-loaded sessions using URL queries (e.g., `?url=[youtube-link]` or `?v=[id]`), allowing automated loading on startup.
* **Responsive Styling**: Pure CSS design with fluid layouts, custom variables, and media query triggers optimized for mobile and desktop screens.

---

## ⚙️ How It Works (Regex URL Engine)

FocusTube evaluates URLs on submission or clipboard paste through a multi-stage parser inside [`script.js`](script.js):

1. **Playlist Check**: Isolates playlist IDs (`list=ID`) to establish a video series series.
2. **Video Check**: Matches 11-character alphanumeric video IDs across watch parameters, embeds, short-links, and Shorts.
3. **Parameter Construction**: Dynamically structures query strings based on active user configurations (Autoplay, Loops, etc.) to inject the iframe.

---

## 🚀 Getting Started / Hosting

FocusTube is a serverless client-side application. No compilation or complex installations are necessary.

### Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/Brajesh3/Youtube-video-embedder.git
   ```
2. Open [`index.html`](index.html) in your browser.

### Deploying
Simply upload these files to **GitHub Pages**, **Vercel**, or **Netlify** to host your own personal distraction-free study player.
