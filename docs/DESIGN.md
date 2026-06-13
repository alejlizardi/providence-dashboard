# evidentry-dashboard — Design Brief

A one-page brief for the aesthetic pass (usable as context for **Claude Design**
at claude.ai/design, or as the spec I work from in Claude Code). The app is
already tokenized: every color/shape decision lives in
[`src/theme.ts`](../src/theme.ts), components are presentational, so a re-skin
is a focused edit, not a rewrite.

---

## The goal (don't lose this)

A hiring manager spends ~90 seconds on the live URL and concludes *"this person
can ship full-stack software **and** do hard statistics."* Every aesthetic
choice serves **legible competence in 90 seconds.** Sleek and clean beats
ambitious and busy.

## Direction

- **Dark mode**, sleek, modern. This is the primary mode (not an afterthought toggle).
- **Indigo as the accent** (current placeholder `#6366f1` / indigo-500 family) — carries the brand, the threshold lines, the active state, the point estimate.
- Restrained, editorial, "instrument-panel" feel — this is an *evidence* tool; it should read as precise, not playful. Generous spacing, confident type, few colors.

## Palette intent (tune the exact hexes)

| Token | Now (placeholder) | Dark-mode intent |
|---|---|---|
| Background | slate-50 (light) | deep near-black, slight blue cast (e.g. `#0b0d14`–`#11141d`) |
| Surface / cards | white | one step lighter than bg, subtle border |
| Text | slate-800/500 | near-white primary, muted gray secondary |
| **Accent** | indigo-500 | indigo, possibly a touch brighter to pop on dark |
| Verdict tones | emerald / amber / rose | keep the 3-tone semantics; tune for dark contrast |

**Hard constraint — these must survive any re-skin (they're the substance):**
1. **The settled-vs-`(point)` distinction stays visual** — settled verdict = solid fill, `(point)` = hatched/striped + dashed outline. Don't flatten it to a text label.
2. **The confidence interval stays the actual interval** — a horizontal bar spanning `[ci_low, ci_high]`, dot at the point estimate, dashed vertical threshold line. Never a generic SaaS bar chart.
3. **The drift event stays unmistakably highlighted** — color + flag + plain-language callout.
Aesthetics may restyle *how* these look; they may not remove *what* they encode.

## Logos & brand

### evidentry — glyph (KEEP) + wordmark (MAKE)
- **Glyph: keep the current indigo sliding-bar mark** ([`src/brand/Brand.tsx`](../src/brand/Brand.tsx) `EvidentryMark`, mirrored in [`public/favicon.svg`](../public/favicon.svg)). It's a confidence-interval error bar — on-concept. Don't replace it.
- **Wordmark: NEEDS TO BE MADE.** Stylize **"evidentry"** in **lowercase**, in a **sleek, ideally italicized** typographic treatment that conjures **math / scientific associations** — think the feel of a math typeface (italic serif like Computer Modern / Latin Modern math italic), or a precise technical sans with mathematical poise. It should sit naturally beside the indigo glyph. *This is the single concrete net-new asset to produce.*

### Periapsis — used as "by Periapsis" maker's mark
- In prominent spots, compose **"evidentry [glyph] · by Periapsis [periapsis glyph]"**.
- **Use `C:\Users\epica\Periapsis\Logos\periapsis_glyph.svg`** (the orbit-sweep portrait mark) next to the "Periapsis" text — **not** `periapsis-mark.svg` (the flat one currently wired in). Swap the vendored asset.

### Periapsis orbit loader (NEW ARTIFACT — replaces the current static loading mark)
The loading screen ([`src/brand/LoadingScreen.tsx`](../src/brand/LoadingScreen.tsx)) currently shows a sliding-dot error bar. Replace it with a **Periapsis orbit animation** — a "spinning beach ball"-style loader:
- An orbiting body travels an **ellipse** with the planet at one **focus** (the Periapsis geometry: `e ≈ 0.6`, the 3-4-5 orbit from the brand mark).
- **Non-uniform speed, physically faithful:** the body moves **fastest at periapsis** (closest approach to the focus) and slowest at apoapsis — Kepler's second law (equal areas in equal times). Implementable in SVG via an `animateMotion` along the elliptical `path` with tuned `keyTimes`/`keySplines` so angular velocity peaks at periapsis. The periapsis point can flash/brighten (indigo) as the body sweeps through it.
- Tone: indigo on dark, small and elegant — a loading flourish, not a centerpiece.
- **Deliver as a standalone artifact** (a self-contained animated SVG / small HTML demo) so it can be reviewed in isolation, *and* wired into `LoadingScreen.tsx`.

## Typography

- Body/UI: a clean sans (current: system stack) — fine, or tune to something with more character (e.g. Inter, which Periapsis already uses for its wordmark).
- **Numbers and stats: tabular / monospaced figures** so percentages and intervals align — this reads as precise/quantitative and reinforces the math signal.
- The evidentry wordmark gets its own treatment (see above).

## Out of scope for the aesthetic pass

Don't change: the data, the statistics, the three-view structure, the export
pipeline. This pass is **look, not logic.**

## Current state (for reference / Claude Design extraction)

- Tokens: [`src/theme.ts`](../src/theme.ts) — `TONE`, `CHART`, `BRAND`, `VERDICT_STYLES`.
- Views: `src/views/{Overview,DriftTimeline,PackView,SuiteDetail}.tsx`.
- Brand slots: `src/brand/{Brand,LoadingScreen}.tsx`.
- Screenshots of the current (placeholder) look: [`docs/overview.png`](overview.png), [`docs/drift.png`](drift.png), [`docs/suites.png`](suites.png).
- Live: https://alejlizardi.github.io/evidentry-dashboard/
