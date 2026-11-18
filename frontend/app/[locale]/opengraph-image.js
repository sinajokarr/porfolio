import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sina Jokar — Full-Stack Developer × Performance Marketing";
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "tr" }, { locale: "fa" }, { locale: "ru" }];
}

// Latin-only text keeps the card font-free; the page title carries the localized copy.
// The portrait is the same graded cut-out as the hero (PNG copy, since next/og cannot decode WebP).
export default async function OpengraphImage() {
  const portrait = await readFile(join(process.cwd(), "public", "og-portrait.png"));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", color: "#f7f8fa",
        background: "radial-gradient(55% 90% at 78% 40%, rgba(129,140,248,0.38), transparent 70%), linear-gradient(180deg,#0b0d12,#08090c)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- rendered to PNG by next/og */}
        <img src={portrait.buffer.slice(portrait.byteOffset, portrait.byteOffset + portrait.byteLength)} width={483} height={630} style={{ position: "absolute", right: 70, bottom: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 0 72px", width: 720 }}>
          <div style={{ fontSize: 20, letterSpacing: 5, color: "#a7aab5" }}>FULL-STACK DEVELOPER × PERFORMANCE MARKETING</div>
          <div style={{ fontSize: 64, fontWeight: 600, marginTop: 26, lineHeight: 1.06, display: "flex", flexDirection: "column" }}>
            <span>I Build Digital Products.</span>
            <span style={{ display: "flex" }}>I Help Businesses&nbsp;<span style={{ color: "#aaa9f5" }}>Grow.</span></span>
          </div>
          <div style={{ marginTop: 44, fontSize: 24, letterSpacing: 4, fontWeight: 600 }}>SINA JOKAR</div>
          <div style={{ marginTop: 6, fontSize: 18, color: "#a7aab5" }}>Antalya, Türkiye</div>
        </div>
      </div>
    ),
    size,
  );
}
