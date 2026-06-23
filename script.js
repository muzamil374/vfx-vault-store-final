/**
 * VFX VAULT — Enhanced Gateway Engine
 * Developer: Muzamil (MH7)
 *
 * Enhancement layers added (non-breaking, additive):
 *   [+] Cinematic loader dismiss
 *   [+] Custom magnetic cursor (desktop)
 *   [+] Scroll-reveal for cards (IntersectionObserver)
 *   [+] 3D perspective tilt on cards (mouse-tracking)
 *   [+] Search / filter system
 *
 * ORIGINAL code blocks clearly marked — zero logic changed:
 *   [ORIGINAL] Cashfree SDK init
 *   [ORIGINAL] VFX_CONFIG bundles
 *   [ORIGINAL] Security (contextmenu / keydown)
 *   [ORIGINAL] renderGrid + lazy-img observer
 *   [ORIGINAL] openPre / closePre / togglePlay
 *   [ORIGINAL] handleAction (payment flow)
 */

/* ════════════════════════════════════════════════════════════════════════════
   [ORIGINAL] CASHFREE INIT
   Initialize client SDK dynamically: 'sandbox' on localhost, 'production' live.
   ════════════════════════════════════════════════════════════════════════════ */
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const cashfree = Cashfree({ mode: isLocal ? "sandbox" : "production" });

/* ════════════════════════════════════════════════════════════════════════════
   [ORIGINAL] BUNDLE CONFIGURATION
   ════════════════════════════════════════════════════════════════════════════ */
const VFX_CONFIG = {
    bundles: [
        { id: 1,  name: "INDUSTRIAL NOIR BUNDLE",    price: 69 },
        { id: 2,  name: "NEON CIRCUIT BUNDLE",        price: 69 },
        { id: 3,  name: "CELESTIAL BOREALIS BUNDLE",  price: 69 },
        { id: 4,  name: "ANALOG TEXTURE BUNDLE",      price: 0  }, // FREE
        { id: 5,  name: "MAGMA GLOW BUNDLE",          price: 69 },
        { id: 6,  name: "SPECTRUM NEON BUNDLE",       price: 69 },
        { id: 7,  name: "ECO GLITCH BUNDLE",          price: 69 },
        { id: 8,  name: "OPALSCENT FLOW BUNDLE",      price: 69 },
        { id: 9,  name: "QUIET LUXURY BUNDLE",        price: 69 },
        { id: 10, name: "AETHER GLOW BUNDLE",         price: 69 },
        { id: 11, name: "VELVET SHADOW BUNDLE",       price: 69 },
        { id: 12, name: "PRISMATIC WAVE BUNDLE",      price: 69 },
        { id: 13, name: "NOVA ENERGY BUNDLE",         price: 69 },
        { id: 14, name: "VOLCANIC BUNDLE",            price: 69 },
        { id: 15, name: "CARBON MINT BUNDLE",         price: 69 },
        { id: 16, name: "CELESTIAL VIBE BUNDLE",      price: 69 },
        { id: 17, name: "VFX ASSETS BUNDLE",          price: 69 },
        { id: 18, name: "COSMIC PULSE BUNDLE",        price: 69 },
        { id: 19, name: "LUMINA CORE BUNDLE",         price: 69 },
        { id: 20, name: "NEBULA SURGE BUNDLE",        price: 69 },
        { id: 21, name: "ASTRAL VELOCITY BUNDLE",     price: 69 },
        { id: 22, name: "PHOTON BLAST BUNDLE",        price: 69 },
        { id: 23, name: "QUANTUM FLARE BUNDLE",       price: 69 },
        { id: 24, name: "INFINITY GLOW BUNDLE",       price: 69 },
        { id: 25, name: "ECLIPSE AURA BUNDLE",        price: 69 },
        { id: 26, name: "NEON PHANTOM BUNDLE",        price: 69 },
        { id: 27, name: "VOID REACTOR BUNDLE",        price: 69 },
        { id: 28, name: "SOLAR VORTEX BUNDLE",        price: 69 },
        { id: 29, name: "CYBER STORM BUNDLE",         price: 69 },
        { id: 30, name: "GALAXY RUSH BUNDLE",         price: 69 },
        { id: 31, name: "SHADOW IGNITE BUNDLE",       price: 69 },
        { id: 32, name: "TITANIUM WAVE BUNDLE",       price: 69 },
        { id: 33, name: "HYPERNOVA CORE BUNDLE",      price: 69 },
        { id: 34, name: "RADIANT STRIKE BUNDLE",      price: 69 }
    ]
};

/* ════════════════════════════════════════════════════════════════════════════
   [ORIGINAL] SECURITY — context menu & keyboard shortcuts blocked
   ════════════════════════════════════════════════════════════════════════════ */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'i')) e.preventDefault();
});

