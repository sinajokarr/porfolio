"""Cinematic hero grade for the portrait. Lighting and colour only — facial features are never altered.

Usage: python grade.py <photo> <mask.png> <output.webp> [--og <og-portrait.png>]
Steps: edge decontamination (removes light-wall fringe) → monochrome studio tone → soft key light on the face
       → cool silver toning → lavender rim light from the sculpture side → fade into darkness at the bottom.
Requires: pillow, numpy
"""

import sys

import numpy as np
from PIL import Image, ImageFilter

LAVENDER = np.array([170, 169, 245], dtype=np.float32)
FACE_CENTER = (0.47, 0.33)  # relative position of the face in the source photo (key light target)
LIGHT_DIR = np.array([0.95, -0.3])  # rim light comes mainly from image-right (the sculpture side)


def blur(arr, radius):
    img = Image.fromarray(np.clip(arr * 255, 0, 255).astype(np.uint8))
    return np.asarray(img.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32) / 255


def main(photo, mask_path, out, og=None):
    rgb = np.asarray(Image.open(photo).convert("RGB"), dtype=np.float32) / 255
    h, w, _ = rgb.shape
    alpha = np.asarray(Image.open(mask_path).convert("L").resize((w, h), Image.LANCZOS), dtype=np.float32) / 255

    # 1. Decontaminate edges: replace semi-transparent edge pixels with colour bled outward from the
    #    solid interior (normalised convolution), then choke the matte ~1px so no wall halo survives.
    solid = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)), dtype=np.float32) / 255
    solid = (solid > 0.98).astype(np.float32)
    bleed = np.stack([blur(rgb[..., c] * solid, 5) for c in range(3)], -1) / np.maximum(blur(solid, 5), 1e-3)[..., None]
    mix = np.clip((1 - solid) * 1.0, 0, 1)[..., None] * (alpha > 0.01)[..., None]
    rgb = rgb * (1 - mix) + bleed * mix
    alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)), dtype=np.float32) / 255
    alpha = blur(alpha, 1.0)

    # 2. Monochrome with a red-weighted mix (smoother skin, classic portrait film response).
    lum = rgb[..., 0] * 0.40 + rgb[..., 1] * 0.46 + rgb[..., 2] * 0.14

    # 3. Studio tone: deeper blacks, gentle S-curve, soft key light centred on the face.
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d2 = ((xx / w - FACE_CENTER[0]) / 0.32) ** 2 + ((yy / h - FACE_CENTER[1]) / 0.30) ** 2
    lum = np.clip((lum - 0.03) / 0.97, 0, 1) ** 1.6  # low-key: suit sinks toward charcoal, face holds detail
    lum = lum * (0.70 + 0.30 * np.exp(-d2))  # key light falls off away from the face
    lum = lum * lum * (3 - 2 * lum) * 0.30 + lum * 0.70  # gentle S-curve

    # 3b. Remove the bright-wall "light wrap" around the silhouette (it reads as a halo on a dark scene).
    eroded = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(17)), dtype=np.float32) / 255
    wrap = blur(np.clip(alpha - eroded, 0, 1), 4)
    lum = lum * (1 - 0.55 * wrap)

    # 4. Clarity: mild unsharp mask on luminance only.
    lum = np.clip(lum + (lum - blur(lum, 2.2)) * 0.55, 0, 1)

    # 5. Cool silver toning (shadows lean blue, highlights stay neutral).
    toned = np.stack([lum * 0.965, lum * 0.985, np.minimum(1, lum * 1.02 + 0.018 * (1 - lum))], -1)

    # 6. Lavender rim light on silhouette edges that face the light.
    soft = blur(alpha, 3)
    gy, gx = np.gradient(soft)
    mag = np.hypot(gx, gy) + 1e-6
    facing = np.clip((-gx * LIGHT_DIR[0] - gy * LIGHT_DIR[1]) / mag, 0, 1)
    band = np.clip(alpha - blur(np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(13)), dtype=np.float32) / 255, 4), 0, 1)
    rim = blur(band * facing, 2.0)[..., None] * 0.75
    toned = 1 - (1 - toned) * (1 - rim * (LAVENDER / 255))  # screen blend

    # 7. Fade the lower body into darkness (alpha) so the figure rises out of the scene.
    fade = np.clip((1.0 - yy / h) / 0.30, 0, 1) ** 1.6
    side = np.clip(np.minimum(xx, w - 1 - xx) / (0.08 * w), 0, 1) ** 1.4  # arms cropped by the photo edge dissolve
    alpha = alpha * fade * side

    out_img = Image.fromarray(np.dstack([toned * 255, alpha * 255]).clip(0, 255).astype(np.uint8), "RGBA")
    out_img.save(out, "WEBP", quality=90, method=6)
    print(f"{out}: {w}x{h}")
    if og:  # PNG copy for the Open Graph card (next/og cannot decode WebP)
        small = out_img.resize((round(w * 630 / h), 630), Image.LANCZOS)
        small.save(og, "PNG", optimize=True)
        print(f"{og}: {small.width}x{small.height}")


if __name__ == "__main__":
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    og_path = sys.argv[sys.argv.index("--og") + 1] if "--og" in sys.argv else None
    main(sys.argv[1], sys.argv[2], sys.argv[3], og_path)
