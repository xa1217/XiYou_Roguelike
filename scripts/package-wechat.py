#!/usr/bin/env python3
"""WeChat mini-game art packaging (batch C, 2026-10-28).

Canonical art stays in prototype-2d/assets (PNG masters). This script builds
the WeChat delivery copies under wechat-game/art-*/: painted sheets and FX
strips are transcoded to WebP at identical pixel dimensions (the runtime
frame contracts validate dimensions + frames JSON, both preserved), JPG art
is copied as-is, and a runtime manifest (wechat-game/art-manifest.js) plus
the game.json subpackage list are regenerated from the tables below.

The file tables mirror prototype-2d/native-app.js (the web shell). If a file
is added there, add it here too; the audit at the end fails loudly when a
listed source is missing.

Usage: python3 scripts/package-wechat.py
Limits audited: main package <= 4MB, each subpackage <= 2MB, total <= 20MB.
"""
import json
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "prototype-2d" / "assets"
GAME = ROOT / "wechat-game"
WEBP_Q = 70

UI_FILES = [  # gate art, copied as-is: small UI textures (JPG) + skill icons (PNG)
    "ui-paper.jpg", "ui-wood.jpg", "ui-patrol.jpg", "ui-chapter.jpg",
    "ui-logo.jpg", "ui-divider.jpg",
    "skill-icon-wukong.png", "skill-icon-tangsanzang.png", "skill-icon-bajie.png",
    "skill-icon-shajing.png", "skill-icon-purple-gourd.png", "skill-icon-iron-fan.png",
    "skill-icon-diamond-snare.png", "skill-icon-nine-dragon.png", "skill-icon-lotus-lantern.png",
    "skill-icon-golden-rope.png", "skill-icon-moon-mirror.png", "skill-icon-samadhi-fire.png",
]
UI_WEBP = [  # the nine large decorative JPGs (posters + page headers) transcode
    # to WebP like the sheets: as raw JPG copies they alone would break the
    # 2MB subpackage cap (posters ~200-260 KiB each).
    "ui-poster.jpg", "hero-poster-wukong.jpg", "hero-poster-tangsanzang.jpg",
    "hero-poster-bajie.jpg", "hero-poster-shajing.jpg", "header-chapters.jpg",
    "header-talents.jpg", "header-codex.jpg", "header-daily.jpg",
]
HERO_SHEETS = [
    "hero-wukong-battle-v3-sheet.png", "hero-tangseng-battle-v3-sheet.png",
    "hero-bajie-battle-v3-sheet.png", "hero-wujing-battle-v3-sheet.png",
]
ENEMY_SHEETS = [  # (sheet, frames json or None)
    ("enemy-tiger-battle-v1-sheet.png", "enemy-tiger-battle-v1-frames.json"),
    ("enemy-bear-battle-v1-sheet.png", "enemy-bear-battle-v1-frames.json"),
    ("enemy-bull-battle-v1-sheet.png", "enemy-bull-battle-v1-frames.json"),
    ("enemy-wolf-battle-v1-sheet.png", "enemy-wolf-battle-v1-frames.json"),
    ("enemy-monkey-battle-v1-sheet.png", "enemy-monkey-battle-v1-frames.json"),
    ("enemy-deer-battle-v1-sheet.png", "enemy-deer-battle-v1-frames.json"),
    ("enemy-hawk-battle-v1-sheet.png", "enemy-hawk-battle-v1-frames.json"),
    ("enemy-snake-battle-v3-sheet.png", "enemy-snake-battle-v3-frames.json"),
]
BOSS_SHEETS = [
    ("enemy-yin-general-battle-v1-sheet.png", "enemy-yin-general-battle-v1-frames.json"),
    ("enemy-xiong-shanjun-battle-v1-sheet.png", "enemy-xiong-shanjun-battle-v1-frames.json"),
    ("enemy-te-chushi-battle-v1-sheet.png", "enemy-te-chushi-battle-v1-frames.json"),
]
FX_STRIPS = [
    "skill-fx-slash-arc.png", "skill-fx-light-orb.png", "skill-fx-rake-sweep.png",
    "skill-fx-water-ring.png", "skill-fx-fan-wave.png", "skill-fx-gourd-vortex.png",
    "skill-fx-palm-burst.png", "skill-fx-fire-bird.png", "skill-fx-mountain-slam.png",
    "skill-fx-skull-bead.png", "skill-fx-holy-spark.png", "skill-fx-fire-wheel.png",
    "skill-fx-ring-spin.png", "skill-fx-gold-bead.png", "skill-fx-fire-pool.png",
    "skill-fx-monkey-clone.png", "skill-fx-whirl-pool.png",
]
MAP_FILES = [
    "map-doublefork-high-ridge-v1.jpg", "map-forest-qv1.jpg", "map-temple-qv1.jpg",
    "map-water-qv1.jpg", "map-fire-qv1.jpg", "map-sand-qv1.jpg", "map-snow-qv1.jpg",
]

