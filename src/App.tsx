import { useEffect, useState } from 'react'

type IndexEntry = {
  id: string
  model_name: string
  version: string
  generated_at: string
  suites_passed: number
  total_suites: number
  headline_verdict: string
}

const DATA = import.meta.env.BASE_URL + 'data/'

export default function App() {
  const [index, setIndex] = useState<IndexEntry[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(DATA + 'index.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setIndex)
      .catch((e) => setError(String(e)))
  }, [])

  return (
    <div className="min-h-full bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          evidentry · dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          AI eval results, made statistically defensible
        </h1>
        <p className="mt-3 text-slate-600">
          Deploy skeleton is live. Data pipeline check below — the real views
          land next.
        </p>

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">
            Loaded {index ? `${index.length} pack(s)` : '…'} from{' '}
            <code className="text-slate-700">{DATA}index.json</code>
          </h2>

          {error && (
            <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
              Failed to load data: {error}
            </p>
          )}

          {index && (
            <ul className="mt-4 divide-y divide-slate-100">
              {index.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between py-3"
                >
                  <span className="font-medium text-slate-900">
                    {e.model_name}{' '}
                    <span className="text-slate-400">v{e.version}</span>
                  </span>
                  <span className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500">
                      {e.suites_passed}/{e.total_suites} suites
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-xs text-slate-700">
                      {e.headline_verdict}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
