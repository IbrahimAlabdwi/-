/* ==========================================================
   حكاية فايا | The Story of Faya — main.js
   Interactive journey: welcome → prank → reveal → family → letter
   ========================================================== */

'use strict';

/* ---------- Helpers ---------- */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================
   PHASE NAVIGATION
   ========================================================== */
const phases = ['welcome', 'prank', 'reveal', 'family', 'letter'];
let currentPhase = 'welcome';

function goToPhase(name, opts = {}) {
    if (!phases.includes(name)) return;
    const from = $('#phase-' + currentPhase);
    const to = $('#phase-' + name);

    // Fade out current
    if (from) {
        from.classList.remove('active');
        from.style.transition = 'opacity .5s ease';
        from.style.opacity = '0';
        setTimeout(() => { from.style.opacity = ''; }, 520);
    }

    // Fade in target
    setTimeout(() => {
        to.classList.add('active');
        to.style.transition = 'opacity .5s ease';
        to.style.opacity = '0';
        requestAnimationFrame(() => { to.style.opacity = '1'; });
        setTimeout(() => { to.style.opacity = ''; }, 520);
    }, 260);

    currentPhase = name;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.dispatchEvent(new CustomEvent('phase:change', { detail: { phase: name } }));

    if (opts.onEnter) opts.onEnter();
}

/* ==========================================================
   PHASE 1: WELCOME
   ========================================================== */
$('#enterBtn').addEventListener('click', () => {
    playSound('pop');
    goToPhase('prank');
});

/* ==========================================================
   PHASE 2: THE PRANK — the escaping button
   ========================================================== */
const prankArea = $('#prankArea');
const escapeBtn = $('#escapeBtn');
const mercyBtn = $('#mercyBtn');
const speechBubble = $('#speechBubble');
const hintBubble = $('#hintBubble');

const prankMessages = [
    'قريب يا أيمن... لكن مش كفاية 😂',
    'ههههه حاول مرة ثانية!',
    'حتى الزر عارف أنك مستعجل يا أبونا!',
    'يا أيمن، أنت أصبحت أبًا، لكن يبدو أنك لم تتعلم بعد كيف تمسك الأشياء الصغيرة 😂',
    'عم أيوم تعب وهو يشوف محاولاتك!',
    'الزر صار أسرع منك! 🏃‍♂️',
    'ركّز يا أيمن... المفاجأة تستاهل!',
];
let escapeAttempts = 0;
const MAX_ESCAPES = 7;

function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Move button to random position within the prank area
function moveEscapeButton(triggerX, triggerY) {
    const area = prankArea.getBoundingClientRect();
    const btn = escapeBtn.getBoundingClientRect();

    // Available space (padding-safe)
    const pad = 20;
    const maxX = area.width - btn.width - pad;
    const maxY = area.height - btn.height - pad;
    if (maxX <= 0 || maxY <= 0) return; // area too small

    const x = getRandomInRange(pad, Math.max(pad + 1, maxX));
    const y = getRandomInRange(pad, Math.max(pad + 1, maxY));

    // Prefer moving AWAY from the cursor for a fun chase feel
    let fx = x, fy = y;
    if (triggerX !== undefined) {
        const areaCX = area.left + area.width / 2;
        const areaCY = area.top + area.height / 2;
        const awayX = triggerX < areaCX ? 1 : -1;
        const awayY = triggerY < areaCY ? 1 : -1;
        fx = awayX > 0 ? getRandomInRange(area.width / 2, maxX) : getRandomInRange(pad, area.width / 2);
        fy = awayY > 0 ? getRandomInRange(area.height / 2, maxY) : getRandomInRange(pad, area.height / 2);
    }

    escapeBtn.style.position = 'absolute';
    escapeBtn.style.left = Math.max(0, Math.min(maxX, fx)) + 'px';
    escapeBtn.style.top = Math.max(0, Math.min(maxY, fy)) + 'px';
}

