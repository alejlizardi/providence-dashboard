/**
 * Data access for the dashboard.
 *
 * Source of truth is the live periapsis API (the hosted providence service),
 * not the static JSON that used to ship under public/data/. The API serves the
 * SAME engine shapes the views already consume — a pack's results.json verbatim
 * (inside a versioned envelope), and index/drift rows field-for-field — so
 * nothing downstream of `SiteData` changes; only where the numbers come from.
 *
 * Config (Vite env, with live defaults so it runs with no .env):
 *   VITE_API_BASE — API origin (default: the deployed Render service)
 *   VITE_ORG_ID   — the tenant whose evidence to show, sent as X-Org-Id
 *                   (dev-stub auth for now; becomes a real session/key later)
 */
import { useEffect, useState } from 'react'
import type { DriftPair, IndexEntry, Pack } from './types'

const API_BASE = (
  import.meta.env.VITE_API_BASE ?? 'https://periapsis-platform.onrender.com'
).replace(/\/$/, '')
const ORG_ID =
  import.meta.env.VITE_ORG_ID ?? '9d9a129f-e476-40c9-b9ba-6d95276dacdb'

const PROVIDENCE = `${API_BASE}/api/v1/providence`

// --- wire types (mirror the backend's response_models) -----------------------

/** A page from a list endpoint: items + an opaque next_cursor (null = last). */
interface Page<T> {
  items: T[]
  next_cursor: string | null
}

/** /models row. */
interface ModelSummary {
  id: string
  name: string
  owner?: string | null
}

/**
 * /models/{id}/packs row. `id` is the human series label (pack_ref, "1.0.0")
 * the views key on; `pack_id` is the real UUID used to fetch the pack and to
 * compute drift. This is exactly IndexEntry plus the fetch id.
 */
interface PackIndexEntry extends IndexEntry {
  pack_id: string
}

/** /packs/{id}: the engine results.json served verbatim inside an envelope. */
interface PackEnvelope {
  schema_version: string
  pack_id: string
  results: Pack
}

/** /packs/{id}/drift?baseline=… */
interface DriftResponse {
  baseline_id: string
  current_id: string
  comparable: boolean
  rows: DriftPair['rows']
}

// --- fetch helpers -----------------------------------------------------------

async function getJSON<T>(url: string): Promise<T> {
  const r = await fetch(url, { headers: { 'X-Org-Id': ORG_ID } })
  if (!r.ok) {
    // Surface the API's structured error message when there is one.
    let detail = `HTTP ${r.status}`
    try {
      const body = await r.json()
      if (body?.error?.message) detail = `${detail}: ${body.error.message}`
    } catch {
      /* non-JSON error body — keep the status */
    }
    throw new Error(`${url} — ${detail}`)
  }
  return r.json() as Promise<T>
}

/** Drain a cursor-paginated list endpoint into a flat array.
 *
 * A non-null next_cursor must always advance. The server's keyset scheme
 * guarantees that, but we add two cheap backstops so a server bug can't hang
 * the UI: stop if a cursor repeats, and cap the page count outright. */
async function getAllPages<T>(path: string): Promise<T[]> {
  const out: T[] = []
  let cursor: string | null = null
  let prevCursor: string | null = null
  for (let page = 0; page < 1000; page++) {
    const url = cursor
      ? `${PROVIDENCE}${path}?cursor=${encodeURIComponent(cursor)}`
      : `${PROVIDENCE}${path}`
    const body: Page<T> = await getJSON<Page<T>>(url)
    out.push(...body.items)
    if (!body.next_cursor || body.next_cursor === prevCursor) break
    prevCursor = cursor
    cursor = body.next_cursor
  }
  return out
}

// --- the dashboard's data model ----------------------------------------------

export interface SiteData {
  index: IndexEntry[]
  packs: Record<string, Pack>
  drift: DriftPair[]
}

export type LoadState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'ready'; data: SiteData }

/**
 * Build the dashboard's SiteData from the live API.
 *
 * For the showcase there is one model; we render its full validation history.
 * (Multi-model selection is a later view — the API already paginates models.)
 */
async function loadSiteData(): Promise<SiteData> {
  const models = await getAllPages<ModelSummary>('/models')
  if (models.length === 0) {
    throw new Error('No models found for this org yet.')
  }
  const model = models[0]

  // History, oldest first — the drift series. Each entry carries both the
  // series label (id) and the UUID (pack_id) we fetch the full pack with.
  const entries = await getAllPages<PackIndexEntry>(
    `/models/${model.id}/packs`,
  )

  // The full pack for every version, keyed by the SAME id the index uses
  // (pack_ref), so App.tsx's `packs[entry.id]` lookups line up.
  const packEnvelopes = await Promise.all(
    entries.map((e) =>
      getJSON<PackEnvelope>(`${PROVIDENCE}/packs/${e.pack_id}`),
    ),
  )
  const packs: Record<string, Pack> = {}
  entries.forEach((e, i) => (packs[e.id] = packEnvelopes[i].results))

  // Drift across consecutive versions (the engine computes it pairwise on
  // demand; the static export precomputed it). One call per adjacent pair.
  const drift = await buildDriftSeries(entries)

  const index: IndexEntry[] = entries.map((e) => ({
    id: e.id,
    model_name: e.model_name,
    version: e.version,
    generated_at: e.generated_at,
    suites_passed: e.suites_passed,
    total_suites: e.total_suites,
    headline_verdict: e.headline_verdict,
  }))

  return { index, packs, drift }
}

/** One DriftPair per adjacent (older -> newer) version in the history. */
async function buildDriftSeries(
  entries: PackIndexEntry[],
): Promise<DriftPair[]> {
  const pairs = await Promise.all(
    entries.slice(1).map(async (cur, i) => {
      const prev = entries[i] // entries[i] is the one before cur
      const resp = await getJSON<DriftResponse>(
        `${PROVIDENCE}/packs/${cur.pack_id}/drift?baseline=${prev.pack_id}`,
      )
      const pair: DriftPair = {
        from_id: prev.id,
        to_id: cur.id,
        from_version: prev.version,
        to_version: cur.version,
        rows: resp.rows,
      }
      return pair
    }),
  )
  return pairs
}

export function useSiteData(): LoadState {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let alive = true
    loadSiteData()
      .then((data) => alive && setState({ status: 'ready', data }))
      .catch((e) => alive && setState({ status: 'error', error: String(e) }))
    return () => {
      alive = false
    }
  }, [])

  return state
}
