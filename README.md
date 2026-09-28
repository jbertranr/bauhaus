# Catàleg de skills de Claude

Pàgina web estàtica d'estil Bauhaus que cataloga skills de Claude, amb cercador i filtres per categoria i per tipus (integrades o de plugins).

## Com veure-la

Hi ha quatre versions que comparteixen les dades de `skills.js`:

- `index.html`: versió Bauhaus.
- `apple.html`: versió minimalista a l'estil d'Apple, amb icones de [Phosphor](https://phosphoricons.com) en pes light (llicència MIT), allotjades a `vendor/phosphor/`.
- `fanzine.html`: versió fanzine, impresa a dues tintes com una risografia (rosa fluorescent i blau), amb il·lustracions SVG dibuixades per a cada categoria. Tipografies Bricolage Grotesque i Atkinson Hyperlegible (OFL) a `vendor/fonts/` i icones Phosphor duotone (MIT) a `vendor/phosphor/`.
- `mapa.html`: les skills com un mapa de metro (cada línia és una categoria i cada parada, una skill) amb una consola de cerca a sota. La consola ordena els resultats per rellevància, es fa servir amb el teclat i explica com s'obté cada skill. Tipografia Atkinson Hyperlegible i icones Phosphor light.

Obre qualsevol dels fitxers al navegador. No cal compilar res.

Per compartir el catàleg filtrat per una categoria, afegeix-la a l'adreça: `index.html#codi`, `apple.html#disseny`, `#automatitzacio`… (en minúscules i sense accents).

## Com afegir una skill

Afegeix un objecte a la llista `SKILLS` de `skills.js`:

```js
{ nom: "la-meva-skill", categoria: "Disseny", tipus: "plugin", autor: "Comunitat",
  plugin: "nom-del-plugin", on: ["claude.ai", "Claude Code"],
  descripcio: "Què fa, en una frase." },
```

La `categoria` ha de ser una de les de `CATEGORIES`. Per crear-ne una de nova, afegeix-la allà i dona-li un color i una forma a `STYLE`, a `app.js`.

## Fitxers

- `index.html`: estructura de la pàgina
- `styles.css`: estils (temes clar i fosc, adaptat a mòbil)
- `skills.js`: dades del catàleg
- `app.js`: cerca, filtres i pintat de la versió Bauhaus
- `apple.css`, `apple.js`: estils i lògica de la versió minimalista
- `fanzine.css`, `fanzine.js`: estils, lògica i il·lustracions de la versió fanzine
- `mapa.css`, `mapa.js`: estils, traçat del mapa i consola de la versió mapa

## Skills del projecte

A `.claude/skills/` hi ha skills que Claude Code carrega automàticament quan treballa en aquest repositori, tant a VS Code com al terminal o al web:

- `frontend-design`: la skill oficial d'Anthropic per fer dissenys amb personalitat, que no semblin generats per IA (llicència Apache 2.0, a `LICENSE.txt`).
- `avoid-ai-design`: de [funboy322/avoid-ai-design](https://github.com/funboy322/avoid-ai-design). Audita una pàgina i la reescriu perquè no sembli feta per IA (llicència MIT). Inclou un escàner sense dependències:

  ```
  node .claude/skills/avoid-ai-design/scripts/detect.mjs index.html styles.css app.js
  ```
- `ui-ux-pro-max`: de [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (llicència MIT). Base de dades local d'estils, paletes, tipografies i pautes d'UX, amb un cercador en Python 3 sense dependències:

  ```
  python3 .claude/skills/ui-ux-pro-max/scripts/search.py "focus visible teclat" --domain ux
  ```
- `impeccable`: de [pbakaus/impeccable](https://github.com/pbakaus/impeccable) (Apache 2.0). Disseny en fases: `critique`, `audit`, `polish`, `harden`, `typeset`, `colorize`… Invoca-la amb `/impeccable <ordre>`. El primer cop baixa el seu motor des de les versions de GitHub del projecte (a `~/.impeccable/`), comprovant-ne la signatura; si no pot, funciona igualment llegint només les referències.
- `webapp-testing`: de [anthropics/skills](https://github.com/anthropics/skills) (Apache 2.0). Proves automàtiques amb Playwright per a Python. Cal instal·lar-lo una vegada a la màquina:

  ```
  pip install playwright
  playwright install chromium
  ```

## Agents

### Dissenyador web

`.claude/agents/jb-agent-dissenyador-web.md` és un subagent de Claude Code que genera pàgines web aplicant les skills anteriors sempre en el mateix ordre:

1. Brief (com a màxim 3 preguntes)
2. `ui-ux-pro-max`: paleta, tipografia i estil
3. `frontend-design`: direcció visual i construcció
4. `impeccable` `critique` i `audit`
5. `avoid-ai-design`: escàner `detect.mjs` i correccions
6. `webapp-testing`: captures i proves (si alguna falla, torna al pas 4)
7. `impeccable polish`

Crea sempre fitxers nous (no toca les versions existents), ho allotja tot a `vendor/` i no fa servir res que demani compte o pagament. Per fer-lo servir, obre una sessió nova de Claude Code en aquest repo i demana, per exemple: *"Fes servir el jb-agent-dissenyador-web per crear una pàgina de…"*. Per canviar-lo, edita el fitxer directament o demana-ho a Claude.

### Calcador d'estil

`.claude/agents/jb-agent-calcador-estil.md` crea una pàgina nova amb el contingut que li indiquis, però amb l'estètica d'una pàgina de referència (un fitxer del repo o una URL). Els passos són:

1. Observa la referència (codi i captures)
2. Escriu una fitxa d'estil a `estils/<referència>.md` (tokens, maquetació, components, motius i el que no fa)
3. Decideix quin component de la referència fa servir per a cada bloc del contingut nou
4. Construeix la pàgina en fitxers nous
5. Compara la pàgina nova amb la referència (captures i estils calculats)
6. Passa les proves de qualitat

D'una web externa en copia l'estil, però no la marca, les imatges ni els textos. Exemple: *"Fes servir el jb-agent-calcador-estil per crear una pàgina amb el meu currículum amb l'estil d'apple.html"*.
