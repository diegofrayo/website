import * as React from "react";
import classNames from "classnames";

import { Block, Title } from "~/@legacy/src/components/primitive";
import { generateSlug } from "~/@legacy/src/utils/strings";
import type { T_ReactElement, T_ReactFunctionComponent } from "~/@legacy/src/types";

type T_TimelineProps<G_Item> = {
	timeline: {
		title: string;
		items: G_Item[];
	}[];
	TimelineItem: T_ReactFunctionComponent<{ data: G_Item }>;
};

function Timeline<G_Item extends { id: string; [key: string]: unknown }>({
	timeline,
	TimelineItem,
}: T_TimelineProps<G_Item>): T_ReactElement {
	let itemsCounter = 0;

	return (
		<Block>
			{timeline.map((group, groupIndex) => {
				const groupTitle = group.title;

				return (
					<Block
						key={generateSlug(groupTitle)}
						is="section"
					>
						<Title
							is="h2"
							className="tw-my-8 tw-text-center tw-underline"
							variant={Title.variant.SECONDARY}
							size={Title.size.LG}
						>
							{groupTitle}
						</Title>

						{group.items.map((item, itemIndex) => {
							itemsCounter += 1;
							const isFirstElement = itemIndex === 0;
							const isNotTheLastGroup = groupIndex !== timeline.length - 1;
							const isNotTheLastGroupItem = itemIndex !== group.items.length - 1;
							const hasToRenderLastSeparator = isNotTheLastGroup || isNotTheLastGroupItem;

							return (
								<Block
									key={`${generateSlug(groupTitle)}-${item.id}`}
									className={classNames(
										"tw-relative tw-px-0 tw-pb-6 tw-text-center last:tw-pb-0 sm:tw-w-1/2 sm:tw-px-4 sm:tw-pb-16 sm:dfr-border-color-gs-black sm:dark:dfr-border-color-primary",
										itemsCounter % 2 === 0
											? "sm:tw-left-2/4 sm:tw-border-l-4 sm:tw-text-left"
											: "sm:tw-ml-1 sm:tw-border-r-4 sm:tw-text-right",
									)}
								>
									{isFirstElement ? (
										<Block className="tw-mx-auto tw-mb-6 tw-block tw-h-24 tw-w-1 dfr-bg-color-bw sm:tw-hidden" />
									) : null}

									<TimelineItem data={item} />

									{hasToRenderLastSeparator ? (
										<Block className="tw-mx-auto tw-mt-8 tw-block tw-h-24 tw-w-1 dfr-bg-color-bw sm:tw-hidden" />
									) : null}
								</Block>
							);
						})}
					</Block>
				);
			})}
		</Block>
	);
}

export default Timeline;