/**
 * Client-side session: the API key, kept in localStorage so a login survives
 * reloads. There are two ways to "be logged in":
 *
 *   - demo mode  — no key; the backend serves the public demo org read-only.
 *   - keyed mode — a real API key, sent as `Authorization: Bearer <key>`.
 *
 * A key is a bearer credential: anyone holding it can read that org's data.
 * localStorage is the standard place for a dashboard token; it's exposed to
 * XSS, which is an accepted tradeoff for a read-mostly analytics UI (and the
 * same tradeoff every "paste your API key" dashboard makes). Log out clears it.
 */

const KEY_STORAGE = 'periapsis.apiKey'
const MODE_STORAGE = 'periapsis.mode' // 'demo' | 'keyed' — distinguishes
// "chose the demo" from "hasn't logged in yet" (both have no key).

export type Session =
  | { mode: 'anonymous' } // hasn't chosen yet -> show login
  | { mode: 'demo' } // public demo, no key
  | { mode: 'keyed'; apiKey: string } // real org via key

export function loadSession(): Session {
  const key = localStorage.getItem(KEY_STORAGE)
  if (key) return { mode: 'keyed', apiKey: key }
  if (localStorage.getItem(MODE_STORAGE) === 'demo') return { mode: 'demo' }
  return { mode: 'anonymous' }
}

export function enterDemo(): Session {
  localStorage.removeItem(KEY_STORAGE)
  localStorage.setItem(MODE_STORAGE, 'demo')
  return { mode: 'demo' }
}

export function enterWithKey(apiKey: string): Session {
  localStorage.setItem(KEY_STORAGE, apiKey.trim())
  localStorage.setItem(MODE_STORAGE, 'keyed')
  return { mode: 'keyed', apiKey: apiKey.trim() }
}

export function logOut(): void {
  localStorage.removeItem(KEY_STORAGE)
  localStorage.removeItem(MODE_STORAGE)
}

/** The Authorization header for a session, or {} for the keyless demo. */
export function authHeaders(session: Session): Record<string, string> {
  return session.mode === 'keyed'
    ? { Authorization: `Bearer ${session.apiKey}` }
    : {}
}
