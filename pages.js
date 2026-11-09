/* MRB Matcha Bar — menu page + reservations */
(function () {
  "use strict";
  const d = document, M = window.MRB; if (!M) return;
  const { $, $$, Sound, C } = M;
  const T = (a, b) => M.T(a, b);
  const page = d.body.dataset.page;
  const BG = { matcha: "#CFE7B0", coffee: "#FBE6BF", tea: "#FFD45E", shake: "#F8BCD1", bites: "#A8D8E8" };

  const art = $("[data-phead-art]");
  if (art) { const it = M.MENU.find((m) => m.id === (page === "menu" ? "dirty-matcha" : "strawberry-cloud")); art.innerHTML = `<img class="phead__photo" src="${it.photo}" alt="" decoding="async">`; }
  if (art && window.gsap && !M.reduced) gsap.from(art, { y: 300, rotate: 30, duration: 1.3, ease: "elastic.out(1,.6)", delay: 0.4 });

  /* ================= MENU ================= */
  if (page === "menu") {
    const tabs = $("[data-tabs]"), cats = $("[data-cats]"), mini = $("[data-mini]");
    const size = {};
    const render = () => {
      tabs.innerHTML = window.MRB_CATS.map((c) => `<a class="chip" href="#cat-${c[0]}">${T(c[1], c[2])}</a>`).join("");
      cats.innerHTML = window.MRB_CATS.map((c) => `<section class="mcat" id="cat-${c[0]}"><div class="mcat__h"><h2 class="display display--sm" data-split>${T(c[1], c[2])}</h2></div><div class="mitems">${M.MENU.filter((m) => m.cat === c[0]).map((m, i) => `
        <article class="mitem ${size[m.id] ? "is-lg" : ""}" data-rv style="--rd:${(i % 2) * 80}ms">
          <div class="mitem__art" style="--bg:${BG[c[0]]}">${M.artFor(m, { seed: i + 2, label: M.tr(m.name) })}${m.bite || m.custom ? "" : `<span class="mitem__ml">${size[m.id] ? "500" : "350"} ml</span>`}</div>
          <div>
            <div class="mitem__tags">${m.tags.includes("signature") ? `<span class="mtag">${T("Signature", "De la casa")}</span>` : ""}${m.tags.includes("vegan") ? `<span class="mtag mtag--v">${T("Vegan", "Vegano")}</span>` : ""}</div>
            <h3>${M.tr(m.name)}</h3><p>${M.tr(m.desc)}</p>
            <div class="mitem__row">
              <span class="mitem__price" data-price="${m.id}">${M.eur(m.price + (size[m.id] ? 0.9 : 0))}</span>
              ${m.bite || m.custom ? "" : `<span class="sizes" role="group" aria-label="Size"><button type="button" data-size="${m.id}" data-s="0" aria-pressed="${!size[m.id]}">${T("Reg", "Normal")}</button><button type="button" data-size="${m.id}" data-s="1" aria-pressed="${!!size[m.id]}">${T("Large", "Grande")}</button></span>`}
              ${m.custom ? `<a class="add" href="index.html#lab"><span>${T("Build it", "Crear")}</span><i>→</i></a>` : `<button class="add" type="button" data-madd="${m.id}"><span>${T("Add", "Añadir")}</span><i>+</i></button>`}
            </div>
          </div></article>`).join("")}</div></section>`).join("");
      $$("[data-split]", cats).forEach(M.split);
      M.observe();
    };
    const renderMini = () => { const c = M.cartInfo(); mini.innerHTML = `<h3>${T("Your order", "Tu pedido")}</h3><p>${c.n ? `${c.n} ${c.n === 1 ? T("item", "producto") : T("items", "productos")} · <b>${M.eur(c.sub)}</b>` : T("Nothing yet. Tap “Add” on anything that looks good.", "Nada todavía. Pulsa «Añadir» en lo que te apetezca.")}</p><p class="note">${c.mode === "pickup" ? T("Pick-up at Calle del Pez 21 · 10 min", "Recogida en Calle del Pez 21 · 10 min") : T("Delivery · about 30 min", "A domicilio · unos 30 min")}</p><button class="btn btn--ink btn--sm" type="button" data-mini-open ${c.n ? "" : "disabled style='opacity:.4'"}>${T("Review & checkout →", "Revisar y pagar →")}</button>`; };
    cats.addEventListener("click", (e) => {
      const s = e.target.closest("[data-size]"); if (s) { size[s.dataset.size] = s.dataset.s === "1"; $$(`[data-size="${s.dataset.size}"]`).forEach((b) => b.setAttribute("aria-pressed", b === s)); const it = M.MENU.find((m) => m.id === s.dataset.size); $(`[data-price="${it.id}"]`).textContent = M.eur(it.price + (size[it.id] ? 0.9 : 0)); const art = s.closest(".mitem"); art.classList.toggle("is-lg", size[it.id]); const ml = $(".mitem__ml", art); if (ml) ml.textContent = (size[it.id] ? "500" : "350") + " ml"; size[it.id] ? Sound.pour(0.35, 520) : Sound.tick(); return; }
      const a = e.target.closest("[data-madd]"); if (a) { const id = a.dataset.madd; M.addMenu(id, a, size[id] ? { key: "lg", delta: 0.9, opts: { en: "Large 500 ml", es: "Grande 500 ml" } } : null); a.classList.add("is-added"); setTimeout(() => a.classList.remove("is-added"), 1000); }
    });
    mini.addEventListener("click", (e) => { if (e.target.closest("[data-mini-open]")) M.openCart(); });
    render(); renderMini();
    d.addEventListener("mrb:cart", renderMini);
    d.addEventListener("mrb:lang", () => { render(); renderMini(); });
  }

  /* ================= RESERVE ================= */
  if (page === "reserve") {
    const INK = M.INK;
    const SEATS = [
      { id: "counter", n: ["Matcha counter", "Barra de matcha"], s: ["Watch us whisk. Up to 4.", "Nos ves batir. Hasta 4."], min: 1, max: 4, svg: `<svg viewBox="0 0 200 80"><rect x="10" y="30" width="180" height="16" rx="4" fill="#B4703E" stroke="${INK}" stroke-width="4"/><rect x="20" y="46" width="160" height="26" fill="#E9C98B" stroke="${INK}" stroke-width="4"/>${[40, 80, 120, 160].map((x) => `<rect x="${x - 10}" y="6" width="20" height="10" rx="3" fill="#F6A6C1" stroke="${INK}" stroke-width="3"/><line x1="${x}" y1="16" x2="${x}" y2="30" stroke="${INK}" stroke-width="4"/>`).join("")}</svg>` },
      { id: "tatami", n: ["Tatami room", "Sala de tatami"], s: ["Shoes off, cushions on. 2 to 8.", "Sin zapatos y con cojín. De 2 a 8."], min: 2, max: 8, svg: `<svg viewBox="0 0 200 80"><rect x="10" y="40" width="180" height="34" fill="#CFE7B0" stroke="${INK}" stroke-width="4"/><line x1="100" y1="40" x2="100" y2="74" stroke="${INK}" stroke-width="3"/><rect x="60" y="26" width="80" height="14" rx="3" fill="#B4703E" stroke="${INK}" stroke-width="4"/>${[40, 160].map((x) => `<rect x="${x - 18}" y="44" width="36" height="10" rx="5" fill="#F6A6C1" stroke="${INK}" stroke-width="3"/>`).join("")}</svg>` },
      { id: "terrace", n: ["Lantern terrace", "Terraza de farolillos"], s: ["Fresh air, fairy lights. Up to 6.", "Aire libre y lucecitas. Hasta 6."], min: 1, max: 6, svg: `<svg viewBox="0 0 200 80"><path d="M10 10Q100 34 190 10" stroke="${INK}" stroke-width="3" fill="none"/>${[40, 80, 120, 160].map((x, i) => `<ellipse cx="${x}" cy="${22 + (i % 2) * 2}" rx="8" ry="11" fill="${["#E4483F", "#FFD45E", "#F6A6C1", "#86B23D"][i]}" stroke="${INK}" stroke-width="3"/>`).join("")}<rect x="60" y="52" width="80" height="10" rx="3" fill="#E9C98B" stroke="${INK}" stroke-width="4"/><line x1="80" y1="62" x2="80" y2="76" stroke="${INK}" stroke-width="4"/><line x1="120" y1="62" x2="120" y2="76" stroke="${INK}" stroke-width="4"/></svg>` }
    ];
    const st = { seat: SEATS[0], guests: 2, date: null, time: null };
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const maxD = new Date(today); maxD.setDate(today.getDate() + 45);
    let view = new Date(today.getFullYear(), today.getMonth(), 1);
    const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
    const iso = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
    const loc = () => (M.lang === "es" ? "es-ES" : "en-GB");
    const fmt = (x, o = { weekday: "short", day: "numeric", month: "short" }) => new Intl.DateTimeFormat(loc(), o).format(x);
    const form = $("[data-bform]");
    const seats = () => { $("[data-seats]").innerHTML = SEATS.map((s) => `<button type="button" class="seat ${s === st.seat ? "is-on" : ""}" data-seat="${s.id}" aria-pressed="${s === st.seat}">${s.svg}<b>${T(s.n[0], s.n[1])}</b><span>${T(s.s[0], s.s[1])}</span></button>`).join(""); };
    const guests = () => { st.guests = Math.max(st.seat.min, Math.min(st.seat.max, st.guests)); $("[data-guests]").textContent = st.guests; $("[data-gnote]").textContent = T(`${st.seat.min}–${st.seat.max} guests at the ${st.seat.n[0].toLowerCase()}`, `${st.seat.min}–${st.seat.max} personas en ${st.seat.n[1].toLowerCase()}`); };
    const cal = () => {
      const y = view.getFullYear(), m = view.getMonth(); const t = fmt(view, { month: "long", year: "numeric" }); $("[data-cal-t]").textContent = t.charAt(0).toUpperCase() + t.slice(1);
      const dows = M.lang === "es" ? ["L", "M", "X", "J", "V", "S", "D"] : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
      let h = dows.map((x) => `<span class="dow">${x}</span>`).join(""); const first = (new Date(y, m, 1).getDay() + 6) % 7;
      for (let i = 0; i < first; i++) h += "<span></span>";
      for (let dd = 1; dd <= new Date(y, m + 1, 0).getDate(); dd++) { const x = new Date(y, m, dd); const dis = x < today || x > maxD || hash(iso(x) + st.seat.id) % 11 === 0; h += `<button type="button" ${dis ? "disabled" : ""} class="${st.date && iso(st.date) === iso(x) ? "is-on" : ""} ${iso(x) === iso(today) ? "today" : ""}" data-day="${iso(x)}">${dd}</button>`; }
      $("[data-cal]").innerHTML = h;
      $("[data-cal-p]").disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1); $("[data-cal-n]").disabled = new Date(y, m + 1, 1) > maxD;
    };
    const times = () => {
      const box = $("[data-times]"); if (!st.date) { box.innerHTML = `<p class="note">${T("Pick a day first.", "Elige primero un día.")}</p>`; return; }
      const now = new Date(), isT = iso(st.date) === iso(now); let h = "";
      for (let t = 8 * 60 + 30; t <= 20 * 60; t += 30) { const lab = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`; const dis = (isT && t <= now.getHours() * 60 + now.getMinutes() + 30) || hash(iso(st.date) + lab + st.seat.id) % 4 === 0; h += `<button type="button" data-time="${lab}" ${dis ? "disabled" : ""} class="${st.time === lab ? "is-on" : ""}">${lab}</button>`; }
      box.innerHTML = h;
    };
    const ok = () => ({ n: !!form.n.value.trim(), e: /^\S+@\S+\.\S+$/.test(form.e.value), c: form.ok.checked });
    const sum = () => {
      $("[data-bsum]").innerHTML = [[T("Where", "Dónde"), T(st.seat.n[0], st.seat.n[1])], [T("Guests", "Personas"), st.guests], [T("Day", "Día"), st.date ? fmt(st.date, { weekday: "long", day: "numeric", month: "long" }) : "—"], [T("Time", "Hora"), st.time || "—"], [T("Address", "Dirección"), "Calle del Pez 21"]].map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("");
      const f = ok(), miss = []; if (!st.date) miss.push(T("a day", "un día")); if (!st.time) miss.push(T("a time", "una hora")); if (!f.n) miss.push(T("your name", "tu nombre")); if (!f.e) miss.push(T("an email", "un email")); if (!f.c) miss.push(T("the checkbox", "la casilla"));
      $("[data-bconfirm]").disabled = miss.length > 0; $("[data-bmiss]").textContent = miss.length ? T("Still missing: ", "Falta: ") + miss.join(", ") + "." : T("All set!", "¡Todo listo!");
    };
    $("[data-bsum-art]").innerHTML = M.drink(M.MENU[0].d, { seed: 8 });
    const all = () => { seats(); guests(); cal(); times(); sum(); };
    $("[data-seats]").addEventListener("click", (e) => { const b = e.target.closest("[data-seat]"); if (!b) return; st.seat = SEATS.find((s) => s.id === b.dataset.seat); st.time = null; Sound.thud(); all(); });
    $$("[data-g]").forEach((b) => b.addEventListener("click", () => { st.guests += +b.dataset.g; guests(); sum(); Sound.tick(); }));
    $("[data-cal]").addEventListener("click", (e) => { const b = e.target.closest("[data-day]"); if (!b || b.disabled) return; const [y, m, dd] = b.dataset.day.split("-").map(Number); st.date = new Date(y, m - 1, dd); st.time = null; cal(); times(); sum(); Sound.tick(); });
    $("[data-cal-p]").addEventListener("click", () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); cal(); });
    $("[data-cal-n]").addEventListener("click", () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); cal(); });
    $("[data-times]").addEventListener("click", (e) => { const b = e.target.closest("[data-time]"); if (!b || b.disabled) return; st.time = b.dataset.time; times(); sum(); Sound.clink(1.1, 0.12); });
    form.addEventListener("input", sum); form.addEventListener("change", sum); form.addEventListener("submit", (e) => e.preventDefault());
    const qr = (code) => { let h = hash(code); const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; }; const N = 25, f = (x, y) => [[0, 0], [N - 7, 0], [0, N - 7]].find(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7); let r = ""; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const F = f(x, y); let on; if (F) { const dx = x - F[0], dy = y - F[1]; on = dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx > 1 && dx < 5 && dy > 1 && dy < 5); } else on = rnd() > 0.5; if (on) r += `<rect x="${x}" y="${y}" width="1" height="1"/>`; } return `<svg viewBox="-1 -1 27 27" shape-rendering="crispEdges"><rect x="-1" y="-1" width="27" height="27" fill="#fff"/><g fill="${INK}">${r}</g></svg>`; };
    const ics = (b) => { const [hh, mm] = b.time.split(":").map(Number), [y, m, dd] = b.date.split("-").map(Number), p = (n) => String(n).padStart(2, "0"); const e = hh * 60 + mm + 90; const txt = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//MRB Matcha Bar//EN", "BEGIN:VEVENT", `UID:${b.code}@mrb-matcha`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`, `DTSTART;TZID=Europe/Madrid:${y}${p(m)}${p(dd)}T${p(hh)}${p(mm)}00`, `DTEND;TZID=Europe/Madrid:${y}${p(m)}${p(dd)}T${p(Math.floor(e / 60))}${p(e % 60)}00`, `SUMMARY:MRB Matcha Bar · ${b.seat} (${b.guests})`, "LOCATION:Calle del Pez 21\\, 28004 Madrid", `DESCRIPTION:Booking ${b.code}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n"); const a = d.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "text/calendar" })); a.download = `MRB-matcha-${b.code}.ics`; d.body.appendChild(a); a.click(); a.remove(); };
    $("[data-bconfirm]").addEventListener("click", () => {
      const f = ok(); if (!(f.n && f.e && f.c && st.date && st.time)) return;
      const b = { code: "MRB-" + Math.random().toString(36).slice(2, 6).toUpperCase(), name: form.n.value.trim().split(" ")[0], seat: T(st.seat.n[0], st.seat.n[1]), guests: st.guests, date: iso(st.date), time: st.time };
      Sound.bell();
      $("[data-book]").hidden = true; const box = $("[data-ticket]"); box.hidden = false;
      box.innerHTML = `<p class="label" style="margin-bottom:16px">${T("Booking confirmed", "Reserva confirmada")}</p><div class="ticket"><div class="ticket__m"><h2 class="display display--sm">${T("See you soon", "Hasta pronto")}, ${M.esc(b.name)}!</h2><dl class="ticket__g"><div><dt>${T("Where", "Dónde")}</dt><dd>${b.seat}</dd></div><div><dt>${T("Day", "Día")}</dt><dd>${fmt(st.date)}</dd></div><div><dt>${T("Time", "Hora")}</dt><dd>${b.time}</dd></div><div><dt>${T("Guests", "Personas")}</dt><dd>${b.guests}</dd></div><div><dt>${T("Address", "Dirección")}</dt><dd>Calle del Pez 21</dd></div><div><dt>${T("Code", "Código")}</dt><dd>${b.code}</dd></div></dl></div><div class="ticket__s">${qr(b.code)}<span class="note">${T("Show at the door", "Enséñalo en la puerta")}</span></div></div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:28px"><button class="btn btn--pink" type="button" data-ics>${T("Add to calendar", "Añadir al calendario")}</button><a class="btn" href="menu.html">${T("Pre-order drinks →", "Pedir bebidas antes →")}</a><button class="btn" type="button" data-again>${T("Book another", "Reservar otra")}</button></div>
        <p class="note" style="margin-top:16px">${T("Demo booking: nothing is sent and no table is held.", "Reserva de prueba: no se envía nada ni se guarda ninguna mesa.")}</p>`;
      if (window.gsap && !M.reduced) gsap.from($(".ticket", box), { y: 120, rotate: -8, opacity: 0, duration: 1, ease: "elastic.out(1,.6)" });
      $("[data-ics]", box).addEventListener("click", () => ics(b));
      $("[data-again]", box).addEventListener("click", () => { box.hidden = true; $("[data-book]").hidden = false; st.time = null; times(); sum(); });
      const t = $("#book"); window.__lenis ? __lenis.scrollTo(t, { offset: -80 }) : t.scrollIntoView();
    });
    all();
    d.addEventListener("mrb:lang", all);
  }
})();
