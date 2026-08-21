import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import resumeData from "~/data/resume.json";
import AuthService from "~/features/auth";
import ResumePage, { type ResumePageProps } from "~/features/pages/resume";
import { Routes } from "~/features/routing";

import { renderWithRouter } from "../support/render-with-router";

describe("ResumePage", () => {
	it("shows the experience timeline in Stylish design and hides it in Minimalist design", async () => {
		renderResumePage();

		// step 1: switch to the Stylish design
		await userEvent.click(getDesignToggleButton("Stylish design"));

		// step 2: check the experience timeline is rendered
		assertExperienceTimelineIsVisible();

		// step 3: switch to the Minimalist design
		await userEvent.click(getDesignToggleButton("Minimalist design"));

		// step 4: check the experience timeline is not rendered
		assertExperienceTimelineIsHidden();
	});

	it("translates the resume content when the language toggle is switched", async () => {
		renderResumePage();

		// step 1: switch to the ES language
		await userEvent.click(getLangToggleButton("Spanish"));

		// step 2: check the resume box titles are shown in Spanish
		assertResumeBoxTitleIsVisible("Experiencia");

		// step 3: check the contact info label is shown in Spanish
		assertContactInfoLabelIsVisible(resumeData.es.contactInfo.label);

		// step 4: switch to the EN language
		await userEvent.click(getLangToggleButton("English"));

		// step 5: check the resume box titles are shown in English
		assertResumeBoxTitleIsVisible("Experience");

		// step 6: check the contact info label is shown in English
		assertContactInfoLabelIsVisible(resumeData.en.contactInfo.label);
	});

	it("changes the summary content when the content mode toggle is switched", async () => {
		mockUserLoggedIn();
		renderResumePage();

		// step 1: switch to the Short content mode
		await userEvent.click(getContentModeToggleButton("Short content"));

		// step 2: check the short summary is shown
		assertSummaryIsVisible(resumeData.en.summary.short);

		// step 3: switch to the Long content mode
		await userEvent.click(getContentModeToggleButton("Long content"));

		// step 4: check the full summary is shown
		assertSummaryIsVisible(resumeData.en.summary.full);
	});

	it("shows the protected actions when the user is logged in", () => {
		mockUserLoggedIn();
		renderResumePage();

		// step 1: check the content mode toggle is rendered
		assertContentModeToggleIsVisible();

		// step 2: check the download action button is rendered
		assertDownloadButtonIsVisible();
	});

	it("hides the protected actions when the user is logged out", () => {
		mockUserLoggedOut();
		renderResumePage();

		// step 1: check the content mode toggle is not rendered
		assertContentModeToggleIsHidden();

		// step 2: check the download action button is not rendered
		assertDownloadButtonIsHidden();
	});
});

// --- UTILS ---

function renderResumePage() {
	renderWithRouter(<ResumePage data={resumeData as unknown as ResumePageProps["data"]} />, {
		pathname: Routes.RESUME,
	});
}

function normalizeWhitespace(text: string) {
	return text.replace(/\s+/g, " ").trim();
}

function mockUserLoggedIn() {
	vi.spyOn(AuthService, "onSessionLoad").mockImplementation((callback) => {
		callback(true);
	});
}

function mockUserLoggedOut() {
	vi.spyOn(AuthService, "onSessionLoad").mockImplementation((callback) => {
		callback(false);
	});
}

// --- TEST 1 HELPERS ---

function getDesignToggleButton(name: "Minimalist design" | "Stylish design") {
	return screen.getByRole("button", { name });
}

function assertExperienceTimelineIsVisible() {
	expect(screen.getAllByRole("img", { name: "Company logo" }).length).toBeGreaterThan(0);
}

function assertExperienceTimelineIsHidden() {
	expect(screen.queryByRole("img", { name: "Company logo" })).not.toBeInTheDocument();
}

// --- TEST 2 HELPERS ---

function getLangToggleButton(name: "English" | "Spanish") {
	return screen.getByRole("button", { name });
}

function assertResumeBoxTitleIsVisible(title: string) {
	expect(screen.getByRole("heading", { level: 2, name: title })).toBeInTheDocument();
}

function assertContactInfoLabelIsVisible(label: string) {
	expect(screen.getByText(label)).toBeInTheDocument();
}

// --- TEST 3 HELPERS ---

function getContentModeToggleButton(name: "Short content" | "Long content") {
	return screen.getByRole("button", { name });
}

function assertSummaryIsVisible(summary: string) {
	expect(screen.getByText(normalizeWhitespace(summary))).toBeInTheDocument();
}

// --- TEST 4 HELPERS ---

function assertContentModeToggleIsVisible() {
	expect(getContentModeToggleButton("Short content")).toBeInTheDocument();
	expect(getContentModeToggleButton("Long content")).toBeInTheDocument();
}

function assertDownloadButtonIsVisible() {
	expect(screen.getByRole("button", { name: "Download" })).toBeInTheDocument();
}

// --- TEST 5 HELPERS ---

function assertContentModeToggleIsHidden() {
	expect(screen.queryByRole("button", { name: "Short content" })).not.toBeInTheDocument();
	expect(screen.queryByRole("button", { name: "Long content" })).not.toBeInTheDocument();
}

function assertDownloadButtonIsHidden() {
	expect(screen.queryByRole("button", { name: "Download" })).not.toBeInTheDocument();
}
