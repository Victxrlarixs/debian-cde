/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
