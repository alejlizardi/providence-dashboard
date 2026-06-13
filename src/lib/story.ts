/**
 * Find the most compelling "passes but NOT settled" suite across the series —
 * the borderline story the landing leads with. We want a PASS (point) whose
 * interval dips well below the threshold and that needs many more items to
 * settle (the more dramatic, the better the teaching moment).
 */
import type { IndexEntry, Pack } from '../types'

export interface BorderlineStory {
  packId: string
  version: string
  suite: string
  rate: number
  threshold: number
  ciLow: number
  ciHigh: number
  additionalItems: number | null
  nCurrent: number
}

export function findBorderlineStory(
  index: IndexEntry[],
  packs: Record<string, Pack>,
): BorderlineStory | null {
  let best: BorderlineStory | null = null
  let bestScore = -Infinity

  for (const entry of index) {
    const pack = packs[entry.id]
    if (!pack) continue
    for (const s of pack.suites) {
      if (s.verdict !== 'PASS (point)') continue
      const cert = s.sample_size_certificate
      const more = cert?.additional_items ?? null
      // We want the most TEACHABLE borderline, not the noisiest. The point is
      // "the point estimate clears the bar, but there isn't enough evidence
      // to call it." That lands best when the rate is genuinely CLOSE to the
      // threshold on a reasonable sample — not a wild rate on n=8 (where the
      // interval is trivially wide and the items-needed runs to thousands).
      // So: reward a credible items-needed (~tens to a few hundred), reward a
      // decent sample, and lightly reward the rate sitting just above the bar.
      if (more == null || more <= 0) continue
      const credibleItems =
        more <= 400 ? 1 - Math.abs(more - 150) / 400 : -((more - 400) / 1500)
      const sampleScore = Math.min(1, s.n_items / 16) // prefer n≈16+ over n=8
      const proximity = 1 - Math.min(1, Math.abs(s.pass_rate - s.threshold) / 0.2)
      const score = credibleItems * 2 + sampleScore + proximity
      if (score > bestScore) {
        bestScore = score
        best = {
          packId: entry.id,
          version: entry.version,
          suite: s.suite,
          rate: s.pass_rate,
          threshold: s.threshold,
          ciLow: s.ci95_low,
          ciHigh: s.ci95_high,
          additionalItems: more,
          nCurrent: s.n_items,
        }
      }
    }
  }
  return best
}
