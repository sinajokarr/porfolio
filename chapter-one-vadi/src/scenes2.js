/* ===== Shots 14–24 : dusk, the car, her home & Yuna, the drive, the phones, the finale ===== */

/* ---------- 14 · Exterior at dusk: she looks back ---------- */
scene(41, 45, { trans: 'dissolve', tl: .7, grade: ['#ff7aa0', .14] }, (c, defs) => {
  add(c, `<defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3a72"/><stop offset=".55" stop-color="#d9708a"/><stop offset="1" stop-color="#ffb07a"/></linearGradient></defs>
   <rect width="1920" height="1080" fill="url(#dusk)"/>
   <rect x="80" y="120" width="1760" height="720" fill="#e2d3bf"/><rect x="80" y="120" width="1760" height="40" fill="#3b2e24"/>
   <rect x="300" y="230" width="1100" height="560" fill="#3b2e24"/>`);
  const winBl = blurFilter(defs, 'bl14w'); const win = add(c, '<g filter="url(#bl14w)"></g>');
  add(win, `<rect x="316" y="246" width="1068" height="528" fill="#ffc77e"/><circle cx="600" cy="320" r="180" fill="url(#warmGlow)"/><circle cx="1150" cy="320" r="160" fill="url(#warmGlow)"/>
    ${[500, 900, 1250].map(x => `<ellipse cx="${x}" cy="640" rx="90" ry="14" fill="#efe6d6"/>`).join('')}`);
  const rzIn = Figure(win, 'reza'); const moIn = Figure(win, 'mobin');
  add(c, `<path d="M850,246 V774" stroke="#3b2e24" stroke-width="14"/><rect x="1500" y="300" width="220" height="540" fill="#3b2e24"/><rect x="1514" y="314" width="192" height="526" fill="#ffc77e" opacity=".7"/>
   <rect y="840" width="1920" height="240" fill="#8d8580"/><rect y="840" width="1920" height="14" fill="#6c6560"/>
   ${[200, 1460].map(x => `<g transform="translate(${x},840)"><path d="M-50,0 L-40,-90 H40 L50,0Z" fill="#cbbba3"/>${Array.from({ length: 10 }, (_, i) => `<circle cx="${Math.cos(i) * 40}" cy="${-120 - Math.sin(i * 1.7) * 40}" r="30" fill="${i % 2 ? '#6d8a52' : '#7f9c62'}"/>`).join('')}</g>`).join('')}`);
  const lamp = add(c, `<g transform="translate(1800,840)"><rect x="-6" y="-500" width="12" height="500" fill="#2a2420"/><circle cy="-510" r="140" fill="url(#warmGlow)"/><circle cy="-510" r="18" fill="#fff3d0"/></g>`);
  const fg = add(c, '<g></g>'); const fr = Figure(fg, 'friend'), gi = Figure(fg, 'girl');
  return t => { winBl(3.5);
    rzIn.set({ x: 1150, y: 980, s: .5, ...POSE.sit, t, face: { turn: -.3, lookX: -.5 } }); moIn.set({ x: 1300, y: 985, s: .52, ...POSE.sit, flip: -1, t });
    const p = t / 4; const w = POSE.walk(t, 1.15), w2 = POSE.walk(t + .3, 1.15);
    const look = eio(prog(t, 1.2, 1.7)) * (1 - eio(prog(t, 2.8, 3.3)));
    gi.set(Object.assign({ x: lerp(900, 330, p), y: 1030 + w.bob, s: .95, t, flip: -1, face: { turn: lerp(.3, -.7, look), lookX: lerp(.4, -1, look), smile: .25 + look * .1, wind: .5, blink: blinkLoop(t, 1) }, headTilt: look * 5 }, w));
    fr.set(Object.assign({ x: lerp(700, 130, p), y: 1035 + w2.bob, s: .98, t, flip: -1, face: { turn: .3 } }, w2));
    camSet(c, 1.03 + t * .01, 960, 560); };
});

/* ---------- 15 · The champagne SUV ---------- */
scene(45, 47.5, { trans: 'cut', grade: ['#5a6aa0', .14] }, (c, defs) => {
  add(c, `<defs><linearGradient id="ngt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2140"/><stop offset=".7" stop-color="#5a4a78"/><stop offset="1" stop-color="#c9708a"/></linearGradient></defs>
   <rect width="1920" height="1080" fill="url(#ngt)"/>`);
  const bk = blurFilter(defs, 'bl15'); const bg = add(c, '<g filter="url(#bl15)"></g>'); bk(6);
  for (let i = 0; i < 12; i++) add(bg, `<rect x="${i * 170}" y="${360 - (i % 3) * 60}" width="140" height="${500 + (i % 3) * 60}" fill="#2a2a44"/>${Array.from({ length: 10 }, (_, k) => `<rect x="${i * 170 + 20}" y="${390 - (i % 3) * 60 + k * 50}" width="100" height="18" fill="${rnd() > .4 ? '#ffd98a' : '#3a3a5a'}" opacity=".8"/>`).join('')}`);
  add(c, `<rect y="860" width="1920" height="220" fill="#2a2830"/><rect y="860" width="1920" height="10" fill="#4a4650"/><path d="M0,980 H1920" stroke="#d9c070" stroke-width="6" stroke-dasharray="80 60" opacity=".6"/>`);
  const lamp = add(c, `<g transform="translate(300,870)"><rect x="-6" y="-560" width="12" height="560" fill="#15151c"/><circle cy="-570" r="200" fill="url(#warmGlow)"/><circle cy="-570" r="20" fill="#fff3d0"/></g>`);
  const carG = add(c, '<g></g>'); const car = Car(carG); const fg = add(c, '<g></g>'); const rz = Figure(fg, 'reza');
  const sweep = add(c, '<rect x="-400" y="0" width="300" height="1080" fill="#fff" opacity=".05" transform="skewX(-20)"/>');
  return t => { const dp = eio(prog(t, 1.2, 1.9));
    car.set({ x: 1080, y: 930, s: .95, door: dp, t });
    const p = eio(prog(t, 0, 1.3)); const w = POSE.walk(t, 1.2, 18);
    const inCar = prog(t, 1.8, 2.4);
    rz.set(Object.assign({ x: lerp(420, 1060, p), y: 1000 + (p < 1 ? w.bob : 0), s: .9, t, face: { turn: .45, lookX: .6, smile: .1 } }, p < 1 ? w : { ru: 40, rl: 60 }));
    rz.g.setAttribute('opacity', 1 - inCar);
    sweep.setAttribute('transform', `translate(${t * 900},0) skewX(-20)`); camSet(c, 1.02 + t * .02, 1000, 620); };
});

/* ---------- 16 · Tattooed hand on the wheel ---------- */
function tattooArm(c) { return add(c, `<g>
  <path d="M-700,260 Q-300,170 40,60 L80,170 Q-280,300 -700,420Z" fill="#f2d1ba"/>
  <path d="M-700,330 Q-300,240 60,120" stroke="#d3a48a" stroke-width="30" opacity=".35" fill="none"/>
  <g stroke="#1d2230" fill="none" stroke-width="5" stroke-linecap="round" opacity=".92">
   <path d="M-640,300 Q-600,260 -560,300 T-480,300 T-400,280 T-320,250 T-240,220 T-160,190 T-80,160"/>
   <path d="M-620,360 Q-560,320 -500,350 T-380,330 T-260,290 T-140,240 T-40,190"/>
   <circle cx="-430" cy="300" r="34"/><path d="M-450,300 L-410,300 M-430,280 L-430,320 M-444,286 L-416,314"/>
   <path d="M-300,240 L-270,200 L-240,240 L-270,280Z"/><path d="M-200,230 q20,-40 50,-10 q-10,30 -50,10Z"/>
   <path d="M-110,190 l20,-30 l20,30 M-100,175 h20"/><path d="M-560,360 l14,-20 l14,20 M-520,350 v-26 l14,8 l-14,8"/></g>
  <g><path d="M40,60 Q120,10 190,40 Q240,70 230,140 Q210,200 140,210 Q80,210 60,170Z" fill="#f2d1ba"/>
   ${[0, 1, 2, 3].map(i => `<path d="M${150 + i * 6},${40 + i * 40} q60,-10 70,20 q-10,22 -60,18" fill="#f2d1ba" stroke="#d3a48a" stroke-width="3"/>`).join('')}
   <path d="M60,170 Q40,120 70,80" stroke="#d3a48a" stroke-width="3" fill="none"/></g></g>`); }
