/**
 * An (i) affordance that reveals a statistic's explanation on hover/focus.
 * This is the "rigor made visible" layer. Pure CSS hover + focus-visible for
 * keyboard users; copy comes from stats-copy.ts.
 */
import { useId, useState } from 'react'
import { STAT_COPY, type StatKey } from '../stats-copy'

export function InfoTooltip({ stat, label }: { stat: StatKey; label?: string }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const text = STAT_COPY[stat]

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label={label ? `About ${label}` : 'More information'}
        aria-describedby={open ? id : undefined}
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px] font-semibold leading-none text-slate-500 hover:border-slate-400 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        i
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-1/2 top-6 z-20 w-72 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-normal leading-relaxed text-slate-600 shadow-lg"
        >
          {text}
        </span>
      )}
    </span>
  )
}
