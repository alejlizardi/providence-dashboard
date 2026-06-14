/**
 * Brand primitives, translated 1:1 from the Claude Design pass
 * (Providence.dc.html). These are the net-new visual artifacts of the theme:
 *
 *  - <Glyph>            the kept confidence-interval error-bar mark
 *  - <ProvidenceWordmark> the constructed, drawn-not-typed geometric wordmark
 *  - <OrbitLoader>      the Periapsis orbit animation (Kepler's 2nd law)
 *  - <MatrixCanvas>     the subtle indigo "digital rain" variation layer
 *
 * Everything is presentational and reads the BRAND/UI tokens from theme.ts.
 */
import { useEffect, useRef } from 'react'
import { BRAND } from '../theme'

/* ----------------------------------------------------------------- Glyph -- */

/** The kept mark: a confidence-interval error bar (point estimate + whiskers). */
export function Glyph({ size = 26, accent = BRAND.accent }: { size?: number; accent?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="providence"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <rect width={32} height={32} rx={6} fill={accent} />
      <line x1={7} y1={16} x2={25} y2={16} stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={7} y1={11} x2={7} y2={21} stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={25} y1={11} x2={25} y2={21} stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={19} cy={16} r={3} fill="#c7cbff" />
    </svg>
  )
}

/* -------------------------------------------------------------- Wordmark -- */

/**
 * "providence" as a constructed geometric mark — drawn, not typed: one monoline
 * weight, chamfered counters, square terminals; the i-dot carries the accent.
 * Ported from makeLogo() in the design source.
 */
export function ProvidenceWordmark({
  height = 24,
  color = '#ededed',
  accentDot = BRAND.accentDot,
}: {
  height?: number
  color?: string
  accentDot?: string
}) {
  const T = 12 // stroke weight
  const AT = 8 // ascender top
  const XT = 26 // x-height top
  const MD = 59 // e crossbar
  const BL = 92 // baseline
  const ch = 12 // chamfer
  const LS = 9 // letter spacing
  const widths: Record<string, number> = {
    p: 52, r: 42, o: 54, v: 46, i: 0, d: 52, e: 52, n: 50, c: 40,
  }

  const paths: React.ReactNode[] = []
  const rects: React.ReactNode[] = []
  let key = 0

  const P = (pts: number[][], closed?: boolean) => {
    let d = 'M ' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L ')
    if (closed) d += ' Z'
    paths.push(
      <path
        key={'p' + key++}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={T}
        strokeLinejoin="miter"
        strokeLinecap="square"
        strokeMiterlimit={8}
      />,
    )
  }

  let ox = 0
  for (const L of 'providence') {
    const x = ox
    if (L === 'p') {
      P([[x, XT], [x, 116]])
      P([[x, XT], [x + 52 - ch, XT], [x + 52, XT + ch], [x + 52, BL - ch], [x + 52 - ch, BL], [x, BL]])
    } else if (L === 'r') {
      P([[x, XT], [x, BL]])
      P([[x, XT + 13], [x + 12, XT], [x + 30, XT], [x + 42, XT + 13]])
    } else if (L === 'o') {
      P([[x + ch, XT], [x + 54 - ch, XT], [x + 54, XT + ch], [x + 54, BL - ch], [x + 54 - ch, BL], [x + ch, BL], [x, BL - ch], [x, XT + ch]], true)
    } else if (L === 'v') {
      P([[x, XT], [x + 18, BL], [x + 28, BL], [x + 46, XT]])
    } else if (L === 'i') {
      P([[x, XT], [x, BL]])
      rects.push(<rect key={'r' + key++} x={x - 6} y={9} width={12} height={12} fill={accentDot} />)
    } else if (L === 'd') {
      P([[x + 52, AT], [x + 52, BL]])
      P([[x + 52, XT], [x + ch, XT], [x, XT + ch], [x, BL - ch], [x + ch, BL], [x + 52, BL]])
    } else if (L === 'e') {
      P([[x, MD], [x + 52, MD]])
      P([[x + 52, MD], [x + 52, XT + ch], [x + 52 - ch, XT], [x + ch, XT], [x, XT + ch], [x, BL - ch], [x + ch, BL], [x + 52 - ch, BL], [x + 52, BL - ch]])
    } else if (L === 'n') {
      P([[x, XT], [x, BL]])
      P([[x, XT + 13], [x + 12, XT], [x + 38, XT], [x + 50, XT + 13], [x + 50, BL]])
    } else if (L === 'c') {
      P([[x + 52 - ch, XT], [x + ch, XT], [x, XT + ch], [x, BL - ch], [x + ch, BL], [x + 52 - ch, BL]])
    }
    ox += widths[L] + LS
  }

  const totalW = ox - LS
  const vbW = totalW + 16
  const vbH = 124
  const width = height * (vbW / vbH)

  return (
    <svg
      viewBox={`-8 0 ${vbW} ${vbH}`}
      width={width}
      height={height}
      style={{ display: 'block', overflow: 'visible' }}
      role="img"
      aria-label="providence"
    >
      {rects}
      {paths}
    </svg>
  )
}

