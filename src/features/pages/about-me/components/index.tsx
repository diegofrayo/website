import classNames from "classnames";
import * as React from "react";

import { Block, Image, InlineText, Text } from "~/components/primitive";
import { isNotEmptyString } from "~/utils/validations";
import type { T_ReactElement } from "~/types";

type T_AboutMeBlockProps = {
	image?: string;
	text: string;
	isPortrait: boolean;
	layout: "L" | "R" | "C";
};

export default function AboutMeBlock({
	image,
	text,
	isPortrait,
	layout,
}: T_AboutMeBlockProps): T_ReactElement {
	return (
		<Block className="tw-mb-8 tw-text-justify">
			<Text className={classNames(layout === "C" && " tw-text-center")}>
				{isNotEmptyString(image) ? (
					<Image
						src={image}
						className={classNames(
							"tw-my-1 tw-inline-block tw-rounded-md dfr-transition-opacity dfr-shadow",
							isPortrait ? "tw-w-24" : "tw-h-28 tw-w-36",
							layout === "R"
								? "tw-float-right tw-ml-4"
								: layout === "L"
								? "tw-float-left tw-mr-4"
								: "",
						)}
					/>
				) : null}
				<InlineText>{text}</InlineText>
			</Text>
		</Block>
	);
}
