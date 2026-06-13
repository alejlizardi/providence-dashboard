/**
 * The verdict, shown so settled vs unsettled is VISUAL, not just text:
 *   - settled (PASS / FAIL)  → solid fill
 *   - unsettled ((point))    → hatched (diagonal stripes) + dashed outline
 * This distinction is the signature idea of the project; make it unmissable.
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
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'

  // Hatched background for (point); solid tint for settled.
  const background = style.hatch
    ? `repeating-linear-gradient(135deg, ${tone.bg}, ${tone.bg} 5px, ${hexA(tone.bar, 0.22)} 5px, ${hexA(tone.bar, 0.22)} 10px)`
    : tone.bg

  return (
    <span className="inline-flex items-center gap-1">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${pad}`}
        style={{
          background,
          color: tone.fg,
          border: `1px ${style.hatch ? 'dashed' : 'solid'} ${tone.border}`,
        }}
      >
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-full"
          style={{
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

/** Hex + alpha → rgba() string. */
function hexA(hex: string, a: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}
