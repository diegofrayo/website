import cn from "@diegofrayo-pkg/cn";
import { useTypingTextEffect } from "@diegofrayo-pkg/hooks";
import { mirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

import { InlineText, Text } from "../primitive";

const Align = mirror(["CENTER", "LEFT"]);
type Align = keyof typeof Align;

type TypingTextEffectProps = {
	align: Align;
	className?: string;
	text: string;
};

function TypingTextEffect({ align, className = "", text }: TypingTextEffectProps) {
	// --- HOOKS ---
	const typedText = useTypingTextEffect(text);

	// --- COMPUTED STATES ---
	const showCursor = text === typedText;
	const isCenterAligned = align === "CENTER";

	// --- STYLES ---
	const classes = {
		container: cn("text-left font-mono font-thin", { "text-center": isCenterAligned }, className),
		auxSpace: cn("inline-block w-4"),
		cursor: cn("invisible inline-block w-4 text-left font-mono font-bold", {
			"animate-intermitent visible": showCursor,
		}),
	};

	return (
		<Text className={classes.container}>
			{isCenterAligned && <InlineText className={classes.auxSpace} />}
			<InlineText>{typedText}</InlineText>
			<InlineText className={classes.cursor}>|</InlineText>
		</Text>
	);
}

TypingTextEffect.align = Align;

export default TypingTextEffect;
