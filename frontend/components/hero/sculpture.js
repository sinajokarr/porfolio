/**
 * Chrome sculpture behind the hero portrait: one twisted, slowly breathing chrome ribbon, ray-marched in a
 * single fragment shader and lit by a procedural studio (overhead soft-box, silver horizon, lavender strip light).
 * Plain WebGL 1, no dependencies. The same shader renders the static fallback image
 * (public/hero-sculpture.webp, see scripts/sculpture/render-still.cjs), so live and still match at t = 0.
 */

const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPtr;
uniform float uLight; // 0 = night studio, 1 = day studio (light mode)

mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

// Twisted ribbon: a torus whose stadium-shaped cross-section rolls 1.5 turns per loop.
float sdf(vec3 p){
  p.xz *= rot(0.10 * uPtr.x + 0.28 * sin(uTime * 0.05));
  p.yz *= rot(1.05 + 0.06 * uPtr.y + 0.07 * sin(uTime * 0.13));
  p.xy *= rot(-0.42 + 0.05 * sin(uTime * 0.09));
  float a = atan(p.z, p.x);
  float R = 1.0 + 0.09 * sin(2.0 * a + uTime * 0.31) + 0.045 * sin(3.0 * a - uTime * 0.23);
  vec2 q = vec2(length(p.xz) - R, p.y);
  q *= rot(1.5 * a + uTime * 0.16);
  q.x -= clamp(q.x, -0.19, 0.19);
  return length(q) - 0.045;
}

vec3 normalAt(vec3 p){
  const vec2 e = vec2(0.0015, -0.0015);
  return normalize(e.xyy * sdf(p + e.xyy) + e.yyx * sdf(p + e.yyx) + e.yxy * sdf(p + e.yxy) + e.xxx * sdf(p + e.xxx));
}

vec3 envNight(vec3 d){
  vec3 col = mix(vec3(0.006, 0.007, 0.014), vec3(0.040, 0.041, 0.065), smoothstep(-0.8, 0.8, d.y));
  // Crisp silver horizon: the line that makes metal read as chrome.
  col += vec3(0.80, 0.81, 0.88) * exp(-pow((d.y + 0.04) * 16.0, 2.0)) * 0.9;
  col += vec3(0.30, 0.31, 0.38) * exp(-pow((d.y + 0.04) * 4.0, 2.0)) * 0.25;
  // Rectangular soft-box overhead, drifting slowly left and right (the gentle lighting transition).
  float sx = d.x - 0.35 * sin(uTime * 0.06);
  float box = smoothstep(0.62, 0.74, d.y) * (1.0 - smoothstep(0.22, 0.34, abs(sx))) * smoothstep(-0.5, 0.2, d.z);
  col += vec3(1.0) * box * 1.8;
  // Lavender-blue strip light on the right, tall and narrow.
  float side = smoothstep(0.90, 0.985, dot(normalize(vec3(d.x, 0.0, d.z) + 1e-4), normalize(vec3(1.0, 0.0, -0.1))));
  col += vec3(0.62, 0.62, 1.0) * side * smoothstep(0.8, 0.1, abs(d.y - 0.15)) * 1.2;
  // Faint cool fill from the left so the shadow side never goes flat.
  col += vec3(0.30, 0.34, 0.50) * smoothstep(0.6, 1.0, dot(d, normalize(vec3(-1.0, 0.2, 0.5)))) * 0.25;
  return col;
}

