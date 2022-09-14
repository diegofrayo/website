import * as React from "react";

import { Block, Text, InlineText } from "~/components/primitive";
import { getErrorMessage } from "~/features/errors-logging";
import { isUndefined } from "~/utils/validations";
import type { T_ReactElementNullable } from "~/types";

import Emoji from "./Emoji";
import Loader from "./Loader";
import { useDidMount } from "~/hooks";

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
	useDidMount(() => {
		alert(isLoading); // @ts-ignore
		alert(error ? error.message : "error");
		alert(typeof data);
		alert(typeof error);
	});

	if (error) {
		return (
			<Text className="tw-p-2 tw-text-center tw-text-sm tw-text-red-600">
				<Emoji className="tw-mr-2">😵</Emoji>
				<InlineText>{getErrorMessage(error)}</InlineText>
			</Text>
		);
	}

	if (isLoading) {
		return (
			<Block className="tw-p-2 tw-text-center">
				<Loader />
			</Block>
		);
	}

	if (!isUndefined(data)) {
		return children(data);
	}

	throw new Error("Invalid state");
}

export default Render;
