/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API origin. Defaults to the deployed Render service when unset. */
  readonly VITE_API_BASE?: string
  /** Tenant id, sent as X-Org-Id (dev-stub auth). Defaults to the demo org. */
  readonly VITE_ORG_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