/* ════════════════════════════════════════════════════════════════════════════
   [+NEW] CINEMATIC LOADER DISMISS
   Hides loader 2.2s after window load (matches CSS bar animation duration).
   Removed from DOM after fade to free memory.
   ════════════════════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('vfx-loader');
        if (!loader) return;
        loader.classList.add('hide');
        // Remove from DOM after CSS transition completes (0.9s)
        setTimeout(() => loader.remove(), 950);
    }, 2200);
});

/* ════════════════════════════════════════════════════════════════════════════
   [+NEW] CUSTOM MAGNETIC CURSOR
   
   Architecture:
   - Dot follows mouse exactly (synchronous transform in mousemove)
   - Ring follows with lerp smoothing (requestAnimationFrame loop)
   - Ring expands on interactive elements via .hover class
   - Collapses on mousedown (.clicking class)
   - Entire feature skipped on touch/mobile (≤768px)
   ════════════════════════════════════════════════════════════════════════════ */
(function initCursor() {
    if (window.innerWidth <= 768) return;

    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mx = 0, my = 0;   // current mouse position
    let rx = 0, ry = 0;   // ring lerp position
    let rafId;

    // Dot: snaps to cursor instantly
    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    });

    // Ring: smooth lag via lerp (linear interpolation)
    function animRing() {
        rx += (mx - rx) * 0.11;
        ry += (my - ry) * 0.11;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        rafId = requestAnimationFrame(animRing);
    }
    animRing();

    // Expand ring on interactive elements
    const interactiveSelectors = 'button, a, .vfx-card, input, .search-clear, .close-pre-text, .video-wrapper';
    document.addEventListener('mouseover', e => {
        if (e.target.closest(interactiveSelectors)) ring.classList.add('hover');
    });
    document.addEventListener('mouseout', e => {
        if (e.target.closest(interactiveSelectors)) ring.classList.remove('hover');
    });

    // Click pulse
    document.addEventListener('mousedown', () => {
        ring.classList.add('clicking');
        ring.classList.remove('hover');
    });
    document.addEventListener('mouseup', () => {
        ring.classList.remove('clicking');
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity  = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
    });
})();

/* ════════════════════════════════════════════════════════════════════════════
   [ORIGINAL] RENDER GRID — unchanged HTML structure, added data-name attr
   for search filtering. All original lazy-load logic preserved exactly.
   ════════════════════════════════════════════════════════════════════════════ */
(function renderGrid() {
    const grid = document.getElementById('bundle-grid');
    if (!grid) return;

    grid.innerHTML = VFX_CONFIG.bundles.map(b => {
        const isFree = b.price === 0;
        return `
        <article class="vfx-card" data-name="${b.name.toLowerCase()}" data-id="${b.id}">
            <div class="thumb-container">
                <img data-src="assets/thumbnails/b${b.id}.png"
                     src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3C/svg%3E"
                     class="vfx-thumb lazy-img" loading="lazy" decoding="async" width="320" height="180"
                     onerror="this.src='assets/thumbnails/b1.png'">
            </div>
            <span class="card-title">${b.name}${isFree ? ' <b style="color:var(--neon)">• FREE</b>' : ''}</span>
            <div class="btn-row" id="row-${b.id}">
                <button class="preview-btn" onclick="openPre(${b.id})">PREVIEW</button>
                <button class="buy-btn"     onclick="handleAction(${b.id})">${isFree ? 'FREE UNLOCK' : 'BUY ₹' + b.price}</button>
            </div>
            <div id="box-${b.id}" class="inline-preview" style="display:none; flex-direction:column;">
                <div id="vids-${b.id}"></div>
                <button class="buy-btn" style="width:100%; margin-top:10px; padding:18px;" onclick="handleAction(${b.id})">
                    ${isFree ? 'DOWNLOAD NOW' : 'PAY ₹' + b.price + ' TO UNLOCK ALL'}
                </button>
                <p class="close-pre-text" onclick="closePre(${b.id})">CLOSE PREVIEW</p>
            </div>
        </article>`;
    }).join('');

    // [ORIGINAL] Lazy image loading via IntersectionObserver
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy-img');
                observer.unobserve(img);
            });
        }, { rootMargin: '300px 0px' });

        grid.querySelectorAll('.lazy-img').forEach(img => imgObserver.observe(img));
    } else {
        // Fallback for browsers without IO support
        grid.querySelectorAll('.lazy-img').forEach(img => { img.src = img.dataset.src; });
    }
})();

/* ════════════════════════════════════════════════════════════════════════════
   [+NEW] SCROLL REVEAL
   
   Cards start invisible (opacity:0, translateY:32px in CSS).
   IntersectionObserver adds .revealed class as each card enters viewport.
   Stagger delay based on column position (index % columns) keeps it snappy.
   ════════════════════════════════════════════════════════════════════════════ */
