import * as React from "react";

import { MainLayout, Page } from "~/components/layout";
import { Button, Input, Space } from "~/components/primitive";
import { Toast } from "~/components/shared";
import { useAsync } from "~/hooks";
import ServerAPI from "~/modules/api";
import { AuthService, withAuthRulesPage } from "~/modules/auth";
import { ROUTES, redirect } from "~/modules/routing";
import { SignInForm, T_SignInFormSchema } from "~/server/api/endpoints/sign-in/schemas";
import { getErrorMessage } from "@diegofrayo/utils/misc";
import type DR from "@diegofrayo/types";

function SignInPage() {
	// --- HOOKS ---
	const { mutation: signInMutation, isLoading } = useAsync("/sign-in", SignInAPI.signIn);

	// --- HANDLERS ---
	async function onSubmitHandler(event: DR.React.Events.OnSubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		const formDataEntries = new FormData(event.currentTarget).entries();
		const body = Object.fromEntries(formDataEntries) as T_SignInFormSchema;

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
			<MainLayout>
				<Form onSubmit={onSubmitHandler}>
					<Input
						variant={Input.variant.STYLED}
						id="input-email"
						name="email"
						type="email"
						componentProps={{ label: "Email" }}
						{...SignInForm.emailConstraints}
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
						{...SignInForm.passwordConstraints}
						disabled={isLoading}
						required
					/>
					<Space size={2} />
					<Button
						variant={Button.variant.SIMPLE}
						type="submit"
						className="tw-block tw-w-full tw-rounded-md tw-p-2 tw-text-center tw-font-bold tw-uppercase dr-text-color-surface-100 dr-bg-color-surface-600"
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
			className="tw-mx-auto tw-w-64 tw-max-w-full"
			onSubmit={onSubmit}
		>
			{children}
		</form>
	);
}

// --- API ---

const SignInAPI = {
	signIn: (path: string, body: T_SignInFormSchema) => {
		return ServerAPI.post(path, body);
	},
};
