import * as path from "node:path";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { readFile } from "@diegofrayo-pkg/utilities/files";

import AnalyticsService from "~/features/analytics";
import BlogPostPage from "~/features/pages/blog/pages/[slug]/[slug].page";
import type { BlogPost, BlogPostWithContent } from "~/features/pages/blog/types";
import { Routes } from "~/features/routing";

import post from "../../src/data/blog/posts/sitios-para-visitar-en-el-quindio.json";
import { renderWithRouter } from "../support/render-with-router";

describe("BlogPostPage", () => {
	const SLUG = "sitios-para-visitar-en-el-quindio";

	it("renders a mailto link to send a comment about the post and tracks a click on it", async () => {
		window.history.pushState({}, "", `/blog/${SLUG}`);

		const trackEventSpy = vi.spyOn(AnalyticsService, "trackEvent");

		renderWithRouter(<BlogPostPage data={getBlogPostData(SLUG)} />, {
			pathname: `${Routes.BLOG}/${SLUG}`,
		});

		const link = screen.getByRole("link", { name: "Send a comment via e-mail" });

		expect(link).toHaveAttribute(
			"href",
			"mailto:diegofrayo@gmail.com?subject=Blog%20post%20comment&body=Hi%2C%20I%20have%20a%20comment%20about%20this%20blog%20post%3A%20https%3A%2F%2Fwebsite.local%2Fblog%2Fsitios-para-visitar-en-el-quindio",
		);

		await userEvent.click(link);

		expect(trackEventSpy).toHaveBeenCalledWith("BLOG|SEND_EMAIL", { post: post.details.title });
	});
});

// --- UTILS ---

function getBlogPostData(slug: string): BlogPostWithContent {
	const compiledContent = readFile(path.join(__dirname, `../.fixtures/${slug}.json`));

	return {
		details: post.details as unknown as BlogPost,
		content: compiledContent,
	};
}
