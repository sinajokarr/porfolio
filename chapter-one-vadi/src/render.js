// node render.js --still <dir> <t...>    |  node render.js <dir> <audio.wav> <out.mp4> [workers] [scale]
const { chromium } = require('playwright'); const { spawn, execFileSync } = require('child_process'); const path = require('path'); const fs = require('fs');
const FPS = 30, DUR = 96, TOTAL = FPS * DUR; const url = 'file://' + path.join(__dirname, 'scene.html');
async function open(b, scale) { const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(url); await p.waitForTimeout(300); if (errs.length) throw new Error(errs.join('\n')); return p; }
(async () => { const a = process.argv.slice(2); const b = await chromium.launch();
  if (a[0] === '--still') { const [, dir, ...ts] = a; fs.mkdirSync(dir, { recursive: true }); const p = await open(b, 1);
    for (const t of ts.map(Number)) { await p.evaluate(t => render(t), t); await p.screenshot({ path: path.join(dir, `s_${t.toFixed(2).padStart(6, '0')}.png`) }); } await b.close(); return; }
  const [dir, audio, out, w = '4', sc = '2'] = a; const workers = +w, scale = +sc; fs.mkdirSync(dir, { recursive: true }); const per = Math.ceil(TOTAL / workers); const segs = [];
  await Promise.all(Array.from({ length: workers }, async (_, k) => { const seg = path.join(dir, `seg${k}.mp4`); segs[k] = seg;
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-threads', '2', seg], { stdio: ['pipe', 'ignore', 'inherit'] });
    const p = await open(b, scale);
    for (let i = k * per; i < Math.min(TOTAL, (k + 1) * per); i++) { await p.evaluate(t => render(t), i / FPS); const buf = await p.screenshot({ type: 'jpeg', quality: 95 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (k === 0 && (i % 120) === 0) console.log('chunk0', i, '/', per); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); }));
  await b.close(); const list = path.join(dir, 'list.txt'); fs.writeFileSync(list, segs.map(s => `file '${s}'`).join('\n'));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-i', audio, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', out], { stdio: 'inherit' }); console.log('done', out);
})().catch(e => { console.error(e); process.exit(1); });
