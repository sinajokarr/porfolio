/**
 * Renders the hero chrome sculpture (components/hero/sculpture.js) at t = 0 to a PNG, for the static
 * fallback used on phones, with reduced motion, and before WebGL starts.
 *
 *   node scripts/sculpture/render-still.cjs /tmp/sculpture.png [size=1400] [time=0] [dark|light]
 *   python3 -c "from PIL import Image; Image.open('/tmp/sculpture.png').save('public/hero-sculpture.webp', quality=88, method=6)"
 *
 * Needs Playwright and a Chrome with WebGL (SwiftShader is fine).
 */
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

(async () => {
  const [, , out = "sculpture.png", size = "1400", time = "0", theme = "dark"] = process.argv;
  const src = fs.readFileSync(path.join(__dirname, "../../components/hero/sculpture.js"), "utf8").replace(/^export /gm, "");
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage({ viewport: { width: +size, height: +size }, deviceScaleFactor: 1 });
  await page.setContent(`<body style="margin:0;background:transparent"><canvas style="width:${size}px;height:${size}px;display:block"></canvas></body>`);
  await page.addScriptTag({ content: src });
  const png = await page.evaluate((t) => {
    const canvas = document.querySelector("canvas");
    const ctx = mountSculpture(canvas, { still: true, time: Number(t[0]), light: t[1] === "light" ? 1 : 0 });
    if (!ctx) throw new Error("WebGL unavailable");
    return canvas.toDataURL("image/png");
  }, [time, theme]);
  fs.writeFileSync(out, Buffer.from(png.split(",")[1], "base64"));
  console.log("wrote", out);
  await browser.close();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
