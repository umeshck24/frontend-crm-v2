// Plain object (no imports): the generator runs via `pnpm dlx` and can't be resolved from here.
// Types only: requests go through the small `src/api/http.ts` helper. One output folder per backend
// (service-offer gets `src/api/offer` later). Never edit the output by hand.
/** @type {import("@hey-api/openapi-ts").UserConfig} */
export default {
  input: process.env.VITE_API_SCHEMA_URL,
  output: "src/api/crm",
  plugins: ["@hey-api/typescript"],
};
