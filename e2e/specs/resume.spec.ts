import { test } from "@playwright/test";

import {
	expectNoRenderErrors,
	expectPageIsNotEmpty,
	expectSuccessfulStatus,
} from "../utils/asserts";
import { trackRenderErrors } from "../utils/render-errors";

test("renders the resume page without errors", async ({ page }) => {
	const errors = trackRenderErrors(page);
	const response = await page.goto("/resume");

	await expectPageIsNotEmpty(page);
	await expectSuccessfulStatus(response);
	await expectNoRenderErrors(errors);
});
