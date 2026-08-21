import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
	PROFESSIONAL_PROJECTS,
	SIDE_PROJECTS,
	type Project,
} from "~/features/pages/portfolio/portfolio.constants";
import PortfolioPage from "~/features/pages/portfolio/portfolio.page";
import { Routes } from "~/features/routing";

import { renderWithRouter } from "../support/render-with-router";

describe("PortfolioPage", () => {
	it("opens a project modal on thumbnail click and closes it on close button click", async () => {
		const project = PROFESSIONAL_PROJECTS[0] as Project;

		renderPortfolioPage();

		// step 1: check that no project modal is open
		assertNoProjectModalIsOpen();

		// step 2: click the project thumbnail to open its modal
		const thumbnailButton = getProjectThumbnailButton(project.title);
		await userEvent.click(thumbnailButton);

		// step 3: check the modal shows the project details
		const dialog = getProjectModal();
		assertProjectModalShowsProject(dialog, project);

		// step 4: click the close button and check the modal is closed and the thumbnail is visible again
		const closeButton = getProjectModalCloseButton(dialog);
		await userEvent.click(closeButton);
		assertNoProjectModalIsOpen();
		assertProjectThumbnailIsVisible(project.title);
	});

	it("switches between professional and side projects lists", async () => {
		const professionalProject = PROFESSIONAL_PROJECTS[0] as Project;
		const sideProject = SIDE_PROJECTS[0] as Project;

		renderPortfolioPage();

		// step 1: check that only professional projects are shown
		assertProjectThumbnailIsVisible(professionalProject.title);
		assertProjectThumbnailIsHidden(sideProject.title);

		// step 2: switch to side projects and check only side projects are shown
		await userEvent.click(getProjectsTabButton("Side projects"));
		assertProjectThumbnailIsVisible(sideProject.title);
		assertProjectThumbnailIsHidden(professionalProject.title);

		// step 3: switch back to professional projects and check only professional projects are shown
		await userEvent.click(getProjectsTabButton("Professional projects"));
		assertProjectThumbnailIsVisible(professionalProject.title);
		assertProjectThumbnailIsHidden(sideProject.title);
	});
});

// --- TEST 1 HELPERS ---

function renderPortfolioPage() {
	renderWithRouter(<PortfolioPage />, { pathname: Routes.PORTFOLIO });
}

function assertNoProjectModalIsOpen() {
	expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
}

function getProjectThumbnailButton(title: string) {
	return screen.getByRole("button", { name: title });
}

function getProjectModal() {
	return screen.getByRole("dialog");
}

function assertProjectModalShowsProject(dialog: HTMLElement, project: Project) {
	expect(dialog).toBeInTheDocument();
	expect(within(dialog).getByText(project.title)).toBeInTheDocument();
	expect(
		within(dialog).getByRole("img", { name: `${project.title} project thumbnail` }),
	).toBeInTheDocument();
}

function getProjectModalCloseButton(dialog: HTMLElement) {
	return within(dialog).getByRole("button", { name: "" });
}

// --- TEST 2 HELPERS ---

function assertProjectThumbnailIsVisible(title: string) {
	expect(screen.getByRole("button", { name: title })).toBeInTheDocument();
}

function assertProjectThumbnailIsHidden(title: string) {
	expect(screen.queryByRole("button", { name: title })).not.toBeInTheDocument();
}

function getProjectsTabButton(name: "Professional projects" | "Side projects") {
	return screen.getByRole("button", { name });
}
