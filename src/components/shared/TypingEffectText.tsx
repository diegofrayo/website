import * as React from "react";
import cn from "classnames";

import { Text, InlineText } from "~/components/primitive";
import { useTypingEffect } from "~/hooks";

type T_TypingEffectText = {
	className: string;
	children: string;
};

function TypingEffectText({ className, children }: T_TypingEffectText) {
	// --- HOOKS ---
	const text = useTypingEffect(children);

	return (
		<Text className={cn(className)}>
			<InlineText>{text}</InlineText>
			<InlineText
				className={cn(
					children === text
						? "tw-ml-0.5 tw-animate-intermitent tw-font-mono tw-font-bold"
						: "tw-hidden",
				)}
			>
				|
			</InlineText>
		</Text>
	);
}

export default TypingEffectText;
