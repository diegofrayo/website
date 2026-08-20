import { test } from "@playwright/test";

import posts from "../src/data/blog/posts.json";
import {
	expectNoRenderErrors,
	expectPageIsNotEmpty,
	expectSuccessfulStatus,
} from "./support/asserts";
import { trackRenderErrors } from "./support/render-errors";

for (const post of Object.values(posts)) {
	test(`renders the blog post "${post.slug}" without errors`, async ({ page }) => {
		const errors = trackRenderErrors(page);
		const response = await page.goto(`/blog/${post.slug}`);

		await expectPageIsNotEmpty(page);
		await expectSuccessfulStatus(response);
		await expectNoRenderErrors(errors);
	});
}