(function initScrollReveal() {
    const cards = Array.from(document.querySelectorAll('.vfx-card'));
    if (!cards.length) return;

    // Immediately reveal cards that are already in view on load
    const STAGGER_MS = 80;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const card  = entry.target;
            const col   = cards.indexOf(card) % 4; // up to 4 columns
            const delay = col * STAGGER_MS;
            setTimeout(() => card.classList.add('revealed'), delay);
            revealObserver.unobserve(card);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    cards.forEach(card => revealObserver.observe(card));
})();

/* ════════════════════════════════════════════════════════════════════════════
   [+NEW] 3D CARD TILT
   
   On mousemove: compute normalised offset from card center (-1..1),
   apply a mild perspective rotate. All via CSS transform — GPU only.
   On mouseleave: reset to identity.
   Skipped on touch devices.
   ════════════════════════════════════════════════════════════════════════════ */
(function initCardTilt() {
    if ('ontouchstart' in window || window.innerWidth <= 768) return;

    const MAX_TILT = 5; // degrees

    document.querySelectorAll('.vfx-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const nx = ((e.clientX - r.left)  / r.width  - 0.5) * 2; // -1 to 1
            const ny = ((e.clientY - r.top)   / r.height - 0.5) * 2; // -1 to 1

            card.style.transform = [
                'translateY(-8px)',
                `perspective(900px)`,
                `rotateX(${-ny * MAX_TILT}deg)`,
                `rotateY(${nx * MAX_TILT}deg)`
            ].join(' ');
        });

        card.addEventListener('mouseleave', () => {
            // Smooth reset — CSS transition handles the ease-back
            card.style.transform = '';
        });
    });
})();

/* ════════════════════════════════════════════════════════════════════════════
   [+NEW] SEARCH / FILTER
   
   Filters cards by matching data-name attribute against input value.
   Updates visible count, shows/hides no-results message.
   Clear button appears when input has content.
   ════════════════════════════════════════════════════════════════════════════ */
(function initSearch() {
    const input      = document.getElementById('search-input');
    const clearBtn   = document.getElementById('search-clear');
    const countEl    = document.getElementById('result-count');
    const noResults  = document.getElementById('no-results');
    if (!input) return;

    const cards = Array.from(document.querySelectorAll('.vfx-card'));

    function filterBundles(rawQuery) {
        const q = rawQuery.toLowerCase().trim();
        let visible = 0;

        cards.forEach(card => {
            const isMatch = !q || (card.dataset.name || '').includes(q);
            card.style.display = isMatch ? '' : 'none';
            if (isMatch) visible++;
        });

        if (countEl) countEl.textContent = visible;
        if (clearBtn) clearBtn.style.display = q ? 'block' : 'none';
        if (noResults) noResults.style.display = visible === 0 ? 'flex' : 'none';
    }

    input.addEventListener('input', e => filterBundles(e.target.value));

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            input.value = '';
            filterBundles('');
            input.focus();
        });
    }
})();

/* ════════════════════════════════════════════════════════════════════════════
   [+NEW] CATEGORY FILTER
   
   Maps each bundle ID to one or more category keywords.
   Clicking a tab filters cards (combined with any active search query).
   Works cooperatively with the search filter — both apply simultaneously.
   ════════════════════════════════════════════════════════════════════════════ */
(function initCategoryFilter() {
    const tabs = document.querySelectorAll('.cat-btn');
    if (!tabs.length) return;

    // Category → bundle IDs mapping
    // Based on bundle names — update freely as inventory grows
    const CATEGORY_MAP = {
        all:    null, // null = show all
        neon:   [2, 6, 26, 12, 18, 22, 29],   // neon/circuit/spectrum/prismatic
        cosmic: [3, 10, 18, 20, 21, 25, 28, 30, 33], // celestial/aether/nebula/astral/eclipse/solar/galaxy/hypernova
        glitch: [7, 29, 27, 31, 32],            // eco glitch/cyber storm/void/shadow/titanium
        luxury: [9, 11, 15, 16],                // quiet luxury/velvet/carbon/celestial vibe
        free:   [4],                            // analog texture — free bundle
    };

    let activeCategory = 'all';

    function applyFilters() {
        const searchQuery = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
        const allowedIds  = CATEGORY_MAP[activeCategory]; // null = all
        const cards       = document.querySelectorAll('.vfx-card');
        let visible = 0;

        cards.forEach(card => {
            const id        = parseInt(card.dataset.id, 10);
            const name      = (card.dataset.name || '');
            const catMatch  = !allowedIds || allowedIds.includes(id);
            const searchMatch = !searchQuery || name.includes(searchQuery);
            const show      = catMatch && searchMatch;

            card.style.display = show ? '' : 'none';
            if (show) visible++;
        });

        const countEl = document.getElementById('result-count');
        if (countEl) countEl.textContent = visible;

        const noResults = document.getElementById('no-results');
        if (noResults) noResults.style.display = visible === 0 ? 'flex' : 'none';
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeCategory = tab.dataset.cat;
            applyFilters();
        });
    });

    // Sync with search filter — re-apply category when search changes
    document.getElementById('search-input')?.addEventListener('input', applyFilters);
    document.getElementById('search-clear')?.addEventListener('click', applyFilters);
})();

