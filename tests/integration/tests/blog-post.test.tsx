import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { Mock } from "vitest";

import post from "~/data/blog/posts/sitios-para-visitar-en-el-quindio.json";
import BlogPostPage from "~/features/pages/blog/pages/[slug]/[slug].page";
import { Routes } from "~/features/routing";

import { renderWithRouter } from "../support/render-with-router";
import {
	getBlogPostData,
	mockClipboardWriteText,
	navigateTo,
	spyAnalyticsService,
} from "../support/test-utils";

describe("BlogPostPage", () => {
	const SLUG = "sitios-para-visitar-en-el-quindio";

	it("1. renders a mailto link to send a comment about the post and tracks a click on it", async () => {
		navigateTo(`/blog/${SLUG}`);

		renderWithRouter(<BlogPostPage data={getBlogPostData(SLUG)} />, {
			pathname: `${Routes.BLOG}/${SLUG}`,
		});

		const trackEventSpy = spyAnalyticsService();
		const $link = getSendCommentLink();

		// step 1: check that the href value is right
		assertMailtoHref($link);

		// step 2: click the link and check the analytics event is tracked
		await clickLinkAndAssertAnalyticsEvent($link, trackEventSpy);
	});

	it("2. copies the current URL to the clipboard, tracks a click and shows a 'copied!' popover", async () => {
		navigateTo(`/blog/${SLUG}`);

		renderWithRouter(<BlogPostPage data={getBlogPostData(SLUG)} />, {
			pathname: `${Routes.BLOG}/${SLUG}`,
		});

		const trackEventSpy = spyAnalyticsService();
		const writeTextSpy = mockClipboardWriteText();
		const $button = getCopyUrlButton();

		// step 1: click the button and check the URL is copied to the clipboard and the analytics event is tracked
		await clickButtonAndAssertClipboardWrite($button, writeTextSpy);
		assertCopyUrlAnalyticsEvent(trackEventSpy);

		// step 2: check the "copied!" popover is shown
		await assertCopiedPopoverIsShown();
	});
});

// --- TEST 1 HELPERS ---

function getSendCommentLink() {
	return screen.getByRole("link", { name: "Send a comment via e-mail" });
}

function assertMailtoHref($link: Element) {
	const EXPECTED_HREF_VALUE =
		"mailto:diegofrayo@gmail.com?subject=Blog%20post%20comment&body=Hi%2C%20I%20have%20a%20comment%20about%20this%20blog%20post%3A%20https%3A%2F%2Fwebsite.local%2Fblog%2Fsitios-para-visitar-en-el-quindio";

	expect($link).toHaveAttribute("href", EXPECTED_HREF_VALUE);
}

async function clickLinkAndAssertAnalyticsEvent($link: Element, trackEventSpy: Mock) {
	await userEvent.click($link);
	expect(trackEventSpy).toHaveBeenCalledWith("BLOG|SEND_EMAIL", { post: post.details.title });
}

// --- TEST 2 HELPERS ---

function getCopyUrlButton() {
	return screen
		.getAllByRole("button", { name: "Copy URL" })
		.find((element) => element.tagName === "BUTTON") as HTMLElement;
}

async function clickButtonAndAssertClipboardWrite($button: HTMLElement, writeTextSpy: Mock) {
	await userEvent.click($button);
	expect(writeTextSpy).toHaveBeenCalledWith(window.location.href);
}

function assertCopyUrlAnalyticsEvent(trackEventSpy: Mock) {
	expect(trackEventSpy).toHaveBeenCalledWith("BLOG|COPY_URL", { post: post.details.title });
}

async function assertCopiedPopoverIsShown() {
	expect(await screen.findByText("copied!")).toBeInTheDocument();
}
