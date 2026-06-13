/** Headline verdict for a pack: worst suite wins (mirrors backend export). */
import type { Verdict } from '../theme'
import type { Pack } from '../types'

const RANK: Record<Verdict, number> = {
  FAIL: 0,
  'FAIL (point)': 1,
  'PASS (point)': 2,
  PASS: 3,
}

export function headlineVerdict(pack: Pack): Verdict {
  const verdicts = pack.suites.map((s) => s.verdict)
  if (verdicts.length === 0) return 'PASS'
  return verdicts.reduce((worst, v) => (RANK[v] < RANK[worst] ? v : worst))
}
