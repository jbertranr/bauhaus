// Fanzine de skills: les mateixes dades de skills.js, impreses a dues tintes.

const ICON = {
  "Documents":      "ph-file-text",
  "Disseny":        "ph-pen-nib",
  "Accessibilitat": "ph-person-arms-spread",
  "Codi":           "ph-code",
  "Dades":          "ph-chart-bar",
  "Recerca":        "ph-flask",
  "Automatització": "ph-gear-six",
};

// Una frase per categoria: què hi trobaràs.
const ABOUT = {
  "Documents":      "Crear, llegir i editar els fitxers de la feina de cada dia: Word, Excel, PowerPoint i PDF.",
  "Disseny":        "Interfícies amb personalitat, sistemes de disseny i revisions perquè res no sembli fet en sèrie.",
  "Accessibilitat": "Que tothom pugui fer servir el que construeixes: contrast, teclat, lectors de pantalla.",
  "Codi":           "Revisar, simplificar i provar codi, i treballar amb l'API de Claude.",
  "Dades":          "Gràfics clars i lectura de dades com ho faria un analista.",
  "Recerca":        "Investigar a fons i convertir el que es troba en conclusions.",
  "Automatització": "Tasques que es repeteixen soles, configuració i skills noves.",
};

const TIPUS = {
  integrada: { label: "Ve amb Claude", icon: "ph-check-circle" },
  plugin:    { label: "Plugin",        icon: "ph-package" },
  github:    { label: "GitHub",        icon: "ph-github-logo" },
};

// ---------- Il·lustracions ----------
// Cada dibuix té dues planxes, com una risografia: la rosa (fons, en trama o ple)
// i la blava (línia). Les planxes se sobreimprimeixen amb mode multiplicar.

function gearPath(cx, cy, r, teeth, depth) {
  const pts = [];
  const step = Math.PI * 2 / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    for (const [da, rr] of [[0, r], [step * .18, r + depth], [step * .5, r + depth], [step * .68, r]]) {
      pts.push([cx + Math.cos(a + da) * rr, cy + Math.sin(a + da) * rr]);
    }
  }
  return "M" + pts.map(p => p.map(n => n.toFixed(1)).join(" ")).join("L") + "Z";
}

const ART = {
  "Documents": `
    <g class="rosa"><rect x="46" y="40" width="96" height="124" rx="6" transform="rotate(-9 94 102)"/></g>
    <g class="rosa trama"><rect x="70" y="58" width="96" height="124" rx="6"/></g>
    <g class="blau">
      <path d="M58 30h66l26 26v112a6 6 0 0 1-6 6H58a6 6 0 0 1-6-6V36a6 6 0 0 1 6-6z"/>
      <path d="M124 30v26h26"/>
      <path d="M70 84h60M70 104h60M70 124h42M70 144h52"/>
    </g>`,
  "Disseny": `
    <g class="rosa"><circle cx="128" cy="72" r="46"/></g>
    <g class="rosa trama"><circle cx="72" cy="140" r="34"/></g>
    <g class="blau" transform="rotate(24 100 104)">
      <path d="M100 26l38 70-24 74H86L62 96z"/>
      <path d="M100 26v58"/>
      <circle cx="100" cy="98" r="10"/>
      <path d="M86 170h28"/>
    </g>`,
  "Accessibilitat": `
    <g class="rosa"><circle cx="100" cy="104" r="72"/></g>
    <g class="rosa trama"><circle cx="118" cy="120" r="60"/></g>
    <g class="blau">
      <circle cx="100" cy="52" r="13" class="ple"/>
      <path d="M52 84h96"/>
      <path d="M100 84v44"/>
      <path d="M100 128l-26 42M100 128l26 42"/>
    </g>`,
  "Codi": `
    <g class="rosa"><rect x="34" y="52" width="136" height="100" rx="22" transform="rotate(5 102 102)"/></g>
    <g class="rosa trama"><rect x="130" y="112" width="26" height="46" rx="3"/></g>
    <g class="blau">
      <path d="M70 62l-36 40 36 40"/>
      <path d="M130 62l36 40-36 40"/>
      <path d="M112 50l-24 104"/>
    </g>`,
  "Dades": `
    <g class="rosa">
      <rect x="40" y="112" width="24" height="52" rx="3"/>
      <rect x="76" y="80" width="24" height="84" rx="3"/>
      <rect x="112" y="96" width="24" height="68" rx="3"/>
      <rect x="148" y="46" width="24" height="118" rx="3"/>
    </g>
    <g class="rosa trama"><path d="M30 164L52 100 88 70 124 86 160 40 176 40 176 164z"/></g>
    <g class="blau">
      <path d="M28 164h152"/>
      <path d="M52 100l36-30 36 16 36-46"/>
      <circle cx="52" cy="100" r="6" class="ple"/><circle cx="88" cy="70" r="6" class="ple"/>
      <circle cx="124" cy="86" r="6" class="ple"/><circle cx="160" cy="40" r="6" class="ple"/>
    </g>`,
  "Recerca": `
    <g class="rosa"><path d="M64 122h72l16 38a8 8 0 0 1-7 11H55a8 8 0 0 1-7-11z"/></g>
    <g class="rosa trama"><circle cx="144" cy="58" r="30"/></g>
    <g class="blau">
      <path d="M84 30h32M90 30v54l-40 80a8 8 0 0 0 7 11h86a8 8 0 0 0 7-11l-40-80V30"/>
      <circle cx="92" cy="146" r="6"/><circle cx="112" cy="134" r="4"/><circle cx="104" cy="156" r="3"/>
    </g>`,
  "Automatització": `
    <g class="rosa"><path d="${gearPath(78, 118, 40, 10, 12)}"/></g>
    <g class="rosa trama"><circle cx="136" cy="72" r="44"/></g>
    <g class="blau">
      <path d="${gearPath(136, 72, 30, 8, 10)}"/>
      <circle cx="136" cy="72" r="10"/>
      <circle cx="78" cy="118" r="14"/>
    </g>`,
};

