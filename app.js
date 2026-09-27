// Cada categoria té un color i una forma bauhaus.
// El text sobre cada color quan el filtre està seleccionat.
const ON = {
  "var(--blue)": "var(--on-accent)",
  "var(--red)": "var(--on-accent)",
  "var(--yellow)": "#000",
  "var(--ink)": "var(--paper)",
};

const STYLE = {
  "Documents":      { color: "var(--blue)",   shape: "square" },
  "Disseny":        { color: "var(--red)",    shape: "circle" },
  "Accessibilitat": { color: "var(--yellow)", shape: "triangle" },
  "Codi":           { color: "var(--ink)",    shape: "square" },
  "Dades":          { color: "var(--blue)",   shape: "circle" },
  "Recerca":        { color: "var(--red)",    shape: "triangle" },
  "Automatització": { color: "var(--yellow)", shape: "circle" },
};

// On va cada forma a la composició de la capçalera, en px d'una caixa de 640 × 480.
// La mida surt de les dades; la posició està triada a mà perquè la composició quedi equilibrada.
// Una categoria nova necessita el seu lloc aquí.
const SLOTS = {
  "Disseny":        { x: 290, y: 10,  label: "right" },
  "Codi":           { x: 130, y: 160, label: "above" },
  "Documents":      { x: 0,   y: 310, label: "below" },
  "Accessibilitat": { x: 330, y: 262, label: "below" },
  "Automatització": { x: 480, y: 236, label: "below" },
  "Recerca":        { x: 170, y: 340, label: "below" },
  "Dades":          { x: 30,  y: 126, label: "above" },
};
const BOX = { w: 640, h: 480 };
const UNIT = 58; // costat en px d'una categoria amb 1 skill; l'àrea creix amb el nombre de skills

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
const $comp = document.getElementById("composition");
const $q = document.getElementById("q");

function chip(label, value) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip";
  b.dataset.cat = value;
  b.textContent = label;
  b.setAttribute("aria-pressed", value === "" ? "true" : "false");
  if (value) {
    b.style.setProperty("--dot", STYLE[value].color);
    b.style.setProperty("--fill", STYLE[value].color);
    b.style.setProperty("--on-fill", ON[STYLE[value].color]);
    b.classList.add(STYLE[value].shape);
  }
  return b;
}

$cats.append(chip("Totes", ""));
for (const c of CATEGORIES) $cats.append(chip(c, c));

for (const c of CATEGORIES) {
  const n = SKILLS.filter(s => s.categoria === c).length;
  const slot = SLOTS[c];
  if (!n || !slot) continue;
  const st = STYLE[c];
  const side = Math.sqrt(n) * UNIT;
  const w = st.shape === "triangle" ? side * 1.15 : side;
  const b = document.createElement("button");
  b.type = "button";
  b.className = `cat-shape ${st.shape}`;
  b.dataset.cat = c;
  b.dataset.label = slot.label;
  b.setAttribute("aria-pressed", "false");
  b.style.setProperty("--c", st.color);
  b.style.left = `${slot.x / BOX.w * 100}%`;
  b.style.top = `${slot.y / BOX.h * 100}%`;
  b.style.width = `${w / BOX.w * 100}%`;
  b.style.height = `${side / BOX.h * 100}%`;
  b.innerHTML = `<span class="f" aria-hidden="true"></span><span class="cat-label"><b>${n}</b><span class="name">${c}</span></span>`;
  $comp.append(b);
}

function press(group, btn) {
  for (const b of group.querySelectorAll(".chip")) b.setAttribute("aria-pressed", String(b === btn));
}

// La barra de blocs i les formes de la capçalera filtren igual i es mantenen sincronitzades.
function setCat(value) {
  state.cat = value;
  for (const b of $cats.querySelectorAll(".chip")) b.setAttribute("aria-pressed", String(b.dataset.cat === value));
  for (const b of $comp.querySelectorAll(".cat-shape")) b.setAttribute("aria-pressed", String(b.dataset.cat === value));
  $comp.classList.toggle("filtered", value !== "");
  render();
}

$cats.addEventListener("click", e => {
  const b = e.target.closest(".chip");
  if (b) setCat(b.dataset.cat);
});

