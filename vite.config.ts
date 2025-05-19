import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

const isLocal = process.env.NODE_ENV !== "production";

export default defineConfig({
  plugins: [tailwindcss(), vue()],
  server: isLocal
    ? {
        https: {
          key: fs.readFileSync(path.resolve(__dirname, "key.pem")),
          cert: fs.readFileSync(path.resolve(__dirname, "cert.crt")),
        },
        port: 5173,
      }
    : {
        port: 5173,
      },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
