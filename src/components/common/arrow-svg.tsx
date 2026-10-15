import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";

type ArrowSvgProps = {
	className?: string;
	color?: string;
	size?: string;
};

function ArrowSvg({
	className,
	color = "text-black",
	size = "size-6",
}: ArrowSvgProps): ReactTypes.JSXElement {
	// --- STYLES ---
	const classes = {
		svg: cn("fill-current", size, color, className),
	};

	return (
		<svg
			viewBox="0 0 100 100"
			className={classes.svg}
			xmlns="http://www.w3.org/2000/svg"
		>
			<polygon points="0,0 100,0 50,70" />
		</svg>
	);
}

export default ArrowSvg;
