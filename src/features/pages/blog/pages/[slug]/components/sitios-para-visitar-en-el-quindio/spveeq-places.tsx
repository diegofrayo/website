import type DR from "@diegofrayo-pkg/types";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";
import { isNotEmptyArray, isNotEmptyString } from "@diegofrayo-pkg/validator";
import AnalyticsService from "@diegofrayo-features/analytics";
import {
	Box,
	Collapsible,
	Icon,
	IconCatalog,
	InlineText,
	Link,
	Space,
	Title,
	type IconName,
} from "@diegofrayo-features/components/primitive";
import { BoxWithTitle, ImageGallery } from "@diegofrayo-features/components/shared";

type SPVEEQPlacesProps = {
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

function SPVEEQPlaces({ data }: SPVEEQPlacesProps) {
	return (
		<Box className="flex flex-col gap-5">
			{Object.entries(data).map(([categoryName, places]) => {
				return (
					<Box key={categoryName}>
						<Title
							as="h2"
							className="text-xl md:text-2xl"
						>
							{categoryName.split("-")[1]}
						</Title>
						<Box className="px-2">
							{places.map((place) => {
								if (!place.published) {
									return null;
								}

								return (
									<Collapsible
										key={place.id}
										contentClassName="py-4"
										title={`${place.name} ${place.featured ? " 🌟" : ""}`}
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
											className="px-2 pt-4 pb-3"
										>
											{isNotEmptyArray(place.category) ? (
												<InfoBox
													title="Categoría"
													icon={{ name: IconCatalog.TAG, color: "text-amber-600" }}
												>
													<Box className="flex flex-wrap gap-2">
														{place.category.map((category) => {
															return (
																<InlineText
																	key={generateSlug(`${place.name}-${category}`)}
																	className="inline-block rounded-md border border-zinc-300 bg-zinc-200 px-2 py-0.5 text-xs text-zinc-700"
																>
																	{category}
																</InlineText>
															);
														})}
													</Box>
												</InfoBox>
											) : null}

											{isNotEmptyString(place.price) ? (
												<InfoBox
													title="Precio"
													icon={{ name: IconCatalog.DOLLAR_SIGN, color: "text-green-600" }}
												>
													{place.price}
												</InfoBox>
											) : null}

											<InfoBox
												title="Links"
												icon={{ name: IconCatalog.LINK }}
											>
												<Box className="flex flex-wrap items-center gap-1">
													{isNotEmptyString(place.instagram) ? (
														<Link
															variant={Link.variant.SMOOTH}
															href={place.instagram}
															className="inline-block"
															onClick={AnalyticsService.trackClickEvent("BLOG|SPVEEQ|LINK", {
																place: place.id,
																link: "instagram",
															})}
															isExternalLink
														>
															<Icon
																icon={IconCatalog.INSTAGRAM}
																iconClassName="p-[3px]"
																size={32}
															/>
														</Link>
													) : null}

													{isNotEmptyString(place.maps) ? (
														<Link
															variant={Link.variant.SMOOTH}
															href={place.maps}
															className="inline-block"
															onClick={AnalyticsService.trackClickEvent("BLOG|SPVEEQ|LINK", {
																place: place.id,
																link: "maps",
															})}
															isExternalLink
														>
															<Icon
																icon={IconCatalog.MAPS}
																iconClassName="rounded-full p-[3px]"
																size={32}
															/>
														</Link>
													) : null}

													{isNotEmptyString(place.website) ? (
														<Link
															variant={Link.variant.SMOOTH}
															href={place.website}
															className="inline-block"
															onClick={AnalyticsService.trackClickEvent("BLOG|SPVEEQ|LINK", {
																place: place.id,
																link: "website",
															})}
															isExternalLink
														>
															<Icon
																icon={IconCatalog.GLOBE}
																size={32}
															/>
														</Link>
													) : null}

													{isNotEmptyArray(place.links) ? (
														<Box className="w-full px-0.5">
															{place.links.map((link) => {
																return (
																	<Link
																		key={link}
																		variant={Link.variant.SMOOTH}
																		href={link}
																		className="mb-1 flex flex-nowrap items-center last:mb-0"
																		onClick={AnalyticsService.trackClickEvent("BLOG|SPVEEQ|LINK", {
																			place: place.id,
																			link: "info",
																		})}
																		isExternalLink
																	>
																		<Icon
																			icon={IconCatalog.INFO}
																			size={28}
																		/>
																		<InlineText className="ml-1 flex-1 truncate align-middle">
																			{link
																				.replace("https://", "")
																				.replace("http://", "")
																				.replace("www.", "")}
																		</InlineText>
																	</Link>
																);
															})}
														</Box>
													) : null}
												</Box>
											</InfoBox>

											{place.description ? (
												<InfoBox
													title="Detalles"
													icon={{ name: IconCatalog.INFO, color: "text-blue-600" }}
												>
													{place.description}
												</InfoBox>
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
						</Box>
					</Box>
				);
			})}
		</Box>
	);
}

export default SPVEEQPlaces;

// --- COMPONENTS ---

type InfoBoxProps = {
	icon: { name: IconName; color?: string };
	title: string;
	children: DR.React.Children;
};

function InfoBox({ icon, title, children }: InfoBoxProps) {
	return (
		<Box className="mb-4 last:mb-0">
			<Box className="flex items-center">
				<Icon
					icon={icon.name}
					color={icon.color || ""}
					size={16}
				/>
				<InlineText
					as="strong"
					className="mr-1 ml-1"
				>
					{title}:
				</InlineText>
			</Box>
			<Box className="pl-5 text-base font-bold">{children}</Box>
		</Box>
	);
}
