import * as React from "react";

import { Page } from "~/components/layout";
import { Input } from "~/components/primitive";
import { AuthService, withAuthPage } from "~/features/auth";
import { getErrorMessage, logAndReportError } from "~/features/errors-logging";
import { getPageContentStaticProps } from "~/features/i18n";
import { redirect, ROUTES } from "~/features/routing";
import { showToast } from "~/utils/browser";
import { isEmptyString } from "~/utils/validations";
import type {
	T_ReactElement,
	T_ReactOnChangeEventHandler,
	T_ReactOnKeyPressEventHandler,
	T_ReactOnSubmitEventHandler,
} from "~/types";

function SignInPage(): T_ReactElement {
	const {
		// states & refs
		inputValue,
		isInputDisabled,

		// handlers
		onInputChangeHandler,
		onKeyPressHandler,
		onSubmitHandler,
	} = useController();

	return (
		<Page
			config={{
				title: "Iniciar sesión",
				disableSEO: true,
			}}
		>
			<form
				className="tw-p-4"
				onSubmit={onSubmitHandler}
			>
				<Input
					containerProps={{ className: "tw-hidden" }}
					id="username"
					type="username"
					name="username"
					value="diegofrayo"
					autoComplete="off"
					onChange={onInputChangeHandler}
				/>
				<Input
					componentProps={{ label: "Contraseña" }}
					id="password"
					type="password"
					value={inputValue}
					autoComplete="new-password"
					disabled={isInputDisabled}
					onChange={onInputChangeHandler}
					onKeyPress={onKeyPressHandler}
				/>
			</form>
		</Page>
	);
}

export default withAuthPage(SignInPage, { denyLoggedIn: true });

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps();

// --- Controller ---

type T_UseControllerReturn = {
	inputValue: string;
	isInputDisabled: boolean;
	onInputChangeHandler: T_ReactOnChangeEventHandler<HTMLInputElement>;
	onKeyPressHandler: T_ReactOnKeyPressEventHandler<HTMLInputElement>;
	onSubmitHandler: T_ReactOnSubmitEventHandler<HTMLFormElement>;
};

function useController(): T_UseControllerReturn {
	// states & refs
	const [inputValue, setInputValue] = React.useState("");
	const [isInputDisabled, setIsInputDisabled] = React.useState(false);

	// handlers
	const onKeyPressHandler: T_UseControllerReturn["onKeyPressHandler"] = async function onKeyPress(
		event,
	) {
		if (event.key !== "Enter" || isEmptyString(inputValue)) {
			return;
		}

		try {
			setIsInputDisabled(true);
			await AuthService.signIn({ password: inputValue });
			redirect(ROUTES.HOME);
		} catch (error) {
			logAndReportError(error);
			showToast({
				type: "ERROR",
				message:
					AuthService.isSignInError(error) && error.data.code === "AUTH_WRONG_PASSWORD"
						? "Contraseña incorrecta."
						: getErrorMessage(error),
				id: "sign-in",
			});
		} finally {
			setIsInputDisabled(false);
		}
	};

	const onInputChangeHandler: T_UseControllerReturn["onInputChangeHandler"] =
		function onInputChange(event) {
			setInputValue(event.currentTarget.value);
		};

	const onSubmitHandler: T_UseControllerReturn["onSubmitHandler"] = function onSubmitHandler(
		event,
	) {
		event.preventDefault();
	};

	return {
		// states & refs
		inputValue,
		isInputDisabled,

		// handlers
		onInputChangeHandler,
		onKeyPressHandler,
		onSubmitHandler,
	};
}
