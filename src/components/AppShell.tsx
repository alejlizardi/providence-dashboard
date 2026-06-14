/**
 * App chrome: a sticky left sidebar (brand lockup, large nav, method + maker's
 * mark footer) and a scrolling main column. Dark "instrument-panel" layout from
 * the Claude Design pass. Presentational — nav state is driven from App.
 */
import type { ReactNode } from 'react'
import { UI } from '../theme'
import { Glyph, ProvidenceWordmark, PeriapsisGlyph } from '../brand/Brand'

export type Tab = 'overview' | 'drift' | 'suites'

const NAV: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'drift', label: 'Drift' },
  { id: 'suites', label: 'Suites' },
]

export function AppShell({
  children,
  tab,
  onTab,
  sessionLabel,
  onLogOut,
}: {
  children: ReactNode
  tab: Tab
  onTab: (t: Tab) => void
  /** Short label for the current identity ("Demo", "Your org"). */
  sessionLabel?: string
  onLogOut?: () => void
}) {
  return (
    <div className="prov-shell" style={{ background: UI.bg, color: UI.text }}>
      <aside className="prov-sidebar" style={{ background: UI.bg }}>
        <div>
          <div className="mb-12 flex items-center gap-3">
            <Glyph size={26} />
            <ProvidenceWordmark height={19} />
          </div>
          <nav className="prov-sidebar-nav flex flex-col gap-2.5">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => onTab(n.id)}
                className="prov-nav text-left"
                style={{
                  border: 0,
                  background: 'transparent',
                  padding: 0,
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  cursor: 'pointer',
                  color: tab === n.id ? UI.text : UI.textDim,
                  transition: 'color .15s',
                }}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="prov-sidebar-meta flex flex-col gap-6">
          <div>
            <div
              className="mb-2 uppercase"
              style={{ fontSize: 10.5, letterSpacing: '0.12em', color: UI.textFaint }}
            >
              Method
            </div>
            <div style={{ fontSize: 13, color: '#b8b8b3', lineHeight: 1.55 }}>
              Wilson interval
              <br />
              Fisher exact · Holm
            </div>
          </div>
          <div>
            <div
              className="mb-2.5 uppercase"
              style={{ fontSize: 10.5, letterSpacing: '0.12em', color: UI.textFaint }}
            >
              By
            </div>
            <div className="flex items-center gap-2.5">
              <span style={{ fontSize: 16, fontWeight: 600, color: '#cfcfca' }}>Periapsis</span>
              <PeriapsisGlyph size={28} />
            </div>
          </div>
          {onLogOut && (
            <div>
              <div
                className="mb-2 uppercase"
                style={{ fontSize: 10.5, letterSpacing: '0.12em', color: UI.textFaint }}
              >
                Session
              </div>
              <div className="flex items-center gap-2.5" style={{ fontSize: 13 }}>
                <span style={{ color: '#b8b8b3' }}>{sessionLabel}</span>
                <button
                  onClick={onLogOut}
                  style={{
                    border: 0,
                    background: 'transparent',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: 12,
                    color: UI.textDim,
                    textDecoration: 'underline',
                  }}
                >
                  Log out
                </button>
              </div>
            </div>
          )}
          <a
            href="https://github.com/alejlizardi/providence"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 10.5, letterSpacing: '0.02em', color: UI.textGhost }}
            className="hover:text-neutral-400"
          >
            github.com/alejlizardi/providence
          </a>
        </div>
      </aside>

      <main className="prov-main">{children}</main>
    </div>
  )
}