function showSpeech(text) {
    speechBubble.textContent = text;
    speechBubble.classList.remove('hidden');
    // re-trigger animation
    speechBubble.style.animation = 'none';
    void speechBubble.offsetWidth;
    speechBubble.style.animation = '';
}

function onEscapeAttempt(e) {
    escapeAttempts++;
    playSound('whoosh');

    // Move button away from pointer
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? undefined;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? undefined;
    moveEscapeButton(clientX, clientY);

    // Show sarcastic message
    const msg = prankMessages[Math.min(escapeAttempts - 1, prankMessages.length - 1)];
    showSpeech(msg);
    playSound('laugh');

    // After enough attempts, reveal the mercy button
    if (escapeAttempts >= MAX_ESCAPES) {
        escapeBtn.classList.add('hidden');
        mercyBtn.classList.remove('hidden');
        mercyBtn.style.animation = 'popIn .6s var(--ease) both';
        showSpeech('👏 أخيرًا... زرعتنا كلها! اضغط الآن يا أيمن 😄');
    }
}

// Desktop: escape on mouse proximity
escapeBtn.addEventListener('mouseenter', onEscapeAttempt);
// Mobile / touch: escape on touchstart (before click lands)
escapeBtn.addEventListener('touchstart', onEscapeAttempt, { passive: true });
// Click fallback (if it ever lands) — escape too
escapeBtn.addEventListener('click', (e) => { e.preventDefault(); onEscapeAttempt(e); });

mercyBtn.addEventListener('click', () => {
    playSound('pop');
    // Cinematic transition to reveal
    goToPhase('reveal', { onEnter: startReveal });
});

/* ==========================================================
   PHASE 3: THE REVEAL
   ========================================================== */
let revealDone = false;

function startReveal() {
    if (revealDone) return;
    revealDone = true;

    const intro = $('#revealIntro');
    const name = $('#fayaName');
    const welcome = $('#revealWelcome');
    const nextBtn = $('#revealNextBtn');
    const phase = $('#phase-reveal');

    // Dim-in cinematic
    phase.classList.add('enter');

    // Intro fades in (CSS handles it), then reveal the name
    setTimeout(() => {
        name.classList.add('revealed');
        // Sparkle burst + sound at reveal moment
        if (!reducedMotion) {
            burstConfetti(160);
            burstHearts();
        }
        playSound('chime');

        // Then welcome text
        setTimeout(() => {
            welcome.classList.add('show');
            // Gentle continuous sparkle
            const interval = setInterval(() => {
                if (currentPhase !== 'reveal') { clearInterval(interval); return; }
                if (!reducedMotion) {
                    burstSparkles(8, 0.5);
                    playSound('sparkle');
                }
            }, 1400);

            setTimeout(() => nextBtn.classList.remove('hidden'), 1400);
        }, 1900);
    }, 1100);
}

$('#revealNextBtn').addEventListener('click', () => {
    playSound('pop');
    goToPhase('family', { onEnter: runFamilyParagraphs });
});

/* ==========================================================
   PHASE 4: FAMILY — sequential paragraph reveal
   ========================================================== */
function runFamilyParagraphs() {
    const paras = $$('.family-text p');
    paras.forEach((p, i) => {
        setTimeout(() => p.classList.add('para-in'), 500 + i * 900);
    });
}

$('#familyNextBtn').addEventListener('click', () => {
    playSound('pop');
    goToPhase('letter');
});

/* ==========================================================
   PHASE 5: LETTER — scroll reveal
   ========================================================== */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

$$('[data-reveal]').forEach(el => revealObserver.observe(el));

