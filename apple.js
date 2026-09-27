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
  b.append(icon(iconName), label);
  return b;
}

$cats.append(catButton("Totes", "", "ph-squares-four"));
for (const c of CATEGORIES) $cats.append(catButton(c, c, ICON[c]));

function press(group, attr, value) {
  for (const b of group.querySelectorAll("button")) b.setAttribute("aria-pressed", String(b.dataset[attr] === value));
}

$cats.addEventListener("click", e => {
  const b = e.target.closest(".cat");
  if (!b) return;
  state.cat = b.dataset.cat;
  press($cats, "cat", state.cat);
  render();
});

$types.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  state.type = b.dataset.type;
  press($types, "type", state.type);
  render();
});

$q.addEventListener("input", () => {
  state.q = $q.value.trim().toLowerCase();
  render();
});

document.getElementById("reset").addEventListener("click", () => {
  $q.value = "";
  Object.assign(state, { q: "", cat: "", type: "" });
  press($cats, "cat", "");
  press($types, "type", "");
  render();
  $q.focus();
});

document.getElementById("lede").textContent =
  `${SKILLS.length} capacitats que pots afegir a Claude, ordenades per a què serveixen.`;

function matches(s) {
  if (state.cat && s.categoria !== state.cat) return false;
  if (state.type && s.tipus !== state.type) return false;
  if (!state.q) return true;
  const hay = [s.nom, s.descripcio, s.plugin, s.autor, s.categoria].join(" ").toLowerCase();
  return hay.includes(state.q);
}

function joinCa(items) {
  return items.length < 2 ? items.join("") : items.slice(0, -1).join(", ") + " i " + items.at(-1);
}

// "D'Anthropic", "De la comunitat", "De Shopify".
function de(autor) {
  if (autor === "Comunitat") return "De la comunitat";
  return /^[aeiouàèéíòóú]/i.test(autor) ? `D'${autor}` : `De ${autor}`;
}

function tile(s) {
  const li = document.createElement("li");
  li.className = "tile";

  const type = document.createElement("p");
  type.className = "tile-type";
  type.textContent = s.plugin ? `${TIPUS[s.tipus]} ${s.plugin}` : TIPUS[s.tipus];

  const h = document.createElement("h3");
  h.textContent = s.nom;

  const d = document.createElement("p");
  d.className = "tile-desc";
  d.textContent = s.descripcio;

  const m = document.createElement("p");
  m.className = "tile-meta";
  m.textContent = `${de(s.autor)}. Funciona a ${joinCa(s.on)}.`;

  li.append(type, h, d, m);

  if (s.url) {
    const a = document.createElement("a");
    a.className = "tile-link";
    a.href = s.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.append("Veure-la a GitHub", icon("ph-caret-right"));
    li.append(a);
  }
  return li;
}

function section(cat, list) {
  const sec = document.createElement("section");
  sec.className = "section";
  const head = document.createElement("header");
  head.className = "section-head";
  const h = document.createElement("h2");
  h.textContent = cat;
  const n = document.createElement("span");
  n.textContent = list.length === 1 ? "1 skill" : `${list.length} skills`;
  head.append(icon(ICON[cat]), h, n);
  const ul = document.createElement("ul");
  ul.className = "tiles";
  ul.append(...list.map(tile));
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

render();
