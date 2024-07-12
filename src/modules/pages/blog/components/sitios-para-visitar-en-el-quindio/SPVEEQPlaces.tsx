import * as React from "react";

import { Block, Collapsible, Icon, InlineText, Link, Space, Title } from "~/components/primitive";
import type { T_IconName } from "~/components/primitive/Icon";
import { BoxWithTitle, ImageGallery } from "~/components/shared";
import AnalyticsService from "~/modules/analytics";
import type DR from "@diegofrayo/types";
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

type T_SPVEEQPlacesProps = {
	data: DR.Object<
		{
			id: string;
			name: string;
			maps: string;
			instagram: string;
			location: string;
			category: string[];
			price: string;
			website: string;
			description: string;
			published: boolean;
			featured: boolean;
			links: string[];
			images: { url: string; alt: string }[];
		}[]
	>;
};

function SPVEEQPlaces({ data: places }: T_SPVEEQPlacesProps) {
	return (
		<Block>
			{Object.entries(places).map(([categoryName, places]) => {
				return (
					<Block
						key={categoryName}
						className="tw-mb-4 last:tw-mb-0"
					>
						<Title
							is="h2"
							className="tw-text-white"
						>
							{categoryName.split("-")[1]}
						</Title>
						<Block className="tw-px-2">
							{places.map((place) => {
								if (!place.published) {
									return null;
								}

								return (
									<Collapsible
										key={place.id}
										contentClassName="tw-py-4"
										title={`${place.name} [${place.location}]${place.featured ? " 🌟" : ""}`}
										onShowContentHandler={AnalyticsService.trackClickEvent(
											"BLOG|SPVEEQ_PLACE|OPEN",
											{
												place: place.id,
											},
										)}
										onHideContentHandler={AnalyticsService.trackClickEvent(
											"BLOG|SPVEEQ_PLACE|CLOSE",
											{
												place: place.id,
											},
										)}
									>
										<BoxWithTitle
											title="Información"
											className="tw-px-2 tw-pb-3 tw-pt-4"
										>
											{v.isNotEmptyArray(place.category) ? (
												<InfoBlock
													title="Categoría"
													icon={{ name: Icon.icon.TAG, color: "tw-text-yellow-600" }}
												>
													<Block className="tw-flex tw-flex-wrap tw-gap-2">
														{place.category.map((category) => {
															return (
																<InlineText
																	key={generateSlug(`${place.name}-${category}`)}
																	className="tw-inline-block tw-rounded-md tw-border tw-px-2 tw-py-0.5 tw-text-sm dr-bg-color-surface-200 dr-border-color-surface-300"
																>
																	{category}
																</InlineText>
															);
														})}
													</Block>
												</InfoBlock>
											) : null}

											{v.isNotEmptyString(place.price) ? (
												<InfoBlock
													title="Precio"
													icon={{ name: Icon.icon.MONEY, color: "tw-text-green-600" }}
												>
													{place.price}
												</InfoBlock>
											) : null}

											<InfoBlock
												title="Links"
												icon={{ name: Icon.icon.LINK }}
											>
												<Block className="tw-flex tw-items-center tw-gap-1">
													{v.isNotEmptyString(place.instagram) ? (
														<Link
															variant={Link.variant.SIMPLE}
															href={place.instagram}
															className="tw-inline-block"
															onClick={AnalyticsService.trackClickEvent("BLOG|SPVEEQ|LINK", {
																place: place.id,
																link: "instagram",
															})}
															isExternalLink
														>
															<Icon
																icon={Icon.icon.INSTAGRAM}
																iconClassName="tw-p-[3px]"
																size={32}
															/>
														</Link>
													) : null}

													{v.isNotEmptyString(place.maps) ? (
														<Link
															variant={Link.variant.SIMPLE}
															href={place.maps}
															className="tw-inline-block"
															onClick={AnalyticsService.trackClickEvent("BLOG|SPVEEQ|LINK", {
																place: place.id,
																link: "maps",
															})}
															isExternalLink
														>
															<Icon
																icon={Icon.icon.MAPS}
																iconClassName="tw-rounded-full tw-p-[3px]"
																size={32}
															/>
														</Link>
													) : null}

													{v.isNotEmptyString(place.website) ? (
														<Link
															variant={Link.variant.SIMPLE}
															href={place.website}
															className="tw-inline-block"
															onClick={AnalyticsService.trackClickEvent("BLOG|SPVEEQ|LINK", {
																place: place.id,
																link: "website",
															})}
															isExternalLink
														>
															<Icon
																icon={Icon.icon.WEBSITE}
																size={32}
															/>
														</Link>
													) : null}

													{v.isNotEmptyArray(place.links)
														? place.links.map((link) => {
																return (
																	<Link
																		key={link}
																		variant={Link.variant.SIMPLE}
																		href={link}
																		className="tw-inline-block"
																		onClick={AnalyticsService.trackClickEvent("BLOG|SPVEEQ|LINK", {
																			place: place.id,
																			link: "info",
																		})}
																		isExternalLink
																	>
																		<Icon
																			icon={Icon.icon.INFO}
																			size={32}
																		/>
																	</Link>
																);
															})
														: null}
												</Block>
											</InfoBlock>

											{place.description ? (
												<InfoBlock
													title="Detalles"
													icon={{ name: Icon.icon.INFO, color: "tw-text-blue-600" }}
												>
													{place.description}
												</InfoBlock>
											) : null}
										</BoxWithTitle>
										<Space size={2} />

										<ImageGallery
											id={place.id}
											images={place.images}
										/>
									</Collapsible>
								);
							})}
						</Block>
					</Block>
				);
			})}
		</Block>
	);
}

export default SPVEEQPlaces;

// --- COMPONENTS ---

type T_InfoBlockProps = {
	icon: { name: T_IconName; color?: string };
	title: string;
	children: DR.React.Children;
};

function InfoBlock({ icon, title, children }: T_InfoBlockProps) {
	return (
		<Block className="tw-mb-4 last:tw-mb-0">
			<Block className="tw-flex tw-items-center">
				<Icon
					icon={icon.name}
					color={icon.color || ""}
					size={16}
				/>
				<InlineText
					is="strong"
					className="tw-ml-1 tw-mr-1 tw-text-white"
				>
					{title}:
				</InlineText>
			</Block>
			<Block className="tw-pl-5 tw-text-base tw-font-bold">{children}</Block>
		</Block>
	);
}
