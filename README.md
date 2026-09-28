# Catàleg de skills de Claude

Pàgina web estàtica d'estil Bauhaus que cataloga skills de Claude, amb cercador i filtres per categoria i per tipus (integrades o de plugins).

## Com veure-la

Hi ha dues versions que comparteixen les dades de `skills.js`:

- `index.html`: versió Bauhaus.
- `apple.html`: versió minimalista a l'estil d'Apple, amb icones de [Phosphor](https://phosphoricons.com) en pes light (llicència MIT), allotjades a `vendor/phosphor/`.

Obre qualsevol dels dos fitxers al navegador. No cal compilar res.

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
