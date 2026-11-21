// 4K (3840x2160) renderer: the 1920x1080 scene is rendered at deviceScaleFactor 2, so all
// vector art is drawn natively at 4K. Each worker renders a contiguous chunk and pipes it to
// its own ffmpeg, then the chunks are joined and the soundtrack is muxed in.
// Usage: node render4k.js <workDir> <audio.wav> <out.mp4> [workers]
//        node render4k.js --still <workDir> <seconds...>
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const FPS = 30, TOTAL = 60 * FPS;
const url = 'file://' + path.join(__dirname, 'scene.html');

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  if (errors.length) throw new Error(errors.join('\n'));
  return page;
}

(async () => {
  const args = process.argv.slice(2);
  const browser = await chromium.launch();
  if (args[0] === '--still') {
    const [, dir, ...ts] = args;
    fs.mkdirSync(dir, { recursive: true });
    const page = await openPage(browser);
    for (const t of ts.map(Number)) {
      await page.evaluate(t => render(t), t);
      await page.screenshot({ path: path.join(dir, `4k_${t.toFixed(2)}.png`) });
    }
    await browser.close();
    return;
  }
  const [dir, audio, out, w = '4'] = args;
  const workers = Number(w);
  fs.mkdirSync(dir, { recursive: true });
  const per = Math.ceil(TOTAL / workers);
  const segs = [];
  await Promise.all(Array.from({ length: workers }, async (_, k) => {
    const seg = path.join(dir, `seg${k}.mp4`); segs[k] = seg;
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-threads', '2', seg], { stdio: ['pipe', 'ignore', 'inherit'] });
    const page = await openPage(browser);
    for (let i = k * per; i < Math.min(TOTAL, (k + 1) * per); i++) {
      await page.evaluate(t => render(t), i / FPS);
      const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (k === 0 && (i - k * per) % 90 === 0) console.log(`chunk0 ${i - k * per}/${per}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }));
  await browser.close();
  const list = path.join(dir, 'list.txt');
  fs.writeFileSync(list, segs.map(s => `file '${s}'`).join('\n'));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-i', audio,
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', out], { stdio: 'inherit' });
  console.log('done', out);
})().catch(e => { console.error(e); process.exit(1); });
