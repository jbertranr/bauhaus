#!/usr/bin/env python3
"""Prepara una fotografia per a les pàgines del repo.

Treu les metadades, retalla a una proporció fixa, la tenyeix amb un color de la paleta,
genera WebP en diverses mides a vendor/img/, registra els crèdits i imprimeix l'etiqueta <img>.

Ús:
  python3 .claude/skills/jb-skill-fotografies/scripts/foto.py ORIGINAL --nom oficina --ratio 4:3 \
      --autoria "Ajuntament de Mataró" --llicencia "Ús autoritzat" --origen "Arxiu municipal" \
      --alt "Taulell d'atenció d'una oficina de serveis socials" --tint blau [--focus 0.5,0.4]
"""
import argparse
import html
import re
import sys
from datetime import date
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Cal Pillow: pip install pillow")

ROOT = Path(__file__).resolve().parents[4]
OUT = ROOT / "vendor" / "img"
CREDITS = OUT / "CREDITS.md"
WIDTHS = [480, 960, 1440, 2000]
INK = (0x19, 0x19, 0x18)
# Tint de tres tons: ombres en la tinta, tons mitjans en el color fort de l'àmbit
# i llums en el seu color pàl·lid (els mateixos de les targetes i les taques)
TINTS = {
    "blau":    {"mid": (0x00, 0x70, 0xD6), "light": (0xF2, 0xF9, 0xFF)},
    "verd":    {"mid": (0x2F, 0x8A, 0x55), "light": (0xEE, 0xF6, 0xF0)},
    "groc":    {"mid": (0xD9, 0xA3, 0x00), "light": (0xFD, 0xF8, 0xE3)},
    "vermell": {"mid": (0xD4, 0x4C, 0x47), "light": (0xFD, 0xF0, 0xF0)},
}


def parse_ratio(s):
    m = re.fullmatch(r"(\d+):(\d+)", s)
    if not m:
        raise argparse.ArgumentTypeError("La proporció ha de ser del tipus 4:3")
    return int(m.group(1)), int(m.group(2))


def parse_focus(s):
    try:
        x, y = (float(v) for v in s.split(","))
    except ValueError:
        raise argparse.ArgumentTypeError("El focus ha de ser x,y entre 0 i 1, p. ex. 0.5,0.4")
    if not (0 <= x <= 1 and 0 <= y <= 1):
        raise argparse.ArgumentTypeError("El focus ha d'anar entre 0 i 1")
    return x, y


def crop(img, ratio, focus):
    w, h = img.size
    rw, rh = ratio
    if w / h > rw / rh:          # massa ampla: retallem els costats
        nw, nh = round(h * rw / rh), h
    else:                        # massa alta: retallem a dalt i a baix
        nw, nh = w, round(w * rh / rw)
    left = min(max(round(focus[0] * w - nw / 2), 0), w - nw)
    top = min(max(round(focus[1] * h - nh / 2), 0), h - nh)
    return img.crop((left, top, left + nw, top + nh))


def treat(img, tint):
    """Tenyeix la foto: escala de grisos amb contrast normalitzat i tres tons de la paleta."""
    grey = ImageOps.autocontrast(img.convert("L"), cutoff=1)
    t = TINTS[tint]
    return ImageOps.colorize(grey, black=INK, mid=t["mid"], white=t["light"], midpoint=128)


def slug(s):
    s = s.lower().strip()
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", s):
        sys.exit("El nom ha de ser en minúscules, sense accents i amb guions, p. ex. oficina-atencio")
    return s


def add_credit(nom, args):
    OUT.mkdir(parents=True, exist_ok=True)
    if not CREDITS.exists():
        CREDITS.write_text(
            "# Crèdits de les fotografies\n\n"
            "Fotos de `vendor/img/`, preparades amb `.claude/skills/jb-skill-fotografies/scripts/foto.py`.\n\n"
            "| Fitxer | Autoria | Llicència | Origen | Tractament | Data |\n"
            "|---|---|---|---|---|---|\n", encoding="utf-8")
    cell = lambda v: str(v).replace("|", "\\|").replace("\n", " ")
    lines = CREDITS.read_text(encoding="utf-8").splitlines()
    lines = [l for l in lines if not l.startswith(f"| {nom}-")]      # si es torna a processar, substitueix la fila
    lines.append(f"| {nom}-*.webp | {cell(args.autoria)} | {cell(args.llicencia)} | {cell(args.origen)} | tint {args.tint}, {args.ratio[0]}:{args.ratio[1]} | {date.today().isoformat()} |")
    CREDITS.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    p = argparse.ArgumentParser(description="Prepara una fotografia per a les pàgines del repo")
    p.add_argument("original", type=Path)
    p.add_argument("--nom", required=True, help="nom base, en minúscules i amb guions")
    p.add_argument("--ratio", type=parse_ratio, default=(4, 3), help="16:9, 4:3, 3:4 o 1:1")
    p.add_argument("--tint", choices=list(TINTS), required=True, help="color de la paleta: blau, verd, groc o vermell")
    p.add_argument("--focus", type=parse_focus, default=(0.5, 0.5), help="punt a conservar, x,y entre 0 i 1")
    p.add_argument("--qualitat", type=int, default=78)
    p.add_argument("--autoria", required=True)
    p.add_argument("--llicencia", required=True)
    p.add_argument("--origen", required=True)
    p.add_argument("--alt", required=True, help="text alternatiu en català; \"\" si és decorativa")
    p.add_argument("--sizes", default="(max-width: 860px) 100vw, 50vw", help="valor de l'atribut sizes")
    args = p.parse_args()

    nom = slug(args.nom)
    if not args.original.exists():
        sys.exit(f"No trobo {args.original}")

    with Image.open(args.original) as src:
        img = ImageOps.exif_transpose(src)          # gira segons l'orientació de la càmera
        img = crop(img, args.ratio, args.focus)
        img = treat(img, args.tint)
    # Una imatge nova, sense cap metadada (EXIF, GPS, càmera, perfil)
    clean = Image.new("RGB", img.size)
    clean.paste(img)

    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob(f"{nom}-*.webp"):
        old.unlink()
    w0, h0 = clean.size
    widths = [w for w in WIDTHS if w <= w0] or [w0]
    written = []
    for w in widths:
        h = round(w * h0 / w0)
        out = OUT / f"{nom}-{w}.webp"
        clean.resize((w, h), Image.LANCZOS).save(out, "WEBP", quality=args.qualitat, method=6)
        written.append((w, h, out))

    add_credit(nom, args)

    rel = lambda path: path.relative_to(ROOT).as_posix()
    mid = next((x for x in written if x[0] == 960), written[-1])
    srcset = ", ".join(f"{rel(o)} {w}w" for w, _, o in written)
    tag = (f'<img class="foto" src="{rel(mid[2])}" srcset="{srcset}" sizes="{html.escape(args.sizes)}" '
           f'width="{mid[0]}" height="{mid[1]}" loading="lazy" decoding="async" alt="{html.escape(args.alt)}">')

    total = sum(o.stat().st_size for _, _, o in written)
    print(f"Original: {w0}×{h0} px després del retall · {len(written)} mides · {total / 1024:.0f} KB en total")
    for w, h, o in written:
        print(f"  {rel(o)}  {w}×{h}  {o.stat().st_size / 1024:.0f} KB")
    if w0 < 960:
        print("Avís: l'original fa menys de 960 px d'amplada; es veurà borrosa en pantalles grans.")
    print(f"Crèdits: {rel(CREDITS)}")
    print("\nEtiqueta per enganxar:\n" + tag)


if __name__ == "__main__":
    main()
