---
name: jb-skill-fotografies
description: Incorpora fotografies a les pàgines del repo (Social 360 i la resta) de manera coherent, lleugera, accessible i respectuosa amb la privacitat. Fes-la servir sempre que calgui afegir, substituir o preparar fotos per a una pàgina web del projecte, quan l'usuari digui "posa-hi una foto", "afegeix imatges reals", "fes servir aquesta fotografia" o passi fitxers JPG, PNG, HEIC o WebP per a una pàgina. Inclou un script local (scripts/foto.py) que treu les metadades (també la ubicació GPS), retalla a una proporció fixa, la tenyeix sempre amb un color de la paleta, genera WebP en diverses mides i registra els crèdits. No és per a il·lustracions de línia ni per a icones.
license: MIT
metadata:
  version: "1.0.0"
---

# Fotografies

Respon sempre en català. Aquesta skill defineix com entren les fotos al repo i com es mostren a les pàgines. L'objectiu és que una foto sembli part del mateix disseny que les il·lustracions de línia, que carregui ràpid i que no exposi ningú. Per això **totes les fotos van tenyides amb un color de la paleta**: mai no es publiquen al natural.

## Regles fixes

1. **Origen i llicència abans que res.** Només fotos que:
   - ha fet o té l'usuari o l'Ajuntament, amb permís per publicar-les, o
   - tenen una llicència lliure que permet l'ús públic: CC0, CC BY o CC BY-SA (aquesta última obliga a compartir igual), o la llicència d'Unsplash o Pexels.

   Si no saps d'on surt una foto o quina llicència té, **pregunta-ho i no la facis servir fins que ho sàpigues**. No descarreguis fotos de webs qualssevol ni de cercadors d'imatges.
2. **Privacitat en serveis socials.** No publiquis cap foto on es pugui identificar una persona usuària de serveis socials, un menor d'edat o algú en situació vulnerable, tret que l'usuari confirmi que hi ha consentiment escrit. En cas de dubte, tria fotos d'espais, objectes, mans, persones d'esquena o fora de focus. No endevinis ni escriguis el nom de ningú en textos alternatius ni en peus de foto.
3. **Res de fotos generades amb IA que semblin reals.** Si l'usuari n'aporta alguna, ha d'anar marcada com a imatge generada al peu de foto i als crèdits.
4. **Tot dins del repo.** Les fotos processades van a `vendor/img/` i es carreguen amb rutes relatives. No s'enllacen imatges de servidors externs ni es fan servir serveis remots per comprimir-les.
5. **No toquis els originals.** L'script llegeix l'original i escriu fitxers nous. Els originals no es pugen al repo; si l'usuari els vol conservar, que ho faci fora del repo.

## Procés

Porta una llista de control amb aquests passos.

### 1. Recull la informació de cada foto

Per a cada fitxer, necessites saber:
- **on va** (pàgina i secció);
- **origen, autoria i llicència**;
- **si hi surten persones** i, si és així, si hi ha consentiment;
- **què mostra**, per escriure el text alternatiu.

Pregunta el que falti en un sol missatge, amb com a màxim tres preguntes.

### 2. Tria la proporció i el tractament

Fes servir sempre les mateixes proporcions perquè les pàgines respirin igual:

| Ús | Proporció | Opció de l'script |
|---|---|---|
| Capçalera o franja ampla | 16:9 | `--ratio 16:9` |
| Targeta o costat d'un text | 4:3 | `--ratio 4:3` |
| Retrat o columna estreta | 3:4 | `--ratio 3:4` |
| Miniatura | 1:1 | `--ratio 1:1` |

**Tint obligatori.** Cada foto es converteix a escala de grisos i es tenyeix amb tres tons de la paleta:
- **ombres:** el negre de la tinta (`#191918`);
- **tons mitjans:** el color fort de l'àmbit;
- **llums:** el color pàl·lid de l'àmbit, el mateix de les targetes i de les taques de les il·lustracions.

| Tint | Tons mitjans | Llums | Quan |
|---|---|---|---|
| `--tint blau` | `#0070d6` | `#f2f9ff` | Ciutadania i Carpeta Social; capçaleres i usos generals |
| `--tint verd` | `#2f8a55` | `#eef6f0` | Professionals i espai de treball |
| `--tint groc` | `#d9a300` | `#fdf8e3` | Connexions i interoperabilitat |
| `--tint vermell` | `#d44c47` | `#fdf0f0` | Dades i quadres de comandament |

