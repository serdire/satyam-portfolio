/**
 * satyam.dev // 2026 Developer Portfolio
 * Minimalist, native-first interactive scripts
 
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initTerminalWidget();
  initProjectInspector();
  initKineticPipeline();
  initScrollReveal();
  initCopyButtons();
  initGitHubLiveSync();
});

/* --------------------------------------------------------------------------
   01. Interactive Ambient Background Canvas (Zero-dependency Constellation)
   -------------------------------------------------------------------------- */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  // Honor user reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let animationFrameId;
  let isRunning = true;

  // Particle network parameters
  const NODE_COUNT = window.innerWidth < 768 ? 24 : 45;
  const CONNECT_DIST = 110;
  const MOUSE_REPEL_DIST = 140;
  const nodes = [];

  const mouse = { x: -9999, y: -9999, active: false };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  function createNodes() {
    nodes.length = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.4 + 1.1,
        alpha: Math.random() * 0.4 + 0.25
      });
    }
  }

  function update() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);

    // Update & draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];

      // Drift
      n.x += n.vx;
      n.y += n.vy;

      // Mouse gentle interaction
      if (mouse.active) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_REPEL_DIST && dist > 0) {
          const force = (MOUSE_REPEL_DIST - dist) / MOUSE_REPEL_DIST * 0.08;
          n.x += (dx / dist) * force * 15;
          n.y += (dy / dist) * force * 15;
        }
      }

      // Edge wrap
      if (n.x < -10) n.x = width + 10;
      if (n.x > width + 10) n.x = -10;
      if (n.y < -10) n.y = height + 10;
      if (n.y > height + 10) n.y = -10;

      // Draw point
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 156, 255, ${n.alpha * 0.7})`;
      ctx.fill();

      // Draw interconnecting hairline vectors
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
        if (dist < CONNECT_DIST) {
          const strokeAlpha = (1 - dist / CONNECT_DIST) * 0.16;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(127, 227, 245, ${strokeAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(update);
  }

  window.addEventListener('resize', () => {
    resize();
    createNodes();
  });

  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    mouse.active = false;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    } else {
      isRunning = true;
      update();
    }
  });

  resize();
  createNodes();
  update();
}

/* --------------------------------------------------------------------------
   03. Interactive Terminal Simulator with Typewriter Effect
   -------------------------------------------------------------------------- */
function initTerminalWidget() {
  const activeCmdEl = document.getElementById('term-active-cmd');
  const outputEl = document.getElementById('term-output');
  const copyBtn = document.getElementById('copy-cmd-btn');
  const pillButtons = document.querySelectorAll('.term-pill-btn');

  let typeTimer = null;

  const commands = {
    'satyam --summary': `
      <div class="out-row"><span class="out-k">Name:</span> <span class="out-v">Satyam Kulshreshtha</span></div>
      <div class="out-row"><span class="out-k">Current Role:</span> <span class="out-v holo-text">Software Engineer @ DBN Management Services Pvt Ltd</span></div>
      <div class="out-row"><span class="out-k">Focus:</span> <span class="out-v">Enterprise ERP Software Architecture &bull; Java &bull; XML Layouts</span></div>
      <div class="out-row"><span class="out-k">Degree:</span> <span class="out-v">MCA (AKGEC, Ghaziabad / AKTU '25) &bull; BCA (MAISM / UniRaj)</span></div>
      <div class="out-row"><span class="out-k">Past Internships:</span> <span class="out-v">Front-End Intern @ CSRBOX (IBM) &bull; Java Intern @ JPMorgan Chase</span></div>
      <div class="out-row"><span class="out-k">Core Tech:</span> <span class="out-tags"><span class="t-pill">Java</span><span class="t-pill">Python</span><span class="t-pill">React</span><span class="t-pill">XML</span><span class="t-pill">RAG</span><span class="t-pill">SQL</span></span></div>
    `,
    'satyam --skills': `
      <div class="out-row"><span class="out-k">Languages:</span> <span class="out-v">Java, Python, C++, C, JavaScript (ES6+), SQL</span></div>
      <div class="out-row"><span class="out-k">Web/Stack:</span> <span class="out-v">React, Node.js, Express, Modern CSS (Grid/Subgrid), HTML5 Semantic</span></div>
      <div class="out-row"><span class="out-k">AI/Data:</span> <span class="out-v">RAG Architectures, LangChain, ChromaDB, Prompt Engineering</span></div>
      <div class="out-row"><span class="out-k">Tooling:</span> <span class="out-v">Git, GitHub, Docker, Postman, Netlify, Linux/Bash</span></div>
    `,
    'satyam --projects': `
      <div class="out-row"><span class="out-k">01 / RAG:</span> <span class="out-v">Chat-with-PDF (github.com/Satyamkul/Chat-with-PDF)</span></div>
      <div class="out-row"><span class="out-k">02 / FullStack:</span> <span class="out-v">Hotel Booking Engine (github.com/Satyamkul/hotel-booking-website)</span></div>
      <div class="out-row"><span class="out-k">03 / Platform:</span> <span class="out-v">IntelliConnect (github.com/Satyamkul/IntelliConnect-A-Community-Portal-master)</span></div>
      <div class="out-row"><span class="out-k">04 / Commerce:</span> <span class="out-v">GreenFair (github.com/Satyamkul/GreenFair)</span></div>
    `,
    'curl satyam.dev/contact': `
      <div class="out-row"><span class="out-k">Email:</span> <span class="out-v"><a href="mailto:kulsatyam2002@gmail.com" class="holo-text">kulsatyam2002@gmail.com</a></span></div>
      <div class="out-row"><span class="out-k">Phone:</span> <span class="out-v">+91 6377488794</span></div>
      <div class="out-row"><span class="out-k">LinkedIn:</span> <span class="out-v"><a href="https://www.linkedin.com/in/satyam-kulshreshtha-841049233/" target="_blank" rel="noopener noreferrer">linkedin.com/in/satyam-kulshreshtha-841049233</a></span></div>
      <div class="out-row"><span class="out-k">GitHub:</span> <span class="out-v"><a href="https://github.com/Satyamkul" target="_blank" rel="noopener noreferrer">github.com/Satyamkul</a></span></div>
    `
  };

  function executeCommand(cmd, animate = true) {
    if (!commands[cmd]) return;

    pillButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cmd') === cmd);
    });

    if (typeTimer) clearInterval(typeTimer);

    if (!animate) {
      activeCmdEl.textContent = cmd;
      outputEl.innerHTML = commands[cmd];
      return;
    }

    activeCmdEl.textContent = '';
    outputEl.innerHTML = '';
    let idx = 0;

    typeTimer = setInterval(() => {
      if (idx < cmd.length) {
        activeCmdEl.textContent += cmd[idx];
        idx++;
      } else {
        clearInterval(typeTimer);
        typeTimer = null;
        outputEl.innerHTML = commands[cmd];
      }
    }, 20);
  }

  pillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      executeCommand(cmd, true);
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const currentCmd = activeCmdEl.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentCmd).then(() => {
          const span = copyBtn.querySelector('span');
          if (span) {
            const orig = span.textContent;
            span.textContent = 'copied!';
            setTimeout(() => { span.textContent = orig; }, 1800);
          }
        }).catch(() => {});
      }
    });
  }
}

/* --------------------------------------------------------------------------
   04. Interactive Project Inspector (Split-Pane with Cross-Fade & Kinetic Sync)
   -------------------------------------------------------------------------- */
function initProjectInspector() {
  const tabs = document.querySelectorAll('.project-tab');
  const viewerWindow = document.querySelector('.viewer-window');
  const vTitle = document.getElementById('v-title');
  const vCategory = document.getElementById('v-category');
  const vArchLabel = document.getElementById('v-arch-label');
  const vFlow = document.getElementById('v-flow');
  const vDesc = document.getElementById('v-desc');
  const vStack = document.getElementById('v-stack');
  const vGithub = document.getElementById('v-github');

  const projectData = {
    'chat-pdf': {
      title: 'Chat-with-PDF',
      category: 'GenAI / RAG Architecture',
      archLabel: 'rag_ingestion_pipeline.py',
      flow: `[User Query] ────────► [Embedding Model] ───► [Vector Search]
                                                    │
[PDF Ingestion] ─────► [Text Chunking] ──────► [ChromaDB]
                                                    │
[Augmented Prompt] ◄── [Top-K Context Retrieval] ───┘
        │
        ▼
[LLM Inference] ─────► [Streamed Synthesis Answer + Source Citations]`,
      desc: `Standard LLM querying suffers from strict context limits and hallucination when dealing with lengthy documents. 
             This system implements an asynchronous ingestion pipeline that splits multi-page PDFs into semantic overlapping chunks,
             computes high-dimensional vector embeddings, and executes low-latency cosine similarity queries to ground generation in exact factual source passages.`,
      stack: ['Python', 'LangChain', 'ChromaDB', 'FastAPI', 'OpenAI / Gemini Embeddings', 'Streamlit / React'],
      github: 'https://github.com/Satyamkul/Chat-with-PDF'
    },
    'hotel-booking': {
      title: 'Hotel Booking Engine',
      category: 'Full-Stack Reservation Architecture',
      archLabel: 'reservation_controller.js',
      flow: `[Client UI] ──────► [REST API Router] ───► [Auth Middleware]
                                                   │
[DB Transaction] ◄── [Lock Room Availability] ◄────┤
        │                                          │
        ▼                                          ▼
[Commit Booking] ──► [Receipt Dispatcher] ──► [SQL Storage]`,
      desc: `A production-ready hospitality reservation system engineered to eliminate double-booking concurrency bugs. 
             Features dynamic room category filtering, date-range availability calculations, secure user session management, 
             and a streamlined checkout pipeline.`,
      stack: ['React', 'Node.js', 'Express', 'SQL', 'JWT Authentication', 'Responsive CSS'],
      github: 'https://github.com/Satyamkul/hotel-booking-website'
    },
    'intelliconnect': {
      title: 'IntelliConnect Portal',
      category: 'Community Platform Architecture',
      archLabel: 'portal_event_bus.js',
      flow: `[User Session] ──► [WebSocket Bus] ──► [Channel Broadcast]
                                 │
[Discussion DB] ◄── [Message Ingestion] ◄── [Moderation Filter]
        │
        ▼
[Real-Time Feed Updates] ──► [Active Client Nodes]`,
      desc: `A collaborative community and knowledge-sharing portal designed for engineering students and developers. 
             Provides structured subject-matter channels, persistent discussion threads, peer review boards, 
             and real-time notification feeds.`,
      stack: ['JavaScript', 'WebSockets', 'MongoDB', 'Node.js', 'RESTful APIs', 'Modern CSS'],
      github: 'https://github.com/Satyamkul/IntelliConnect-A-Community-Portal-master'
    },
    'greenfair': {
      title: 'GreenFair Marketplace',
      category: 'Sustainable E-Commerce',
      archLabel: 'sustainability_filter.js',
      flow: `[Catalog Store] ──► [Eco-Metric Scoring] ──► [Search Filter]
                                                        │
[Cart State] ◄────── [Zero-Dependency Storage] ◄────────┤
        │
        ▼
[Checkout Verification] ──► [Impact Metric Summary]`,
      desc: `An eco-conscious e-commerce storefront dedicated to verified sustainable goods. 
             Features zero-dependency clientside state management for cart synchronization, instant product filtering by environmental impact metrics, 
             and responsive mobile-first layouts.`,
      stack: ['HTML5 Semantic', 'CSS Grid', 'Subgrid', 'Modern Vanilla JS', 'LocalStorage API'],
      github: 'https://github.com/Satyamkul/GreenFair'
    },
    'digital-services': {
      title: 'DigitalServices Pro',
      category: 'SaaS / Web Suite',
      archLabel: 'service_tier_matrix.js',
      flow: `[Visitor Discovery] ──► [Interactive Tier Matrix] ──► [Scope Estimator]
                                                                   │
[Lead Notification] ◄── [Validated Payload Assembly] ◄────────────┘`,
      desc: `A streamlined agency operations platform and service catalog engineered for rapid service tier comparison, 
             automated scope estimation, and validated inbound inquiry dispatching.`,
      stack: ['Full-Stack Web Suite', 'JavaScript (ES2024)', 'Modern CSS Variables', 'Accessible Forms'],
      github: 'https://github.com/Satyamkul/digital-services-pro'
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const projKey = tab.getAttribute('data-project');
      const data = projectData[projKey];
      if (!data) return;

      // Update Tab Active States
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Trigger viewer window pop animation
      if (viewerWindow) {
        viewerWindow.classList.remove('swapping');
        void viewerWindow.offsetWidth;
        viewerWindow.classList.add('swapping');
      }

      // Update Inspector Panel content
      vTitle.textContent = data.title;
      vCategory.textContent = data.category;
      if (vArchLabel) vArchLabel.textContent = data.archLabel;
      vFlow.textContent = data.flow;
      vDesc.textContent = data.desc;
      vGithub.href = data.github;

      // Render Stack Pills
      vStack.innerHTML = data.stack.map(s => `<span class="tech-pill">${s}</span>`).join('');

      // Synchronize Graphic Motion Pipeline
      if (typeof window.updateKineticPipeline === 'function') {
        window.updateKineticPipeline(projKey);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   05. Section 01 Graphic Motion: Kinetic Architecture Pipeline Simulation
   -------------------------------------------------------------------------- */
function initKineticPipeline() {
  const canvas = document.getElementById('pipeline-canvas');
  if (!canvas) return;

  const btnMotion = document.getElementById('btn-mode-motion');
  const btnAscii = document.getElementById('btn-mode-ascii');
  const motionWrap = document.getElementById('pipeline-motion-wrap');
  const asciiFlow = document.getElementById('v-flow');

  if (btnMotion && btnAscii && motionWrap && asciiFlow) {
    btnMotion.addEventListener('click', () => {
      btnMotion.classList.add('active');
      btnAscii.classList.remove('active');
      motionWrap.style.display = 'flex';
      asciiFlow.style.display = 'none';
    });
    btnAscii.addEventListener('click', () => {
      btnAscii.classList.add('active');
      btnMotion.classList.remove('active');
      motionWrap.style.display = 'none';
      asciiFlow.style.display = 'block';
    });
  }

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = 640;
  const h = 175;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const pipelines = {
    'chat-pdf': {
      nodes: [
        { id: 0, label: 'User Query', x: 75, y: 55, color: '#4ade80' },
        { id: 1, label: 'Embedder', x: 235, y: 55, color: '#7fe3f5' },
        { id: 2, label: 'Vector Search', x: 410, y: 55, color: '#b49cff' },
        { id: 3, label: 'PDF Chunking', x: 235, y: 125, color: '#f59e0b' },
        { id: 4, label: 'ChromaDB', x: 410, y: 125, color: '#b49cff' },
        { id: 5, label: 'LLM Stream', x: 570, y: 90, color: '#ff9fd8' }
      ],
      links: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 3, to: 4 },
        { from: 2, to: 5 },
        { from: 4, to: 2 }
      ]
    },
    'hotel-booking': {
      nodes: [
        { id: 0, label: 'Client UI', x: 80, y: 90, color: '#4ade80' },
        { id: 1, label: 'REST Router', x: 230, y: 90, color: '#7fe3f5' },
        { id: 2, label: 'Auth Token', x: 380, y: 50, color: '#f59e0b' },
        { id: 3, label: 'Room Lock TX', x: 380, y: 130, color: '#b49cff' },
        { id: 4, label: 'SQL Storage', x: 550, y: 90, color: '#ff9fd8' }
      ],
      links: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 3, to: 4 }
      ]
    },
    'intelliconnect': {
      nodes: [
        { id: 0, label: 'Session UI', x: 75, y: 90, color: '#4ade80' },
        { id: 1, label: 'WS Gateway', x: 220, y: 90, color: '#7fe3f5' },
        { id: 2, label: 'Channel Bus', x: 375, y: 50, color: '#b49cff' },
        { id: 3, label: 'Moderation', x: 375, y: 130, color: '#f59e0b' },
        { id: 4, label: 'Realtime Feed', x: 550, y: 90, color: '#ff9fd8' }
      ],
      links: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 3, to: 4 }
      ]
    },
    'greenfair': {
      nodes: [
        { id: 0, label: 'Catalog Search', x: 80, y: 90, color: '#4ade80' },
        { id: 1, label: 'Eco Scorer', x: 230, y: 90, color: '#7fe3f5' },
        { id: 2, label: 'Zero-Dep Cart', x: 390, y: 50, color: '#b49cff' },
        { id: 3, label: 'Checkout API', x: 550, y: 90, color: '#ff9fd8' }
      ],
      links: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 }
      ]
    },
    'digital-services': {
      nodes: [
        { id: 0, label: 'Discovery UI', x: 80, y: 90, color: '#4ade80' },
        { id: 1, label: 'Tier Matrix', x: 230, y: 90, color: '#7fe3f5' },
        { id: 2, label: 'Estimator', x: 390, y: 90, color: '#b49cff' },
        { id: 3, label: 'Dispatch Hub', x: 550, y: 90, color: '#ff9fd8' }
      ],
      links: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 }
      ]
    }
  };

  let activeProject = 'chat-pdf';
  let packets = [];

  function initPackets() {
    packets = [];
    const pipe = pipelines[activeProject] || pipelines['chat-pdf'];
    pipe.links.forEach((link, idx) => {
      packets.push({
        link,
        progress: (idx * 0.28) % 1,
        speed: 0.007 + Math.random() * 0.004,
        size: 3.5
      });
      packets.push({
        link,
        progress: (idx * 0.28 + 0.5) % 1,
        speed: 0.007 + Math.random() * 0.004,
        size: 3.5
      });
    });
  }

  initPackets();

  window.updateKineticPipeline = function(projKey) {
    if (pipelines[projKey]) {
      activeProject = projKey;
      initPackets();
    }
  };

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const pipe = pipelines[activeProject] || pipelines['chat-pdf'];

    // Draw connection bus vectors
    pipe.links.forEach(l => {
      const n1 = pipe.nodes.find(n => n.id === l.from);
      const n2 = pipe.nodes.find(n => n.id === l.to);
      if (!n1 || !n2) return;

      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      const cpx = (n1.x + n2.x) / 2;
      ctx.bezierCurveTo(cpx, n1.y, cpx, n2.y, n2.x, n2.y);
      ctx.strokeStyle = 'rgba(239, 233, 221, 0.12)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
    });

    // Draw and animate kinetic packets
    packets.forEach(p => {
      p.progress += p.speed;
      if (p.progress > 1) p.progress = 0;

      const n1 = pipe.nodes.find(n => n.id === p.link.from);
      const n2 = pipe.nodes.find(n => n.id === p.link.to);
      if (!n1 || !n2) return;

      const t = p.progress;
      const cpx = (n1.x + n2.x) / 2;

      const bx = Math.pow(1 - t, 3) * n1.x +
                 3 * Math.pow(1 - t, 2) * t * cpx +
                 3 * (1 - t) * Math.pow(t, 2) * cpx +
                 Math.pow(t, 3) * n2.x;
      const by = Math.pow(1 - t, 3) * n1.y +
                 3 * Math.pow(1 - t, 2) * t * n1.y +
                 3 * (1 - t) * Math.pow(t, 2) * n2.y +
                 Math.pow(t, 3) * n2.y;

      ctx.beginPath();
      ctx.arc(bx, by, p.size, 0, Math.PI * 2);
      ctx.fillStyle = '#7fe3f5';
      ctx.shadowColor = '#b49cff';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw node modules
    pipe.nodes.forEach(n => {
      const nodeW = 100;
      const nodeH = 28;
      const nx = n.x - nodeW / 2;
      const ny = n.y - nodeH / 2;

      ctx.fillStyle = 'rgba(18, 16, 16, 0.9)';
      ctx.beginPath();
      ctx.roundRect(nx, ny, nodeW, nodeH, 6);
      ctx.fill();

      ctx.strokeStyle = 'rgba(239, 233, 221, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(nx + 12, n.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.shadowColor = n.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = '500 10.5px "JetBrains Mono", monospace';
      ctx.fillStyle = '#efe9dd';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, nx + 22, n.y);
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

/* --------------------------------------------------------------------------
   08. Native Scroll-Driven Reveal (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   09. Copy Helpers for Contact Direct Buttons
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-small-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'copied!';
          setTimeout(() => { btn.textContent = orig; }, 1800);
        }).catch(() => {});
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. Live GitHub OSS Activity & Metrics Syncing
   -------------------------------------------------------------------------- */
function initGitHubLiveSync() {
  const chartImg = document.getElementById('gh-live-chart');
  const syncStatus = document.getElementById('gh-sync-status');
  const reposNum = document.getElementById('gh-stat-repos');
  const followersNum = document.getElementById('gh-stat-followers');
  const syncBtn = document.getElementById('gh-sync-btn');

  function syncLiveGitHub() {
    const ts = Date.now();
    if (chartImg) {
      // Dynamic live sync from GitHub with cache-busting timestamp
      const liveUrl = `https://ghchart.rshah.org/b49cff/Satyamkul?t=${ts}`;
      chartImg.src = liveUrl;

      chartImg.onload = () => {
        if (syncStatus) {
          syncStatus.innerHTML = '<span class="pulse-dot"></span> LIVE SYNCED';
          syncStatus.title = 'Live contributions fetched directly from GitHub @Satyamkul';
        }
      };

      chartImg.onerror = () => {
        // Fallback to local copy if offline or unreachable
        chartImg.src = 'github-contributions.svg';
        if (syncStatus) {
          syncStatus.innerHTML = '● CACHED GRAPH';
          syncStatus.title = 'Offline mode: displaying cached contribution graph';
        }
      };
    }

    // Also fetch live GitHub user stats
    fetch('https://api.github.com/users/Satyamkul')
      .then(res => {
        if (!res.ok) throw new Error('GitHub API response not ok');
        return res.json();
      })
      .then(user => {
        if (reposNum && user.public_repos !== undefined) {
          reposNum.textContent = user.public_repos;
        }
        if (followersNum && user.followers !== undefined) {
          followersNum.textContent = user.followers;
        }
      })
      .catch(() => {
        // Graceful silent fallback to statically declared values
      });
  }

  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      syncBtn.classList.add('syncing');
      syncLiveGitHub();
      setTimeout(() => {
        syncBtn.classList.remove('syncing');
      }, 750);
    });
  }

  // Initial live synchronization
  syncLiveGitHub();
}


