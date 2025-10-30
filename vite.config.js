import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/JapaneseLyricsApp/",
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://justj.app.n8n.cloud", // only the domain
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // strips /api
      },
    },
  },
});
