/** Data access for the static exported JSON under public/data/. */
import { useEffect, useState } from 'react'
import type { DriftPair, IndexEntry, Pack } from './types'

const DATA = import.meta.env.BASE_URL + 'data/'

async function getJSON<T>(path: string): Promise<T> {
  const r = await fetch(DATA + path)
  if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`)
  return r.json() as Promise<T>
}

export interface SiteData {
  index: IndexEntry[]
  packs: Record<string, Pack>
  drift: DriftPair[]
}

export type LoadState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'ready'; data: SiteData }

export function useSiteData(): LoadState {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const index = await getJSON<IndexEntry[]>('index.json')
        const drift = await getJSON<DriftPair[]>('drift.json')
        const packList = await Promise.all(
          index.map((e) => getJSON<Pack>(`packs/${e.id}.json`)),
        )
        const packs: Record<string, Pack> = {}
        index.forEach((e, i) => (packs[e.id] = packList[i]))
        if (alive) setState({ status: 'ready', data: { index, packs, drift } })
      } catch (e) {
        if (alive) setState({ status: 'error', error: String(e) })
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  return state
}