function art(cat, cls) {
  return `<svg class="art ${cls || ""}" viewBox="0 0 200 200" aria-hidden="true" focusable="false">${ART[cat]}</svg>`;
}

// ---------- Estat i elements ----------
const state = { q: "", cat: "", type: "" };
const $index = document.getElementById("index");
const $empty = document.getElementById("empty");
const $count = document.getElementById("count");
const $cats = document.getElementById("cats");
const $types = document.getElementById("types");
const $stickers = document.getElementById("stickers");
const $q = document.getElementById("q");

function icon(name) {
  const i = document.createElement("i");
  i.className = `ph-duotone ${name}`;
  i.setAttribute("aria-hidden", "true");
  return i;
}

function plural(n) {
  return n === 1 ? "1 skill" : `${n} skills`;
}

const counts = Object.fromEntries(CATEGORIES.map(c => [c, SKILLS.filter(s => s.categoria === c).length]));

// Adhesius de la portada: un per categoria, amb la il·lustració. Tocar-lo filtra.
CATEGORIES.forEach((c, i) => {
  if (!counts[c]) return;
  const b = document.createElement("button");
  b.type = "button";
  b.className = "sticker";
  b.dataset.cat = c;
  b.style.setProperty("--tilt", `${[-4, 3, -2, 5, -5, 2, -3][i % 7]}deg`);
  b.setAttribute("aria-pressed", "false");
  b.setAttribute("aria-label", `${c}, ${plural(counts[c])}`);
  b.innerHTML = `${art(c)}<span class="sticker-label" aria-hidden="true">${c}<b>${counts[c]}</b></span>`;
  $stickers.append(b);
});

// Segells de categoria, sota la portada.
function stamp(label, value, iconName) {
  const b = document.createElement("button");
  b.type = "button";
  b.dataset.cat = value;
  b.setAttribute("aria-pressed", value === "" ? "true" : "false");
  if (iconName) b.append(icon(iconName));
  b.append(label);
  return b;
}
$cats.append(stamp("Totes", "", "ph-squares-four"));
for (const c of CATEGORIES) if (counts[c]) $cats.append(stamp(c, c, ICON[c]));

// ---------- Adreça compartible (…#disseny) ----------
function norm(t) {
  return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
function catFromHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (!h) return "";
  return CATEGORIES.find(c => norm(c) === h); // undefined si no és una categoria (p. ex. #cataleg)
}
function writeHash(cat) {
  try {
    history.replaceState(null, "", cat ? `#${norm(cat)}` : location.pathname + location.search);
  } catch { /* alguns entorns incrustats no deixen canviar l'adreça */ }
}

function setCat(value) {
  state.cat = value;
  writeHash(value);
  for (const b of $cats.querySelectorAll("button")) b.setAttribute("aria-pressed", String(b.dataset.cat === value));
  for (const b of $stickers.querySelectorAll(".sticker")) b.setAttribute("aria-pressed", String(b.dataset.cat === value));
  $stickers.classList.toggle("filtered", value !== "");
  render();
}

$cats.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (b) setCat(b.dataset.cat);
});

$stickers.addEventListener("click", e => {
  const b = e.target.closest(".sticker");
  if (!b) return;
  setCat(state.cat === b.dataset.cat ? "" : b.dataset.cat);
  document.getElementById("cataleg").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});

$types.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  state.type = b.dataset.type;
  for (const x of $types.querySelectorAll("button")) x.setAttribute("aria-pressed", String(x === b));
  render();
});

addEventListener("hashchange", () => {
  const c = catFromHash();
  if (c !== undefined) setCat(c);
});

// «/» porta a la cerca, fora dels camps de text.
addEventListener("keydown", e => {
  if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.closest("input, textarea, [contenteditable]")) return;
  e.preventDefault();
  $q.focus();
});

$q.addEventListener("input", () => {
  state.q = norm($q.value.trim());
  render();
});

document.getElementById("reset").addEventListener("click", () => {
  $q.value = "";
  state.q = "";
  state.type = "";
  for (const x of $types.querySelectorAll("button")) x.setAttribute("aria-pressed", String(x.dataset.type === ""));
  setCat("");
  $q.focus();
});

