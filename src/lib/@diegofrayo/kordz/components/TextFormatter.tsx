import * as React from "react";
import reactStringReplace from "react-string-replace";

import KordzService from "../service";

import type DR from "../../types";
import { safeCastNumber } from "../../utils/numbers";
import { generateSlug } from "../../utils/strings";

type T_TextFormatterProps = {
	children: string;
	insertions: { text: string; replacement: DR.React.Node }[];
};

function TextFormatter({ children, insertions }: T_TextFormatterProps) {
	// --- EFFECTS ---
	React.useEffect(() => {
		document.querySelectorAll(`.${KordzService.CHORDS_BUTTON_SELECTOR}`).forEach((button) => {
			button.addEventListener("click", (event: Event) => {
				const element = event.currentTarget as HTMLButtonElement;

				window.dispatchEvent(
					new CustomEvent("KORDZ_CHORD_SELECTED", {
						detail: {
							chord: KordzService.findChord(element.innerText.trim(), { returnAllVariants: true }),
							selectedChordIndex: safeCastNumber(element.getAttribute("data-chord-index") || "", 0),
						},
					}),
				);
			});
		});
	}, []);

	// --- UTILS ---
	function parseInsertions(content: string) {
		let result: (string | DR.React.Node)[] = [];

		if (insertions) {
			insertions.forEach(({ text, replacement }, index) => {
				result = reactStringReplace(
					index === 0 ? content : result,
					text,
					() => replacement,
				) as DR.React.Node[];
			});
		} else {
			result = [content];
		}

		return result.map((item, index) => {
			if (typeof item === "string") {
				return (
					<pre
						key={generateSlug(`TextFormatter-pre-item-${index}`)}
						className="tw-overflow-visible tw-leading-none"
						dangerouslySetInnerHTML={{ __html: item }}
					/>
				);
			}

			return (
				<React.Fragment key={generateSlug(`TextFormatter-React.Fragment-item-${index}`)}>
					{item}
				</React.Fragment>
			);
		});
	}

	return parseInsertions(children);
}

export default TextFormatter;
