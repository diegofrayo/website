import * as React from "react";

import { safeCastNumber } from "../../utils/numbers";
import KordzService from "../service";

type T_TextFormatterProps = {
	children: string;
};

function TextFormatter({ children }: T_TextFormatterProps) {
	// --- EFFECTS ---
	React.useEffect(() => {
		document.querySelectorAll(`.${KordzService.CHORDS_BUTTON_SELECTOR}`).forEach((button) => {
			button.addEventListener("click", (event: Event) => {
				const element = event.currentTarget as HTMLButtonElement;

				window.dispatchEvent(
					new CustomEvent("KORDZ_CHORD_SELECTED", {
						detail: {
							chord: KordzService.findChord(element.innerText, { returnAllVariants: true }),
							selectedChordIndex: safeCastNumber(element.getAttribute("data-chord-index") || "", 0),
						},
					}),
				);
			});
		});
	}, []);

	return (
		<pre
			className="dr-kordz-text-formatter tw-leading-none"
			dangerouslySetInnerHTML={{
				__html: children,
			}}
		/>
	);
}

export default TextFormatter;
