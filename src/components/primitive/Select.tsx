import * as React from "react";
import classNames from "classnames";

import type { T_ReactChildren, T_ReactElement, T_ReactOnChangeEventHandler } from "~/types";

type T_SelectProps = {
	children: T_ReactChildren;
	defaultValue: string;
	className?: string;
	height?: string;
	onChange: T_ReactOnChangeEventHandler<HTMLSelectElement>;
};

function Select({
	children,
	defaultValue,
	className,
	height = "tw-h-[30px]",
	onChange,
}: T_SelectProps): T_ReactElement {
	return (
		<select
			className={classNames(height, className)}
			defaultValue={defaultValue}
			onChange={onChange}
		>
			{children}

			<style jsx>{`
				select {
					@apply dfr-bg-color-tertiary;
					@apply dfr-border-color-primary;
					border-width: 1px;
					width: 100%;
				}
			`}</style>
		</select>
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
