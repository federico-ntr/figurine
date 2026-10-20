import { defineConfig } from "vite";

export default defineConfig({
  // Vite 8 uses Oxc for TypeScript/JSX transforms and Rolldown for bundling.
  oxc: {
    jsx: { runtime: "automatic" },
  },
  build: {
    minify: "oxc",
  },
});
