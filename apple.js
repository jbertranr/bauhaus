// Versió minimalista: les mateixes dades de skills.js, amb una icona de Phosphor (pes light) per categoria.
const ICON = {
  "Documents":      "ph-file-text",
  "Disseny":        "ph-pen-nib",
  "Accessibilitat": "ph-person-arms-spread",
  "Codi":           "ph-code",
  "Dades":          "ph-chart-bar",
  "Recerca":        "ph-flask",
  "Automatització": "ph-gear-six",
};

// Un color de sistema d'Apple per categoria (els valors, per a clar i fosc, són a apple.css).
const COLOR = {
  "Documents":      "var(--c-blue)",
  "Disseny":        "var(--c-pink)",
  "Accessibilitat": "var(--c-indigo)",
  "Codi":           "var(--c-orange)",
  "Dades":          "var(--c-green)",
  "Recerca":        "var(--c-teal)",
  "Automatització": "var(--c-purple)",
};

const TIPUS = {
  integrada: "Integrada",
  plugin: "Plugin",
  github: "GitHub",
};

const state = { q: "", cat: "", type: "" };

const $index = document.getElementById("index");
const $empty = document.getElementById("empty");
const $count = document.getElementById("count");
const $cats = document.getElementById("cats");
const $types = document.getElementById("types");
const $q = document.getElementById("q");

function icon(name) {
  const i = document.createElement("i");
  i.className = `ph-light ${name}`;
  i.setAttribute("aria-hidden", "true");
  return i;
}

function catButton(label, value, iconName) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "cat";
  b.dataset.cat = value;
  b.setAttribute("aria-pressed", value === "" ? "true" : "false");
  if (value) b.style.setProperty("--c", COLOR[value]);
  b.append(icon(iconName), label);
  return b;
}

$cats.append(catButton("Totes", "", "ph-squares-four"));
for (const c of CATEGORIES) $cats.append(catButton(c, c, ICON[c]));

function press(group, attr, value) {
  for (const b of group.querySelectorAll("button")) b.setAttribute("aria-pressed", String(b.dataset[attr] === value));
}

// La categoria seleccionada viu a l'adreça (…#codi) perquè es pugui compartir.
function slug(c) {
  return c.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function catFromHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (!h) return "";
  return CATEGORIES.find(c => slug(c) === h); // undefined si el hash no és una categoria (p. ex. #main)
}
function writeHash(cat) {
  try {
    history.replaceState(null, "", cat ? `#${slug(cat)}` : location.pathname + location.search);
  } catch { /* alguns entorns incrustats no deixen canviar l'adreça */ }
}

function setCat(value) {
  state.cat = value;
  press($cats, "cat", value);
  writeHash(value);
  render();
}

$cats.addEventListener("click", e => {
  const b = e.target.closest(".cat");
  if (b) setCat(b.dataset.cat);
});

addEventListener("hashchange", () => {
  const c = catFromHash();
  if (c !== undefined) setCat(c);
});

$types.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  state.type = b.dataset.type;
  press($types, "type", state.type);
  render();
});

// Drecera de teclat: «/» porta a la cerca (fora dels camps de text).
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
  Object.assign(state, { q: "", type: "" });
  press($types, "type", "");
  setCat("");
  $q.focus();
});

document.getElementById("lede").textContent =
  `${SKILLS.length} skills que ensenyen a Claude a fer tasques concretes.`;

// Cerca sense accents ni majúscules: «automatitzacio» troba «Automatització».
function norm(t) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function matches(s) {
  if (state.cat && s.categoria !== state.cat) return false;
  if (state.type && s.tipus !== state.type) return false;
  if (!state.q) return true;
  const hay = norm([s.nom, s.descripcio, s.plugin, s.autor, s.categoria, TIPUS[s.tipus], ...s.on].join(" "));
  return hay.includes(state.q);
}

// "D'Anthropic", "De la comunitat", "De Shopify".
function de(autor) {
  if (autor === "Comunitat") return "De la comunitat";
  return /^[aeiouàèéíòóú]/i.test(autor) ? `D'${autor}` : `De ${autor}`;
}

// Autor i plugin en una frase; on funciona, només quan no és a tot arreu.
function meta(s) {
  const who = de(s.autor);
  let text = s.plugin ? `Del plugin ${s.plugin}, ${who[0].toLowerCase()}${who.slice(1)}.` : `${who}.`;
  if (s.on.length === 1) text += ` Només a ${s.on[0]}.`;
  return text;
}

function joinCa(items) {
  return items.length < 2 ? items.join("") : items.slice(0, -1).join(", ") + " i " + items.at(-1);
}

function code(text) {
  const c = document.createElement("code");
  c.textContent = text;
  return c;
}

// Com s'obté cada skill, segons el tipus. Només es dona l'ordre /nom quan és segur que funciona així.
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

function row(s) {
  const li = document.createElement("li");
  li.className = "row";
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.className = "row-inner";

  const main = document.createElement("div");
  main.className = "row-main";
  const top = document.createElement("div");
  top.className = "row-top";
  const name = document.createElement("strong");
  name.className = "row-name";
  name.textContent = s.nom;
  const type = document.createElement("span");
  type.className = "row-type";
  type.textContent = TIPUS[s.tipus];
  top.append(name, type);
  const d = document.createElement("span");
  d.className = "row-desc";
  d.textContent = s.descripcio;
  const m = document.createElement("span");
  m.className = "row-meta";
  m.textContent = meta(s);
  main.append(top, d, m);
  summary.append(main, icon("ph-caret-right"));

  const more = document.createElement("div");
  more.className = "row-more";
  more.append(howTo(s));
  const where = document.createElement("p");
  where.textContent = `Funciona a ${joinCa(s.on)}.`;
  more.append(where);
  if (s.url) {
    const a = Object.assign(document.createElement("a"), { href: s.url, target: "_blank", rel: "noopener" });
    a.append("Veure el repositori a GitHub");
    const note = document.createElement("span");
    note.className = "visually-hidden";
    note.textContent = " (s'obre en una pestanya nova)";
    a.append(note);
    const pa = document.createElement("p");
    pa.append(a);
    more.append(pa);
  }
  details.append(summary, more);
  li.append(details);
  return li;
}

function section(cat, list) {
  const sec = document.createElement("section");
  sec.className = "section";
  sec.style.setProperty("--c", COLOR[cat]);
  const head = document.createElement("header");
  head.className = "section-head";
  const h = document.createElement("h2");
  h.textContent = cat;
  const n = document.createElement("span");
  n.textContent = list.length === 1 ? "1 skill" : `${list.length} skills`;
  head.append(icon(ICON[cat]), h, n);
  const ul = document.createElement("ul");
  ul.className = "group";
  ul.append(...list.map(row));
  sec.append(head, ul);
  return sec;
}

function render() {
  const list = SKILLS.filter(matches);
  const groups = CATEGORIES
    .map(c => [c, list.filter(s => s.categoria === c)])
    .filter(([, l]) => l.length);
  $index.replaceChildren(...groups.map(([c, l]) => section(c, l)));
  $empty.hidden = list.length > 0;
  document.getElementById("empty-msg").textContent = state.q
    ? `Cap skill coincideix amb «${$q.value.trim()}».`
    : "Cap skill coincideix amb aquests filtres.";
  $count.textContent = list.length === SKILLS.length
    ? `${SKILLS.length} skills`
    : `${list.length} de ${SKILLS.length} skills`;
}

const initial = catFromHash();
if (initial) setCat(initial);
else render();
