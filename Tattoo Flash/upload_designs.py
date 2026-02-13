#!/usr/bin/env python3
"""
Upload cut flash designs to Airtable via n8n webhook.
1. Upload image (base64) → get hosted URL
2. Create design record with metadata
"""

import base64
import json
import os
import time
import urllib.request

WEBHOOK = "https://tn.reinventingai.com/webhook/tattoo-admin-api"

# Category IDs
CAT_TRADITIONAL = "recWOz2ExdkMB4AHZ"

CUT_DIR = "/Users/tattoonow/Documents/Claude Code/n8n/Tattoo Flash/cut"
FLASH_DIR = "/Users/tattoonow/Documents/Claude Code/n8n/Tattoo Flash"

# Design metadata for each cut image
DESIGNS = [
    # === USMC Flash Sheet (IMG_0006) ===
    {
        "file": os.path.join(CUT_DIR, "usmc_eagle_death_before_dishonor.jpg"),
        "name": "Eagle - Death Before Dishonor",
        "description": "Traditional American eagle with 'Death Before Dishonor' banner. Classic military flash design.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Medium",
        "bodyPart": "Upper Arm",
        "oneTimeFlash": True,
    },
    {
        "file": os.path.join(CUT_DIR, "usmc_bulldog_usmc_banner.jpg"),
        "name": "USMC Bulldog with Banner",
        "description": "Marine Corps bulldog with USMC banner and 'Death Before Dishonor' ribbon. Traditional military tattoo flash.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Medium",
        "bodyPart": "Upper Arm",
        "oneTimeFlash": True,
    },
    {
        "file": os.path.join(CUT_DIR, "usmc_usmc_bulldog_cowboy_hat_main.jpg"),
        "name": "USMC Bulldog - Death or Glory",
        "description": "United States Marine Corps bulldog in cowboy hat with stars, 'Death or Glory' banner. Centerpiece flash design.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Large",
        "bodyPart": "Back",
        "oneTimeFlash": True,
    },
    {
        "file": os.path.join(CUT_DIR, "usmc_usmc_bulldog_head.jpg"),
        "name": "USMC Bulldog Head",
        "description": "Marine Corps bulldog head with cowboy hat. Clean traditional flash design with 'U.S.M.C' lettering.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Small",
        "bodyPart": "Forearm",
        "oneTimeFlash": True,
    },
    {
        "file": os.path.join(CUT_DIR, "usmc_bulldog_military_helmet.jpg"),
        "name": "Bulldog in Military Helmet",
        "description": "Marine bulldog wearing military helmet with USMC insignia and rifle strap. Traditional military flash.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Medium",
        "bodyPart": "Upper Arm",
        "oneTimeFlash": True,
    },
    {
        "file": os.path.join(CUT_DIR, "usmc_irish_wildcat_shamrock.jpg"),
        "name": "Irish Wildcat with Shamrock",
        "description": "Wildcat design with shamrock and 'Irish' banner. Traditional Irish-American military flash.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Small",
        "bodyPart": "Forearm",
        "oneTimeFlash": True,
    },
    {
        "file": os.path.join(CUT_DIR, "usmc_devil_dog_red.jpg"),
        "name": "Devil Dog",
        "description": "Red devil bulldog with cowboy hat - the iconic Marine Corps 'Devil Dog'. Traditional military flash in bold red.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Medium",
        "bodyPart": "Upper Arm",
        "oneTimeFlash": True,
    },

    # === Daggers & Skulls Flash Sheet (IMG_1751) ===
    {
        "file": os.path.join(CUT_DIR, "trad_snake_dagger.jpg"),
        "name": "Snake and Dagger",
        "description": "Snake wrapped around a dagger. Classic traditional American tattoo flash design.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Medium",
        "bodyPart": "Forearm",
        "oneTimeFlash": True,
    },
    {
        "file": os.path.join(CUT_DIR, "trad_hearts_dagger_drip.jpg"),
        "name": "Hearts and Dripping Dagger",
        "description": "Dagger through hearts with dripping blood effect. Bold traditional American flash.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Medium",
        "bodyPart": "Forearm",
        "oneTimeFlash": True,
    },
    {
        "file": os.path.join(CUT_DIR, "trad_name_banner_flower_heart.jpg"),
        "name": "Heart with Name Banner and Flower",
        "description": "Traditional heart with 'Name' banner and flower accent. Classic flash design for personalization.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Small",
        "bodyPart": "Forearm",
        "oneTimeFlash": True,
    },
    {
        "file": os.path.join(CUT_DIR, "trad_death_before_dishonor_cross.jpg"),
        "name": "Death Before Dishonor Cross",
        "description": "Ornate cross with 'Death Before Dishonor' banners, dagger, and flower. Traditional military flash.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Large",
        "bodyPart": "Upper Arm",
        "oneTimeFlash": True,
    },
    {
        "file": os.path.join(CUT_DIR, "trad_sacred_heart_dagger_name.jpg"),
        "name": "Sacred Heart with Dagger",
        "description": "Sacred heart pierced by dagger with name banner. Traditional American tattoo flash.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Small",
        "bodyPart": "Forearm",
        "oneTimeFlash": True,
    },
    {
        "file": os.path.join(CUT_DIR, "trad_heart_name_small_dagger.jpg"),
        "name": "Heart and Dagger - Name Banner",
        "description": "Small heart with name banner and dagger. Classic traditional flash for personalization.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Small",
        "bodyPart": "Forearm",
        "oneTimeFlash": True,
    },
    {
        "file": os.path.join(CUT_DIR, "trad_dragon_dagger_center.jpg"),
        "name": "Dragon and Dagger",
        "description": "Dragon wrapped around ornate dagger. Centerpiece traditional flash design with bold color work.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Large",
        "bodyPart": "Upper Arm",
        "oneTimeFlash": True,
    },
    {
        "file": os.path.join(CUT_DIR, "trad_death_before_suckass_heart.jpg"),
        "name": "Death Before - Heart and Dagger",
        "description": "Heart with 'Death Before' banner and dagger. Bold traditional American military flash.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Small",
        "bodyPart": "Forearm",
        "oneTimeFlash": True,
    },
    {
        "file": os.path.join(CUT_DIR, "trad_skull_crossbones.jpg"),
        "name": "Skull and Crossbones",
        "description": "Traditional skull and crossbones design. Classic bold American flash art.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Small",
        "bodyPart": "Forearm",
        "oneTimeFlash": True,
    },
    {
        "file": os.path.join(CUT_DIR, "trad_death_shall_triumph_skull.jpg"),
        "name": "Death Shall Triumph - Skull",
        "description": "Skull with dagger and 'Death Shall Triumph' banner. Traditional American military flash.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "Medium",
        "bodyPart": "Upper Arm",
        "oneTimeFlash": True,
    },

    # === Dragon Rock of Ages (single designs, no cutting needed) ===
    {
        "file": os.path.join(FLASH_DIR, "IMG_0343.JPG"),
        "name": "Dragon Rock of Ages - Line Art",
        "description": "Japanese-style dragon wrapped around 'Rock of Ages' cross with flames, lightning, and waves. Black and grey line art version.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "XL",
        "bodyPart": "Back",
        "oneTimeFlash": True,
    },
    {
        "file": os.path.join(FLASH_DIR, "IMG_0342.JPG"),
        "name": "Dragon Rock of Ages - Color",
        "description": "Japanese-style dragon wrapped around 'Rock of Ages' cross with flames, lightning, and waves. Full color version in teal and red.",
        "categoryId": CAT_TRADITIONAL,
        "sizeEstimate": "XL",
        "bodyPart": "Back",
        "oneTimeFlash": True,
    },
]


