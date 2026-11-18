(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,69340,e=>{"use strict";let t=`
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPtr;

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

vec3 env(vec3 d){
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
  vec3 col = env(r) * mix(vec3(0.72, 0.73, 0.80), vec3(1.0), fres);
  float ao = clamp(sdf(p + n * 0.18) / 0.18, 0.0, 1.0);
  col *= 0.45 + 0.55 * ao;

  col = 1.0 - exp(-col * 1.35);   // soft filmic roll-off, no clipped highlights
  col = pow(col, vec3(1.0 / 2.2));
  col *= 0.88;                    // sits a step behind the portrait

  // Dissolve toward the bottom of the frame, like the portrait.
  alpha *= smoothstep(0.0, 0.3, gl_FragCoord.y / uRes.y);
  gl_FragColor = vec4(col * alpha, alpha);
}`;e.s(["mountSculpture",0,function(e,{pointer:o={x:0,y:0},still:r=!1,time:a=0,onFirstFrame:i}={}){let n=e.getContext("webgl",{alpha:!0,premultipliedAlpha:!0,antialias:!1,preserveDrawingBuffer:r});if(!n)return null;let s=(e,t)=>{let o=n.createShader(e);if(n.shaderSource(o,t),n.compileShader(o),!n.getShaderParameter(o,n.COMPILE_STATUS))throw Error(n.getShaderInfoLog(o));return o},l=n.createProgram();n.attachShader(l,s(n.VERTEX_SHADER,"attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}")),n.attachShader(l,s(n.FRAGMENT_SHADER,t)),n.linkProgram(l),n.useProgram(l),n.bindBuffer(n.ARRAY_BUFFER,n.createBuffer()),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let c=n.getUniformLocation(l,"uRes"),d=n.getUniformLocation(l,"uTime"),h=n.getUniformLocation(l,"uPtr"),f=()=>{let t=Math.min(window.devicePixelRatio||1,1.25);e.width=Math.round(e.clientWidth*t),e.height=Math.round(e.clientHeight*t),n.viewport(0,0,e.width,e.height)},m=t=>{n.uniform2f(c,e.width,e.height),n.uniform1f(d,t),n.uniform2f(h,o.x,o.y),n.drawArrays(n.TRIANGLES,0,3)};if(f(),r)return m(a),()=>{};let p=0,u=!0,v=!0,g=performance.now(),x=e=>{m((e-g)/1e3),v&&(v=!1,i?.()),p=u?requestAnimationFrame(x):0},y=new IntersectionObserver(([e])=>{(u=e.isIntersecting)&&!p&&(p=requestAnimationFrame(x))}),b=new ResizeObserver(f);return y.observe(e),b.observe(e),p=requestAnimationFrame(x),()=>{cancelAnimationFrame(p),y.disconnect(),b.disconnect(),n.getExtension("WEBGL_lose_context")?.loseContext()}}])}]);