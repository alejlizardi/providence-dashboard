/**
 * Reshape the exported packs + drift pairs into per-suite trajectories across
 * versions, tagging the Holm-significant drift transition for highlighting.
 */
import type { DriftPair, IndexEntry, Pack } from '../types'

export interface VersionPoint {
  version: string
  packId: string
  rate: number
  ciLow: number
  ciHigh: number
  threshold: number
  verdict: string
}

export interface DriftMarker {
  fromVersion: string
  toVersion: string
  rateA: number
  rateB: number
  pHolm: number | null
  pValue: number | null
}

export interface SuiteTimeline {
  suite: string
  points: VersionPoint[]
  threshold: number
  /** Significant drift transitions on this suite (usually 0 or 1). */
  driftEvents: DriftMarker[]
}

export function buildTimelines(
  index: IndexEntry[],
  packs: Record<string, Pack>,
  drift: DriftPair[],
): SuiteTimeline[] {
  // Suite order from the first pack that has suites.
  const firstPack = index.map((e) => packs[e.id]).find(Boolean)
  const suiteNames = firstPack ? firstPack.suites.map((s) => s.suite) : []

  return suiteNames.map((name) => {
    const points: VersionPoint[] = []
    let threshold = 0
    for (const e of index) {
      const pack = packs[e.id]
      const s = pack?.suites.find((x) => x.suite === name)
      if (!s) continue
      threshold = s.threshold
      points.push({
        version: e.version,
        packId: e.id,
        rate: s.pass_rate,
        ciLow: s.ci95_low,
        ciHigh: s.ci95_high,
        threshold: s.threshold,
        verdict: s.verdict,
      })
    }

    const driftEvents: DriftMarker[] = []
    for (const pair of drift) {
      const row = pair.rows.find((r) => r.suite === name && r.significant)
      if (row) {
        driftEvents.push({
          fromVersion: pair.from_version,
          toVersion: pair.to_version,
          rateA: row.rate_a,
          rateB: row.rate_b,
          pHolm: row.p_holm,
          pValue: row.p_value,
        })
      }
    }

    return { suite: name, points, threshold, driftEvents }
  })
}

/** Suites that drifted, most-significant first — for ordering the timeline. */
export function withDriftFirst(timelines: SuiteTimeline[]): SuiteTimeline[] {
  return [...timelines].sort(
    (a, b) => b.driftEvents.length - a.driftEvents.length,
  )
}
