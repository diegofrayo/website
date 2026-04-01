import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";

import { Box, Text } from "../primitive";

type BoxWithTitleProps = {
	children: ReactTypes.Children;
	title: string;
	className?: string;
};

function BoxWithTitle({ children, title, className }: BoxWithTitleProps) {
	return (
		<Box className={cn("relative border border-black bg-white", className)}>
			<Text className="absolute -top-2 left-3 border bg-black px-2 text-xs font-bold text-white italic">
				{title}
			</Text>

			{children}
		</Box>
	);
}

export default BoxWithTitle;
