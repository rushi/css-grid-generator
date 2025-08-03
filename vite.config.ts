import { execSync } from "child_process";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const NODE_CONFIG_ENV = process.env.NODE_CONFIG_ENV ?? "development";

// Get git commit hash
const getGitHash = () => {
    try {
        return execSync("git rev-parse --short HEAD").toString().trim();
    } catch (error) {
        return "unknown";
    }
};

export default defineConfig({
    define: {
        __GIT_HASH__: JSON.stringify(getGitHash()),
    },
    server: {
        port: 5173,
        watch: {
            ignored: ["**/*.test.tsx", "**/*.test.ts"],
        },
        // sourcemapIgnoreList(sourcePath, sourcemapPath) {
        //     return sourcePath.includes("node_modules") || sourcePath.includes("src/services/Logger/");
        // },
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src/"),
            "@types": resolve(__dirname, "./types/"),
        },
    },
    build: {
        // While the app is built, don't minify or obscure anything so we can see stack traces on staging
        minify: false,
        sourcemap: false,
        // rollupOptions: {
        //     output: {
        //         hashCharacters: "hex",
        //         sourcemapIgnoreList(sourcePath, sourcemapPath) {
        //             return sourcePath.includes("node_modules") || sourcePath.includes("src/services/Logger/");
        //         },
        //     },
        // },
    },
    publicDir: "public",
    plugins: [tailwindcss(), tsconfigPaths()],
});
