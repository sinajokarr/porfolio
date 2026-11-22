/* ===== Chapter One: Vadi — shared library (helpers, film look, characters, props) ===== */
const W = 1920, H = 1080, NS = 'http://www.w3.org/2000/svg';
const $ = id => document.getElementById(id);
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const easeOut = x => 1 - Math.pow(1 - x, 3);
const easeIn = x => x * x * x;
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const smooth = x => x * x * (3 - 2 * x);
const pulse = (t, c, w) => Math.exp(-((t - c) ** 2) / w);
let _seed = 77; const rnd = () => (_seed = (_seed * 16807) % 2147483647) / 2147483647;
let _uid = 0; const uid = p => p + (++_uid);
const add = (p, html) => { p.insertAdjacentHTML('beforeend', html); return p.lastElementChild; };
const q = (g, c) => g.querySelector('.' + c);
const tr = (x, y, s = 1, r = 0) => `translate(${x},${y}) rotate(${r}) scale(${s})`;
const disp = (e, v) => e.setAttribute('display', v ? 'inline' : 'none');
const D2R = Math.PI / 180;
const blinkLoop = (t, ph = 0, per = 3.7) => { const p = (t + ph) % per; return p < .16 ? Math.abs(p - .08) / .08 : 1; };

/* ---------- palette / cast ---------- */
const CAST = {
  girl:   { skin: '#e8bf9d', shade: '#c18b6c', hair: '#141118', hairHi: '#4b4458', eye: '#3a2216', brow: '#1a1214', lip: '#b9555f', sex: 'f', hairStyle: 'long',
            top: '#f7f5f2', topShade: '#d9d4cc', bottom: '#8fb0d6', bottomShade: '#6d8fb8', legCover: .3, shoe: '#ffffff', sleeve: .42, sw: 54 },
  friend: { skin: '#f4d6c3', shade: '#d4a68c', hair: '#e2c98a', hairHi: '#f5e3b2', eye: '#7d8b99', brow: '#c9ae70', lip: '#c98a80', sex: 'm', hairStyle: 'short',
            top: '#9fd2f2', topShade: '#79b2d6', bottom: '#b3cbe4', bottomShade: '#8fabc8', legCover: 1, shoe: '#a7774f', sleeve: .95, sw: 62, shirt: 1 },
  reza:   { skin: '#f2d1ba', shade: '#d3a48a', hair: '#d8b468', hairHi: '#f2d9a0', eye: '#c58a2a', brow: '#bf9a55', lip: '#c88c80', sex: 'm', hairStyle: 'bun', beard: '#cfa962', beardHi: '#e9cd8e',
            top: '#1e1f24', topShade: '#121216', bottom: '#cbb690', bottomShade: '#a99470', legCover: .82, shoe: '#f4f4f2', sleeve: .45, sw: 70, tatR: 1, tatLegR: 1 },
  mobin:  { skin: '#d6a47e', shade: '#ad7c58', hair: '#1c1714', hairHi: '#3d342e', eye: '#3c2618', brow: '#1c1714', lip: '#a8705e', sex: 'm', hairStyle: 'crop', glasses: 1,
            top: '#3a3d45', topShade: '#2a2c33', bottom: '#3d5f92', bottomShade: '#2e4a75', legCover: 1, shoe: '#1d1d22', sleeve: .45, sw: 66, tatL: 1 },
};
CAST.rezaHome = Object.assign({}, CAST.reza, { top: '#2b2f38', topShade: '#1e2128', bottom: '#2b2f38', bottomShade: '#1e2128', shirt: 1, sleeve: 1.15 });
CAST.vikingReza = Object.assign({}, CAST.reza, { top: '#5a3b26', topShade: '#3f2918', bottom: '#4a3a2c', bottomShade: '#33281e', legCover: 1, shoe: '#3b2a1e', sleeve: .5, viking: 1 });
CAST.vikingGirl = Object.assign({}, CAST.girl, { top: '#1d2f5e', topShade: '#14214a', bottom: '#1d2f5e', bottomShade: '#14214a', legCover: 1, shoe: '#3b2a1e', sleeve: 1.1, dress: 1, viking: 1 });

/* ---------- global defs ---------- */
function globalDefs(svg) {
  add(svg, `<defs>
   <path id="heartP" d="M0,0.9 C-0.6,0.45 -1,0.1 -1,-0.3 C-1,-0.75 -0.55,-1 -0.25,-0.85 C-0.1,-0.78 0,-0.65 0,-0.6 C0,-0.65 0.1,-0.78 0.25,-0.85 C0.55,-1 1,-0.75 1,-0.3 C1,0.1 0.6,0.45 0,0.9Z"/>
   <path id="starP" d="M0,-1 Q0.1,-0.1 1,0 Q0.1,0.1 0,1 Q-0.1,0.1 -1,0 Q-0.1,-0.1 0,-1Z"/>
   <radialGradient id="softGlow"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
   <radialGradient id="warmGlow"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".85"/><stop offset="1" stop-color="#ffb35c" stop-opacity="0"/></radialGradient>
   <radialGradient id="pinkGlow"><stop offset="0" stop-color="#ff7aa8" stop-opacity=".95"/><stop offset="1" stop-color="#ff7aa8" stop-opacity="0"/></radialGradient>
   <radialGradient id="cyanGlow"><stop offset="0" stop-color="#bff6ff" stop-opacity=".9"/><stop offset="1" stop-color="#7fd8ff" stop-opacity="0"/></radialGradient>
   <linearGradient id="champ" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe0bd"/><stop offset=".45" stop-color="#d4bd8f"/><stop offset=".55" stop-color="#bda372"/><stop offset="1" stop-color="#9c8458"/></linearGradient>
   <linearGradient id="glassDark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a4656"/><stop offset=".5" stop-color="#1b222c"/><stop offset="1" stop-color="#2c3644"/></linearGradient>
  </defs>`);
}
/* blur filter whose strength can be animated */
function blurFilter(defs, id) { const f = add(defs, `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="0"/></filter>`); const gb = f.firstElementChild; return v => gb.setAttribute('stdDeviation', v.toFixed(2)); }

