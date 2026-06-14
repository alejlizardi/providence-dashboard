/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API origin. Defaults to the deployed Render service when unset. */
  readonly VITE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
