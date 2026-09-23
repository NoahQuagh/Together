import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "assets/dist",
        rollupOptions: {
            input: "src/login-entry.jsx",
            output: {
                entryFileNames: "login-avatar.js",
                assetFileNames: "login-avatar.[ext]",
            },
        },
    },
});