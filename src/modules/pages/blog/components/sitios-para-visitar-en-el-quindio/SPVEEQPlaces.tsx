import * as React from "react";
import cn from "classnames";

import { Block, Button, Collapsible, Icon, Image, Link, Space, Text } from "~/components/primitive";
import { BoxWithTitle } from "~/components/shared";
import type DR from "@diegofrayo/types";
import { createArray } from "@diegofrayo/utils/arrays-and-objects";
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

type T_SPVEEQPlacesProps = {
	data: T_Place[];
};

type T_Place = {
	id: string;
	name: string;
	maps: string;
	instagram: string;
	location: string;
	website: string;
	description: string;
	links: string[];
	images: { url: string; alt: string }[];
};

function SPVEEQPlaces({ data: places }: T_SPVEEQPlacesProps) {
	return (
		<Block>
			{places.map((place) => {
				return (
					<Collapsible
						key={place.id}
						className="tw-mb-4 last:tw-mb-0"
						contentClassName="tw-pt-2"
						title={`${place.name} [${place.location}]`}
					>
						<BoxWithTitle
							title="Links"
							className="tw-flex tw-gap-2 tw-px-2 tw-py-4"
						>
							{v.isNotEmptyString(place.instagram) ? (
								<Link
									variant={Link.variant.SIMPLE}
									href={place.instagram}
									className="tw-inline-block"
									isExternalLink
								>
									<Icon icon={Icon.icon.INSTAGRAM} />
								</Link>
							) : null}
							{v.isNotEmptyString(place.maps) ? (
								<Link
									variant={Link.variant.SIMPLE}
									href={place.maps}
									className="tw-inline-block"
									isExternalLink
								>
									<Icon icon={Icon.icon.MAPS} />
								</Link>
							) : null}
							{v.isNotEmptyString(place.website) ? (
								<Link
									variant={Link.variant.SIMPLE}
									href={place.website}
									className="tw-inline-block"
									isExternalLink
								>
									<Icon
										icon={Icon.icon.WEBSITE}
										size={28}
									/>
								</Link>
							) : null}
							{v.isNotEmptyArray(place.links) ? (
								<Block className="tw-flex tw-gap-2">
									{place.links.map((link) => {
										return (
											<Link
												key={link}
												variant={Link.variant.SIMPLE}
												href={link}
												className="tw-relative tw-inline-block"
												isExternalLink
											>
												<Icon
													icon={Icon.icon.LINK}
													size={20}
												/>
												<Icon
													icon={Icon.icon.EXTERNAL_LINK}
													size={10}
													wrapperClassName="tw-absolute tw-bottom-0 tw--right-0.5"
												/>
											</Link>
										);
									})}
								</Block>
							) : null}
						</BoxWithTitle>
						<Space size={2} />

						<Block>
							<Text>
								<Text className="tw-font-bold">Info:</Text>
								{place.description || "..."}
							</Text>
						</Block>
						<Space size={2} />

						<ImageGallery
							id={place.id}
							images={place.images}
						/>
					</Collapsible>
				);
			})}
		</Block>
	);
}

export default SPVEEQPlaces;

// --- COMPONENTS ---

function ImageGallery({ id, images }: Pick<T_Place, "images" | "id">) {
	// --- STATES & REFS ---
	const [activeIndex, setActiveIndex] = React.useState(0);
	const totalNumberOfImages = images.length;

	// --- HANDLERS ---
	function handleChangeImage(event: DR.React.Events.OnClickEvent<HTMLButtonElement>) {
		const dataIndex = event.currentTarget.getAttribute("data-index");

		if (dataIndex !== null) {
			setActiveIndex(Number(dataIndex));
		} else {
			const isRightDirection = event.currentTarget.getAttribute("data-direction") === "right";

			setActiveIndex((currentIndex) => {
				const newIndex = isRightDirection ? currentIndex + 1 : currentIndex - 1;

				return newIndex < 0
					? totalNumberOfImages - 1
					: newIndex === totalNumberOfImages
					? 0
					: newIndex;
			});
		}
	}

	if (images.length === 0) {
		return null;
	}

	return (
		<Block className="tw-relative tw-inline-block tw-bg-white tw-p-2 tw-pb-3">
			<Block className="tw-relative">
				<NavigationArrow
					direction="left"
					onClick={handleChangeImage}
				/>

				<Block className="tw-flex tw-max-h-72 tw-max-w-full tw-items-center tw-justify-center tw-bg-black tw-wh-72">
					{images.map((image, index) => {
						return (
							<Image
								key={image.url}
								src={image.url}
								alt={image.alt}
								className={cn(
									"tw-mx-auto tw-max-h-full tw-max-w-full",
									activeIndex !== index && "tw-hidden",
								)}
								useNativeImage
							/>
						);
					})}
				</Block>

				<NavigationArrow
					direction="right"
					onClick={handleChangeImage}
				/>
			</Block>

			<Block className="tw-mt-2 tw-w-full tw-text-center">
				<Block className="tw-inline-flex tw-h-6 tw-items-center tw-justify-center tw-rounded-md tw-bg-black/80 tw-p-1">
					{createArray(images.length, 0).map((index) => {
						return (
							<Button
								key={generateSlug(`${id}-Button-${index}`)}
								className={cn(
									"tw-mx-1 tw-inline-block tw-rounded-full tw-border-0 tw-leading-0 dr-border-color-surface-600 tw-wh-2",
									index === activeIndex ? "tw-bg-white/80" : "tw-bg-white/20",
								)}
								data-index={String(index)}
								onClick={handleChangeImage}
							/>
						);
					})}
				</Block>
			</Block>
		</Block>
	);
}

function NavigationArrow({
	direction,
	onClick,
}: {
	direction: "right" | "left";
	onClick: DR.React.Events.OnMouseEventHandler<HTMLButtonElement>;
}) {
	const isRightDirection = direction === "right";

	return (
		<Block
			className={cn(
				"tw-absolute tw-top-0 tw-mx-2 tw-flex tw-h-full tw-items-center tw-justify-center",
				isRightDirection ? "tw-right-0" : "tw-left-0",
			)}
		>
			<Button
				className="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-black/80 tw-wh-6"
				data-direction={direction}
				onClick={onClick}
			>
				<Icon
					icon={isRightDirection ? Icon.icon.CHEVRON_RIGHT : Icon.icon.CHEVRON_LEFT}
					color="tw-text-white"
					wrapperClassName="tw-relative"
					size={12}
				/>
			</Button>
		</Block>
	);
}
