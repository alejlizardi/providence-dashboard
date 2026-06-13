/**
 * A single pack: model card header + every suite rendered as a SuiteDetail.
 * Phase 1.2 entry point — this is where the suite-detail showcase lives.
 */
import type { Pack } from '../types'
import { VerdictBadge } from '../components/VerdictBadge'
import { SuiteDetail } from './SuiteDetail'
import { headlineVerdict } from '../lib/verdict'

export function PackView({ pack }: { pack: Pack }) {
  const m = pack.model
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {m.name} <span className="font-normal text-slate-400">v{m.version}</span>
            </h2>
            {m.use_case && (
              <p className="mt-1 max-w-2xl text-sm text-slate-500">{m.use_case.trim()}</p>
            )}
          </div>
          <VerdictBadge verdict={headlineVerdict(pack)} />
        </div>
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          {m.owner && <Meta label="Owner" value={m.owner} />}
          {m.materiality_tier != null && <Meta label="Materiality" value={`Tier ${m.materiality_tier}`} />}
          <Meta
            label="Suites"
            value={`${pack.summary.suites_passed}/${pack.summary.total_suites} passing`}
          />
          <Meta label="Provider" value={pack.provider.type} />
        </dl>
      </section>

      {pack.suites.map((s) => (
        <SuiteDetail key={s.suite} suite={s} />
      ))}
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 max-w-xs truncate font-medium text-slate-800">{value}</dd>
    </div>
  )
}
