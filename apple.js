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
  `${SKILLS.length} capacitats que pots afegir a Claude, agrupades per a què serveixen.`;

function matches(s) {
  if (state.cat && s.categoria !== state.cat) return false;
  if (state.type && s.tipus !== state.type) return false;
  if (!state.q) return true;
  const hay = [s.nom, s.descripcio, s.plugin, s.autor, s.categoria].join(" ").toLowerCase();
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

function row(s) {
  const li = document.createElement("li");
  li.className = "row";

  const inner = s.url
    ? Object.assign(document.createElement("a"), { href: s.url, target: "_blank", rel: "noopener" })
    : document.createElement("div");
  inner.className = "row-inner";

  const main = document.createElement("div");
  main.className = "row-main";

  const top = document.createElement("div");
  top.className = "row-top";
  const h = document.createElement("h3");
  h.textContent = s.nom;
  const type = document.createElement("span");
  type.className = "row-type";
  type.textContent = TIPUS[s.tipus];
  top.append(h, type);

  const d = document.createElement("p");
  d.className = "row-desc";
  d.textContent = s.descripcio;

  const m = document.createElement("p");
  m.className = "row-meta";
  m.textContent = meta(s);

  main.append(top, d, m);
  inner.append(main);
  if (s.url) {
    inner.setAttribute("aria-label", `${s.nom}, obre el repositori a GitHub`);
    inner.append(icon("ph-caret-right"));
  }
  li.append(inner);
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

render();
