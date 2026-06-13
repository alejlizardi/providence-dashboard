/**
 * App chrome: a header with the compact brand lockup and a footer with the
 * full "providence · by Periapsis" lockup (a prominent brand slot). Layout
 * only — presentational, easy to restyle.
 */
import type { ReactNode } from 'react'
import { BrandLockup } from '../brand/Brand'

export function AppShell({
  children,
  nav,
}: {
  children: ReactNode
  nav?: ReactNode
}) {
  return (
    <div className="flex min-h-full flex-col bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <BrandLockup variant="compact" size={22} />
          {nav}
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-sm text-slate-400">
          <BrandLockup variant="full" size={20} />
          <a
            href="https://github.com/alejlizardi/providence"
            className="hover:text-slate-600"
            target="_blank"
            rel="noreferrer"
          >
            github.com/alejlizardi/providence
          </a>
        </div>
      </footer>
    </div>
  )
}
