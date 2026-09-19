import { expect, type Page, type Response } from "@playwright/test";

export function expectPageIsNotEmpty(page: Page): Promise<void> {
	return expect(page.locator("body")).not.toBeEmpty();
}

export function expectSuccessfulStatus(response: Response | null): void {
	return expect(response?.status()).toBe(200);
}

export function expectNoRenderErrors(errors: Array<string>): void {
	return expect(errors).toEqual([]);
}

export function expectTextIsVisible(page: Page, text: string): Promise<void> {
	return expect(page.getByText(text)).toBeVisible();
}