- Tria el tint segons la secció on va la foto, amb aquesta taula. Si una secció no és de cap àmbit, fes servir el blau.
- Totes les fotos d'una mateixa secció porten el mateix tint.
- No hi ha opció de publicar-la al natural. Si l'usuari demana una foto sense tenyir, recorda-li que la norma del projecte és tenyir-les i pregunta-li si vol canviar la norma abans de fer res.
- Una foto molt fosca o amb poc contrast pot quedar plana. Mira el resultat i, si cal, prova un altre retall o demana una altra foto.

### 3. Processa la foto

```
python3 .claude/skills/jb-skill-fotografies/scripts/foto.py ORIGINAL --nom NOM --ratio 4:3 --tint blau [--focus 0.5,0.4] \
  --autoria "Nom o entitat" --llicencia "CC BY 4.0" --origen "URL o 'Ajuntament de Mataró'" --alt "Text alternatiu"
```

- Cal Pillow: `pip install pillow`.
- `--nom` és el nom base en minúscules i amb guions (p. ex. `oficina-atencio`).
- `--focus` indica el punt que s'ha de conservar en retallar, entre 0 i 1 (`x,y`). Per defecte és el centre. Mira la foto abans de retallar i ajusta'l perquè no tallis el que importa.
- L'script:
  - treu totes les metadades (EXIF, GPS, càmera);
  - gira la foto segons l'orientació de la càmera;
  - retalla a la proporció;
  - la tenyeix amb el tint triat;
  - genera WebP de 480, 960, 1440 i 2000 px d'amplada (només les mides que no superin l'original) a `vendor/img/`;
  - afegeix una fila a `vendor/img/CREDITS.md`;
  - imprimeix l'etiqueta `<img>` llesta per enganxar, amb `srcset`, `sizes`, `width`, `height`, `loading` i `alt`.
- Si l'original fa menys de 960 px d'amplada, avisa l'usuari que es veurà borrosa en pantalles grans.

### 4. Posa-la a la pàgina

- Enganxa l'etiqueta que imprimeix l'script. Ajusta `sizes` a l'amplada real que ocupa a la pàgina.
- A la foto de la capçalera (la que es veu sense desplaçar), treu `loading="lazy"` i posa-hi `fetchpriority="high"`.
- Fes servir la classe `.foto` de `social360.css` (o afegeix-la a la fulla d'estils de la pàgina si no hi és):

  ```css
  .foto { display: block; width: 100%; height: auto; border-radius: var(--radius); background: var(--panel); }
  .foto-peu { margin-top: 8px; font-size: 13px; color: var(--faint); }
  ```

- Si la llicència demana atribució (CC BY, CC BY-SA), posa-la en un peu de foto (`<figure>` + `<figcaption class="foto-peu">`) o en un apartat de crèdits al peu de la pàgina, que enllaci a `vendor/img/CREDITS.md`.
- **Text alternatiu:** descriu el que aporta la foto en una frase curta en català, sense «imatge de» ni «foto de». Si la foto és purament decorativa, posa `alt=""` i digues per què a l'usuari.
- **Amb il·lustracions:** no posis una foto i una il·lustració a la mateixa targeta. En una mateixa zona, com a molt una foto gran o una il·lustració gran. Les fotos no porten taca de color al darrere: ja lliguen amb les il·lustracions gràcies al tint.
- **Canvas del projecte:** si la pàgina també té un tauler al canvas de claude.ai, puja-hi la foto com a recurs de l'artifact (la mida de 1440 px) i fes servir l'URL que retorni, no la ruta de `vendor/img/`.

### 5. Comprova-ho

Fes servir la skill `webapp-testing`:
- captures a 1440 i a 390 px, per comprovar que el retall funciona a totes dues mides;
- cap error de consola ni cap imatge que no carregui;
- cap desplaçament horitzontal;
- que el navegador tria la mida adequada (a 390 px no hauria de baixar la de 2000);
- que el pes total de fotos de la pàgina no passi de 1,5 MB a 1440 px. Si en passa, baixa la qualitat (`--qualitat 70`) o fes servir menys fotos.

### 6. Resumeix-ho

Explica a l'usuari quines fotos has afegit, on, amb quin tint, quina llicència té cadascuna i si cal atribució visible. Si n'has descartat alguna per llicència o privacitat, digues-ho clarament.
