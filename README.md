# Catàleg de skills de Claude

Pàgina web estàtica d'estil Bauhaus que cataloga skills de Claude, amb cercador i filtres per categoria i per tipus (integrades o de plugins).

## Com veure-la

Obre `index.html` al navegador. No cal compilar res.

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
- `app.js`: cerca, filtres i pintat de les targetes

## Skills del projecte

A `.claude/skills/` hi ha skills que Claude Code carrega automàticament quan treballa en aquest repositori, tant a VS Code com al terminal o al web:

- `frontend-design`: la skill oficial d'Anthropic per fer dissenys amb personalitat, que no semblin generats per IA (llicència Apache 2.0, a `LICENSE.txt`).
- `avoid-ai-design`: de [funboy322/avoid-ai-design](https://github.com/funboy322/avoid-ai-design). Audita una pàgina i la reescriu perquè no sembli feta per IA (llicència MIT). Inclou un escàner sense dependències:

  ```
  node .claude/skills/avoid-ai-design/scripts/detect.mjs index.html styles.css app.js
  ```
