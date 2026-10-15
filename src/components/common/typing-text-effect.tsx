import { useEffect, useRef, useState } from "react";

import cn from "@diegofrayo-pkg/cn";
import type UtilsTypes from "@diegofrayo-pkg/types";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { keyMirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

import { InlineText, Paragraph } from "~/components/primitive";

const TypingTextEffectAligns = keyMirror(["CENTER", "LEFT"]);
type TypingTextEffectAlign = keyof typeof TypingTextEffectAligns;

type TypingTextEffectProps = {
	align: TypingTextEffectAlign;
	text: string;

	className?: string;
};

function TypingTextEffect({ align, text, className }: TypingTextEffectProps): ReactTypes.JSXElement {
	// --- HOOKS ---
	const textForTyping = useTypingTextEffect(text);

	// --- COMPUTED STATES ---
	const isCursorVisible = text === textForTyping;
	const isCenterAlign = align === TypingTextEffectAligns.CENTER;

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

TypingTextEffect.align = TypingTextEffectAligns;

export { TypingTextEffectAligns, type TypingTextEffectAlign };

export default TypingTextEffect;

// --- HOOKS ---

function useTypingTextEffect(text: string): string {
	// --- STATES & REFS ---
	const [output, setOutput] = useState(text.charAt(0));
	const outputIndexRef = useRef<number>(1);
	const intervalRef = useRef<UtilsTypes.SetTimeout | null>(null);

	// --- EFFECTS ---
	useEffect(
		function startInterval() {
			if (!intervalRef.current) {
				intervalRef.current = setInterval(function typeNextCharacter() {
					setOutput((currentState) => {
						const newState = `${currentState}${text.charAt(outputIndexRef.current)}`;
						outputIndexRef.current += 1;

						return newState;
					});
				}, 250);
			}

			return function clearTypingInterval(): void {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
					intervalRef.current = null;
				}
			};
		},
		[text],
	);

	useEffect(
		function stopInterval() {
			if (output === text && intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		},
		[output, text],
	);

	return output;
}
