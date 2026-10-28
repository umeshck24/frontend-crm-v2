/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_CODEGEN_URL: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
