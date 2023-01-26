import * as React from "react";

import { Page } from "~/@legacy/src/components/layout";
import { Input } from "~/@legacy/src/components/primitive";
import { AuthService, withAuthPage } from "~/@legacy/src/features/auth";
import { getPageContentStaticProps } from "~/@legacy/src/features/i18n";
import { logAndReportError } from "~/@legacy/src/features/logging";
import { redirect, ROUTES } from "~/@legacy/src/features/routing";
import v from "~/@legacy/src/lib/v";
import { showToast } from "~/@legacy/src/utils/browser";
import { getErrorMessage } from "~/@legacy/src/utils/misc";
import type {
	T_ReactElement,
	T_ReactOnChangeEventHandler,
	T_ReactOnKeyPressEventHandler,
	T_ReactOnSubmitEventHandler,
} from "~/@legacy/src/types";

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
		if (event.key !== "Enter" || v.isEmptyString(inputValue)) {
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