/* ================= FACE (single source of truth for every shot) ================= */
function Face(parent, who, o = {}) {
  const c = CAST[who]; const F = c.sex === 'f';
  const id = uid('f');
  const faceD = F ? 'M-60,-10 C-62,-72 -38,-100 0,-100 C38,-100 62,-72 60,-10 C58,32 38,72 0,88 C-38,72 -58,32 -60,-10Z'
    : 'M-64,-10 C-66,-74 -40,-102 0,-102 C40,-102 66,-74 64,-10 C63,34 50,70 20,88 Q0,95 -20,88 C-50,70 -63,34 -64,-10Z';
  const long = c.hairStyle === 'long';
  const g = add(parent, `<g>
   <defs>
    <radialGradient id="${id}sk" cx=".38" cy=".35" r=".8"><stop offset="0" stop-color="${c.skin}"/><stop offset=".7" stop-color="${c.skin}"/><stop offset="1" stop-color="${c.shade}"/></radialGradient>
    <linearGradient id="${id}hr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.hairHi}"/><stop offset=".35" stop-color="${c.hair}"/><stop offset="1" stop-color="${c.hair}"/></linearGradient>
    <clipPath id="${id}cl"><path d="M-17,0 C-10,-9 10,-10 17,-1 C10,6 -10,7 -17,0Z"/></clipPath>
    <clipPath id="${id}fc"><path d="${faceD}"/></clipPath>
   </defs>
   <g class="backHair">${long ? `<path class="bh" fill="url(#${id}hr)"/>` : ''}
     ${c.hairStyle === 'bun' ? `<g class="bunF"><ellipse cx="0" cy="-104" rx="20" ry="14" fill="${c.hair}"/></g>` : ''}</g>
   <g class="front">
    <ellipse cx="-61" cy="2" rx="9" ry="16" fill="${c.skin}"/><ellipse cx="61" cy="2" rx="9" ry="16" fill="${c.shade}"/>
    <path d="${faceD}" fill="url(#${id}sk)"/>
    <g clip-path="url(#${id}fc)"><path d="M30,-90 C70,-40 64,40 10,92 L80,92 L80,-100Z" fill="${c.shade}" opacity=".32"/><ellipse cx="0" cy="-70" rx="70" ry="22" fill="${c.shade}" opacity=".18"/></g>
    ${F ? `<ellipse cx="-34" cy="28" rx="13" ry="7" fill="#f08a8f" opacity=".22"/><ellipse cx="34" cy="28" rx="13" ry="7" fill="#f08a8f" opacity=".18"/>` : ''}
    <g class="feat">
     <path class="brows" stroke="${c.brow}" stroke-width="${F ? 5 : 6}" fill="none" stroke-linecap="round"/>
     ${[-1, 1].map(s => `<g class="eye${s < 0 ? 'L' : 'R'}" transform="translate(${s * 25},-6)">
        <path d="M-14,-9 C-4,-15 8,-15 15,-8" stroke="${c.shade}" stroke-width="2" fill="none" opacity=".7" class="crease"/>
        <g class="ball"><path d="M-17,0 C-10,-9 10,-10 17,-1 C10,6 -10,7 -17,0Z" fill="#fbf7f2"/>
         <g clip-path="url(#${id}cl)"><g class="iris"><circle r="7.6" fill="${c.eye}"/><circle r="7.6" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/><circle class="pup" r="3.4" fill="#0c0806"/>
          <g class="hrt" display="none"><circle r="9" fill="url(#pinkGlow)"/><use href="#heartP" transform="scale(5.2)" fill="#ff4f8b"/></g>
          <circle cx="2.6" cy="-2.8" r="1.9" fill="#fff"/><circle cx="-2.4" cy="2.4" r=".9" fill="#fff" opacity=".8"/></g>
          <path d="M-17,0 C-10,-9 10,-10 17,-1 L17,-12 L-17,-12Z" fill="#000" opacity=".12"/></g></g>
        <path class="lid" d="M-18,1 C-10,-10 10,-11 18,-2" stroke="#1a1012" stroke-width="${F ? 3.6 : 2.8}" fill="none" stroke-linecap="round"/>
        ${F ? `<path class="lash" d="${s < 0 ? 'M-18,1 l-5,-3' : 'M18,-2 l5,-4'}" stroke="#1a1012" stroke-width="2.6" stroke-linecap="round"/>` : ''}
        <path class="low" d="M-13,4 C-5,8 6,8 14,3" stroke="${c.shade}" stroke-width="1.6" fill="none" opacity=".7"/></g>`).join('')}
     <path d="M-3,14 Q-7,30 -3,35 Q2,38 8,34" stroke="${c.shade}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
     <ellipse cx="-5" cy="35" rx="3.2" ry="1.8" fill="${c.shade}" opacity=".8"/><ellipse cx="7" cy="35" rx="3.2" ry="1.8" fill="${c.shade}" opacity=".8"/>
     ${c.beard ? `<path class="beard" fill="${c.beard}"/>
       <path class="beardStr" stroke="${c.beardHi}" stroke-width="1.6" fill="none" opacity=".7"/>
       <path d="M-24,44 Q-12,35 0,40 Q12,35 24,44 Q13,49 0,45 Q-13,49 -24,44Z" fill="${c.beard}"/><path d="M-24,44 Q-12,35 0,40 Q12,35 24,44" stroke="${c.beardHi}" stroke-width="1.2" fill="none" opacity=".8"/>` : ''}
     <g class="mouth"><path class="mOpen" fill="#5a2128"/><path class="teeth" fill="#fff"/><path class="lipU" fill="${c.lip}"/><path class="lipL" fill="${c.lip}"/><path class="mLine" stroke="#6b2f33" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <ellipse class="lipHi" cx="3" cy="57" rx="5" ry="1.6" fill="#fff" opacity="${F ? .35 : .12}"/></g>
    </g>
    <path class="frontHair" fill="url(#${id}hr)"/>
    <path class="hairStr" stroke="${c.hairHi}" stroke-width="2.4" fill="none" opacity=".55" stroke-linecap="round"/>
    ${c.glasses ? `<g class="glasses"><rect x="-47" y="-22" width="42" height="31" rx="9" fill="#cfe8ff" fill-opacity=".08" stroke="#0d0d10" stroke-width="6.5"/><rect x="5" y="-22" width="42" height="31" rx="9" fill="#cfe8ff" fill-opacity=".08" stroke="#0d0d10" stroke-width="6.5"/>
      <path d="M-5,-10 Q0,-14 5,-10 M-47,-14 L-62,-10 M47,-14 L62,-10" stroke="#0d0d10" stroke-width="5" fill="none"/><path d="M-40,-16 L-30,-16 M12,-16 L22,-16" stroke="#fff" stroke-width="2" opacity=".5"/></g>` : ''}
   </g>
   <g class="backView" display="none"><path class="bvHair" fill="url(#${id}hr)"/>${c.hairStyle === 'bun' ? `<ellipse cx="0" cy="30" rx="24" ry="20" fill="${c.hair}"/><ellipse cx="0" cy="30" rx="24" ry="20" fill="url(#${id}hr)" opacity=".6"/><rect x="-18" y="8" width="36" height="7" rx="3.5" fill="#2a2420"/>` : ''}
     <path class="bvStr" stroke="${c.hairHi}" stroke-width="2.4" fill="none" opacity=".45"/></g>
  </g>`);
  const P = {}; ['backHair', 'bh', 'front', 'feat', 'brows', 'eyeL', 'eyeR', 'mouth', 'mOpen', 'teeth', 'lipU', 'lipL', 'mLine', 'frontHair', 'hairStr', 'beard', 'beardStr', 'backView', 'bvHair', 'bvStr', 'lipHi'].forEach(k => P[k] = q(g, k));
  const eyes = [P.eyeL, P.eyeR].map(e => ({ e, ball: q(e, 'ball'), iris: q(e, 'iris'), lid: q(e, 'lid'), lash: q(e, 'lash'), low: q(e, 'low'), pup: q(e, 'pup'), hrt: q(e, 'hrt'), crease: q(e, 'crease') }));
  return {
    g, P, set(d) {
      d = Object.assign({ lookX: 0, lookY: 0, blink: 1, smile: .2, open: 0, brow: 0, heart: 0, turn: 0, wind: 0, t: 0, back: 0, squint: 0 }, d);
      disp(P.front, !d.back); disp(P.backView, d.back);
      const w = d.wind, tw = Math.sin(d.t * 2.3) * w;
      // hair shapes (wind sways the long ends)
      if (c.hairStyle === 'long') {
        const L = 330, e1 = 6 * tw, e2 = 9 * Math.sin(d.t * 2.3 + 1) * w;
        P.bh.setAttribute('d', `M-70,-40 C-82,-112 82,-112 70,-40 C76,60 84,200 ${86 + e2},${L} Q${60 + e2},${L + 18} ${36 + e2},${L - 6} L30,110 L-30,110 L${-36 + e1},${L - 6} Q${-60 + e1},${L + 18} ${-86 + e1},${L} C-84,200 -76,60 -70,-40Z`);
        P.frontHair.setAttribute('d', `M-68,-16 C-74,-100 -18,-116 10,-110 C52,-104 74,-72 68,-16 C66,60 66,170 ${60 + e2},${L - 20} L${42 + e2},${L - 24} C48,180 50,70 46,-8 C40,-60 24,-80 6,-84 C-14,-66 -40,-46 -50,-14 C-52,70 -50,180 ${-44 + e1},${L - 24} L${-62 + e1},${L - 20} C-66,170 -66,60 -68,-16Z`);
        P.hairStr.setAttribute('d', `M-40,-90 Q-10,-108 30,-98 M-58,-30 C-60,60 -58,160 ${-54 + e1},${L - 40} M56,-30 C58,60 58,160 ${54 + e2},${L - 40} M-20,-96 Q10,-104 46,-84`);
        P.bvHair.setAttribute('d', `M-70,-60 C-84,-118 84,-118 70,-60 C80,60 86,200 ${86 + e2},${L} Q0,${L + 30} ${-86 + e1},${L} C-86,200 -80,60 -70,-60Z`);
        P.bvStr.setAttribute('d', `M-40,-80 C-50,40 -46,200 ${-40 + e1},${L - 10} M0,-100 C2,60 0,200 0,${L} M40,-80 C50,40 46,200 ${40 + e2},${L - 10}`);
      } else if (c.hairStyle === 'bun') {
        P.frontHair.setAttribute('d', `M-66,-20 C-72,-100 -30,-118 0,-116 C30,-118 72,-100 66,-20 C62,-58 44,-80 6,-84 C-30,-82 -58,-62 -66,-20Z M-64,-24 C-70,0 -68,14 ${-62 + tw * 4},26 L-58,0Z`);
        P.hairStr.setAttribute('d', 'M-50,-70 Q-20,-96 0,-100 M-30,-84 Q0,-104 30,-96 M10,-92 Q40,-94 56,-70 M-60,-50 Q-40,-90 -10,-104');
        P.bvHair.setAttribute('d', 'M-68,-30 C-76,-112 76,-112 68,-30 C66,0 50,24 20,30 L-20,30 C-50,24 -66,0 -68,-30Z');
        P.bvStr.setAttribute('d', 'M-50,-60 Q-20,0 -10,26 M0,-100 Q0,-20 0,26 M50,-60 Q20,0 10,26');
      } else if (c.hairStyle === 'short') {
        P.frontHair.setAttribute('d', 'M-66,-14 C-78,-112 40,-134 70,-30 C66,-56 52,-74 30,-80 C0,-84 -30,-76 -50,-56 C-58,-44 -62,-30 -66,-14Z M-52,-56 Q-14,-104 54,-72 Q22,-76 -4,-66 Q-30,-58 -52,-56Z');
        P.hairStr.setAttribute('d', 'M-40,-86 Q0,-110 50,-80 M-50,-60 Q-10,-96 40,-92');
        P.bvHair.setAttribute('d', 'M-66,-20 C-74,-110 74,-110 66,-20 C60,10 30,22 0,24 C-30,22 -60,10 -66,-20Z');
        P.bvStr.setAttribute('d', 'M-40,-80 Q-30,-20 -24,10 M30,-80 Q24,-20 20,10');
      } else {
        P.frontHair.setAttribute('d', 'M-66,-18 C-72,-112 72,-116 66,-18 C64,-46 54,-64 40,-70 C20,-76 -20,-76 -40,-70 C-54,-64 -64,-46 -66,-18Z');
        P.hairStr.setAttribute('d', 'M-40,-86 Q0,-100 40,-86');
        P.bvHair.setAttribute('d', 'M-66,-24 C-70,-108 70,-108 66,-24 C62,6 34,20 0,22 C-34,20 -62,6 -66,-24Z');
        P.bvStr.setAttribute('d', 'M-30,-80 Q-24,-30 -20,10');
      }
      if (c.beard) {
        P.beard.setAttribute('d', `M-63,-4 C-62,46 -44,96 -22,140 Q0,${168 + tw * 3} 22,140 C44,96 62,46 63,-4 C56,30 44,50 24,58 Q12,66 0,64 Q-12,66 -24,58 C-44,50 -56,30 -63,-4Z`);
        P.beardStr.setAttribute('d', 'M-46,40 Q-30,100 -12,140 M-24,66 Q-12,110 -2,150 M24,66 Q12,110 2,150 M46,40 Q30,100 12,140 M-56,10 Q-50,50 -36,80 M56,10 Q50,50 36,80');
      }
      // features follow head turn
      const fx = d.turn * 14;
      P.feat.setAttribute('transform', `translate(${fx},0)`);
      const sq = 1 - Math.abs(d.turn) * .25;
      eyes.forEach((E, i) => {
        const side = i ? 1 : -1, near = (side * d.turn) > 0 ? 1 : sq;
        const bl = clamp(d.blink) * (1 - .35 * d.squint);
        E.ball.setAttribute('transform', `scale(${near},${Math.max(.06, bl)})`);
        E.iris.setAttribute('transform', `translate(${d.lookX * 6.5},${d.lookY * 3 - 1})`);
        E.lid.setAttribute('transform', `translate(0,${(1 - bl) * 4}) scale(${near},${Math.max(.1, bl)})`);
        if (E.lash) E.lash.setAttribute('transform', `translate(0,${(1 - bl) * 4})`);
        E.low.setAttribute('opacity', .7 - .3 * d.squint);
        const h = clamp(d.heart); disp(E.hrt, h > .02); E.hrt.setAttribute('transform', `scale(${h})`); E.pup.setAttribute('r', 3.4 * (1 - h));
      });
      const by = -d.brow * 5;
      P.brows.setAttribute('d', F ? `M-40,${-24 + by} Q-26,${-36 + by} -10,${-30 + by} M10,${-30 + by} Q26,${-36 + by} 40,${-24 + by}`
        : `M-42,${-26 + by} Q-26,${-34 + by} -10,${-28 + by} M10,${-28 + by} Q26,${-34 + by} 42,${-26 + by}`);
      // mouth
      const s = d.smile, o = d.open, cy = 54 - s * 5, w2 = (F ? 16 : 18) + s * 3;
      P.mLine.setAttribute('d', `M${-w2},${cy} Q0,${55 + s * 6 + o * 8} ${w2},${cy}`);
      P.lipU.setAttribute('d', F ? `M${-w2},${cy} Q-8,${cy - 7} -2,${cy - 5 - s * 2} Q0,${cy - 4 - s * 2} 2,${cy - 5 - s * 2} Q8,${cy - 7} ${w2},${cy} Q0,${55 + s * 5} ${-w2},${cy}Z` : '');
      const lb = 55 + s * 6 + o * 8;
      P.lipL.setAttribute('d', `M${-w2 + 5},${cy + 1} Q0,${lb + (F ? 10 : 7)} ${w2 - 5},${cy + 1} Q0,${lb + 2} ${-w2 + 5},${cy + 1}Z`);
      disp(P.mOpen, o > .02); disp(P.teeth, o > .02);
      P.mOpen.setAttribute('d', `M${-w2 + 2},${cy} Q0,${54 + s * 4} ${w2 - 2},${cy} Q0,${lb + 1} ${-w2 + 2},${cy}Z`);
      P.teeth.setAttribute('d', `M${-w2 + 5},${cy} Q0,${54 + s * 4} ${w2 - 5},${cy} Q0,${cy + 5 + o * 2} ${-w2 + 5},${cy}Z`);
      P.lipHi.setAttribute('cy', lb + 4);
    }
  };
}

