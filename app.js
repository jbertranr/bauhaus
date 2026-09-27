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

const state = { q: "", cat: "", type: "" };

const $grid = document.getElementById("grid");
const $empty = document.getElementById("empty");
const $count = document.getElementById("count");
const $cats = document.getElementById("cats");
const $types = document.getElementById("types");

function chip(label, value, attr) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip";
  b.dataset[attr] = value;
  b.textContent = label;
  b.setAttribute("aria-pressed", value === "" ? "true" : "false");
  if (value) b.style.setProperty("--dot", STYLE[value].color);
  return b;
}

$cats.append(chip("Totes", "", "cat"));
for (const c of CATEGORIES) {
  const n = SKILLS.filter(s => s.categoria === c).length;
  $cats.append(chip(`${c} · ${n}`, c, "cat"));
}

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

function card(s) {
  const st = STYLE[s.categoria];
  const el = document.createElement("article");
  el.className = "card";
  el.style.setProperty("--accent", st.color);
  el.innerHTML = `
    <span class="card-shape ${st.shape}" aria-hidden="true"></span>
    <p class="card-cat">${s.categoria}</p>
    <h2 class="card-name"></h2>
    <p class="card-desc"></p>
    <dl class="card-meta">
      <div><dt>Tipus</dt><dd class="badge ${s.tipus}">${s.tipus === "plugin" ? "Plugin" : "Integrada"}</dd></div>
      <div><dt>Autor</dt><dd></dd></div>
      <div><dt>On</dt><dd>${s.on.join(" · ")}</dd></div>
    </dl>`;
  el.querySelector(".card-name").textContent = s.nom;
  el.querySelector(".card-desc").textContent = s.descripcio;
  el.querySelector(".card-meta div:nth-child(2) dd").textContent = s.plugin ? `${s.autor} · ${s.plugin}` : s.autor;
  return el;
}

function render() {
  const list = SKILLS.filter(matches);
  $grid.replaceChildren(...list.map(card));
  $empty.hidden = list.length > 0;
  $count.textContent = `${list.length} de ${SKILLS.length} skills`;
}

render();
