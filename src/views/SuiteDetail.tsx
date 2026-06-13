/**
 * V2 — suite detail. The statistics showcase: verdict (settled vs point),
 * the Wilson interval as an error bar against the threshold, the sample-size
 * certificate, and failing items inline. Every statistic carries an (i).
 * Dark "instrument-panel" card from the Claude Design pass.
 */
import type { Suite } from '../types'
import { UI } from '../theme'
import { ConfidenceBar } from '../components/ConfidenceBar'
import { VerdictBadge } from '../components/VerdictBadge'
import { SampleSizeBar } from '../components/SampleSizeBar'
import { FailingItems } from '../components/FailingItems'
import { InfoTooltip } from '../components/InfoTooltip'

export function SuiteDetail({ suite }: { suite: Suite }) {
  const nFailing = suite.items.filter((it) => !it.passed).length

  return (
    <section style={{ background: UI.surface, padding: '32px 36px' }}>
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h3 style={{ margin: 0, fontSize: 19, fontWeight: 600, color: UI.textStrong }}>
            {suite.suite}
          </h3>
          {suite.description && (
            <p style={{ margin: '12px 0 0', fontSize: 15, lineHeight: 1.6, color: '#8a8a86', maxWidth: 640 }}>
              {suite.description.trim()}
            </p>
          )}
        </div>
        <VerdictBadge verdict={suite.verdict} withInfo />
      </header>

      <dl className="flex flex-wrap" style={{ marginTop: 28, gap: '0 52px' }}>
        <Stat label="Metric" value={suite.metric} />
        <Stat
          label="Threshold"
          value={`${(suite.threshold * 100).toFixed(0)}%`}
          info={<InfoTooltip stat="threshold" label="threshold" />}
        />
        <Stat label="Items" value={`${suite.n_passed}/${suite.n_items} passed`} />
      </dl>

      <div style={{ marginTop: 30 }}>
        <ConfidenceBar
          rate={suite.pass_rate}
          ciLow={suite.ci95_low}
          ciHigh={suite.ci95_high}
          threshold={suite.threshold}
          verdict={suite.verdict}
          ciMethod={suite.ci_method}
        />
      </div>

      {suite.sample_size_certificate && (
        <div style={{ marginTop: 24, background: UI.surfaceInset, padding: '16px 20px' }}>
          <SampleSizeBar cert={suite.sample_size_certificate} />
        </div>
      )}

      {nFailing > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4
            className="mb-2 uppercase"
            style={{ fontSize: 12, letterSpacing: '0.04em', color: '#ef6675' }}
          >
            ↳ Failing items ({nFailing})
          </h4>
          <FailingItems items={suite.items} />
        </div>
      )}
    </section>
  )
}

function Stat({
  label,
  value,
  info,
}: {
  label: string
  value: string
  info?: React.ReactNode
}) {
  return (
    <div>
      <dt className="uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: UI.textFaint }}>
        {label}
      </dt>
      <dd className="mt-1.5 flex items-center font-medium" style={{ fontSize: 14, color: '#e8e8e4' }}>
        {value}
        {info}
      </dd>
    </div>
  )
}
