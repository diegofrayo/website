import * as React from "react";

import { MainLayout, Page } from "~/components/layout";
import { Button, Input, Space } from "~/components/primitive";
import { Toast } from "~/components/shared";
import ServerAPI from "~/modules/api";
import { AuthService, withAuthRulesPage } from "~/modules/auth";
import { ROUTES, redirect } from "~/modules/routing";
import { SignInForm, T_SignInFormSchema } from "~/server/api/endpoints/sign-in/schemas";
import { getErrorMessage } from "@diegofrayo/utils/misc";
import type DR from "@diegofrayo/types";

function SignInPage() {
	return (
		<Page
			config={{
				title: "Sign in",
				disableSEO: true,
			}}
		>
			<MainLayout>
				<Form>
					<Input
						variant={Input.variant.STYLED}
						id="input-email"
						name="email"
						type="email"
						componentProps={{ label: "Email" }}
						{...SignInForm.emailConstraints}
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
						required
					/>
					<Space size={2} />
					<Button
						variant={Button.variant.SIMPLE}
						type="submit"
						className="tw-block tw-w-full tw-rounded-md tw-p-2 tw-text-center tw-font-bold tw-uppercase dr-text-color-surface-100 dr-bg-color-surface-600"
					>
						Sign in
					</Button>
				</Form>
			</MainLayout>
		</Page>
	);
}

export default withAuthRulesPage(SignInPage, { allowAuth: false });

// --- COMPONENTS ---

function Form({ children }: { children: DR.React.Children }) {
	// --- HANDLERS ---
	async function onSubmitHandler(event: DR.React.Events.OnSubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		const formDataEntries = new FormData(event.currentTarget).entries();
		const body = Object.fromEntries(formDataEntries) as T_SignInFormSchema;

		try {
			await SignInAPI.signIn("/sign-in", body);
			AuthService.createSession();
			redirect(ROUTES.HOME);
		} catch (error) {
			Toast.error(getErrorMessage(error));
		}
	}

	return (
		<form
			className="tw-mx-auto tw-w-64 tw-max-w-full"
			onSubmit={onSubmitHandler}
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
