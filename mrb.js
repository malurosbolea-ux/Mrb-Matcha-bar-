/* =========================================================
   MRB Matcha Bar — shared core: i18n, sound, art, cart, chrome
   Concept site by María Luisa Ros Bolea
   ========================================================= */
(function () {
  "use strict";
  const d = document, root = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => Array.from(c.querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const C = window.MRB_C, MENU = window.MRB_MENU || [];
  const page = d.body.dataset.page || "home";
  const INK = "#1F2B16";

  /* ================= i18n ================= */
  let lang = "en";
  try { lang = localStorage.getItem("mrb-m-lang") || "en"; } catch (e) {}
  if (lang !== "es") lang = "en";
  const T = (en, es) => (lang === "es" ? es : en);
  const tr = (o) => (o == null ? "" : typeof o === "string" ? o : o[lang] || o.en);
  const eur = (n) => new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-IE", { style: "currency", currency: "EUR" }).format(n);
  const esc = (s) => String(s).replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));

  /* ================= Sound engine (Web Audio, no files) ================= */
  const Sound = {
    ctx: null, master: null, on: false, amb: null, whiskG: null, noiseBuf: null,
    init() {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      this.ctx = new AC(); this.master = this.ctx.createGain(); this.master.gain.value = 0; this.master.connect(this.ctx.destination);
      const len = this.ctx.sampleRate * 3, buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate), ch = buf.getChannelData(0);
      let last = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; ch[i] = last * 3.5 * 0.5 + w * 0.5 * 0.25; }
      this.noiseBuf = buf;
      // ambient café murmur
      const src = this.ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      const lp = this.ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 520;
      const g = this.ctx.createGain(); g.gain.value = 0.16;
      const lfo = this.ctx.createOscillator(), lg = this.ctx.createGain(); lfo.frequency.value = 0.13; lg.gain.value = 0.06; lfo.connect(lg).connect(g.gain); lfo.start();
      src.connect(lp).connect(g).connect(this.master); src.start();
      // whisk bed (gain driven by interaction)
      const ws = this.ctx.createBufferSource(); ws.buffer = buf; ws.loop = true;
      const hp = this.ctx.createBiquadFilter(); hp.type = "bandpass"; hp.frequency.value = 3200; hp.Q.value = 0.8;
      this.whiskG = this.ctx.createGain(); this.whiskG.gain.value = 0;
      ws.connect(hp).connect(this.whiskG).connect(this.master); ws.start();
      const clinkLoop = () => { if (this.on && Math.random() < 0.7) this.clink(0.6 + Math.random() * 0.5, 0.05); setTimeout(clinkLoop, 3000 + Math.random() * 6000); };
      setTimeout(clinkLoop, 3000);
    },
    set(on) {
      this.on = on;
      try { localStorage.setItem("mrb-m-sound", on ? "1" : "0"); } catch (e) {}
      if (on) { this.init(); if (!this.ctx) return; this.ctx.resume(); this.master.gain.setTargetAtTime(0.9, this.ctx.currentTime, 0.3); }
      else if (this.ctx) this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
      $$("[data-sound]").forEach((b) => { b.setAttribute("aria-pressed", on); b.classList.toggle("is-on", on); const l = $(".snd__t", b); if (l) l.textContent = on ? T("Sound on", "Sonido sí") : T("Sound off", "Sonido no"); });
    },
    ok() { return this.on && this.ctx && this.ctx.state === "running"; },
    env(node, t, a, peak, dec) { const g = this.ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); node.connect(g); g.connect(this.master); return g; },
    noise(t, dur) { const s = this.ctx.createBufferSource(); s.buffer = this.noiseBuf; s.start(t, Math.random() * 2); s.stop(t + dur + 0.1); return s; },
    clink(p = 1, vol = 0.22) { if (!this.ok()) return; const t = this.ctx.currentTime; [2350, 3720, 5100].forEach((f, i) => { const o = this.ctx.createOscillator(); o.type = "sine"; o.frequency.value = f * p; this.env(o, t, 0.002, vol / (i + 1), 0.35 - i * 0.08); o.start(t); o.stop(t + 0.5); }); },
    pour(dur = 1.2, base = 600) { if (!this.ok()) return; const t = this.ctx.currentTime, s = this.noise(t, dur); const bp = this.ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 2; bp.frequency.setValueAtTime(base, t); bp.frequency.linearRampToValueAtTime(base * 2.4, t + dur); const g = this.ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.5, t + 0.08); g.gain.setValueAtTime(0.5, t + dur - 0.2); g.gain.linearRampToValueAtTime(0.0001, t + dur); const trem = this.ctx.createOscillator(), tg = this.ctx.createGain(); trem.frequency.value = 11; tg.gain.value = 0.18; trem.connect(tg).connect(g.gain); trem.start(t); trem.stop(t + dur); s.connect(bp).connect(g).connect(this.master); },
    pssh() { if (!this.ok()) return; const t = this.ctx.currentTime, s = this.noise(t, 0.8); const hp = this.ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 2600; s.connect(hp); this.env(hp, t, 0.02, 0.45, 0.7); },
    pop(f = 700) { if (!this.ok()) return; const t = this.ctx.currentTime, o = this.ctx.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f / 5, t + 0.13); this.env(o, t, 0.004, 0.5, 0.16); o.start(t); o.stop(t + 0.25); },
    bell() { if (!this.ok()) return; const t = this.ctx.currentTime; [[880, 0.22], [1320, 0.12], [1760, 0.08], [2637, 0.04]].forEach(([f, v]) => { const o = this.ctx.createOscillator(); o.type = "sine"; o.frequency.value = f; this.env(o, t, 0.005, v, 1.6); o.start(t); o.stop(t + 1.8); }); },
    tick() { if (!this.ok()) return; const t = this.ctx.currentTime, o = this.ctx.createOscillator(); o.type = "triangle"; o.frequency.value = 1700; this.env(o, t, 0.001, 0.08, 0.04); o.start(t); o.stop(t + 0.08); },
    thud() { if (!this.ok()) return; const t = this.ctx.currentTime, o = this.ctx.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.18); this.env(o, t, 0.004, 0.7, 0.25); o.start(t); o.stop(t + 0.35); const s = this.noise(t, 0.2), lp = this.ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 700; s.connect(lp); this.env(lp, t, 0.002, 0.25, 0.15); },
    whisk(v) { if (!this.ok() || !this.whiskG) return; this.whiskG.gain.setTargetAtTime(Math.min(0.55, v), this.ctx.currentTime, 0.05); },
    chime() { if (!this.ok()) return; [0, 0.16, 0.32].forEach((dl, i) => setTimeout(() => { const t = this.ctx.currentTime, o = this.ctx.createOscillator(); o.type = "sine"; o.frequency.value = [1046, 1318, 1568][i]; this.env(o, t, 0.004, 0.18, 0.9); o.start(t); o.stop(t + 1); }, dl * 1000)); }
  };

  /* ================= Art: kanji, logo, drinks, bites ================= */
  const KANJI = { m: "M908 -6Q836 66 793 181V2H569V187Q518 59 452 -6Q435 57 406.5 108.0Q378 159 331 200V168Q331 85 316.0 53.5Q301 22 256.0 13.5Q211 5 84 1L60 0Q55 62 46.5 102.5Q38 143 12 188Q57 188 76.0 191.5Q95 195 99.5 202.5Q104 210 104 227V242L30 237Q24 356 10 424Q72 426 104 428V503H30V680H104V762H331V680H393V503H331V438L396 442Q393 383 393 265Q350 261 331 260V216Q392 240 436.0 264.0Q480 288 515 319H412V510H565V545H415V727H565V765H797V727H958V545H797V510H977V319H846Q903 264 991 231Q927 113 908 -6Z", c: "M756 233Q811 204 866.5 186.5Q922 169 999 156Q970 129 941.5 81.5Q913 34 896 -10Q805 25 739.5 63.0Q674 101 610 158V58Q610 34 589.0 21.5Q568 9 507.0 3.0Q446 -3 323 -3Q323 62 311 94Q268 63 219.0 39.0Q170 15 106 -10Q89 34 60.5 81.5Q32 129 3 156Q80 169 135.5 186.5Q191 204 246 233H75V341Q61 340 34 340Q33 375 26.0 433.0Q19 491 12 518Q32 517 84 517Q213 517 288 527Q302 529 308 529Q347 533 360.5 538.0Q374 543 378 559H227V578H38V739H227V766H438V739H560V766H771V739H962V578H771V559H625Q615 536 607 535Q723 514 861 514Q932 514 993 518Q985 491 976.5 437.0Q968 383 963 340L925 343V233ZM560 560V578H438V560ZM405 408H595Q528 429 487 446Q449 425 405 408ZM610 364H777Q687 381 610 403ZM385 400Q315 376 256 364H385ZM385 233H282Q320 212 385 184ZM610 233V181Q683 213 720 233ZM385 151V152Q352 125 350 123Q373 123 379.0 128.0Q385 133 385 151Z" };
  const kanji = (x, y, s, fill) => `<g fill="${fill}"><path transform="translate(${x} ${y + s * 0.98}) scale(${s / 1000} ${-s / 1000})" d="${KANJI.m}"/><path transform="translate(${x + s * 1.04} ${y + s * 0.98}) scale(${s / 1000} ${-s / 1000})" d="${KANJI.c}"/></g>`;
  let uid = 0;

  function badge(o = {}) {
    const id = "bd" + ++uid;
    return `<svg class="badge-svg ${o.cls || ""}" viewBox="0 0 240 240" role="img" aria-label="MRB Matcha Bar">
      <defs><path id="${id}r" d="M120 120 m-94 0 a94 94 0 1 1 188 0 a94 94 0 1 1 -188 0"/></defs>
      <circle cx="120" cy="120" r="114" fill="${INK}"/>
      <circle cx="120" cy="116" r="112" fill="#F6A6C1" stroke="${INK}" stroke-width="6"/>
      <g class="badge-ring"><text font-family="DM Mono, monospace" font-size="15.5" font-weight="500" letter-spacing="3.1" fill="${INK}"><textPath href="#${id}r">MATCHA · COFFEE · TEA · SHAKES · MADRID ·</textPath></text></g>
      <circle cx="120" cy="116" r="78" fill="#FFF3DC" stroke="${INK}" stroke-width="5"/>
      ${kanji(96, 58, 23, "#5E8F2A")}
      <text x="124" y="140" text-anchor="middle" font-family="Dela Gothic One, sans-serif" font-size="50" fill="${INK}">MRB</text>
      <text x="120" y="136" text-anchor="middle" font-family="Dela Gothic One, sans-serif" font-size="50" fill="#86B23D" stroke="${INK}" stroke-width="2.4" paint-order="stroke">MRB</text>
      <text x="120" y="166" text-anchor="middle" font-family="Shrikhand, cursive" font-size="21" fill="#E86C98">matcha bar</text>
    </svg>`;
  }

  // seeded random so drinks look the same every render
  const rng = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const wave = (y, ph = 0, amp = 4) => { let s = `M30 ${y + Math.sin(ph) * amp}`; for (let x = 40; x <= 270; x += 10) s += ` L${x} ${(y + Math.sin(x / 21 + ph) * amp).toFixed(1)}`; return s + " L270 450 L30 450 Z"; };
  const strawberry = (x, y, s = 1) => `<g class="d-straw-b" transform="translate(${x} ${y}) scale(${s})"><path d="M0 -26C22 -26 31 -6 19 14C10 26 0 32 0 32S-10 26-19 14C-31-6-22-26 0-26Z" fill="#E4483F" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><g fill="#FFE7A0">${[[-8, -8], [8, -6], [0, 4], [-10, 10], [10, 12], [0, 18], [-3, -16], [12, -16]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="2" ry="3"/>`).join("")}</g><path d="M-17-24L-5-28L0-40L5-28L17-24L5-21L0-16L-5-21Z" fill="#5E8F2A" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>`;
  const slice = (x, y, col, inner) => `<g transform="translate(${x} ${y}) rotate(-18)"><circle r="30" fill="${col}" stroke="${INK}" stroke-width="5"/><circle r="22" fill="${inner}"/>${[0, 60, 120, 180, 240, 300].map((a) => `<line x1="0" y1="0" x2="${(Math.cos((a * Math.PI) / 180) * 21).toFixed(1)}" y2="${(Math.sin((a * Math.PI) / 180) * 21).toFixed(1)}" stroke="${col}" stroke-width="3"/>`).join("")}<circle r="3" fill="${col}"/></g>`;
  const sakura = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${[0, 72, 144, 216, 288].map((a) => `<path transform="rotate(${a})" d="M0 0C-12-10-10-26 0-30L3-25L6-30C14-24 12-10 0 0Z" fill="#F8BCD1" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`).join("")}<circle r="5" fill="#FFD45E" stroke="${INK}" stroke-width="2.5"/></g>`;
  const cookie = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(-14)"><path d="M-28 0A28 28 0 1 1 20 20L12 10L18 2L10-4Z" fill="#C98A4B" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><g fill="${C.choco}"><rect x="-14" y="-12" width="8" height="6" rx="2"/><rect x="4" y="-18" width="7" height="6" rx="2" transform="rotate(20)"/><rect x="-18" y="6" width="7" height="6" rx="2"/><rect x="-2" y="2" width="6" height="6" rx="2"/></g></g>`;

  const VESSEL = {
    cup: { outer: "M44 150L66 418Q68 440 92 440L208 440Q232 440 234 418L256 150", inner: "M52 153L72 416Q74 433 93 433L207 433Q226 433 228 416L248 153Z", bot: 433, top: 171, rimY: 150, rimRx: 107, print: [196, 368, 27, 15], hl: ["M74 178L88 402", "M96 180L101 238"], shadow: 447, strawT: "translate(196 235) rotate(13)" },
    sundae: { outer: "M48 118C56 230 92 330 120 372Q130 384 140 386L140 420Q102 424 92 434L208 434Q198 424 160 420L160 386Q170 384 180 372C208 330 244 230 252 118", inner: "M55 121C63 228 98 324 124 364Q150 382 176 364C202 324 237 228 245 121Z", bot: 378, top: 136, rimY: 118, rimRx: 103, print: [150, 312, 20, 11], hl: ["M72 142C80 232 98 300 120 348", "M92 146L96 196"], shadow: 442, strawT: "translate(190 205) rotate(14)" }
  };
  const wafer = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(22)"><rect x="-15" y="-64" width="30" height="104" rx="9" fill="#F3DFAE" stroke="${INK}" stroke-width="5"/><rect x="-15" y="-64" width="30" height="40" rx="9" fill="#6B3E22" stroke="${INK}" stroke-width="5"/>${[-14, 2, 18, 30].map((yy) => `<path d="M-13 ${yy}H13" stroke="#B4703E" stroke-width="5"/>`).join("")}<path d="M-8-56V-32" stroke="#9B6A48" stroke-width="3" stroke-linecap="round"/></g>`;

  function drink(cfg, o = {}) {
    const id = "dk" + ++uid, r = rng((o.seed || 7) * 97 + 13);
    const V = VESSEL[cfg.shake || cfg.vessel === "sundae" ? "sundae" : "cup"], dy = V.rimY - 150;
    const BOT = V.bot, H = V.bot - V.top; let acc = 0;
    const tops = cfg.layers.map((L) => { acc += L.h; return BOT - H * acc; });
    const topY = tops.length ? tops[tops.length - 1] : BOT;
    let layers = "";
    for (let i = cfg.layers.length - 1; i >= 0; i--) layers += `<g class="d-l d-l${i}"><path class="d-wave" data-y="${tops[i].toFixed(1)}" d="${wave(tops[i], i * 1.7, i === cfg.layers.length - 1 ? 4 : 6)}" fill="${cfg.layers[i].c}"/></g>`;
    // creamy marbling: tongues of the lower colour rising, upper colour sinking
    let marble = "";
    for (let i = 1; i < cfg.layers.length; i++) {
      const yb = tops[i - 1], lo = cfg.layers[i - 1].c, up = cfg.layers[i].c;
      for (let k = 0; k < 5; k++) { const x = 72 + k * 38 + r() * 14, h = 40 + r() * 70, w = 9 + r() * 9; marble += `<path d="M${x - w} ${yb + 6}C${x - w - 6} ${yb - h * 0.45} ${x + w * 0.4} ${yb - h * 0.7} ${x} ${yb - h}C${x + w * 1.2} ${yb - h * 0.6} ${x + w + 4} ${yb - h * 0.3} ${x + w} ${yb + 6}Z" fill="${lo}" opacity=".92"/>`; }
      for (let k = 0; k < 4; k++) { const x = 92 + k * 40 + r() * 12, h = 30 + r() * 60, w = 7 + r() * 7; marble += `<path d="M${x - w} ${yb - 6}C${x - w} ${yb + h * 0.4} ${x - 2} ${yb + h * 0.8} ${x} ${yb + h}C${x + 4} ${yb + h * 0.7} ${x + w + 2} ${yb + h * 0.3} ${x + w} ${yb - 6}Z" fill="${up}" opacity=".85"/>`; }
      marble += [0, 1, 2].map((k) => `<path d="M${80 + k * 60} ${yb + 20}c10-30-14-40 4-70" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".35"/>`).join("");
    }
    let boba = "";
    if (cfg.boba) for (let row = 0; row < 3; row++) for (let x = 76 + (row % 2) * 13; x <= 226; x += 26) { const y = BOT - 14 - row * 21 + r() * 4, rr = 10.5 + r() * 1.5; boba += `<g class="d-bb"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="#2B1B14" stroke="${INK}" stroke-width="2.5"/><circle cx="${(x - 3.5).toFixed(1)}" cy="${(y - 4).toFixed(1)}" r="2.6" fill="#fff" opacity=".55"/></g>`; }
    let ice = "";
    if (cfg.ice) ice = [[88, topY + 14, -12], [146, topY - 2, 9], [198, topY + 18, -7], [118, topY + 70, 18], [178, topY + 82, -15]].map(([x, y, a], i) => `<g class="d-ice" style="--i:${i}"><g transform="translate(${x} ${y}) rotate(${a})"><rect x="-23" y="-23" width="46" height="46" rx="10" fill="rgba(255,255,255,.55)" stroke="${INK}" stroke-width="4"/><path d="M-12-13H6" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g></g>`).join("");
    let bits = "";
    if (cfg.shake) for (let i = 0; i < 30; i++) bits += `<circle cx="${(80 + r() * 140).toFixed(0)}" cy="${(topY + 14 + r() * (BOT - topY - 40)).toFixed(0)}" r="${(1.5 + r() * 2.5).toFixed(1)}" fill="${cfg.speck || "#fff"}" opacity=".5"/>`;
    const Y = (v) => v + dy;
    const cream = cfg.cream ? `<g class="d-cream">
      <g class="d-cr d-cr1"><path d="M38 ${Y(150)}C40 ${Y(128)} 70 ${Y(124)} 92 ${Y(130)}C110 ${Y(118)} 132 ${Y(122)} 150 ${Y(128)}C168 ${Y(118)} 194 ${Y(120)} 208 ${Y(130)}C232 ${Y(124)} 262 ${Y(130)} 262 ${Y(150)}Q150 ${Y(172)} 38 ${Y(150)}Z" fill="${cfg.cream}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>
      <g class="d-cr d-cr2"><path d="M68 ${Y(132)}C70 ${Y(108)} 100 ${Y(104)} 118 ${Y(112)}C134 ${Y(98)} 166 ${Y(98)} 182 ${Y(112)}C200 ${Y(104)} 232 ${Y(108)} 232 ${Y(132)}Q150 ${Y(150)} 68 ${Y(132)}Z" fill="${cfg.cream}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>
      <g class="d-cr d-cr3"><path d="M96 ${Y(112)}C98 ${Y(90)} 124 ${Y(84)} 150 ${Y(92)}C176 ${Y(84)} 202 ${Y(90)} 204 ${Y(112)}Q150 ${Y(128)} 96 ${Y(112)}Z" fill="${cfg.cream}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>
      <g class="d-cr d-cr4"><path d="M150 ${Y(58)}C168 ${Y(78)} 176 ${Y(92)} 150 ${Y(96)}C124 ${Y(92)} 132 ${Y(78)} 150 ${Y(58)}Z" fill="${cfg.cream}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g></g>` : "";
    const scoop = cfg.scoop ? `<g class="d-scoop"><path d="M84 ${Y(146)}C78 ${Y(66)} 222 ${Y(66)} 216 ${Y(146)}Q200 ${Y(158)} 184 ${Y(148)}Q168 ${Y(160)} 150 ${Y(150)}Q132 ${Y(160)} 116 ${Y(148)}Q100 ${Y(158)} 84 ${Y(146)}Z" fill="${cfg.scoop}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M104 ${Y(104)}Q114 ${Y(86)} 134 ${Y(80)}" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".45"/>${Array.from({ length: 46 }, () => `<circle cx="${(96 + r() * 108).toFixed(0)}" cy="${Y(78 + r() * 64).toFixed(0)}" r="${(1.2 + r() * 2).toFixed(1)}" fill="${C.matchaD}" opacity=".8"/>`).join("")}</g>` : "";
    const peak = cfg.scoop ? Y(66) : cfg.cream ? Y(62) : topY - 8;
    let top = "";
    if (cfg.top === "strawberry") top = strawberry(cfg.cream || cfg.scoop ? 172 : 196, cfg.cream || cfg.scoop ? peak + 6 : 132, 1.15);
    else if (cfg.top === "cookie") top = cookie(cfg.cream ? 168 : 200, cfg.cream ? peak + 18 : 140, 1.1);
    else if (cfg.top === "wafer") top = wafer(178, peak + 2, 1);
    else if (cfg.top === "lemon") top = slice(238, V.rimY, "#F2D04B", "#FFF2A8");
    else if (cfg.top === "peach") top = slice(238, V.rimY, "#F7A67E", "#FFD8C2");
    else if (cfg.top === "sakura") top = sakura(cfg.cream ? 150 : 160, cfg.cream ? peak + 8 : topY - 6, 1.1);
    let dust = "";
    if (cfg.top === "dust" || cfg.creamDust || cfg.top === "strawberry" || cfg.top === "sakura") { const dc = cfg.dust || C.matchaD, n = cfg.top === "dust" || cfg.creamDust ? 44 : 14; for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, rr = Math.sqrt(r()); dust += `<circle cx="${(150 + Math.cos(a) * rr * (cfg.cream ? 100 : 92)).toFixed(1)}" cy="${(cfg.cream ? Y(118) + Math.sin(a) * rr * 30 : topY + 2 + Math.sin(a) * rr * 6).toFixed(1)}" r="${(1.6 + r() * 2.4).toFixed(1)}" fill="${dc}"/>`; } }
    let crumble = "";
    if (cfg.crumble && cfg.cream) for (let i = 0; i < 12; i++) { const x = 92 + r() * 116, y = Y(100 + r() * 40); crumble += `<path d="M${x.toFixed(0)} ${y.toFixed(0)}l${(6 + r() * 6).toFixed(0)} -${(4 + r() * 4).toFixed(0)} l${(4 + r() * 4).toFixed(0)} ${(7 + r() * 4).toFixed(0)} l-${(9 + r() * 5).toFixed(0)} ${(3 + r() * 3).toFixed(0)}Z" fill="#FFFDF6" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`; }
    let drip = "";
    if (cfg.drip) { const dc = cfg.drip; drip = `<g class="d-drip">${[[70, 90], [104, 150], [138, 70], [176, 190], [212, 110], [238, 60]].map(([x, L]) => { const xx = cfg.shake ? 150 + (x - 150) * 0.94 : x, yy = V.rimY + 2, w = 8 + (L % 3); return `<path d="M${xx - w} ${yy}C${xx - w} ${yy + L * 0.7} ${xx - 5} ${yy + L} ${xx} ${yy + L + 9}C${xx + 5} ${yy + L} ${xx + w} ${yy + L * 0.7} ${xx + w} ${yy}Z" fill="${dc}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="${xx - 2}" cy="${yy + L * 0.5}" r="2.2" fill="#fff" opacity=".5"/>`; }).join("")}${cfg.cream ? `<path d="M64 ${Y(140)}L96 ${Y(118)}L120 ${Y(140)}L150 ${Y(104)}L176 ${Y(138)}L206 ${Y(112)}L236 ${Y(140)}" fill="none" stroke="${dc}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>` : ""}</g>`; }
    const strawC = cfg.straw || "#F6A6C1", sw = cfg.boba ? 17 : 12;
    const straw = cfg.straw === "none" ? "" : `<g class="d-straw"><g transform="${V.strawT}"><rect x="-${sw}" y="-226" width="${sw * 2}" height="430" rx="5" fill="${strawC}" stroke="${INK}" stroke-width="5"/><g clip-path="url(#${id}s)"><g stroke="#FFF3DC" stroke-width="7">${Array.from({ length: 16 }, (_, k) => `<line x1="-${sw + 4}" y1="${-226 + k * 28}" x2="${sw + 4}" y2="${-210 + k * 28}"/>`).join("")}</g></g></g></g>`;
    const stem = cfg.shake ? `<path d="M140 380L140 420Q102 424 92 434L208 434Q198 424 160 420L160 380Z" fill="rgba(255,255,255,.55)" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` : "";
    const ridge = cfg.shake ? "" : `<path d="M58 ${206}Q150 ${216} 242 ${206}" stroke="${INK}" stroke-width="2.5" fill="none" opacity=".3"/>`;
    return `<svg class="drink ${o.cls || ""}" viewBox="0 0 300 470" ${o.label ? `role="img" aria-label="${esc(o.label)}"` : 'aria-hidden="true"'}>
      <defs><clipPath id="${id}c"><path d="${V.inner}"/></clipPath><clipPath id="${id}s"><rect x="-${sw - 2}" y="-224" width="${(sw - 2) * 2}" height="426" rx="4"/></clipPath></defs>
      <ellipse cx="150" cy="${V.shadow}" rx="112" ry="11" fill="${INK}" opacity=".16"/>
      ${straw}${stem}
      <path d="${V.inner}" fill="rgba(255,255,255,.4)"/>
      <g clip-path="url(#${id}c)"><g class="d-liq">${layers}<g class="d-marble">${marble}</g>${bits}</g><g class="d-boba">${boba}</g><g class="d-ices">${ice}</g>
        ${V.hl.map((h, i) => `<path d="${h}" stroke="#fff" stroke-width="${i ? 6 : 11}" stroke-linecap="round" fill="none" opacity="${i ? 0.35 : 0.42}"/>`).join("")}${ridge}</g>
      <g class="d-print" opacity=".95"><circle cx="${V.print[0]}" cy="${V.print[1]}" r="${V.print[2]}" fill="none" stroke="#FFF3DC" stroke-width="4"/><text x="${V.print[0]}" y="${V.print[1] + V.print[3] * 0.38}" text-anchor="middle" font-family="Dela Gothic One, sans-serif" font-size="${V.print[3]}" fill="#FFF3DC">MRB</text></g>
      <path d="${V.outer}" fill="none" stroke="${INK}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>
      <ellipse class="d-rim" cx="150" cy="${V.rimY}" rx="${V.rimRx}" ry="11" fill="rgba(255,255,255,.45)" stroke="${INK}" stroke-width="6"/>
      ${cfg.shake ? "" : `<path d="M46 ${V.rimY + 9}Q150 ${V.rimY + 26} 254 ${V.rimY + 9}" stroke="${INK}" stroke-width="3" fill="none" opacity=".45"/>`}
      ${scoop}${cream}<g class="d-dust">${dust}${crumble}</g>${drip}<g class="d-top">${top}</g>
    </svg>`;
  }

  const scooter = () => `<svg viewBox="0 0 64 56" width="58" height="50" aria-hidden="true"><circle cx="14" cy="44" r="10" fill="${INK}"/><circle cx="52" cy="44" r="10" fill="${INK}"/><circle cx="14" cy="44" r="4" fill="#FFF3DC"/><circle cx="52" cy="44" r="4" fill="#FFF3DC"/><path d="M8 36H46L54 24H60" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M10 36Q10 22 24 22H38L44 36Z" fill="#F6A6C1" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="6" y="2" width="24" height="20" rx="4" fill="#86B23D" stroke="${INK}" stroke-width="4"/><circle cx="40" cy="8" r="8" fill="#FFD45E" stroke="${INK}" stroke-width="4"/><path d="M38 16L36 26" stroke="${INK}" stroke-width="5" stroke-linecap="round"/></svg>`;
  function bite(type, o = {}) {
    const plate = `<ellipse cx="150" cy="232" rx="118" ry="30" fill="#FFF3DC" stroke="${INK}" stroke-width="6"/><ellipse cx="150" cy="226" rx="86" ry="18" fill="none" stroke="${INK}" stroke-width="3" opacity=".25"/>`;
    let art = "";
    if (type === "mochi") art = [[100, 196, "#C9E09A"], [200, 196, "#F8BCD1"], [150, 160, "#C9E09A"]].map(([x, y, c]) => `<g transform="translate(${x} ${y})"><path d="M-46 22C-50-20-24-40 0-40S50-20 46 22Z" fill="${c}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-26-20Q-16-28-4-28" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".7"/></g>`).join("");
    else if (type === "sando") art = `<g transform="translate(150 170)"><path d="M-96 50L0-80L96 50Z" fill="#FBE3B5" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-80 30L0-62L80 30Z" fill="#FFFBF2" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>${[[-34, 6], [0, -24], [34, 6]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M0-20C16-20 20-4 12 10C6 18 0 22 0 22S-6 18-12 10C-20-4-16-20 0-20Z" fill="#E4483F" stroke="${INK}" stroke-width="4"/><path d="M0-12C8-12 9-3 5 5C2 9 0 11 0 11S-2 9-5 5C-9-3-8-12 0-12Z" fill="#FFD9DC"/></g>`).join("")}</g>`;
    else art = cookie(150, 170, 3) ;
    return `<svg class="drink bite ${o.cls || ""}" viewBox="0 0 300 280" aria-hidden="true">${plate}${art}</svg>`;
  }
  const photo = (it, o = {}) => `<img class="photo ${it.cut ? "photo--cut" : "photo--full"} ${o.cls || ""}" src="${it.photo}" alt="${esc(o.label || tr(it.name))}" loading="lazy" decoding="async">`;
  const artFor = (it, o = {}) => (it.photo && o.photo !== false ? photo(it, o) : it.bite ? bite(it.bite, o) : drink(it.d, Object.assign({ seed: it.id.length }, o)));
  const thumb = (c, o = {}) => (c.photo ? `<img class="photo ${c.cut ? "photo--cut" : "photo--full"}" src="${c.photo}" alt="">` : c.bite ? bite(c.bite) : drink(c.d, Object.assign({ seed: 3 }, o)));

  /* ================= Chrome (nav, menu, drawer, modal) ================= */
  const ARROW = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 13L13 3M5 3h8v8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
  const LINKS = [["index.html", "home", "Home", "Inicio"], ["menu.html", "menu", "Menu & order", "Carta y pedido"], ["reserve.html", "reserve", "Book a table", "Reservar mesa"]];
  function chromeTop() {
    return `<a class="skip" href="#main">${T("Skip to content", "Saltar al contenido")}</a>
    <div class="cursor" aria-hidden="true"><i></i></div>
    <header class="nav" id="nav"><div class="wrap nav__in">
      <a class="brand" href="index.html" aria-label="MRB Matcha Bar">${badge({ cls: "brand__b" })}<span class="brand__t"><b>MRB</b><em>matcha bar</em></span></a>
      <nav class="nav__links" aria-label="Main">${LINKS.map((l) => `<a href="${l[0]}" ${page === l[1] ? 'aria-current="page"' : ""}>${T(l[2], l[3])}</a>`).join("")}</nav>
      <div class="nav__end">
        <button class="snd" type="button" data-sound aria-pressed="false"><span class="snd__bars"><i></i><i></i><i></i><i></i></span><span class="snd__t">${T("Sound off", "Sonido no")}</span></button>
        <div class="lang" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="${lang === "en"}">EN</button><button type="button" data-lang="es" aria-pressed="${lang === "es"}">ES</button></div>
        <button class="bag" type="button" data-cart-open aria-label="${T("Your order", "Tu pedido")}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><span class="bag__t">${T("Order", "Pedido")}</span><b class="bag__n" data-cart-count>0</b></button>
        <button class="burger" type="button" data-menu aria-expanded="false" aria-label="Menu"><i></i><i></i></button>
      </div></div></header>
    <div class="menu" id="menu" aria-hidden="true"><div class="menu__in wrap">
      <ul class="menu__links">${LINKS.map((l, i) => `<li><a href="${l[0]}"><sup>0${i + 1}</sup>${T(l[2], l[3])}</a></li>`).join("")}</ul>
      <div class="menu__side">${badge({ cls: "menu__badge" })}<p>Calle del Pez 21 · 28004 Madrid<br>${T("Every day · 8:00–21:00", "Todos los días · 8:00–21:00")}</p></div>
    </div></div>
    <div class="scrim" data-scrim></div>
    <aside class="drawer" id="cart" aria-hidden="true" aria-label="${T("Your order", "Tu pedido")}">
      <div class="drawer__head"><h2>${T("Your order", "Tu pedido")}</h2><button class="x" type="button" data-cart-close aria-label="${T("Close", "Cerrar")}">✕</button></div>
      <div class="drawer__mode" data-mode-wrap></div>
      <div class="drawer__body" data-cart-body></div><div class="drawer__foot" data-cart-foot></div></aside>
    <div class="modal" id="modal" aria-hidden="true" role="dialog" aria-modal="true"><div class="modal__card"><button class="x modal__x" type="button" data-modal-close aria-label="${T("Close", "Cerrar")}">✕</button><div data-modal-body></div></div></div>
    <div class="toasts" aria-live="polite"></div>
    <div class="wipe" aria-hidden="true"><i></i><i></i><i></i></div>`;
  }
  function chromeFoot() {
    return `<div class="foot__torn" aria-hidden="true"></div><div class="wrap">
      <div class="foot__top">${badge({ cls: "foot__badge" })}<p class="display foot__claim">${T("See you<br>at the bar.", "Nos vemos<br>en la barra.")}</p></div>
      <div class="foot__cols">
        <div><h3>${T("Visit", "Visítanos")}</h3><p>Calle del Pez 21<br>28004 Madrid · Malasaña<br>${T("Every day 8:00–21:00", "Todos los días 8:00–21:00")}</p></div>
        <div><h3>${T("Explore", "Explora")}</h3><p>${LINKS.map((l) => `<a href="${l[0]}">${T(l[2], l[3])}</a>`).join("<br>")}</p></div>
        <div><h3>${T("Say hi", "Escríbenos")}</h3><p><a href="mailto:malurosbolea@gmail.com">malurosbolea@gmail.com</a><br><a href="tel:+34600000000">+34 600 000 000</a></p></div>
      </div>
      <div class="foot__base"><span>© 2026 MRB Matcha Bar</span><span>${T("MRB is a concept brand designed and built by", "MRB es una marca concepto diseñada y desarrollada por")} <a href="https://malurosbolea-ux.github.io/digital-strategy-portfolio/" target="_blank" rel="noopener">María Luisa Ros Bolea</a>. ${T("No matcha was sold.", "No se ha vendido ni un matcha.")}</span><a href="https://www.linkedin.com/in/marialuisarosbolea/" target="_blank" rel="noopener">LinkedIn ↗</a></div>
    </div>`;
  }

  /* ================= Text: split + language ================= */
  function split(el) {
    const html = el.dataset.src != null ? el.dataset.src : (el.dataset.src = el.innerHTML);
    const tmp = d.createElement("div"); tmp.innerHTML = html; let i = 0;
    const walk = (node) => { const out = []; node.childNodes.forEach((c) => {
      if (c.nodeType === 3) c.textContent.split(/(\s+)/).forEach((tok) => { if (!tok) return; if (/^\s+$/.test(tok)) out.push(d.createTextNode(" ")); else { const w = d.createElement("span"); w.className = "w"; const wi = d.createElement("span"); wi.className = "wi"; wi.style.setProperty("--i", i++); wi.textContent = tok; w.appendChild(wi); out.push(w); } });
      else if (c.nodeName === "BR") out.push(d.createElement("br"));
      else if (c.nodeType === 1) { const cl = c.cloneNode(false); walk(c).forEach((x) => cl.appendChild(x)); out.push(cl); } }); return out; };
    el.innerHTML = ""; walk(tmp).forEach((x) => el.appendChild(x));
    el.setAttribute("aria-label", tmp.textContent.replace(/\s+/g, " ").trim());
  }
  function applyLang(first) {
    root.lang = lang;
    $$("[data-es]").forEach((el) => { if (el.dataset.en == null) el.dataset.en = el.innerHTML; const h = lang === "es" ? el.dataset.es : el.dataset.en; if (el.hasAttribute("data-split")) { el.dataset.src = h; split(el); if (el.dataset.was) el.classList.add("is-in"); } else el.innerHTML = h; });
    $$("[data-es-ph]").forEach((el) => { if (el.dataset.enPh == null) el.dataset.enPh = el.placeholder; el.placeholder = lang === "es" ? el.dataset.esPh : el.dataset.enPh; });
    if (d.body.dataset.titleEs) { if (!d.body.dataset.titleEn) d.body.dataset.titleEn = d.title; d.title = lang === "es" ? d.body.dataset.titleEs : d.body.dataset.titleEn; }
    if (first) $$("[data-split]:not([data-es])").forEach(split);
  }
  function setLang(l) {
    if (l === lang) return; lang = l; try { localStorage.setItem("mrb-m-lang", l); } catch (e) {}
    $("#chrome-top").innerHTML = chromeTop(); const f = $("#site-foot"); if (f) f.innerHTML = chromeFoot();
    applyLang(false); bindChrome(); renderCart(); Sound.set(Sound.on);
    $$("[data-rv]").forEach((e) => e.dataset.was && e.classList.add("is-in"));
    d.dispatchEvent(new CustomEvent("mrb:lang")); observe();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  /* ================= Reveal ================= */
  let io;
  function observe() {
    if (!("IntersectionObserver" in window)) { $$("[data-split],[data-rv]").forEach((e) => e.classList.add("is-in")); return; }
    io = io || new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); en.target.dataset.was = 1; io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    $$("[data-split]:not(.is-in),[data-rv]:not(.is-in)").forEach((e) => io.observe(e));
  }

  /* ================= Smooth scroll ================= */
  function smooth() {
    if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    const onS = (y) => { const n = $("#nav"); if (n) n.classList.toggle("is-scrolled", y > 30); };
    if (reduced || !window.Lenis) { addEventListener("scroll", () => onS(scrollY), { passive: true }); return; }
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", (e) => { onS(e.scroll); if (window.ScrollTrigger) ScrollTrigger.update(); });
    if (window.gsap) { gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); } else (function r(t) { lenis.raf(t); requestAnimationFrame(r); })(0);
    d.addEventListener("click", (e) => { const a = e.target.closest('a[href^="#"]'); if (!a) return; const t = a.getAttribute("href").length > 1 && $(a.getAttribute("href")); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -70 }); } });
    if (location.hash && $(location.hash)) setTimeout(() => lenis.scrollTo($(location.hash), { immediate: true, offset: -70 }), 300);
  }

  /* ================= Cart / order ================= */
  const FREE = 25, FEE = 2.49;
  let cart = [], mode = "delivery";
  try { cart = JSON.parse(localStorage.getItem("mrb-m-cart") || "[]"); mode = localStorage.getItem("mrb-m-mode") || "delivery"; } catch (e) {}
  const save = () => { try { localStorage.setItem("mrb-m-cart", JSON.stringify(cart)); localStorage.setItem("mrb-m-mode", mode); } catch (e) {} };
  const sub = () => cart.reduce((s, c) => s + c.price * c.qty, 0);
  const fee = () => (mode === "delivery" && sub() < FREE && cart.length ? FEE : 0);
  function add(item, from) {
    // item: {key,id,name:{en,es},price,d|bite,opts:{en,es}}
    const ex = cart.find((c) => c.key === item.key);
    ex ? ex.qty++ : cart.push(Object.assign({ qty: 1 }, item));
    save(); renderCart(); Sound.pop(820);
    const n = $("[data-cart-count]"); if (n) { n.classList.remove("bump"); void n.offsetWidth; n.classList.add("bump"); }
    fly(from); toast(`<b>${esc(tr(item.name))}</b> ${T("is in your order", "ya está en tu pedido")}`);
  }
  function addMenu(id, from, extra) {
    const it = MENU.find((m) => m.id === id); if (!it) return;
    add({ key: id + (extra ? JSON.stringify(extra.key) : ""), id, name: it.name, price: it.price + (extra ? extra.delta : 0), d: it.d || null, bite: it.bite || null, photo: it.photo || null, cut: !!it.cut, opts: extra ? extra.opts : null }, from);
  }
  function fly(from) {
    if (!from || reduced) return; const t = $("[data-cart-open]"); if (!t) return;
    const a = from.getBoundingClientRect(), b = t.getBoundingClientRect();
    const el = d.createElement("i"); el.className = "fly"; el.style.left = a.left + a.width / 2 + "px"; el.style.top = a.top + a.height / 2 + "px"; d.body.appendChild(el);
    el.animate([{ transform: "translate(-50%,-50%) scale(1)" }, { transform: `translate(calc(-50% + ${(b.left - a.left) / 2}px), calc(-50% + ${(b.top - a.top) / 2 - 120}px)) scale(1.3)`, offset: 0.5 }, { transform: `translate(calc(-50% + ${b.left + b.width / 2 - a.left - a.width / 2}px), calc(-50% + ${b.top + b.height / 2 - a.top - a.height / 2}px)) scale(.3)` }], { duration: 800, easing: "cubic-bezier(.5,0,.2,1)" }).onfinish = () => el.remove();
  }
  function renderCart() {
    const n = cart.reduce((s, c) => s + c.qty, 0);
    setTimeout(() => d.dispatchEvent(new CustomEvent("mrb:cart")), 0);
    $$("[data-cart-count]").forEach((e) => { e.textContent = n; e.classList.toggle("has", n > 0); });
    const body = $("[data-cart-body]"), foot = $("[data-cart-foot]"), mw = $("[data-mode-wrap]"); if (!body) return;
    mw.innerHTML = `<div class="seg" role="group"><button type="button" data-mode="delivery" aria-pressed="${mode === "delivery"}">${T("Delivery · 30 min", "A domicilio · 30 min")}</button><button type="button" data-mode="pickup" aria-pressed="${mode === "pickup"}">${T("Pick-up · 10 min", "Recoger · 10 min")}</button></div>`;
    if (!cart.length) { body.innerHTML = `<div class="empty">${drink({ layers: [], straw: "#F6A6C1" }, { cls: "empty__d" })}<p>${T("Your glass is empty. Let's fix that.", "Tu vaso está vacío. Vamos a arreglarlo.")}</p><a class="btn btn--pink" href="menu.html">${T("See the menu", "Ver la carta")} ${ARROW}</a></div>`; foot.innerHTML = ""; return; }
    body.innerHTML = cart.map((c, i) => `<div class="citem"><div class="citem__art">${thumb(c)}</div><div><b>${esc(tr(c.name))}</b>${c.opts ? `<span class="citem__o">${esc(tr(c.opts))}</span>` : ""}<div class="qty"><button type="button" data-q="${i}" data-dq="-1" aria-label="−">−</button><span>${c.qty}</span><button type="button" data-q="${i}" data-dq="1" aria-label="+">+</button></div></div><div class="citem__p">${eur(c.price * c.qty)}<button type="button" data-rm="${i}">${T("Remove", "Quitar")}</button></div></div>`).join("");
    const s = sub(), f = fee(), left = Math.max(0, FREE - s);
    foot.innerHTML = `${mode === "delivery" ? `<div class="freebar"><span>${left ? T(`Add ${eur(left)} for free delivery`, `Añade ${eur(left)} y el envío es gratis`) : T("Free delivery unlocked", "Envío gratis desbloqueado")}</span><i style="--p:${Math.min(1, s / FREE)}"></i></div>` : ""}
      <div class="sum"><span>${T("Subtotal", "Subtotal")}</span><span>${eur(s)}</span></div>
      ${mode === "delivery" ? `<div class="sum"><span>${T("Delivery", "Envío")}</span><span>${f ? eur(f) : T("Free", "Gratis")}</span></div>` : ""}
      <div class="sum sum--t"><span>Total</span><span>${eur(s + f)}</span></div>
      <button class="btn btn--ink btn--block" type="button" data-checkout>${T("Checkout", "Finalizar pedido")} ${ARROW}</button>`;
  }
  function openCart(o = true) { $("#cart").classList.toggle("is-on", o); $("#cart").setAttribute("aria-hidden", !o); $("[data-scrim]").classList.toggle("is-on", o); if (window.__lenis) o ? __lenis.stop() : __lenis.start(); if (o) Sound.tick(); }

  function openModal(html) { openCart(false); $("[data-modal-body]").innerHTML = html; const m = $("#modal"); m.classList.add("is-on"); m.setAttribute("aria-hidden", "false"); $("[data-scrim]").classList.add("is-on"); if (window.__lenis) __lenis.stop(); }
  function closeModal() { const m = $("#modal"); if (!m) return; m.classList.remove("is-on"); m.setAttribute("aria-hidden", "true"); $("[data-scrim]").classList.remove("is-on"); if (window.__lenis) __lenis.start(); clearTimeout(closeModal.t); }

  function checkout() {
    if (!cart.length) return;
    const s = sub();
    openModal(`<form class="co" data-co novalidate>
      <p class="label">${T("Checkout · demo", "Pedido · demo")}</p>
      <h2 class="display display--sm">${T("Almost<br>sipping.", "Casi<br>bebiendo.")}</h2>
      <div class="seg" role="group"><button type="button" data-comode="delivery" aria-pressed="${mode === "delivery"}">${T("Deliver to me", "Que me lo traigan")}</button><button type="button" data-comode="pickup" aria-pressed="${mode === "pickup"}">${T("I'll pick it up", "Lo recojo yo")}</button></div>
      <div class="fgrid">
        <label class="field"><span>${T("Name", "Nombre")}</span><input class="input" name="n" required autocomplete="name"></label>
        <label class="field"><span>${T("Phone", "Teléfono")}</span><input class="input" name="p" required type="tel" autocomplete="tel" placeholder="+34 600 000 000"></label>
        <label class="field full" data-addr ${mode === "pickup" ? "hidden" : ""}><span>${T("Address in Madrid", "Dirección en Madrid")}</span><input class="input" name="a" autocomplete="street-address" placeholder="${T("Street, number, floor", "Calle, número, piso")}"></label>
        <label class="field"><span>${T("When", "Cuándo")}</span><select class="input" name="w"><option>${T("As soon as possible", "Lo antes posible")}</option>${["12:30", "13:00", "13:30", "17:00", "17:30", "18:00", "18:30"].map((h) => `<option>${T("Today", "Hoy")} ${h}</option>`).join("")}</select></label>
        <label class="field"><span>${T("Pay", "Pago")}</span><select class="input" name="pay"><option>${T("Card on delivery", "Tarjeta al recibir")}</option><option>Bizum</option><option>${T("Cash", "Efectivo")}</option></select></label>
        <div class="field full"><span>${T("Tip the rider", "Propina para el rider")}</span><div class="chips" data-tips>${[0, 1, 2, 3].map((t, i) => `<button type="button" class="chip ${i === 1 ? "is-on" : ""}" data-tip="${t}">${t ? eur(t) : T("No tip", "Sin propina")}</button>`).join("")}</div></div>
      </div>
      <div class="co__sum" data-co-sum></div>
      <label class="check"><input type="checkbox" required> <span>${T("I know MRB is a concept brand built for a portfolio: no money is taken and no drink will arrive (sadly).", "Sé que MRB es una marca concepto para un portfolio: no se cobra nada y no llegará ninguna bebida (qué pena).")}</span></label>
      <button class="btn btn--pink btn--block" type="submit">${T("Place demo order", "Hacer pedido de prueba")} ${ARROW}</button></form>`);
    const m = $("#modal"), f = $("[data-co]", m); let tip = 1;
    const sumUp = () => { const fe = mode === "delivery" && s < FREE ? FEE : 0, tp = mode === "delivery" ? tip : 0; $("[data-co-sum]", m).innerHTML = cart.map((c) => `<div class="sum"><span>${c.qty}× ${esc(tr(c.name))}</span><span>${eur(c.price * c.qty)}</span></div>`).join("") + (mode === "delivery" ? `<div class="sum"><span>${T("Delivery", "Envío")}</span><span>${fe ? eur(fe) : T("Free", "Gratis")}</span></div><div class="sum"><span>${T("Tip", "Propina")}</span><span>${eur(tp)}</span></div>` : "") + `<div class="sum sum--t"><span>Total</span><span>${eur(s + fe + tp)}</span></div>`; };
    $$("[data-comode]", m).forEach((b) => b.addEventListener("click", () => { mode = b.dataset.comode; save(); renderCart(); $$("[data-comode]", m).forEach((x) => x.setAttribute("aria-pressed", x === b)); $("[data-addr]", m).hidden = mode === "pickup"; $("[data-tips]", m).closest(".field").hidden = mode === "pickup"; sumUp(); Sound.tick(); }));
    $$("[data-tip]", m).forEach((b) => b.addEventListener("click", () => { tip = +b.dataset.tip; $$("[data-tip]", m).forEach((x) => x.classList.toggle("is-on", x === b)); sumUp(); Sound.tick(); }));
    if (mode === "pickup") $("[data-tips]", m).closest(".field").hidden = true;
    sumUp();
    f.addEventListener("submit", (e) => {
      e.preventDefault(); let ok = true;
      $$("input[required]", f).forEach((i) => { const bad = i.type === "checkbox" ? !i.checked : !i.value.trim(); i.classList.toggle("is-err", bad); if (bad) ok = false; });
      if (mode === "delivery") { const a = f.a; const bad = !a.value.trim(); a.classList.toggle("is-err", bad); if (bad) ok = false; }
      if (!ok) { toast(T("Fill in the marked fields", "Rellena los campos marcados")); return; }
      track(f.n.value.trim().split(" ")[0]);
    });
  }
  function track(name) {
    const code = "MRB-" + Math.random().toString(36).slice(2, 6).toUpperCase(), items = cart.slice(), deliv = mode === "delivery";
    cart = []; save(); renderCart(); Sound.bell();
    const steps = deliv ? [T("Order received", "Pedido recibido"), T("Whisking your matcha", "Batiendo tu matcha"), T("Packed with ice", "Empaquetado con hielo"), T("Rider on the way", "Rider en camino"), T("At your door", "En tu puerta")] : [T("Order received", "Pedido recibido"), T("Whisking your matcha", "Batiendo tu matcha"), T("Ready at the counter", "Listo en la barra")];
    $("[data-modal-body]").innerHTML = `<div class="trk"><p class="label">${T("Order", "Pedido")} ${code}</p>
      <h2 class="display display--sm">${T("Thanks", "Gracias")}, ${esc(name)}!</h2>
      <div class="trk__art">${thumb(items[0], { seed: 5 })}</div>
      <div class="trk__road"><i class="trk__fill"></i><span class="trk__scoot">${deliv ? scooter() : badge()}</span></div>
      <ol class="trk__steps">${steps.map((s) => `<li>${s}</li>`).join("")}</ol>
      <p class="note">${T("Demo tracker: in a real store this would follow your rider live. Here it is just very fast.", "Seguimiento de demo: en una tienda real seguiría a tu rider en directo. Aquí simplemente va muy rápido.")}</p></div>`;
    const li = $$(".trk__steps li"), fill = $(".trk__fill"), sc = $(".trk__scoot"); let k = 0;
    const next = () => { if (!$(".trk")) return; li.forEach((l, i) => l.classList.toggle("is-on", i <= k)); const p = k / (li.length - 1); fill.style.transform = `scaleX(${p})`; sc.style.left = p * 100 + "%"; [Sound.bell, () => Sound.whisk(0.4), () => { Sound.whisk(0); Sound.clink(1); }, () => Sound.pop(500), () => Sound.chime()][Math.min(k, 4)].call(Sound); if (k === 2 && !deliv) Sound.chime(); if (++k < li.length) closeModal.t = setTimeout(next, 1700); else setTimeout(() => Sound.whisk(0), 300); };
    next();
  }

  function toast(h) { const b = $(".toasts"); if (!b) return; const t = d.createElement("div"); t.className = "toast"; t.innerHTML = h; b.appendChild(t); setTimeout(() => t.remove(), 3200); }

  /* ================= Cursor & page wipe ================= */
  function cursor() {
    if (!fine || reduced) return; const c = $(".cursor"); if (!c) return;
    let x = -100, y = -100, cx = x, cy = y;
    addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });
    d.addEventListener("mouseover", (e) => { const cc = $(".cursor"); if (cc) cc.classList.toggle("is-hover", !!e.target.closest("a,button,[data-grab],input,select,label")); });
    (function loop() { const cc = $(".cursor"); if (cc) { cx += (x - cx) * 0.22; cy += (y - cy) * 0.22; cc.style.transform = `translate(${cx}px,${cy}px)`; } requestAnimationFrame(loop); })();
  }
  d.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]"); if (!a || e.defaultPrevented || reduced || a.target === "_blank" || e.metaKey || e.ctrlKey) return;
    const h = a.getAttribute("href"); if (!h || h[0] === "#" || /^(mailto|tel|https?):/.test(h)) return;
    const u = new URL(h, location.href); if (u.pathname === location.pathname) return;
    e.preventDefault(); const w = $(".wipe"); w.classList.add("is-out"); Sound.tick(); setTimeout(() => (location.href = u.href), 620);
  });
  addEventListener("pageshow", (e) => { if (e.persisted) { const w = $(".wipe"); if (w) w.classList.remove("is-out"); } });

  /* ================= Bind ================= */
  function toggleMenu(f) { const o = f != null ? f : !root.classList.contains("menu-open"); root.classList.toggle("menu-open", o); const b = $("[data-menu]"); if (b) b.setAttribute("aria-expanded", o); $("#menu").setAttribute("aria-hidden", !o); if (window.__lenis) o ? __lenis.stop() : __lenis.start(); }
  function bindChrome() {
    $("[data-menu]").addEventListener("click", () => { toggleMenu(); Sound.tick(); });
    $$("[data-lang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
    $$("[data-sound]").forEach((b) => b.addEventListener("click", () => { Sound.set(!Sound.on); if (Sound.on) Sound.chime(); }));
    $("[data-cart-open]").addEventListener("click", () => openCart(true));
    $("[data-cart-close]").addEventListener("click", () => openCart(false));
    $("[data-scrim]").addEventListener("click", () => { openCart(false); closeModal(); });
    $("[data-modal-close]").addEventListener("click", closeModal);
    $("[data-cart-body]").addEventListener("click", (e) => { const q = e.target.closest("[data-q]"); if (q) { const c = cart[+q.dataset.q]; c.qty += +q.dataset.dq; if (c.qty < 1) cart.splice(+q.dataset.q, 1); save(); renderCart(); Sound.tick(); } const r = e.target.closest("[data-rm]"); if (r) { cart.splice(+r.dataset.rm, 1); save(); renderCart(); Sound.tick(); } });
    $("[data-cart-foot]").addEventListener("click", (e) => { if (e.target.closest("[data-checkout]")) checkout(); });
    $("[data-mode-wrap]").addEventListener("click", (e) => { const b = e.target.closest("[data-mode]"); if (b) { mode = b.dataset.mode; save(); renderCart(); Sound.tick(); } });
  }
  d.addEventListener("click", (e) => { const a = e.target.closest("[data-add]"); if (a) { e.preventDefault(); addMenu(a.dataset.add, a); a.classList.add("is-added"); setTimeout(() => a.classList.remove("is-added"), 1100); } });
  d.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); openCart(false); toggleMenu(false); } });

  /* ================= Public API ================= */
  window.MRB = { photo, thumb, kanji, scooter, cartInfo: () => ({ n: cart.reduce((s, c) => s + c.qty, 0), sub: sub(), mode }), openCart: () => openCart(true), $, $$, T, tr, eur, esc, get lang() { return lang; }, reduced, fine, Sound, badge, drink, bite, artFor, add, addMenu, toast, openModal, closeModal, ARROW, split, observe, MENU, C, INK, wave };

  /* ================= Boot ================= */
  root.classList.add("js");
  const top = d.createElement("div"); top.id = "chrome-top"; top.innerHTML = chromeTop(); d.body.prepend(top);
  const f = $("#site-foot"); if (f) { f.classList.add("foot"); f.innerHTML = chromeFoot(); }
  applyLang(true); bindChrome(); renderCart(); smooth(); cursor();
  let snd = "0"; try { snd = localStorage.getItem("mrb-m-sound") || "0"; } catch (e) {}
  if (snd === "1") { Sound.set(false); const resume = () => { Sound.set(true); removeEventListener("pointerdown", resume); removeEventListener("keydown", resume); }; addEventListener("pointerdown", resume); addEventListener("keydown", resume); }
  requestAnimationFrame(() => { $(".wipe").classList.add("is-in"); });
  d.dispatchEvent(new CustomEvent("mrb:ready"));
  setTimeout(observe, page === "home" ? 50 : 300);
})();