/* ================= FIGURE (full body, realistic ~7-head proportions) ================= */
function Figure(parent, who, opt = {}) {
  const c = CAST[who]; const F = c.sex === 'f'; const id = uid('b');
  const sh = c.sw; // shoulder half width
  const torso = F ? `M${-sh},-572 Q-62,-500 -48,-440 Q-44,-408 -50,-382 H50 Q44,-408 48,-440 Q62,-500 ${sh},-572 Q30,-590 0,-586 Q-30,-590 ${-sh},-572Z`
    : `M${-sh},-570 Q${-sh + 2},-480 -54,-382 H54 Q${sh - 2},-480 ${sh},-570 Q36,-592 0,-588 Q-36,-592 ${-sh},-570Z`;
  const g = add(parent, `<g>
   <ellipse class="shadow" cx="0" cy="2" rx="${F ? 80 : 92}" ry="12" fill="#000" opacity=".22"/>
   <defs><linearGradient id="${id}t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c.top}"/><stop offset=".6" stop-color="${c.top}"/><stop offset="1" stop-color="${c.topShade}"/></linearGradient>
    <pattern id="${id}tat" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
     <path d="M0,13 Q6,2 13,13 T26,13 M13,0 V26 M4,4 L8,8 M18,18 L22,22" stroke="#1d2230" stroke-width="2.6" fill="none"/><circle cx="20" cy="6" r="3" fill="none" stroke="#1d2230" stroke-width="2"/></pattern></defs>
   <g class="hairBack"></g>
   <g class="legs"></g>
   <g class="body">
    <path class="hip" fill="${c.bottom}"/>
    ${c.dress ? `<path class="skirt" fill="${c.top}"/><path class="skirtTrim" fill="none" stroke="#c9a24a" stroke-width="6"/>` : ''}
    <path class="torso" d="${torso}" fill="url(#${id}t)"/>
    ${c.shirt ? `<path d="M0,-586 V-382" stroke="${c.topShade}" stroke-width="3"/><path d="M-16,-586 L0,-560 L16,-586" fill="none" stroke="${c.topShade}" stroke-width="4"/>${[-540, -500, -460, -420].map(y => `<circle cx="5" cy="${y}" r="3" fill="${c.topShade}"/>`).join('')}` : ''}
    ${!F && !c.shirt && !c.viking ? `<path d="M-22,-588 Q0,-570 22,-588" stroke="${c.topShade}" stroke-width="5" fill="none"/>` : ''}
    ${F && !c.dress ? `<path d="M-20,-586 Q0,-572 20,-586" stroke="${c.topShade}" stroke-width="4" fill="none"/><path d="M-40,-470 Q0,-460 40,-470" stroke="${c.topShade}" stroke-width="2" fill="none" opacity=".6"/>` : ''}
    ${c.dress ? `<path d="M-28,-586 Q0,-556 28,-586" stroke="#c9a24a" stroke-width="7" fill="none"/><path d="M-50,-440 H50" stroke="#c9a24a" stroke-width="7"/><circle cx="0" cy="-566" r="7" fill="#d9dce4" stroke="#9aa0ad" stroke-width="2"/>` : ''}
    ${c.viking && !F ? `<path d="M-60,-560 L48,-400 M60,-560 L-48,-400" stroke="#2a1a10" stroke-width="12"/><circle cx="0" cy="-480" r="12" fill="#b9873e" stroke="#6b4a20" stroke-width="3"/><rect x="-54" y="-410" width="108" height="20" fill="#2a1a10"/><rect x="-10" y="-412" width="20" height="24" fill="#b9873e"/>` : ''}
    <g class="neckG"><rect x="${F ? -14 : -18}" y="-630" width="${F ? 28 : 36}" height="56" fill="${c.skin}"/><path d="M${F ? -14 : -18},-600 Q0,-590 ${F ? 14 : 18},-600 V-574 H${F ? -14 : -18}Z" fill="${c.shade}" opacity=".5"/></g>
   </g>
   <g class="armsBack"></g>
   <g class="cloak"></g>
   <g class="headG"></g>
   <g class="armsFront"></g>
   <g class="props"></g>
  </g>`);
  const P = {}; ['shadow', 'hairBack', 'legs', 'body', 'hip', 'torso', 'armsBack', 'armsFront', 'headG', 'props', 'skirt', 'skirtTrim', 'neckG', 'cloak'].forEach(k => P[k] = q(g, k));
  const head = Face(P.headG, who);
  if (c.viking && !F) add(P.cloak, `<path d="M-84,-590 Q-110,-470 -100,-330 Q-60,-300 -64,-360 Q-60,-460 -48,-560Z M84,-590 Q110,-470 100,-330 Q60,-300 64,-360 Q60,-460 48,-560Z" fill="#6f655a"/>
    <path d="M-96,-600 Q0,-650 96,-600 Q90,-570 60,-566 Q0,-590 -60,-566 Q-90,-570 -96,-600Z" fill="#8c8174"/><path d="M-90,-596 q10,10 20,0 q10,10 20,0 q10,10 20,0 q10,10 20,0 q10,10 20,0 q10,10 20,0 q10,10 20,0 q10,10 20,0 q10,10 20,0" fill="none" stroke="#a69b8c" stroke-width="5"/>`);
  // limbs
  const mk = (grp, cls, col, w) => add(grp, `<path class="${cls}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`);
  const legW = F ? [36, 27] : [42, 32];
  const legs = ['L', 'R'].map(s => {
    const gg = add(P.legs, '<g></g>');
    return { skinT: mk(gg, 'a', c.skin, legW[0]), skinC: mk(gg, 'b', c.skin, legW[1]), tat: (s === 'R' && c.tatLegR) ? mk(gg, 'tt', `url(#${id}tat)`, legW[1] - 4) : null,
      cover: mk(gg, 'c', c.bottom, legW[0] + 4), coverC: mk(gg, 'd', c.bottom, legW[1] + 4), shoe: add(gg, `<path fill="${c.shoe}" stroke="#00000022" stroke-width="2"/>`) };
  });
  const armW = F ? [24, 20] : [30, 25];
  const arm = (grp, s) => ({ up: mk(grp, 'u', c.skin, armW[0]), lo: mk(grp, 'l', c.skin, armW[1]),
    tat: ((s === 'R' && c.tatR) || (s === 'L' && c.tatL)) ? [mk(grp, 't1', `url(#${id}tat)`, armW[0] - 6), mk(grp, 't2', `url(#${id}tat)`, armW[1] - 5)] : null,
    sl: mk(grp, 's', `url(#${id}t)`, armW[0] + 8), slLo: mk(grp, 's2', c.top, armW[1] + 7), hand: add(grp, `<g><ellipse rx="${F ? 11 : 14}" ry="${F ? 15 : 18}" fill="${c.skin}"/><ellipse cx="${F ? -8 : -10}" cy="-2" rx="5" ry="9" fill="${c.skin}" transform="rotate(-25)"/><ellipse cx="2" cy="4" rx="${F ? 9 : 11}" ry="${F ? 10 : 12}" fill="${c.shade}" opacity=".25"/></g>`) });
  const arms = { L: arm(P.armsBack, 'L'), R: arm(P.armsFront, 'R') };
  const seg = (x, y, a, l) => [x + Math.sin(a * D2R) * l, y + Math.cos(a * D2R) * l];
  const line = (p) => `M${p.map(v => v.map(n => n.toFixed(1)).join(',')).join(' L')}`;
  const part = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  return {
    g, head, P, c,
    set(d) {
      d = Object.assign({ x: 0, y: 0, s: 1, flip: 1, back: 0, drop: 0, lean: 0, breathe: 0, t: 0,
        lu: 6, ll: 4, ru: -6, rl: -4, lt: 3, lc: 0, rt: -3, rc: 0, thighF: 1, armsSwapFront: 0, headTilt: 0, headX: 0, shadow: 1, face: {} }, d);
      g.setAttribute('transform', `translate(${d.x},${d.y}) scale(${d.s * d.flip},${d.s})`);
      P.shadow.setAttribute('opacity', .22 * d.shadow);
      const br = Math.sin(d.t * 1.7) * 2 * (1 + d.breathe);
      const up = `translate(0,${d.drop}) rotate(${d.lean},0,-380)`;
      P.body.setAttribute('transform', up); P.armsBack.setAttribute('transform', up); P.armsFront.setAttribute('transform', up); P.props.setAttribute('transform', up); P.cloak.setAttribute('transform', up);
      P.hairBack.setAttribute('transform', up);
      P.torso.setAttribute('transform', `translate(0,${-br * .3}) scale(1,${1 + br * .002})`);
      // head
      P.headG.setAttribute('transform', `${up} translate(${d.headX},${-662 - br * .4}) rotate(${d.headTilt},0,40) scale(.6)`);
      head.set(Object.assign({ t: d.t, back: d.back }, d.face));
      if (d.back) { P.armsBack.parentNode.insertBefore(P.armsBack, P.headG); }
      // legs
      const hipY = -378 + d.drop;
      const LG = [['L', -24, d.lt, d.lc], ['R', 24, d.rt, d.rc]];
      LG.forEach(([s, hx, ta, ca], i) => {
        const L = legs[i]; const hip = [hx, hipY]; const knee = seg(hip[0], hip[1], ta, 180 * d.thighF); const ank = seg(knee[0], knee[1], ca, 172);
        L.skinT.setAttribute('d', line([hip, knee])); L.skinC.setAttribute('d', line([knee, ank]));
        if (L.tat) L.tat.setAttribute('d', line([part(knee, ank, .05), part(knee, ank, .85)]));
        const cv = c.legCover; L.cover.setAttribute('d', line([hip, part(hip, knee, Math.min(1, cv / .5 * .5 + (cv > .5 ? (cv - .5) : 0)))]));
        if (cv >= 1) { L.cover.setAttribute('d', line([hip, knee])); L.coverC.setAttribute('d', line([knee, part(knee, ank, .96)])); disp(L.coverC, 1); }
        else { L.cover.setAttribute('d', line([hip, part(hip, knee, cv)])); disp(L.coverC, 0); }
        if (c.dress) { disp(L.cover, 0); disp(L.coverC, 0); }
        const fx = ank[0], fy = ank[1] + 12;
        L.shoe.setAttribute('d', `M${fx - 20},${fy - 16} Q${fx - 22},${fy + 2} ${fx - 10},${fy + 4} L${fx + 40},${fy + 4} Q${fx + 48},${fy - 4} ${fx + 38},${fy - 12} Q${fx + 10},${fy - 24} ${fx - 20},${fy - 16}Z`);
      });
      P.hip.setAttribute('d', `M-54,${-400} H54 L58,${-334 + (c.legCover < .5 ? 0 : 0)} H-58Z`);
      if (c.dress) { const sw = Math.sin(d.t * 2) * 6; P.skirt.setAttribute('d', `M-52,-445 H52 L${110 + sw},-20 Q0,0 ${-110 + sw},-20Z`); P.skirtTrim.setAttribute('d', `M${-108 + sw},-30 Q0,-10 ${108 + sw},-30`); }
      // arms
      const AR = [['L', -sh + 12, d.lu, d.ll], ['R', sh - 12, d.ru, d.rl]];
      AR.forEach(([s, sx, ua, la]) => {
        const A = arms[s]; const shp = [sx, -556]; const el = seg(shp[0], shp[1], ua, 130); const wr = seg(el[0], el[1], la, 118);
        A.up.setAttribute('d', line([shp, el])); A.lo.setAttribute('d', line([el, wr]));
        if (A.tat) { A.tat[0].setAttribute('d', line([part(shp, el, .35), el])); A.tat[1].setAttribute('d', line([el, part(el, wr, .88)])); }
        const slv = c.sleeve; if (slv <= 1) { A.sl.setAttribute('d', line([shp, part(shp, el, slv)])); disp(A.slLo, 0); }
        else { A.sl.setAttribute('d', line([shp, el])); A.slLo.setAttribute('d', line([el, part(el, wr, slv - 1)])); disp(A.slLo, 1); }
        const hp = seg(wr[0], wr[1], la, 14); A.hand.setAttribute('transform', `translate(${hp[0]},${hp[1]}) rotate(${-la})`);
        A.handPos = hp;
      });
      this.hands = { L: arms.L.handPos, R: arms.R.handPos };
    }
  };
}
/* poses */
const POSE = {
  walk: (t, rate = 1.6, amp = 22) => { const a = Math.sin(t * Math.PI * rate) * amp; return { lt: a, lc: a - Math.max(0, -a) * 1.2, rt: -a, rc: -a - Math.max(0, a) * 1.2, lu: -a * .7 + 4, ll: -a * .5 + 10, ru: a * .7 - 4, rl: a * .5 - 10, bob: Math.abs(Math.cos(t * Math.PI * rate)) * -8 }; },
  sit: { drop: 150, lt: 8, lc: -4, rt: -8, rc: 4, thighF: .2 },
  idle: (t) => ({ lu: 6 + Math.sin(t) * 1.5, ll: 6, ru: -6 - Math.sin(t) * 1.5, rl: -6 }),
};

