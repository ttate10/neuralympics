import { defineConfig } from "vite";
import { resolve } from "path";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/neuralympics/",
    plugins: [svelte()],
    build: {
        chunkSizeWarningLimit: 5000,
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
});
