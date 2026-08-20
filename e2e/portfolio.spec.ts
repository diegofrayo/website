import { test } from "@playwright/test";

import {
	expectNoRenderErrors,
	expectPageIsNotEmpty,
	expectSuccessfulStatus,
} from "./support/asserts";
import { trackRenderErrors } from "./support/render-errors";

test("renders the portfolio page without errors", async ({ page }) => {
	const errors = trackRenderErrors(page);
	const response = await page.goto("/portfolio");

	await expectPageIsNotEmpty(page);
	await expectSuccessfulStatus(response);
	await expectNoRenderErrors(errors);
});
