/**
 * V1 — overview / landing. Leads with the borderline "passes but NOT settled"
 * story (legible in 5 seconds), then the pack series as cards. This screen
 * carries the 90-second impression: stats + product judgment at a glance.
 */
import type { IndexEntry, Pack } from '../types'
import { VerdictBadge } from '../components/VerdictBadge'
import { ConfidenceBar } from '../components/ConfidenceBar'
import { findBorderlineStory } from '../lib/story'
import { headlineVerdict } from '../lib/verdict'

export function Overview({
  index,
  packs,
  onOpenPack,
  onOpenSuite,
}: {
  index: IndexEntry[]
  packs: Record<string, Pack>
  onOpenPack: (id: string) => void
  onOpenSuite: (id: string, suite: string) => void
}) {
  const story = findBorderlineStory(index, packs)
  const storySuite =
    story && packs[story.packId]?.suites.find((s) => s.suite === story.suite)

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          AI eval results, made statistically defensible
        </h1>
        <p className="mt-1 text-slate-500">
          Pass rates with the uncertainty attached — settled vs not, and drift
          you can actually defend.
        </p>
      </header>

      {story && storySuite && (
        <section className="overflow-hidden rounded-xl border border-amber-200 bg-amber-50/60 shadow-sm">
          <div className="border-b border-amber-200 bg-amber-50 px-6 py-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-700">
              Read this in five seconds
            </span>
          </div>
          <div className="grid gap-6 p-6 md:grid-cols-[1fr_minmax(0,1.1fr)] md:items-center">
            <div>
              <p className="text-lg leading-relaxed text-slate-800">
                <span className="font-mono text-base text-slate-600">
                  {story.suite}
                </span>{' '}
                <span className="font-semibold text-slate-900">
                  passes at {pct(story.rate)}
                </span>{' '}
                (target {pct(story.threshold)}) — but{' '}
                <span className="font-bold text-amber-700">NOT settled</span>:
                95% CI [{pct(story.ciLow)}, {pct(story.ciHigh)}]
                {story.additionalItems
                  ? `, ~${story.additionalItems} more items needed`
                  : ''}
                .{' '}
                <span className="font-semibold text-slate-900">
                  Don’t ship yet.
                </span>
              </p>
              <button
                onClick={() => onOpenSuite(story.packId, story.suite)}
                className="mt-4 inline-flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-amber-800 shadow-sm ring-1 ring-amber-200 hover:bg-amber-100"
              >
                See the evidence →
              </button>
            </div>
            <div className="rounded-lg bg-white/70 p-4">
              <ConfidenceBar
                rate={storySuite.pass_rate}
                ciLow={storySuite.ci95_low}
                ciHigh={storySuite.ci95_high}
                threshold={storySuite.threshold}
                verdict={storySuite.verdict}
                ciMethod={storySuite.ci_method}
              />
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Validation history · {index[0]?.model_name}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {index.map((e) => {
            const pack = packs[e.id]
            return (
              <li key={e.id}>
                <button
                  onClick={() => onOpenPack(e.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow"
                >
                  <div>
                    <p className="font-semibold text-slate-900">v{e.version}</p>
                    <p className="text-sm text-slate-500">
                      {e.suites_passed}/{e.total_suites} suites passing
                    </p>
                  </div>
                  {pack && <VerdictBadge verdict={headlineVerdict(pack)} size="sm" />}
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

const pct = (v: number) => `${(v * 100).toFixed(0)}%`
