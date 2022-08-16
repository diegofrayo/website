import * as React from "react";
import classNames from "classnames";

import { isNotEmptyString } from "~/utils/validations";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

import { Label } from "./Input";

type T_SelectProps = T_HTMLElementAttributes["select"] & {
	id: string;
	componentProps?: {
		label?: string;
		height?: string;
	};
	containerProps?: T_HTMLElementAttributes["label"];
	labelProps?: T_HTMLElementAttributes["p"];
};

function Select({
	children,
	id,
	className,
	componentProps: { label = "" } = {},
	containerProps = {},
	labelProps = {},
	...rest
}: T_SelectProps): T_ReactElement {
	return (
		<label
			{...containerProps}
			className={classNames("root", "tw-block", containerProps.className)}
			htmlFor={id}
		>
			{isNotEmptyString(label) ? <Label {...labelProps}>{label}</Label> : null}
			<select
				className={classNames("dfr-Select", className)}
				{...rest}
			>
				{children}
			</select>

			<style jsx>{`
				select {
					@apply dfr-bg-color-tertiary;
					@apply dfr-border-color-primary;
					@apply tw-py-1 tw-px-2;
					-webkit-appearance: none;
					border-width: 1px;
					width: 100%;
				}

				select:focus-within,
				select:focus {
					border-radius: 0;
					outline-color: var(--dfr-text-color-gs-400);
					outline-style: solid;
					outline-width: 1px;
				}
			`}</style>
		</label>
	);
}

export default Select;

// --- Components ---

Select.Option = function SelectOption({
	children,
	value,
}: {
	children: string;
	value: string;
}): T_ReactElement {
	return <option value={value}>{children}</option>;
};
