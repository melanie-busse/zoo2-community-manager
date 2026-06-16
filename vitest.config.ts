import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path"; // <-- Wichtig: Pfad-Modul importieren

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Das sorgt dafür, dass '@' hart auf deinen 'src'-Ordner gemappt wird
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
  },
});
