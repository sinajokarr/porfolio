"""Cinematic hero grade for the portrait. Lighting and colour only — facial features are never altered.

Usage: python grade.py <photo> <mask.png> <output.webp> [--og <og-portrait.png>]
Steps: colour matting against the grey wall + guided filter + wall un-mixing → low-key studio tone (colour kept) → soft key light on the face
       → gentle desaturation, cool shadows → lavender rim light from the sculpture side → fade into darkness at the bottom.
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


def box(arr, r):
    """Mean over a (2r+1)^2 window via an integral image."""
    pad = np.pad(arr, ((r + 1, r), (r + 1, r)), mode="edge").cumsum(0).cumsum(1)
    k = 2 * r + 1
    return (pad[k:, k:] - pad[:-k, k:] - pad[k:, :-k] + pad[:-k, :-k]) / (k * k)


def guided(guide, src, r, eps):
    """He et al. guided filter: smooths src while keeping the guide's edges."""
    mg, ms = box(guide, r), box(src, r)
    cov = box(guide * src, r) - mg * ms
    var = box(guide * guide, r) - mg * mg
    a = cov / (var + eps)
    b = ms - a * mg
    return box(a, r) * guide + box(b, r)


def main(photo, mask_path, out, og=None):
    rgb = np.asarray(Image.open(photo).convert("RGB"), dtype=np.float32) / 255
    h, w, _ = rgb.shape
    alpha = np.asarray(Image.open(mask_path).convert("L").resize((w, h), Image.LANCZOS), dtype=np.float32) / 255

    # 1. Matte. Vision's mask is soft and blob-shaped (it is computed at low resolution), so it only decides
    #    "surely person" / "surely wall". Inside the band between the two, alpha comes from colour: the photo was
    #    shot against a smooth grey wall, so distance from the (interpolated) wall colour says how much of a pixel
    #    is person. This follows real hair strands and the ear/jaw line instead of the blob.
    a8 = (alpha * 255).astype(np.uint8)
    # Close small holes first (pale neck skin is close to the wall colour), then erode: everything well inside
    # the person is solid, and only the outer band is decided by colour.
    closed = Image.fromarray(a8).filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.MinFilter(15))
    sure_fg = np.asarray(closed.filter(ImageFilter.MinFilter(11)), dtype=np.float32) / 255 > 0.5
    maybe = np.asarray(Image.fromarray(a8).filter(ImageFilter.MaxFilter(15)), dtype=np.float32) / 255 > 0.02
    bg_known = (~maybe).astype(np.float32)
    wall = np.stack([blur(rgb[..., c] * bg_known, 40) for c in range(3)], -1) / np.maximum(blur(bg_known, 40), 1e-4)[..., None]
    dist = np.sqrt(((rgb - wall) ** 2).sum(-1))
    colour_alpha = np.clip((dist - 0.045) / (0.16 - 0.045), 0, 1)
    # Stray wall noise far from the person is not hair: fade colour alpha out with distance from Vision's mask,
    # and drop isolated specks with a small median.
    near = np.clip(blur(alpha, 6) * 4, 0, 1)
    colour_alpha = np.asarray(Image.fromarray((colour_alpha * near * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(5)), dtype=np.float32) / 255
    alpha = np.where(sure_fg, 1.0, np.where(maybe, colour_alpha, 0.0)).astype(np.float32)
    alpha = guided(rgb.mean(-1), alpha, 4, 1e-3)  # edge-aware smoothing: soft where the photo is soft
    alpha = np.clip((alpha - 0.08) / 0.88, 0, 1) ** 1.15

    # Remove the wall from semi-transparent edge pixels (un-mixing), so no grey halo is left on dark or light pages.
    a3 = np.maximum(alpha, 0.08)[..., None]
    unmixed = np.clip((rgb - (1 - a3) * wall) / a3, 0, 1)
    edge = ((alpha > 0.0) & (alpha < 0.98))[..., None]
    rgb = np.where(edge, unmixed, rgb)
    # The faintest edge pixels borrow colour from the nearby solid hair/skin, so they can never read as a grey haze.
    solid = (alpha > 0.9).astype(np.float32)
    inner = np.stack([blur(rgb[..., c] * solid, 6) for c in range(3)], -1) / np.maximum(blur(solid, 6), 1e-3)[..., None]
    t = np.clip((0.5 - alpha) / 0.5, 0, 1)[..., None] * (blur(solid, 6) > 0.01)[..., None]
    rgb = rgb * (1 - t) + inner * t

    # 2. Luminance with a red-weighted mix (smoother skin); the tone steps below work on it, colour follows.
    lum = rgb[..., 0] * 0.40 + rgb[..., 1] * 0.46 + rgb[..., 2] * 0.14
    lum0 = lum

    # 3. Studio tone: deeper blacks, gentle S-curve, soft key light centred on the face.
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d2 = ((xx / w - FACE_CENTER[0]) / 0.32) ** 2 + ((yy / h - FACE_CENTER[1]) / 0.30) ** 2
    lum = np.clip((lum - 0.03) / 0.97, 0, 1) ** 1.6  # low-key: suit sinks toward charcoal, face holds detail
    lum = lum * (0.70 + 0.30 * np.exp(-d2))  # key light falls off away from the face
    lum = lum * lum * (3 - 2 * lum) * 0.30 + lum * 0.70  # gentle S-curve

    # 3b. Remove the bright-wall "light wrap" around the silhouette (it reads as a halo on a dark scene).
    eroded = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(17)), dtype=np.float32) / 255
    wrap = blur(np.clip(alpha - eroded, 0, 1), 4)
    lum = lum * (1 - 0.25 * wrap)  # matte is clean now; only a light touch

    # 4. Clarity: mild unsharp mask on luminance only.
    lum = np.clip(lum + (lum - blur(lum, 2.2)) * 0.55, 0, 1)

    # 5. Colour: carry the graded luminance back onto the original colours, ease saturation a little,
    #    and let the shadows lean cool so the skin stays natural against the dark, lavender scene.
    ratio = np.clip(lum / np.maximum(lum0, 1e-3), 0, 3)[..., None]
    col = np.clip(rgb * ratio, 0, 1)
    col = lum[..., None] + (col - lum[..., None]) * 0.86
    shade = ((1 - lum) ** 2)[..., None]
    toned = np.clip(col + shade * np.array([-0.012, -0.004, 0.022]), 0, 1)

    # 6. Lavender rim light on silhouette edges that face the light.
    soft = blur(alpha, 3)
    gy, gx = np.gradient(soft)
    mag = np.hypot(gx, gy) + 1e-6
    facing = np.clip((-gx * LIGHT_DIR[0] - gy * LIGHT_DIR[1]) / mag, 0, 1)
    band = np.clip(alpha - blur(np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(13)), dtype=np.float32) / 255, 4), 0, 1)
    rim = blur(band * facing, 3.5)[..., None] * 0.42
    toned = 1 - (1 - toned) * (1 - rim * (LAVENDER / 255))  # screen blend

    # 7. Fade the lower body into darkness (alpha) so the figure rises out of the scene.
    # 7. Editorial bust: the body melts away in a soft oval below the face, so the photo's straight crop lines
    #    (arms cut by the frame, the bottom edge) never show.
    r = np.sqrt(((xx / w - 0.5) / 0.50) ** 2 + ((yy / h - 0.34) / 0.70) ** 2)
    bust = 1 - np.clip((r - 0.70) / 0.32, 0, 1)
    bust = bust * bust * (3 - 2 * bust)
    fade = np.clip((1.0 - yy / h) / 0.34, 0, 1) ** 1.4
    alpha = alpha * bust * fade

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
