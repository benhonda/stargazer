/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GITHUB_PAT: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}