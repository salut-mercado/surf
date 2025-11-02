import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, type PluginOption } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const apiUrl = process.env.VITE_API_URL || "http://localhost:8000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Salut ERP",
        short_name: "Salut",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/vite.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/api\/auth\/.*/i,
            handler: "NetworkOnly",
          },
          // {
          //   urlPattern: /\/api\/.*/i,
          //   handler: "NetworkFirst",
          //   options: {
          //     cacheName: "api-cache",
          //     networkTimeoutSeconds: 10,
          //     cacheableResponse: {
          //       statuses: [0, 200],
          //     },
          //   },
          // },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|otf|eot)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "static-assets-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /\.(?:js|css|json)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "js-css-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          {
            urlPattern: /^https?:\/\/.*$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "navigation-cache",
              networkTimeoutSeconds: 3,
            },
          },
        ],
      },
    }) as PluginOption,
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: apiUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
