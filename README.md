# satyam.dev — Developer Portfolio

> A minimalist, performance-first personal portfolio for **Satyam Kulshreshtha** — Software Engineer & Full-Stack Developer specializing in Java, Python, React, and GenAI/RAG pipelines.

🔗 **Live:** [serdire.github.io/satyam-portfolio](https://serdire.github.io/satyam-portfolio)

---

## ✨ Features

- **Terminal widget** — interactive `satyam --summary` command with tab-completion hints
- **Live GitHub sync** — contribution graph & stats fetched in real-time via `ghchart.rshah.org`
- **Project inspector** — filterable work showcase with live metadata viewer
- **Kinetic pipeline** — animated architecture diagram showing tech flow
- **Mobile hamburger nav** — smooth slide-in drawer with backdrop blur
- **Scroll reveal** — staggered entry animations using IntersectionObserver
- **Zero dependencies** — pure HTML, CSS, and vanilla JS. No frameworks, no build step.

---

## 🗂 Project Structure

```
satyam-portfolio/
├── index.html              # Single-page application entry point
├── assets/
│   ├── css/
│   │   └── styles.css      # All styles — design tokens, layout, components, responsive
│   ├── js/
│   │   └── script.js       # All interactivity — terminal, inspector, animations, nav
│   └── images/             # Logos, profile photo, SVG icons
├── server.mjs              # Local dev server (Node.js, no deps)
├── package.json
└── README.md
```

---

## 🚀 Running Locally

**No install required.** Just serve the files:

```bash
# Option 1 — Node.js dev server (included)
node server.mjs
# → http://localhost:3000

# Option 2 — Any static server
npx serve .
python -m http.server 3000
```

> ⚠️ Don't open `index.html` directly as a `file://` URL — some browser APIs (clipboard, fetch) require an HTTP origin.

---

## 🛠 Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Markup | HTML5 | Semantic, accessible structure |
| Styling | CSS3 (custom properties) | Design tokens, no preprocessor needed |
| Scripting | Vanilla JS (ES2020+) | Zero bundle, instant load |
| Fonts | Google Fonts — Inter + JetBrains Mono | System-level caching |
| GitHub data | [ghchart.rshah.org](https://ghchart.rshah.org) | Live contribution graph, no auth |
| Hosting | GitHub Pages | Free, automatic deploys on push |

---

## 📐 Design Principles

- **Ponytail philosophy** — the best code is the code you never wrote. Every line is justified.
- **Native-first** — `IntersectionObserver`, `CSS custom properties`, `clip-path`, `backdrop-filter` — no polyfills.
- **Dark, minimal, technical** — designed to feel like a developer's workspace, not a marketing page.
- **Mobile-first responsive** — hamburger drawer on ≤768px, full nav on desktop.

---

## 📬 Contact

**Satyam Kulshreshtha**
- 📧 [kulsatyam2002@gmail.com](mailto:kulsatyam2002@gmail.com)
- 💼 [linkedin.com/in/satyam-kulshreshtha-841049233](https://www.linkedin.com/in/satyam-kulshreshtha-841049233/)
- 🐙 [github.com/Satyamkul](https://github.com/Satyamkul)

---

## 📄 License

MIT © 2026 Satyam Kulshreshtha — feel free to use as inspiration, but please don't copy the content verbatim.