// ---------- Catàleg ----------
function matches(s) {
  if (state.cat && s.categoria !== state.cat) return false;
  if (state.type && s.tipus !== state.type) return false;
  if (!state.q) return true;
  return norm([s.nom, s.descripcio, s.plugin, s.autor, s.categoria, TIPUS[s.tipus].label, ...s.on].join(" ")).includes(state.q);
}

function joinCa(items) {
  return items.length < 2 ? items.join("") : items.slice(0, -1).join(", ") + " i " + items.at(-1);
}

// "D'Anthropic", "De la comunitat", "De Shopify".
function de(autor) {
  if (autor === "Comunitat") return "De la comunitat";
  return /^[aeiouàèéíòóú]/i.test(autor) ? `D'${autor}` : `De ${autor}`;
}

function byline(s) {
  const who = de(s.autor);
  let text = s.plugin ? `Del plugin ${s.plugin}, ${who[0].toLowerCase()}${who.slice(1)}.` : `${who}.`;
  if (s.on.length === 1) text += ` Només a ${s.on[0]}.`;
  return text;
}

function code(text) {
  const c = document.createElement("code");
  c.textContent = text;
  return c;
}

// Com s'obté, segons el tipus. L'ordre /nom només es dona quan és segur que funciona així.
function howTo(s) {
  const p = document.createElement("p");
  if (s.tipus === "integrada") {
    p.append("Ja ve amb Claude: no cal instal·lar-la. Claude la fa servir sola quan la tasca ho demana.");
    if (s.on.length === 1 && s.on[0] === "Claude Code") p.append(" També la pots cridar escrivint ", code(`/${s.nom}`), ".");
  } else if (s.tipus === "plugin") {
    p.append(`S'obté instal·lant el plugin «${s.plugin || s.nom}» des del directori de plugins de claude.ai o, a Claude Code, amb l'ordre `, code("/plugin"), ".");
  } else {
    p.append("Copia la seva carpeta a ", code(".claude/skills/"), " del teu projecte i Claude Code la carregarà sola. Després la pots cridar escrivint ", code(`/${s.nom}`), ".");
  }
  return p;
}

function entry(s) {
  const li = document.createElement("li");
  li.className = "entry";
  const details = document.createElement("details");
  const summary = document.createElement("summary");

  const head = document.createElement("span");
  head.className = "entry-head";
  const name = document.createElement("strong");
  name.className = "entry-name";
  name.textContent = s.nom;
  const kind = document.createElement("span");
  kind.className = `kind kind-${s.tipus}`;
  kind.append(icon(TIPUS[s.tipus].icon), TIPUS[s.tipus].label);
  head.append(name, kind);

  const desc = document.createElement("span");
  desc.className = "entry-desc";
  desc.textContent = s.descripcio;
  const by = document.createElement("span");
  by.className = "entry-by";
  by.textContent = byline(s);
  const more = document.createElement("span");
  more.className = "entry-toggle";
  more.append(icon("ph-caret-down"), "Com s'obté");
  summary.append(head, desc, by, more);

  const body = document.createElement("div");
  body.className = "entry-how";
  body.append(howTo(s));
  const where = document.createElement("p");
  where.textContent = `Funciona a ${joinCa(s.on)}.`;
  body.append(where);
  if (s.url) {
    const a = Object.assign(document.createElement("a"), { href: s.url, target: "_blank", rel: "noopener" });
    a.append(icon("ph-arrow-up-right"), "Veure el repositori a GitHub");
    const note = document.createElement("span");
    note.className = "visually-hidden";
    note.textContent = " (s'obre en una pestanya nova)";
    a.append(note);
    const p = document.createElement("p");
    p.append(a);
    body.append(p);
  }
  details.append(summary, body);
  li.append(details);
  return li;
}

function spread(cat, list) {
  const sec = document.createElement("section");
  sec.className = "spread";
  const plate = document.createElement("div");
  plate.className = "plate";
  plate.innerHTML = art(cat, "art-plate");
  const h2 = document.createElement("h2");
  h2.textContent = cat;
  const n = document.createElement("p");
  n.className = "plate-count";
  n.textContent = plural(list.length);
  const about = document.createElement("p");
  about.className = "plate-about";
  about.textContent = ABOUT[cat];
  plate.append(h2, n, about);
  const ul = document.createElement("ul");
  ul.className = "entries";
  ul.append(...list.map(entry));
  sec.append(plate, ul);
  return sec;
}

function render() {
  const list = SKILLS.filter(matches);
  const groups = CATEGORIES.map(c => [c, list.filter(s => s.categoria === c)]).filter(([, l]) => l.length);
  $index.replaceChildren(...groups.map(([c, l]) => spread(c, l)));
  $empty.hidden = list.length > 0;
  document.getElementById("empty-msg").textContent = state.q
    ? `Cap skill coincideix amb «${$q.value.trim()}». Prova una altra paraula o treu els filtres.`
    : "Cap skill coincideix amb aquests filtres.";
  $count.textContent = list.length === SKILLS.length ? `${plural(SKILLS.length)} en aquest número` : `Se'n mostren ${list.length} de ${SKILLS.length}`;
}

const initial = catFromHash();
if (initial) setCat(initial);
else render();
