// Catàleg de skills de Claude.
// Per afegir-ne una, afegeix un objecte a la llista amb els mateixos camps.
//   tipus:     "integrada" (ve amb Claude) o "plugin" (s'instal·la des del directori)
//   categoria: ha de coincidir amb una de CATEGORIES
//   on:        on es fa servir ("Claude Code", "claude.ai" o tots dos)
const CATEGORIES = [
  "Documents",
  "Disseny",
  "Accessibilitat",
  "Codi",
  "Dades",
  "Recerca",
  "Automatització",
];

const SKILLS = [
  // --- Documents ---
  { nom: "docx", categoria: "Documents", tipus: "integrada", autor: "Anthropic", on: ["claude.ai", "Claude Code"],
    descripcio: "Crea, llegeix i edita documents de Word (.docx), incloent-hi control de canvis, imatges i plantilles." },
  { nom: "pptx", categoria: "Documents", tipus: "integrada", autor: "Anthropic", on: ["claude.ai", "Claude Code"],
    descripcio: "Genera i modifica presentacions de PowerPoint, amb notes del ponent, plantilles i disposicions." },
  { nom: "xlsx", categoria: "Documents", tipus: "integrada", autor: "Anthropic", on: ["claude.ai", "Claude Code"],
    descripcio: "Treballa amb fulls de càlcul: fórmules, format, gràfics i neteja de dades en .xlsx i .csv." },
  { nom: "pdf", categoria: "Documents", tipus: "integrada", autor: "Anthropic", on: ["claude.ai", "Claude Code"],
    descripcio: "Extreu text i taules, combina, divideix, omple formularis i fa OCR sobre fitxers PDF." },
  { nom: "docs", categoria: "Documents", tipus: "integrada", autor: "Anthropic", on: ["claude.ai", "Claude Code"],
    descripcio: "Documents vius per compartir, comentar i editar en equip, amb pestanyes, taules i gràfics." },

  // --- Disseny ---
  { nom: "frontend-design", categoria: "Disseny", tipus: "plugin", autor: "Anthropic", on: ["Claude Code"],
    descripcio: "Guia de disseny UI/UX per implementar interfícies web amb una direcció visual clara i acurada." },
  { nom: "design-critique", categoria: "Disseny", tipus: "plugin", autor: "Anthropic", plugin: "Design", on: ["claude.ai", "Claude Code"],
    descripcio: "Crítica estructurada d'un disseny: jerarquia, consistència, usabilitat i propostes de millora." },
  { nom: "design-system", categoria: "Disseny", tipus: "plugin", autor: "Anthropic", plugin: "Design", on: ["claude.ai", "Claude Code"],
    descripcio: "Crea i manté sistemes de disseny: tokens, components i documentació d'ús." },
  { nom: "design-handoff", categoria: "Disseny", tipus: "plugin", autor: "Anthropic", plugin: "Design", on: ["claude.ai", "Claude Code"],
    descripcio: "Prepara especificacions detallades perquè desenvolupament implementi el disseny al píxel." },
  { nom: "ux-copy", categoria: "Disseny", tipus: "plugin", autor: "Anthropic", plugin: "Design", on: ["claude.ai", "Claude Code"],
    descripcio: "Redacció de textos d'interfície: botons, errors, estats buits i microcopy." },
  { nom: "artifact-design", categoria: "Disseny", tipus: "integrada", autor: "Anthropic", on: ["Claude Code"],
    descripcio: "Fonaments de disseny per a pàgines publicades com a Artifacts: tipografia, color, temes clar i fosc." },
  { nom: "artifact-diagramming", categoria: "Disseny", tipus: "integrada", autor: "Anthropic", on: ["Claude Code"],
    descripcio: "Diagrames SVG llegibles que expliquen el mecanisme real, en tema clar i fosc." },
  { nom: "jp-design", categoria: "Disseny", tipus: "plugin", autor: "Comunitat", plugin: "jp-web-design-guardrails", on: ["claude.ai", "Claude Code"],
    descripcio: "Interfícies web preparades per al japonès: tipografia CJK, patrons culturals i localització." },
  { nom: "rayden-use", categoria: "Disseny", tipus: "plugin", autor: "Comunitat", plugin: "Rayden UI Design Skill", on: ["claude.ai", "Claude Code"],
    descripcio: "Genera codi React i dissenys a Figma amb la llibreria de components Rayden UI." },
  { nom: "liquid-glass", categoria: "Disseny", tipus: "plugin", autor: "Comunitat", on: ["claude.ai", "Claude Code"],
    descripcio: "Sistema de disseny Liquid Glass d'iOS 26 per a SwiftUI: tokens, moviment i patrons." },

  // --- Accessibilitat ---
  { nom: "accessibility-review", categoria: "Accessibilitat", tipus: "plugin", autor: "Anthropic", plugin: "Design", on: ["claude.ai", "Claude Code"],
    descripcio: "Auditoria d'accessibilitat d'un disseny o pàgina segons les pautes WCAG." },
  { nom: "ux-ui-audit", categoria: "Accessibilitat", tipus: "plugin", autor: "Comunitat", on: ["claude.ai", "Claude Code"],
    descripcio: "Mesura contrast WCAG, mides d'objectius tàctils, focus i conformitat amb el sistema de disseny." },
  { nom: "mcp-audit", categoria: "Accessibilitat", tipus: "plugin", autor: "Deque", plugin: "Axe Accessibility", on: ["Claude Code"],
    descripcio: "Escaneja, corregeix i verifica l'accessibilitat de la UI amb el servidor MCP d'Axe." },
  { nom: "liquid-theme-a11y", categoria: "Accessibilitat", tipus: "plugin", autor: "Shopify", plugin: "liquid-skills", on: ["claude.ai", "Claude Code"],
    descripcio: "Patrons d'accessibilitat WCAG per a temes de Shopify escrits en Liquid." },

  // --- Codi ---
  { nom: "code-review", categoria: "Codi", tipus: "integrada", autor: "Anthropic", on: ["Claude Code"],
    descripcio: "Revisa el diff actual o una PR a la recerca d'errors, amb diversos nivells d'exhaustivitat." },
  { nom: "simplify", categoria: "Codi", tipus: "integrada", autor: "Anthropic", on: ["Claude Code"],
    descripcio: "Revisa el codi canviat per reutilitzar, simplificar i fer-lo més eficient, i aplica els canvis." },
  { nom: "security-review", categoria: "Codi", tipus: "integrada", autor: "Anthropic", on: ["Claude Code"],
    descripcio: "Revisió de seguretat completa dels canvis pendents de la branca actual." },
  { nom: "claude-api", categoria: "Codi", tipus: "integrada", autor: "Anthropic", on: ["Claude Code"],
    descripcio: "Referència de l'API de Claude i els SDK: models, eines, streaming, memòria cau i agents." },
  { nom: "init", categoria: "Codi", tipus: "integrada", autor: "Anthropic", on: ["Claude Code"],
    descripcio: "Genera un CLAUDE.md que documenta el projecte per a futures sessions." },
  { nom: "run", categoria: "Codi", tipus: "integrada", autor: "Anthropic", on: ["Claude Code"],
    descripcio: "Arrenca l'aplicació del projecte per comprovar que un canvi funciona de debò." },
  { nom: "shopify-liquid-themes", categoria: "Codi", tipus: "plugin", autor: "Shopify", plugin: "liquid-skills", on: ["claude.ai", "Claude Code"],
    descripcio: "Fonaments del llenguatge Liquid i estàndards de CSS/JS/HTML per a temes de Shopify." },

  // --- Dades ---
  { nom: "dataviz", categoria: "Dades", tipus: "integrada", autor: "Anthropic", on: ["claude.ai", "Claude Code"],
    descripcio: "Gràfics i dashboards coherents i accessibles, amb una paleta validada i regles d'interacció." },
  { nom: "traffic-change-diagnosis", categoria: "Dades", tipus: "plugin", autor: "Comunitat", plugin: "analytics-skills", on: ["claude.ai", "Claude Code"],
    descripcio: "Diagnostica canvis de trànsit web i la qualitat dels canals com un analista sènior." },

  // --- Recerca ---
  { nom: "deep-research", categoria: "Recerca", tipus: "integrada", autor: "Anthropic", on: ["claude.ai", "Claude Code"],
    descripcio: "Investigació a fons en múltiples fonts, sintetitzada en un informe narratiu." },
  { nom: "user-research", categoria: "Recerca", tipus: "plugin", autor: "Anthropic", plugin: "Design", on: ["claude.ai", "Claude Code"],
    descripcio: "Planifica i porta a terme recerca d'usuaris: entrevistes, guions i proves." },
  { nom: "research-synthesis", categoria: "Recerca", tipus: "plugin", autor: "Anthropic", plugin: "Design", on: ["claude.ai", "Claude Code"],
    descripcio: "Sintetitza resultats de recerca en temes, insights i recomanacions accionables." },

  // --- Automatització ---
  { nom: "skill-creator", categoria: "Automatització", tipus: "integrada", autor: "Anthropic", on: ["claude.ai", "Claude Code"],
    descripcio: "Crea skills noves, millora les existents i en mesura el rendiment amb avaluacions." },
  { nom: "loop", categoria: "Automatització", tipus: "integrada", autor: "Anthropic", on: ["Claude Code"],
    descripcio: "Executa una tasca o comanda de manera recurrent, a un interval fix o autoregulat." },
  { nom: "update-config", categoria: "Automatització", tipus: "integrada", autor: "Anthropic", on: ["Claude Code"],
    descripcio: "Configura Claude Code via settings.json: permisos, variables d'entorn i hooks." },
  { nom: "session-start-hook", categoria: "Automatització", tipus: "integrada", autor: "Anthropic", on: ["Claude Code"],
    descripcio: "Prepara un repositori perquè les sessions web puguin executar tests i linters en arrencar." },
];
