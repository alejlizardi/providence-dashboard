/**
 * V2 — suite detail. The statistics showcase: verdict (settled vs point),
 * the Wilson interval as an error bar against the threshold, the sample-size
 * certificate, and failing items inline. Every statistic carries an (i).
 */
import type { Suite } from '../types'
import { ConfidenceBar } from '../components/ConfidenceBar'
import { VerdictBadge } from '../components/VerdictBadge'
import { SampleSizeBar } from '../components/SampleSizeBar'
import { FailingItems } from '../components/FailingItems'
import { InfoTooltip } from '../components/InfoTooltip'

export function SuiteDetail({ suite }: { suite: Suite }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{suite.suite}</h3>
          {suite.description && (
            <p className="mt-1 max-w-xl text-sm text-slate-500">{suite.description.trim()}</p>
          )}
        </div>
        <VerdictBadge verdict={suite.verdict} withInfo />
      </header>

      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <Stat label="Metric" value={suite.metric} />
        <Stat
          label="Threshold"
          value={`${(suite.threshold * 100).toFixed(0)}%`}
          info={<InfoTooltip stat="threshold" label="threshold" />}
        />
        <Stat label="Items" value={`${suite.n_passed}/${suite.n_items} passed`} />
      </dl>

      <div className="mt-5">
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
        <div className="mt-5 rounded-lg bg-slate-50 p-4">
          <SampleSizeBar cert={suite.sample_size_certificate} />
        </div>
      )}

      {suite.items.some((it) => !it.passed) && (
        <div className="mt-5">
          <h4 className="mb-2 text-sm font-medium text-slate-700">
            Failing items ({suite.items.filter((it) => !it.passed).length})
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
      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 flex items-center font-medium text-slate-800">
        {value}
        {info}
      </dd>
    </div>
  )
}
