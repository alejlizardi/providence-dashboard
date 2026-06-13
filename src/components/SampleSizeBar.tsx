/**
 * Sample-size certificate: one plain sentence + a thin progress bar
 * ("settled needs ~N items; you have n"). Deliberately NOT a custom gauge.
 */
import type { SampleSizeCertificate } from '../types'
import { InfoTooltip } from './InfoTooltip'

export function SampleSizeBar({ cert }: { cert: SampleSizeCertificate }) {
  if (cert.status === 'already_settled') {
    return (
      <p className="text-sm text-slate-600">
        Settled at the current sample size ({cert.n_current} items).
        <InfoTooltip stat="sampleSize" label="sample size" />
      </p>
    )
  }

  if (cert.status === 'unreachable' || cert.n_required == null) {
    return (
      <p className="text-sm text-slate-600">
        {cert.note ??
          'The observed rate sits too close to the threshold to settle within a practical sample size.'}
        <InfoTooltip stat="sampleSize" label="sample size" />
      </p>
    )
  }

  const have = cert.n_current
  const need = cert.n_required
  const frac = Math.max(0.02, Math.min(1, have / need))

  return (
    <div>
      <p className="text-sm text-slate-600">
        To <span className="font-medium text-slate-800">settle</span> this verdict you’d
        need about <span className="font-semibold text-slate-900">{need}</span> items —
        you have <span className="font-semibold text-slate-900">{have}</span>
        {cert.additional_items ? (
          <> ({cert.additional_items} more needed)</>
        ) : null}
        .
        <InfoTooltip stat="sampleSize" label="sample size" />
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-400"
          style={{ width: `${frac * 100}%` }}
        />
      </div>
    </div>
  )
}
