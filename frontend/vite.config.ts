import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(async () => {
  // Dynamically load the Tailwind CSS plugin to avoid ESM conflicts
  const tailwindcss = await import("@tailwindcss/vite");

  return {
    plugins: [react(), tailwindcss.default()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@contexts": path.resolve(__dirname, "./src/contexts"),
        "@lib": path.resolve(__dirname, "./src/lib"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@config": path.resolve(__dirname, "./src/config"),
      },
    },
    server: {
      port: 9000,
      host: true,
      allowedHosts: [
        "vue--agent-virtual-office--k1dave6412.coder.k1dav.fun",
        "vue--full-template--k1dave6412.coder.k1dav.fun",
        "localhost",
        "127.0.0.1",
        "0.0.0.0",
      ],
    },
    build: {
      outDir: "dist",
    },
  };
});