scene(47.5, 50, { trans: 'cut', grade: ['#2a4a7a', .2] }, (c, defs) => {
  add(c, '<rect width="1920" height="1080" fill="#0d1018"/>');
  const bk = blurFilter(defs, 'bl16'); const outside = add(c, '<g filter="url(#bl16)"></g>'); bk(14);
  const LT = Array.from({ length: 22 }, () => ({ e: add(outside, `<circle fill="${rnd() > .5 ? '#ffcf7a' : '#ff7aa0'}"/>`), x: rnd() * 2400, y: 80 + rnd() * 420, r: 20 + rnd() * 40, v: 200 + rnd() * 300 }));
  add(c, `<path d="M0,560 Q960,470 1920,560 V1080 H0Z" fill="#121418"/><path d="M0,560 Q960,470 1920,560" stroke="#2a2e36" stroke-width="8" fill="none"/>`);
  const wheel = add(c, `<g transform="translate(1050,900)"><circle r="430" fill="none" stroke="#1b1c20" stroke-width="70"/><circle r="430" fill="none" stroke="#3a3c44" stroke-width="6" transform="translate(-6,-10)"/>
    <path d="M-400,60 Q0,140 400,60" stroke="#1b1c20" stroke-width="80" fill="none"/><circle r="120" fill="#1b1c20"/><circle r="60" fill="#2a2c32"/></g>`);
  const arm = tattooArm(c);
  const refl = add(c, '<g></g>'); const RF = Array.from({ length: 5 }, () => ({ e: add(refl, '<rect width="420" height="1200" fill="#fff" opacity=".06"/>'), x: rnd() * 2400, v: 500 + rnd() * 400 }));
  return t => { LT.forEach(l => { const x = ((l.x - t * l.v) % 2400 + 2400) % 2400 - 200; l.e.setAttribute('cx', x); l.e.setAttribute('cy', l.y); l.e.setAttribute('r', l.r); l.e.setAttribute('opacity', .6); });
    RF.forEach(r => { const x = ((r.x - t * r.v) % 2600 + 2600) % 2600 - 400; r.e.setAttribute('transform', `translate(${x},-60) skewX(-25)`); });
    arm.setAttribute('transform', `translate(860,580) rotate(${-6 + Math.sin(t * 1.2) * 1.5})`); wheel.setAttribute('transform', `translate(1050,900) rotate(${Math.sin(t * 1.2) * 3})`);
    camSet(c, 1.05 + t * .02, 960, 560); };
});

