import { lazy, Suspense, useState } from 'react'
import { useSiteData } from './data'
import { LoadingScreen } from './brand/LoadingScreen'
import { AppShell } from './components/AppShell'
import { Overview } from './views/Overview'
import { PackView } from './views/PackView'

// Drift pulls in Recharts (~370 kB); load it only when its tab is opened so
// the landing stays light.
const DriftTimeline = lazy(() =>
  import('./views/DriftTimeline').then((m) => ({ default: m.DriftTimeline })),
)

type Tab = 'overview' | 'drift' | 'suites'

export default function App() {
  const state = useSiteData()
  const [tab, setTab] = useState<Tab>('overview')
  const [packId, setPackId] = useState<string | null>(null)

  if (state.status === 'loading') return <LoadingScreen />
  if (state.status === 'error')
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-50">
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Failed to load evidence data: {state.error}
        </p>
      </div>
    )

  const { index, packs, drift } = state.data
  const currentPackId = packId ?? index[0]?.id
  const pack = currentPackId ? packs[currentPackId] : null

  const openPack = (id: string) => {
    setPackId(id)
    setTab('suites')
  }

  return (
    <AppShell
      nav={
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1 text-sm">
            <TabButton active={tab === 'overview'} onClick={() => setTab('overview')}>
              Overview
            </TabButton>
            <TabButton active={tab === 'drift'} onClick={() => setTab('drift')}>
              Drift
            </TabButton>
            <TabButton active={tab === 'suites'} onClick={() => setTab('suites')}>
              Suites
            </TabButton>
          </nav>
          {tab === 'suites' && (
            <select
              value={currentPackId}
              onChange={(e) => setPackId(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
              aria-label="Select version"
            >
              {index.map((e) => (
                <option key={e.id} value={e.id}>
                  v{e.version}
                </option>
              ))}
            </select>
          )}
        </div>
      }
    >
      {tab === 'overview' && (
        <Overview
          index={index}
          packs={packs}
          onOpenPack={openPack}
          onOpenSuite={(id) => openPack(id)}
        />
      )}
      {tab === 'drift' && (
        <Suspense
          fallback={<p className="py-12 text-center text-sm text-slate-400">Loading charts…</p>}
        >
          <DriftTimeline index={index} packs={packs} drift={drift} />
        </Suspense>
      )}
      {tab === 'suites' && pack && <PackView pack={pack} />}
    </AppShell>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 font-medium transition ${
        active
          ? 'bg-indigo-50 text-indigo-700'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
      }`}
    >
      {children}
    </button>
  )
}