/* ================= YUNA (Chihuahua) — side view ================= */
function Yuna(parent) {
  const g = add(parent, `<g>
   <ellipse class="sh" cx="0" cy="2" rx="62" ry="8" fill="#000" opacity=".2"/>
   <g class="bd">
    <path class="tail" fill="none" stroke="#8a5a35" stroke-width="9" stroke-linecap="round"/>
    <g class="legsB"></g>
    <ellipse cx="-4" cy="-62" rx="52" ry="30" fill="#8a5a35"/>
    <path d="M14,-80 Q44,-70 46,-40 Q30,-30 18,-40 Q8,-60 14,-80Z" fill="#f6efe4"/>
    <ellipse cx="-14" cy="-78" rx="34" ry="10" fill="#a8744a" opacity=".6"/>
    <g class="legsF"></g>
    <g class="hd">
     <path d="M30,-128 L18,-196 Q40,-180 54,-138Z" fill="#7a4d2c"/><path d="M33,-134 L25,-182 Q40,-170 48,-140Z" fill="#e7a7a0"/>
     <circle cx="56" cy="-112" r="34" fill="#8a5a35"/>
     <path d="M62,-140 L74,-206 Q92,-176 86,-132Z" fill="#8a5a35"/><path d="M68,-142 L77,-192 Q88,-170 83,-140Z" fill="#e7a7a0"/>
     <ellipse cx="86" cy="-98" rx="18" ry="13" fill="#9a683f"/><ellipse cx="80" cy="-92" rx="14" ry="9" fill="#f6efe4" opacity=".9"/>
     <ellipse cx="103" cy="-103" rx="6" ry="5" fill="#1a1210"/><circle cx="101" cy="-105" r="1.6" fill="#fff" opacity=".7"/>
     <path class="tongue" d="M90,-88 Q96,-74 102,-88Z" fill="#ef7f8f"/>
     <g class="eye"><ellipse cx="70" cy="-120" rx="9" ry="10" fill="#c98a2e"/><circle class="pp" cx="72" cy="-120" r="5" fill="#120c08"/><circle cx="74" cy="-123" r="2" fill="#fff"/></g>
     <ellipse cx="68" cy="-136" rx="5" ry="3.5" fill="#f3dcb5"/>
     <path class="lid" d="M60,-124 Q70,-132 80,-122" stroke="#4a2c18" stroke-width="2.5" fill="none"/>
    </g>
   </g></g>`);
  const legs = { B: q(g, 'legsB'), F: q(g, 'legsF') };
  const L = [[-36, 'B'], [-20, 'F'], [20, 'B'], [34, 'F']].map(([x, k]) => ({ x, e: add(legs[k], `<path stroke="${k === 'B' ? '#7a4d2c' : '#8a5a35'}" stroke-width="10" stroke-linecap="round" fill="none"/>`) }));
  return {
    g, set(d) {
      d = Object.assign({ x: 0, y: 0, s: 1, flip: 1, run: 0, wag: 1, t: 0, jump: 0, tilt: 0, tongue: 0, blink: 1, sit: 0, rot: 0, lookUp: 0 }, d);
      g.setAttribute('transform', `translate(${d.x},${d.y}) rotate(${d.rot}) scale(${d.s * d.flip},${d.s})`);
      const bob = d.run ? -Math.abs(Math.sin(d.t * 13)) * 12 : Math.sin(d.t * 3) * 1.5;
      q(g, 'bd').setAttribute('transform', `translate(0,${bob - d.jump}) rotate(${d.sit ? -18 : 0},-40,-40)`);
      L.forEach((l, i) => { const a = d.run ? Math.sin(d.t * 13 + (i % 2) * 3) * 35 : 0; const y0 = -46; const len = d.sit && l.x < 0 ? 26 : 46;
        l.e.setAttribute('d', `M${l.x},${y0} L${l.x + Math.sin(a * D2R) * len},${y0 + Math.cos(a * D2R) * len}`); });
      q(g, 'tail').setAttribute('d', `M-50,-72 Q${-78 + Math.sin(d.t * (d.wag ? 24 : 3)) * (d.wag ? 14 : 3)},-110 ${-58 + Math.sin(d.t * (d.wag ? 24 : 3)) * (d.wag ? 18 : 3)},-122`);
      q(g, 'hd').setAttribute('transform', `rotate(${d.tilt - d.lookUp * 18},50,-90)`);
      disp(q(g, 'tongue'), d.tongue); q(g, 'eye').setAttribute('transform', `translate(70,-120) scale(1,${Math.max(.1, d.blink)}) translate(-70,120)`);
    }
  };
}
/* Yuna front view (sitting, looking at camera / up) */
function YunaFront(parent) {
  const g = add(parent, `<g>
   <ellipse cx="0" cy="0" rx="50" ry="8" fill="#000" opacity=".2"/>
   <g class="bd"><path class="tail" stroke="#8a5a35" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M-40,0 Q-46,-60 -26,-96 H26 Q46,-60 40,0Z" fill="#8a5a35"/><path d="M-18,-96 Q0,-60 18,-96 Q22,-40 0,-8 Q-22,-40 -18,-96Z" fill="#f6efe4"/>
    <path d="M-30,0 V-30 M-14,0 V-36 M14,0 V-36 M30,0 V-30" stroke="#7a4d2c" stroke-width="10" stroke-linecap="round"/>
    <g class="hd">
     <path d="M-30,-140 L-86,-206 Q-70,-150 -46,-118Z" fill="#8a5a35"/><path d="M-34,-140 L-74,-190 Q-64,-152 -46,-126Z" fill="#e7a7a0"/>
     <path d="M30,-140 L86,-206 Q70,-150 46,-118Z" fill="#8a5a35"/><path d="M34,-140 L74,-190 Q64,-152 46,-126Z" fill="#e7a7a0"/>
     <ellipse cx="0" cy="-124" rx="48" ry="42" fill="#8a5a35"/><ellipse cx="0" cy="-102" rx="22" ry="17" fill="#f6efe4"/>
     <ellipse cx="0" cy="-110" rx="8" ry="6" fill="#1a1210"/><path class="tongue" d="M-6,-94 Q0,-80 6,-94Z" fill="#ef7f8f"/>
     ${[-1, 1].map(s => `<g class="e${s < 0 ? 'L' : 'R'}"><ellipse cx="${s * 20}" cy="-130" rx="10" ry="11" fill="#c98a2e"/><circle class="pp" cx="${s * 20}" cy="-130" r="5.5" fill="#120c08"/><circle cx="${s * 20 + 3}" cy="-134" r="2.2" fill="#fff"/></g>
       <ellipse cx="${s * 20}" cy="-149" rx="6" ry="4" fill="#f3dcb5"/>`).join('')}
    </g></g></g>`);
  return { g, set(d) { d = Object.assign({ x: 0, y: 0, s: 1, t: 0, tilt: 0, look: 0, lookUp: 0, tongue: 0, blink: 1, wag: 1 }, d);
    g.setAttribute('transform', tr(d.x, d.y, d.s));
    q(g, 'hd').setAttribute('transform', `rotate(${d.tilt},0,-100) translate(0,${-d.lookUp * 6})`);
    g.querySelectorAll('.pp').forEach(p => p.setAttribute('transform', `translate(${d.look * 3},${-d.lookUp * 3})`));
    ['eL', 'eR'].forEach(k => { const e = q(g, k); e.setAttribute('transform', `translate(0,-130) scale(1,${Math.max(.1, d.blink)}) translate(0,130)`); });
    disp(q(g, 'tongue'), d.tongue);
    q(g, 'tail').setAttribute('d', `M30,-10 Q${70 + Math.sin(d.t * 22) * 12 * d.wag},-30 ${60 + Math.sin(d.t * 22) * 16 * d.wag},-60`); } };
}

