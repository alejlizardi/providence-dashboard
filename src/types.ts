/**
 * TypeScript mirror of evidentry's results.json (see schema/results.schema.json
 * in the backend repo). Kept deliberately close to the schema; the export
 * pipeline guarantees this shape.
 */
import type { Verdict } from './theme'

export interface IndexEntry {
  id: string
  model_name: string
  version: string
  generated_at: string
  suites_passed: number
  total_suites: number
  headline_verdict: Verdict
}

export interface ModelCard {
  name: string
  version: string
  vendor?: string
  use_case?: string
  owner?: string
  materiality_tier?: number
  tier_rationale?: string
  limitations?: string[]
}

export interface SampleSizeCertificate {
  status: 'ok' | 'already_settled' | 'unreachable'
  target_verdict: 'PASS' | 'FAIL'
  planning_rate: number
  requested_power: number
  n_current: number
  n_required?: number
  additional_items?: number
  achieved_power?: number
  note?: string
}

export interface RunRow {
  run: number
  output: string
  passed: boolean
  detail: string
}

export interface ItemRow {
  id: string
  input: string
  expected?: unknown
  passed: boolean
  runs: RunRow[]
}

export interface Suite {
  suite: string
  description?: string
  metric: string
  metric_options?: Record<string, unknown>
  runs_per_item: number
  requirement_ids?: string[]
  dataset: string
  dataset_sha256: string
  n_items: number
  n_passed: number
  pass_rate: number
  threshold: number
  verdict: Verdict
  ci95_low: number
  ci95_high: number
  ci_method: string
  sample_size_certificate?: SampleSizeCertificate
  items: ItemRow[]
  // judge_evidence intentionally omitted until the V4 stretch view.
}

export interface Pack {
  config_sha256: string
  model: ModelCard
  provider: { type: string; model_id?: string }
  statistics: { intervals: string; drift_test: string }
  suites: Suite[]
  summary: {
    total_suites: number
    suites_passed: number
    total_items: number
    total_passed: number
  }
}

export interface DriftRow {
  suite: string
  rate_a: number
  rate_b: number
  p_value: number | null
  p_holm: number | null
  significant: boolean
  comparable: boolean
  reason?: string
  method?: string
}

export interface DriftPair {
  from_id: string
  to_id: string
  from_version: string
  to_version: string
  rows: DriftRow[]
}
