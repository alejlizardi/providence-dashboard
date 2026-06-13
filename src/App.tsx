import { useState } from 'react'
import { useSiteData } from './data'
import { LoadingScreen } from './brand/LoadingScreen'
import { AppShell } from './components/AppShell'
import { PackView } from './views/PackView'

export default function App() {
  const state = useSiteData()
  // Default to the first pack (v1.0.0) — it carries the borderline story.
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (state.status === 'loading') return <LoadingScreen />
  if (state.status === 'error')
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-50">
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Failed to load evidence data: {state.error}
        </p>
      </div>
    )

  const { index, packs } = state.data
  const currentId = selectedId ?? index[0]?.id
  const pack = currentId ? packs[currentId] : null

  return (
    <AppShell
      nav={
        <nav className="flex items-center gap-1 text-sm">
          {index.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelectedId(e.id)}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                e.id === currentId
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              v{e.version}
            </button>
          ))}
        </nav>
      }
    >
      {pack ? <PackView pack={pack} /> : <p>No pack selected.</p>}
    </AppShell>
  )
}