/* ================= CAR (champagne boxy luxury SUV, no badges) ================= */
function Car(parent) {
  const g = add(parent, `<g>
   <ellipse cx="0" cy="6" rx="470" ry="22" fill="#000" opacity=".35"/>
   <path d="M-440,-60 V-250 Q-440,-262 -428,-264 L-300,-270 L-250,-420 Q-246,-430 -232,-430 H300 Q314,-430 318,-420 L360,-280 L430,-272 Q446,-270 446,-254 V-60Z" fill="url(#champ)"/>
   <path d="M-440,-150 H446" stroke="#8c7550" stroke-width="3" opacity=".7"/>
   <path d="M-236,-404 L-280,-282 H-40 V-404Z" fill="url(#glassDark)"/><path d="M-20,-404 V-282 H150 V-404Z" fill="url(#glassDark)"/><path d="M170,-404 V-282 H340 L304,-404Z" fill="url(#glassDark)"/>
   <path class="refl" d="M-200,-404 L-240,-282 H-200 L-160,-404Z" fill="#fff" opacity=".12"/>
   <path d="M-30,-404 V-60 M160,-404 V-60" stroke="#8c7550" stroke-width="4"/>
   <g class="door"><path d="M-30,-404 H160 V-60 H-30Z" fill="url(#champ)"/><path d="M-20,-404 V-282 H150 V-404Z" fill="url(#glassDark)"/><rect x="100" y="-250" width="44" height="10" rx="5" fill="#6d5a3c"/></g>
   <rect x="-440" y="-120" width="886" height="30" fill="#2a2620" opacity=".85"/>
   <circle cx="420" cy="-330" r="0" fill="#000"/>
   <g transform="translate(-470,-230)"><rect x="-26" y="-90" width="40" height="160" rx="18" fill="#1d1c1a"/><circle cx="0" cy="-10" r="62" fill="#1d1c1a"/><circle cx="0" cy="-10" r="34" fill="#cfc6b4"/></g>
   <path d="M430,-250 H452 V-200 H430Z" fill="#fff6d8"/><circle cx="436" cy="-224" r="18" fill="#fff6d8" opacity=".9"/>
   <path d="M-444,-250 H-430 V-200 H-444Z" fill="#c2303a"/>
   <path d="M330,-300 L380,-310 L384,-280 L338,-278Z" fill="#1d1c1a"/>
   ${[-290, 300].map(x => `<g transform="translate(${x},-40)"><circle r="92" fill="#141414"/><circle r="58" fill="#c9c2b2"/><circle r="58" fill="none" stroke="#8c8577" stroke-width="6"/>${[0, 60, 120, 180, 240, 300].map(a => `<path d="M0,0 L${Math.sin(a * D2R) * 52},${Math.cos(a * D2R) * 52}" stroke="#8c8577" stroke-width="10"/>`).join('')}<circle r="14" fill="#6d675c"/></g>`).join('')}
   <path d="M-390,-60 Q-290,-170 -190,-60 M200,-60 Q300,-170 400,-60" fill="#1d1c1a"/>
  </g>`);
  return { g, door: q(g, 'door'), refl: q(g, 'refl'), set(d) { d = Object.assign({ x: 0, y: 0, s: 1, door: 0, t: 0, flip: 1 }, d);
    g.setAttribute('transform', `translate(${d.x},${d.y}) scale(${d.s * d.flip},${d.s})`);
    this.door.setAttribute('transform', `translate(${-30 + d.door * -10},0) scale(${1 - d.door * .75},1) translate(30,0)`);
    this.refl.setAttribute('transform', `translate(${(d.t * 160) % 700 - 100},0)`); } };
}

