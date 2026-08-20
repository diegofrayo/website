import * as path from "node:path";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { readFile } from "@diegofrayo-pkg/utilities/files";

import post from "~/data/blog/posts/sitios-para-visitar-en-el-quindio.json";
import AnalyticsService from "~/features/analytics";
import BlogPostPage from "~/features/pages/blog/pages/[slug]/[slug].page";
import type { BlogPost, BlogPostWithContent } from "~/features/pages/blog/types";
import { Routes } from "~/features/routing";

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

	it("copies the current URL to the clipboard, tracks a click and shows a 'copied!' popover", async () => {
		window.history.pushState({}, "", `/blog/${SLUG}`);

		const trackEventSpy = vi.spyOn(AnalyticsService, "trackEvent");
		const writeTextSpy = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, "clipboard", {
			value: { writeText: writeTextSpy },
			configurable: true,
		});

		renderWithRouter(<BlogPostPage data={getBlogPostData(SLUG)} />, {
			pathname: `${Routes.BLOG}/${SLUG}`,
		});

		const button = screen
			.getAllByRole("button", { name: "Copy URL" })
			.find((element) => element.tagName === "BUTTON") as HTMLElement;

		await userEvent.click(button);

		expect(writeTextSpy).toHaveBeenCalledWith(window.location.href);
		expect(trackEventSpy).toHaveBeenCalledWith("BLOG|COPY_URL", { post: post.details.title });
		expect(await screen.findByText("copied!")).toBeInTheDocument();
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
