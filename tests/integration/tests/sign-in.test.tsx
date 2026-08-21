import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AuthService from "~/features/auth";
import SignInPage from "~/pages/sign-in";

import { renderWithRouter } from "../support/render-with-router";

const SIGN_IN_PATHNAME = "/sign-in";

describe("SignInPage", () => {
	it("shows a success message when the auth token is valid", async () => {
		// step 1: set up a valid auth token and a logged-out session, and mock the sign-in API call to succeed
		vi.useFakeTimers({ shouldAdvanceTime: true });
		setAuthTokenSearchParam("valid-token");
		mockUserLoggedOut();
		mockSignIn(() => Promise.resolve(true));

		// step 2: render the page
		renderSignInPage();

		// step 3: check the success message is shown
		await assertStatusMessageIsVisible("Sign in successfully, redirecting...");

		vi.useRealTimers();
	});

	it("shows an error message when the auth token is invalid", async () => {
		// step 1: set up an auth token and a logged-out session, and mock the sign-in API call to fail
		setAuthTokenSearchParam("invalid-token");
		mockUserLoggedOut();
		mockSignIn(() => Promise.reject(new Error("Invalid auth token!")));

		// step 2: render the page
		renderSignInPage();

		// step 3: check the error message is shown
		await assertStatusMessageIsVisible("Invalid auth token!");
	});

	it("shows an error message when the auth token is missing", async () => {
		// step 1: set up a logged-out session with no auth token
		setAuthTokenSearchParam(undefined);
		mockUserLoggedOut();
		const signIn = mockSignIn(() => Promise.resolve(true));

		// step 2: render the page
		renderSignInPage();

		// step 3: check the error message is shown and the sign-in API was never called
		await assertStatusMessageIsVisible("Invalid auth token!");
		expect(signIn).not.toHaveBeenCalled();
	});
});

// --- UTILS ---

function renderSignInPage() {
	renderWithRouter(<SignInPage />, { pathname: SIGN_IN_PATHNAME });
}

function setAuthTokenSearchParam(authToken: string | undefined) {
	const search = authToken ? `?auth_token=${authToken}` : "";
	window.history.pushState({}, "", `${SIGN_IN_PATHNAME}${search}`);
}

function mockUserLoggedOut() {
	vi.spyOn(AuthService, "onSessionLoad").mockImplementation((callback) => {
		callback(false);
	});
}

function mockSignIn(implementation: () => Promise<true>) {
	return vi.spyOn(AuthService, "signIn").mockImplementation(implementation);
}

async function assertStatusMessageIsVisible(message: string) {
	expect(await screen.findByText(message)).toBeInTheDocument();
}
