/* ===== Shots 1–13 : Vadi café, Reza enters, the Viking fantasy ===== */

/* ---------- reusable café set ---------- */
function cafeSet(c, defs, { blurId, guests = true } = {}) {
  const bl = blurFilter(defs, blurId);
  const g = add(c, `<g filter="url(#${blurId})"></g>`);
  add(g, `<defs>
    <linearGradient id="${blurId}win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe1a8"/><stop offset=".55" stop-color="#ffc072"/><stop offset="1" stop-color="#f39a5a"/></linearGradient>
    <linearGradient id="${blurId}flr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a6a45"/><stop offset="1" stop-color="#6e4a30"/></linearGradient>
    <linearGradient id="${blurId}ray" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe4b0" stop-opacity=".55"/><stop offset="1" stop-color="#ffe4b0" stop-opacity="0"/></linearGradient></defs>
   <rect width="1920" height="1080" fill="#d8c6aa"/>
   ${Array.from({ length: 9 }, (_, i) => `<path d="M0,${80 + i * 80} H1920" stroke="#c9b597" stroke-width="2"/>`).join('')}
   ${Array.from({ length: 30 }, (_, i) => `<path d="M${(i % 2) * 60 + i * 66},${80 + (i % 9) * 80} v80" stroke="#c9b597" stroke-width="2"/>`).join('')}
   ${[80, 380, 680].map(x => `<g><rect x="${x}" y="110" width="250" height="620" fill="url(#${blurId}win)"/>
     <ellipse cx="${x + 80}" cy="560" rx="90" ry="140" fill="#8fae6a" opacity=".55"/><ellipse cx="${x + 190}" cy="600" rx="70" ry="110" fill="#7a9a5a" opacity=".5"/>
     <rect x="${x}" y="640" width="250" height="90" fill="#c99a70" opacity=".45"/>
     <rect x="${x}" y="110" width="250" height="620" fill="none" stroke="#3b2e24" stroke-width="14"/><path d="M${x + 125},110 V730 M${x},420 H${x + 250}" stroke="#3b2e24" stroke-width="8"/></g>`).join('')}
   <g transform="translate(1010,0)"><rect x="0" y="420" width="470" height="340" fill="#7a5236"/><rect x="-10" y="410" width="490" height="26" fill="#e8ddcb"/>
     <rect x="30" y="140" width="410" height="12" fill="#5a3c28"/><rect x="30" y="250" width="410" height="12" fill="#5a3c28"/>
     ${Array.from({ length: 9 }, (_, i) => `<rect x="${50 + i * 44}" y="${96 + (i % 2) * 8}" width="26" height="${44 - (i % 2) * 8}" rx="5" fill="${['#e9d9b8', '#b5703f', '#f2efe7', '#6f8a5a'][i % 4]}"/>`).join('')}
     ${Array.from({ length: 7 }, (_, i) => `<circle cx="${70 + i * 55}" cy="232" r="16" fill="#f4efe6"/>`).join('')}
     <g transform="translate(150,300)"><rect x="0" y="0" width="160" height="110" rx="10" fill="#c8ccd2"/><rect x="10" y="10" width="140" height="40" rx="6" fill="#9aa1aa"/><rect x="30" y="60" width="12" height="40" fill="#555"/><rect x="118" y="60" width="12" height="40" fill="#555"/></g></g>
   <g transform="translate(1560,0)"><rect x="0" y="180" width="250" height="580" fill="url(#${blurId}win)" opacity=".9"/><rect x="0" y="180" width="250" height="580" fill="none" stroke="#3b2e24" stroke-width="14"/><rect x="214" y="430" width="10" height="90" rx="5" fill="#c9a24a"/></g>
   <rect y="760" width="1920" height="320" fill="url(#${blurId}flr)"/>
   ${Array.from({ length: 14 }, (_, i) => `<path d="M${960 + (i - 7) * 80},760 L${960 + (i - 7) * 300},1080" stroke="#5e3f29" stroke-width="2" opacity=".6"/>`).join('')}
   ${[80, 380, 680].map(x => `<path d="M${x},730 L${x + 250},730 L${x + 520},1080 L${x + 120},1080Z" fill="url(#${blurId}ray)" opacity=".7"/>`).join('')}
   ${[[960, 760], [1880, 760]].map(([x, y]) => `<g transform="translate(${x},${y})"><path d="M-46,0 L-38,-80 H38 L46,0Z" fill="#cbbba3"/><path d="M0,-80 V-230" stroke="#5a4632" stroke-width="10"/>
     ${Array.from({ length: 14 }, (_, i) => `<ellipse cx="${Math.cos(i) * 70}" cy="${-260 - Math.sin(i * 1.7) * 60}" rx="46" ry="22" fill="${i % 2 ? '#7d8f62' : '#93a476'}" transform="rotate(${i * 25},${Math.cos(i) * 70},${-260 - Math.sin(i * 1.7) * 60})"/>`).join('')}</g>`).join('')}`);
  const lamps = add(g, '<g></g>'); const LP = [300, 700, 1150, 1420].map(x => add(lamps, `<g transform="translate(${x},0)"><path d="M0,0 V200" stroke="#3b2e24" stroke-width="3"/><circle cy="250" r="120" fill="url(#warmGlow)" opacity=".6"/><path d="M-50,250 Q-46,200 0,196 Q46,200 50,250Z" fill="#b9873e"/><ellipse cy="252" rx="34" ry="8" fill="#fff3d0"/></g>`));
  if (guests) [[880, 770, '#7a6a8c'], [1240, 760, '#a5604a'], [1700, 780, '#5a6f7a']].forEach(([x, y, col]) => add(g, `<g transform="translate(${x},${y})"><ellipse cx="0" cy="-150" rx="26" ry="30" fill="#3a2a22"/><path d="M-44,-110 Q0,-130 44,-110 L50,-10 H-50Z" fill="${col}"/><ellipse cx="0" cy="-6" rx="80" ry="12" fill="#efe6d6"/><rect x="-6" y="-6" width="12" height="60" fill="#2a2420"/></g>`));
  const bok = add(g, '<g></g>'); const BK = Array.from({ length: 18 }, () => ({ e: add(bok, '<circle fill="#ffe0a0"/>'), x: rnd() * 1920, y: 120 + rnd() * 600, r: 14 + rnd() * 40, ph: rnd() * 6 }));
  return { g, bl, update(t, bokeh = 0) { BK.forEach(b => { b.e.setAttribute('cx', b.x + Math.sin(t * .4 + b.ph) * 20); b.e.setAttribute('cy', b.y); b.e.setAttribute('r', b.r * (1 + bokeh)); b.e.setAttribute('opacity', bokeh * (.25 + .15 * Math.sin(t + b.ph))); }); } };
}
function bokehLayer(c, n, col = '#ffd79a') { const g = add(c, '<g></g>'); const B = Array.from({ length: n }, () => ({ e: add(g, `<circle fill="${col}"/>`), x: rnd() * 1920, y: rnd() * 1080, r: 20 + rnd() * 70, ph: rnd() * 6, v: 4 + rnd() * 10 }));
  return (t, o = 1) => B.forEach(b => { b.e.setAttribute('cx', b.x + Math.sin(t * .3 + b.ph) * 30 + t * b.v); b.e.setAttribute('cy', b.y + Math.cos(t * .25 + b.ph) * 20); b.e.setAttribute('r', b.r); b.e.setAttribute('opacity', o * (.18 + .1 * Math.sin(t * .8 + b.ph))); }); }