PACKAGES = {}  # name -> {"webp": [...], "copy": [...], "json": [...]}


def pkg(name):
    return PACKAGES.setdefault(name, {"webp": [], "copy": [], "json": []})


pkg("art-ui")["copy"] += UI_FILES
pkg("art-ui")["webp"] += UI_WEBP
pkg("art-heroes")["webp"] += HERO_SHEETS
# Enemy atlases are the heaviest group (~300 KiB each at q70): split 4 + 4 so
# every subpackage stays under the 2MB cap.
for sheet, frames in ENEMY_SHEETS[:4]:
    pkg("art-enemies-a")["webp"].append(sheet)
    if frames:
        pkg("art-enemies-a")["json"].append(frames)
for sheet, frames in ENEMY_SHEETS[4:]:
    pkg("art-enemies-b")["webp"].append(sheet)
    if frames:
        pkg("art-enemies-b")["json"].append(frames)
for sheet, frames in BOSS_SHEETS:
    pkg("art-bosses")["webp"].append(sheet)
    if frames:
        pkg("art-bosses")["json"].append(frames)
pkg("art-fx")["webp"] += FX_STRIPS
pkg("art-fx")["copy"].append("crater-decal.jpg")
# The seven painted maps total ~2.3MB as JPG copies: split by chapter group
# so each package stays under the cap (doublefork is the heavy one, 481 KiB).
pkg("art-maps-a")["copy"] += [MAP_FILES[0], MAP_FILES[1], MAP_FILES[2]]
pkg("art-maps-b")["copy"] += MAP_FILES[3:]


def dir_bytes(path):
    return sum(p.stat().st_size for p in path.rglob("*") if p.is_file())


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    manifest = {"packages": [], "groups": {}}
    problems = []
    for name, spec in PACKAGES.items():
        if only and name != only:
            # Keep the manifest/game.json complete: register existing output.
            out_dir = GAME / name
            if out_dir.exists():
                manifest["packages"].append(name)
                manifest["groups"][name] = sorted(
                    p.name for p in out_dir.iterdir() if p.is_file())
            continue
        out_dir = GAME / name
        if out_dir.exists():
            shutil.rmtree(out_dir)
        out_dir.mkdir(parents=True)
        entries = []
        for src_name in spec["webp"]:
            src = ASSETS / src_name
            if not src.exists():
                problems.append(f"missing source: {src_name}")
                continue
            dst_name = src_name.rsplit(".", 1)[0] + ".webp"
            with Image.open(src) as im:
                im.save(out_dir / dst_name, "WEBP", quality=WEBP_Q, method=6)
            entries.append(dst_name)
        for src_name in spec["copy"] + spec["json"]:
            src = ASSETS / src_name
            if not src.exists():
                problems.append(f"missing source: {src_name}")
                continue
            shutil.copyfile(src, out_dir / src_name)
            entries.append(src_name)
        manifest["packages"].append(name)
        manifest["groups"][name] = sorted(entries)
        size = dir_bytes(out_dir)
        flag = "  <-- OVER 2MB" if size > 2 * 1024 * 1024 else ""
        print(f"{name:14s} {size/1024:9.1f} KiB  ({len(entries)} files){flag}")
        if flag:
            problems.append(f"subpackage {name} over 2MB: {size}")

    (GAME / "art-manifest.js").write_text(
        "// Generated by scripts/package-wechat.py. Do not edit.\n"
        "module.exports=" + json.dumps(manifest, ensure_ascii=False) + ";\n"
    )
    game_json = {"deviceOrientation": "portrait", "showStatusBar": False,
                 "subpackages": [{"name": "illustrations", "root": "illustrations/"}] +
                                [{"name": n, "root": n + "/"} for n in manifest["packages"]]}
    (GAME / "game.json").write_text(json.dumps(game_json, ensure_ascii=False, indent=1) + "\n")

    total = dir_bytes(GAME)
    sub_bytes = sum(dir_bytes(GAME / n) for n in manifest["packages"]) + dir_bytes(GAME / "illustrations")
    main_bytes = total - sub_bytes
    print(f"{'MAIN':14s} {main_bytes/1024:9.1f} KiB")
    print(f"{'TOTAL':14s} {total/1024/1024:9.2f} MiB  (limit 20 MiB)")
    if main_bytes > 4 * 1024 * 1024:
        problems.append(f"main package over 4MB: {main_bytes}")
    if total > 20 * 1024 * 1024:
        problems.append(f"total over 20MB: {total}")
    if problems:
        print("PROBLEMS:")
        for p in problems:
            print(" -", p)
        sys.exit(1)
    print("PACKAGE PASS")


if __name__ == "__main__":
    main()
