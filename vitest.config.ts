import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/** Resolve the "@/" alias the same way tsconfig + Next do, for the test run. */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
