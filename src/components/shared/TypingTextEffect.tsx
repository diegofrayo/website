import * as React from "react";
import cn from "classnames";

import { Text, InlineText } from "~/components/primitive";
import { useTypingTextEffect } from "@diegofrayo/hooks";

type T_TypingTextEffectProps = {
	children: string;
	className: string;
};

function TypingTextEffect({ className, children }: T_TypingTextEffectProps) {
	// --- HOOKS ---
	const text = useTypingTextEffect(children);

	// --- VARS ---
	const showCursor = children === text;

	return (
		<Text className={cn(className)}>
			<InlineText
				className={cn(
					showCursor
						? "tw-border-1 tw-inline-block tw-w-4 tw-animate-intermitent tw-text-left tw-font-mono tw-font-bold"
						: "tw-hidden",
				)}
			/>
			<InlineText>{text}</InlineText>
			<InlineText
				className={cn(
					showCursor
						? "tw-border-1 tw-inline-block tw-w-4 tw-animate-intermitent tw-text-left tw-font-mono tw-font-bold"
						: "tw-hidden",
				)}
			>
				|
			</InlineText>
		</Text>
	);
}

export default TypingTextEffect;