function tableTop(c, x, y, s = 1) { return add(c, `<g transform="translate(${x},${y}) scale(${s})"><rect x="-10" y="0" width="20" height="300" fill="#2a2420"/><ellipse cx="0" cy="0" rx="250" ry="38" fill="#ece5da"/><ellipse cx="0" cy="-4" rx="250" ry="34" fill="#f6f1e8"/><path d="M-200,-10 Q-60,6 40,-20 T200,0" stroke="#d9d0c2" stroke-width="3" fill="none" opacity=".7"/></g>`); }
function cup(c, x, y, s = 1) { return add(c, `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="6" rx="56" ry="12" fill="#f4efe6" stroke="#d9d0c2" stroke-width="2"/><path d="M-36,-46 H36 Q34,0 0,6 Q-34,0 -36,-46Z" fill="#fbf8f2"/><path d="M34,-36 Q56,-34 50,-14 Q44,-6 30,-10" fill="none" stroke="#fbf8f2" stroke-width="8"/><ellipse cx="0" cy="-46" rx="36" ry="9" fill="#6b3f22"/><ellipse cx="-4" cy="-47" rx="20" ry="4" fill="#c99566" opacity=".8"/></g>`); }
function steam(c) { const g = add(c, '<g fill="none" stroke="#fff" stroke-linecap="round"></g>'); const S = [0, 1, 2].map(i => add(g, `<path stroke-width="${6 - i}"/>`));
  return (t, x, y, s = 1) => S.forEach((p, i) => { const ph = t * .8 + i * .33; const k = ph % 1; p.setAttribute('d', `M${x + (i - 1) * 14 * s},${y} c${10 * s},${-30 * s} ${-14 * s},${-50 * s} ${4 * s * Math.sin(t + i)},${-90 * s - k * 40 * s}`); p.setAttribute('opacity', .35 * (1 - k)); p.setAttribute('transform', `translate(0,${-k * 30 * s})`); }); }

/* ---------- 1 · Aerial establishing ---------- */
scene(0, 4.5, { trans: 'fade', tl: .1, grade: ['#ffb35c', .18] }, (c, defs) => {
  add(c, `<defs><linearGradient id="aSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6b07a"/><stop offset=".45" stop-color="#ffd7a0"/><stop offset="1" stop-color="#f3c79a"/></linearGradient></defs>
   <rect width="1920" height="1080" fill="url(#aSky)"/><circle cx="1500" cy="250" r="420" fill="url(#warmGlow)"/><circle cx="1500" cy="250" r="70" fill="#fff4d6"/>
   <path d="M0,330 Q300,270 600,320 T1200,300 T1920,320 V420 H0Z" fill="#c99a82" opacity=".7"/><path d="M0,380 Q400,330 900,370 T1920,360 V460 H0Z" fill="#b98a74" opacity=".7"/>`);
  const city = add(c, '<g></g>');
  for (let r = 0; r < 6; r++) for (let i = 0; i < 14; i++) { const w = 90 + rnd() * 80, h = 60 + rnd() * 140 + r * 20, x = i * 150 + (r % 2) * 70 - 80, y = 440 + r * 110;
    add(city, `<g><rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${['#e8d6c2', '#d9c2a8', '#f0e4d4', '#cdb8a0'][(i + r) % 4]}"/><rect x="${x + w}" y="${y - h + 10}" width="${w * .25}" height="${h - 10}" fill="#b49a80" opacity=".6"/>
     ${Array.from({ length: Math.floor(h / 30) }, (_, k) => `<rect x="${x + 10}" y="${y - h + 14 + k * 28}" width="${w - 20}" height="10" fill="#7a8c9a" opacity=".45"/>`).join('')}</g>`); }
  add(c, `<g transform="translate(960,860)"><ellipse rx="520" ry="150" fill="#d8c3a2"/>${Array.from({ length: 16 }, (_, i) => `<circle cx="${Math.cos(i / 16 * 6.28) * 430}" cy="${Math.sin(i / 16 * 6.28) * 120}" r="38" fill="#7d9a5e"/>`).join('')}
    ${Array.from({ length: 6 }, (_, i) => `<g transform="translate(${-200 + i * 80},${-10 + (i % 2) * 40})"><circle r="34" fill="#f6efe4"/><circle r="34" fill="none" stroke="#c9a24a" stroke-width="4"/><circle r="6" fill="#8a6a40"/></g>`).join('')}</g>`);
  const birds = add(c, '<g fill="none" stroke="#5a4a4a" stroke-width="4" stroke-linecap="round"></g>'); const BD = Array.from({ length: 6 }, (_, i) => ({ e: add(birds, '<path/>'), x: 300 + i * 90, y: 220 + (i % 3) * 30, ph: rnd() * 6 }));
  const haze = add(c, '<rect width="1920" height="1080" fill="#ffd9a8" opacity=".18"/>');
  return t => { BD.forEach(b => { const x = b.x + t * 60, f = Math.sin(t * 9 + b.ph) * 8; b.e.setAttribute('d', `M${x - 16},${b.y + f} Q${x - 8},${b.y - 8} ${x},${b.y} Q${x + 8},${b.y - 8} ${x + 16},${b.y + f}`); });
    const p = eio(prog(t, 0, 4.5)); camSet(c, lerp(1.0, 1.3, p), 960, lerp(540, 700, p)); };
});

