import * as path from "node:path";
import { vi } from "vitest";

import { readFile } from "@diegofrayo-pkg/utilities/files";

import post from "~/data/blog/posts/sitios-para-visitar-en-el-quindio.json";
import AnalyticsService from "~/features/analytics";
import type { BlogPost, BlogPostWithContent } from "~/features/pages/blog/types";

export function getBlogPostData(slug: string): BlogPostWithContent {
	const compiledContent = readFile(path.join(__dirname, `../.fixtures/${slug}.json`));

	return {
		details: post.details as unknown as BlogPost,
		content: compiledContent,
	};
}

export function navigateTo(url: string) {
	window.history.pushState({}, "", url);
}

export function spyAnalyticsService() {
	return vi.spyOn(AnalyticsService, "trackEvent");
}

export function mockClipboardWriteText() {
	const writeTextSpy = vi.fn().mockResolvedValue(undefined);
	Object.defineProperty(navigator, "clipboard", {
		value: { writeText: writeTextSpy },
		configurable: true,
	});

	return writeTextSpy;
}
