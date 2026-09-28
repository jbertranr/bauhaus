/* Social 360 · seguiment: gràfic per eixos, llista filtrable de fitxes, riscos i fases */
(function () {
  const D = window.S360;
  if (!D) return;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (sel) => document.querySelector(sel);

  // ---------- Estat a partir de la puntuació ----------
  const ESTATS = [
    { id: "done", nom: "Completat" },
    { id: "doing", nom: "Avanç parcial" },
    { id: "todo", nom: "Pendent" },
    { id: "none", nom: "Sense puntuació" },
  ];
  const estat = (f) => (f.nota === null ? "none" : f.nota === 10 ? "done" : f.nota === 0 ? "todo" : "doing");
  const estatNom = (id) => ESTATS.find((e) => e.id === id).nom;

  // ---------- Risc ----------
  const RISCOS = [
    { id: "Alt", cls: "r-alt" },
    { id: "Mig", cls: "r-mig" },
    { id: "Baix", cls: "r-baix" },
    { id: "Molt baix", cls: "r-molt" },
    { id: "Sense", cls: "r-sense" },
    { id: "No informat", cls: "r-ni" },
  ];
  const risc = (f) => (f.risc === null || f.risc === "No classificat" ? "No informat" : f.risc);
  const riscCls = (r) => RISCOS.find((x) => x.id === r).cls;
  const riscNom = (r) => (r === "Sense" ? "Sense risc" : `Risc ${r.toLowerCase()}`);
  const eixNom = (id) => D.eixos.find((e) => e.id === id);
  const label = (f) => f.codi || f.titol;
  const byCode = {};
  D.fitxes.forEach((f) => { if (f.codi) byCode[f.codi] = f; });

  // ---------- Gràfic per eixos ----------
  const bars = $("#bars");
  const table = $("#bars-table");
  const tip = $("#tooltip");
  let rows = "";
  let trs = '<thead><tr><th scope="col">Eix</th><th scope="col">Fitxes</th><th scope="col">Completat</th><th scope="col">Parcial</th><th scope="col">Pendent</th><th scope="col">Sense puntuació</th><th scope="col">Risc Alt</th></tr></thead><tbody>';
  D.eixos.forEach((e) => {
    const fs = D.fitxes.filter((f) => f.eix === e.id);
    const n = { done: 0, doing: 0, todo: 0, none: 0 };
    fs.forEach((f) => n[estat(f)]++);
    const alt = fs.filter((f) => risc(f) === "Alt").length;
    const segs = ESTATS.filter((s) => n[s.id] > 0).map((s) =>
      `<span class="seg seg-${s.id}" style="flex-grow:${n[s.id]}" tabindex="0" data-tip="${esc(`${e.nom} · ${s.nom}: ${n[s.id]} de ${fs.length}`)}"><span class="seg-n">${n[s.id]}</span></span>`
    ).join("");
    rows += `<div class="bar-row">
      <div class="bar-label"><strong>${esc(e.nom)}</strong><span>${esc(e.titol)}</span></div>
      <div class="bar-track" style="--total:${fs.length}" aria-hidden="true"><div class="bar" style="width:calc(${fs.length} / 23 * 100%)">${segs}</div></div>
      <div class="bar-meta"><span>${fs.length} fitxes</span><span class="bar-alt">${alt} de risc Alt</span></div>
    </div>`;
    trs += `<tr><th scope="row">${esc(e.nom)}</th><td>${fs.length}</td><td>${n.done}</td><td>${n.doing}</td><td>${n.todo}</td><td>${n.none}</td><td>${alt}</td></tr>`;
  });
  bars.innerHTML = rows;
  table.innerHTML = trs + "</tbody>";

  const showTip = (el) => {
    tip.textContent = el.dataset.tip;
    tip.hidden = false;
    const r = el.getBoundingClientRect();
    const p = bars.getBoundingClientRect();
    tip.style.left = `${Math.max(0, r.left - p.left + r.width / 2)}px`;
    tip.style.top = `${r.top - p.top}px`;
  };
  bars.addEventListener("mouseover", (ev) => { const s = ev.target.closest(".seg"); if (s) showTip(s); });
  bars.addEventListener("focusin", (ev) => { const s = ev.target.closest(".seg"); if (s) showTip(s); });
  bars.addEventListener("mouseleave", () => { tip.hidden = true; });
  bars.addEventListener("focusout", () => { tip.hidden = true; });

  // ---------- Fitxes ----------
  const meter = (f) => {
    const st = estat(f);
    if (f.nota === null) return `<span class="meter meter-none" aria-label="Sense puntuació"><span class="meter-txt">Sense puntuació</span></span>`;
    let cells = "";
    for (let i = 0; i < 10; i++) cells += `<i class="${i < f.nota ? "on" : ""}"></i>`;
    return `<span class="meter meter-${st}" aria-label="Puntuació ${f.nota} de 10"><span class="cells" aria-hidden="true">${cells}</span><span class="meter-txt" aria-hidden="true">${f.nota}/10</span></span>`;
  };
  const field = (name, v) => `<div class="fd"><dt>${name}</dt><dd>${v ? esc(v) : '<span class="ni">No informat</span>'}</dd></div>`;
  const card = (f) => {
    const st = estat(f), r = risc(f);
    const impr = f.impr === "Sí" ? '<span class="chip chip-impr">Imprescindible</span>' : f.impr === "No" ? '<span class="chip chip-opt">No imprescindible</span>' : "";
    return `<details class="fitxa" id="${f.id}" data-eix="${f.eix}" data-estat="${st}" data-risc="${esc(r)}">
      <summary>
        <span class="fx-code">${esc(f.codi || "—")}</span>
        <span class="fx-title">${esc(f.titol)}${f.sub ? `<span class="fx-sub">${esc(f.sub)}</span>` : ""}</span>
        ${meter(f)}
        <span class="fx-chips">
          <span class="chip chip-${st}">${estatNom(st)}</span>
          <span class="chip chip-risc ${riscCls(r)}"><span class="dot" aria-hidden="true"></span>${riscNom(r)}</span>
          ${impr}
        </span>
      </summary>
      <dl class="fx-body">
        ${field("Descripció", f.desc)}
        ${field("Situació actual", f.situacio)}
        ${field("Què diuen els plecs", f.plecs)}
        ${field("Eines a integrar o interoperar", f.eines)}
        ${field("Documentació tècnica pendent", f.docs)}
        ${f.obs ? field("Observació", f.obs) : ""}
      </dl>
    </details>`;
  };
  const llista = $("#llista");
  llista.innerHTML = D.eixos.map((e) => {
    const fs = D.fitxes.filter((f) => f.eix === e.id);
    return `<section class="grup" data-eix="${e.id}" aria-labelledby="g-${e.id}">
      <h3 class="grup-title" id="g-${e.id}">${esc(e.nom)} <span>${esc(e.titol)}</span></h3>
      ${fs.map(card).join("")}
    </section>`;
  }).join("");

  // ---------- Filtres ----------
  const state = { eix: "", estat: "", risc: "", q: "" };
  const chips = (el, key, opts) => {
    el.innerHTML = [["", "Tots"], ...opts].map(([v, t]) =>
      `<button type="button" class="chip-btn" data-v="${esc(v)}" aria-pressed="${v === "" ? "true" : "false"}">${esc(t)}</button>`).join("");
    el.addEventListener("click", (ev) => {
      const b = ev.target.closest("button");
      if (!b) return;
      state[key] = b.dataset.v;
      el.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      apply();
    });
  };
  chips($("#f-eix"), "eix", D.eixos.map((e) => [e.id, e.nom]));
  chips($("#f-estat"), "estat", ESTATS.map((e) => [e.id, e.nom]));
  chips($("#f-risc"), "risc", RISCOS.map((r) => [r.id, riscNom(r.id)]));

  const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const hay = {};
  D.fitxes.forEach((f) => { hay[f.id] = norm([f.codi, f.titol, f.sub, f.eines, f.desc].join(" ")); });

  const count = $("#count");
  const empty = $("#empty");
  function apply() {
    const q = norm(state.q.trim());
    let shown = 0;
    llista.querySelectorAll(".fitxa").forEach((el) => {
      const ok = (!state.eix || el.dataset.eix === state.eix)
        && (!state.estat || el.dataset.estat === state.estat)
        && (!state.risc || el.dataset.risc === state.risc)
        && (!q || hay[el.id].includes(q));
      el.hidden = !ok;
      if (ok) shown++;
    });
    llista.querySelectorAll(".grup").forEach((g) => { g.hidden = !g.querySelector(".fitxa:not([hidden])"); });
    count.textContent = shown === D.fitxes.length ? `${shown} fitxes` : `${shown} de ${D.fitxes.length} fitxes`;
    empty.hidden = shown > 0;
  }
  $("#q").addEventListener("input", (ev) => { state.q = ev.target.value; apply(); });
  $("#reset").addEventListener("click", () => {
    Object.assign(state, { eix: "", estat: "", risc: "", q: "" });
    $("#q").value = "";
    document.querySelectorAll(".filter-row button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === "")));
    apply();
  });
  apply();

  // ---------- Enllaços a una fitxa ----------
  const codeLink = (f) => `<a class="code-chip" href="#${f.id}" data-open="${f.id}">${esc(label(f))}</a>`;
  function openFitxa(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.hidden) $("#reset").click();
    el.open = true;
    el.scrollIntoView({ block: "center" });
    el.querySelector("summary").focus({ preventScroll: true });
  }
  document.addEventListener("click", (ev) => {
    const a = ev.target.closest("[data-open]");
    if (!a) return;
    ev.preventDefault();
    history.replaceState(null, "", `#${a.dataset.open}`);
    openFitxa(a.dataset.open);
  });
  if (location.hash.startsWith("#f-")) openFitxa(location.hash.slice(1));

  // ---------- Riscos ----------
  $("#risk-groups").innerHTML = RISCOS.map((r) => {
    const fs = D.fitxes.filter((f) => risc(f) === r.id);
    const nom = r.id === "No informat" ? "No classificat o no informat" : r.id === "Sense" ? "Sense risc identificat" : `Risc ${r.id.toLowerCase()}`;
    return `<div class="risk-group ${r.cls}">
      <h4><span class="dot" aria-hidden="true"></span>${esc(nom)} <span class="rg-n">${fs.length}</span></h4>
      <div class="codes">${fs.map(codeLink).join("")}</div>
    </div>`;
  }).join("");

  $("#deps").innerHTML = D.dependencies.map((d) => `<article class="dep">
      <h4>${esc(d.nom)}</h4>
      <p>${esc(d.text)}.</p>
      <div class="codes">${d.codis.map((c) => (byCode[c] ? codeLink(byCode[c]) : "")).join("")}</div>
    </article>`).join("");

  // ---------- Fases ----------
  document.querySelectorAll("[data-fase]").forEach((el) => {
    el.innerHTML = D.fitxes.filter((f) => estat(f) === el.dataset.fase).map(codeLink).join("");
  });
})();
