/**
 * Sample-size certificate: one plain sentence + a thin progress bar
 * ("settled needs ~N items; you have n"). Deliberately NOT a custom gauge.
 * Dark-theme tokens.
 */
import { BRAND, UI } from '../theme'
import type { SampleSizeCertificate } from '../types'
import { InfoTooltip } from './InfoTooltip'

export function SampleSizeBar({ cert }: { cert: SampleSizeCertificate }) {
  if (cert.status === 'already_settled') {
    return (
      <p className="text-[13px]" style={{ color: UI.textMuted }}>
        Settled at the current sample size ({cert.n_current} items).
        <InfoTooltip stat="sampleSize" label="sample size" />
      </p>
    )
  }

  if (cert.status === 'unreachable' || cert.n_required == null) {
    return (
      <p className="text-[13px]" style={{ color: UI.textMuted }}>
        {cert.note ??
          'The observed rate sits too close to the threshold to settle within a practical sample size.'}
        <InfoTooltip stat="sampleSize" label="sample size" />
      </p>
    )
  }

  const have = cert.n_current
  const need = cert.n_required
  const frac = Math.max(0.02, Math.min(1, have / need))
  const strong = { fontWeight: 600, color: UI.textStrong }

  return (
    <div>
      <p className="text-[13px] leading-relaxed" style={{ color: UI.text }}>
        To <span style={strong}>settle</span> this verdict you’d need about{' '}
        <span style={strong}>{need}</span> items — you have <span style={strong}>{have}</span>
        {cert.additional_items ? (
          <>
            {' '}
            (<span style={{ color: BRAND.accentDot }}>{cert.additional_items} more</span> needed)
          </>
        ) : null}
        .
        <InfoTooltip stat="sampleSize" label="sample size" />
      </p>
      <div
        className="mt-3.5 h-[5px] max-w-[380px] overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.1)' }}
      >
        <div className="h-full" style={{ width: `${frac * 100}%`, background: BRAND.accent }} />
      </div>
    </div>
  )
}
