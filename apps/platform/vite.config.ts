import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const apiProxyTarget = process.env.API_PROXY_TARGET ?? "http://localhost:8000";

const config = defineConfig({
  server: {
    proxy: {
      "/api": apiProxyTarget,
    },
  },
  preview: {
    proxy: {
      "/api": apiProxyTarget,
    },
    allowedHosts: ["itinera.trufalworks.com"],
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": path.resolve(rootDir, "./src"),
      "#": path.resolve(rootDir, "./src"),
    },
  },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    viteReact(),
  ],
});

export default config;
