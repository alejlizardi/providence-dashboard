import { lazy, Suspense, useState } from 'react'
import { useSiteData } from './data'
import {
  enterDemo,
  enterWithKey,
  loadSession,
  logOut as clearSession,
  type Session,
} from './auth'
import { LoadingScreen } from './brand/LoadingScreen'
import { Login } from './views/Login'
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
  const [session, setSession] = useState<Session>(() => loadSession())

  // Not logged in yet -> the gate. "View demo" and key entry set the session.
  if (session.mode === 'anonymous') {
    return (
      <Login
        onDemo={() => setSession(enterDemo())}
        onKey={(key) => setSession(enterWithKey(key))}
      />
    )
  }

  const logOut = () => {
    clearSession()
    setSession({ mode: 'anonymous' })
  }
  const sessionLabel = session.mode === 'demo' ? 'Demo' : 'Your org'

  // Key by identity: entering a key / switching to demo remounts Dashboard, so
  // its data load re-runs cleanly from scratch (no in-effect reset needed).
  const identity = session.mode === 'keyed' ? session.apiKey : session.mode
  return (
    <Dashboard
      key={identity}
      session={session}
      sessionLabel={sessionLabel}
      onLogOut={logOut}
    />
  )
}

/** The data-loading dashboard, mounted once a session exists. Split out so the
 * useSiteData hook only runs after login (hooks can't be conditional). */
function Dashboard({
  session,
  sessionLabel,
  onLogOut,
}: {
  session: Session
  sessionLabel: string
  onLogOut: () => void
}) {
  const state = useSiteData(session)
  const [tab, setTab] = useState<Tab>('overview')
  const [packId, setPackId] = useState<string | null>(null)

  if (state.status === 'loading') return <LoadingScreen />
  if (state.status === 'error')
    return (
      <div
        className="flex min-h-full flex-col items-center justify-center gap-4"
        style={{ background: UI.bg }}
      >
        <p className="bg-rose-500/15 px-4 py-3 text-sm text-rose-400">
          Couldn't load evidence: {state.error}
        </p>
        <button
          onClick={onLogOut}
          style={{ fontSize: 13, color: UI.textDim, textDecoration: 'underline', background: 'transparent', border: 0, cursor: 'pointer' }}
        >
          {session.mode === 'keyed' ? 'Check your key — log out' : 'Back to sign in'}
        </button>
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
    <AppShell tab={tab} onTab={setTab} sessionLabel={sessionLabel} onLogOut={onLogOut}>
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
