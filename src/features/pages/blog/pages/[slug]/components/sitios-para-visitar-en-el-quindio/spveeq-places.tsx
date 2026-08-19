import type UtilsTypes from "@diegofrayo-pkg/types";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";
import { isEmptyArray, isNotEmptyArray, isNotEmptyString } from "@diegofrayo-pkg/validator";

import { BoxWithTitle, ImageGallery } from "~/components/common";
import { Box, Collapsible, Icon, InlineText, Link, Space, Title } from "~/components/primitive";
import { IconCatalog, type IconName } from "~/components/primitive/icon";
import AnalyticsService from "~/features/analytics";

type SPVEEQPlacesProps = {
	data: UtilsTypes.Object<
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

type Place = SPVEEQPlacesProps["data"][string][number];

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
											<PlaceCategoryInfo
												name={place.name}
												category={place.category}
											/>

											<PlacePriceInfo price={place.price} />

											<PlaceLinksInfo
												id={place.id}
												instagram={place.instagram}
												maps={place.maps}
												website={place.website}
												links={place.links}
											/>

											<PlaceDetailsInfo description={place.description} />
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
	children: ReactTypes.Children;
};

function InfoBox({ icon, title, children }: InfoBoxProps) {
	return (
		<Box className="mb-4 last:mb-0">
			<Box className="flex items-center">
				<Icon
					name={icon.name}
					className={icon.color}
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

function PlaceCategoryInfo({ name, category }: Pick<Place, "name" | "category">) {
	if (isEmptyArray(category)) return null;

	return (
		<InfoBox
			title="Categoría"
			icon={{ name: IconCatalog.TAG, color: "text-amber-600" }}
		>
			<Box className="flex flex-wrap gap-2">
				{category.map((cat) => {
					return (
						<InlineText
							key={generateSlug(`${name}-${cat}`)}
							className="inline-block rounded-md border border-zinc-300 bg-zinc-200 px-2 py-0.5 text-xs text-zinc-700"
						>
							{cat}
						</InlineText>
					);
				})}
			</Box>
		</InfoBox>
	);
}

function PlacePriceInfo({ price }: Pick<Place, "price">) {
	if (!price) return null;

	return (
		<InfoBox
			title="Precio"
			icon={{ name: IconCatalog.DOLLAR_SIGN, color: "text-green-600" }}
		>
			{price}
		</InfoBox>
	);
}

function PlaceLinksInfo({
	id,
	instagram,
	maps,
	website,
	links,
}: Pick<Place, "id" | "instagram" | "maps" | "website" | "links">) {
	return (
		<InfoBox
			title="Links"
			icon={{ name: IconCatalog.LINK }}
		>
			<Box className="flex flex-wrap items-center gap-1">
				{isNotEmptyString(instagram) ? (
					<Link
						variant={Link.variant.SMOOTH}
						href={instagram}
						className="inline-block"
						onClick={AnalyticsService.trackClickEvent("BLOG|SPVEEQ|LINK", {
							place: id,
							link: "instagram",
						})}
						isExternalLink
					>
						<Icon
							name={IconCatalog.INSTAGRAM}
							className="p-0.75"
							size={32}
						/>
					</Link>
				) : null}

				{isNotEmptyString(maps) ? (
					<Link
						variant={Link.variant.SMOOTH}
						href={maps}
						className="inline-block"
						onClick={AnalyticsService.trackClickEvent("BLOG|SPVEEQ|LINK", {
							place: id,
							link: "maps",
						})}
						isExternalLink
					>
						<Icon
							name={IconCatalog.MAPS}
							className="rounded-full p-0.75"
							size={32}
						/>
					</Link>
				) : null}

				{isNotEmptyString(website) ? (
					<Link
						variant={Link.variant.SMOOTH}
						href={website}
						className="inline-block"
						onClick={AnalyticsService.trackClickEvent("BLOG|SPVEEQ|LINK", {
							place: id,
							link: "website",
						})}
						isExternalLink
					>
						<Icon
							name={IconCatalog.GLOBE}
							size={32}
						/>
					</Link>
				) : null}

				{isNotEmptyArray(links) ? (
					<Box className="w-full px-0.5">
						{links.map((link) => {
							return (
								<Link
									key={link}
									variant={Link.variant.SMOOTH}
									href={link}
									className="mb-1 flex flex-nowrap items-center last:mb-0"
									onClick={AnalyticsService.trackClickEvent("BLOG|SPVEEQ|LINK", {
										place: id,
										link: "info",
									})}
									isExternalLink
								>
									<Icon
										name={IconCatalog.INFO}
										size={28}
									/>
									<InlineText className="ml-1 flex-1 truncate align-middle">
										{link.replace("https://", "").replace("http://", "").replace("www.", "")}
									</InlineText>
								</Link>
							);
						})}
					</Box>
				) : null}
			</Box>
		</InfoBox>
	);
}

function PlaceDetailsInfo({ description }: Pick<Place, "description">) {
	if (!description) return null;

	return (
		<InfoBox
			title="Detalles"
			icon={{ name: IconCatalog.INFO, color: "text-blue-600" }}
		>
			{description}
		</InfoBox>
	);
}
