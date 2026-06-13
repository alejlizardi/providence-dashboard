/**
 * Brand slots. The evidentry mark is a PLACEHOLDER (the error-bar glyph) until
 * a real evidentry logo is made; PeriapsisMark renders the real vendored asset.
 * In prominent places we compose "Evidentry [mark] · by Periapsis [mark]" via
 * <BrandLockup variant="full" />. Everything here is presentational so the
 * real logo drops into EvidentryMark with no other changes.
 */
import { BRAND } from '../theme'

const base = import.meta.env.BASE_URL

/** Placeholder evidentry mark: a confidence-interval error bar. Swap later. */
export function EvidentryMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="evidentry"
      data-placeholder="evidentry-logo"
    >
      <rect width="32" height="32" rx="7" fill={BRAND.accent} />
      <line x1="7" y1="16" x2="25" y2="16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="7" y1="11" x2="7" y2="21" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="25" y1="11" x2="25" y2="21" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="19" cy="16" r="3" fill="#a5b4fc" />
    </svg>
  )
}

/** Real Periapsis orbit mark (vendored to public/brand/). */
export function PeriapsisMark({ size = 18 }: { size?: number }) {
  return (
    <img
      src={`${base}brand/periapsis-mark.svg`}
      width={size}
      height={size}
      alt="Periapsis"
      style={{ display: 'block' }}
    />
  )
}

export function EvidentryWordmark() {
  return (
    <span className="font-semibold tracking-tight text-slate-900">evidentry</span>
  )
}

/**
 * variant:
 *  - "compact": evidentry mark + wordmark (header corners)
 *  - "full":    "evidentry · by Periapsis" lockup (loading, hero, footer)
 */
export function BrandLockup({
  variant = 'compact',
  size = 22,
}: {
  variant?: 'compact' | 'full'
  size?: number
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <EvidentryMark size={size} />
      <EvidentryWordmark />
      {variant === 'full' && (
        <span className="ml-1 inline-flex items-center gap-1.5 text-sm text-slate-400">
          <span aria-hidden>·</span>
          <span>by</span>
          <PeriapsisMark size={Math.round(size * 0.8)} />
          <span className="font-medium text-slate-500">Periapsis</span>
        </span>
      )}
    </span>
  )
}
