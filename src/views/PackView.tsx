/**
 * A single pack: a "Suite detail" header with a version selector, the model
 * card meta, then every suite rendered as a SuiteDetail. Dark theme.
 */
import type { IndexEntry, Pack } from '../types'
import { BRAND, UI } from '../theme'
import { VerdictBadge } from '../components/VerdictBadge'
import { SuiteDetail } from './SuiteDetail'
import { headlineVerdict } from '../lib/verdict'

export function PackView({
  pack,
  versions,
  currentId,
  onSelectVersion,
}: {
  pack: Pack
  versions: IndexEntry[]
  currentId: string
  onSelectVersion: (id: string) => void
}) {
  const m = pack.model
  return (
    <div className="prov-view-top" style={{ animation: 'provIn .5s ease', paddingTop: 80 }}>
      <div className="flex flex-wrap items-end justify-between gap-x-5 gap-y-4">
        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.1em', color: BRAND.accent, marginBottom: 26 }}>
            Suite detail · v{m.version}
          </div>
          <h1 className="prov-view-title" style={{ margin: 0, lineHeight: 1.02, fontWeight: 700, letterSpacing: '-0.03em', color: UI.textStrong }}>
            Suite detail
          </h1>
        </div>
        <div className="relative mb-2 flex flex-shrink-0 items-center">
          <select
            value={currentId}
            onChange={(e) => onSelectVersion(e.target.value)}
            aria-label="Select version"
            style={{
              appearance: 'none',
              background: UI.surfaceAlt,
              color: UI.text,
              border: 0,
              padding: '9px 32px 9px 14px',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {versions.map((e) => (
              <option key={e.id} value={e.id}>
                v{e.version}
              </option>
            ))}
          </select>
          <span aria-hidden className="pointer-events-none absolute right-3" style={{ color: UI.textDim, fontSize: 9 }}>
            ▼
          </span>
        </div>
      </div>

      <p style={{ margin: '24px 0 16px', fontSize: 16, lineHeight: 1.65, color: UI.text, maxWidth: 720 }}>
        One release, broken out into the suites that were run against it. Each bar
        is the real Wilson confidence interval around the suite’s pass rate, and the
        dashed line is the threshold it has to clear. The bar is the evidence; the
        line is the target.
      </p>
      <p style={{ margin: '0 0 40px', fontSize: 15, lineHeight: 1.65, color: UI.textMuted, maxWidth: 720 }}>
        A solid fill means the verdict is settled: the whole interval sits above
        the threshold, so the pass holds even at the pessimistic end of the
        sample. A hatched fill is a PASS (point) — the average cleared the bar, but
        the interval still dips below it, so there isn’t enough data to call it yet.
        When that happens the suite shows how many more items it would take to
        settle.
      </p>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-2" style={{ marginBottom: 28 }}>
        <Meta label="Model" value={`${m.name} v${m.version}`} />
        {m.owner && <Meta label="Owner" value={m.owner} />}
        {m.materiality_tier != null && <Meta label="Materiality" value={`Tier ${m.materiality_tier}`} />}
        <Meta label="Suites" value={`${pack.summary.suites_passed}/${pack.summary.total_suites} passing`} />
        <Meta label="Provider" value={pack.provider.type} />
        <span className="ml-auto">
          <VerdictBadge verdict={headlineVerdict(pack)} />
        </span>
      </div>

      <div className="flex flex-col" style={{ gap: 2 }}>
        {pack.suites.map((s) => (
          <SuiteDetail key={s.suite} suite={s} />
        ))}
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: UI.textFaint }}>
        {label}
      </dt>
      <dd className="mt-1 max-w-xs truncate font-medium" style={{ fontSize: 14, color: '#e8e8e4' }}>
        {value}
      </dd>
    </div>
  )
}
