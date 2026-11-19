# Creative brief — copy & motion pass (Nov 2026)

Self-brief written before the work, so the result can be checked against it.

## 1. What is wrong now

* **Copy** reads like a template: "I Build Digital Products. I Help Businesses Grow.", "Let's Build Something Valuable.", "What I Offer." These are claims anyone could make. They say nothing about *Sina*.
* **The contact animation** (dot `</>` turning into a stepped growth line) looks crude: jagged steps, toy-like dots, a literal metaphor.
* **Motion overall** is the generic default: every block fades and rises the same way.

## 2. The one idea everything hangs on

Sina is unusual because **one person covers the whole path**: the website, the software behind it, and the ads + tracking that bring people to it. Most businesses hire three people for that, and things get lost between them.

Brand line (kept, it is good): **From code to conversion.**
Hero says it the way a person would: **"I build your website. Then I bring the right people."** (v3: spoken register; Persian colloquial with polite "شما")

## 3. Voice

* First person, plain words, short sentences. Sounds like a person talking across a table, not a brochure.
* Specific over impressive. Say what happens ("you see which clicks became calls"), never what it will achieve ("boost your ROI").
* No invented facts: no client counts, years, results, response-time promises, awards.
* Business owner first (what it does for you), technical reader second (how it is built), in that order inside every block.
* Each language written natively, not translated: Persian with correct half-spaces, Türkiye Turkish, natural Russian. Shorten rather than overflow the layout.

## 4. Copy map (every visible string on the homepage + shared sections)

| Block | Job | Direction |
| --- | --- | --- |
| Hero headline | Who + why care, in 5 s | "I build your website. / Then I bring the right people." |
| Hero copy | The unusual combination | Developer who also runs the ads and tracking; one person, no hand-offs |
| Services heading/intro | Why three services, together | "Three things, one person." / nothing gets lost between them |
| Service cards | Client problem → what I do | Human taglines: trust in 5 seconds · fits how you work · spend you can account for |
| Work | Proof | "Work you can check." Live sites, client projects, readable code |
| Stack | Credibility without bragging | Python/Django is home; the rest is what ships and measures |
| Process | Remove risk | What actually happens, step by step, no surprises |
| About | The person | "A developer who reads the analytics." Why the combination exists |
| Contact | Lower the barrier | "Got a project in mind? Tell me about it." A short message is enough |

## 5. Motion principles

1. **One signature moment per section**, everything else quiet. No scattered effects.
2. **Transform + opacity only**, GPU-friendly; canvases cap DPR and pause off-screen.
3. **No new dependencies.** GSAP 3.15 (already installed) includes SplitText.
4. **Reduced motion** → final state, no movement. No-JS → full content.
5. Motion must *mean* something: text arrives the way it is read, lines draw the way a process advances.

## 6. Motion map

| Where | Moment | How |
| --- | --- | --- |
| Hero | Chrome sculpture + portrait entrance (kept) | WebGL shader, already done |
| Every section heading | Lines rise out of a mask, staggered, like editorial print | GSAP SplitText `lines` + `mask`, autoSplit for resize |
| Process | A line draws across the four steps as you scroll; each step lights up when reached | ScrollTrigger scrub on one `scaleX`, class toggles |
| Contact eclipse | **Horizon**: a field of points forming a slow, breathing landscape seen through the eclipse, with a lavender light band moving across it; it bends gently toward the pointer | Canvas 2D, ~1,100 points, perspective projection, paused off-screen |

Replaced: the `</>` → growth-line motif (BuildGrowMotif).

## 7. Done means

* All four languages updated, key sets identical, nothing overflows at 390 / 768 / 1280 / 1536 px.
* Build, unit, backend and e2e tests pass; no console errors.
* Screenshots reviewed for every language; animation frames reviewed.

## 8. Revisions after review (Nov 2026)

* **Copy, v4 (current):** the owner chose a *personal, direct introduction* in a *plain, warm written register*
  (not slang, not corporate). Hero: "I'm Sina Jokar. / I build websites, software and Google Ads campaigns."
  Every block says concretely what the client gets; no slogans. Earlier drafts (v1–v3) were rejected as too generic or too casual.
* **Day/night:** light mode added. Colour tokens are re-pointed under `html.light`; `.bg-ice` keeps white as white and
  `.theme-dark` (plus dark panels on light bands) pins the night palette. Toggle = on/off switch in the header
  (`ThemeSwitch.jsx`, sun/moon knob, circular reveal from the knob). A pendant-lamp version was tried and replaced at the owner's request.
* **Hero sculpture** has a day-studio lighting mode (`uLight` in `sculpture.js`) and a matching still (`hero-sculpture-light.webp`).
