import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages project sites are served from /<repo>/, while local dev stays at /.
  base: command === "build" ? "/interactive-solar-system/" : "/",
}));
