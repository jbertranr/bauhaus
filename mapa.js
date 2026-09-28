// Mapa de skills: el mapa de metro navega i la consola busca i explica. Dades de skills.js.

const LINE = {
  "Documents":      { v: "--l-docs",   icon: "ph-file-text" },
  "Disseny":        { v: "--l-disseny", icon: "ph-pen-nib" },
  "Accessibilitat": { v: "--l-acc",    icon: "ph-person-arms-spread" },
  "Codi":           { v: "--l-codi",   icon: "ph-code" },
  "Dades":          { v: "--l-dades",  icon: "ph-chart-bar" },
  "Recerca":        { v: "--l-recerca", icon: "ph-flask" },
  "Automatització": { v: "--l-auto",   icon: "ph-gear-six" },
};

// Colors fixos per a les portades (imatges): no canvien amb el tema.
const COVER = {
  "Documents":      ["#1f4fd1", "#ffd84d", "#e8eeff"],
  "Disseny":        ["#e0442f", "#ffc2b8", "#fff0ec"],
  "Accessibilitat": ["#16875a", "#b8f0d4", "#e8faf1"],
  "Codi":           ["#2f3550", "#8fd8ff", "#eaf2f8"],
  "Dades":          ["#e57a00", "#ffe0b3", "#fff5e6"],
  "Recerca":        ["#0d7384", "#bdeef2", "#e8f8fa"],
  "Automatització": ["#b8215a", "#ffc9dd", "#fdeef4"],
};

const TIPUS = { integrada: "Ve amb Claude", plugin: "Plugin", github: "GitHub" };

// Traçat de cada línia (viewBox 1240 × 720). Les parades van sobre l'últim tram;
// «up» diu si els rètols van per sobre o per sota de la línia.
const HUB = [600, 350];
const ROUTE = {
  "Codi":           { pts: [HUB, [600, 210], [660, 150], [1140, 150]], up: true },
  "Disseny":        { pts: [HUB, [680, 350], [730, 300], [1190, 300]], up: true },
  "Recerca":        { pts: [HUB, [540, 290], [540, 150], [250, 150]], up: true },
  "Documents":      { pts: [HUB, [480, 350], [430, 300], [70, 300]], up: true },
  "Accessibilitat": { pts: [HUB, [520, 430], [110, 430]], up: false },
  "Dades":          { pts: [HUB, [690, 440], [980, 440]], up: false },
  "Automatització": { pts: [HUB, [600, 560], [650, 610], [1080, 610]], up: false },
};

const state = { q: "", cat: "", type: "", sel: null, active: 0 };
const $map = document.getElementById("map");
const $lines = document.getElementById("lines");
const $results = document.getElementById("results");
const $preview = document.getElementById("preview");
const $count = document.getElementById("count");
const $empty = document.getElementById("empty");
const $types = document.getElementById("types");
const $q = document.getElementById("q");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

function norm(t) { return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
function esc(t) { return t.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]); }
function joinCa(items) { return items.length < 2 ? items.join("") : items.slice(0, -1).join(", ") + " i " + items.at(-1); }
function plural(n) { return n === 1 ? "1 skill" : `${n} skills`; }
function de(autor) {
  if (autor === "Comunitat") return "De la comunitat";
  return /^[aeiouàèéíòóú]/i.test(autor) ? `D'${autor}` : `De ${autor}`;
}
function byline(s) {
  const who = de(s.autor);
  return s.plugin ? `Del plugin ${s.plugin}, ${who[0].toLowerCase()}${who.slice(1)}.` : `${who}.`;
}
// L'ordre /nom només quan és segur que funciona així.
function command(s) {
  if (s.tipus === "github") return `/${s.nom}`;
  if (s.tipus === "integrada" && s.on.length === 1 && s.on[0] === "Claude Code") return `/${s.nom}`;
  return null;
}

