import * as React from "react";

import Block from "~/components/primitive/Block";
import InlineText from "~/components/primitive/InlineText";
import Text from "~/components/primitive/Text";
import type DR from "@diegofrayo/types";
import { getErrorMessage } from "@diegofrayo/utils/misc";

import Loader from "./Loader";

type T_RenderProps<G_Data> = {
	isLoading: boolean;
	error: unknown;
	data: G_Data | undefined;
	children: (data: G_Data) => DR.React.JSXElementNullable;
};

function Render<G_Data>({ isLoading, error, data, children }: T_RenderProps<G_Data>) {
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
				<InlineText className="tw-mr-2">😵</InlineText>
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
