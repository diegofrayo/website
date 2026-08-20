/// <reference types="vitest/config" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

try {
	process.loadEnvFile(".env");
} catch {
	// No local .env file; environment variables are expected to be provided externally (e.g. CI).
}

export default defineConfig({
	plugins: [react()],
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		name: "integration",
		environment: "jsdom",
		environmentOptions: {
			jsdom: {
				url: process.env["NEXT_PUBLIC_WEBSITE_URL_DEV"] || "",
			},
		},
		globals: false,
		globalSetup: ["./tests/integration/global-setup.ts"],
		setupFiles: ["./tests/integration/setup.ts"],
		include: ["./tests/integration/tests/**/*.test.tsx"],
	},
});
