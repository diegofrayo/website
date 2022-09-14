import * as React from "react";

import { Block, Text, InlineText } from "~/components/primitive";
import { getErrorMessage } from "~/features/errors-logging";
import { isUndefined } from "~/utils/validations";
import type { T_ReactElementNullable } from "~/types";

import Emoji from "./Emoji";
import Loader from "./Loader";
import ProtectedComponent from "./ProtectedComponent";

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
	if (error) {
		return (
			<Text className="tw-p-2 tw-text-center tw-text-sm tw-text-red-600">
				<Emoji className="tw-mr-2">😵</Emoji>
				<InlineText>{getErrorMessage(error)}</InlineText>
				<ProtectedComponent>
					<Block className="tw-my-1">{isLoading}</Block>
					<Block className="tw-my-1">{typeof error}</Block>
					<Block className="tw-my-1">{error ? JSON.stringify(error) : "no error"}</Block>
					<Block className="tw-my-1">{typeof data}</Block>
					<Block className="tw-my-1">{data ? JSON.stringify(data) : "no data"}</Block>
				</ProtectedComponent>
			</Text>
		);
	}

	if (isLoading) {
		return (
			<Block className="tw-p-2 tw-text-center">
				<Loader />
				<ProtectedComponent>
					<Block className="tw-my-1">{isLoading}</Block>
					<Block className="tw-my-1">{typeof error}</Block>
					<Block className="tw-my-1">{error ? JSON.stringify(error) : "no error"}</Block>
					<Block className="tw-my-1">{typeof data}</Block>
					<Block className="tw-my-1">{data ? JSON.stringify(data) : "no data"}</Block>
				</ProtectedComponent>
			</Block>
		);
	}

	if (!isUndefined(data)) {
		return children(data);
	}

	throw new Error("Invalid state");
}

export default Render;
