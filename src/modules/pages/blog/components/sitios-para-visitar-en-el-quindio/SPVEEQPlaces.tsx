import * as React from "react";

import { Block, Collapsible, Icon, Link, Space, Text } from "~/components/primitive";
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

type T_SPVEEQPlacesProps = {
	data: {
		name: string;
		maps: string;
		instagram: string;
		location: string;
		website: string;
		description: string;
		links: string[];
	}[];
};

function SPVEEQPlaces({ data: places }: T_SPVEEQPlacesProps) {
	return (
		<Block>
			{places.map((place) => {
				return (
					<Collapsible
						key={generateSlug(place.name)}
						className="tw-mb-4 last:tw-mb-0"
						contentClassName="tw-pt-2"
						title={`${place.name} [${place.location}]`}
					>
						<Block className="tw-relative tw-flex tw-gap-2 tw-border tw-p-2 tw-pt-3 dr-border-color-surface-300">
							<Text className="tw-absolute tw--top-2 tw-left-2 tw-border tw-px-1 tw-text-xs tw-font-bold dr-bg-color-surface-100 dr-border-color-surface-300">
								Links
							</Text>

							{v.isNotEmptyString(place.instagram) ? (
								<Link
									variant={Link.variant.SIMPLE}
									href={place.instagram}
									isExternalLink
								>
									<Icon icon={Icon.icon.INSTAGRAM} />
								</Link>
							) : null}
							{v.isNotEmptyString(place.maps) ? (
								<Link
									variant={Link.variant.SIMPLE}
									href={place.maps}
									isExternalLink
								>
									<Icon icon={Icon.icon.MAPS} />
								</Link>
							) : null}
							{v.isNotEmptyString(place.website) ? (
								<Link
									variant={Link.variant.SIMPLE}
									href={place.website}
									isExternalLink
								>
									<Icon
										icon={Icon.icon.WEBSITE}
										size={28}
									/>
								</Link>
							) : null}
							{v.isNotEmptyArray(place.links) ? (
								<Block className="tw-flex tw-gap-2 tw-border-l tw-px-3 dr-border-color-surface-300">
									{place.links.map((link) => {
										return (
											<Link
												key={link}
												variant={Link.variant.SIMPLE}
												href={link}
												isExternalLink
											>
												<Icon
													icon={Icon.icon.EXTERNAL_LINK}
													size={20}
												/>
											</Link>
										);
									})}
								</Block>
							) : null}
						</Block>
						<Space size={2} />

						<Block>
							<Text>{place.description || "Descripción"}</Text>
						</Block>
					</Collapsible>
				);
			})}
		</Block>
	);
}

export default SPVEEQPlaces;
