import { describe, expect, it } from "vitest";
import { SCENE, sceneLayout } from "@/components/hero/scene";

/**
 * Pure-math replica of the hero scene (same transform order as HeroScene: spin Z → tilt X → yaw Y,
 * perspective camera). Guards Sina's face: no glass ring may ever pass in front of it.
 */
const { z: CAM_Z, fov } = SCENE.camera;
const H = 2 * CAM_Z * Math.tan(((fov / 2) * Math.PI) / 180);

function sweep(aspect, visit) {
  const L = sceneLayout(H * aspect, H);
  const { width: pw, height: ph, top } = L.portrait;
  for (const ring of SCENE.rings) {
    const rho = ring.radius * L.ringScale;
    const half = ring.width * rho; // worst case: band twisted to face the camera
    for (const dy of [-1, 0, 1]) for (const dx of [-1, 0, 1]) {
      const a = (-(90 - ring.tiltDeg) * Math.PI) / 180 + dy * SCENE.parallax.pitch;
      const b = ring.yaw + dx * SCENE.parallax.yaw;
      for (let i = 0; i < 720; i++) {
        const t = (i / 720) * 2 * Math.PI;
        let [x, y, z] = [Math.cos(t) * rho, Math.sin(t) * rho, 0];
        [y, z] = [y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
        [x, z] = [x * Math.cos(b) + z * Math.sin(b), -x * Math.sin(b) + z * Math.cos(b)];
        y += L.ringY;
        const k = CAM_Z / (CAM_Z - z);
        visit({ xs: x * k, ys: y * k, z, half: half * k, pw, ph, top, first: i === 0 });
      }
    }
  }
}

describe("hero scene", () => {
  it.each([["desktop", 1], ["phone", 0.75]])("rings never cross in front of the face (%s)", (_, aspect) => {
    const f = SCENE.face;
    sweep(aspect, ({ xs, ys, z, half, pw, ph, top }) => {
      if (z <= 0) return; // behind the portrait: hidden by his body
      const overlapsX = xs + half > -pw / 2 + f.x0 * pw && xs - half < -pw / 2 + f.x1 * pw;
      if (overlapsX) expect(ys + half).toBeLessThan(top - f.y1 * ph); // stays below the chin
    });
  });

  it("rings pass behind him outside the photo, so they read as orbiting rather than piercing", () => {
    let prev = null;
    sweep(1, (p) => {
      if (prev && !p.first && Math.sign(prev.z) !== Math.sign(p.z)) expect(Math.abs(p.xs)).toBeGreaterThan(0.5 * p.pw);
      prev = p;
    });
  });

  it("rings fit the desktop canvas", () => {
    sweep(1, ({ xs, half }) => expect(Math.abs(xs) + half).toBeLessThanOrEqual(H / 2 + 1e-6));
  });
});
