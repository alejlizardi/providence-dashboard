/**
 * Loading screen — a prominent brand slot. Shows the "providence · by Periapsis"
 * lockup with a subtly animated error-bar (the project's signature mark). The
 * animation is a placeholder flourish; easy to restyle later.
 */
import { BrandLockup } from './Brand'

export function LoadingScreen({ message = 'Loading evidence…' }: { message?: string }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-slate-50">
      <BrandLockup variant="full" size={28} />
      <svg width="160" height="36" viewBox="0 0 160 36" role="img" aria-label="loading">
        {/* an error bar whose point estimate slides along the interval */}
        <line x1="16" y1="18" x2="144" y2="18" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
        <line x1="16" y1="9" x2="16" y2="27" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
        <line x1="144" y1="9" x2="144" y2="27" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
        <circle r="6" cy="18" fill="#6366f1">
          <animate
            attributeName="cx"
            values="40;120;40"
            dur="1.6s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
            keyTimes="0;0.5;1"
          />
        </circle>
      </svg>
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  )
}
