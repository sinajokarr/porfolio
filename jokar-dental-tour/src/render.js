// Usage:
//   node render.js stills <outDir> 3 15.5 ...   -> PNG stills at given seconds
//   node render.js frames <outDir> [workers]     -> 1800 JPEG frames (60s @ 30fps)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const [, , mode, outDir, ...rest] = process.argv;
const FPS = 30, DURATION = 60;
const page_url = 'file://' + path.join(__dirname, 'scene.html');

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(page_url);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  if (errors.length) throw new Error('Page errors: ' + errors.join('\n'));
  return page;
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  if (mode === 'stills') {
    const page = await openPage(browser);
    for (const t of rest.map(Number)) {
      await page.evaluate(t => render(t), t);
      await page.screenshot({ path: path.join(outDir, `still_${t.toFixed(2)}.png`) });
    }
  } else {
    const workers = Number(rest[0] || 3), total = FPS * DURATION;
    await Promise.all(Array.from({ length: workers }, async (_, w) => {
      const page = await openPage(browser);
      for (let i = w; i < total; i += workers) {
        await page.evaluate(t => render(t), i / FPS);
        await page.screenshot({ path: path.join(outDir, `f${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 93 });
        if (w === 0 && i % 150 === 0) console.log(`frame ${i}/${total}`);
      }
    }));
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
