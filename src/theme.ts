/**
 * Design tokens — the single place to re-skin the dashboard.
 *
 * Dark "instrument-panel" theme (Periapsis). Near-black #141414 base, an indigo
 * #7c84ff accent that carries the brand / threshold line / point estimate, and
 * three verdict tones tuned for dark contrast. All color decisions live here so
 * a re-skin touches this file; components read these tokens and stay
 * presentational.
 *
 * Sourced from the Claude Design pass (Providence.dc.html); see docs/DESIGN.md.
 */

/** Verdict is the core concept: settled (PASS/FAIL) vs unsettled ((point)). */
export type Verdict = 'PASS' | 'PASS (point)' | 'FAIL' | 'FAIL (point)'

export const isSettled = (v: Verdict): boolean => !v.endsWith('(point)')
export const isPass = (v: Verdict): boolean => v.startsWith('PASS')

/**
 * Verdict styling. The settled-vs-unsettled distinction is shown VISUALLY:
 * settled verdicts get a solid fill, `(point)` verdicts get a hatched/outlined
 * treatment. `hatch` flags whether to render the diagonal-stripe pattern.
 */
export interface VerdictStyle {
  label: string
  /** Tone bucket used for color: ok | warn | bad. */
  tone: 'ok' | 'warn' | 'bad'
  /** Solid fill (settled) vs hatched (unsettled / point). */
  hatch: boolean
}

export const VERDICT_STYLES: Record<Verdict, VerdictStyle> = {
  PASS: { label: 'PASS', tone: 'ok', hatch: false },
  'PASS (point)': { label: 'PASS (point)', tone: 'warn', hatch: true },
  'FAIL (point)': { label: 'FAIL (point)', tone: 'warn', hatch: true },
  FAIL: { label: 'FAIL', tone: 'bad', hatch: false },
}

/**
 * Tone → concrete colors, tuned for the dark theme. `fg` text, `bar` the solid
 * mark/stroke, `bg`/`barA` translucent fills (the second for hatch stripes),
 * `border` the outline.
 */
export const TONE = {
  ok: {
    fg: '#4ccf8e',
    bar: '#35c27e',
    bg: 'rgba(76,207,142,0.13)',
    barA: 'rgba(76,207,142,0.24)',
    border: 'rgba(76,207,142,0.34)',
  },
  warn: {
    fg: '#e3a531',
    bar: '#d9962a',
    bg: 'rgba(227,165,49,0.13)',
    barA: 'rgba(227,165,49,0.24)',
    border: 'rgba(227,165,49,0.36)',
  },
  bad: {
    fg: '#ef5566',
    bar: '#e8404f',
    bg: 'rgba(239,85,102,0.13)',
    barA: 'rgba(239,85,102,0.24)',
    border: 'rgba(239,85,102,0.36)',
  },
  neutral: {
    fg: '#9a9a96',
    bar: '#6e6e6a',
    bg: 'rgba(255,255,255,0.06)',
    barA: 'rgba(255,255,255,0.12)',
    border: 'rgba(255,255,255,0.12)',
  },
} as const

export type Tone = keyof typeof TONE

/**
 * UI surface + text tokens. The dark "instrument-panel" greys, in one place so
 * components don't hardcode slate-* utilities.
 */
export const UI = {
  bg: '#141414', // page background (Berghain near-black)
  surface: '#1e1e1e', // cards / panels
  surfaceAlt: '#262626', // raised panel (feature, history tiles)
  surfaceInset: '#171717', // inset wells (certificate)
  hover: '#1a1a1a', // row hover
  border: 'rgba(255,255,255,0.08)',
  skew: '#222', // skewed shadow slab behind feature/history blocks
  text: '#ededed', // primary text
  textStrong: '#f4f4f2', // headings
  textMuted: '#9a9a96', // body secondary
  textDim: '#7a7a76', // captions
  textFaint: '#5a5a56', // labels / eyebrows
  textGhost: '#494945', // footnotes
} as const

/** Chart tokens, kept here so the dataviz palette is tunable in one place. */
export const CHART = {
  threshold: '#7c84ff', // the threshold line + accent
  point: '#ffffff', // the point-estimate dot (on dark)
  pointStroke: '#141414',
  track: 'rgba(255,255,255,0.12)', // baseline track
  grid: 'rgba(255,255,255,0.07)', // sparkline gridlines
  driftFlag: '#ef5566', // the highlighted drift event
  neutralLine: '#9a9a96', // non-drift sparkline line
  axis: '#6e6e6a',
} as const

/** Brand accents. */
export const BRAND = {
  accent: '#7c84ff', // indigo — brand, threshold, active state, point estimate
  accentDot: '#9aa0ff', // brighter indigo for the i-dot / small highlights
  ink: '#0e1117', // dark ink (for light-on logo variants)
  periapsisOrange: '#FF4F00', // Periapsis orbit body
} as const
