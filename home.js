/* MRB Matcha Bar — home: gate, build-a-drink scroll, whisk game, cards, lab, delivery, cushions */
(function () {
  "use strict";
  const d = document, M = window.MRB; if (!M) return;
  const { $, $$, Sound, C, INK } = M;
  const T = (a, b) => M.T(a, b);
  const hasGS = !!(window.gsap && window.ScrollTrigger) && !M.reduced;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const sm = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const back = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const secProg = (sec) => { const r = sec.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); };
  const vis = (el, cb, margin = "150px") => { let v = false; new IntersectionObserver((e) => (v = e[0].isIntersecting), { rootMargin: margin }).observe(el); (function loop(t) { if (v) cb(t); requestAnimationFrame(loop); })(0); };

  /* ---------- small art ---------- */
  const whiskSVG = () => `<svg viewBox="0 0 100 230" aria-hidden="true"><rect x="36" y="4" width="28" height="96" rx="8" fill="#E9C98B" stroke="${INK}" stroke-width="5"/><rect x="34" y="72" width="32" height="12" rx="3" fill="${C.hoji}" stroke="${INK}" stroke-width="4"/><path d="M34 98C8 120 8 200 30 222H70C92 200 92 120 66 98Z" fill="#F3DFAE" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>${[20, 32, 44, 56, 68, 80].map((x) => `<path d="M50 100Q${x} 160 ${x} 220" stroke="${INK}" stroke-width="2.5" fill="none" opacity=".55"/>`).join("")}</svg>`;
  const leafSVG = (c = C.matcha) => `<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M8 52C8 20 26 6 54 6C54 34 40 52 8 52Z" fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M8 52L40 20" stroke="${INK}" stroke-width="3"/></svg>`;
  const iceSVG = () => `<svg viewBox="0 0 60 60" aria-hidden="true"><rect x="6" y="6" width="48" height="48" rx="11" fill="rgba(255,255,255,.75)" stroke="${INK}" stroke-width="4"/><path d="M16 16H34" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`;
  const berrySVG = () => `<svg viewBox="-36 -44 72 80" aria-hidden="true"><path d="M0 -26C22 -26 31 -6 19 14C10 26 0 32 0 32S-10 26-19 14C-31-6-22-26 0-26Z" fill="#E4483F" stroke="${INK}" stroke-width="5"/><path d="M-17-24L-5-28L0-40L5-28L17-24L5-21L0-16L-5-21Z" fill="#5E8F2A" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></svg>`;
  function flyers(box, list) {
    box.innerHTML = list.map((f) => `<div class="flyer" data-sp="${f.sp}" style="left:${f.x}%;top:${f.y}%;width:${f.w}px;transform:rotate(${f.r}deg)">${f.svg}</div>`).join("");
    return $$(".flyer", box);
  }

  /* ---------- GATE ---------- */
  function gate() {
    const g = $("#gate"); if (!g) return Promise.resolve();
    $$("[data-noren]", g).forEach((n) => (n.innerHTML = M.badge()));
    let seen = false; try { seen = sessionStorage.getItem("mrb-m-gate") === "1"; } catch (e) {}
    if (seen || M.reduced) { g.classList.add("is-gone"); return Promise.resolve(); }
    if (window.__lenis) __lenis.stop();
    return new Promise((res) => {
      $$("[data-enter]", g).forEach((b) => b.addEventListener("click", () => {
        try { sessionStorage.setItem("mrb-m-gate", "1"); } catch (e) {}
        if (b.dataset.enter === "1") { Sound.set(true); Sound.chime(); } else Sound.set(false);
        g.classList.add("is-open");
        setTimeout(() => { g.classList.add("is-gone"); if (window.__lenis) __lenis.start(); res(); }, 1200);
      }, { once: true }));
    });
  }

  /* ---------- HERO ---------- */
  function hero() {
    const k = $("[data-kanji]");
    if (k) k.innerHTML = `<circle cx="70" cy="74" r="64" fill="${INK}"/><circle cx="70" cy="70" r="62" fill="${C.matcha}" stroke="${INK}" stroke-width="5"/>${M.kanji(23, 46, 46, "#FFF3DC")}`;
    const st = $("[data-stamp]"); if (st) st.innerHTML = M.badge();
    const hg = $("[data-hero-glass]");
    hg.innerHTML = `<img class="photo photo--cut" src="matcha-boba.webp" alt="MRB Matcha Boba Float with a scoop of matcha gelato"><img class="photo photo--cut photo--b" src="matcha-cream.webp" alt="" aria-hidden="true"><div class="hero__whisk">${whiskSVG()}</div>`;
    const fl = flyers($("[data-hero-flyers]"), [
      { x: 52, y: 14, w: 60, r: -20, sp: 0.6, svg: berrySVG() }, { x: 90, y: 70, w: 54, r: 30, sp: 1.2, svg: leafSVG() },
      { x: 46, y: 78, w: 46, r: 12, sp: 0.9, svg: iceSVG() }, { x: 4, y: 88, w: 50, r: -30, sp: 1.4, svg: leafSVG(C.matchaD) }, { x: 94, y: 22, w: 44, r: 20, sp: 0.4, svg: iceSVG() }]);
    if (hasGS) {
      gsap.to("[data-sign]", { rotate: -1, y: -70, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(hg, { y: 160, rotate: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      fl.forEach((f) => gsap.to(f, { y: -300 * +f.dataset.sp, rotate: "+=" + 120 * f.dataset.sp, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } }));
      gsap.from("[data-sign]", { y: -500, rotate: -18, duration: 1.4, ease: "elastic.out(1,.55)", delay: 0.2 });
    }
    // wobble the sign on hover
    const sg = $("[data-sign]"); if (sg && M.fine) sg.addEventListener("mouseenter", () => { sg.animate([{ rotate: "0deg" }, { rotate: "-2deg" }, { rotate: "1.5deg" }, { rotate: "0deg" }], { duration: 600, composite: "add" }); Sound.clink(0.8, 0.1); });
    marquee();
  }
  function marquee() {
    const mq = $("[data-mq]");
    const words = [T("Ceremonial matcha", "Matcha ceremonial"), T("Custom tea", "Té a medida"), T("Milkshakes", "Batidos"), T("Delivery in 30", "Reparto en 30"), T("Hojicha", "Hojicha"), T("Strawberry clouds", "Nubes de fresa")];
    if (mq) mq.innerHTML = [...words, ...words].map((w) => `<span>${w}</span><i>${leafSVG(C.pink)}</i>`).join("");
  }

  /* ---------- BUILD (scroll-scrubbed drink) ---------- */
  function build() {
    const sec = $("#build"); if (!sec) return;
    const pin = $("[data-build-pin]", sec), box = $("[data-build-glass]", sec), pour = $("[data-pour]", sec);
    const cfg = { layers: [{ c: "#F4F7E6", h: 0.42 }, { c: "#9CC35A", h: 0.38 }], boba: true, scoop: "#A9C95E", top: "dust", straw: "#F6A6C1" };
    box.insertAdjacentHTML("beforeend", M.drink(cfg, { seed: 2, cls: "build__d", label: "Matcha Boba Float" }) + `<div class="build__flash"></div><div class="build__real"><img src="matcha-boba.webp" alt="The real MRB Matcha Boba Float"><span class="real-tag" data-real-tag>${T("…and this is the real one", "…y esta es la de verdad")}</span></div>`);
    const real = $(".build__real", box), flash = $(".build__flash", box); let wasReal = false;
    const svg = $(".build__d", box);
    const L0 = $(".d-l0", svg), L1 = $(".d-l1", svg), marble = $(".d-marble", svg), ices = $$(".d-bb", svg), crs = [], scoop = $(".d-scoop", svg), dust = $(".d-dust", svg), topg = $(".d-top", svg), straw = $(".d-straw", svg);
    scoop.style.transformBox = "fill-box"; scoop.style.transformOrigin = "50% 100%";
    const waves = $$(".d-wave", svg);
    crs.forEach((c) => { c.style.transformBox = "fill-box"; c.style.transformOrigin = "50% 100%"; });
    const STEPS = [
      { t: 0, bg: "#FFF3DC", cap: ["Start with an empty cup.", "Empieza con un vaso vacío."], desc: ["Scroll slowly. Every layer goes in by hand, in this order.", "Baja despacio. Cada capa se pone a mano, en este orden."] },
      { t: 0.07, bg: "#FBE6BF", cap: ["Brown sugar boba.", "Boba de azúcar moreno."], desc: ["Tapioca pearls simmered for 30 minutes in brown sugar. Chewy, warm, in first.", "Perlas de tapioca cocidas 30 minutos en azúcar moreno. Elásticas, templadas y las primeras en entrar."], tag: ["Brown sugar boba", "Boba de azúcar moreno"] },
      { t: 0.22, bg: "#A8D8E8", cap: ["Cold milk, almost to the top.", "Leche fría, casi hasta arriba."], desc: ["Whole milk or oat, poured slowly over the pearls.", "Entera o de avena, vertida despacio sobre las perlas."], tag: ["Cold milk", "Leche fría"] },
      { t: 0.4, bg: "#CFE7B0", cap: ["Then the matcha, slowly.", "Luego el matcha, despacio."], desc: ["Ceremonial Uji matcha, whisked 90 seconds and poured so it marbles through the milk.", "Matcha ceremonial de Uji, batido 90 segundos y vertido para que haga vetas en la leche."], tag: ["Uji matcha, 3 g", "Matcha de Uji, 3 g"] },
      { t: 0.6, bg: "#F6A6C1", cap: ["A scoop of matcha gelato.", "Una bola de helado de matcha."], desc: ["Made in-house every morning. It floats. Mostly.", "Lo hacemos cada mañana. Flota. Casi siempre."], tag: ["Matcha gelato", "Helado de matcha"] },
      { t: 0.76, bg: "#FFD45E", cap: ["Matcha dust, fat straw.", "Polvo de matcha y pajita gorda."], desc: ["A snowfall of matcha and a wide straw, so the boba gets through.", "Una nevada de matcha y una pajita ancha para que pasen las perlas."], tag: ["Matcha dust", "Polvo de matcha"] },
      { t: 0.92, bg: "#FFF3DC", cap: ["1:30. Ready to sip.", "1:30. Lista para beber."], desc: ["That is the whole secret. Now meet the real one.", "Ese es todo el secreto. Ahora, la de verdad."] }
    ];
    const tagBox = $("[data-build-tags]", sec);
    const renderTags = () => { tagBox.innerHTML = STEPS.filter((s) => s.tag).map((s, i) => `<span class="tag" style="--r:${i % 2 ? 2 : -2}deg"><b>0${i + 1}</b>${T(s.tag[0], s.tag[1])}</span>`).join(""); };
    renderTags();
    const tags = () => $$(".tag", tagBox);
    const cap = $("[data-build-cap]", sec), desc = $("[data-build-desc]", sec), stepEl = $("[data-build-step]", sec), timer = $("[data-timer]", sec), ring = $("[data-timer-ring]", sec), ready = $("[data-ready]", sec), bars = $$(".build__progress i", sec);
    const fl = flyers($("[data-build-flyers]", sec), [
      { x: 6, y: 18, w: 54, r: -20, sp: 1, svg: leafSVG() }, { x: 44, y: 80, w: 40, r: 40, sp: 1.6, svg: iceSVG() }, { x: 90, y: 12, w: 50, r: 10, sp: 0.7, svg: berrySVG() },
      { x: 92, y: 74, w: 58, r: -40, sp: 1.3, svg: leafSVG(C.matchaD) }, { x: 2, y: 70, w: 36, r: 20, sp: 0.5, svg: iceSVG() }]);
    let cur = -1, lastP = 0;
    const H = 262, base0 = 433 - (433 - 262 * 0.42), base1 = 433 - (433 - 262 * 0.78);
    function setStep(i, p) {
      if (i === cur) return;
      const forward = i > cur; cur = i; const s = STEPS[i];
      pin.style.backgroundColor = s.bg;
      cap.innerHTML = `<span>${T(s.cap[0], s.cap[1])}</span>`; desc.textContent = T(s.desc[0], s.desc[1]);
      stepEl.textContent = String(i).padStart(2, "0") + " / 06";
      tags().forEach((t, k) => t.classList.toggle("is-on", k < i));
      ready.classList.toggle("is-on", i === 6);
      if (forward && lastP < p) {
        if (i === 1) [0, 90, 170, 240, 330, 400, 480, 560].forEach((dl, k) => setTimeout(() => Sound.pop(260 + (k % 3) * 70), dl + 120));
        if (i === 2) Sound.pour(1.5, 380);
        if (i === 3) Sound.pour(1.6, 620);
        if (i === 4) { setTimeout(() => Sound.thud(), 300); }
        if (i === 5) { Sound.pssh(); setTimeout(() => Sound.pop(900), 420); }
        if (i === 6) { Sound.bell(); svg.animate([{ transform: "rotate(0)" }, { transform: "rotate(-4deg)" }, { transform: "rotate(3deg)" }, { transform: "rotate(0)" }], { duration: 700 }); }
      }
    }
    function update(p) {
      // ice drop
      ices.forEach((g, i) => { const q = sm(0.08 + i * 0.0055, 0.13 + i * 0.0055, p); const b = q < 1 ? back(q) : 1; g.style.transform = `translateY(${(1 - b) * -470}px)`; g.style.opacity = q > 0 ? 1 : 0; });
      // milk & matcha rise
      const f0 = sm(0.23, 0.38, p), f1 = sm(0.42, 0.58, p);
      L0.style.transform = `translateY(${(1 - f0) * 300}px)`;
      L1.style.transform = `translateY(${(1 - f1) * 300}px)`;
      L1.style.opacity = f1 > 0 ? 1 : 0;
      marble.style.opacity = sm(0.5, 0.6, p);
      // pour stream
      const s0 = sm(0.22, 0.24, p) * (1 - sm(0.37, 0.39, p)), s1 = sm(0.41, 0.43, p) * (1 - sm(0.57, 0.59, p));
      const s = Math.max(s0, s1); pour.style.transform = `scaleY(${s})`; pour.style.background = s1 > s0 ? C.matcha : C.oat; pour.style.opacity = s > 0.01 ? 1 : 0;
      // cream tiers
      { const q = sm(0.61, 0.67, p), k = sm(0.665, 0.68, p) * (1 - sm(0.68, 0.72, p)); scoop.style.transform = `translateY(${(1 - q) * -430}px) scale(${1 + k * 0.14}, ${1 - k * 0.16})`; scoop.style.opacity = q > 0 ? 1 : 0; }
      { const isR = p > 0.94; if (isR !== wasReal) { wasReal = isR; box.classList.toggle("is-real", isR); real.classList.toggle("is-on", isR); if (isR) { flash.classList.remove("go"); void flash.offsetWidth; flash.classList.add("go"); } } }
      dust.style.opacity = sm(0.79, 0.83, p);
      const qb = sm(0.77, 0.82, p); topg.style.transform = `translateY(${(1 - (qb < 1 ? back(qb) : 1)) * -380}px) rotate(${(1 - qb) * -90}deg)`; topg.style.opacity = qb > 0 ? 1 : 0; topg.style.transformBox = "fill-box"; topg.style.transformOrigin = "50% 50%";
      const qs = sm(0.84, 0.9, p); straw.style.transform = `translateY(${(1 - qs) * -560}px)`; straw.style.opacity = qs > 0 ? 1 : 0;
      // timer
      const secs = Math.round(sm(0.04, 0.94, p) * 90); timer.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`; ring.style.strokeDashoffset = 289 * (1 - secs / 90);
      bars.forEach((b, i) => b.style.setProperty("--p", clamp((p - STEPS[i + 1].t) / ((STEPS[i + 2] ? STEPS[i + 2].t : 1) - STEPS[i + 1].t), 0, 1)));
      let idx = 0; STEPS.forEach((st, i) => { if (p >= st.t) idx = i; }); setStep(idx, p);
      fl.forEach((f) => (f.style.transform = `translateY(${-p * 600 * f.dataset.sp}px) rotate(${p * 360 * f.dataset.sp}deg)`));
      lastP = p;
    }
    update(0);
    vis(sec, (t) => {
      update(secProg(sec));
      const ph = t / 500; waves.forEach((w, i) => w.setAttribute("d", M.wave(+w.dataset.y, ph + i * 1.7, i === 0 ? 3.5 : 5)));
    });
    d.addEventListener("mrb:lang", () => { renderTags(); const c = cur; cur = -1; setStep(c, lastP); });
  }

  /* ---------- WHISK (interactive) ---------- */
  function whisk() {
    const bowl = $("[data-bowl]"); if (!bowl) return;
    const cv = $("[data-bowl-cv]", bowl), ctx = cv.getContext("2d"), tool = $("[data-whisk-tool]", bowl), stamp = $("[data-froth-stamp]", bowl);
    tool.innerHTML = whiskSVG();
    const meter = $("[data-meter]"), lab = $("[data-meter-label]"), num = $("[data-meter-n]"), reward = $("[data-whisk-reward]");
    let W, dpr, froth = 0, done = false, dragging = false, last = null, speed = 0, swirl = 0, bubbles = [], idle = true;
    const rs = () => { dpr = Math.min(devicePixelRatio, 2); W = cv.width = cv.height = bowl.clientWidth * dpr; bubbles = Array.from({ length: 520 }, () => { const a = Math.random() * 6.283, r = Math.sqrt(Math.random()) * 0.33; return { x: Math.cos(a) * r, y: Math.sin(a) * r, s: 0.6 + Math.random() * 1.8, k: Math.random() }; }); };
    rs(); addEventListener("resize", rs);
    const mix = (a, b, t) => { const pa = a.match(/\w\w/g).map((h) => parseInt(h, 16)), pb = b.match(/\w\w/g).map((h) => parseInt(h, 16)); return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`; };
    const labels = [[0, ["Lumpy", "Con grumos"]], [0.3, ["Getting there", "Vamos bien"]], [0.6, ["Silky", "Sedoso"]], [0.9, ["Almost…", "Casi…"]], [1, ["Perfect froth!", "¡Espuma perfecta!"]]];
    function setMeter() { meter.style.setProperty("--p", froth); num.textContent = Math.round(froth * 100) + "%"; let l = labels[0][1]; labels.forEach(([v, t]) => { if (froth >= v) l = t; }); lab.textContent = T(l[0], l[1]); }
    function draw() {
      const c = W / 2, R = W * 0.46; ctx.clearRect(0, 0, W, W);
      ctx.fillStyle = "rgba(31,43,22,.25)"; ctx.beginPath(); ctx.ellipse(c + W * 0.02, c + W * 0.03, R, R, 0, 0, 7); ctx.fill();
      const g = ctx.createRadialGradient(c - R * 0.3, c - R * 0.3, R * 0.2, c, c, R); g.addColorStop(0, "#8A5A3C"); g.addColorStop(1, "#3D2618");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c, c, R, 0, 7); ctx.fill(); ctx.lineWidth = 6 * dpr; ctx.strokeStyle = INK; ctx.stroke();
      ctx.fillStyle = "#E9DCC0"; ctx.beginPath(); ctx.arc(c, c, R * 0.86, 0, 7); ctx.fill(); ctx.lineWidth = 4 * dpr; ctx.stroke();
      const lr = R * 0.78; ctx.fillStyle = mix("4E7A22", "B9D77A", froth); ctx.beginPath(); ctx.arc(c, c, lr, 0, 7); ctx.fill(); ctx.lineWidth = 3 * dpr; ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.arc(c, c, lr - 2, 0, 7); ctx.clip();
      ctx.strokeStyle = `rgba(230,245,200,${0.15 + Math.min(speed, 1) * 0.4})`; ctx.lineWidth = 3 * dpr;
      for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(c, c, lr * (0.2 + i * 0.11), swirl + i, swirl + i + 1.4 + speed); ctx.stroke(); }
      const n = Math.floor(froth * bubbles.length);
      for (let i = 0; i < n; i++) { const b = bubbles[i], rot = swirl * (0.3 + b.k * 0.4); const x = c + (b.x * Math.cos(rot) - b.y * Math.sin(rot)) * W, y = c + (b.x * Math.sin(rot) + b.y * Math.cos(rot)) * W; ctx.fillStyle = b.k > 0.5 ? "rgba(240,250,215,.85)" : "rgba(200,226,140,.9)"; ctx.beginPath(); ctx.arc(x, y, b.s * dpr * (1 + froth), 0, 7); ctx.fill(); }
      ctx.restore();
      ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.ellipse(c - R * 0.55, c - R * 0.55, R * 0.12, R * 0.05, -0.8, 0, 7); ctx.fill();
    }
    const local = (e) => { const r = bowl.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width }; };
    function move(e) {
      const p = local(e); tool.style.transform = `translate(${p.x - 55}px,${p.y - 190}px) rotate(${(p.x / p.w - 0.5) * 30}deg)`;
      if (!dragging || done) return;
      if (last) { const dist = Math.hypot(p.x - last.x, p.y - last.y), dt = Math.max(16, e.timeStamp - last.t); speed = Math.min(1.6, dist / dt); froth = Math.min(1, froth + dist / (p.w * 26)); swirl += dist / p.w * 2.2; setMeter(); Sound.whisk(Math.min(0.5, speed * 0.4)); if (froth >= 1) finish(); }
      last = { x: p.x, y: p.y, t: e.timeStamp };
    }
    function finish() { done = true; dragging = false; Sound.whisk(0); Sound.bell(); stamp.classList.add("is-on"); reward.hidden = false; confetti(); setMeter(); }
    function confetti() { for (let i = 0; i < 26; i++) { const el = d.createElement("div"); el.style.cssText = "position:absolute;left:50%;top:50%;width:34px;pointer-events:none;z-index:5"; el.innerHTML = i % 3 ? leafSVG(i % 2 ? C.matcha : C.pink) : iceSVG(); bowl.appendChild(el); const a = Math.random() * 6.28, r = 180 + Math.random() * 260; el.animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * r}px), calc(-50% + ${Math.sin(a) * r + 120}px)) rotate(${Math.random() * 720}deg) scale(1)`, opacity: 0 }], { duration: 1300 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.3,1)" }).onfinish = () => el.remove(); } }
    bowl.addEventListener("pointerdown", (e) => { dragging = true; idle = false; last = null; bowl.setPointerCapture(e.pointerId); move(e); });
    bowl.addEventListener("pointermove", move);
    const up = () => { dragging = false; last = null; Sound.whisk(0); }; bowl.addEventListener("pointerup", up); bowl.addEventListener("pointercancel", up); bowl.addEventListener("pointerleave", () => { if (!dragging) Sound.whisk(0); });
    $("[data-whisk-reset]").addEventListener("click", () => { froth = 0; done = false; stamp.classList.remove("is-on"); reward.hidden = true; setMeter(); Sound.tick(); });
    setMeter();
    vis(bowl, (t) => {
      speed *= 0.92; swirl += 0.004 + speed * 0.05;
      if (idle) { const a = t / 600, w = bowl.clientWidth; tool.style.transform = `translate(${w / 2 + Math.cos(a) * w * 0.18 - 55}px,${w / 2 + Math.sin(a) * w * 0.18 - 190}px) rotate(${Math.cos(a) * 12}deg)`; }
      draw();
    });
    d.addEventListener("mrb:lang", setMeter);
  }

  /* ---------- CHOOSE (horizontal cards) ---------- */
  function choose() {
    const track = $("[data-choose-track]"); if (!track) return;
    const picks = [["matcha-boba", "#F6A6C1", -3], ["strawberry-shake", "#F8BCD1", 2], ["uji-latte", "#FFD45E", -2], ["hazelnut-shake", "#A8D8E8", 3], ["dirty-matcha", "#CFE7B0", -2], ["strawberry-cloud", "#FFD45E", 2], ["peach-oolong", "#FBE6BF", -3], ["hojicha-latte", "#F6A6C1", 2]];
    const render = () => {
      track.innerHTML = picks.map(([id, bg, r], i) => { const it = M.MENU.find((m) => m.id === id); return `<article class="card" style="--r:${r}deg;--bg:${bg}"><div class="card__art">${M.artFor(it, { seed: i + 3, label: M.tr(it.name) })}<span class="card__price">${M.eur(it.price).replace(/\s/g, "")}</span></div><span class="card__picked">${T("Picked!", "¡Elegido!")}</span><div class="card__body"><h3>${M.tr(it.name)}</h3><p>${M.tr(it.desc)}</p><button class="btn btn--sm btn--pink" type="button" data-pick="${id}">${T("Pick this one", "Este quiero")}</button></div></article>`; }).join("") +
        `<div class="choose__end"><p class="display display--sm">${T("Still<br>thirsty?", "¿Aún<br>con sed?")}</p><a class="btn btn--ink" href="menu.html">${T("Full menu →", "Carta completa →")}</a></div>`;
    };
    render();
    track.addEventListener("click", (e) => { const b = e.target.closest("[data-pick]"); if (!b) return; const card = b.closest(".card"); card.classList.add("is-picked"); Sound.thud(); M.addMenu(b.dataset.pick, b); setTimeout(() => card.classList.remove("is-picked"), 1600); });
    if (!hasGS) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 821px)", () => {
      const sec = $("#drinks"), pin = $(".choose__pin", sec);
      const dist = () => track.scrollWidth - innerWidth + 60;
      sec.style.height = "auto";
      const tw = gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: sec, pin, start: "top top", end: () => "+=" + dist() * 1.2, scrub: 0.7, invalidateOnRefresh: true,
        onUpdate: (s) => { const v = s.getVelocity() / 300; $$(".card", track).forEach((c, i) => (c.style.transform = `rotate(${clamp(-v, -12, 12) + (i % 2 ? 2 : -2)}deg) translateY(${Math.sin(s.progress * 8 + i) * 18}px)`)); } } });
      return () => { tw.kill(); gsap.set(track, { x: 0 }); };
    });
    d.addEventListener("mrb:lang", () => { render(); ScrollTrigger.refresh(); });
  }

  /* ---------- LAB (build your own) ---------- */
  function lab() {
    const box = $("[data-lab-opts]"); if (!box) return;
    const O = {
      base: [["matcha", "Matcha", "Matcha", C.matcha, 5.2], ["hojicha", "Hojicha", "Hojicha", C.hoji, 5.2], ["espresso", "Espresso", "Espresso", C.coffee, 4.6], ["sencha", "Yuzu sencha", "Sencha yuzu", C.yuzu, 4.4], ["pinkshake", "Strawberry shake", "Batido de fresa", C.pinkShake, 6.2], ["greenshake", "Matcha shake", "Batido de matcha", C.greenShake, 6.4]],
      milk: [["oat", "Oat", "Avena", C.oat, 0.4], ["whole", "Whole", "Entera", C.milk, 0], ["almond", "Almond", "Almendra", C.almond, 0.4], ["coconut", "Coconut", "Coco", C.coconut, 0.5], ["none", "No milk", "Sin leche", null, 0]],
      cream: [["none", "None", "Nada", null, 0], ["vanilla", "Whipped cream", "Nata montada", C.creamW, 0.8], ["strawberry", "Strawberry cloud", "Nube de fresa", C.creamP, 0.9], ["matcha", "Matcha cloud", "Nube de matcha", C.creamG, 0.9], ["scoop", "Gelato scoop", "Bola de helado", "#A9C95E", 1.2]],
      extra: [["none", "Nothing", "Nada", null, 0], ["boba", "Boba pearls", "Perlas de boba", "#2B1B14", 0.8], ["sdrip", "Strawberry drizzle", "Sirope de fresa", "#D9353B", 0.5], ["cdrip", "Caramel drizzle", "Sirope de caramelo", "#B4703E", 0.5]],
      top: [["none", "Nothing", "Nada", null, 0], ["strawberry", "Strawberry", "Fresa", null, 0.6], ["cookie", "Cookie", "Cookie", null, 0.7], ["sakura", "Sakura", "Sakura", null, 0.3], ["dust", "Matcha dust", "Polvo de matcha", null, 0.2]],
      sweet: [["0", "0%", "0%", null, 0], ["25", "25%", "25%", null, 0], ["50", "50%", "50%", null, 0], ["100", "100%", "100%", null, 0]],
      size: [["reg", "Regular 350 ml", "Normal 350 ml", null, 0], ["lg", "Large 500 ml", "Grande 500 ml", null, 0.9]]
    };
    const H = { base: ["Base", "Base"], milk: ["Milk", "Leche"], cream: ["On top", "Encima"], extra: ["Extras", "Extras"], top: ["Topping", "Topping"], sweet: ["Sweetness", "Dulzor"], size: ["Size", "Tamaño"] };
    const st = { base: "matcha", milk: "oat", cream: "scoop", extra: "boba", top: "dust", sweet: "25", size: "reg" };
    const get = (k) => O[k].find((o) => o[0] === st[k]);
    const cfg = () => { const b = get("base"), m = get("milk"), shake = /shake/.test(st.base); const layers = shake || !m[3] ? [{ c: b[3], h: 0.78 }] : [{ c: m[3], h: 0.42 }, { c: b[3], h: 0.36 }]; const sc = st.cream === "scoop"; return { layers, ice: !shake && st.extra !== "boba", shake, boba: !shake && st.extra === "boba", drip: { sdrip: "#D9353B", cdrip: "#B4703E" }[st.extra] || null, cream: sc ? null : get("cream")[3], scoop: sc ? (st.base === "hojicha" ? "#C98A5B" : st.base === "pinkshake" ? "#F59AB5" : "#A9C95E") : null, top: st.top, straw: shake ? "none" : { matcha: "#F6A6C1", hojicha: "#B4703E", espresso: "#1F2B16", sencha: "#86B23D", pinkshake: "#E4483F", greenshake: "#86B23D" }[st.base] }; };
    const price = () => Object.keys(O).reduce((s, k) => s + get(k)[4], 0);
    const name = () => { const b = get("base"), m = get("milk"), c = get("cream"); return { en: `Your ${b[1]}${m[0] !== "none" && !/shake/.test(st.base) ? " + " + m[1].toLowerCase() : ""}${c[0] !== "none" ? " + " + c[1].toLowerCase() : ""}`, es: `Tu ${b[2]}${m[0] !== "none" && !/shake/.test(st.base) ? " + " + m[2].toLowerCase() : ""}${c[0] !== "none" ? " + " + c[2].toLowerCase() : ""}` }; };
    const opts = () => ({ en: `${get("sweet")[1]} sweet · ${get("size")[1]} · ${get("top")[1]}`, es: `Dulzor ${get("sweet")[2]} · ${get("size")[2]} · ${get("top")[2]}` });
    const renderOpts = () => {
      box.innerHTML = Object.keys(O).map((k, i) => `<div class="opt" data-rv style="--rd:${i * 60}ms"><h3><b>${i + 1}</b>${T(H[k][0], H[k][1])}</h3><div class="chips">${O[k].map((o) => `<button type="button" class="chip ${st[k] === o[0] ? "is-on" : ""}" data-o="${k}" data-v="${o[0]}" ${k === "milk" && /shake/.test(st.base) ? "disabled style='opacity:.4'" : ""}>${o[3] ? `<span class="sw" style="background:${o[3]}"></span>` : ""}${T(o[1], o[2])}${o[4] ? ` <small>+${o[4].toFixed(2).replace(".", M.lang === "es" ? "," : ".")}</small>` : ""}</button>`).join("")}</div></div>`).join("");
      M.observe();
    };
    const pv = $("[data-lab-drink]"), nm = $("[data-lab-name]"), pr = $("[data-lab-price]");
    const renderPv = (bounce) => { pv.innerHTML = M.drink(cfg(), { seed: 9, label: M.tr(name()) }); nm.textContent = M.tr(name()); pr.textContent = M.eur(price()); pv.classList.toggle("is-lg", st.size === "lg"); pv.dataset.ml = st.size === "lg" ? "500 ml" : "350 ml"; if (bounce) { pv.classList.remove("bounce"); void pv.offsetWidth; pv.classList.add("bounce"); } };
    box.addEventListener("click", (e) => { const b = e.target.closest("[data-o]"); if (!b || b.disabled) return; st[b.dataset.o] = b.dataset.v; renderOpts(); $$(".opt", box).forEach((o) => o.classList.add("is-in")); renderPv(true); ({ base: () => Sound.pour(0.7, 600), milk: () => Sound.pour(0.6, 380), cream: () => Sound.pssh(), top: () => Sound.pop(800), sweet: () => Sound.clink(1.2, 0.12), size: () => Sound.tick() })[b.dataset.o](); });
    $("[data-lab-add]").addEventListener("click", (e) => M.add({ key: "lab-" + JSON.stringify(st), id: "custom", name: name(), price: price(), d: cfg(), opts: opts() }, e.currentTarget));
    renderOpts(); renderPv(false);
    d.addEventListener("mrb:lang", () => { renderOpts(); $$(".opt", box).forEach((o) => o.classList.add("is-in")); renderPv(false); });
  }

  /* ---------- DELIVERY (scooter rides the map with scroll) ---------- */
  function delivery() {
    const map = $("[data-map]"); if (!map) return;
    const blocks = []; const r = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(11);
    for (let y = 0; y < 6; y++) for (let x = 0; x < 8; x++) if (r() > 0.18) blocks.push(`<rect x="${18 + x * 72 + r() * 6}" y="${16 + y * 74 + r() * 6}" width="${52 + r() * 8}" height="${54 + r() * 8}" rx="8" fill="${["#FBE6BF", "#F3E2C4", "#FFF3DC"][Math.floor(r() * 3)]}" stroke="#1F2B16" stroke-width="2" opacity=".9"/>`);
    map.innerHTML = `<svg viewBox="0 0 600 480" aria-label="Delivery map of central Madrid" role="img">
      <rect width="600" height="480" fill="#E7E1CF"/>${blocks.join("")}
      <path d="M-10 250 Q 150 200 300 236 T 620 210" stroke="#FFF3DC" stroke-width="22" fill="none"/><path d="M-10 250 Q 150 200 300 236 T 620 210" stroke="#1F2B16" stroke-width="2" stroke-dasharray="10 10" fill="none" opacity=".4"/>
      <ellipse cx="500" cy="380" rx="90" ry="60" fill="#86B23D" stroke="#1F2B16" stroke-width="3"/><text x="500" y="386" text-anchor="middle" font-family="DM Mono" font-size="13" fill="#1F2B16">RETIRO</text>
      <path id="route" d="M110 120 C 170 120 200 190 250 200 S 340 240 360 300 S 420 400 470 300" fill="none" stroke="#E86C98" stroke-width="7" stroke-linecap="round" stroke-dasharray="2 14"/>
      <path data-route-done d="M110 120 C 170 120 200 190 250 200 S 340 240 360 300 S 420 400 470 300" fill="none" stroke="#E86C98" stroke-width="7" stroke-linecap="round"/>
      <g transform="translate(110 120)"><circle r="26" fill="#F6A6C1" stroke="#1F2B16" stroke-width="4"/><text y="6" text-anchor="middle" font-family="Dela Gothic One" font-size="13" fill="#1F2B16">MRB</text></g>
      <g transform="translate(470 300)" data-home><path d="M-22 4L0-18L22 4V24H-22Z" fill="#FFD45E" stroke="#1F2B16" stroke-width="4" stroke-linejoin="round"/><rect x="-6" y="8" width="12" height="16" fill="#1F2B16"/></g>
      <g data-scoot><g transform="translate(-30 -46)">
        <circle cx="12" cy="40" r="10" fill="#1F2B16"/><circle cx="50" cy="40" r="10" fill="#1F2B16"/><circle cx="12" cy="40" r="4" fill="#FFF3DC"/><circle cx="50" cy="40" r="4" fill="#FFF3DC"/>
        <path d="M6 32H44L52 20H58" stroke="#1F2B16" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M8 32Q8 18 22 18H36L42 32Z" fill="#F6A6C1" stroke="#1F2B16" stroke-width="4" stroke-linejoin="round"/>
        <rect x="4" y="-2" width="24" height="20" rx="4" fill="#86B23D" stroke="#1F2B16" stroke-width="4"/><text x="16" y="12" text-anchor="middle" font-family="Dela Gothic One" font-size="7" fill="#FFF3DC">MRB</text>
        <circle cx="38" cy="2" r="8" fill="#FFD45E" stroke="#1F2B16" stroke-width="4"/><path d="M36 10L34 22" stroke="#1F2B16" stroke-width="5" stroke-linecap="round"/></g></g>
    </svg>`;
    const route = $("#route", map), done = $("[data-route-done]", map), sc = $("[data-scoot]", map), len = route.getTotalLength(), eta = $("[data-eta]"), zones = $$("[data-zones] span"), home = $("[data-home]", map);
    done.style.strokeDasharray = len; let lastPt = route.getPointAtLength(0), arrived = false;
    const set = (p) => {
      const L = len * p, pt = route.getPointAtLength(L), nx = route.getPointAtLength(Math.min(len, L + 2));
      const ang = Math.atan2(nx.y - pt.y, nx.x - pt.x) * 180 / Math.PI, flip = nx.x < pt.x - 0.01;
      sc.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${flip ? ang + 180 : ang}) scale(${flip ? -1 : 1} 1) translate(0 ${Math.sin(p * 80) * 1.5})`);
      done.style.strokeDashoffset = len * (1 - p);
      eta.textContent = Math.max(0, Math.round(30 * (1 - p)));
      zones.forEach((z, i) => z.classList.toggle("is-on", p >= 0.97 || p * (zones.length + 1) > i + 1));
      if (p > 0.98 && !arrived) { arrived = true; Sound.chime(); home.animate([{ transform: "translate(470px,300px) scale(1)" }, { transform: "translate(470px,300px) scale(1.4)" }, { transform: "translate(470px,300px) scale(1)" }], { duration: 500 }); }
      if (p < 0.9) arrived = false;
      lastPt = pt;
    };
    set(0);
    const sec = $("#delivery");
    if (hasGS && innerWidth > 900) vis(sec, () => set(sm(0.05, 0.9, secProg(sec))));
    else vis(sec, () => { const r2 = map.getBoundingClientRect(); set(sm(0, 1, (innerHeight * 0.95 - r2.top) / (innerHeight * 0.75))); });
  }

  /* ---------- CUSHIONS (knock them over) ---------- */
  function cushions() {
    const st = $("[data-stack]"); if (!st) return;
    const cols = ["#F6A6C1", C.matcha, "#FFD45E", "#A8D8E8", "#F3E2C4", "#F8BCD1"];
    const els = cols.map((c, i) => { const el = d.createElement("div"); el.className = "cush"; el.style.background = c; el.dataset.i = i; st.insertBefore(el, st.firstChild); return el; });
    const home = (el, i) => `translate(${(i % 2 ? 8 : -6) + (i * 3) % 7}px, ${280 - i * 50}px) rotate(${(i % 2 ? 1.5 : -2)}deg)`;
    els.forEach((el, i) => { el.style.top = "0"; el.style.transform = home(el, i); el.addEventListener("click", () => { Sound.pop(300 + i * 60); el.animate([{ transform: home(el, i) }, { transform: home(el, i) + " scale(1.08,.86)" }, { transform: home(el, i) }], { duration: 400 }); }); });
    let down = false; const btn = $("[data-knock]");
    btn.addEventListener("click", () => {
      down = !down;
      els.forEach((el, i) => setTimeout(() => {
        el.style.transform = down ? `translate(${(Math.random() - 0.5) * 380}px, ${300 - Math.random() * 18}px) rotate(${(Math.random() - 0.5) * 120}deg)` : home(el, i);
        if (down) setTimeout(() => Sound.thud(), 420); else Sound.pop(400 + i * 80);
      }, down ? (els.length - i) * 90 : i * 110));
      btn.textContent = down ? T("Stack 'em back", "Apílalos otra vez") : T("Knock 'em over", "¡Tíralos!");
    });
  }

  /* ---------- torn paper edges ---------- */
  function torn() {
    $$("[data-torn]").forEach((t, k) => {
      let s = "M0 60 L0 30"; const r = (x => () => (x = (x * 16807) % 2147483647) / 2147483647)(k * 31 + 7);
      for (let x = 0; x <= 1200; x += 14 + r() * 26) s += ` L${x.toFixed(0)} ${(10 + r() * 34).toFixed(0)}`;
      s += " L1200 30 L1200 60 Z";
      t.innerHTML = `<svg viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true"><path d="${s}" fill="${t.dataset.torn}"/><path d="${s.replace(/ L1200 60 Z$/, "").replace(/^M0 60 L/, "M")}" fill="none" stroke="#1F2B16" stroke-width="3" vector-effect="non-scaling-stroke"/></svg>`;
    });
  }


  /* ---------- REAL REEL: frames fan out with scroll, videos play when seen ---------- */
  function reel() {
    const sec = $("#real"); if (!sec) return;
    const frames = $$(".frame", sec), title = $(".reel__t", sec);
    $$("video", sec).forEach((v) => { v.muted = true; new IntersectionObserver((e) => { if (e[0].isIntersecting) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); } else v.pause(); }, { threshold: 0.2 }).observe(v); });
    const n = frames.length;
    const set = (p) => {
      const sp = sm(0.08, 0.5, p), up = sm(0.75, 1, p), wide = innerWidth < 700 ? innerWidth * 0.2 : Math.min(innerWidth * (n > 3 ? 0.2 : 0.3), n > 3 ? 310 : 420);
      frames.forEach((f, i) => {
        const k = i - (n - 1) / 2, a = Math.abs(k);
        const x = k * wide * sp, rot = k * 7 * sp + (1 - sp) * (k * -3 + 2), sc = a < 1 ? 1 + sp * 0.08 : 1 - sp * 0.05;
        f.style.zIndex = 10 - Math.round(a * 2);
        f.style.transform = `translate(${x}px, ${(1 - sm(0, 0.15, p)) * 120 + a * sp * 34 - up * 60}px) rotate(${rot}deg) scale(${sc})`;
      });
      title.style.transform = `translateY(-50%) scale(${1.25 - sp * 0.25})`; title.style.opacity = 0.35 + sp * 0.65;
    };
    set(0);
    let fired = false;
    vis(sec, () => { const p = secProg(sec); set(p); if (p > 0.3 && !fired) { fired = true; Sound.pssh(); } if (p < 0.1) fired = false; });
  }

  /* ---------- SPLASH: shake photo series, each one drops in with a splash ---------- */
  function splash() {
    const sec = $("#shakes"); if (!sec) return;
    const ids = ["strawberry-splash", "pb-banana", "berry-swirl", "choc-avocado"];
    const items = ids.map((id) => M.MENU.find((m) => m.id === id)).filter(Boolean);
    const pin = $("[data-splash-pin]", sec), stage = $("[data-splash-stage]", sec), info = $("[data-splash-info]", sec), dots = $("[data-splash-dots]", sec), word = $("[data-splash-word]", sec), drops = $("[data-splash-drops]", sec), intro = $("[data-splash-intro]", sec);
    const ivid = $(".splash__vid", sec);
    const N = items.length;
    stage.innerHTML = items.map((it, i) => `<figure class="spc" data-i="${i}">${it.video ? `<video src="${it.video}" poster="${it.photo}" muted loop playsinline preload="none" aria-label="${M.esc(M.tr(it.name))}"></video>` : `<img src="${it.photo}" alt="${M.esc(M.tr(it.name))}" loading="lazy" decoding="async">`}<span class="spc__price">${M.eur(it.price).replace(/\s/g, "")}</span></figure>`).join("");
    dots.innerHTML = items.map(() => "<li></li>").join("");
    const renderInfo = () => {
      info.innerHTML = items.map((it, i) => `<div class="spi" data-i="${i}"><p class="spi__n">${String(i + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}${it.tags.includes("vegan") ? ` · <b>${T("Vegan", "Vegano")}</b>` : ""}${it.tags.includes("signature") ? ` · <b>${T("Signature", "De la casa")}</b>` : ""}</p><h3>${M.tr(it.name)}</h3><p class="spi__d">${M.tr(it.desc)}</p><div class="spi__row"><span class="spi__p">${M.eur(it.price)}</span><button class="btn btn--sm btn--pink" type="button" data-add="${it.id}" tabindex="-1">${T("Add to bag", "Añadir")}</button></div></div>`).join("");
      cur = -2;
    };
    const cards = $$(".spc", stage), dotEls = $$("li", dots);
    const vids = cards.map((c) => $("video", c));
    let cur = -2;
    renderInfo();
    const burst = (col) => {
      if (M.reduced) return;
      const r = stage.getBoundingClientRect(), pr = pin.getBoundingClientRect();
      const cx = r.left - pr.left + r.width / 2, cy = r.top - pr.top + r.height * 0.18;
      for (let i = 0; i < 18; i++) {
        const el = d.createElement("i"), s = 8 + Math.random() * 26, c = i % 4 === 0 ? "#FFF6E6" : col;
        el.className = "drop"; el.style.cssText = `left:${cx}px;top:${cy}px;width:${s}px;height:${s * (1 + Math.random() * 0.5)}px;background:${c}`;
        drops.appendChild(el);
        const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.6, v = 140 + Math.random() * 300;
        el.animate([{ transform: "translate(-50%,-50%) scale(.2)", opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * v}px), calc(-50% + ${Math.sin(a) * v}px)) scale(1)`, opacity: 1, offset: 0.55 }, { transform: `translate(calc(-50% + ${Math.cos(a) * v * 1.25}px), calc(-50% + ${Math.sin(a) * v * 0.6 + 260}px)) scale(.6)`, opacity: 0 }], { duration: 1100 + Math.random() * 500, easing: "cubic-bezier(.15,.7,.35,1)" }).onfinish = () => el.remove();
      }
    };
    const setActive = (idx) => {
      if (idx === cur) return;
      const prev = cur; cur = idx;
      const on = idx >= 0;
      pin.classList.toggle("is-live", on);
      $$(".spi", info).forEach((el, i) => { el.classList.toggle("is-on", i === idx); const b = $("button", el); if (b) b.tabIndex = i === idx ? 0 : -1; });
      dotEls.forEach((el, i) => el.classList.toggle("is-on", i === idx));
      vids.forEach((v, i) => { if (!v) return; if (i === idx) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); } else v.pause(); });
      if (!on) { pin.style.removeProperty("--sbg"); return; }
      const sp = items[idx].splash;
      pin.style.setProperty("--sbg", sp.bg);
      pin.classList.toggle("is-dark", !!sp.dark);
      word.textContent = Array(4).fill(sp.word).join(" · ") + " · ";
      if (prev !== -2) { Sound.pssh(); setTimeout(() => Sound.pop(420 + idx * 90), 120); burst(sp.drop); }
    };
    if (ivid) { ivid.muted = true; new IntersectionObserver((e) => { if (e[0].isIntersecting) { const pr = ivid.play(); if (pr && pr.catch) pr.catch(() => {}); } else ivid.pause(); }, { threshold: 0.15 }).observe(ivid); }
    const update = (p) => {
      const io = sm(0.02, 0.13, p);
      intro.style.opacity = String(1 - io);
      intro.style.transform = `scale(${1 + io * 0.12}) translateY(${-io * 40}px)`;
      intro.style.visibility = io > 0.99 ? "hidden" : "visible";
      const f = clamp((p - 0.1) / 0.86, 0, 1) * N;
      const H = innerHeight;
      cards.forEach((c, i) => {
        const t = f - i;
        if (M.reduced) { c.style.opacity = (Math.min(N - 1, Math.floor(f)) === i && p > 0.1) ? 1 : 0; return; }
        const yin = 1 - sm(-0.4, 0.06, t), yout = i < N - 1 ? sm(0.8, 1.1, t) : 0;
        const wob = Math.sin(t * 3.2) * 2.2 * (1 - yin) * (1 - yout);
        c.style.opacity = t < -0.45 || yout >= 1 ? 0 : 1;
        c.style.transform = `translate(${yout * -16}vw, ${yin * H * 1.05 - yout * H * 1.1}px) rotate(${yin * 18 - yout * 16 + wob + (i % 2 ? 2.5 : -2.5)}deg) scale(${1 - yin * 0.25 + Math.max(0, 0.06 - Math.abs(t - 0.1)) * 1.5})`;
      });
      word.parentNode.style.transform = `translateY(-50%) translateX(${-((f * 0.11) % 0.5) * 100}%)`;
      setActive(p < 0.1 ? -1 : Math.min(N - 1, Math.floor(f + 0.08)));
    };
    update(0);
    vis(sec, () => update(secProg(sec)));
    d.addEventListener("mrb:lang", () => { renderInfo(); update(secProg(sec)); });
  }

  /* ---------- Boot ---------- */
  torn(); hero(); build(); reel(); whisk(); choose(); splash(); lab(); delivery(); cushions();
  gate().then(() => { M.observe(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });
  d.addEventListener("mrb:lang", () => { marquee(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });
  addEventListener("load", () => window.ScrollTrigger && ScrollTrigger.refresh());
})();