/* ---------- her home: shared set ---------- */
function homeSet(c, w = 3400) {
  const g = add(c, '<g></g>');
  add(g, `<rect width="${w}" height="1080" fill="#fbe9df"/>${Array.from({ length: Math.ceil(w / 120) }, (_, i) => `<rect x="${i * 120}" y="0" width="60" height="780" fill="#f7e0d4"/>`).join('')}
   <rect y="780" width="${w}" height="300" fill="#e4c4a0"/>${Array.from({ length: Math.ceil(w / 160) }, (_, i) => `<path d="M${i * 160},780 V1080" stroke="#d4b08a" stroke-width="3"/>`).join('')}
   <ellipse cx="1300" cy="960" rx="520" ry="70" fill="#ff9ec0" opacity=".45"/>`);
  // door area (0-500)
  add(g, `<rect x="120" y="140" width="300" height="640" fill="#ffd36a"/><rect x="120" y="140" width="300" height="640" fill="none" stroke="#c9a24a" stroke-width="10"/><g class="hd"><rect x="120" y="140" width="300" height="640" fill="#ff8fab"/><circle cx="390" cy="470" r="12" fill="#c9a24a"/></g>`);
  // sofa + cushions (700-1800)
  add(g, `<g transform="translate(1250,880)"><rect x="-480" y="-250" width="960" height="190" rx="60" fill="#7fc8c0"/><rect x="-520" y="-150" width="110" height="170" rx="44" fill="#6ab5ad"/><rect x="410" y="-150" width="110" height="170" rx="44" fill="#6ab5ad"/>
   <rect x="-420" y="-110" width="840" height="110" rx="34" fill="#8fd4cc"/>${['#ff8fab', '#ffd36a', '#a98bff', '#ff9a5a', '#6fd08a', '#ff6f91'].map((col, i) => `<rect x="${-400 + i * 135}" y="-230" width="120" height="110" rx="30" fill="${col}" transform="rotate(${(i % 2 ? 6 : -6)},${-340 + i * 135},-175)"/>`).join('')}
   <rect x="-440" y="0" width="24" height="40" fill="#b88a5a"/><rect x="416" y="0" width="24" height="40" fill="#b88a5a"/></g>`);
  // framed photos with Yuna
  [[900, 230], [1120, 200], [1340, 250], [1560, 210]].forEach(([x, y], i) => add(g, `<g transform="translate(${x},${y})"><rect x="-80" y="-80" width="160" height="${i % 2 ? 200 : 160}" fill="${['#ffd36a', '#ff8fab', '#a98bff', '#6fd08a'][i]}"/><rect x="-66" y="-66" width="132" height="${i % 2 ? 172 : 132}" fill="#fff4ea"/>
    <circle cx="-14" cy="0" r="22" fill="#e8bf9d"/><path d="M-40,-8 Q-14,-42 12,-8 L16,40 H-44Z" fill="#141118"/><circle cx="-14" cy="2" r="18" fill="#e8bf9d"/><ellipse cx="28" cy="30" rx="18" ry="14" fill="#8a5a35"/><path d="M16,20 L12,0 L24,16 M40,20 L44,0 L32,16" fill="#8a5a35"/><path d="M-50,40 Q-14,20 22,40 V60 H-50Z" fill="#f7f5f2"/></g>`));
  // plants, candles
  const candles = [];
  [[640, 780], [1880, 780], [2900, 780]].forEach(([x, y], i) => add(g, `<g transform="translate(${x},${y})"><path d="M-50,0 L-40,-90 H40 L50,0Z" fill="${['#ff8fab', '#ffd36a', '#a98bff'][i]}"/>${Array.from({ length: 9 }, (_, k) => `<ellipse cx="${Math.cos(k) * 40}" cy="${-130 - Math.sin(k * 1.7) * 50}" rx="34" ry="16" fill="${k % 2 ? '#4fae6a' : '#6fd08a'}" transform="rotate(${k * 30},${Math.cos(k) * 40},${-130 - Math.sin(k * 1.7) * 50})"/>`).join('')}${i === 1 ? '' : `<circle cx="0" cy="-150" r="14" fill="${['#ff6f91', '#fff', '#ffd36a'][i]}"/>`}</g>`));
  [[1960, 640], [2010, 650], [2060, 630]].forEach(([x, y]) => { add(g, `<g transform="translate(${x},${y})"><rect x="-14" y="0" width="28" height="70" rx="4" fill="#fff4ea"/><circle cy="-14" r="40" fill="url(#warmGlow)"/></g>`); candles.push(add(g, `<path fill="#ffb03a" transform="translate(${x},${y})"/>`)); });
  add(g, `<rect x="1920" y="700" width="200" height="80" fill="#c99a70"/>`);
  // wardrobe (2150-2600)
  add(g, `<g transform="translate(2160,140)"><rect width="440" height="640" fill="#fff4ea" stroke="#e7c9b0" stroke-width="10"/><rect x="10" y="10" width="420" height="40" fill="#e7c9b0"/>
    <path d="M30,80 H410" stroke="#b88a5a" stroke-width="6"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${50 + i * 36},84 l-16,30 v220 h32 v-220Z" fill="${['#ff8fab', '#ffd36a', '#6fd08a', '#a98bff', '#ff9a5a', '#7fc8f0'][i % 6]}"/>`).join('')}
    <rect x="30" y="420" width="380" height="200" fill="#f7e0d4"/>${Array.from({ length: 4 }, (_, i) => `<rect x="${50 + i * 90}" y="450" width="70" height="60" rx="8" fill="${['#ffd36a', '#ff8fab', '#7fc8f0', '#6fd08a'][i]}"/>`).join('')}</g>`);
  // Yuna corner (2650-3050)
  add(g, `<g transform="translate(2800,900)"><ellipse rx="150" ry="50" fill="#ff8fab"/><ellipse rx="110" ry="30" fill="#ffd6e2"/><ellipse cx="200" cy="40" rx="44" ry="14" fill="#7fc8f0"/><ellipse cx="300" cy="40" rx="44" ry="14" fill="#ffd36a"/>
    <circle cx="-180" cy="50" r="24" fill="#6fd08a"/><path d="M-120,60 l30,-20 l20,30Z" fill="#ff9a5a"/><path d="M80,-20 q20,-30 40,0 q-20,30 -40,0Z" fill="#a98bff"/></g>`);
  return { g, candles, door: q(g, 'hd'), update(t) { candles.forEach((f, i) => { const k = Math.sin(t * 11 + i) * 2; f.setAttribute('d', `M-7,0 Q${-8 + k},-16 ${k},-28 Q${8 + k},-16 7,0Z`); }); } };
}
/* ---------- 17 · Yuna greets her ---------- */
scene(50, 54, { trans: 'dissolve', tl: .6, grade: ['#ffd36a', .1] }, (c, defs) => {
  const H = homeSet(c);
  const hall = add(c, '<g></g>');
  const fg = add(c, '<g></g>'); const gi = Figure(fg, 'girl'); const yu = Yuna(fg);
  return t => { H.update(t);
    const op = eio(prog(t, 0, .7)); H.door.setAttribute('transform', `translate(120,0) scale(${1 - op * .85},1) translate(-120,0)`);
    const walkIn = eio(prog(t, .3, 1.2)); const w = POSE.walk(t, 1.3);
    const run = prog(t, .6, 1.7), jump = prog(t, 1.7, 2.2); const hold = t > 2.2;
    const lift = eio(prog(t, 1.9, 2.3));
    gi.set(Object.assign({ x: lerp(270, 560, walkIn), y: 1000 + (walkIn < 1 ? w.bob : 0), s: 1.05, t, face: { turn: .4, lookX: .6, lookY: .5 * (1 - lift), smile: .5 + .4 * prog(t, 2.2, 2.6), open: hold ? .3 + Math.abs(Math.sin(t * 7)) * .15 : 0, squint: hold ? .8 : 0, blink: blinkLoop(t, .9), wind: .2 } },
      walkIn < 1 ? w : {}, { ru: lerp(-6, 60, lift), rl: lerp(-4, 130, lift), lu: lerp(6, 40, lift), ll: lerp(4, 100, lift) }));
    let yx = lerp(1700, 760, eio(run)), yy = 1000, rot = 0, jy = 0;
    if (jump > 0) { yx = lerp(760, 640, jump); yy = lerp(1000, 640, eio(jump)); jy = Math.sin(jump * Math.PI) * 120; rot = -10 * Math.sin(jump * Math.PI); }
    if (hold) { yx = 640 + Math.sin(t * 2) * 4; yy = 640; }
    yu.set({ x: yx, y: yy - jy, s: 1.1, flip: -1, run: run > 0 && run < 1, t, rot, tongue: hold && Math.sin(t * 8) > 0, wag: 1, lookUp: hold ? .6 : 0 });
    camSet(c, 1.06 - t * .01, 1000, 600); };
});
/* ---------- 18 · Home reveal (lateral pan) ---------- */
scene(54, 57, { trans: 'cut', grade: ['#ffd36a', .1] }, (c, defs) => {
  const H = homeSet(c); const fg = add(c, '<g></g>'); const yu = Yuna(fg);
  return t => { H.update(t); const p = eio(prog(t, 0, 3));
    yu.set({ x: 2800 + Math.sin(t) * 6, y: 900, s: .9, t, sit: 1, wag: 1, flip: -1 });
    c.setAttribute('transform', `translate(${-lerp(500, 1480, p)},0) translate(0,-40) scale(1.04)`); };
});

/* ---------- 19 · The painting corner ---------- */
function paintingOfReza(c, id) {
  const g = add(c, '<g></g>');
  add(g, `<defs><filter id="${id}p"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="10"/></filter>
    <mask id="${id}m"><rect x="-400" y="-500" width="800" height="1000" fill="#000"/><g class="strokes" stroke="#fff" stroke-linecap="round" fill="none"></g></mask></defs>
    <rect x="-330" y="-430" width="660" height="860" fill="#f6efe2"/>`);
  const art = add(g, `<g mask="url(#${id}m)"><g filter="url(#${id}p)"><rect x="-330" y="-430" width="660" height="860" fill="#26465e"/><path d="M-330,120 L-200,-60 L-90,60 L40,-120 L180,40 L330,-60 V430 H-330Z" fill="#183448"/>
     <circle cx="0" cy="-120" r="300" fill="url(#warmGlow)" opacity=".6"/><g class="who"></g></g></g>`);
  const who = q(art, 'who'); const fig = Figure(who, 'vikingReza'); fig.set({ x: 0, y: 1480, s: 2.3, face: { smile: .1, lookX: .15 } });
  const strokes = q(g, 'strokes'); const ST = Array.from({ length: 16 }, (_, i) => add(strokes, `<path d="M-380,${-440 + i * 60} Q0,${-470 + i * 60 + (i % 2) * 40} 380,${-430 + i * 60}" stroke-width="90" stroke-dasharray="900" stroke-dashoffset="900"/>`));
  add(g, '<rect x="-330" y="-430" width="660" height="860" fill="none" stroke="#c9a24a" stroke-width="14"/>');
  return { g, reveal(p) { ST.forEach((s, i) => s.setAttribute('stroke-dashoffset', 900 * (1 - clamp(p * 16 - i)))); } };
}
scene(57, 63, { trans: 'cut', grade: ['#7aa0ff', .1] }, (c, defs) => {
  const wide = add(c, '<g></g>'), cu = add(c, '<g></g>'), fb = add(c, '<g></g>');
  // wide: window at blue hour, easel, girl from behind, Yuna at her feet
  add(wide, `<defs><linearGradient id="bh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c3a78"/><stop offset="1" stop-color="#c98aa8"/></linearGradient></defs>
    <rect width="1920" height="1080" fill="#f7e0d4"/><rect x="1000" y="90" width="760" height="680" fill="url(#bh)"/>${Array.from({ length: 14 }, (_, i) => `<rect x="${1010 + i * 54}" y="${520 - (i % 4) * 50}" width="40" height="${260 + (i % 4) * 50}" fill="#1e2448" opacity=".85"/>`).join('')}
    ${Array.from({ length: 30 }, () => `<rect x="${1020 + rnd() * 720}" y="${560 + rnd() * 180}" width="6" height="8" fill="#ffd98a"/>`).join('')}
    <rect x="1000" y="90" width="760" height="680" fill="none" stroke="#fff4ea" stroke-width="24"/><path d="M1380,90 V770" stroke="#fff4ea" stroke-width="14"/>
    <rect y="780" width="1920" height="300" fill="#e4c4a0"/>
    <g transform="translate(260,780)"><rect x="-120" y="-260" width="240" height="20" fill="#c99a70"/><rect x="-110" y="-240" width="16" height="240" fill="#b88a5a"/><rect x="94" y="-240" width="16" height="240" fill="#b88a5a"/>
     ${['#ff6f91', '#ffd36a', '#6fd08a', '#7fc8f0', '#a98bff'].map((col, i) => `<rect x="${-100 + i * 40}" y="-310" width="24" height="50" rx="5" fill="${col}"/>`).join('')}<path d="M-80,-262 l-10,-90 M-60,-262 l6,-96 M-40,-262 l-4,-80" stroke="#8a5a35" stroke-width="6"/></g>`);
  const easel = add(wide, `<g transform="translate(960,780)"><path d="M-160,0 L-40,-760 M160,0 L40,-760 M0,-760 V60" stroke="#b88a5a" stroke-width="18"/></g>`);
  const pw = paintingOfReza(wide, 'pw'); pw.g.setAttribute('transform', 'translate(960,330) scale(.62)');
  const gi = Figure(wide, 'girl'); const yf = YunaFront(wide);
  // close-up on canvas + brush
  const pc = paintingOfReza(cu, 'pc'); pc.g.setAttribute('transform', 'translate(960,560) scale(1.5)');
  const brush = add(cu, `<g><path d="M0,0 L380,260" stroke="#c9a24a" stroke-width="18" stroke-linecap="round"/><path d="M0,0 L60,42" stroke="#b9b9c0" stroke-width="22"/><path d="M-30,-22 Q-12,-6 0,0 Q-6,-14 -30,-22Z" fill="#3a5f86"/>
    <ellipse cx="200" cy="140" rx="54" ry="36" fill="#e8bf9d" transform="rotate(35,200,140)"/><path d="M230,160 Q340,240 500,300 L520,420 Q360,360 240,240Z" fill="#e8bf9d"/><path d="M300,220 Q420,280 520,320 L520,420" fill="#f7f5f2" opacity=".0"/></g>`);
  // flashback: warm-toned eyes of Reza
  add(fb, '<rect width="1920" height="1080" fill="#f2d1ba"/>'); const rzf = Figure(fb, 'reza');
  const sepia = add(fb, `<g><rect width="1920" height="1080" fill="#ffb35c" opacity=".35"/><rect width="1920" height="1080" fill="url(#warmGlow)" opacity=".5"/></g>`);
  return t => {
    const A = t < 2, B = (t >= 2 && t < 3.5) || t >= 4.5, Cc = t >= 3.5 && t < 4.5; disp(wide, A); disp(cu, B); disp(fb, Cc);
    const rev = clamp(t / 6 * 1.15);
    if (A) { pw.reveal(rev); gi.set({ x: 900, y: 1130, s: 1.0, back: 1, ...POSE.sit, t, ru: 150 + Math.sin(t * 4) * 6, rl: 175, headTilt: 3 }); yf.set({ x: 1260, y: 1010, s: .9, t, lookUp: .4, tilt: Math.sin(t) * 5 }); camSet(c, 1.02 + t * .02, 960, 520); }
    if (B) { pc.reveal(rev); const pause = t > 3.2 && t < 4.6; const bx = pause ? 1180 : 1080 + Math.sin(t * 5) * 90, by = pause ? 470 : 420 + Math.cos(t * 4) * 50;
      brush.setAttribute('transform', `translate(${bx},${by})`); camSet(c, 1.05 + (t - 2) * .015, 960, 520); }
    if (Cc) { const k = t - 3.5; rzf.set({ x: 960, y: 6440, s: 9, t, face: { lookX: -.3, smile: .15, blink: 1 } }); sepia.setAttribute('opacity', .9); c.setAttribute('opacity', 1); camSet(c, 1 + k * .05, 960, 520); }
  };
});

/* ---------- 20 · Reza driving at night ---------- */
scene(63, 69, { trans: 'dissolve', tl: .5, grade: ['#2a4a7a', .22] }, (c, defs) => {
  const A = add(c, '<g></g>'), B = add(c, '<g></g>'), Cg = add(c, '<g></g>');
  // A — hands
  add(A, '<rect width="1920" height="1080" fill="#0d1018"/>'); const ab = blurFilter(defs, 'bl20a'); const out = add(A, '<g filter="url(#bl20a)"></g>'); ab(16);
  const LT = Array.from({ length: 20 }, () => ({ e: add(out, `<circle fill="${rnd() > .5 ? '#ffb35c' : '#7ac8ff'}"/>`), x: rnd() * 2400, y: 60 + rnd() * 460, r: 18 + rnd() * 40, v: 260 + rnd() * 300 }));
  add(A, `<path d="M0,580 Q960,490 1920,580 V1080 H0Z" fill="#121418"/>`); const wheelA = add(A, `<g><circle r="430" fill="none" stroke="#2c2e36" stroke-width="70"/><circle r="452" fill="none" stroke="#4a4d58" stroke-width="5"/><path d="M-400,60 Q0,140 400,60" stroke="#1b1c20" stroke-width="80" fill="none"/><circle r="120" fill="#1b1c20"/></g>`);
  const armA = tattooArm(A); const armB = tattooArm(A);
  // B — rear-view mirror with his eyes
  add(B, '<rect width="1920" height="1080" fill="#0b0d14"/>'); const bb = blurFilter(defs, 'bl20b'); const outB = add(B, '<g filter="url(#bl20b)"></g>'); bb(20);
  for (let i = 0; i < 14; i++) add(outB, `<circle cx="${rnd() * 1920}" cy="${rnd() * 1080}" r="${30 + rnd() * 60}" fill="${rnd() > .5 ? '#ffb35c' : '#7ac8ff'}" opacity=".35"/>`);
  add(B, `<g transform="translate(960,520)"><rect x="-640" y="-200" width="1280" height="400" rx="140" fill="#15161a"/><clipPath id="mir"><rect x="-610" y="-172" width="1220" height="344" rx="120"/></clipPath><g clip-path="url(#mir)"><rect x="-700" y="-300" width="1400" height="600" fill="#1d2230"/><g class="mf"></g><rect class="ls" x="-900" y="-300" width="260" height="600" fill="#ffd98a" opacity=".18" transform="skewX(-20)"/></g>
    <rect x="-610" y="-172" width="1220" height="344" rx="120" fill="none" stroke="#2a2c34" stroke-width="6"/><path d="M-560,-140 Q-300,-170 -100,-150" stroke="#fff" stroke-width="6" opacity=".12" fill="none"/></g>`);
  const mf = B.querySelector('.mf'); const rzM = Figure(mf, 'reza'); const lsB = B.querySelector('.ls');
  // C — through the windshield, medium
  add(Cg, '<rect width="1920" height="1080" fill="#0d1018"/>'); const cb = blurFilter(defs, 'bl20c'); const outC = add(Cg, '<g filter="url(#bl20c)"></g>'); cb(18);
  const LC = Array.from({ length: 16 }, () => ({ e: add(outC, `<circle fill="${rnd() > .5 ? '#ffb35c' : '#7ac8ff'}" opacity=".4"/>`), x: rnd() * 2400, y: rnd() * 700, r: 30 + rnd() * 70, v: 120 + rnd() * 200 }));
  add(Cg, `<rect x="0" y="0" width="1920" height="1080" fill="#20242e" opacity=".6"/>`); const rzC = Figure(Cg, 'reza');
  add(Cg, `<path d="M0,960 H1920 V1080 H0Z" fill="#0b0c10"/><g transform="translate(960,1110)"><circle r="360" fill="none" stroke="#14151a" stroke-width="56"/></g><path d="M0,0 L180,0 L80,1080 H0Z M1920,0 L1740,0 L1840,1080 H1920Z" fill="#08090c"/>`);
  const sweep = add(Cg, '<rect x="-600" y="0" width="300" height="1080" fill="#ffd98a" opacity=".14" transform="skewX(-15)"/>');
  return t => { const a = t < 2.3, b = t >= 2.3 && t < 4.2, cc = t >= 4.2; disp(A, a); disp(B, b); disp(Cg, cc);
    if (a) { LT.forEach(l => { const x = ((l.x - t * l.v) % 2400 + 2400) % 2400 - 200; l.e.setAttribute('cx', x); l.e.setAttribute('cy', l.y); l.e.setAttribute('r', l.r); });
      wheelA.setAttribute('transform', `translate(960,1000) rotate(${Math.sin(t) * 4})`); armA.setAttribute('transform', `translate(500,560) rotate(-4)`); armB.setAttribute('transform', `translate(1420,560) scale(-1,1) rotate(-4)`); camSet(c, 1.03 + t * .02); }
    if (b) { const k = t - 2.3; rzM.set({ x: 0, y: 6090, s: 9, t, face: { lookX: -.25, lookY: -.1, smile: .05 + .18 * smooth(prog(k, .7, 1.2)) * (1 - smooth(prog(k, 1.5, 1.9))), blink: blinkLoop(k, .4, 2.2) } });
      lsB.setAttribute('transform', `translate(${((k * 900) % 2000) - 200},0) skewX(-20)`); camSet(c, 1 + k * .03); }
    if (cc) { const k = t - 4.2; LC.forEach(l => { const x = ((l.x - k * l.v) % 2400 + 2400) % 2400 - 200; l.e.setAttribute('cx', x); l.e.setAttribute('cy', l.y); l.e.setAttribute('r', l.r); });
      rzC.set({ x: 960, y: 2560, s: 3.1, t, lu: 30, ll: 80, ru: -30, rl: -80, face: { turn: .05, lookX: .1, smile: .12, blink: blinkLoop(k, .8) } });
      sweep.setAttribute('transform', `translate(${((k * 1300) % 2800) - 600},0) skewX(-15)`); camSet(c, 1 + k * .02, 960, 500); } };
});

/* ---------- phone UI (abstract, no text) ---------- */
function phone(c, id) {
  const g = add(c, `<g><rect x="-200" y="-400" width="400" height="800" rx="56" fill="#111"/><clipPath id="${id}"><rect x="-184" y="-384" width="368" height="768" rx="44"/></clipPath>
    <g clip-path="url(#${id})"><rect class="scr" x="-184" y="-384" width="368" height="768" fill="#0c0c10"/><g class="ui"></g></g><rect x="-60" y="-376" width="120" height="26" rx="13" fill="#000"/></g>`);
  return { g, scr: q(g, 'scr'), ui: q(g, 'ui') };
}
function miniGirl(x, y, s = 1) { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-30,-20 Q0,-60 30,-20 L36,50 H-36Z" fill="#141118"/><ellipse cx="0" cy="-4" rx="20" ry="24" fill="#e8bf9d"/><path d="M-8,6 Q0,12 8,6" stroke="#7a3b3b" stroke-width="2.5" fill="none"/><circle cx="-7" cy="-6" r="2.4" fill="#2a1a14"/><circle cx="7" cy="-6" r="2.4" fill="#2a1a14"/><path d="M-36,50 Q0,30 36,50 V70 H-36Z" fill="#f7f5f2"/></g>`; }
function miniYuna(x, y, s = 1) { return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="10" rx="20" ry="16" fill="#8a5a35"/><path d="M-14,0 L-26,-26 L-4,-8 M14,0 L26,-26 L4,-8" fill="#8a5a35"/><circle cx="-6" cy="4" r="2.4" fill="#2a1a14"/><circle cx="6" cy="4" r="2.4" fill="#2a1a14"/><circle cx="-6" cy="-2" r="1.6" fill="#f3dcb5"/><circle cx="6" cy="-2" r="1.6" fill="#f3dcb5"/><ellipse cx="0" cy="16" rx="6" ry="4" fill="#f6efe4"/></g>`; }
function miniReza(x, y, s = 1) { return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="-4" rx="20" ry="24" fill="#f2d1ba"/><path d="M-20,-14 Q0,-40 20,-14 Q10,-26 0,-26 Q-10,-26 -20,-14Z" fill="#d8b468"/><path d="M-20,0 Q-18,30 0,40 Q18,30 20,0 Q10,14 0,14 Q-10,14 -20,0Z" fill="#cfa962"/><circle cx="-7" cy="-6" r="2.4" fill="#c58a2a"/><circle cx="7" cy="-6" r="2.4" fill="#c58a2a"/><path d="M-36,50 Q0,34 36,50 V70 H-36Z" fill="#1e1f24"/></g>`; }

