/// <reference types="vite/types/importMeta.d.ts" />
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./grid-layout.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { PostHogProvider } from "posthog-js/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <PostHogProvider
            apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
            options={{
                api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
                defaults: "2025-05-24",
                capture_exceptions: true,
                debug: false,
            }}
        >
            <Theme>
                <App />
                <Analytics />
                <SpeedInsights />
            </Theme>
        </PostHogProvider>
    </React.StrictMode>,
);
