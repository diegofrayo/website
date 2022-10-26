import * as React from "react";
import classNames from "classnames";

import { isNotEmptyString } from "~/utils/validations";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

import { Label } from "./Input";
import styles from "./Select.styles.module.css";

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
			className={classNames(styles["dfr-Select"], "tw-block", containerProps.className)}
			htmlFor={id}
		>
			{isNotEmptyString(label) ? <Label {...labelProps}>{label}</Label> : null}
			<select
				className={className}
				{...rest}
			>
				{children}
			</select>
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
