import cn from "@diegofrayo-pkg/cn";
import { useTypingTextEffect } from "@diegofrayo-pkg/hooks";
import { mirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

import { InlineText, Paragraph } from "~/components/primitive";

// --- PROPS DEFINITIONS ---

const Align = mirror(["CENTER", "LEFT"]);
type Align = keyof typeof Align;

type TypingTextEffectProps = {
	align: Align;
	text: string;
	className?: string;
};

// --- COMPONENT DEFINITION ---

function TypingTextEffect({ align, className = "", text }: TypingTextEffectProps) {
	// --- HOOKS ---
	const textForTyping = useTypingTextEffect(text);

	// --- COMPUTED STATES ---
	const isCursorVisible = text === textForTyping;
	const isCenterAlign = align === "CENTER";

	// --- STYLES ---
	const classes = {
		container: cn("text-left font-mono font-thin", { "text-center": isCenterAlign }, className),
		spaceHelperForCenterAlignment: cn("inline-block w-4"),
		cursor: cn("invisible inline-block w-4 text-left font-mono font-bold", {
			"animate-intermitent visible": isCursorVisible,
		}),
	};

	return (
		<Paragraph className={classes.container}>
			{isCenterAlign && <InlineText className={classes.spaceHelperForCenterAlignment} />}
			<InlineText>{textForTyping}</InlineText>
			<InlineText className={classes.cursor}>|</InlineText>
		</Paragraph>
	);
}

TypingTextEffect.align = Align;

export default TypingTextEffect;
