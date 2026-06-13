import { lazy, Suspense, useState } from 'react'
import { useSiteData } from './data'
import { LoadingScreen } from './brand/LoadingScreen'
import { AppShell, type Tab } from './components/AppShell'
import { UI } from './theme'
import { Overview } from './views/Overview'
import { PackView } from './views/PackView'

// Drift pulls in Recharts (~370 kB); load it only when its tab is opened so
// the landing stays light.
const DriftTimeline = lazy(() =>
  import('./views/DriftTimeline').then((m) => ({ default: m.DriftTimeline })),
)

export default function App() {
  const state = useSiteData()
  const [tab, setTab] = useState<Tab>('overview')
  const [packId, setPackId] = useState<string | null>(null)

  if (state.status === 'loading') return <LoadingScreen />
  if (state.status === 'error')
    return (
      <div
        className="flex min-h-full items-center justify-center"
        style={{ background: UI.bg }}
      >
        <p className="bg-rose-500/15 px-4 py-3 text-sm text-rose-400">
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
    <AppShell tab={tab} onTab={setTab}>
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
          fallback={
            <p className="py-12 text-center text-sm" style={{ color: UI.textDim }}>
              Loading charts…
            </p>
          }
        >
          <DriftTimeline index={index} packs={packs} drift={drift} />
        </Suspense>
      )}
      {tab === 'suites' && pack && (
        <PackView
          pack={pack}
          versions={index}
          currentId={currentPackId}
          onSelectVersion={setPackId}
        />
      )}
    </AppShell>
  )
}