/* ----------------------------------------------------------- OrbitLoader -- */

/**
 * The Periapsis orbit loader: a body sweeps an ellipse (e ≈ 0.60, the 3–4–5
 * orbit from the mark) with the planet at one focus, obeying Kepler's second
 * law — fastest at periapsis, slowest at apoapsis. The non-uniform speed comes
 * from sampling the eccentric anomaly E uniformly (Kepler's equation), which
 * maps to equal areas in equal times. Ported from makeOrbit().
 */
export function OrbitLoader({ size = 188 }: { size?: number }) {
  const e = 0.6
  const a = 38
  const b = 30.4
  const cx = 52
  const cy = 50
  const N = 128

  const solve = (M: number) => {
    let E = M
    for (let i = 0; i < 8; i++) {
      E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E))
    }
    return E
  }

  const xs: string[] = []
  const ys: string[] = []
  for (let i = 0; i <= N; i++) {
    const E = solve((2 * Math.PI * i) / N)
    xs.push((cx - a * Math.cos(E)).toFixed(2))
    ys.push((cy - b * Math.sin(E)).toFixed(2))
  }
  const dur = '3.6s'

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ display: 'block', overflow: 'visible' }}
      role="img"
      aria-label="Periapsis orbit"
    >
      <ellipse cx={52} cy={50} rx={38} ry={30.4} fill="none" stroke="#F4F5F7" strokeWidth={5.5} />
      <circle cx={29.2} cy={50} r={6.5} fill="#F4F5F7" />
      <circle r={4.75} fill={BRAND.periapsisOrange} cx={xs[0]} cy={ys[0]}>
        <animate attributeName="cx" dur={dur} repeatCount="indefinite" calcMode="linear" values={xs.join(';')} />
        <animate attributeName="cy" dur={dur} repeatCount="indefinite" calcMode="linear" values={ys.join(';')} />
      </circle>
    </svg>
  )
}

/* ----------------------------------------------------------- MatrixCanvas -- */

/**
 * Subtle indigo "digital rain" — the matrix variation layer behind the loading
 * screen. Ported from runMatrix(); driven by requestAnimationFrame, cleaned up
 * on unmount. Opacity is set by the caller via style.
 */
export function MatrixCanvas({ opacity = 0.5, className }: { opacity?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const fs = 13
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let W = 0
    let H = 0
    let drops: number[] = []
    const chars = '01ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜｲｸｺｿﾁ<>/=*+|'.split('')

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      W = r.width
      H = r.height
      canvas.width = Math.max(1, W * dpr)
      canvas.height = Math.max(1, H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cols = Math.max(1, Math.floor(W / fs))
      if (drops.length !== cols) drops = Array.from({ length: cols }, () => Math.random() * -40)
    }
    resize()

    let raf = 0
    const draw = () => {
      if (!canvas.isConnected) return
      if (Math.abs(canvas.getBoundingClientRect().width - W) > 2) resize()
      // Per-frame fade that creates the trailing tails. Weaker alpha => glyphs
      // persist longer => longer tails (0.11 -> ~0.037 ≈ 3x longer trails).
      ctx.fillStyle = 'rgba(20,20,20,0.037)'
      ctx.fillRect(0, 0, W, H)
      ctx.font = fs + "px 'Geist Mono', monospace"
      for (let i = 0; i < drops.length; i++) {
        const x = i * fs
        const y = drops[i] * fs
        ctx.fillStyle = 'rgba(154,160,255,0.92)'
        ctx.fillText(chars[(Math.random() * chars.length) | 0], x, y)
        ctx.fillStyle = 'rgba(124,132,255,0.30)'
        ctx.fillText(chars[(Math.random() * chars.length) | 0], x, y - fs)
        if (y > H && Math.random() > 0.972) drops[i] = Math.random() * -16
        drops[i] += 0.1 // fall speed (0.4 -> 0.2 -> 0.1; halved again)
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity }}
    />
  )
}