// Day studio: bright cyclorama, one dark horizon band (chrome needs a dark line to read as metal), soft-box, lavender strip.
vec3 envDay(vec3 d){
  vec3 col = mix(vec3(0.14, 0.15, 0.20), vec3(0.95, 0.95, 0.98), smoothstep(-0.35, 0.45, d.y));
  col -= vec3(0.55, 0.55, 0.50) * exp(-pow((d.y + 0.02) * 9.0, 2.0));
  col = max(col, vec3(0.02));
  float sx = d.x - 0.35 * sin(uTime * 0.06);
  col += vec3(1.3) * smoothstep(0.62, 0.74, d.y) * (1.0 - smoothstep(0.22, 0.34, abs(sx))) * smoothstep(-0.5, 0.2, d.z);
  float side = smoothstep(0.90, 0.985, dot(normalize(vec3(d.x, 0.0, d.z) + 1e-4), normalize(vec3(1.0, 0.0, -0.1))));
  col = mix(col, vec3(0.50, 0.50, 0.95), side * smoothstep(0.8, 0.1, abs(d.y - 0.15)) * 0.7);
  return col;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y - vec2(0.06, 0.05);
  vec3 ro = vec3(0.0, 0.0, 4.6);
  vec3 rd = normalize(vec3(uv, -1.3));

  // Bounding sphere: most pixels are empty and leave here.
  float b = dot(ro, rd), c = dot(ro, ro) - 2.4;
  float h = b * b - c;
  if (h < 0.0) { gl_FragColor = vec4(0.0); return; }

  float t = -b - sqrt(h), tEnd = -b + sqrt(h);
  float best = 1e9, tBest = t;
  for (int i = 0; i < 96; i++) {
    float d = sdf(ro + rd * t);
    float ratio = d / t;
    if (ratio < best) { best = ratio; tBest = t; }
    if (d < 0.0007 || t > tEnd) break;
    t += d * 0.72;
  }

  // Anti-aliased silhouette from the ray's closest approach (no MSAA needed).
  float px = 1.6 / uRes.y;
  float alpha = 1.0 - smoothstep(0.0, px, best);
  if (alpha <= 0.0) { gl_FragColor = vec4(0.0); return; }

  vec3 p = ro + rd * tBest;
  vec3 n = normalAt(p);
  vec3 r = reflect(rd, n);
  float fres = pow(1.0 - max(dot(n, -rd), 0.0), 5.0);
  vec3 col = mix(envNight(r), envDay(r), uLight) * mix(vec3(0.72, 0.73, 0.80), vec3(1.0), fres);
  float ao = clamp(sdf(p + n * 0.18) / 0.18, 0.0, 1.0);
  col *= 0.45 + 0.55 * ao;

  col = 1.0 - exp(-col * 1.35);   // soft filmic roll-off, no clipped highlights
  col = pow(col, vec3(mix(1.0 / 2.2, 1.0 / 1.5, uLight))); // day keeps deeper darks so it still reads as chrome
  col *= mix(0.88, 0.97, uLight);  // sits a step behind the portrait

  // Dissolve toward the bottom of the frame, like the portrait.
  alpha *= smoothstep(0.0, 0.3, gl_FragCoord.y / uRes.y);
  gl_FragColor = vec4(col * alpha, alpha);
}`;

/**
 * Render the sculpture into `canvas`. `pointer` is a {x, y} object (-1…1) read every frame.
 * still: draw one frame at `time` seconds and stop (used to export the fallback image).
 * Returns a cleanup function, or null when WebGL is unavailable.
 */
export function mountSculpture(canvas, { pointer = { x: 0, y: 0 }, still = false, time = 0, light, onFirstFrame } = {}) {
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: still });
  if (!gl) return null;

  const shader = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(prog, "uRes");
  const uTime = gl.getUniformLocation(prog, "uTime");
  const uPtr = gl.getUniformLocation(prog, "uPtr");
  const uLight = gl.getUniformLocation(prog, "uLight");

  // ponytail: DPR capped at 1.25 — the chrome sits behind the photo; raise it if edges look soft on 4K.
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  // Day/night follows the page theme, eased so the metal re-lights smoothly while the theme circle spreads.
  let day = light ?? (document.documentElement.classList.contains("light") ? 1 : 0);
  const draw = (seconds) => {
    if (light === undefined) day += ((document.documentElement.classList.contains("light") ? 1 : 0) - day) * 0.08;
    gl.uniform1f(uLight, day);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, seconds);
    gl.uniform2f(uPtr, pointer.x, pointer.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  resize();
  if (still) {
    draw(time);
    return () => {};
  }

  let raf = 0, visible = true, first = true;
  const start = performance.now();
  const loop = (now) => {
    draw((now - start) / 1000);
    if (first) { first = false; onFirstFrame?.(); }
    raf = visible ? requestAnimationFrame(loop) : 0;
  };
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(loop);
  });
  const ro = new ResizeObserver(resize);
  io.observe(canvas);
  ro.observe(canvas);
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}
