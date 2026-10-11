"""Make homework photos easy to read: converts HEIC (iPhone) to JPEG, fixes rotation, shrinks big images.

Usage:  python -I tools/prep_photos.py <input folder> <output folder>
Needs:  pip install pillow pillow-heif
"""
import sys
from pathlib import Path

from PIL import Image, ImageOps

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    register_heif_opener = None

EXTS = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp"}
MAX_SIDE = 2000


def main(src: Path, dst: Path) -> None:
    dst.mkdir(parents=True, exist_ok=True)
    photos = sorted(p for p in src.iterdir() if p.suffix.lower() in EXTS)
    if not photos:
        print(f"no photos in {src}")
        return
    for p in photos:
        if p.suffix.lower() in {".heic", ".heif"} and register_heif_opener is None:
            print(f"SKIPPED {p.name}: run  pip install pillow-heif  to read iPhone photos")
            continue
        img = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
        img.thumbnail((MAX_SIDE, MAX_SIDE))
        out = dst / (p.stem + ".jpg")
        img.save(out, "JPEG", quality=88)
        print(f"{p.name} -> {out}  {img.size[0]}x{img.size[1]}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(Path(sys.argv[1]), Path(sys.argv[2]))
