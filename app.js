// Cada categoria té un color i una forma bauhaus.
const STYLE = {
  "Documents":      { color: "var(--blue)",   shape: "square" },
  "Disseny":        { color: "var(--red)",    shape: "circle" },
  "Accessibilitat": { color: "var(--yellow)", shape: "triangle" },
  "Codi":           { color: "var(--ink)",    shape: "square" },
  "Dades":          { color: "var(--blue)",   shape: "circle" },
  "Recerca":        { color: "var(--red)",    shape: "triangle" },
  "Automatització": { color: "var(--yellow)", shape: "circle" },
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

function chip(label, value) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip";
  b.dataset.cat = value;
  b.textContent = label;
  b.setAttribute("aria-pressed", value === "" ? "true" : "false");
  if (value) {
    b.style.setProperty("--dot", STYLE[value].color);
    b.classList.add(STYLE[value].shape);
  }
  return b;
}

$cats.append(chip("Totes", ""));
for (const c of CATEGORIES) $cats.append(chip(c, c));

function press(group, btn) {
  for (const b of group.querySelectorAll(".chip")) b.setAttribute("aria-pressed", String(b === btn));
}

$cats.addEventListener("click", e => {
  const b = e.target.closest(".chip");
  if (!b) return;
  state.cat = b.dataset.cat;
  press($cats, b);
  render();
});

$types.addEventListener("click", e => {
  const b = e.target.closest(".chip");
  if (!b) return;
  state.type = b.dataset.type;
  press($types, b);
  render();
});

document.getElementById("q").addEventListener("input", e => {
  state.q = e.target.value.trim().toLowerCase();
  render();
});

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

function origin(s) {
  if (s.plugin) return `${s.autor}, dins del plugin ${s.plugin}`;
  return s.autor;
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
  m.textContent = `De ${origin(s)}. Funciona a ${joinCa(s.on)}.`;
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
  $count.textContent = list.length === SKILLS.length
    ? `${SKILLS.length} skills en total`
    : `Se'n mostren ${list.length} de ${SKILLS.length}`;
}

render();