/* ---------- 21 · The notification ---------- */
scene(69, 74, { trans: 'cut', grade: ['#7aa0ff', .12] }, (c, defs) => {
  const A = add(c, '<g></g>'), B = add(c, '<g></g>');
  add(A, `<rect width="1920" height="1080" fill="#e9d6c4"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${200 + i * 210},${100 + (i % 3) * 120} l${240 - (i % 2) * 80},${560 + (i % 3) * 60}" stroke="${['#c9a24a', '#b88a5a'][i % 2]}" stroke-width="22" stroke-linecap="round"/>`).join('')}
    <g transform="translate(1500,760)"><ellipse rx="300" ry="200" fill="#f4ebde"/>${['#ff6f91', '#ffd36a', '#6fd08a', '#7fc8f0', '#a98bff', '#ff9a5a'].map((col, i) => `<circle cx="${Math.cos(i) * 180}" cy="${Math.sin(i) * 110}" r="44" fill="${col}"/>`).join('')}</g>`);
  const ph = phone(A, 'ph21'); ph.g.setAttribute('transform', 'translate(860,560) rotate(-12) scale(1.1)');
  const banner = add(ph.ui, `<g><rect x="-170" y="-330" width="340" height="120" rx="26" fill="#2a2a32"/><circle cx="-118" cy="-270" r="36" fill="#d8b468"/>${miniReza(-118, -264, .9)}
    <rect x="-66" y="-300" width="150" height="16" rx="8" fill="#8a8a96"/><rect x="-66" y="-268" width="200" height="12" rx="6" fill="#5a5a66"/><rect x="-66" y="-244" width="120" height="12" rx="6" fill="#5a5a66"/>
    <g transform="translate(130,-292)"><circle r="18" fill="#ff4f8b"/><circle cx="-4" cy="-4" r="5" fill="#fff"/><path d="M-12,8 Q-4,-2 4,8" stroke="#fff" stroke-width="4" fill="none"/><path d="M8,-2 h8 M12,-6 v8" stroke="#fff" stroke-width="3"/></g></g>`);
  const banner2 = add(ph.ui, `<g><rect x="-170" y="-190" width="340" height="110" rx="26" fill="#2a2a32"/><circle cx="-118" cy="-135" r="34" fill="#d8b468"/>${miniReza(-118, -129, .85)}
    <rect x="-66" y="-160" width="150" height="16" rx="8" fill="#8a8a96"/><rect x="-66" y="-130" width="180" height="12" rx="6" fill="#5a5a66"/>
    <g transform="translate(130,-150)"><path d="M-18,-12 H18 V10 H0 L-10,20 V10 H-18Z" fill="#7a8cff"/></g></g>`);
  const glowA = add(A, '<circle cx="860" cy="560" r="600" fill="url(#cyanGlow)" opacity="0"/>');
  // B — her face lit by the phone
  add(B, '<rect width="1920" height="1080" fill="#3a3040"/><rect x="1200" y="0" width="720" height="1080" fill="#2c3a78" opacity=".6"/>');
  const gi = Figure(B, 'girl'); const yf = YunaFront(B); const lit = add(B, '<circle cx="900" cy="760" r="700" fill="url(#cyanGlow)" opacity=".25"/>');
  return t => { const a = t < 2; disp(A, a); disp(B, !a);
    if (a) { const on = prog(t, .4, .6); ph.scr.setAttribute('fill', on > 0 ? '#1a1a22' : '#0c0c10');
      banner.setAttribute('transform', `translate(0,${lerp(-200, 0, easeOut(prog(t, .45, .85)))})`); banner2.setAttribute('transform', `translate(0,${lerp(-340, 0, easeOut(prog(t, 1.0, 1.4)))})`);
      glowA.setAttribute('opacity', on * .35); camSet(c, 1 + t * .05, 860, 520); }
    else { const k = t - 2;
      const sur = smooth(prog(k, 0, .4)) * (1 - smooth(prog(k, 1.0, 1.5)));
      const smile = smooth(prog(k, .9, 1.6)), dis = smooth(prog(k, 1.6, 2.0)) * (1 - smooth(prog(k, 2.2, 2.6)));
      gi.set({ x: 900, y: 1990, s: 2.8, t, ...POSE.sit, ru: -15, rl: -30, lu: 10, ll: 30, headTilt: dis * -4,
        face: { lookY: .7, lookX: -.1, brow: sur * .9 + dis * .4, open: sur * .35, smile: .15 + smile * .55 - dis * .2, blink: k > 2.4 && k < 2.56 ? Math.abs(k - 2.48) / .08 : 1, squint: smile * .3 } });
      yf.set({ x: 1540, y: 1080, s: 1.1, t, lookUp: smooth(prog(k, 1.0, 1.4)), tilt: 10 * smooth(prog(k, 1.2, 1.8)), look: -1 });
      lit.setAttribute('opacity', .22 + .04 * Math.sin(t * 3)); camSet(c, 1 + k * .03, 960, 520); } };
});

/* ---------- 22 · Reza's apartment ---------- */
function rezaApt(c, defs) {
  add(c, `<defs><linearGradient id="nightCity" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1026"/><stop offset="1" stop-color="#26305a"/></linearGradient></defs>
   <rect width="1920" height="1080" fill="#3a3e46"/><rect y="0" width="1920" height="1080" fill="#2a2d33" opacity=".5"/>
   <rect x="1180" y="60" width="700" height="760" fill="url(#nightCity)"/>`);
  const city = add(c, '<g></g>'); for (let i = 0; i < 16; i++) { const x = 1190 + i * 44, h = 180 + ((i * 37) % 260); add(city, `<rect x="${x}" y="${820 - h}" width="36" height="${h}" fill="#141a34"/>`); for (let k = 0; k < h / 26; k++) if (rnd() > .45) add(city, `<rect x="${x + 6 + (k % 2) * 14}" y="${830 - h + k * 26}" width="8" height="10" fill="#ffd98a" opacity="${.5 + rnd() * .5}"/>`); }
  add(c, `<path d="M1180,60 V820 M1530,60 V820 M1180,440 H1880" stroke="#1c1e22" stroke-width="14"/><rect x="1180" y="60" width="700" height="760" fill="none" stroke="#1c1e22" stroke-width="20"/>
   <rect y="820" width="1920" height="260" fill="#26282d"/><rect y="820" width="1920" height="12" fill="#1c1e22"/>
   <g transform="translate(560,0)"><rect x="-300" y="230" width="600" height="340" rx="10" fill="#0a0b0d"/><rect x="-290" y="240" width="580" height="320" fill="#111317"/><path d="M-280,250 L-120,250 L-260,550 H-280Z" fill="#fff" opacity=".04"/>
     ${[-460, 460].map(x => `<g transform="translate(${x},0)"><rect x="-110" y="150" width="220" height="600" fill="#2f3238"/>${[260, 400, 540].map(y => `<rect x="-100" y="${y}" width="200" height="10" fill="#4a4e56"/>`).join('')}
      <rect x="-70" y="${200}" width="30" height="58" fill="#8a8e96"/><circle cx="40" cy="234" r="22" fill="#c9a24a"/><rect x="-60" y="350" width="80" height="50" fill="#5a5e66"/><path d="M30,390 l20,-40 l20,40Z" fill="#9aa0a8"/><rect x="-80" y="490" width="50" height="50" fill="#1c1e22"/><rect x="0" y="470" width="60" height="70" rx="30" fill="#6a6e76"/></g>`).join('')}
     <rect x="-360" y="600" width="720" height="70" fill="#1f2125"/></g>
   <g transform="translate(70,180)"><rect width="300" height="380" fill="#e8e8e8"/><path d="M20,340 Q120,120 280,60" stroke="#1a1a1a" stroke-width="28" fill="none"/><circle cx="200" cy="260" r="60" fill="#7a7a7a"/><rect x="40" y="40" width="90" height="90" fill="#2a2a2a"/></g>
   <g transform="translate(560,860)"><rect x="-420" y="-140" width="840" height="130" rx="40" fill="#5a5e66"/><rect x="-460" y="-60" width="110" height="120" rx="36" fill="#4a4e56"/><rect x="350" y="-60" width="110" height="120" rx="36" fill="#4a4e56"/><rect x="-380" y="-30" width="760" height="90" rx="26" fill="#666a72"/></g>
   <ellipse cx="560" cy="980" rx="420" ry="40" fill="#1c1e22"/>`);
  const armchair = add(c, `<g transform="translate(1400,860)"><rect x="-170" y="-260" width="340" height="230" rx="60" fill="#6a6e76"/><rect x="-200" y="-110" width="80" height="150" rx="34" fill="#5a5e66"/><rect x="120" y="-110" width="80" height="150" rx="34" fill="#5a5e66"/><rect x="-130" y="-60" width="260" height="90" rx="26" fill="#767a82"/></g>`);
  const lampG = add(c, `<g transform="translate(1020,820)"><rect x="-5" y="-520" width="10" height="520" fill="#1c1e22"/><path d="M-60,-520 L60,-520 L40,-600 H-40Z" fill="#d9c9a8"/><circle cy="-540" r="260" fill="url(#warmGlow)" opacity=".55"/></g>`);
  return { armchair };
}
scene(74, 83, { trans: 'dissolve', tl: .6, grade: ['#4a6aa0', .14] }, (c, defs) => {
  const A = add(c, '<g></g>'), B = add(c, '<g></g>'), Cg = add(c, '<g></g>');
  rezaApt(A, defs); const fgA = add(A, '<g></g>'); const rz = Figure(fgA, 'rezaHome'); const mugA = add(rz.P.props, `<g><rect x="-16" y="-24" width="32" height="38" rx="6" fill="#e8e2d6"/></g>`);
  // B — phone scroll
  add(B, '<rect width="1920" height="1080" fill="#1c1e24"/><circle cx="960" cy="540" r="700" fill="url(#cyanGlow)" opacity=".12"/>');
  const ph = phone(B, 'ph22'); ph.g.setAttribute('transform', 'translate(960,560) scale(1.25)');
  const grid = add(ph.ui, '<g></g>'); ph.scr.setAttribute('fill', '#121218');
  const tiles = [];
  const art = [i => `<rect width="112" height="112" fill="#ffd6e2"/>${miniGirl(56, 50, 1)}`, i => `<rect width="112" height="112" fill="#fbe9df"/>${miniYuna(56, 60, 1.4)}`, i => `<rect width="112" height="112" fill="#7fc8c0"/>${['#ff8fab', '#ffd36a', '#a98bff'].map((cc, k) => `<rect x="${10 + k * 34}" y="56" width="30" height="30" rx="8" fill="${cc}"/>`).join('')}`,
    i => `<rect width="112" height="112" fill="#26465e"/><circle cx="56" cy="50" r="22" fill="#f2d1ba"/><path d="M30,112 L56,70 L82,112Z" fill="#5a3b26"/>`, i => `<rect width="112" height="112" fill="#ffd6e2"/>${miniGirl(42, 50, .9)}${miniYuna(80, 74, 1)}`, i => `<rect width="112" height="112" fill="#a98bff"/><circle cx="56" cy="56" r="30" fill="#ffd36a"/>`];
  for (let i = 0; i < 24; i++) tiles.push(add(grid, `<g transform="translate(${-178 + (i % 3) * 120},${-260 + Math.floor(i / 3) * 120})">${art[i % 6](i)}</g>`));
  const hero = add(ph.ui, `<g><rect x="-184" y="-384" width="368" height="768" fill="#121218"/><g transform="translate(-170,-220) scale(3.04)">${art[4](0)}</g></g>`);
  // C — his face softening, city window
  add(Cg, '<rect width="1920" height="1080" fill="#2a2d33"/><rect x="980" y="0" width="940" height="1080" fill="#0b1026"/>');
  for (let i = 0; i < 40; i++) add(Cg, `<circle cx="${1000 + rnd() * 900}" cy="${300 + rnd() * 700}" r="${8 + rnd() * 24}" fill="#ffd98a" opacity="${.15 + rnd() * .25}"/>`);
  const rzC = Figure(Cg, 'rezaHome'); add(Cg, '<circle cx="640" cy="760" r="500" fill="url(#warmGlow)" opacity=".3"/>');
  return t => { const a = t < 3.5, b = t >= 3.5 && t < 6.5, cc = t >= 6.5; disp(A, a); disp(B, b); disp(Cg, cc);
    if (a) { const p = eio(prog(t, 0, 2.2)), sit = eio(prog(t, 2.2, 3.0)); const w = POSE.walk(t, 1.05, 16);
      rz.set(Object.assign({ x: lerp(500, 1400, p), y: lerp(1000, 980, p) + (p < 1 ? w.bob * .6 : 0), s: .85, t, face: { turn: .3, lookX: .5, smile: .05 } }, p < 1 ? w : {},
        { drop: 150 * sit, thighF: lerp(1, .2, sit), ru: lerp(-6, 60, Math.max(sit, .6)), rl: lerp(-4, 150, Math.max(sit, .6)) }));
      camSet(c, 1.02 + t * .015, 1100, 540); }
    if (b) { const k = t - 3.5; const sc = eio(prog(k, .2, 1.8)) * 600; grid.setAttribute('transform', `translate(0,${-sc})`);
      const h = smooth(prog(k, 2.0, 2.6)); hero.setAttribute('opacity', h); hero.setAttribute('transform', `scale(${lerp(.4, 1, h)})`); camSet(c, 1 + k * .03); }
    if (cc) { const k = t - 6.5; const soft = smooth(prog(k, .1, .9)), out = smooth(prog(k, 1.0, 1.6)) * (1 - smooth(prog(k, 2.0, 2.5)));
      rzC.set({ x: 640, y: 1830, s: 2.5, ...POSE.sit, t, ru: 35, rl: 150, lu: 30, ll: 60, face: { turn: lerp(-.2, .45, out), lookX: lerp(-.3, .9, out), lookY: lerp(.5, -.1, out), smile: .1 + soft * .35, brow: soft * .2, blink: blinkLoop(k, .6, 2.4), squint: soft * .3 } });
      camSet(c, 1 + k * .03, 900, 520); } };
});

/* ---------- 23 · Parallel split-screen ---------- */
scene(83, 89, { trans: 'dissolve', tl: .5, grade: ['#4a5aa0', .12] }, (c, defs) => {
  const L = add(c, '<g></g>'), R = add(c, '<g></g>');
  add(c, `<defs><clipPath id="cL"><rect class="cl" x="0" y="0" width="958" height="1080"/></clipPath><clipPath id="cR"><rect class="cr" x="962" y="0" width="958" height="1080"/></clipPath></defs>`);
  L.setAttribute('clip-path', 'url(#cL)'); R.setAttribute('clip-path', 'url(#cR)');
  add(L, '<rect width="960" height="1080" fill="#2a2d33"/><rect x="0" y="0" width="560" height="1080" fill="#0b1026"/>');
  for (let i = 0; i < 30; i++) add(L, `<circle cx="${rnd() * 540}" cy="${300 + rnd() * 700}" r="${8 + rnd() * 22}" fill="#ffd98a" opacity="${.15 + rnd() * .3}"/>`);
  const rz = Figure(L, 'rezaHome'); const phL = phone(L, 'p23l');
  const tileL = add(phL.ui, `<g><rect x="-184" y="-384" width="368" height="768" fill="#ffd6e2"/>${miniGirl(-40, -40, 3)}${miniYuna(90, 60, 3)}</g>`);
  add(R, '<rect x="960" width="960" height="1080" fill="#f7e0d4"/><rect x="1380" y="0" width="540" height="760" fill="#1e2448"/>');
  for (let i = 0; i < 30; i++) add(R, `<circle cx="${1400 + rnd() * 500}" cy="${200 + rnd() * 540}" r="${6 + rnd() * 18}" fill="#ffd98a" opacity="${.2 + rnd() * .3}"/>`);
  add(R, `<path d="M1380,0 V760 H1920" stroke="#fff4ea" stroke-width="20" fill="none"/>${Array.from({ length: 12 }, (_, i) => `<circle cx="${980 + i * 80}" cy="${70 + Math.sin(i) * 20}" r="8" fill="#ffd36a"/>`).join('')}
    <rect x="960" y="760" width="960" height="320" fill="#ff9ec0"/><rect x="960" y="740" width="960" height="60" rx="30" fill="#ffd6e2"/><ellipse cx="1180" cy="760" rx="160" ry="44" fill="#fff4ea"/>`);
  const giG = add(R, '<g></g>'); const gi = Figure(giG, 'girl'); const yuG = add(R, '<g></g>'); const yu = Yuna(yuG);
  add(R, '<path d="M960,860 Q1400,800 1920,860 V1080 H960Z" fill="#ffb3cc"/>');
  const phR = phone(R, 'p23r'); const tileR = add(phR.ui, '<g></g>');
  const tR = [`<rect x="-184" y="-384" width="368" height="768" fill="#1c2140"/><g transform="translate(0,120) scale(.36)"><g class="carS"></g></g>`,
    `<rect x="-184" y="-384" width="368" height="768" fill="#f2d1ba"/><g transform="translate(40,0) scale(.5) rotate(-30)"><g class="armS"></g></g>`,
    `<rect x="-184" y="-384" width="368" height="768" fill="#0b1026"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${-180 + i * 46}" y="${100 - (i % 3) * 60}" width="38" height="${300 + (i % 3) * 60}" fill="#141a34"/>`).join('')}${miniReza(0, -60, 3)}`];
  const TR_ = tR.map(h => add(tileR, `<g>${h}</g>`)); Car(q(TR_[0], 'carS')).set({ x: 0, y: 0, s: 1 }); tattooArm(q(TR_[1], 'armS'));
  const glowR = add(R, '<circle cx="1300" cy="640" r="400" fill="url(#cyanGlow)" opacity=".25"/>');
  const divider = add(c, '<rect x="958" y="0" width="4" height="1080" fill="#000"/>');
  return t => {
    const both = smooth(prog(t, 3.6, 4.2));
    rz.set({ x: 520, y: 1700, s: 2.2, t, ...POSE.sit, ru: 35, rl: 150, lu: 40, ll: 120, face: { turn: .3, lookX: .4, lookY: .6, smile: .12 + both * .35, blink: blinkLoop(t, .3, 3.1), squint: both * .3 } });
    phL.g.setAttribute('transform', 'translate(700,760) rotate(-8) scale(.62)');
    gi.set({ x: 0, y: 0, s: 1, t, face: { turn: -.2, lookX: .6, lookY: .3, smile: .15 + both * .45, blink: blinkLoop(t, 1.9, 3.3), squint: both * .3 }, lu: 120, ll: 200, ru: 140, rl: 210 });
    giG.setAttribute('transform', 'translate(1930,800) rotate(-90) scale(.95)');
    yu.set({ x: 0, y: 0, s: .95, t, sit: 1, wag: .2, blink: (t > 2 && t < 2.6) ? .1 : 1 }); yuG.setAttribute('transform', 'translate(1500,700) scale(-.75,.75)');
    phR.g.setAttribute('transform', 'translate(1430,520) rotate(6) scale(.55)');
    const idx = Math.min(2, Math.floor(t / 1.5)); TR_.forEach((g2, i) => disp(g2, i === idx || (t > 4.5 && i === 2)));
    glowR.setAttribute('opacity', .22 + .04 * Math.sin(t * 2));
    const merge = smooth(prog(t, 5.0, 6.0)); divider.setAttribute('opacity', 1 - merge); camSet(c, 1 + t * .01); };
});

