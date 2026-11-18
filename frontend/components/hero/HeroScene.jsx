"use client";

import { Environment, Lightformer, MeshTransmissionMaterial, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ribbonGeometry, RingCurve } from "./ribbon";
import { SCENE, sceneLayout } from "./scene";

const easeOutExpo = (x) => (x >= 1 ? 1 : 1 - 2 ** (-10 * x));
const DEG = Math.PI / 180;

/** The graded cut-out on a plane at z = 0. Rings behind it are hidden by his body; rings in front pass over it. */
function Portrait({ layout, onReady }) {
  const texture = useTexture(SCENE.portrait.src, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
  });
  useEffect(() => {
    // Wait two frames so the glass has rendered once before the canvas is revealed.
    let id = requestAnimationFrame(() => (id = requestAnimationFrame(onReady)));
    return () => cancelAnimationFrame(id);
  }, [onReady]);
  return (
    <mesh position={[0, layout.portrait.centerY, 0]} scale={[layout.portrait.width, layout.portrait.height, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={texture} transparent alphaTest={0.01} toneMapped={false} />
    </mesh>
  );
}

function GlassRing({ ring, layout, pointer, quality, still, delay }) {
  const group = useRef(null);
  const band = useRef(null);
  const geometry = useMemo(
    () =>
      ribbonGeometry(new RingCurve(), {
        segments: quality === "high" ? 360 : 200,
        radial: quality === "high" ? 20 : 12,
        width: ring.width,
        thickness: ring.thickness,
      }),
    [ring, quality],
  );
  const tilt = -(90 - ring.tiltDeg) * DEG;
  const scale = layout.ringScale * ring.radius;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || still) return;
    const enter = easeOutExpo(Math.max(0, Math.min((state.clock.elapsedTime - delay) / 2.4, 1)));
    band.current.rotation.z += delta * ring.speed; // slow orbit: the twisted band travels around him
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tilt + pointer.current.y * SCENE.parallax.pitch, 2.5, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ring.yaw + pointer.current.x * SCENE.parallax.yaw, 2.5, delta);
    g.position.y = layout.ringY - (1 - enter) * 0.6;
    g.scale.setScalar(scale * (0.88 + 0.12 * enter));
  });

  return (
    // Euler "YXZ": the band spins in its own plane, is tilted (X), then yawed (Y) — same order as the face test.
    <group ref={group} rotation={[tilt, ring.yaw, 0, "YXZ"]} position={[0, layout.ringY, 0]} scale={still ? scale : scale * 0.88}>
      <mesh ref={band} geometry={geometry}>
        <MeshTransmissionMaterial
          samples={quality === "high" ? 6 : 3}
          resolution={quality === "high" ? 768 : 384}
          transmission={1}
          thickness={0.35}
          roughness={0.04}
          ior={1.45}
          chromaticAberration={0.08}
          anisotropy={0.25}
          distortion={0.1}
          distortionScale={0.4}
          temporalDistortion={still ? 0 : 0.04}
          clearcoat={1}
          clearcoatRoughness={0.05}
          attenuationDistance={1.2}
          attenuationColor="#cfd0ff"
          color="#f2f2ff"
          envMapIntensity={1.5}
          background={new THREE.Color("#07080b")}
        />
      </mesh>
    </group>
  );
}

/** Studio lighting from emissive cards only — no HDR download, no network dependency. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#050608"]} />
      <Lightformer intensity={3.2} position={[0, 4, -2]} scale={[10, 1.2, 1]} />
      <Lightformer intensity={2.2} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[8, 0.6, 1]} />
      <Lightformer intensity={1.6} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[8, 0.5, 1]} />
      <Lightformer intensity={2.4} color="#a9a8ff" position={[3, 2, 3]} form="ring" scale={2.4} />
      <Lightformer intensity={1.2} color="#7f87f7" position={[-3, -3, 2]} scale={[6, 2, 1]} />
      <Lightformer intensity={4} position={[0, -5, 0]} rotation-x={Math.PI / 2} scale={[12, 3, 1]} />
    </Environment>
  );
}

function Scene({ quality, still, onReady }) {
  const viewport = useThree((s) => s.viewport);
  const layout = useMemo(() => sceneLayout(viewport.width, viewport.height), [viewport.width, viewport.height]);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (still) return;
    const move = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [still]);

  return (
    <>
      <Studio />
      <Suspense fallback={null}>
        <Portrait layout={layout} onReady={onReady} />
      </Suspense>
      {SCENE.rings.map((ring, i) => (
        <GlassRing key={i} ring={ring} layout={layout} pointer={pointer} quality={quality} still={still} delay={0.15 + i * 0.25} />
      ))}
    </>
  );
}

export default function HeroScene({ active, still, quality = "high", onReady }) {
  return (
    <Canvas
      frameloop={!active ? "never" : still ? "demand" : "always"}
      dpr={quality === "high" ? [1, 1.75] : [1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ position: [0, 0, SCENE.camera.z], fov: SCENE.camera.fov }}
      aria-hidden="true"
    >
      <Scene quality={quality} still={still} onReady={onReady} />
    </Canvas>
  );
}