def upload_image(filepath):
    """Upload image to GHL via webhook, return hosted URL."""
    with open(filepath, "rb") as f:
        raw = f.read()

    # Build data URI (base64 with mime prefix)
    mime = "image/jpeg"
    b64 = base64.b64encode(raw).decode("utf-8")
    data_uri = f"data:{mime};base64,{b64}"

    payload = json.dumps({
        "action": "uploadImage",
        "fileData": data_uri,
        "fileName": os.path.basename(filepath),
        "fileType": mime,
    }).encode("utf-8")

    req = urllib.request.Request(
        WEBHOOK,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    resp = urllib.request.urlopen(req, timeout=60)
    result = json.loads(resp.read().decode("utf-8"))

    if result.get("success") and result.get("url"):
        return result["url"]
    else:
        raise Exception(f"Upload failed: {result}")


def create_design(data):
    """Create a design record in Airtable via webhook."""
    payload = json.dumps(data).encode("utf-8")

    req = urllib.request.Request(
        WEBHOOK,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    resp = urllib.request.urlopen(req, timeout=30)
    result = json.loads(resp.read().decode("utf-8"))
    return result


def main():
    total = len(DESIGNS)
    success = 0
    failed = []

    for i, design in enumerate(DESIGNS, 1):
        name = design["name"]
        filepath = design["file"]
        print(f"\n[{i}/{total}] {name}")
        print(f"  File: {os.path.basename(filepath)}")

        if not os.path.exists(filepath):
            print(f"  ERROR: File not found!")
            failed.append(name)
            continue

        # Step 1: Upload image
        try:
            print(f"  Uploading image...", end=" ", flush=True)
            image_url = upload_image(filepath)
            print(f"OK -> {image_url[:60]}...")
        except Exception as e:
            print(f"FAILED: {e}")
            failed.append(name)
            continue

        # Step 2: Create design record
        try:
            print(f"  Creating record...", end=" ", flush=True)
            record_data = {
                "action": "createDesign",
                "name": design["name"],
                "description": design["description"],
                "categoryId": design["categoryId"],
                "sizeEstimate": design["sizeEstimate"],
                "bodyPart": design["bodyPart"],
                "image": image_url,
                "available": True,
                "oneTimeFlash": design.get("oneTimeFlash", False),
                "status": "Available",
            }
            result = create_design(record_data)
            if result.get("success"):
                print(f"OK (id: {result.get('id', 'unknown')})")
                success += 1
            else:
                print(f"FAILED: {result}")
                failed.append(name)
        except Exception as e:
            print(f"FAILED: {e}")
            failed.append(name)
            continue

        # Small delay to avoid rate limiting
        time.sleep(1)

    print(f"\n{'='*50}")
    print(f"Upload complete: {success}/{total} succeeded")
    if failed:
        print(f"Failed ({len(failed)}):")
        for f in failed:
            print(f"  - {f}")


if __name__ == "__main__":
    main()
