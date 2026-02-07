#!/usr/bin/env python3
"""
Cut tattoo flash sheets into individual designs.
Uses manual crop coordinates based on visual analysis.
"""

from PIL import Image
import os

OUTPUT_DIR = "/Users/tattoonow/Documents/Claude Code/n8n/Tattoo Flash/cut"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def cut_image(src_path, crops, prefix):
    """Cut an image into individual designs based on crop coordinates.
    crops: list of (name, left, upper, right, lower)
    """
    img = Image.open(src_path)
    w, h = img.size
    print(f"\n{src_path}: {w}x{h}")

    results = []
    for name, l, u, r, b in crops:
        # Coordinates are percentages of image dimensions
        box = (int(l * w), int(u * h), int(r * w), int(b * h))
        cropped = img.crop(box)
        filename = f"{prefix}_{name}.jpg"
        filepath = os.path.join(OUTPUT_DIR, filename)
        cropped.save(filepath, "JPEG", quality=95)
        print(f"  Saved: {filename} ({cropped.size[0]}x{cropped.size[1]})")
        results.append((filename, filepath, name))

    return results


# ============================================================
# IMG_0006.JPG - USMC Marine Corps Flash Sheet
# ============================================================
usmc_crops = [
    # (name, left%, top%, right%, bottom%)
    ("eagle_death_before_dishonor", 0.0, 0.0, 0.25, 0.30),
    ("bulldog_usmc_banner", 0.03, 0.22, 0.30, 0.62),
    ("usmc_bulldog_cowboy_hat_main", 0.22, 0.0, 0.78, 0.88),
    ("usmc_bulldog_head", 0.70, 0.0, 1.0, 0.38),
    ("bulldog_military_helmet", 0.0, 0.55, 0.25, 1.0),
    ("irish_wildcat_shamrock", 0.30, 0.68, 0.58, 1.0),
    ("devil_dog_red", 0.58, 0.50, 1.0, 1.0),
]

print("Cutting USMC flash sheet...")
usmc_results = cut_image(
    "/Users/tattoonow/Documents/Claude Code/n8n/Tattoo Flash/IMG_0006.JPG",
    usmc_crops,
    "usmc"
)

# ============================================================
# IMG_1751.JPG - Daggers, Skulls & Banners Flash Sheet
# ============================================================
daggers_crops = [
    # Top row
    ("snake_dagger", 0.0, 0.0, 0.14, 0.55),
    ("hearts_dagger_drip", 0.10, 0.0, 0.32, 0.55),
    ("name_banner_flower_heart", 0.30, 0.0, 0.52, 0.30),
    ("death_before_dishonor_cross", 0.50, 0.0, 0.75, 0.45),
    ("sacred_heart_dagger_name", 0.72, 0.0, 0.88, 0.40),
    ("heart_name_small_dagger", 0.85, 0.0, 1.0, 0.45),

    # Center
    ("dragon_dagger_center", 0.32, 0.25, 0.62, 1.0),

    # Bottom row
    ("death_before_suckass_heart", 0.0, 0.48, 0.22, 0.85),
    ("skull_crossbones", 0.15, 0.55, 0.38, 0.90),
    ("death_shall_triumph_skull", 0.68, 0.40, 1.0, 1.0),
]

print("Cutting daggers/skulls flash sheet...")
daggers_results = cut_image(
    "/Users/tattoonow/Documents/Claude Code/n8n/Tattoo Flash/IMG_1751.JPG",
    daggers_crops,
    "trad"
)

print(f"\nDone! {len(usmc_results) + len(daggers_results)} designs cut.")
print(f"Output directory: {OUTPUT_DIR}")