/* ================= SCENE SYSTEM ================= */
const SCENES = [];
function scene(start, end, opt, build) {
  const div = add($('scenes'), `<div class="scene"><svg viewBox="0 0 1920 1080" width="1920" height="1080"><defs class="sd"></defs><g class="cam"></g></svg></div>`);
  const sc = { start, end, trans: opt.trans || 'cut', tl: opt.tl || .6, grade: opt.grade || null, div, defs: div.querySelector('.sd'), cam: div.querySelector('.cam') };
  sc.update = build(sc.cam, sc.defs, sc);
  SCENES.push(sc); return sc;
}
const camSet = (c, s, cx = 960, cy = 540, dx = 0, dy = 0, r = 0) => c.setAttribute('transform', `translate(${960 + dx},${540 + dy}) rotate(${r}) scale(${s}) translate(${-cx},${-cy})`);

/* film grain */
const grain = { cv: null, ctx: null, img: null };
function initGrain() { grain.cv = $('grain'); grain.ctx = grain.cv.getContext('2d'); grain.img = grain.ctx.createImageData(640, 360); }
function drawGrain(frame) { let s = (frame * 9301 + 49297) % 233280; const d = grain.img.data;
  for (let i = 0; i < d.length; i += 4) { s = (s * 9301 + 49297) % 233280; const v = (s / 233280) * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
  grain.ctx.putImageData(grain.img, 0, 0); }
