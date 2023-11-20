import * as React from "react";

import { MainLayout, Page } from "~/components/layout";
import { Button, Input, Space } from "~/components/primitive";
import { Toast } from "~/components/shared";
import { useAsync } from "~/hooks";
import ServerAPI from "~/modules/api";
import { AuthService, withAuthRulesPage } from "~/modules/auth";
import { ROUTES, redirect } from "~/modules/routing";
import { SignInForm, type T_SignInForm } from "~/server/api/endpoints/sign-in/schemas";
import type DR from "@diegofrayo/types";
import { getErrorMessage } from "@diegofrayo/utils/misc";

function SignInPage() {
	// --- HOOKS ---
	const { asyncFn: signInMutation, isLoading } = useAsync("/sign-in", SignInAPI.signIn, {
		autoLaunch: false,
		withDelay: true,
	});

	// --- HANDLERS ---
	async function onSubmitHandler(event: DR.React.Events.OnSubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		const formDataEntries = new FormData(event.currentTarget).entries();
		const body = Object.fromEntries(formDataEntries) as T_SignInForm;

		try {
			await signInMutation("/sign-in", body);
			AuthService.createSession();
			redirect(ROUTES.HOME);
		} catch (error) {
			Toast.error(getErrorMessage(error));
		}
	}

	return (
		<Page
			config={{
				title: "Sign in",
				disableSEO: true,
			}}
		>
			<MainLayout title="Sign in">
				<Form onSubmit={onSubmitHandler}>
					<Input
						variant={Input.variant.STYLED}
						id="input-email"
						name="email"
						type="email"
						componentProps={{ label: "Email" }}
						{...SignInForm.inputsConfig.email}
						disabled={isLoading}
						required
					/>
					<Space size={1} />
					<Input
						variant={Input.variant.STYLED}
						id="input-password"
						name="password"
						type="password"
						componentProps={{ label: "Password" }}
						{...SignInForm.inputsConfig.password}
						disabled={isLoading}
						required
					/>
					<Space size={2} />
					<Button
						variant={Button.variant.STYLED}
						type="submit"
						className="tw-block tw-w-full"
						disabled={isLoading}
					>
						{isLoading ? "Loading..." : "Sign in"}
					</Button>
				</Form>
			</MainLayout>
		</Page>
	);
}

export default withAuthRulesPage(SignInPage, { requireNoAuth: true });

// --- COMPONENTS ---

function Form({ children, onSubmit }: DR.DOM.HTMLElementAttributes["form"]) {
	return (
		<form
			className="tw-mx-auto tw-w-96 tw-max-w-full"
			onSubmit={onSubmit}
		>
			{children}
		</form>
	);
}

// --- API ---

const SignInAPI = {
	signIn: (path: string, body: T_SignInForm) => {
		return ServerAPI.post(path, body);
	},
};
