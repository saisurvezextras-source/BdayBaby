/* =========================================================
   Komal's Birthday — script
   Edit birthdayConfig below to personalize text/photos/music.
   Everything else wires itself up automatically.
========================================================= */

const birthdayConfig = {
  letter: {
    heading: "Dear Komal ❤️",
    body: "Some people search their whole lives for someone who feels like home. I just got lucky enough to find you.\n\nThis little site is my way of saying thank you — for every laugh, every quiet evening, every plan and every detour. Happy Birthday. Here's to many more chapters, all starring you.",
    sign: "— Sai"
  },
  photos: [
    { src: "assets/images/photo-01.jpg", caption: "#01 — Somewhere in the hills" },
    { src: "assets/images/photo-02.jpg", caption: "#02 — All dressed up, all smiles" },
    { src: "assets/images/photo-03.jpg", caption: "#03 — Golden hour, gold jewels" },
    { src: "assets/images/photo-04.jpg", caption: "#04 — Us, always" }
  ],
  bollywoodLine: "\u201cKuch kuch hota hai... jab tumhara birthday aata hai.\u201d",
  jackpot: {
    title: "JACKPOT!",
    sub: "Congratulations!",
    prize: "My Heart",
    footer: "No refunds, no exchanges — this one's yours for life."
  },
  finaleMessage: "Thank you for being exactly who you are. Here's to another year of us — happy birthday, my love.",
  song: { src: "assets/music/komal-birthday-song.mp3" }
};

/* ---------------- helpers ---------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

/* smooth band: fades opacity in over [inLo,inHi], holds 1, fades out over [outLo,outHi] */
function band(p, inLo, inHi, outLo, outHi) {
  if (p <= inLo) return 0;
  if (p < inHi) return (p - inLo) / (inHi - inLo);
  if (p <= outLo) return 1;
  if (p < outHi) return 1 - (p - outLo) / (outHi - outLo);
  return 0;
}

/* ---------------- loader ---------------- */
function initLoader() {
  const loader = $("#loader");
  const fill = $(".loader-bar-fill");
  requestAnimationFrame(() => { fill.style.width = "100%"; });
  setTimeout(() => {
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.classList.add("hidden");
      $("#gate").classList.remove("hidden");
    }, 650);
  }, 1700);
}

/* ---------------- particles (ambient hearts) ---------------- */
function initParticles() {
  const field = $("#particle-field");
  const glyphs = ["❤", "♡", "✦"];
  for (let i = 0; i < 16; i++) {
    const span = document.createElement("span");
    span.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    span.style.left = Math.random() * 100 + "%";
    span.style.setProperty("--dx", (Math.random() * 60 - 30) + "px");
    span.style.fontSize = (10 + Math.random() * 10) + "px";
    span.style.animationDuration = (9 + Math.random() * 10) + "s";
    span.style.animationDelay = (Math.random() * 12) + "s";
    field.appendChild(span);
  }
}

/* ---------------- gate ---------------- */
function initGate() {
  $("#start-btn").addEventListener("click", () => {
    const audio = $("#bg-audio");
    audio.play().catch(() => {});
    if (!audio.paused) {
      $("#music-toggle").classList.add("playing");
      $("#music-toggle").setAttribute("aria-pressed", "true");
    }
    $("#gate").classList.add("fade-out");
    setTimeout(() => {
      $("#gate").classList.add("hidden");
      runCinema();
    }, 500);
  });
}

/* ---------------- cinema title sequence ---------------- */
function runCinema() {
  const cinema = $("#cinema");
  cinema.classList.remove("hidden");
  const cards = $$(".cinema-card", cinema);
  const durations = [1000, 1000, 1500, 1400, 1300, 1500];
  let t = 150;
  cards.forEach((card, i) => {
    setTimeout(() => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
    }, t);
    t += durations[i] || 1200;
  });
  setTimeout(() => {
    cinema.classList.add("fade-out");
    setTimeout(() => {
      cinema.classList.add("hidden");
      revealMain();
    }, 650);
  }, t + 200);
}