// ---------- Portada generativa: la mateixa skill sempre té la mateixa imatge ----------
function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function cover(s) {
  const [a, b, bg] = COVER[s.categoria], h = hash(s.nom), k = h % 5, r = n => ((h >> n) & 255) / 255;
  let g = "";
  if (k === 0) { const cx = 60 + r(3) * 280, cy = 20 + r(7) * 120; for (let i = 9; i > 0; i--) g += `<circle cx="${cx}" cy="${cy}" r="${i * 30}" fill="${i % 2 ? a : b}"/>`; }
  if (k === 1) { const w = 16 + r(4) * 14; for (let x = -300; x < 700; x += w * 2) g += `<rect x="${x}" y="-200" width="${w}" height="600" fill="${a}" transform="rotate(${30 + r(9) * 30} 200 80)"/>`; g += `<circle cx="${80 + r(2) * 240}" cy="${40 + r(6) * 80}" r="${40 + r(11) * 24}" fill="${b}"/>`; }
  if (k === 2) { for (let y = 12; y < 160; y += 22) for (let x = 12; x < 400; x += 22) g += `<circle cx="${x}" cy="${y}" r="${2 + ((x * y + h) % 8)}" fill="${a}"/>`; }
  if (k === 3) { g += `<rect width="400" height="160" fill="${b}"/><text x="${20 + r(5) * 160}" y="${190 + r(8) * 30}" font-family="Atkinson Hyperlegible, sans-serif" font-weight="700" font-size="260" fill="${a}">${esc(s.nom[0].toUpperCase())}</text>`; }
  if (k === 4) { for (let i = 0; i < 6; i++) g += `<path d="M${-40 + r(3) * 40} ${170 - i * 30} a${240 - i * 8} 120 0 0 1 480 0" fill="${i % 2 ? b : a}"/>`; }
  return `<svg class="cover" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style="background:${bg}">${g}</svg>`;
}

// ---------- Mapa ----------
const len = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
const stations = {}; // nom -> [x, y]

function drawMap() {
  let lines = "", stops = "";
  for (const cat of CATEGORIES) {
    const route = ROUTE[cat];
    const list = SKILLS.filter(s => s.categoria === cat);
    if (!route || !list.length) continue;
    const pts = route.pts;
    lines += `<polyline class="line" data-cat="${cat}" style="--c: var(${LINE[cat].v})" points="${pts.map(p => p.join(",")).join(" ")}"/>`;
    // Parades repartides sobre l'últim tram, amb marge als extrems.
    const [a, b] = pts.slice(-2), L = len(a, b), m = 28;
    list.forEach((s, i) => {
      const t = (m + (i + .5) * (L - 2 * m) / list.length) / L;
      const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
      stations[s.nom] = [x, y];
      const ang = route.up ? -40 : 40, ly = route.up ? y - 14 : y + 18;
      stops += `<g class="stop" data-nom="${esc(s.nom)}" data-cat="${cat}" style="--c: var(${LINE[cat].v})" tabindex="0" role="button" aria-label="${esc(s.nom)}, línia ${cat}">
        <circle class="hit" cx="${x}" cy="${y}" r="16"/>
        <circle class="dot" cx="${x}" cy="${y}" r="7"/>
        <text x="${x + 4}" y="${ly}" transform="rotate(${ang} ${x + 4} ${ly})">${esc(s.nom)}</text>
      </g>`;
    });
  }
  const hub = `<g class="hub" aria-hidden="true"><circle cx="${HUB[0]}" cy="${HUB[1]}" r="38"/><text x="${HUB[0]}" y="${HUB[1] + 6}">Claude</text></g>`;
  $map.innerHTML = `<g class="lines-layer">${lines}</g>${hub}<g class="stops">${stops}</g>`;
}

function openFromMap(nom) {
  const s = SKILLS.find(x => x.nom === nom);
  if (!s) return;
  if (state.cat && state.cat !== s.categoria) state.cat = "";
  select(s, true);
  syncLines();
  renderList();
  if (matchMedia("(max-width: 860px)").matches) $preview.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

$map.addEventListener("click", e => {
  const g = e.target.closest(".stop");
  if (g) openFromMap(g.dataset.nom);
});
$map.addEventListener("keydown", e => {
  const g = e.target.closest(".stop");
  if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openFromMap(g.dataset.nom); }
});

