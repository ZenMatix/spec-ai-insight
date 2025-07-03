
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  // add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
