/**
 * Hero composition: Sina's portrait on a plane at z = 0, two concentric glass rings orbiting at chest height.
 * Concentric rings with different radii can never intersect each other; both pierce the portrait plane
 * outside the photo, so they read as going *around* him. tests/unit/scene.test.js checks that no ring
 * ever passes in front of the face for any spin angle or pointer position.
 */
export const SCENE = {
  camera: { z: 5.4, fov: 38 },
  portrait: { src: "/hero-portrait.webp", aspect: 796 / 1038, height: 0.8 }, // height: fraction of canvas height
  ringCenter: 0.74, // from the portrait's top edge, as a fraction of its height (mid-chest)
  narrowScale: 0.86, // rings shrink on canvases narrower than 0.9:1 (phones)
  parallax: { yaw: 0.06, pitch: 0.06 }, // max pointer-driven rotation (radians)
  rings: [
    { radius: 0.7, tiltDeg: 16, yaw: 0.18, speed: 0.12, width: 0.09, thickness: 0.03 },
    { radius: 0.62, tiltDeg: 10, yaw: -0.26, speed: -0.09, width: 0.075, thickness: 0.026 },
  ],
  // Face region inside the portrait image (fractions of width/height) — rings must stay clear of it.
  face: { x0: 0.25, x1: 0.72, y0: 0.04, y1: 0.53 },
};

/** World-space layout at z = 0 for a viewport of `height` × `width` world units. */
export function sceneLayout(width, height) {
  const ph = height * SCENE.portrait.height;
  const pw = ph * SCENE.portrait.aspect;
  const top = -height / 2 + ph;
  return {
    portrait: { width: pw, height: ph, centerY: top - ph / 2, top },
    ringY: top - SCENE.ringCenter * ph,
    ringScale: pw * (width / height < 0.9 ? SCENE.narrowScale : 1),
  };
}
