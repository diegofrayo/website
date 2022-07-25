import * as React from "react";
import classNames from "classnames";

import { isNotEmptyString } from "~/utils/validations";
import type { T_HTMLElementAttributes, T_ReactElement, T_ReactFunctionComponent } from "~/types";

import Text from "./Text";

type T_InputProps = T_HTMLElementAttributes["input"] & {
	type: T_HTMLElementAttributes["input"]["type"];
	id: string;
	label?: string;
	containerProps?: T_HTMLElementAttributes["label"];
	is?: "textarea" | "input";
};

const Input = React.forwardRef<HTMLInputElement, T_InputProps>(function Input(
	{ containerProps = {}, label = "", className = "", id, is = "input", ...rest }: T_InputProps,
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
			className={classNames(
				"root",
				"tw-block tw-border-b-4 dfr-border-color-secondary",
				containerProps.className,
			)}
			htmlFor={id}
		>
			{isNotEmptyString(label) ? (
				<Text className="tw-mb-1 tw-cursor-pointer tw-font-bold">{label}</Text>
			) : null}
			<Element
				// @ts-ignore
				ref={ref}
				id={id}
				className={classNames(
					"dfr-Input tw-block tw-w-full tw-resize-none tw-rounded-none tw-border tw-p-2 tw-shadow-none dfr-bg-color-secondary dfr-border-color-secondary",
					className,
				)}
				{...rest}
			/>

			<style jsx>
				{`
					.root :focus-within {
						border-color: transparent;
					}

					.root :global(.dfr-Input:focus-within) {
						border-color: transparent;
					}

					.root :global(input) {
						-webkit-appearance: none;
					}
				`}
			</style>
		</label>
	);
});

export default Input;