/* ---------- 2 · Tracking from behind ---------- */
scene(4.5, 8.5, { trans: 'dissolve', tl: .6, grade: ['#ffb35c', .2] }, (c, defs) => {
  const set = cafeSet(c, defs, { blurId: 'bl2' });
  const fg = add(c, '<g></g>'); const fr = Figure(fg, 'friend'), gi = Figure(fg, 'girl');
  return t => { set.update(t, .3); set.bl(2.5);
    const p = t / 4; const w = POSE.walk(t, 1.25);
    const s = lerp(1.35, 1.0, p), y = lerp(1330, 1010, p);
    gi.set(Object.assign({ x: lerp(760, 700, p), y: y + w.bob, s, back: 1, t, face: { wind: .25 } }, w));
    const w2 = POSE.walk(t + .3, 1.25); fr.set(Object.assign({ x: lerp(1090, 960, p), y: y + 20 + w2.bob, s: s * 1.03, back: 1, t }, w2));
    camSet(c, 1.08, 960, 540, Math.sin(t * 1.25 * Math.PI) * 3, 0); };
});

/* ---------- 3 · Two-shot at the window table ---------- */
scene(8.5, 12, { trans: 'cut', grade: ['#ffb35c', .22] }, (c, defs) => {
  const bgw = add(c, '<g></g>'); const set = cafeSet(bgw, defs, { blurId: 'bl3', guests: false });
  bgw.setAttribute('transform', 'translate(-200,-120) scale(1.5)');
  const bok = bokehLayer(c, 14);
  const fg = add(c, '<g></g>'); const gi = Figure(fg, 'girl'), fr = Figure(fg, 'friend', {});
  const tb = add(fg, '<g></g>'); tableTop(tb, 960, 960, 2.3); add(tb, '<rect x="0" y="930" width="1920" height="200" fill="#5e3f29" opacity="0"/>'); const cp1 = cup(tb, 820, 940, 1.2), cp2 = cup(tb, 1110, 940, 1.2);
  return t => { set.update(t, .6); set.bl(7); bok(t, .9);
    const tuck = Math.sin(clamp(prog(t, .5, 1.9)) * Math.PI);
    const talk = (t > 1.9 && t < 3.0) ? Math.abs(Math.sin(t * 11)) * .25 : 0;
    gi.set({ x: 560, y: 1350, s: 1.6, ...POSE.sit, t, lu: 18, ll: 48, ru: lerp(-18, 150, tuck), rl: lerp(-48, -130, tuck), headTilt: -3 + tuck * 4,
      face: { turn: .45, lookX: .7, smile: .55 + .15 * Math.sin(t), open: talk, blink: blinkLoop(t, .5), brow: .1, wind: .05 } });
    const laugh = prog(t, 2.6, 3.0) * (1 - prog(t, 3.3, 3.5));
    fr.set({ x: 1370, y: 1365, s: 1.62, flip: -1, ...POSE.sit, t, lu: 18, ll: 48, ru: -18, rl: -48, headTilt: laugh * 4,
      face: { turn: .45, lookX: .7, smile: .35 + laugh * .5, open: laugh * .4, squint: laugh, blink: blinkLoop(t, 2.1) } });
    camSet(c, 1 + t * .02, 960, 560); };
});

