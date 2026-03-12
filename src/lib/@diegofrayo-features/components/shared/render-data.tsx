import type DR from "@diegofrayo-pkg/types";
import { getErrorMessage } from "@diegofrayo-pkg/utilities/errors";

import { Box, InlineText, Text } from "../primitive";
import Loader from "./loader";

type RenderProps<Data> = {
	children: (data: Data) => DR.React.JSXElementNullable;
	isLoading: boolean;
	error: unknown;
	data: Data | undefined;
};

function RenderData<Data>({ isLoading, error, data, children }: RenderProps<Data>) {
	if (isLoading) {
		return (
			<Box className="p-2 text-center">
				<Loader />
			</Box>
		);
	}

	if (error) {
		return (
			<Text className="p-2 text-center text-sm text-red-600">
				<InlineText className="mr-2">😵</InlineText>
				<InlineText>{getErrorMessage(error)}</InlineText>
			</Text>
		);
	}

	if (data) {
		return children(data);
	}

	throw new Error("Invalid state");
}

export default RenderData;