/* ---------------- reveal main experience ---------------- */
function revealMain() {
  const main = $("#main");
  main.classList.remove("hidden");
  fillText();
  initReveal();
  initEnvelope();
  initPolaroids();
  initChocolate();
  initScratchCard();
  initFinaleConfetti();
  initMusicToggle();
  // layout is only real once #main is visible — bind scroll scenes now
  requestAnimationFrame(() => requestAnimationFrame(initAllScrollScenes));
}

/* ---------------- fill personalized text ---------------- */
function fillText() {
  $("#letter-heading").textContent = birthdayConfig.letter.heading;
  $("#letter-body").textContent = birthdayConfig.letter.body;
  $("#letter-sign").textContent = birthdayConfig.letter.sign;
  $("#jackpot-title").textContent = birthdayConfig.jackpot.title;
  $("#jackpot-sub").textContent = birthdayConfig.jackpot.sub;
  $("#jackpot-prize").textContent = birthdayConfig.jackpot.prize;
  $("#jackpot-footer").textContent = birthdayConfig.jackpot.footer;
  $("#finale-message").textContent = birthdayConfig.finaleMessage;
}

/* ---------------- scroll-reveal (.reveal elements) ---------------- */
function initReveal() {
  const els = $$(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  els.forEach(el => io.observe(el));
}

/* ---------------- envelope ---------------- */
function initEnvelope() {
  const envelope = $("#envelope");
  const hint = $("#envelope-hint");
  envelope.addEventListener("click", () => {
    envelope.classList.toggle("open");
    hint.textContent = envelope.classList.contains("open") ? "" : "tap to open 💗";
  });
}

/* ---------------- generic scroll-scrubbed video scenes ---------------- */
function bindScrollProgress(wrapperEl, onProgress) {
  let ticking = false;
  function update() {
    const rect = wrapperEl.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
    onProgress(p);
    ticking = false;
  }
  function onScroll() {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}

function bindVideoScrollScene(wrapperEl) {
  const video = $(".scrub-video", wrapperEl);
  const stage = $("[data-stage]", wrapperEl);
  const caps = {
    open: $(".cap-open", wrapperEl),
    mid: $(".cap-mid", wrapperEl),
    close: $(".cap-close", wrapperEl)
  };
  let duration = 0;
  let ready = false;

  function markMissing() { stage.classList.add("no-video"); }
  let loadStarted = false;

  video.addEventListener("loadedmetadata", () => {
    if (video.duration && isFinite(video.duration)) {
      duration = video.duration;
      ready = true;
    } else {
      markMissing();
    }
  });
  video.addEventListener("error", markMissing);

  // Lazy-load: only start fetching this scene's video once it's actually
  // getting close on screen, so seven scroll-scenes don't all fight for
  // bandwidth at once. Each fetch, once started, downloads fully so
  // currentTime-scrubbing stays smooth with no re-buffering mid-scroll.
  const lazyIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !loadStarted) {
        loadStarted = true;
        video.preload = "auto";
        video.load();
        setTimeout(() => { if (!ready && video.readyState === 0) markMissing(); }, 4000);
        lazyIO.unobserve(entry.target);
      }
    });
  }, { rootMargin: "150% 0px" });
  lazyIO.observe(wrapperEl);

  bindScrollProgress(wrapperEl, (p) => {
    if (ready && duration > 0) {
      const target = p * duration;
      if (Math.abs(video.currentTime - target) > 0.03) {
        try { video.currentTime = target; } catch (e) {}
      }
    }
    if (caps.open) caps.open.style.opacity = band(p, 0, 0.06, 0.20, 0.30);
    if (caps.mid) caps.mid.style.opacity = band(p, 0.28, 0.38, 0.62, 0.72);
    if (caps.close) caps.close.style.opacity = band(p, 0.74, 0.86, 1.01, 1.02);
  });
}

function initAllScrollScenes() {
  $$(".scroll-scene").forEach(wrapper => bindVideoScrollScene(wrapper));
}

