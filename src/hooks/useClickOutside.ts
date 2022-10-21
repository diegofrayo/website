import * as React from "react";

import { isDOMNode, isNotTrue, isNull } from "~/utils/validations";
import type { T_ReactRef } from "~/types";

function useClickOutside(ref: T_ReactRef<HTMLElement>, callback: () => void): void {
	// effects
	React.useEffect(() => {
		const controller = new AbortController();

		document.addEventListener(
			"mousedown",
			function handleClickOutside(event: MouseEvent): void {
				if (
					isDOMNode(event.target) &&
					!isNull(ref.current) &&
					isNotTrue(ref.current.contains(event.target))
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
