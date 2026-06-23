/**
 * VFX VAULT — 3D WebGL Hero System (Three.js)
 * Immersive 3D particle field + floating wireframe mesh with mouse parallax.
 * Falls back to 2D Canvas particle system if WebGL is unsupported.
 */

(function initHeroScene() {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Check WebGL availability
    function isWebGLAvailable() {
        try {
            const canvasTest = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvasTest.getContext('webgl') || canvasTest.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    if (!isWebGLAvailable()) {
        init2DFallback();
        return;
    }

    /* ════════════════════════════════════════════════════════════════════════════
       THREE.JS WEBGL IMPLEMENTATION
       ════════════════════════════════════════════════════════════════════════════ */
    let scene, camera, renderer, particles, torusKnot;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let targetX = 0, targetY = 0; // target positions for mouse movement
    let curX = 0, curY = 0;       // current interpolated positions
    let animationFrameId = null;

    // Color definitions
    const COLORS = [
        0x00ffcc, // neon
        0x00d1ff, // muzamil tagline
        0xcf9716, // gold dark
        0xffea8a, // gold light
        0x64dcff  // icy blue
    ];

    // Helper: generate a soft circular glow texture dynamically
    function createGlowTexture(colorHex) {
        const size = 32;
        const canvasTexture = document.createElement('canvas');
        canvasTexture.width = size;
        canvasTexture.height = size;
        const ctx = canvasTexture.getContext('2d');

        const rgb = new THREE.Color(colorHex);
        const r = Math.round(rgb.r * 255);
        const g = Math.round(rgb.g * 255);
        const b = Math.round(rgb.b * 255);

        // Radial gradient glow
        const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.2, `rgba(${r}, ${g}, ${b}, 0.8)`);
        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.2)`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
        ctx.fill();

        const texture = new THREE.CanvasTexture(canvasTexture);
        texture.minFilter = THREE.LinearFilter;
        return texture;
    }

    function initWebGL() {
        // 1. Scene & Camera Setup
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.08);

        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
        camera.position.z = 8;

        // 2. Renderer Setup
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height, false);

        // 3. Central Wireframe Geometry (Torus Knot)
        const torusGeometry = new THREE.TorusKnotGeometry(1.6, 0.45, 120, 16);
        const torusMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffcc,
            wireframe: true,
            transparent: true,
            opacity: 0.08
        });
        torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
        scene.add(torusKnot);

        // 4. Create Group of Floating Particles
        const particleCount = window.innerWidth < 768 ? 120 : 250;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            // Randomly scatter in a box volume
            const x = (Math.random() - 0.5) * 16;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 10;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Give particles drift velocities
            velocities.push({
                x: (Math.random() - 0.5) * 0.008,
                y: (Math.random() - 0.5) * 0.008 - 0.002, // upward drift
                z: (Math.random() - 0.5) * 0.008
            });

            // Assign color
            const colorHex = COLORS[Math.floor(Math.random() * COLORS.length)];
            const color = new THREE.Color(colorHex);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Use custom shader/point material with dynamically generated texture
        const texture = createGlowTexture(0x00ffcc);
        const particleMaterial = new THREE.PointsMaterial({
            size: window.innerWidth < 768 ? 0.35 : 0.5,
            map: texture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true
        });

        particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // 5. Interaction Event Listeners
        const header = canvas.parentElement;
        if (header) {
            header.addEventListener('mousemove', (e) => {
                // Map mouse position to range [-1, 1]
                const rect = header.getBoundingClientRect();
                const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                const my = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
                targetX = mx * 1.5;
                targetY = my * 1.0;
            });
            header.addEventListener('mouseleave', () => {
                targetX = 0;
                targetY = 0;
            });
        }

        // Run animation loop
        animate();
    }

    function animate() {
        animationFrameId = requestAnimationFrame(animate);

        // Smooth camera lerp for parallax
        curX += (targetX - curX) * 0.05;
        curY += (targetY - curY) * 0.05;
        camera.position.x = curX;
        camera.position.y = curY;
        camera.lookAt(scene.position);

        // Rotate central wireframe knot
        if (torusKnot) {
            torusKnot.rotation.x += 0.003;
            torusKnot.rotation.y += 0.005;
            // Pulsing wireframe intensity
            const pulse = 0.06 + Math.sin(Date.now() * 0.001) * 0.02;
            torusKnot.material.opacity = pulse;
        }

        // Update particle positions
        if (particles) {
            const positions = particles.geometry.attributes.position.array;
            const count = positions.length / 3;

            for (let i = 0; i < count; i++) {
                // Read velocities array or use standard index formula
                const idx = i * 3;
                
                // Slight floating movement
                positions[idx] += 0.002 * Math.sin(Date.now() * 0.0005 + i);
                positions[idx + 1] += 0.002; // slow upward drift
                positions[idx + 2] += 0.001 * Math.cos(Date.now() * 0.0005 + i);

                // Wrap-around boundary checks
                if (positions[idx + 1] > 6) {
                    positions[idx + 1] = -6;
                }
                if (positions[idx] > 10) positions[idx] = -10;
                if (positions[idx] < -10) positions[idx] = 10;
            }
            particles.geometry.attributes.position.needsUpdate = true;
        }

        renderer.render(scene, camera);
    }

    /* ── visibility check — freeze loop when tab hidden ────────────────── */
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        } else {
            if (!animationFrameId) {
                animate();
            }
        }
    });

    /* ── responsive resize ──────────────────────────────────────────────── */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            if (camera && renderer) {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height, false);
            }
        }, 150);
    });

    // Start WebGL
    if (document.readyState === 'complete') {
        setTimeout(initWebGL, 300);
    } else {
        window.addEventListener('load', () => setTimeout(initWebGL, 300));
    }


    /* ════════════════════════════════════════════════════════════════════════════
       2D CANVAS FALLBACK IMPLEMENTATION
       ════════════════════════════════════════════════════════════════════════════ */
    function init2DFallback() {
        const ctx = canvas.getContext('2d');
        const DPR = Math.min(window.devicePixelRatio || 1, 2);
        const PARTICLE_COUNT = window.innerWidth < 768 ? 35 : 75;
        const CONNECTION_DIST = window.innerWidth < 768 ? 80 : 120;
        const MOUSE_REPEL_R = 90;

        let W, H, particles;
        let mouse = { x: -9999, y: -9999 };
        let rafId = null;
        let frame = 0;

        const FALLBACK_COLORS = [
            [0, 255, 204],
            [0, 209, 255],
            [207, 151, 16],
            [255, 234, 138],
            [100, 220, 255],
        ];

        function resize() {
            W = canvas.offsetWidth;
            H = canvas.offsetHeight;
            canvas.width = Math.round(W * DPR);
            canvas.height = Math.round(H * DPR);
            ctx.scale(DPR, DPR);
        }

        function mkParticle() {
            const rgb = FALLBACK_COLORS[Math.floor(Math.random() * FALLBACK_COLORS.length)];
            const baseOpacity = Math.random() * 0.45 + 0.08;
            const pulsing = Math.random() > 0.55;
            return {
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35 - 0.08,
                r: Math.random() * 2.2 + 0.5,
                rgb,
                baseOpacity,
                opacity: baseOpacity,
                pulsing,
                pPhase: Math.random() * Math.PI * 2,
                pSpeed: Math.random() * 0.018 + 0.006,
            };
        }

        function initParticles() {
            particles = Array.from({ length: PARTICLE_COUNT }, mkParticle);
        }

        const header = canvas.parentElement;
        if (header) {
            header.addEventListener('mousemove', e => {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });
            header.addEventListener('mouseleave', () => {
                mouse.x = -9999;
                mouse.y = -9999;
            });
        }

        function draw() {
            rafId = requestAnimationFrame(draw);
            ctx.clearRect(0, 0, W, H);
            frame++;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -5) p.x = W + 5;
                if (p.x > W + 5) p.x = -5;
                if (p.y < -5) p.y = H + 5;
                if (p.y > H + 5) p.y = -5;

                if (p.pulsing) {
                    p.opacity = p.baseOpacity * (0.5 + 0.5 * Math.sin(frame * p.pSpeed + p.pPhase));
                }

                const dxM = p.x - mouse.x;
                const dyM = p.y - mouse.y;
                const dM = Math.sqrt(dxM * dxM + dyM * dyM);
                if (dM > 0 && dM < MOUSE_REPEL_R) {
                    const f = (MOUSE_REPEL_R - dM) / MOUSE_REPEL_R * 0.4;
                    p.x += (dxM / dM) * f;
                    p.y += (dyM / dM) * f;
                }

                const [rVal, gVal, bVal] = p.rgb;
                const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
                grd.addColorStop(0, `rgba(${rVal},${gVal},${bVal},${p.opacity})`);
                grd.addColorStop(1, `rgba(${rVal},${gVal},${bVal},0)`);

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rVal},${gVal},${bVal},${Math.min(p.opacity * 1.8, 0.9)})`;
                ctx.fill();
            }

            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const d = Math.sqrt(dx * dx + dy * dy);

                    if (d < CONNECTION_DIST) {
                        const alpha = (1 - d / CONNECTION_DIST) * 0.14;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(0,255,204,${alpha})`;
                        ctx.stroke();
                    }
                }
            }
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(rafId);
                rafId = null;
            } else if (!rafId) {
                draw();
            }
        });

        let resizeTimer2D;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer2D);
            resizeTimer2D = setTimeout(() => {
                resize();
                initParticles();
            }, 200);
        });

        function boot() {
            resize();
            initParticles();
            draw();
        }

        setTimeout(boot, 400);
    }
})();
