import * as React from "react";
import cn from "classnames";

import v from "@diegofrayo/v";
import { mirror } from "@diegofrayo/utils/arrays-and-objects";
import type DR from "@diegofrayo/types";

import { Label } from "../Input";
import styles from "./styles.module.css";

// --- PROPS & TYPES ---

const VARIANTS = mirror(["UNSTYLED", "STYLED"]);
type T_Variant = keyof typeof VARIANTS;
type T_SelectProps = DR.DOM.HTMLElementAttributes["select"] & {
	variant?: T_Variant;
	id: string;
	componentProps?: {
		label?: string;
		height?: string;
	};
	containerProps?: DR.DOM.HTMLElementAttributes["label"];
	labelProps?: DR.DOM.HTMLElementAttributes["p"];
};

// --- COMPONENT DEFINITION ---

function Select({
	children,
	variant = VARIANTS.UNSTYLED,
	id,
	className,
	componentProps: { label = "" } = {},
	containerProps = {},
	labelProps = {},
	...rest
}: T_SelectProps) {
	return (
		<label
			{...containerProps}
			className={cn(
				`dr-select dr-select--${variant.toLowerCase()}`,
				styles[`dr-select--${variant.toLowerCase()}`],
				containerProps.className,
			)}
			htmlFor={id}
		>
			{v.isNotEmptyString(label) ? <Label {...labelProps}>{label}</Label> : null}
			<select
				className={className}
				{...rest}
			>
				{children}
			</select>
		</label>
	);
}

Select.variant = VARIANTS;

export default Select;

// --- COMPONENTS ---

Select.Option = function SelectOption({ children, value }: { children: string; value: string }) {
	return <option value={value}>{children}</option>;
};
