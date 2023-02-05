import * as React from "react";
import classNames from "classnames";

import v from "~/@legacy/src/lib/v";
import type {
	T_HTMLElementAttributes,
	T_ReactElement,
	T_ReactFunctionComponent,
} from "~/@legacy/src/types";

import Text from "./Text";

type T_InputProps = T_HTMLElementAttributes["input"] & {
	id: string;
	type: T_HTMLElementAttributes["input"]["type"];
	componentProps?: {
		is?: "textarea" | "input";
		label?: string;
	};
	containerProps?: T_HTMLElementAttributes["label"];
	labelProps?: T_HTMLElementAttributes["p"];
};

const Input = React.forwardRef(function Input(
	{
		id,
		className,
		componentProps: { is = "input", label = "" } = {},
		containerProps = {},
		labelProps = {},
		...rest
	}: T_InputProps,
	ref,
): T_ReactElement {
	/*
	 * TODO: Typing issue
	 * A possible solution: https://www.benmvp.com/blog/forwarding-refs-polymorphic-react-component-typescript
	 */
	// @ts-ignore
	const Element = is as T_ReactFunctionComponent;

	return (
		<label
			{...containerProps}
			className={classNames("root", "tw-block", containerProps.className)}
			htmlFor={id}
		>
			{v.isNotEmptyString(label) ? <Label {...labelProps}>{label}</Label> : null}
			<Element
				ref={ref}
				id={id}
				className={classNames(
					"dfr-Input tw-block tw-w-full tw-rounded-none tw-border tw-py-1 tw-px-2 tw-shadow-none dfr-bg-color-tertiary dfr-border-color-primary",
					className,
				)}
				{...rest}
			/>

			<style jsx>
				{`
					.root :global(input.dfr-Input) {
						-webkit-appearance: none;
						height: 37px;
						resize: none;
					}

					.root :global(:is(input.dfr-Input:focus, input.dfr-Input:focus-within)) {
						border-radius: 0;
						outline-color: var(--dfr-text-color-gs-400);
						outline-style: solid;
						outline-width: 1px;
					}

					.root :global(textarea.dfr-Input) {
						min-height: 150px;
						max-height: 300px;
						resize: vertical;
					}
				`}
			</style>
		</label>
	);
});

// TODO: Typing issue
// @ts-ignore
Input.Label = Label;

export default Input;

// --- Components ---

export function Label({
	children,
	className,
	...rest
}: T_HTMLElementAttributes["p"]): T_ReactElement {
	return (
		<Text
			className={classNames("tw-mb-1 tw-cursor-pointer tw-font-bold", className)}
			{...rest}
		>
			{children}
		</Text>
	);
}
