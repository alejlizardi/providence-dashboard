/**
 * The signature dataviz: a Wilson confidence interval rendered as the actual
 * interval — a horizontal bar spanning [ci95_low, ci95_high] with the point
 * estimate as a dot and the threshold as a vertical line. NOT a generic chart.
 *
 * Settled vs (point) is encoded in the bar fill too: settled = solid tone,
 * (point) = hatched, matching the verdict badge. Hand-rolled SVG so the
 * geometry stays exactly right and fully tunable. Dark-theme tokens from theme.ts.
 */
import { CHART, TONE, UI, VERDICT_STYLES, type Verdict } from '../theme'
import { InfoTooltip } from './InfoTooltip'

interface Props {
  rate: number
  ciLow: number
  ciHigh: number
  threshold: number
  verdict: Verdict
  /** Domain to render; defaults to a padded window around the data. */
  domain?: [number, number]
  ciMethod?: string
  showAxis?: boolean
  showCaption?: boolean
  height?: number
}

export function ConfidenceBar({
  rate,
  ciLow,
  ciHigh,
  threshold,
  verdict,
  domain,
  ciMethod = 'wilson',
  showAxis = true,
  showCaption = true,
  height = 56,
}: Props) {
  const W = 520
  const padX = 18
  const innerW = W - padX * 2
  const trackY = (height - (showAxis ? 16 : 0)) / 2

  const [d0, d1] = domain ?? niceDomain(ciLow, ciHigh, threshold)
  const x = (v: number) => padX + ((clamp(v, d0, d1) - d0) / (d1 - d0)) * innerW

  const style = VERDICT_STYLES[verdict]
  const tone = TONE[style.tone]
  const patternId = `hatch-${style.tone}`

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="xMidYMid meet"
        style={{ maxWidth: W, display: 'block' }}
        role="img"
        aria-label={`Pass rate ${pct(rate)} with 95% interval ${pct(ciLow)} to ${pct(
          ciHigh,
        )}, threshold ${pct(threshold)}, verdict ${verdict}`}
      >
        <defs>
          <pattern id={patternId} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(135)">
            <rect width="8" height="8" fill={tone.bg} />
            <line x1="0" y1="0" x2="0" y2="8" stroke={tone.bar} strokeWidth="3" opacity="0.55" />
          </pattern>
        </defs>

        {/* baseline track */}
        <line x1={padX} y1={trackY} x2={W - padX} y2={trackY} stroke={CHART.track} strokeWidth="2" />

        {/* the confidence interval bar */}
        <rect
          x={x(ciLow)}
          y={trackY - 9}
          width={Math.max(2, x(ciHigh) - x(ciLow))}
          height={18}
          fill={style.hatch ? `url(#${patternId})` : tone.bg}
          stroke={tone.bar}
          strokeWidth={1.5}
        />
        {/* interval whiskers */}
        {[ciLow, ciHigh].map((v, i) => (
          <line key={i} x1={x(v)} y1={trackY - 11} x2={x(v)} y2={trackY + 11} stroke={tone.bar} strokeWidth="2" />
        ))}

        {/* threshold line */}
        <line
          x1={x(threshold)}
          y1={5}
          x2={x(threshold)}
          y2={height - (showAxis ? 19 : 5)}
          stroke={CHART.threshold}
          strokeWidth="2"
          strokeDasharray="4 3"
        />

        {/* point estimate dot */}
        <circle cx={x(rate)} cy={trackY} r={5.5} fill={CHART.point} stroke={CHART.pointStroke} strokeWidth="1.5" />

        {showAxis && (
          <>
            <text x={padX} y={height - 3} fontSize="10" fill={CHART.axis}>
              {pct(d0)}
            </text>
            <text x={x(threshold)} y={height - 3} fontSize="10" fill={CHART.threshold} textAnchor="middle">
              thr {pct(threshold)}
            </text>
            <text x={W - padX} y={height - 3} fontSize="10" fill={CHART.axis} textAnchor="end">
              {pct(d1)}
            </text>
          </>
        )}
      </svg>

      {showCaption && (
        <figcaption className="mt-3 flex items-center gap-2 text-[13px]" style={{ color: UI.textDim }}>
          <span className="font-medium" style={{ color: '#fff' }}>
            {pct(rate)}
          </span>
          <span>· 95% CI [{pct(ciLow)}, {pct(ciHigh)}]</span>
          <InfoTooltip stat={ciMethod === 'clopper_pearson' ? 'clopperPearson' : 'wilson'} label="confidence interval" />
        </figcaption>
      )}
    </figure>
  )
}

function niceDomain(lo: number, hi: number, thr: number): [number, number] {
  const min = Math.min(lo, hi, thr)
  const max = Math.max(lo, hi, thr)
  const pad = Math.max(0.05, (max - min) * 0.25)
  return [Math.max(0, Math.floor((min - pad) * 20) / 20), Math.min(1, Math.ceil((max + pad) * 20) / 20)]
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const pct = (v: number) => `${(v * 100).toFixed(0)}%`
