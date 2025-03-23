/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_TOKEN: string;
  readonly VITE_GITHUB_USERNAME: string;
  readonly VITE_GITHUB_REPO: string;
  readonly VITE_GITHUB_BRANCH: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 