import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { mirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";
import { isNotEmptyString } from "@diegofrayo-pkg/validator";

import Paragraph from "../paragraph";
import styles from "./select.styles.module.css";

// --- PROPS & TYPES ---

const VARIANTS = mirror(["UNSTYLED", "STYLED"]);
type Variant = keyof typeof VARIANTS;
type SelectProps = ReactTypes.DOM.HTMLElementAttributes["select"] & {
	variant?: Variant;
	id: string;
	componentProps?: {
		label?: string;
		height?: string;
	};
	containerProps?: ReactTypes.DOM.HTMLElementAttributes["label"];
	labelProps?: ReactTypes.DOM.HTMLElementAttributes["p"];
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
}: SelectProps) {
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
			{isNotEmptyString(label) ? <Label {...labelProps}>{label}</Label> : null}
			<select
				className={className}
				id={id}
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

Select.Option = function SelectOption({
	children,
	value,
	className,
	...rest
}: {
	children: ReactTypes.Children;
	value: string;
	className?: string;
} & ReactTypes.DOM.HTMLElementAttributes["option"]) {
	return (
		<option
			value={value}
			className={className}
			{...rest}
		>
			{children}
		</option>
	);
};

// --- COMPONENTS ---

export function Label({ children, className, ...rest }: ReactTypes.DOM.HTMLElementAttributes["p"]) {
	return (
		<Paragraph
			className={cn("cursor-pointer font-bold", className)}
			{...rest}
		>
			{children}
		</Paragraph>
	);
}
