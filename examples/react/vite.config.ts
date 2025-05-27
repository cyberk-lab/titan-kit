import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  server: {
    // host: '3ac5-36-229-52-247.ngrok-free.app',
    // allowedHosts: ['sixty-hats-follow.loca.lt'],
    host: "0.0.0.0",
    port: 5173,
    hmr: true,
  },
  resolve: {
    alias: {
      "node-fetch": "node-fetch/lib/index.js",
      stream: "stream-browserify",
      crypto: "crypto-browserify",
      buffer: "buffer",
    },
  },
});