// Replay / Restart
$('#replayBtn').addEventListener('click', () => {
    playSound('pop');
    goToPhase('reveal', { onEnter: startReveal });
});
$('#restartBtn').addEventListener('click', () => {
    playSound('pop');
    // Reset prank state
    escapeAttempts = 0;
    escapeBtn.classList.remove('hidden');
    escapeBtn.style.position = '';
    escapeBtn.style.left = '';
    escapeBtn.style.top = '';
    mercyBtn.classList.add('hidden');
    speechBubble.classList.add('hidden');
    revealDone = false;
    goToPhase('welcome');
});

/* ==========================================================
   CANVAS FX — particles, confetti, hearts, sparkles
   ========================================================== */
const canvas = $('#fxCanvas');
const ctx = canvas.getContext('2d');
let W, H;
let fxItems = [];

function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function spawnItem(item) { fxItems.push(item); }

// Gentle floating sparkles (ambient)
function spawnAmbient() {
    for (let i = 0; i < 24; i++) {
        fxItems.push({
            type: 'sparkle',
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.2,
            vy: -(Math.random() * 0.4 + 0.1),
            size: Math.random() * 2 + 1,
            life: 1,
            decay: Math.random() * 0.002 + 0.001,
            color: Math.random() > 0.5 ? '#d4af37' : '#e8a4b8',
        });
    }
}

// Burst of confetti pieces
function burstConfetti(count = 120) {
    const colors = ['#d4af37', '#e8a4b8', '#f5e7c9', '#f0d98c', '#c98a9b', '#ffffff'];
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 3;
        fxItems.push({
            type: 'confetti',
            x: W / 2, y: H * 0.3,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 4,
            size: Math.random() * 7 + 4,
            life: 1,
            decay: Math.random() * 0.006 + 0.003,
            color: colors[Math.floor(Math.random() * colors.length)],
            rot: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * 0.3,
        });
    }
}

// Floating hearts
function burstHearts(count = 20) {
    for (let i = 0; i < count; i++) {
        fxItems.push({
            type: 'heart',
            x: W / 2 + (Math.random() - 0.5) * 200,
            y: H * 0.35,
            vx: (Math.random() - 0.5) * 2,
            vy: -(Math.random() * 2.5 + 1),
            size: Math.random() * 16 + 10,
            life: 1,
            decay: Math.random() * 0.004 + 0.002,
            color: ['#e8a4b8', '#c98a9b', '#f0d98c'][Math.floor(Math.random() * 3)],
        });
    }
}

// Small sparkle bursts
function burstSparkles(count = 8, power = 1) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 * power + 0.5;
        fxItems.push({
            type: 'sparkle',
            x: W / 2 + (Math.random() - 0.5) * W * 0.6,
            y: H * 0.3 + (Math.random() - 0.5) * 100,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            size: Math.random() * 3 + 1,
            life: 1,
            decay: Math.random() * 0.02 + 0.01,
            color: '#f0d98c',
        });
    }
}

function drawHeart(x, y, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.3);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size * 0.3);
    ctx.bezierCurveTo(x - size / 2, y + size * 0.6, x, y + size * 0.85, x, y + size);
    ctx.bezierCurveTo(x, y + size * 0.85, x + size / 2, y + size * 0.6, x + size / 2, y + size * 0.3);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size * 0.3);
    ctx.fill();
    ctx.restore();
}

