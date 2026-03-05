// ==============================
// SIDE HUD PANELS
// ==============================
(function() {
    const metrics = [
        { barId: 'vram-bar', valId: 'vram-val', base: 82, label: v => (v/100*16).toFixed(1)+'G' },
        { barId: 'gpu-bar',  valId: 'gpu-val',  base: 78, label: v => v+'%' },
        { barId: 'ram-bar',  valId: 'ram-val',  base: 48, label: v => Math.round(v/100*128)+'G' },
    ];
    function jitter(base) { return Math.min(97, Math.max(8, base + (Math.random()-.5)*14)); }
    function updateMetrics() {
        metrics.forEach(m => {
            const v = Math.round(jitter(m.base));
            const bar = document.getElementById(m.barId);
            const lbl = document.getElementById(m.valId);
            if (bar) bar.style.width = v + '%';
            if (lbl) lbl.textContent = m.label(v);
        });
    }
    updateMetrics();
    setInterval(updateMetrics, 2400);

    const tokenEl = document.getElementById('token-counter');
    function updateTokens() { if (tokenEl) tokenEl.textContent = Math.floor(Math.random()*55+18); }
    updateTokens();
    setInterval(updateTokens, 850);

    const snippets = [
        'SELECT * FROM','VEGA.TOURNEES','WHERE retard>2','fetchmany(50)',
        'ALTER SESSION','SET SCHEMA=VEGA','cursor.execute(','oracledb.connect',
        'thick_mode=True','SSEApp(mcp_app)','POST /message','tool_call=sql',
        'docker run -p','8000:8000 mcp','model=llama3.1','RAG.retrieve()',
        'embed_query(q)','cosine_sim>0.7','context_window','inference...',
    ];
    let sIdx = 0;
    const streamEl = document.getElementById('code-stream');
    function updateStream() {
        if (!streamEl) return;
        const lines = streamEl.innerHTML.split('<br>').filter(Boolean);
        lines.push(snippets[sIdx++ % snippets.length]);
        if (lines.length > 4) lines.shift();
        streamEl.innerHTML = lines.join('<br>');
    }
    setInterval(updateStream, 950);

    const latBars = document.querySelectorAll('.side-latency-bars span');
    function updateLatency() {
        latBars.forEach(b => {
            b.style.height = Math.floor(Math.random()*18+3)+'px';
            b.style.opacity = (.25 + Math.random()*.55).toFixed(2);
        });
    }
    updateLatency();
    setInterval(updateLatency, 620);

    let secs = 0;
    const uptimeEl = document.getElementById('uptime');
    setInterval(() => {
        secs++;
        const h = String(Math.floor(secs/3600)).padStart(2,'0');
        const m = String(Math.floor((secs%3600)/60)).padStart(2,'0');
        const s = String(secs%60).padStart(2,'0');
        if (uptimeEl) uptimeEl.textContent = h+':'+m+':'+s;
    }, 1000);
})();

// ==============================
// MODALS PROJETS
// ==============================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// Close on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
});

// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.open').forEach(m => {
            m.classList.remove('open');
            document.body.style.overflow = '';
        });
    }
});

// ==============================
// NAVBAR
// ==============================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id], footer[id]');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 150) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
});

// ==============================
// BURGER MENU
// ==============================
const burger = document.getElementById('burger');
const navMenu = document.getElementById('nav-menu');

burger.addEventListener('click', () => navMenu.classList.toggle('open'));
document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('open'));
});

// ==============================
// SMOOTH SCROLL
// ==============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
});

// ==============================
// REVEAL ON SCROLL
// ==============================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Stagger grids
document.querySelectorAll('.skills-grid, .projects-grid, .bts-grid').forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((child, i) => {
        child.style.transitionDelay = `${i * 90}ms`;
    });
});

document.querySelectorAll('.timeline-item.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 120}ms`;
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ==============================
// SKILL BARS
// ==============================
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
                const target = bar.getAttribute('data-w');
                setTimeout(() => bar.style.width = target + '%', 200 + i * 80);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

// ==============================
// CONTACT FORM
// ==============================
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-form');
    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;

    // Simulate send (replace with real backend/formspree)
    setTimeout(() => {
        document.getElementById('form-success').classList.add('show');
        this.reset();
        btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Envoyer le message`;
        btn.disabled = false;
    }, 1200);
});
