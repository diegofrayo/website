import * as React from "react";

import cn from "~/lib/cn";
import { mirror } from "@diegofrayo/utils/arrays-and-objects";
import v from "@diegofrayo/v";
import type DR from "@diegofrayo/types";

import Text from "../Text";
import styles from "./styles.module.css";

// --- PROPS & TYPES ---

const VARIANTS = mirror(["UNSTYLED", "STYLED"]);
type T_Variant = keyof typeof VARIANTS;
type T_InputProps = DR.DOM.HTMLElementAttributes["input"] & {
	id: string;
	type: DR.DOM.HTMLElementAttributes["input"]["type"];
	variant?: T_Variant;
	componentProps?: {
		label?: string;
		customErrorMessage?: string;
	};
	containerProps?: DR.DOM.HTMLElementAttributes["label"];
	labelProps?: DR.DOM.HTMLElementAttributes["p"];
};

// --- COMPONENT DEFINITION ---

const Input = React.forwardRef<HTMLInputElement, T_InputProps>(function Input(
	{
		id,
		className,
		variant = VARIANTS.UNSTYLED,
		componentProps: { label = "", customErrorMessage = "" } = {},
		containerProps = {},
		labelProps = {},
		onChange,
		...rest
	}: T_InputProps,
	forwardedRef,
) {
	// --- STATES & REFS ---
	const [showErrorMessage, setShowErrorMessage] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState("");
	const [touched, setTouched] = React.useState(false);

	// --- HANDLERS ---
	function onChangeHandler(event: DR.React.Events.OnChangeEvent<HTMLInputElement>) {
		setTouched(true);
		setErrorMessage(event.currentTarget.validationMessage);
		setShowErrorMessage(event.currentTarget.validity.valid === false);

		onChange?.(event);
	}

	function onInvalidHandler(event: DR.React.Events.OnChangeEvent<HTMLInputElement>) {
		event.preventDefault();
		onChangeHandler(event);
	}

	return (
		<label
			{...containerProps}
			className={cn(
				`dr-input dr-input--${variant.toLowerCase()}`,
				styles[`dr-input--${variant.toLowerCase()}`],
				containerProps.className,
			)}
			htmlFor={id}
		>
			{v.isNotEmptyString(label) ? <Label {...labelProps}>{label}</Label> : null}
			<input
				{...rest}
				ref={forwardedRef}
				id={id}
				className={cn(
					"tw-block tw-w-full tw-rounded-none tw-border tw-px-2 tw-py-1 tw-shadow-none",
					touched && "touched",
					className,
				)}
				onInvalid={onInvalidHandler}
				onChange={onChangeHandler}
				onBlur={onChangeHandler}
			/>
			{(v.isNotEmptyString(customErrorMessage) || v.isNotEmptyString(errorMessage)) &&
			showErrorMessage ? (
				<Text className="tw-mt-0.5 tw-text-sm tw-italic tw-text-red-500">
					{customErrorMessage || errorMessage}
				</Text>
			) : null}
		</label>
	);
}) as DR.React.CompoundedComponent<
	T_InputProps,
	HTMLInputElement,
	{ Label: DR.React.FunctionComponent; variant: typeof VARIANTS }
>;

Input.Label = Label;
Input.variant = VARIANTS;

export default Input;

// --- COMPONENTS ---

export function Label({ children, className, ...rest }: DR.DOM.HTMLElementAttributes["p"]) {
	return (
		<Text
			className={cn("tw-cursor-pointer tw-font-bold", className)}
			{...rest}
		>
			{children}
		</Text>
	);
}