function drawStar(x, y, r, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#f0d98c';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        const px = x + r * Math.cos(angle);
        const py = y + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function animate() {
    ctx.clearRect(0, 0, W, H);

    fxItems = fxItems.filter(i => i.life > 0);

    for (const item of fxItems) {
        item.x += item.vx;
        item.y += item.vy;
        item.vy += item.type === 'confetti' ? 0.12 : 0.02;
        item.vx *= 0.99;
        item.life -= item.decay;

        if (item.type === 'confetti') {
            item.rot += item.vr;
            ctx.save();
            ctx.globalAlpha = Math.max(0, item.life);
            ctx.translate(item.x, item.y);
            ctx.rotate(item.rot);
            ctx.fillStyle = item.color;
            ctx.fillRect(-item.size / 2, -item.size / 4, item.size, item.size / 2);
            ctx.restore();
        } else if (item.type === 'heart') {
            drawHeart(item.x, item.y, item.size, item.color, Math.max(0, item.life));
        } else if (item.type === 'sparkle') {
            drawStar(item.x, item.y, item.size, Math.max(0, item.life));
        }
    }

    requestAnimationFrame(animate);
}

// Ambient sparkles only in welcome/reveal for subtlety
document.addEventListener('phase:change', (e) => {
    const phase = e.detail.phase;
    if (phase === 'welcome' || phase === 'reveal') spawnAmbient();
});

spawnAmbient();
if (!reducedMotion) animate();

/* ==========================================================
   AUDIO — optional, generated Web Audio, no external files
   ========================================================== */
let audioCtx = null;
let musicOn = false;
let soundOn = true;
let musicGain = null;
let musicTimer = null;
let musicStep = 0;

// Simple, gentle lullaby-like arpeggio loop (generated, so no files needed)
const melody = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 329.63]; // C E G C' G E D E

function ensureAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTone(freq, dur = 0.5, type = 'sine', vol = 0.15) {
    if (!audioCtx || !soundOn) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur + 0.1);
}

function playSound(name) {
    if (!soundOn || reducedMotion) return;
    ensureAudio();
    if (!audioCtx) return;
    switch (name) {
        case 'pop': playTone(520, 0.15, 'triangle', 0.12); setTimeout(() => playTone(660, 0.12, 'triangle', 0.1), 60); break;
        case 'whoosh': playTone(220, 0.2, 'sawtooth', 0.05); break;
        case 'laugh': playTone(180, 0.1, 'square', 0.05); setTimeout(() => playTone(160, 0.1, 'square', 0.05), 110); break;
        case 'chime':
            [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => playTone(f, 0.6, 'sine', 0.12), i * 120));
            break;
        case 'sparkle': playTone(1568, 0.2, 'sine', 0.05); break;
    }
}

function toggleMusic() {
    ensureAudio();
    if (!audioCtx) return;
    musicOn = !musicOn;
    $('#musicBtn').classList.toggle('off', !musicOn);

    if (musicOn) {
        if (!musicGain) {
            musicGain = audioCtx.createGain();
            musicGain.gain.value = 0;
            musicGain.connect(audioCtx.destination);
        }
        musicGain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 1);
        // Schedule gentle melody loop
        let step = 0;
        musicTimer = setInterval(() => {
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = melody[step % melody.length] / 2; // soft octave
            g.gain.setValueAtTime(0, audioCtx.currentTime);
            g.gain.linearRampToValueAtTime(0.6, audioCtx.currentTime + 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
            osc.connect(g).connect(musicGain);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.9);
            step++;
        }, 600);
    } else {
        if (musicTimer) clearInterval(musicTimer);
        if (musicGain) musicGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    }
}

function toggleSound() {
    soundOn = !soundOn;
    $('#soundBtn').classList.toggle('off', !soundOn);
    if (soundOn) playSound('pop');
}

$('#musicBtn').addEventListener('click', toggleMusic);
$('#soundBtn').addEventListener('click', toggleSound);

/* ==========================================================
   SHARE
   ========================================================== */
$('#shareBtn').addEventListener('click', async () => {
    try {
        if (navigator.share) {
            await navigator.share({
                title: 'حكاية فايا | The Story of Faya',
                text: 'هدية بمناسبة قدوم الأميرة الصغيرة فايا 👑',
                url: window.location.href,
            });
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(window.location.href);
            playSound('pop');
            const btn = $('#shareBtn');
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => btn.style.transform = '', 300);
        }
    } catch (e) { /* user cancelled */ }
});

/* ==========================================================
   KEYBOARD ACCESS: Enter key advances from welcome
   ========================================================== */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && currentPhase === 'welcome') {
        goToPhase('prank');
    }
});
