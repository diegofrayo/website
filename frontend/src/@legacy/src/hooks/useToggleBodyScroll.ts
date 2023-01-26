import * as React from "react";

function useToggleBodyScroll(scrollDisabled: boolean): void {
	React.useEffect(() => {
		if (scrollDisabled) {
			document.body.classList.add("scroll-disabled");
		} else {
			document.body.classList.remove("scroll-disabled");
		}
	}, [scrollDisabled]);
}

export default useToggleBodyScroll;
