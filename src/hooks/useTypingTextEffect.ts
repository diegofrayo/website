import * as React from "react";
import type DR from "@diegofrayo/types";

function useTypingTextEffect(text: string) {
	const [output, setOutput] = React.useState(text.charAt(0));
	const outputIndexRef = React.useRef(1);
	const intervalRef = React.useRef<DR.SetTimeout | null>(null);

	React.useEffect(function startInterval() {
		if (!intervalRef.current) {
			intervalRef.current = setInterval(() => {
				setOutput((currentState) => {
					const newState = `${currentState}${text.charAt(outputIndexRef.current)}`;
					outputIndexRef.current += 1;

					return newState;
				});
			}, 250);
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	React.useEffect(
		function stopInterval() {
			if (output === text && intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		},
		[output, text],
	);

	return output;
}

export default useTypingTextEffect;
