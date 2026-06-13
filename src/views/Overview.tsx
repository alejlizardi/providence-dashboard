/**
 * V1 — overview / landing. Leads with the borderline "passes but NOT settled"
 * story (legible in 5 seconds), then the pack series as version tiles. This
 * screen carries the 90-second impression: stats + product judgment at a glance.
 * Dark "instrument-panel" layout from the Claude Design pass.
 */
import type { IndexEntry, Pack } from '../types'
import { BRAND, TONE, UI, VERDICT_STYLES } from '../theme'
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
  const storyPack = story && packs[story.packId]
  const storySuite = storyPack?.suites.find((s) => s.suite === story?.suite)
  const modelName = index[0]?.model_name

  return (
    <div className="prov-view-top" style={{ animation: 'provIn .5s ease', paddingTop: 70 }}>
      <div style={{ fontSize: 12, letterSpacing: '0.1em', color: BRAND.accent, marginBottom: 26 }}>
        Statistical evidence engine
      </div>
      <h1
        className="prov-hero-title"
        style={{
          margin: '0 0 18px',
          lineHeight: 1.0,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: UI.textStrong,
          maxWidth: '15ch',
        }}
      >
        AI eval results, made defensible
      </h1>
      <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: UI.textMuted, maxWidth: 520 }}>
        Pass rates with the uncertainty attached — settled vs not, and drift you
        can actually defend.
      </p>

      {story && storySuite && storyPack && (
        <div style={{ position: 'relative', marginTop: 54 }}>
          <div
            aria-hidden
            style={{ position: 'absolute', inset: '-12px -16px', background: UI.surfaceAlt, transform: 'skewY(-2deg)', zIndex: 0 }}
          />
          <div
            className="prov-feature"
            style={{
              position: 'relative',
              zIndex: 1,
              background: UI.surfaceAlt,
              color: UI.text,
              padding: '44px 46px',
              display: 'grid',
              gridTemplateColumns: '1.05fr 0.95fr',
              gap: 44,
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 23, fontWeight: 700, letterSpacing: '-0.01em', color: BRAND.accent, lineHeight: 1 }}>
                Read in 5 seconds
              </div>
              <div
                style={{ marginTop: 8, fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', color: UI.textStrong }}
              >
                {story.suite}
              </div>
              <div style={{ marginTop: 14, display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 15, color: '#8c8c8c' }}>
                <span style={{ borderBottom: `2px solid ${BRAND.accent}`, paddingBottom: 2, color: UI.text, fontWeight: 700 }}>
                  {pct(story.rate)} pass
                </span>
                <span>
                  95% CI [{pct(story.ciLow)}, {pct(story.ciHigh)}]
                </span>
                <span>target {pct(story.threshold)}</span>
              </div>
              <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {storyPack.suites.map((s) => {
                  const tone = TONE[VERDICT_STYLES[s.verdict].tone]
                  return (
                    <div key={s.suite} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '4px 0' }}>
                      <span style={{ width: 9, height: 9, flexShrink: 0, background: tone.bar }} />
                      <span style={{ fontSize: 21, fontWeight: 700, color: '#fff', minWidth: 64 }}>
                        {pct(s.pass_rate)}
                      </span>
                      <span style={{ fontSize: 21, fontWeight: 500, color: '#cfcfca' }}>{s.suite}</span>
                    </div>
                  )
                })}
              </div>
              <button
                onClick={() => onOpenSuite(story.packId, story.suite)}
                style={{
                  marginTop: 28,
                  border: 0,
                  background: 'transparent',
                  padding: 0,
                  fontSize: 14,
                  fontWeight: 700,
                  color: UI.text,
                  cursor: 'pointer',
                  borderBottom: `2px solid ${BRAND.accent}`,
                  lineHeight: 1.6,
                }}
              >
                See the evidence →
              </button>
            </div>
            <div>
              <ConfidenceBar
                rate={storySuite.pass_rate}
                ciLow={storySuite.ci95_low}
                ciHigh={storySuite.ci95_high}
                threshold={storySuite.threshold}
                verdict={storySuite.verdict}
                ciMethod={storySuite.ci_method}
                height={60}
                showCaption={false}
              />
              <div style={{ marginTop: 14, fontSize: 12.5, lineHeight: 1.5, color: '#8c8c8c' }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>NOT settled</span> — the
                interval crosses below target
                {story.additionalItems ? `. ~${story.additionalItems} more items needed` : ''}.
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 66 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: UI.text }}>Validation history</div>
          <div style={{ fontSize: 12, color: UI.textDim }}>
            model: <span style={{ color: UI.text }}>{modelName}</span>
          </div>
        </div>
        <p style={{ margin: '0 0 22px', fontSize: 14, lineHeight: 1.6, color: UI.textMuted, maxWidth: 640 }}>
          Each tile is one <span style={{ color: UI.text }}>release of {modelName}</span> — the
          model was re-validated at every version. The badge is the release’s headline
          verdict (its worst suite). Open one to see the suites behind it.
        </p>
        <div style={{ position: 'relative' }}>
          <div
            aria-hidden
            style={{ position: 'absolute', inset: '-10px -14px', background: UI.skew, transform: 'skewY(1.4deg)', zIndex: 0 }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: 2,
              background: UI.bg,
            }}
          >
            {index.map((e) => {
              const pack = packs[e.id]
              return (
                <button
                  key={e.id}
                  onClick={() => onOpenPack(e.id)}
                  className="prov-row text-left"
                  style={{
                    border: 0,
                    background: UI.surfaceAlt,
                    padding: '28px 26px 30px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 218,
                    transition: 'background .15s',
                  }}
                >
                  <span
                    className="uppercase"
                    style={{ fontSize: 10.5, letterSpacing: '0.16em', color: UI.textFaint, marginBottom: 16 }}
                  >
                    Release
                  </span>
                  <span style={{ fontSize: 33, fontWeight: 600, letterSpacing: '-0.02em', color: UI.textStrong, lineHeight: 1 }}>
                    v{e.version}
                  </span>
                  <span style={{ fontSize: 14, color: UI.textMuted, marginTop: 10 }}>
                    {e.suites_passed}/{e.total_suites} suites passing
                  </span>
                  <span style={{ marginTop: 'auto', paddingTop: 18 }}>
                    {pack && <VerdictBadge verdict={headlineVerdict(pack)} size="sm" />}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const pct = (v: number) => `${(v * 100).toFixed(0)}%`
