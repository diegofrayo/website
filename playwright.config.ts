import { defineConfig, devices } from "@playwright/test";

try {
	process.loadEnvFile(".env");
} catch {
	// No local .env file; environment variables are expected to be provided externally (e.g. CI).
}

const PORT = 4300;
const baseURL = `http://localhost:${PORT}`;
const isCIEnvironment = !!process.env["CI"];

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: isCIEnvironment,
	retries: isCIEnvironment ? 2 : 0,
	reporter: "html",

	use: {
		baseURL,
		trace: "on-first-retry",
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],

	webServer: {
		command: `next dev --port ${PORT}`,
		url: baseURL,
		reuseExistingServer: !isCIEnvironment,
		timeout: 60_000,
	},
});