/* ---------------- polaroids ---------------- */
function initPolaroids() {
  const stack = $("#polaroid-stack");
  const rotations = [-4, 3, -2, 5, -5, 2];
  birthdayConfig.photos.forEach((photo, i) => {
    const card = document.createElement("div");
    card.className = "polaroid";
    card.style.setProperty("--rot", rotations[i % rotations.length] + "deg");
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption || "";
    img.onerror = () => { img.style.background = "#ddd0b8"; img.removeAttribute("src"); };
    const cap = document.createElement("p");
    cap.className = "polaroid-caption";
    cap.textContent = photo.caption || "";
    card.appendChild(img);
    card.appendChild(cap);
    stack.appendChild(card);
  });
}

/* ---------------- chocolate surprise ---------------- */
function typeText(el, text, speed = 34) {
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

function spawnChocolateShower() {
  const shower = $("#chocolate-shower");
  const pieces = ["🍫", "🍬", "🍩", "❤️"];
  for (let i = 0; i < 26; i++) {
    const span = document.createElement("span");
    span.className = "choc-piece";
    span.textContent = pieces[Math.floor(Math.random() * pieces.length)];
    span.style.left = Math.random() * 100 + "%";
    span.style.animationDuration = (2.2 + Math.random() * 1.8) + "s";
    span.style.animationDelay = (Math.random() * 0.8) + "s";
    shower.appendChild(span);
    setTimeout(() => span.remove(), 5000);
  }
}

function initChocolate() {
  $("#chocolate-btn").addEventListener("click", () => {
    typeText($("#dialogue-text"), birthdayConfig.bollywoodLine);
    spawnChocolateShower();
  });
}

/* ---------------- scratch card ---------------- */
function initScratchCard() {
  const canvas = $("#scratch-canvas");
  const card = $(".scratch-card");
  const ctx = canvas.getContext("2d");
  let w, h, scratching = false, cleared = 0, sampleTotal = 0, done = false;

  function size() {
    const rect = card.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
    draw();
  }
  function draw() {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#8a6a3f");
    grad.addColorStop(1, "#5c4326");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(243,231,216,.85)";
    ctx.font = "600 13px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✦ scratch here ✦", w / 2, h / 2);
  }
  size();
  window.addEventListener("resize", size);

  function pos(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x: cx, y: cy };
  }
  function erase(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
    cleared++;
  }
  function checkDone() {
    if (done) return;
    sampleTotal++;
    if (cleared > 34) {
      done = true;
      canvas.classList.add("done");
    }
  }
  function start(e) { scratching = true; const p = pos(e); erase(p.x, p.y); }
  function move(e) {
    if (!scratching || done) return;
    e.preventDefault();
    const p = pos(e);
    erase(p.x, p.y);
    checkDone();
  }
  function end() { scratching = false; }

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  canvas.addEventListener("touchstart", start, { passive: true });
  canvas.addEventListener("touchmove", move, { passive: false });
  canvas.addEventListener("touchend", end);
}

/* ---------------- finale confetti ---------------- */
function initFinaleConfetti() {
  const canvas = $("#confetti-canvas");
  const section = $("#scene-finale");
  const ctx = canvas.getContext("2d");
  let particles = [], running = false, rafId = null;
  const colors = ["#c8a15a", "#e4c98a", "#c97f83", "#f3e7d8"];

  function size() {
    canvas.width = section.clientWidth;
    canvas.height = section.clientHeight;
  }
  function spawn() {
    particles = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height,
        r: 3 + Math.random() * 4,
        c: colors[Math.floor(Math.random() * colors.length)],
        vy: 1.4 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 1.4,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 6
      });
    }
  }
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
      ctx.restore();
    });
    particles = particles.filter(p => p.y < canvas.height + 30);
    if (particles.length && running) {
      rafId = requestAnimationFrame(tick);
    } else {
      running = false;
    }
  }
  size();
  window.addEventListener("resize", size);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !running) {
        running = true;
        spawn();
        tick();
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  io.observe(section);
}

/* ---------------- music toggle ---------------- */
function initMusicToggle() {
  const btn = $("#music-toggle");
  const audio = $("#bg-audio");
  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {});
      btn.classList.add("playing");
      btn.setAttribute("aria-pressed", "true");
    } else {
      audio.pause();
      btn.classList.remove("playing");
      btn.setAttribute("aria-pressed", "false");
    }
  });
}

/* ---------------- boot ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initLoader();
  initGate();
});
