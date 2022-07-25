import * as React from "react";

import { InlineText } from "~/components/primitive";
import { useOnWindowResize } from "~/hooks";
import type { T_ReactElement } from "~/types";

function WindowSize(): T_ReactElement {
	// states & refs
	const [size, setSize] = React.useState([0, 0]);

	// effects
	useOnWindowResize(() => {
		setSize([window.innerWidth, window.innerHeight]);
	});

	// render
	return (
		<div className="root tw-fixed tw-bottom-0 tw-left-0 tw-cursor-pointer tw-bg-opacity-50 tw-p-3 tw-font-bold dfr-text-color-gs-white dfr-bg-color-bw">
			<InlineText>{size.join("x")} | </InlineText>
			<InlineText className="tw-inline-block sm:tw-hidden">mobile</InlineText>
			<InlineText className="tw-hidden sm:tw-inline-block md:tw-hidden">sm</InlineText>
			<InlineText className="lg:tw-hidden tw-hidden md:tw-inline-block">md</InlineText>
			<InlineText className="lg:tw-inline-block tw-hidden">lg</InlineText>
		</div>
	);
}

export default WindowSize;