// ---------- Llegenda de línies (filtra) ----------
function drawLines() {
  $lines.innerHTML = CATEGORIES.filter(c => ROUTE[c]).map(c =>
    `<button type="button" data-cat="${c}" aria-pressed="false" style="--c: var(${LINE[c].v})"><i class="swatch" aria-hidden="true"></i>${c}<span class="n">${plural(SKILLS.filter(s => s.categoria === c).length)}</span></button>`
  ).join("");
}
$lines.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  state.cat = state.cat === b.dataset.cat ? "" : b.dataset.cat;
  state.active = 0;
  state.sel = null;
  syncLines();
  renderList();
  writeHash();
});
function syncLines() {
  for (const b of $lines.querySelectorAll("button")) b.setAttribute("aria-pressed", String(b.dataset.cat === state.cat));
  $map.classList.toggle("filtered", !!state.cat);
  for (const el of $map.querySelectorAll("[data-cat]")) el.classList.toggle("on", el.dataset.cat === state.cat);
}

// ---------- Consola ----------
// Cerca per arrels: «revisar disseny» troba «revisa», «revisió» i «disseny». Com més paraules
// coincideixen, més amunt surt la skill. Les paraules de menys de 3 lletres no compten.
function score(s) {
  if (state.cat && s.categoria !== state.cat) return 0;
  if (state.type && s.tipus !== state.type) return 0;
  if (!state.q) return 1;
  const hay = norm([s.nom, s.descripcio, s.plugin, s.autor, s.categoria, TIPUS[s.tipus], ...s.on].join(" "));
  const words = state.q.split(/\s+/).filter(w => w.length >= 3);
  if (!words.length) return hay.includes(state.q) ? 1 : 0;
  let n = 0;
  for (const w of words) {
    const stem = w.length > 5 ? w.slice(0, Math.max(4, w.length - 2)) : w;
    if (hay.includes(stem)) n += norm(s.nom).includes(stem) ? 2 : 1;
  }
  return n;
}

let current = [];
function renderList() {
  current = SKILLS.map(s => [s, score(s)]).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).map(([s]) => s);
  // La fila marcada amb el teclat és sempre la skill que es veu al detall.
  if (state.sel && current.includes(state.sel)) state.active = current.indexOf(state.sel);
  $results.innerHTML = current.map((s, i) =>
    `<li id="opt-${i}" role="option" aria-selected="${state.sel === s}" class="${i === state.active ? "active" : ""}" data-i="${i}" style="--c: var(${LINE[s.categoria].v})">
      <span class="ic" aria-hidden="true"><i class="ph-light ${LINE[s.categoria].icon}"></i></span>
      <span class="txt"><b>${esc(s.nom)}</b><small>${esc(s.descripcio)}</small></span>
      <span class="kind">${TIPUS[s.tipus]}</span>
    </li>`
  ).join("");
  $q.setAttribute("aria-activedescendant", current.length ? `opt-${Math.min(state.active, current.length - 1)}` : "");
  $empty.hidden = current.length > 0;
  document.getElementById("empty-msg").textContent = state.q
    ? `Cap skill coincideix amb «${$q.value.trim()}». Prova una altra paraula o treu els filtres.`
    : "Cap skill coincideix amb aquests filtres.";
  $count.textContent = current.length === SKILLS.length ? `${plural(SKILLS.length)} al mapa` : `Se'n mostren ${current.length} de ${SKILLS.length}`;
  if (!state.sel || !current.includes(state.sel)) select(current[0] || null, false);
}

function steps(s) {
  const cmd = command(s);
  if (s.tipus === "integrada") {
    const li = ["Ja ve amb Claude: no cal instal·lar res.", "Demana-li la tasca i Claude la fa servir sola."];
    if (cmd) li.push(`A Claude Code, també la pots cridar escrivint <code>${esc(cmd)}</code>.`);
    return li;
  }
  if (s.tipus === "plugin") return [
    "Obre el directori de plugins de claude.ai o escriu <code>/plugin</code> a Claude Code.",
    `Instal·la el plugin «${esc(s.plugin || s.nom)}».`,
    "Obre una conversa nova: Claude ja la tindrà.",
  ];
  return [
    "Copia la seva carpeta a <code>.claude/skills/</code> del teu projecte.",
    "Obre una conversa nova a Claude Code.",
    `Escriu <code>${esc(cmd)}</code>.`,
  ];
}

