import type ReactTypes from "@diegofrayo-pkg/types/react";

import { Box, Title } from "~/components/primitive";

type ResumeBoxProps = {
	title: string;
	children: ReactTypes.Children;
	variant: "SIMPLE" | "COLORFUL";
	style?: ReactTypes.Styles;
};

export function ResumeBox({ title, children, variant, style }: ResumeBoxProps) {
	if (variant === "SIMPLE") {
		return (
			<Box
				as="section"
				className="mb-6 last:mb-0"
				style={style}
			>
				<Title
					as="h2"
					variant={Title.variant.UNSTYLED}
					className="mb-3 border-b border-dashed text-left text-xl uppercase"
				>
					{title}
				</Title>
				<Box className="px-1">{children}</Box>
			</Box>
		);
	}

	return (
		<Box
			as="section"
			className="mt-12"
			style={{ pageBreakInside: "avoid" }}
		>
			<Title
				as="h2"
				className="mb-4 border-black bg-black px-4 py-2 text-left text-white uppercase"
				size={Title.size.LG}
			>
				{title}
			</Title>
			<Box className="px-2">{children}</Box>
		</Box>
	);
}
