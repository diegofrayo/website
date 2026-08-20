import { test } from "@playwright/test";

import {
	expectNoRenderErrors,
	expectSuccessfulStatus,
	expectTextIsVisible,
} from "../utils/asserts";
import { trackRenderErrors } from "../utils/render-errors";

const AUTH_TOKEN = process.env["AUTH_TOKEN"];

if (!AUTH_TOKEN) {
	throw new Error('Missing "AUTH_TOKEN" environment variable, required by e2e/sign-in.spec.ts');
}

test("redirects to home when the auth_token is valid", async ({ page }) => {
	const errors = trackRenderErrors(page);
	const response = await page.goto(`/sign-in?auth_token=${AUTH_TOKEN}`);

	await expectSuccessfulStatus(response);
	await expectTextIsVisible(page, "Sign in successfully, redirecting...");
	await page.waitForURL("/");
	await expectNoRenderErrors(errors);
});

/**
 * NOTE:
 * This case intentionally provokes a 401 from the sign-in API, which Chrome
 logs as a "Failed to load resource" console error — that's the outcome under test, not a rendering bug, so render errors aren't asserted here.
*/
test("shows an error message when the auth_token is invalid", async ({ page }) => {
	const response = await page.goto("/sign-in?auth_token=invalid-token");

	await expectSuccessfulStatus(response);
	await expectTextIsVisible(page, "Invalid auth token!");
});

test("redirects to home when the user already has a session", async ({ page }) => {
	await page.goto(`/sign-in?auth_token=${AUTH_TOKEN}`);
	await page.waitForURL("/");

	const errors = trackRenderErrors(page);
	const response = await page.goto("/sign-in");

	await expectSuccessfulStatus(response);
	await page.waitForURL("/");
	await expectNoRenderErrors(errors);
});
