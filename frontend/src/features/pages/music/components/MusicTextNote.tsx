import classNames from "classnames";
import * as React from "react";

import { Text } from "~/components/primitive";
import type { T_ReactElement } from "~/types";

type T_MusicTextNote = {
	children: string;
	className?: string;
};

function MusicTextNote({ children, className }: T_MusicTextNote): T_ReactElement {
	return (
		<Text
			className={classNames("tw-text-sm tw-italic dfr-text-color-secondary", className)}
		>{`"${children}"`}</Text>
	);
}

export default MusicTextNote;
