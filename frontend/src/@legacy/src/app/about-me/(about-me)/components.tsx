import classNames from "classnames";
import * as React from "react";

import { Block, Image, InlineText, Text } from "~/components/primitive";
import v from "~/@diegofrayo/library/v";
import type { T_ReactElement } from "~/@diegofrayo/library/types/react";

type T_AboutMeBlockProps = {
	image?: string;
	text: string;
	layout: "L" | "R" | "C";
};

export default function AboutMeBlock({ image, text, layout }: T_AboutMeBlockProps): T_ReactElement {
	return (
		<Block className="tw-mb-8 tw-text-justify last:tw-mb-0">
			<Text className={classNames(layout === "C" && " tw-text-center")}>
				{v.isNotEmptyString(image) ? (
					<Image
						src={image}
						alt="Photography of Diego Rayo taken by him"
						className={classNames(
							"dfr-transition-opacity dfr-shadow tw-my-1 tw-inline-block tw-rounded-md",
							layout === "R"
								? "tw-float-right tw-ml-4"
								: layout === "L"
								? "tw-float-left tw-mr-4"
								: "",
						)}
						width={144}
						height={112}
					/>
				) : null}
				<InlineText>{text}</InlineText>
			</Text>
		</Block>
	);
}