/* ════════════════════════════════════════════════════════════════════════════
   [+NEW] SCROLL TO TOP
   
   Appears when user scrolls > 400px from top.
   Smooth scroll to top on click.
   ════════════════════════════════════════════════════════════════════════════ */
(function initScrollTop() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* ════════════════════════════════════════════════════════════════════════════
   [ORIGINAL] openPre — show inline preview panel

   ════════════════════════════════════════════════════════════════════════════ */
function openPre(id) {
    const box  = document.getElementById(`box-${id}`);
    const vids = document.getElementById(`vids-${id}`);
    document.getElementById(`row-${id}`).style.display = 'none';

    const start = (id - 1) * 4 + 1;
    let h = '';
    for (let i = start; i < start + 4; i++) {
        h += `
        <div class="video-wrapper" onclick="togglePlay(this)">
            <div class="video-protection-shield"></div>
            <div class="play-overlay"><div class="play-icon"></div></div>
            <video loop muted playsinline preload="none" data-src="assets/previews/gt${i}.mp4"></video>
        </div>`;
    }
    vids.innerHTML = h;
    box.style.display = 'flex';
}

/* ════════════════════════════════════════════════════════════════════════════
   [ORIGINAL] togglePlay — play/pause with single-video enforcement
   ════════════════════════════════════════════════════════════════════════════ */
function togglePlay(wrapper) {
    const video = wrapper.querySelector('video');

    // Lazy-load video src on first play
    if (!video.src || video.src === window.location.href) {
        video.src = video.dataset.src;
        video.load();
    }

    if (video.paused) {
        // Pause all other videos first
        document.querySelectorAll('video').forEach(v => {
            if (v !== video) {
                v.pause();
                v.closest('.video-wrapper')?.classList.remove('playing');
            }
        });
        video.play().catch(() => {});
        wrapper.classList.add('playing');
    } else {
        video.pause();
        wrapper.classList.remove('playing');
    }
}

/* ════════════════════════════════════════════════════════════════════════════
   [ORIGINAL] closePre — collapse preview panel and free video memory
   ════════════════════════════════════════════════════════════════════════════ */
function closePre(id) {
    const vids = document.getElementById(`vids-${id}`);

    // Detach src to release memory / stop network requests
    vids.querySelectorAll('video').forEach(v => {
        v.pause();
        v.removeAttribute('src');
        v.load();
        v.remove();
    });

    document.getElementById(`box-${id}`).style.display = 'none';
    document.getElementById(`row-${id}`).style.display = 'flex';
    vids.innerHTML = '';
}

/* ════════════════════════════════════════════════════════════════════════════
   [ORIGINAL] handleAction — SECURE CLIENT CHECKOUT OVERLAY TRIGGER
   
   No changes made. Payment flow:
   1. Dispatches tokenization to /api/create-order (Vercel serverless)
   2. Launches Cashfree Checkout Overlay on payment_session_id
   3. returnUrl → /success/unlocked.html with bundle_id + order_id
   ════════════════════════════════════════════════════════════════════════════ */
async function handleAction(id) {
    const bundle = VFX_CONFIG.bundles.find(x => x.id === id);
    if (!bundle) return;

    // Free bundle — skip payment, redirect to unlock page directly
    if (bundle.price === 0) {
        window.location.href = `./success/unlocked.html?id=${id}&txStatus=SUCCESS`;
        return;
    }

    try {
        // Step 1: Dispatches tokenization query to Vercel cloud serverless function
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bundleId: bundle.id, amount: bundle.price })
        });

        const data = await response.json();
        if (!data.payment_session_id) {
            alert("Payment server error initialization. Verify dashboard active logs.");
            return;
        }

        // Step 2: Launches Cashfree Checkout Overlay directly on top of page
        const checkoutOptions = {
            paymentSessionId: data.payment_session_id,
            returnUrl: `${window.location.origin}/success/unlocked.html?bundle_id=${bundle.id}&order_id={order_id}`
        };

        cashfree.checkout(checkoutOptions); // Opens smooth modal overlay on screen

    } catch (err) {
        console.error("Gateway execution error:", err);
        alert("Connectivity error during checkout execution.");
    }
}
