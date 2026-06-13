/**
 * Brand slots. The glyph is the kept confidence-interval error bar; the
 * wordmark is the constructed geometric "providence" mark (drawn, not typed).
 * In prominent places we compose "providence [glyph] · by Periapsis [orbit
 * glyph]" via <BrandLockup variant="full" />. All marks live in marks.tsx;
 * this file just composes them.
 */
import { UI } from '../theme'
import { Glyph, ProvidenceWordmark } from './marks'

const base = import.meta.env.BASE_URL

/** The Periapsis orbit-sweep portrait mark, used next to "by Periapsis". */
export function PeriapsisGlyph({ size = 26 }: { size?: number }) {
  return (
    <img
      src={`${base}brand/periapsis_glyph.svg`}
      alt="Periapsis"
      style={{ height: size, width: 'auto', display: 'block' }}
    />
  )
}

/**
 * variant:
 *  - "compact": providence glyph + wordmark (header / corners)
 *  - "full":    "providence · by Periapsis" lockup (loading, footer)
 */
export function BrandLockup({
  variant = 'compact',
  size = 22,
  color,
}: {
  variant?: 'compact' | 'full'
  size?: number
  color?: string
}) {
  return (
    <span className="inline-flex items-center gap-3">
      <Glyph size={size + 4} />
      <ProvidenceWordmark height={size - 3} color={color} />
      {variant === 'full' && (
        <span className="ml-1 inline-flex items-center gap-2.5">
          <span aria-hidden style={{ color: UI.textDim }}>
            ·
          </span>
          <span style={{ fontSize: 13, letterSpacing: '0.04em', color: UI.textDim }}>
            by Periapsis
          </span>
          <PeriapsisGlyph size={size + 6} />
        </span>
      )}
    </span>
  )
}

export { Glyph, ProvidenceWordmark }
