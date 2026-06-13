/**
 * V3 — drift timeline (the hero view). For each suite, pass rate across
 * versions with a CI band and the threshold line; the Holm-significant Fisher
 * drift event is highlighted with a flag marker and a plain-language callout.
 */
import {
  ComposedChart,
  Area,
  Line,
  ReferenceLine,
  ReferenceDot,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { IndexEntry, Pack } from '../types'
import { CHART } from '../theme'
import { InfoTooltip } from '../components/InfoTooltip'
import { buildTimelines, withDriftFirst, type SuiteTimeline } from '../lib/timeline'

export function DriftTimeline({
  index,
  packs,
  drift,
}: {
  index: IndexEntry[]
  packs: Record<string, Pack>
  drift: import('../types').DriftPair[]
}) {
  const timelines = withDriftFirst(buildTimelines(index, packs, drift))

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Drift over versions
        </h1>
        <p className="mt-1 max-w-2xl text-slate-500">
          Pass rate with its 95% interval across releases. A change is flagged
          only when Fisher’s exact test, Holm-adjusted across all suites, rules
          it unlikely to be noise.
          <InfoTooltip stat="holm" label="Holm adjustment" />
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        {timelines.map((t) => (
          <SuitePanel key={t.suite} timeline={t} />
        ))}
      </div>
    </div>
  )
}

function SuitePanel({ timeline }: { timeline: SuiteTimeline }) {
  const hasDrift = timeline.driftEvents.length > 0
  const data = timeline.points.map((p) => ({
    version: `v${p.version}`,
    rate: p.rate * 100,
    low: p.ciLow * 100,
    high: p.ciHigh * 100,
    band: [p.ciLow * 100, p.ciHigh * 100] as [number, number],
  }))

  // Highlight the post-drift version point.
  const driftToVersion = hasDrift ? `v${timeline.driftEvents[0].toVersion}` : null
  const driftPoint = data.find((d) => d.version === driftToVersion)

  return (
    <section
      className={`rounded-xl border bg-white p-5 shadow-sm ${
        hasDrift ? 'border-rose-200 ring-1 ring-rose-100' : 'border-slate-200'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{timeline.suite}</h3>
        {hasDrift && (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
            ⚑ DRIFT
            <InfoTooltip stat="driftEvent" label="drift event" />
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
          <XAxis dataKey="version" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 50, 100]}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            unit="%"
          />
          <Tooltip content={<RateTooltip />} />
          <ReferenceLine
            y={timeline.threshold * 100}
            stroke={CHART.threshold}
            strokeDasharray="4 3"
            strokeWidth={1.5}
          />
          {/* CI band */}
          <Area
            type="monotone"
            dataKey="band"
            stroke="none"
            fill={hasDrift ? '#fecdd3' : '#e2e8f0'}
            fillOpacity={0.6}
            isAnimationActive={false}
          />
          {/* pass-rate line */}
          <Line
            type="monotone"
            dataKey="rate"
            stroke={hasDrift ? CHART.driftFlag : '#475569'}
            strokeWidth={2}
            dot={{ r: 3, fill: hasDrift ? CHART.driftFlag : '#475569' }}
            isAnimationActive={false}
          />
          {/* flag the drifted version */}
          {driftPoint && (
            <ReferenceDot
              x={driftPoint.version}
              y={driftPoint.rate}
              r={6}
              fill={CHART.driftFlag}
              stroke="#fff"
              strokeWidth={2}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {hasDrift && <DriftCallout timeline={timeline} />}
    </section>
  )
}

function DriftCallout({ timeline }: { timeline: SuiteTimeline }) {
  const e = timeline.driftEvents[0]
  return (
    <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
      <span className="font-mono">{timeline.suite}</span>:{' '}
      <span className="font-semibold">
        {pct(e.rateA)} → {pct(e.rateB)}
      </span>{' '}
      from v{e.fromVersion} to v{e.toVersion}. Fisher p=
      {fmtP(e.pValue)} (Holm-adjusted {fmtP(e.pHolm)}) — flagged DRIFT.
      <InfoTooltip stat="fisher" label="Fisher's exact test" />
    </p>
  )
}

function RateTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow">
      <p className="font-medium text-slate-800">{label}</p>
      <p className="text-slate-600">
        {d.rate.toFixed(0)}% · CI [{d.low.toFixed(0)}%, {d.high.toFixed(0)}%]
      </p>
    </div>
  )
}

const pct = (v: number) => `${(v * 100).toFixed(0)}%`
const fmtP = (p: number | null) => (p == null ? 'n/a' : p < 0.001 ? '<.001' : p.toFixed(3))