/* ---------- 24 · Finale: windows, skyline, runes dissolving into stars ---------- */
scene(89, 96, { trans: 'dissolve', tl: .6, grade: ['#3a4a9a', .15] }, (c, defs) => {
  const A = add(c, '<g></g>'), B = add(c, '<g></g>'), Cg = add(c, '<g></g>');
  // A — her building, her lit window
  add(A, `<rect width="1920" height="1080" fill="#151a36"/>${Array.from({ length: 60 }, () => `<circle cx="${rnd() * 1920}" cy="${rnd() * 300}" r="${1 + rnd() * 2}" fill="#fff" opacity=".6"/>`).join('')}
    <rect x="360" y="120" width="1200" height="1000" fill="#d9c9b8"/>${Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, k) => `<rect x="${430 + k * 290}" y="${180 + r * 240}" width="200" height="170" fill="${(r === 2 && k === 1) ? '#ffd98a' : (rnd() > .6 ? '#e8b46a' : '#2a2f4a')}"/>`).join('')).join('')}`);
  const win = add(A, `<g transform="translate(720,660)"><rect x="0" y="0" width="200" height="170" fill="#ffd2a0"/><rect x="0" y="110" width="200" height="60" fill="#ff9ec0"/><path d="M40,110 Q60,90 120,96 L150,110Z" fill="#141118"/><ellipse cx="160" cy="104" rx="16" ry="10" fill="#8a5a35"/><rect x="10" y="30" width="44" height="60" fill="#26465e"/><circle cx="32" cy="52" r="8" fill="#f2d1ba"/><rect x="0" y="0" width="200" height="170" fill="none" stroke="#fff4ea" stroke-width="8"/><path d="M100,0 V170" stroke="#fff4ea" stroke-width="5"/></g>`);
  // B — his tower window
  add(B, `<rect width="1920" height="1080" fill="#0b1026"/><rect x="560" y="0" width="800" height="1080" fill="#1a2040"/>${Array.from({ length: 10 }, (_, r) => Array.from({ length: 5 }, (_, k) => `<rect x="${600 + k * 150}" y="${40 + r * 110}" width="120" height="80" fill="${(r === 6 && k === 2) ? '#ffd98a' : (rnd() > .7 ? '#c9a46a' : '#232a50')}"/>`).join('')).join('')}
    <g transform="translate(900,700)"><ellipse cx="60" cy="60" rx="22" ry="26" fill="#2a1a10"/><path d="M30,80 Q60,70 90,80 V80 H30Z" fill="#1a1010"/><path d="M20,80 Q60,60 100,80 L100,80 H20Z" fill="#1a1010"/></g>`);
  // C — skyline + runes
  add(Cg, `<defs><linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070a1c"/><stop offset=".7" stop-color="#1e2a5a"/><stop offset="1" stop-color="#3a3070"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#fsky)"/>`);
  const stars = add(Cg, '<g></g>'); const SS = Array.from({ length: 140 }, () => ({ e: add(stars, '<circle fill="#fff"/>'), x: rnd() * 1920, y: rnd() * 640, r: .8 + rnd() * 2.2, ph: rnd() * 6 }));
  add(Cg, `<path d="M0,860 Q480,820 960,850 T1920,840 V1080 H0Z" fill="#0e1430"/><g fill="#0a0e22">${Array.from({ length: 30 }, (_, i) => { const h = 80 + ((i * 53) % 220); return `<rect x="${i * 66}" y="${860 - h}" width="56" height="${h}"/>`; }).join('')}
     <g transform="translate(980,860)"><path d="M-120,0 V-90 Q-120,-140 -70,-140 Q-70,-200 0,-206 Q70,-200 70,-140 Q120,-140 120,-90 V0Z"/><rect x="-170" y="-300" width="14" height="300"/><rect x="156" y="-300" width="14" height="300"/></g></g>
    <path d="M1200,820 L1920,800" stroke="#ffd98a" stroke-width="4" opacity=".6"/><path d="M1300,817 Q1500,760 1700,806" stroke="#ffd98a" stroke-width="3" fill="none" opacity=".6"/>
    ${Array.from({ length: 80 }, () => `<rect x="${rnd() * 1920}" y="${700 + rnd() * 150}" width="4" height="5" fill="#ffd98a" opacity="${.4 + rnd() * .5}"/>`).join('')}`);
  const rb = blurFilter(defs, 'runeB');
  const runes = add(Cg, '<g fill="none" stroke-linecap="round" stroke-linejoin="round"></g>');
  const RN = ['M0,-60 V60 M0,-60 L30,-30 M0,-20 L30,10', 'M-24,-60 V60 M-24,-60 L24,-20 L-24,20', 'M0,-60 V60 M-30,-30 L30,30 M30,-30 L-30,30', 'M-20,-60 V60 M-20,-30 L20,-60 M-20,0 L20,-30', 'M0,-60 V60 M0,-60 L-28,-24 M0,-60 L28,-24'];
  const RG = RN.map((d, i) => { const x = 520 + i * 220, y = 300 + Math.sin(i * 1.3) * 60; const gg = add(runes, `<g transform="translate(${x},${y})"><path d="${d}" stroke="#bff6ff" stroke-width="18" opacity=".35" filter="url(#runeB)"/><path d="${d}" stroke="#e8fbff" stroke-width="6" stroke-dasharray="240" stroke-dashoffset="240"/></g>`); return { g: gg, x, y, core: gg.lastElementChild }; });
  const dust = add(Cg, '<g></g>'); const DU = Array.from({ length: 60 }, (_, i) => ({ e: add(dust, '<circle fill="#e8fbff"/>'), r: RG[i % 5], a: rnd() * 6.28, d: 20 + rnd() * 160 }));
  const fade = add(c, '<rect width="1920" height="1080" fill="#000" opacity="0"/>');
  return t => { const a = t < 2.8, b = t >= 2.8 && t < 4.2, cc = t >= 4.2; disp(A, a); disp(B, b); disp(Cg, cc); rb(8);
    if (a) { const p = eio(prog(t, 0, 2.8)); camSet(c, lerp(3.6, 1.15, p), lerp(820, 960, p), lerp(745, 620, p)); }
    if (b) { const k = t - 2.8; camSet(c, lerp(1.8, 1.5, k / 1.4), 960, 740); }
    if (cc) { const k = t - 4.2; SS.forEach(s => { s.e.setAttribute('cx', s.x); s.e.setAttribute('cy', s.y); s.e.setAttribute('r', s.r * (.7 + .3 * Math.sin(t * 3 + s.ph))); });
      RG.forEach((r, i) => { const on = prog(k, .1 + i * .15, .7 + i * .15), off = prog(k, 1.6, 2.4); r.core.setAttribute('stroke-dashoffset', 240 * (1 - on)); r.g.setAttribute('opacity', 1 - off); });
      DU.forEach(d => { const p = prog(k, 1.6, 2.6); d.e.setAttribute('cx', d.r.x + Math.cos(d.a) * d.d * p); d.e.setAttribute('cy', d.r.y + Math.sin(d.a) * d.d * p - p * 60); d.e.setAttribute('r', 2.5 * (1 - p * .5)); d.e.setAttribute('opacity', p > 0 ? 1 - p * .6 : 0); });
      camSet(c, 1.08 - k * .02, 960, 500); }
    fade.setAttribute('opacity', smooth(prog(t, 6.1, 7.0))); };
});