function select(s, fromMap) {
  state.sel = s;
  for (const g of $map.querySelectorAll(".stop")) g.classList.toggle("sel", !!s && g.dataset.nom === s.nom);
  for (const li of $results.querySelectorAll("li")) li.setAttribute("aria-selected", String(!!s && current[li.dataset.i] === s));
  if (!s) { $preview.innerHTML = ""; return; }
  const cmd = command(s);
  $preview.style.setProperty("--c", `var(${LINE[s.categoria].v})`);
  $preview.innerHTML = `
    ${cover(s)}
    <p class="line-tag"><i class="swatch" aria-hidden="true"></i>Línia ${s.categoria}</p>
    <h3>${esc(s.nom)}</h3>
    <p class="desc">${esc(s.descripcio)}</p>
    <p class="by">${esc(byline(s))} Funciona a ${esc(joinCa(s.on))}.</p>
    <h4>Com s'obté</h4>
    <ol>${steps(s).map(x => `<li>${x}</li>`).join("")}</ol>
    <div class="actions">
      ${cmd ? `<button type="button" class="copy" data-cmd="${esc(cmd)}"><i class="ph-light ph-copy" aria-hidden="true"></i>Copia <code>${esc(cmd)}</code></button>` : ""}
      ${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener"><i class="ph-light ph-arrow-up-right" aria-hidden="true"></i>Repositori a GitHub<span class="visually-hidden"> (s'obre en una pestanya nova)</span></a>` : ""}
      <span class="copied" role="status"></span>
    </div>`;
  if (fromMap) writeHash();
}

$preview.addEventListener("click", async e => {
  const b = e.target.closest(".copy");
  if (!b) return;
  const status = $preview.querySelector(".copied");
  try { await navigator.clipboard.writeText(b.dataset.cmd); status.textContent = "Copiada"; }
  catch { status.textContent = "No s'ha pogut copiar: selecciona-la i copia-la a mà."; }
  setTimeout(() => { status.textContent = ""; }, 2500);
});

$results.addEventListener("click", e => {
  const li = e.target.closest("li");
  if (!li) return;
  state.active = +li.dataset.i;
  select(current[state.active], true);
  renderList();
  pulse(current[state.active]);
});

// Quan tries a la consola, la parada del mapa s'il·lumina un moment.
function pulse(s) {
  const g = s && $map.querySelector(`.stop[data-nom="${CSS.escape(s.nom)}"]`);
  if (!g || reduced) return;
  g.classList.remove("pulse"); void g.getBBox(); g.classList.add("pulse");
}

$q.addEventListener("input", () => { state.q = norm($q.value.trim()); state.active = 0; state.sel = null; renderList(); });
$q.addEventListener("keydown", e => {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    if (!current.length) return;
    state.active = (state.active + (e.key === "ArrowDown" ? 1 : -1) + current.length) % current.length;
    select(current[state.active], false);
    renderList();
    document.getElementById(`opt-${state.active}`)?.scrollIntoView({ block: "nearest" });
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (current[state.active]) { select(current[state.active], true); pulse(current[state.active]); document.querySelector(".map-wrap").scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); }
  } else if (e.key === "Escape") {
    $q.value = ""; state.q = ""; state.active = 0; state.sel = null; renderList();
  }
});

$types.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  state.type = b.dataset.type; state.active = 0; state.sel = null;
  for (const x of $types.querySelectorAll("button")) x.setAttribute("aria-pressed", String(x === b));
  renderList();
});

document.getElementById("reset").addEventListener("click", () => {
  $q.value = ""; Object.assign(state, { q: "", cat: "", type: "", active: 0 });
  for (const x of $types.querySelectorAll("button")) x.setAttribute("aria-pressed", String(x.dataset.type === ""));
  syncLines(); renderList(); writeHash(); $q.focus();
});

addEventListener("keydown", e => {
  if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.closest("input, textarea, [contenteditable]")) return;
  e.preventDefault();
  $q.focus();
});

// ---------- Adreça compartible: #avoid-ai-design obre la skill; #disseny, la línia ----------
function writeHash() {
  const h = state.sel ? state.sel.nom : state.cat ? norm(state.cat) : "";
  try { history.replaceState(null, "", h ? `#${h}` : location.pathname + location.search); } catch { /* entorn incrustat */ }
}
function readHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  const s = SKILLS.find(x => x.nom === h);
  if (s) { select(s, false); return; }
  const c = CATEGORIES.find(x => norm(x) === h);
  if (c) { state.cat = c; syncLines(); }
}

addEventListener("hashchange", () => { readHash(); renderList(); });

drawMap();
drawLines();
renderList();
readHash();
renderList();
