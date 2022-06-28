import * as React from "react";

import { isDOMNode, isFalse, isNull } from "~/utils/validations";
import type { T_ReactRefObject } from "~/types";

function useClickOutside(ref: T_ReactRefObject<HTMLElement>, callback: () => void): void {
	// effects
	React.useEffect(() => {
		const controller = new AbortController();

		document.addEventListener(
			"mousedown",
			function handleClickOutside(event: MouseEvent): void {
				if (
					isDOMNode(event.target) &&
					!isNull(ref.current) &&
					isFalse(ref.current.contains(event.target))
				) {
					callback();
				}
			},
			{ signal: controller.signal },
		);

		return () => {
			controller.abort();
		};
	}, [ref, callback]);
}

export default useClickOutside;
