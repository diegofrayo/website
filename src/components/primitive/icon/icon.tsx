import type { ComponentProps } from "react";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";

import { Icons, type IconName } from "./icon-catalog";

export type IconProps = {
	name: IconName;
	className?: string | undefined;
	size?: number | undefined;
	svgProps?: ComponentProps<"svg">;
};

function Icon({
	name,
	className,
	size = 16,
	svgProps = {},
	...props
}: IconProps): ReactTypes.JSXElementNullable {
	const Component = Icons[name];

	if (!Component) return null;

	return (
		<Component
			className={cn("inline-block text-inherit", className)}
			size={size}
			{...svgProps}
			{...props}
		/>
	);
}

export default Icon;
