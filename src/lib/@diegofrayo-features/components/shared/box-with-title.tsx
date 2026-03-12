import cn from "@diegofrayo-pkg/cn";
import type DR from "@diegofrayo-pkg/types";

import { Box, Text } from "../primitive";

type BoxWithTitleProps = {
	children: DR.React.Children;
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
