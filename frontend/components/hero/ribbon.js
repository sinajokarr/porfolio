import * as THREE from "three";

/** Unit circle in the XY plane. */
export class RingCurve extends THREE.Curve {
  getPoint(t, target = new THREE.Vector3()) {
    const a = t * Math.PI * 2;
    return target.set(Math.cos(a), Math.sin(a), 0);
  }
}

/**
 * A flat, rounded glass band swept along a closed curve, twisting `twists` half-turns.
 * Even `twists` keeps the seam aligned so rings wrap without duplicate vertices (smooth normals).
 */
export function ribbonGeometry(curve, { segments = 360, radial = 20, width = 0.09, thickness = 0.03, twists = 2 } = {}) {
  const frames = curve.computeFrenetFrames(segments, true);
  const pos = new Float32Array(segments * radial * 3);
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  const b = new THREE.Vector3();

  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    curve.getPoint(t, p);
    const twist = t * Math.PI * twists;
    // Width breathes slightly along the loop so it reads as hand-sculpted rather than extruded.
    const w = width * (0.85 + 0.15 * Math.cos(t * Math.PI * 4));
    const ct = Math.cos(twist);
    const st = Math.sin(twist);
    for (let j = 0; j < radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      // Superellipse cross-section: flat faces, softly rounded edges.
      const c = Math.cos(a);
      const s = Math.sin(a);
      const u = Math.sign(c) * Math.abs(c) ** 0.6 * w;
      const v = Math.sign(s) * Math.abs(s) ** 0.6 * thickness;
      n.copy(frames.normals[i]).multiplyScalar(u * ct - v * st);
      b.copy(frames.binormals[i]).multiplyScalar(u * st + v * ct);
      const k = (i * radial + j) * 3;
      pos[k] = p.x + n.x + b.x;
      pos[k + 1] = p.y + n.y + b.y;
      pos[k + 2] = p.z + n.z + b.z;
    }
  }

  const index = [];
  for (let i = 0; i < segments; i++) {
    const i2 = (i + 1) % segments;
    for (let j = 0; j < radial; j++) {
      const j2 = (j + 1) % radial;
      const a = i * radial + j;
      const b1 = i2 * radial + j;
      const c = i2 * radial + j2;
      const d = i * radial + j2;
      index.push(a, b1, d, b1, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setIndex(index);
  geo.computeVertexNormals();
  return geo;
}
