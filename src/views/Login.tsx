/**
 * Login screen — the entry point before any data loads.
 *
 * Two paths, matching the product's auth model:
 *   - "View demo" — no key, the public read-only showcase.
 *   - paste an API key — your org's live evidence.
 *
 * Reuses the brand aesthetic from LoadingScreen (matrix-rain + wordmark) so the
 * gate feels part of the product, not a bolt-on.
 */
import { useState } from 'react'
import { BRAND, UI } from '../theme'
import { ProvidenceWordmark, PeriapsisLockup } from '../brand/Brand'
import { MatrixCanvas } from '../brand/marks'

export function Login({
  onDemo,
  onKey,
}: {
  onDemo: () => void
  onKey: (key: string) => void
}) {
  const [key, setKey] = useState('')
  const trimmed = key.trim()

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: UI.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MatrixCanvas opacity={0.35} />
      <div
        style={{
          position: 'relative',
          width: 'min(420px, 90vw)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
        }}
      >
        {/* Brand lockup: providence · by [Periapsis wordmark + orange glyph] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ProvidenceWordmark height={28} />
          <span style={{ fontSize: 11, letterSpacing: '0.04em', color: UI.textDim }}>
            by
          </span>
          <PeriapsisLockup height={20} />
        </div>

        <div
          style={{
            width: '100%',
            background: UI.surface,
            border: `1px solid ${UI.border}`,
            borderRadius: 14,
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h1 style={{ fontSize: 17, color: UI.textStrong, margin: 0 }}>
              Sign in
            </h1>
            <p style={{ fontSize: 13, color: UI.textMuted, margin: 0, lineHeight: 1.5 }}>
              Paste your API key to see your organization's evidence, or explore
              the public demo.
            </p>
          </div>

          {/* Key entry */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (trimmed) onKey(trimmed)
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="pk_live_…"
              autoComplete="off"
              spellCheck={false}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: UI.surfaceInset,
                border: `1px solid ${UI.border}`,
                borderRadius: 8,
                padding: '11px 13px',
                color: UI.text,
                fontSize: 13,
                fontFamily: 'ui-monospace, monospace',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!trimmed}
              style={{
                width: '100%',
                padding: '11px 13px',
                borderRadius: 8,
                border: 'none',
                background: trimmed ? BRAND.accent : UI.surfaceAlt,
                color: trimmed ? '#0e1117' : UI.textDim,
                fontSize: 13,
                fontWeight: 600,
                cursor: trimmed ? 'pointer' : 'not-allowed',
                transition: 'background 0.15s',
              }}
            >
              Sign in with key
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: UI.border }} />
            <span style={{ fontSize: 10, letterSpacing: '0.18em', color: UI.textFaint, textTransform: 'uppercase' }}>
              or
            </span>
            <div style={{ flex: 1, height: 1, background: UI.border }} />
          </div>

          {/* Demo */}
          <button
            onClick={onDemo}
            style={{
              width: '100%',
              padding: '11px 13px',
              borderRadius: 8,
              border: `1px solid ${UI.border}`,
              background: 'transparent',
              color: UI.text,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            View the live demo →
          </button>
          <p style={{ fontSize: 11, color: UI.textDim, margin: 0, textAlign: 'center' }}>
            The demo is read-only public evidence — no key needed.
          </p>
        </div>
      </div>
    </div>
  )
}
