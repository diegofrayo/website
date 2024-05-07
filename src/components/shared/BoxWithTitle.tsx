import * as React from "react";

import cn from "~/lib/cn";
import type DR from "@diegofrayo/types";

import { Block, Text } from "../primitive";

type T_BoxWithTitleProps = {
	children: DR.React.Children;
	title: string;
	className?: string;
};

function BoxWithTitle({ children, title, className }: T_BoxWithTitleProps) {
	return (
		<Block className={cn("tw-relative tw-border dr-border-color-surface-300", className)}>
			<Text className="tw-absolute tw--top-2 tw-left-2 tw-border tw-px-1 tw-text-xs tw-font-bold dr-bg-color-surface-100 dr-border-color-surface-300">
				{title}
			</Text>

			{children}
		</Block>
	);
}

export default BoxWithTitle;
