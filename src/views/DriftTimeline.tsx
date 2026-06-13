/**
 * V3 — drift timeline (the hero view). For each suite, pass rate across
 * versions with a CI band and the threshold line; the Holm-significant Fisher
 * drift event is highlighted with a flag marker and a plain-language callout.
 * Dark "instrument-panel" theme.
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
import { BRAND, CHART, UI } from '../theme'
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
    <div style={{ animation: 'provIn .5s ease', paddingTop: 80 }}>
      <div style={{ fontSize: 12, letterSpacing: '0.1em', color: BRAND.accent, marginBottom: 26 }}>
        Drift detection
      </div>
      <h1 style={{ margin: 0, fontSize: 46, lineHeight: 1.02, fontWeight: 700, letterSpacing: '-0.03em', color: UI.textStrong }}>
        Drift over versions
      </h1>
      <p style={{ margin: '24px 0 48px', fontSize: 16, lineHeight: 1.65, color: UI.textMuted, maxWidth: 720 }}>
        Pass rate with its 95% interval across releases. A change is flagged only
        when Fisher’s exact test, Holm-adjusted across all suites, rules it
        unlikely to be noise.
        <InfoTooltip stat="holm" label="Holm adjustment" />
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 2, background: UI.bg }}>
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
  const lineColor = hasDrift ? CHART.driftFlag : CHART.neutralLine

  return (
    <section style={{ padding: 28, background: hasDrift ? '#241b1d' : UI.skew }}>
      <div className="mb-4 flex items-center justify-between">
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: UI.text }}>{timeline.suite}</h3>
        {hasDrift && (
          <span
            className="inline-flex items-center uppercase"
            style={{
              gap: 7,
              background: 'rgba(239,85,102,0.18)',
              padding: '4px 10px',
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: '#ef6675',
            }}
          >
            ⚑ Drift
            <InfoTooltip stat="driftEvent" label="drift event" />
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
          <XAxis dataKey="version" tick={{ fontSize: 11, fill: CHART.axis }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 50, 100]}
            tick={{ fontSize: 11, fill: CHART.axis }}
            axisLine={false}
            tickLine={false}
            unit="%"
          />
          <Tooltip content={<RateTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
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
            fill={hasDrift ? 'rgba(239,85,102,0.15)' : 'rgba(255,255,255,0.08)'}
            fillOpacity={1}
            isAnimationActive={false}
          />
          {/* pass-rate line */}
          <Line
            type="monotone"
            dataKey="rate"
            stroke={lineColor}
            strokeWidth={2}
            dot={{ r: 3, fill: lineColor }}
            isAnimationActive={false}
          />
          {/* flag the drifted version */}
          {driftPoint && (
            <ReferenceDot
              x={driftPoint.version}
              y={driftPoint.rate}
              r={6}
              fill={CHART.driftFlag}
              stroke={UI.bg}
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
    <p
      style={{
        marginTop: 14,
        background: 'rgba(239,85,102,0.1)',
        borderLeft: '2px solid #ef5566',
        padding: '12px 14px',
        fontSize: 13,
        lineHeight: 1.55,
        color: '#f0b8be',
      }}
    >
      <span style={{ color: '#ef6675' }}>{timeline.suite}</span>:{' '}
      <span style={{ fontWeight: 700, color: '#f7d0d5' }}>
        {pct(e.rateA)} → {pct(e.rateB)}
      </span>{' '}
      from v{e.fromVersion} to v{e.toVersion}. Fisher p={fmtP(e.pValue)} (Holm-adjusted{' '}
      {fmtP(e.pHolm)}) — flagged DRIFT.
      <InfoTooltip stat="fisher" label="Fisher's exact test" />
    </p>
  )
}

interface RateTooltipProps {
  active?: boolean
  label?: string
  payload?: { payload?: { rate: number; low: number; high: number } }[]
}

function RateTooltip({ active, payload, label }: RateTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="border border-white/10 bg-neutral-800 px-2.5 py-1.5 text-xs shadow-xl">
      <p className="font-medium text-neutral-100">{label}</p>
      <p className="text-neutral-400">
        {d.rate.toFixed(0)}% · CI [{d.low.toFixed(0)}%, {d.high.toFixed(0)}%]
      </p>
    </div>
  )
}

const pct = (v: number) => `${(v * 100).toFixed(0)}%`
const fmtP = (p: number | null) => (p == null ? 'n/a' : p < 0.001 ? '<.001' : p.toFixed(3))
