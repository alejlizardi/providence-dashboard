/**
 * The verdict, shown so settled vs unsettled is VISUAL, not just text:
 *   - settled (PASS / FAIL)  → solid fill
 *   - unsettled ((point))    → hatched (diagonal stripes) + dashed outline
 * This distinction is the signature idea of the project; make it unmissable.
 * Square, uppercase, instrument-panel styling from the dark theme.
 */
import { TONE, VERDICT_STYLES, type Verdict } from '../theme'
import { InfoTooltip } from './InfoTooltip'

export function VerdictBadge({
  verdict,
  withInfo = false,
  size = 'md',
}: {
  verdict: Verdict
  withInfo?: boolean
  size?: 'sm' | 'md'
}) {
  const style = VERDICT_STYLES[verdict]
  const tone = TONE[style.tone]
  const sm = size === 'sm'

  // Hatched background for (point); solid tint for settled.
  const background = style.hatch
    ? `repeating-linear-gradient(135deg, ${tone.bg}, ${tone.bg} 5px, ${tone.barA} 5px, ${tone.barA} 10px)`
    : tone.bg

  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="inline-flex items-center whitespace-nowrap font-semibold uppercase"
        style={{
          gap: 7,
          padding: sm ? '3px 9px' : '5px 12px',
          fontSize: sm ? 11 : 12,
          letterSpacing: '0.03em',
          background,
          color: tone.fg,
          border: `1px ${style.hatch ? 'dashed' : 'solid'} ${tone.border}`,
        }}
      >
        <span
          aria-hidden
          className="inline-block"
          style={{
            width: 7,
            height: 7,
            flexShrink: 0,
            background: style.hatch ? 'transparent' : tone.bar,
            border: style.hatch ? `1.5px solid ${tone.bar}` : 'none',
          }}
        />
        {style.label}
      </span>
      {withInfo && (
        <InfoTooltip
          stat={style.hatch ? 'verdictPoint' : 'verdictSettled'}
          label={style.label}
        />
      )}
    </span>
  )
}
