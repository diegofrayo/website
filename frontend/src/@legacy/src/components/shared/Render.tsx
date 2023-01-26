import * as React from "react";

import { Block, Text, InlineText } from "~/@legacy/src/components/primitive";
import { getErrorMessage } from "~/@legacy/src/utils/misc";
import type { T_ReactElementNullable } from "~/@legacy/src/types";

import Emoji from "./Emoji";
import Loader from "./Loader";

type T_RenderProps<G_Data> = {
	isLoading: boolean;
	error: unknown;
	data: G_Data | undefined;
	children: (data: G_Data) => T_ReactElementNullable;
};

function Render<G_Data>({
	isLoading,
	error,
	data,
	children,
}: T_RenderProps<G_Data>): T_ReactElementNullable {
	if (isLoading) {
		return (
			<Block className="tw-p-2 tw-text-center">
				<Loader />
			</Block>
		);
	}

	if (error) {
		return (
			<Text className="tw-p-2 tw-text-center tw-text-sm tw-text-red-600">
				<Emoji className="tw-mr-2">😵</Emoji>
				<InlineText>{getErrorMessage(error)}</InlineText>
			</Text>
		);
	}

	if (data) {
		return children(data);
	}

	throw new Error("Invalid state");
}

export default Render;
