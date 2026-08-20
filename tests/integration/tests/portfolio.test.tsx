import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { PROFESSIONAL_PROJECTS, SIDE_PROJECTS } from "~/features/pages/portfolio/portfolio.constants";
import PortfolioPage from "~/features/pages/portfolio/portfolio.page";
import { Routes } from "~/features/routing";

import { renderWithRouter } from "../support/render-with-router";

describe("PortfolioPage", () => {
	it("opens a project modal on thumbnail click and closes it on close button click", async () => {
		const project = PROFESSIONAL_PROJECTS[0] as (typeof PROFESSIONAL_PROJECTS)[number];

		renderWithRouter(<PortfolioPage />, { pathname: Routes.PORTFOLIO });

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

		const thumbnailButton = screen.getByRole("button", { name: project.title });

		await userEvent.click(thumbnailButton);

		const dialog = screen.getByRole("dialog");
		expect(dialog).toBeInTheDocument();
		expect(within(dialog).getByText(project.title)).toBeInTheDocument();
		expect(
			within(dialog).getByRole("img", { name: `${project.title} project thumbnail` }),
		).toBeInTheDocument();

		const closeButton = within(dialog).getByRole("button", { name: "" });

		await userEvent.click(closeButton);

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: project.title })).toBeInTheDocument();
	});

	it("switches between professional and side projects lists", async () => {
		const professionalProject = PROFESSIONAL_PROJECTS[0] as (typeof PROFESSIONAL_PROJECTS)[number];
		const sideProject = SIDE_PROJECTS[0] as (typeof SIDE_PROJECTS)[number];

		renderWithRouter(<PortfolioPage />, { pathname: Routes.PORTFOLIO });

		expect(screen.getByRole("button", { name: professionalProject.title })).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: sideProject.title })).not.toBeInTheDocument();

		await userEvent.click(screen.getByRole("button", { name: "Side projects" }));

		expect(screen.getByRole("button", { name: sideProject.title })).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: professionalProject.title }),
		).not.toBeInTheDocument();

		await userEvent.click(screen.getByRole("button", { name: "Professional projects" }));

		expect(screen.getByRole("button", { name: professionalProject.title })).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: sideProject.title })).not.toBeInTheDocument();
	});
});
