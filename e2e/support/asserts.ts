import { expect, type Page, type Response } from "@playwright/test";

export function expectPageIsNotEmpty(page: Page) {
	return expect(page.locator("#__next")).not.toBeEmpty();
}

export function expectSuccessfulStatus(response: Response | null) {
	return expect(response?.status()).toBe(200);
}

export function expectNoRenderErrors(errors: Array<string>) {
	return expect(errors).toEqual([]);
}

export function expectTextIsVisible(page: Page, text: string) {
	return expect(page.getByText(text)).toBeVisible();
}