$comp.addEventListener("click", e => {
  const b = e.target.closest(".cat-shape");
  if (!b) return;
  // Tornar a clicar la forma seleccionada treu el filtre.
  setCat(state.cat === b.dataset.cat ? "" : b.dataset.cat);
});

$types.addEventListener("click", e => {
  const b = e.target.closest(".chip");
  if (!b) return;
  state.type = b.dataset.type;
  press($types, b);
  render();
});

$q.addEventListener("input", e => {
  state.q = e.target.value.trim().toLowerCase();
  render();
});

document.getElementById("reset").addEventListener("click", () => {
  $q.value = "";
  state.q = "";
  state.type = "";
  press($types, $types.querySelector('[data-type=""]'));
  setCat("");
  $q.focus();
});

document.getElementById("lede").textContent =
  `${SKILLS.length} capacitats que pots afegir a Claude, agrupades per a què serveixen.`;

function matches(s) {
  if (state.cat && s.categoria !== state.cat) return false;
  if (state.type && s.tipus !== state.type) return false;
  if (!state.q) return true;
  const hay = [s.nom, s.descripcio, s.plugin, s.autor, s.categoria].join(" ").toLowerCase();
  return hay.includes(state.q);
}

// "claude.ai i Claude Code", no "claude.ai · Claude Code".
function joinCa(items) {
  return items.length < 2 ? items.join("") : items.slice(0, -1).join(", ") + " i " + items.at(-1);
}

// "D'Anthropic", "de la comunitat", "de Shopify".
function de(autor) {
  if (autor === "Comunitat") return "de la comunitat";
  return /^[aeiouàèéíòóú]/i.test(autor) ? `d'${autor}` : `de ${autor}`;
}

function origin(s) {
  const who = de(s.autor);
  const text = s.plugin ? `${who}, dins del plugin ${s.plugin}` : who;
  return text[0].toUpperCase() + text.slice(1);
}

function entry(s) {
  const li = document.createElement("li");
  li.className = "entry";
  const name = s.url
    ? Object.assign(document.createElement("a"), { href: s.url, target: "_blank", rel: "noopener" })
    : document.createElement("span");
  name.textContent = s.nom;
  const h = document.createElement("h3");
  h.append(name);
  const tag = document.createElement("span");
  tag.className = `tag ${s.tipus}`;
  tag.textContent = TIPUS[s.tipus];
  h.append(" ", tag);
  const d = document.createElement("p");
  d.className = "desc";
  d.textContent = s.descripcio;
  const m = document.createElement("p");
  m.className = "meta";
  m.textContent = `${origin(s)}. Funciona a ${joinCa(s.on)}.`;
  li.append(h, d, m);
  return li;
}

function group(cat, list) {
  const st = STYLE[cat];
  const sec = document.createElement("section");
  sec.className = "group";
  sec.style.setProperty("--accent", st.color);
  const head = document.createElement("header");
  head.className = "group-head";
  head.innerHTML = `<span class="mark ${st.shape}" aria-hidden="true"></span>`;
  const h = document.createElement("h2");
  h.textContent = cat;
  const n = document.createElement("span");
  n.className = "group-count";
  n.textContent = list.length === 1 ? "1 skill" : `${list.length} skills`;
  head.append(h, n);
  const ul = document.createElement("ul");
  ul.className = "entries";
  ul.append(...list.map(entry));
  sec.append(head, ul);
  return sec;
}

function render() {
  const list = SKILLS.filter(matches);
  const groups = CATEGORIES
    .map(c => [c, list.filter(s => s.categoria === c)])
    .filter(([, l]) => l.length);
  $index.replaceChildren(...groups.map(([c, l]) => group(c, l)));
  $empty.hidden = list.length > 0;
  document.getElementById("empty-msg").textContent = state.q
    ? `Cap skill coincideix amb «${$q.value.trim()}».`
    : "Cap skill coincideix amb aquests filtres.";
  $count.textContent = list.length === SKILLS.length
    ? `${SKILLS.length} skills en total`
    : `Se'n mostren ${list.length} de ${SKILLS.length}`;
}

render();