/* ---------- 4 · Inserts: coffee + sneakers ---------- */
scene(12, 14.5, { trans: 'cut', grade: ['#ffb35c', .22] }, (c, defs) => {
  const A = add(c, '<g></g>'), B = add(c, '<g></g>');
  // coffee macro
  const blA = blurFilter(defs, 'bl4a');
  add(A, `<rect width="1920" height="1080" fill="#7a5a40"/>`); const ab = add(A, '<g filter="url(#bl4a)"></g>');
  add(ab, `<rect width="1920" height="1080" fill="#c99a70"/><rect x="0" y="0" width="900" height="700" fill="#ffd08a"/><circle cx="500" cy="300" r="240" fill="url(#warmGlow)"/>`);
  const bk = bokehLayer(ab, 16, '#fff1c8');
  add(A, `<path d="M0,620 Q960,560 1920,620 V1080 H0Z" fill="#f2ece2"/><path d="M0,640 Q960,585 1920,640" stroke="#e0d6c6" stroke-width="6" fill="none"/>
    <path d="M200,800 Q700,700 1300,820 T1920,760" stroke="#e5dccd" stroke-width="5" fill="none"/>`);
  const cupG = add(A, '<g></g>'); cup(cupG, 0, 0, 3.2); const st = steam(A);
  const hand = add(A, `<g><path d="M0,-30 C60,-40 160,-30 260,-20 V40 C160,50 60,50 0,40Z" fill="#e7c2a6"/><path d="M0,-30 C-30,-28 -40,10 -20,30 Q-6,42 0,40" fill="#e7c2a6"/><path d="M-10,-20 Q-40,-10 -30,20" stroke="#c99a7e" stroke-width="4" fill="none"/><path d="M200,-24 H380 V44 H200Z" fill="#2e2e33"/></g>`);
  const ray = add(A, `<path d="M300,0 L700,0 L1300,1080 L700,1080Z" fill="#fff0c8" opacity=".14"/>`);
  // sneakers under the table
  add(B, `<rect width="1920" height="1080" fill="#6e4a30"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 220},0 L${i * 220 - 300},1080" stroke="#5e3f29" stroke-width="3"/>`).join('')}
    <rect width="1920" height="1080" fill="url(#warmGlow)" opacity=".25"/><rect x="900" y="0" width="40" height="1080" fill="#2a2420"/><ellipse cx="920" cy="1060" rx="200" ry="30" fill="#2a2420"/>`);
  const legs = add(B, '<g></g>');
  const legL = add(legs, `<g><path d="M700,-40 L760,780" stroke="#e8bf9d" stroke-width="86" stroke-linecap="round"/><path d="M700,-40 L760,780" stroke="#c18b6c" stroke-width="20" opacity=".25" transform="translate(30,0)"/>
     <path d="M690,760 Q680,860 740,880 L960,880 Q1000,850 960,800 Q860,770 760,740Z" fill="#fff"/><path d="M700,846 H970" stroke="#ddd" stroke-width="8"/><path d="M760,790 L880,820" stroke="#e5e5e5" stroke-width="6"/></g>`);
  const legR = add(legs, `<g><path d="M1100,-40 L1040,760" stroke="#e8bf9d" stroke-width="86" stroke-linecap="round"/><path d="M1030,740 Q1010,850 1070,870 L1290,870 Q1330,840 1290,790 Q1190,760 1090,730Z" fill="#fff"/><path d="M1040,836 H1300" stroke="#ddd" stroke-width="8"/></g>`);
  return t => { const a = t < 1.5; disp(A, a); disp(B, !a);
    if (a) { blA(10 + 6 * (1 - prog(t, 0, .8))); bk(t, 1);
      const set = easeOut(prog(t, 0, .8)); const hx = lerp(1500, 1030, set) + prog(t, .9, 1.4) * 600;
      cupG.setAttribute('transform', `translate(${lerp(1400, 920, set)},${700 - Math.sin(set * Math.PI) * 20})`);
      disp(hand, 0); st(t, 920, 545, 2.2);
      ray.setAttribute('opacity', .12 + .04 * Math.sin(t * 2)); camSet(c, 1.02 + t * .03); }
    else { const tt = t - 1.5; legR.setAttribute('transform', `rotate(${Math.sin(tt * 5) * 3},1100,-40)`); camSet(c, 1.04 + tt * .03, 960, 700); } };
});

/* ---------- 5 · The door, slow motion, Reza from behind ---------- */
scene(14.5, 17.5, { trans: 'cut', grade: ['#ffb35c', .25] }, (c, defs) => {
  const bl = blurFilter(defs, 'bl5');
  const inside = add(c, '<g filter="url(#bl5)"></g>'); const set = cafeSet(inside, defs, { blurId: 'bl5b' }); inside.setAttribute('transform', 'translate(960,560) scale(.9) translate(-960,-560)');
  add(c, `<path d="M0,0 H1920 V1080 H0Z M560,120 V1080 H1360 V120Z" fill="#3a2e26" fill-rule="evenodd"/><rect x="540" y="100" width="840" height="30" fill="#2a201a"/>`);
  const door = add(c, `<g><rect x="960" y="130" width="400" height="950" fill="#cfe3ea" opacity=".18"/><rect x="960" y="130" width="400" height="950" fill="none" stroke="#1e1a16" stroke-width="22"/><rect x="990" y="560" width="12" height="160" rx="6" fill="#c9a24a"/></g>`);
  add(c, '<rect x="560" y="120" width="400" height="960" fill="#cfe3ea" opacity=".12"/><rect x="560" y="120" width="400" height="960" fill="none" stroke="#1e1a16" stroke-width="22"/>');
  const flare = add(c, '<g><circle cx="960" cy="380" r="420" fill="url(#warmGlow)" opacity=".7"/><rect x="0" y="360" width="1920" height="40" fill="#fff0c8" opacity=".12"/></g>');
  const fg = add(c, '<g></g>'); const mo = Figure(fg, 'mobin'), rz = Figure(fg, 'reza');
  return t => { set.update(t, .2); set.bl(3); bl(2);
    door.setAttribute('transform', `translate(1360,0) scale(${lerp(1, -.15, eio(prog(t, 0, 1.4)))},1) translate(-1360,0)`);
    const p = t / 3; const w = POSE.walk(t, .55, 16);
    rz.set(Object.assign({ x: lerp(880, 900, p), y: lerp(1720, 1460, p) + w.bob, s: lerp(2.0, 1.75, p), back: 1, t }, w, { ru: w.ru - 4 }));
    const w2 = POSE.walk(t + .5, .55, 16); mo.set(Object.assign({ x: lerp(1330, 1270, p), y: lerp(1660, 1420, p) + w2.bob, s: lerp(1.9, 1.68, p), back: 1, t }, w2));
    flare.setAttribute('opacity', .8 + .2 * Math.sin(t * 2)); camSet(c, 1 + t * .015); };
});

/* ---------- 6 · Close-up: Reza ---------- */
scene(17.5, 20, { trans: 'cut', grade: ['#ffb35c', .2] }, (c, defs) => {
  const bgw = add(c, '<g></g>'); const set = cafeSet(bgw, defs, { blurId: 'bl6' }); bgw.setAttribute('transform', 'translate(-900,-300) scale(1.6)');
  const bok = bokehLayer(c, 16);
  const rim = add(c, `<circle cx="1300" cy="300" r="500" fill="url(#warmGlow)" opacity=".5"/>`);
  const fg = add(c, '<g></g>'); const rz = Figure(fg, 'reza');
  return t => { set.update(t, .8); set.bl(10); bok(t, 1);
    const turn = lerp(-.35, .05, eio(prog(t, .2, 1.6)));
    rz.set({ x: 960, y: 2330, s: 2.75, t, lu: 4, ll: 4, ru: -4, rl: -4,
      face: { turn, lookX: lerp(-.6, .2, eio(prog(t, .2, 1.4))), smile: .12, blink: (t > 1.7 && t < 1.86) ? Math.abs(t - 1.78) / .08 : 1 } });
    camSet(c, 1 + t * .03, 960, 470); };
});

/* ---------- 7 · Wide: they cross to a far table ---------- */
scene(20, 22.5, { trans: 'cut', grade: ['#ffb35c', .2] }, (c, defs) => {
  const set = cafeSet(c, defs, { blurId: 'bl7' });
  const mid = add(c, '<g></g>'); tableTop(mid, 1400, 800, .7);
  const mo = Figure(mid, 'mobin'), rz = Figure(mid, 'reza');
  const fgb = blurFilter(defs, 'bl7f'); const fg = add(c, '<g filter="url(#bl7f)"></g>'); const gi = Figure(fg, 'girl'); tableTop(fg, 380, 980, 1.3);
  return t => { set.update(t, .2); set.bl(.6); fgb(6);
    const p = eio(prog(t, 0, 2.2)); const w = POSE.walk(t, 1.05, 18), w2 = POSE.walk(t + .4, 1.05, 18);
    rz.set(Object.assign({ x: lerp(1700, 1310, p), y: 790 + (p < 1 ? w.bob * .5 : 0), s: .62, t, face: { turn: -.3, lookX: -.4 } }, p < 1 ? w : {}));
    mo.set(Object.assign({ x: lerp(1800, 1500, p), y: 795 + (p < 1 ? w2.bob * .5 : 0), s: .64, t, face: { turn: -.2 } }, p < 1 ? w2 : {}));
    gi.set({ x: 360, y: 1560, s: 1.25, back: 1, ...POSE.sit, t, headTilt: 4, headX: 10 });
    camSet(c, 1.02 + t * .01, 960, 560); };
});

/* ---------- 8 · ECU: her eyes, hearts ---------- */
scene(22.5, 25, { trans: 'cut', grade: ['#ff9ab0', .12] }, (c, defs) => {
  add(c, '<rect width="1920" height="1080" fill="#e8bf9d"/>');
  const fg = add(c, '<g></g>'); const gi = Figure(fg, 'girl');
  const glow = add(c, '<g><circle cx="590" cy="540" r="260" fill="url(#pinkGlow)" opacity="0"/><circle cx="1330" cy="540" r="260" fill="url(#pinkGlow)" opacity="0"/></g>');
  return t => { const h = smooth(prog(t, .7, 1.3)) * (1 - smooth(prog(t, 2.2, 2.5)) * .0);
    gi.set({ x: 960, y: 6480, s: 9.2, t, face: { heart: h, lookX: .3, blink: (t > .3 && t < .45) ? Math.abs(t - .375) / .075 : 1, smile: .3, brow: .3 * h } });
    glow.setAttribute('opacity', h * (.55 + .2 * Math.sin(t * 10))); [...glow.children].forEach(e => e.setAttribute('opacity', 1));
    camSet(c, 1 + t * .025, 960, 540); };
});

/* ---------- 9 · Bubble forming around her imagination ---------- */
function bubbleSVG(c, id) { return add(c, `<g><defs><radialGradient id="${id}" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ffffff" stop-opacity=".05"/><stop offset=".8" stop-color="#bfe8ff" stop-opacity=".12"/><stop offset=".95" stop-color="#ffd6f0" stop-opacity=".55"/><stop offset="1" stop-color="#ffffff" stop-opacity=".8"/></radialGradient></defs>
  <circle r="300" fill="url(#${id})"/><path d="M-200,-170 A260,260 0 0 1 60,-270" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round" opacity=".55"/><circle cx="-150" cy="-150" r="18" fill="#fff" opacity=".5"/>
  <circle r="300" fill="none" stroke="#ffd1ec" stroke-width="3" opacity=".7"/></g>`); }
function girlMedium(c, defs, id) { const bgw = add(c, '<g></g>'); const set = cafeSet(bgw, defs, { blurId: id }); bgw.setAttribute('transform', 'translate(-300,-200) scale(1.55)'); const bok = bokehLayer(c, 14);
  const fg = add(c, '<g></g>'); const gi = Figure(fg, 'girl'); const tb = add(c, '<g></g>'); tableTop(tb, 900, 1080, 2.2); const cp = cup(tb, 1050, 1060, 1.5); return { set, bok, gi }; }
scene(25, 26.5, { trans: 'cut', grade: ['#ff9ab0', .12] }, (c, defs) => {
  const M = girlMedium(c, defs, 'bl9');
  const inner = add(c, '<g></g>');
  const bub = bubbleSVG(c, 'bub9');
  const fj = add(inner, `<g><circle r="290" fill="#2a5470"/><path d="M-290,40 L-150,-120 L-60,-20 L40,-160 L160,-30 L290,-100 V290 H-290Z" fill="#183a52"/><rect x="-290" y="80" width="580" height="220" fill="#1f4a66"/><circle cx="0" cy="70" r="40" fill="url(#warmGlow)"/></g>`);
  return t => { M.set.update(t, 1); M.set.bl(9 + t * 3); M.bok(t, 1);
    M.gi.set({ x: 820, y: 1700, s: 2.35, t, ...POSE.sit, lu: 20, ll: 60, ru: 25, rl: 65, face: { heart: .9, lookX: .5, lookY: -.4, smile: .45, brow: .25, blink: 1, turn: .2 } });
    const g = easeOut(prog(t, .1, 1.3)); const bx = 1330, by = 400;
    bub.setAttribute('transform', `translate(${bx},${by}) scale(${g * 1.05 + Math.sin(t * 3) * .01})`); inner.setAttribute('transform', `translate(${bx},${by}) scale(${g})`); inner.setAttribute('opacity', g * .8);
    camSet(c, 1 + t * .04, 960, 520); };
});

/* ---------- 10–11 · The Viking fantasy (fjord at sunset) ---------- */
function fjordSet(c, defs) {
  add(c, `<defs><linearGradient id="fjSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#132a44"/><stop offset=".45" stop-color="#2f5f7d"/><stop offset=".75" stop-color="#e98a5a"/><stop offset="1" stop-color="#ffc27a"/></linearGradient>
    <linearGradient id="fjWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9946a"/><stop offset=".3" stop-color="#2f5f7d"/><stop offset="1" stop-color="#0f243a"/></linearGradient></defs>
   <rect width="1920" height="1080" fill="url(#fjSky)"/><circle cx="1180" cy="620" r="360" fill="url(#warmGlow)" opacity=".9"/><circle cx="1180" cy="640" r="70" fill="#ffe2b0"/>`);
  const aur = blurFilter(defs, 'aurB'); const ag = add(c, '<g filter="url(#aurB)" opacity=".75"></g>'); const AU = [0, 1, 2].map(i => add(ag, `<path fill="none" stroke="${['#5cf2c0', '#7affd8', '#9a7aff'][i]}" stroke-width="${60 - i * 15}" stroke-linecap="round" opacity="${.5 - i * .1}"/>`)); aur(18);
  const stars = add(c, '<g></g>'); for (let i = 0; i < 60; i++) add(stars, `<circle cx="${rnd() * 1920}" cy="${rnd() * 360}" r="${1 + rnd() * 2}" fill="#fff" opacity="${.3 + rnd() * .6}"/>`);
  add(c, `<path d="M0,700 L120,420 L260,560 L420,300 L560,520 L700,640 V720 H0Z" fill="#1f3c55"/><path d="M1920,700 L1800,380 L1680,520 L1540,330 L1420,560 L1300,650 V720 H1920Z" fill="#1f3c55"/>
   <path d="M420,300 L380,360 L420,350 L450,380 L470,340Z M1540,330 L1500,390 L1540,380 L1570,400 L1590,370Z" fill="#dfe9f2" opacity=".85"/>
   <path d="M0,720 L200,560 L330,640 L480,520 L640,690 V740 H0Z" fill="#14293d"/><path d="M1920,730 L1720,560 L1600,650 L1460,540 L1320,700 V740 H1920Z" fill="#14293d"/>
   <rect y="700" width="1920" height="380" fill="url(#fjWater)"/>`);
  const refl = add(c, '<g></g>'); for (let i = 0; i < 9; i++) add(refl, `<rect x="${1180 - (110 - i * 10)}" y="${720 + i * 22}" width="${2 * (110 - i * 10)}" height="6" rx="3" fill="#ffd9a0" opacity=".55"/>`);
  const ship = add(c, `<g><path d="M-170,0 Q0,40 170,0 L190,-30 Q200,-60 214,-70 L200,-20 Q0,30 -200,-20 L-214,-70 Q-200,-60 -190,-30Z" fill="#2a1c14"/><path d="M0,-10 V-230" stroke="#2a1c14" stroke-width="8"/>
    <path d="M-90,-210 H90 Q100,-120 90,-40 H-90 Q-100,-120 -90,-210Z" fill="#b8392e"/><path d="M-30,-210 V-40 M30,-210 V-40" stroke="#e8d6b8" stroke-width="14"/>${Array.from({ length: 7 }, (_, i) => `<circle cx="${-130 + i * 44}" cy="-10" r="12" fill="#c9a24a" stroke="#2a1c14" stroke-width="3"/>`).join('')}</g>`);
  add(c, `<path d="M0,1080 L0,900 Q300,860 700,880 Q1100,870 1500,890 Q1800,880 1920,900 V1080Z" fill="#2b2a2e"/><path d="M0,900 Q300,860 700,880 Q1100,870 1500,890 Q1800,880 1920,900" stroke="#4a4650" stroke-width="6" fill="none"/>
    ${Array.from({ length: 10 }, (_, i) => `<ellipse cx="${100 + i * 190}" cy="${960 + (i % 3) * 40}" rx="${40 + (i % 3) * 20}" ry="14" fill="#3a3840"/>`).join('')}`);
  const fire = add(c, '<g></g>'); add(fire, `<circle r="260" fill="url(#warmGlow)" opacity=".9"/><path d="M-60,10 L60,-10 M-60,-10 L60,10" stroke="#3a2214" stroke-width="16" stroke-linecap="round"/>${Array.from({ length: 9 }, (_, i) => `<ellipse cx="${Math.cos(i / 9 * 6.28) * 80}" cy="${Math.sin(i / 9 * 6.28) * 18 + 10}" rx="22" ry="12" fill="#55505a"/>`).join('')}`);
  const FL = [['#ff6a2a', 70, 150], ['#ffa23a', 50, 115], ['#ffe08a', 28, 70]].map(([col, w, h]) => ({ e: add(fire, `<path fill="${col}"/>`), w, h }));
  const emb = add(c, '<g></g>'); const EM = Array.from({ length: 34 }, () => ({ e: add(emb, '<circle fill="#ffc46a"/>'), x: (rnd() - .5) * 120, ph: rnd(), v: 120 + rnd() * 160, dr: (rnd() - .5) * 120 }));
  return { fire, ship, update(t, fx, fy) {
    AU.forEach((p, i) => { let d = `M-100,${170 + i * 40}`; for (let x = -100; x <= 2020; x += 160) d += ` Q${x + 80},${150 + i * 40 + Math.sin(t * .6 + x * .004 + i) * 60} ${x + 160},${170 + i * 40 + Math.cos(t * .5 + x * .003) * 40}`; p.setAttribute('d', d); });
    refl.setAttribute('transform', `translate(${Math.sin(t * 1.4) * 8},0)`);
    ship.setAttribute('transform', `translate(${1500 - t * 6},${742 + Math.sin(t * 1.3) * 3}) scale(.55)`);
    fire.setAttribute('transform', `translate(${fx},${fy})`);
    FL.forEach((f, i) => { const k = Math.sin(t * 13 + i) * 8, k2 = Math.cos(t * 9 + i * 2) * 10; f.e.setAttribute('d', `M${-f.w},0 Q${-f.w + k},${-f.h * .5} ${k2},${-f.h - Math.sin(t * 17 + i) * 14} Q${f.w + k},${-f.h * .5} ${f.w},0 Q0,${f.w * .3} ${-f.w},0Z`); });
    EM.forEach(e => { const p = (t * e.v / 400 + e.ph) % 1; e.e.setAttribute('cx', fx + e.x + p * e.dr + Math.sin(t * 3 + e.ph * 9) * 10); e.e.setAttribute('cy', fy - 40 - p * 520); e.e.setAttribute('r', 3 * (1 - p) + .5); e.e.setAttribute('opacity', 1 - p); });
  } };
}
function axe(g) { return add(g, `<g transform="rotate(170)"><rect x="-6" y="-20" width="12" height="230" rx="5" fill="#5a3b22"/><path d="M6,170 Q70,150 86,200 Q60,230 8,226Z" fill="#9aa3ad"/><path d="M60,166 Q80,190 74,214" stroke="#dfe6ee" stroke-width="5" fill="none"/></g>`); }
function rimEdge(c) { return add(c, `<g pointer-events="none"><defs><radialGradient id="rimG" cx=".5" cy=".5" r=".75"><stop offset=".72" stop-color="#fff" stop-opacity="0"/><stop offset=".93" stop-color="#ffd6f0" stop-opacity=".22"/><stop offset="1" stop-color="#bfe8ff" stop-opacity=".45"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#rimG)"/></g>`); }
scene(26.5, 31, { trans: 'dissolve', tl: .7, grade: ['#3a7aa0', .12] }, (c, defs) => {
  const F = fjordSet(c, defs); const fg = add(c, '<g></g>'); const vr = Figure(fg, 'vikingReza'), vg = Figure(fg, 'vikingGirl'); axe(vr.P.props);
  const rim = rimEdge(c);
  return t => { F.update(t, 960, 930);
    vr.set({ x: 640, y: 960, s: .82, t, ru: 22, rl: 168, lu: 8, ll: 4, face: { turn: .5, lookX: .8, smile: .15, wind: 1, blink: blinkLoop(t, .3) }, breathe: .5 });
    const ap = vr.P.props.querySelector('g'); const hp = vr.hands.R; ap.setAttribute('transform', `translate(${hp[0]},${hp[1]}) rotate(140)`);
    vg.set({ x: 1290, y: 960, s: .8, flip: -1, t, lu: 10, ll: 30, ru: 10, rl: 30, face: { turn: .5, lookX: .8, smile: .3, wind: 1.4, blink: blinkLoop(t, 1.7) }, breathe: .5 });
    camSet(c, 1.02 + eio(prog(t, 0, 4.5)) * .12, 960, 640); };
});
scene(31, 35, { trans: 'cut', grade: ['#ff8a3d', .1] }, (c, defs) => {
  const F = fjordSet(c, defs); const fg = add(c, '<g></g>'); const vr = Figure(fg, 'vikingReza'), vg = Figure(fg, 'vikingGirl'); axe(vr.P.props);
  const warm = add(c, '<rect width="1920" height="1080" fill="#ff8a3d" opacity=".08"/>'); const rim = rimEdge(c);
  return t => { F.update(t + 4.5, 960, 1260);
    vr.set({ x: 560, y: 1660, s: 1.75, t: t + 4.5, ru: 22, rl: 168, lu: 8, ll: 4, face: { turn: .55, lookX: .9, smile: .2 + .1 * prog(t, 1.5, 3), wind: 1, blink: blinkLoop(t, 1.1, 4.2) } });
    const ap = vr.P.props.querySelector('g'); const hp = vr.hands.R; ap.setAttribute('transform', `translate(${hp[0]},${hp[1]}) rotate(140)`);
    vg.set({ x: 1380, y: 1670, s: 1.7, flip: -1, t: t + 4.5, lu: 10, ll: 30, ru: 10, rl: 30, face: { turn: .55, lookX: .9, smile: .35 + .15 * prog(t, 1.8, 3.2), wind: 1.5, blink: blinkLoop(t, 2.6, 4.2), brow: .1 } });
    warm.setAttribute('opacity', .07 + .04 * Math.sin(t * 11));
    camSet(c, 1 + t * .02, 960, 560, Math.sin(t * .4) * 10); };
});

/* ---------- 12 · Reality: Reza glances ---------- */
scene(35, 37.5, { trans: 'cut', grade: ['#ffb35c', .2] }, (c, defs) => {
  const bgw = add(c, '<g></g>'); const set = cafeSet(bgw, defs, { blurId: 'bl12' }); bgw.setAttribute('transform', 'translate(-1100,-260) scale(1.7)');
  const bok = bokehLayer(c, 10);
  const fg = add(c, '<g></g>'); const mo = Figure(fg, 'mobin'), rz = Figure(fg, 'reza'); const tb = add(fg, '<g></g>'); tableTop(tb, 1010, 1010, 1.6); cup(tb, 900, 990, .9); cup(tb, 1150, 990, .9);
  return t => { set.update(t, .8); set.bl(8); bok(t, .8);
    const look = eio(prog(t, .3, .7)) * (1 - eio(prog(t, 1.7, 2.2)));
    rz.set({ x: 760, y: 1250, s: 1.45, ...POSE.sit, t, lu: 18, ll: 48, ru: -18, rl: -48, face: { turn: lerp(.5, -.25, look), lookX: lerp(.8, -.7, look), smile: .1 + look * .06, blink: blinkLoop(t, 1.2) } });
    mo.set({ x: 1320, y: 1270, s: 1.45, flip: -1, ...POSE.sit, t, lu: 18, ll: 48, ru: -18, rl: -48, face: { turn: .5, lookX: .7, smile: .2, blink: blinkLoop(t, .4) } });
    camSet(c, 1 + t * .02, 960, 520); };
});

/* ---------- 13 · The bubble shatters ---------- */
scene(37.5, 41, { trans: 'cut', grade: ['#ffb35c', .2] }, (c, defs) => {
  const M = girlMedium(c, defs, 'bl13');
  const bub = bubbleSVG(c, 'bub13'); const inner = add(c, '<g></g>');
  add(inner, `<g><circle r="290" fill="#2a5470" opacity=".7"/><circle cx="0" cy="70" r="50" fill="url(#warmGlow)"/></g>`);
  const cracks = add(c, '<g stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"></g>'); const CR = Array.from({ length: 9 }, (_, i) => { const a = i / 9 * 6.28 + rnd() * .3; let d = 'M0,0'; let x = 0, y = 0; for (let k = 0; k < 4; k++) { x += Math.cos(a + (rnd() - .5)) * 75; y += Math.sin(a + (rnd() - .5)) * 75; d += ` L${x.toFixed(0)},${y.toFixed(0)}`; } return add(cracks, `<path d="${d}" stroke-dasharray="320" stroke-dashoffset="320"/>`); });
  const shards = add(c, '<g></g>'); const SH = Array.from({ length: 30 }, () => { const a = rnd() * 6.28, r = rnd() * 260; return { e: add(shards, `<path d="M0,-${10 + rnd() * 20} L${8 + rnd() * 16},${rnd() * 14} L-${8 + rnd() * 12},${6 + rnd() * 10}Z" fill="${rnd() > .5 ? '#ffe6f6' : '#cfefff'}"/>`), x: Math.cos(a) * r, y: Math.sin(a) * r, vx: Math.cos(a) * (200 + rnd() * 400), vy: Math.sin(a) * (200 + rnd() * 300) - 100, rs: (rnd() - .5) * 600 }; });
  return t => { M.set.update(t, 1); M.set.bl(9); M.bok(t, 1);
    const cr = prog(t, .2, .55), br = prog(t, .6, 2.0);
    const down = eio(prog(t, 1.3, 2.2));
    M.gi.set({ x: 820, y: 1700, s: 2.35, t, ...POSE.sit, lu: 20, ll: 60, ru: 25, rl: 65, headTilt: down * 7,
      face: { heart: .9 * (1 - smooth(prog(t, .55, 1.0))), lookX: lerp(.5, .3, down), lookY: lerp(-.4, 1, down), smile: .3 + .25 * prog(t, 1.4, 2.2), brow: .25 * (1 - down), blink: lerp(1, .6, down), turn: .2 } });
    const bx = 1330, by = 400; const on = br < .05;
    disp(bub, on); disp(inner, on); bub.setAttribute('transform', `translate(${bx},${by}) scale(1.05)`); inner.setAttribute('transform', `translate(${bx},${by})`); inner.setAttribute('opacity', .8);
    cracks.setAttribute('transform', `translate(${bx},${by})`); disp(cracks, cr > 0 && on); CR.forEach(p => p.setAttribute('stroke-dashoffset', 320 * (1 - cr)));
    disp(shards, br > 0 && br < 1); SH.forEach(s => { const k = easeOut(br); s.e.setAttribute('transform', `translate(${bx + s.x + s.vx * k},${by + s.y + s.vy * k + br * br * 200}) rotate(${s.rs * br})`); s.e.setAttribute('opacity', (1 - br) * .9); });
    camSet(c, 1.06 - t * .01, 960, 520); };
});
