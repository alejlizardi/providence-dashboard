/**
 * Design tokens — the single place to re-skin the dashboard.
 *
 * The palette below is an intentional PLACEHOLDER (indigo/slate). Aesthetics
 * are meant to be iterated later; keep all color/shape decisions here so a
 * re-skin touches this file, not the components. Components read these tokens
 * and stay presentational.
 */

/** Verdict is the core concept: settled (PASS/FAIL) vs unsettled ((point)). */
export type Verdict = 'PASS' | 'PASS (point)' | 'FAIL' | 'FAIL (point)'

export const isSettled = (v: Verdict): boolean => !v.endsWith('(point)')
export const isPass = (v: Verdict): boolean => v.startsWith('PASS')

/**
 * Verdict styling. The settled-vs-unsettled distinction is shown VISUALLY:
 * settled verdicts get a solid fill, `(point)` verdicts get a hatched/outlined
 * treatment. `fill` is a Tailwind-ish token resolved by components; `hatch`
 * flags whether to render the diagonal-stripe pattern.
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
 * Tone → concrete colors. PLACEHOLDER values. The orange accent slot is
 * reserved (the Periapsis brand uses #FF4F00) for when we adopt brand colors.
 */
export const TONE = {
  ok: {
    fg: '#047857', // emerald-700
    bg: '#ecfdf5', // emerald-50
    bar: '#10b981', // emerald-500
    border: '#a7f3d0',
  },
  warn: {
    fg: '#b45309', // amber-700
    bg: '#fffbeb', // amber-50
    bar: '#f59e0b', // amber-500
    border: '#fde68a',
  },
  bad: {
    fg: '#be123c', // rose-700
    bg: '#fff1f2', // rose-50
    bar: '#f43f5e', // rose-500
    border: '#fecdd3',
  },
  neutral: {
    fg: '#334155', // slate-700
    bg: '#f8fafc', // slate-50
    bar: '#94a3b8', // slate-400
    border: '#e2e8f0',
  },
} as const

export type Tone = keyof typeof TONE

/** Chart tokens, kept here so the dataviz palette is tunable in one place. */
export const CHART = {
  threshold: '#6366f1', // indigo-500 — the threshold line
  ciBar: '#cbd5e1', // slate-300 — the interval bar
  point: '#1e293b', // slate-800 — the point-estimate dot
  driftFlag: '#e11d48', // rose-600 — the highlighted drift event
  grid: '#eef2f7',
} as const

/** Brand accents (placeholder until the providence logo + palette land). */
export const BRAND = {
  accent: '#6366f1', // indigo-500 (placeholder)
  ink: '#0f172a', // slate-900
  periapsisOrange: '#FF4F00', // real Periapsis accent, reserved
} as const
