/**
 * Loading screen — a prominent brand slot. The Periapsis orbit loader over a
 * subtle indigo matrix-rain layer, with the providence wordmark, the "by
 * Periapsis" maker's mark, and the method tagline. Replaces the old static
 * error-bar flourish.
 */
import { UI, BRAND } from '../theme'
import { ProvidenceWordmark, PeriapsisGlyph } from './Brand'
import { OrbitLoader, MatrixCanvas } from './marks'

export function LoadingScreen({ onDismiss }: { onDismiss?: () => void }) {
  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        overflow: 'hidden',
        background: UI.bg,
        cursor: onDismiss ? 'pointer' : 'default',
      }}
    >
      <MatrixCanvas opacity={0.5} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
        }}
      >
        <OrbitLoader size={188} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ProvidenceWordmark height={30} />
            <span style={{ fontSize: 11, letterSpacing: '0.04em', color: UI.textDim }}>
              by Periapsis
            </span>
            <PeriapsisGlyph size={26} />
          </div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.36em',
              color: BRAND.accent,
              textTransform: 'uppercase',
            }}
          >
            wilson · fisher exact · holm
          </div>
        </div>
      </div>
      {onDismiss && (
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 10,
            letterSpacing: '0.24em',
            color: UI.textGhost,
            textTransform: 'uppercase',
          }}
        >
          click to skip
        </div>
      )}
    </div>
  )
}
