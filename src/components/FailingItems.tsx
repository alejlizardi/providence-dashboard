/**
 * Failing items as inline expandable rows (input / output / expected) — not a
 * separate routed view. Shows only the items that failed; that's the evidence
 * a reviewer wants to audit.
 */
import { useState } from 'react'
import type { ItemRow } from '../types'

export function FailingItems({ items }: { items: ItemRow[] }) {
  const failing = items.filter((it) => !it.passed)
  if (failing.length === 0) {
    return <p className="text-sm text-slate-500">No failing items.</p>

  }
  return (
    <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
      {failing.map((it) => (
        <FailingRow key={it.id} item={it} />
      ))}
    </ul>
  )
}

function FailingRow({ item }: { item: ItemRow }) {
  const [open, setOpen] = useState(false)
  const run = item.runs[0]
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
        aria-expanded={open}
      >
        <span
          aria-hidden
          className={`text-slate-400 transition-transform ${open ? 'rotate-90' : ''}`}
        >
          ›
        </span>
        <code className="text-xs text-slate-500">{item.id}</code>
        <span className="flex-1 truncate text-sm text-slate-700">{item.input}</span>
        <span className="rounded bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700">
          failed
        </span>
      </button>
      {open && (
        <div className="space-y-2 bg-slate-50 px-4 py-3 text-sm">
          <Field label="Input" value={item.input} />
          <Field label="Model output" value={run?.output ?? ''} tone="bad" />
          {item.expected !== undefined && (
            <Field label="Expected" value={formatExpected(item.expected)} tone="ok" />
          )}
          {run?.detail && <Field label="Why it failed" value={run.detail} />}
        </div>
      )}
    </li>
  )
}

function Field({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'ok' | 'bad'
}) {
  const color =
    tone === 'bad' ? 'text-rose-700' : tone === 'ok' ? 'text-emerald-700' : 'text-slate-700'
  return (
    <div className="grid grid-cols-[110px_1fr] gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className={`whitespace-pre-wrap break-words ${color}`}>{value}</span>
    </div>
  )
}

function formatExpected(expected: unknown): string {
  if (Array.isArray(expected)) return expected.map(String).join(', ')
  if (typeof expected === 'boolean') return expected ? 'refusal expected' : 'no refusal expected'
  return String(expected)
}
