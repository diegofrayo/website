import * as React from "react";
import cn from "classnames";

import {
	Block,
	Button,
	Collapsible,
	Icon,
	Image,
	InlineText,
	Link,
	Space,
} from "~/components/primitive";
import { type T_IconName } from "~/components/primitive/Icon";
import { BoxWithTitle } from "~/components/shared";
import { useDidMount } from "~/hooks";
import type DR from "@diegofrayo/types";
import { createArray } from "@diegofrayo/utils/arrays-and-objects";
import { isMobileDevice } from "@diegofrayo/utils/browser";
import { safeCastNumber } from "@diegofrayo/utils/numbers";
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

type T_SPVEEQPlacesProps = {
	data: T_Place[];
};

function SPVEEQPlaces({ data: places }: T_SPVEEQPlacesProps) {
	useDidMount(() => {
		function generateImagesArray() {
			const data = { id: "", name: "" };

			if (!data.id || !data.name) return;

			console.log(
				createArray(10)
					.map((i) => {
						return JSON.stringify({
							url: `/assets/images/pages/blog/posts/assets/sitios-para-visitar-en-el-quindio/${data.id}/${i}.jpg`,
							alt: data.name,
						});
					})
					.join(","),
			);
		}

		generateImagesArray();
	});

	return (
		<Block>
			{places.map((place) => {
				if (!place.published) {
					return null;
				}

				return (
					<Collapsible
						key={place.id}
						className="tw-mb-4 last:tw-mb-0"
						contentClassName="tw-pt-6"
						title={`${place.name} [${place.location}]`}
					>
						<BoxWithTitle
							title="Información"
							className="tw-px-2 tw-py-4"
						>
							{v.isNotEmptyString(place.category) ? (
								<InfoBlock
									title="Categoría"
									icon={{ name: Icon.icon.TAG, color: "tw-text-yellow-600" }}
								>
									{place.category}
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
								icon={{ name: Icon.icon.INFO, color: "tw-text-cyan-600" }}
							>
								<Block className="tw-flex tw-items-center tw-gap-2">
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
											<Icon
												icon={Icon.icon.MAPS}
												iconClassName="tw-rounded-full"
											/>
										</Link>
									) : null}

									{v.isNotEmptyString(place.website) ? (
										<Link
											variant={Link.variant.SIMPLE}
											href={place.website}
											className="tw-inline-block"
											isExternalLink
										>
											<Icon icon={Icon.icon.WEBSITE} />
										</Link>
									) : null}

									{v.isNotEmptyArray(place.links)
										? place.links.map((link) => {
												return (
													<Link
														key={link}
														variant={Link.variant.SIMPLE}
														href={link}
														className="tw-relative tw-inline-flex tw-h-[24px] tw-w-[24px] tw-items-center tw-justify-center tw-rounded-full tw-border dr-bg-color-surface-200 dr-border-color-surface-300"
														isExternalLink
													>
														<Icon
															icon={Icon.icon.LINK}
															size={16}
														/>
														<Icon
															icon={Icon.icon.INFO}
															size={10}
															color="tw-text-white"
															wrapperClassName="tw-absolute tw--bottom-0.5 tw--right-0.5"
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
	);
}

export default SPVEEQPlaces;

// --- COMPONENTS ---

type T_ImageGalleryProps = Pick<T_Place, "images" | "id"> & { noBounds?: boolean };

function ImageGallery({ id, images, noBounds }: T_ImageGalleryProps) {
	// --- STATES & REFS ---
	const [activeIndex, setActiveIndex] = React.useState(0);
	const { current: totalNumberOfImages } = React.useRef(images.length);
	const touchEventRef = React.useRef({ start: 0, end: 0 });
	const imagesContainerRef = React.useRef<HTMLDivElement>(null);

	// --- UTILS ---
	const changeActivePhoto = React.useCallback(
		function changeActivePhoto({
			dataIndex,
			dataDirection,
		}: {
			dataIndex?: number | null;
			dataDirection?: string | null;
		}) {
			if (v.isNumber(dataIndex)) {
				setActiveIndex(Number(dataIndex));
			} else if (v.isString(dataDirection)) {
				const isRightDirection = dataDirection === "right";

				setActiveIndex((currentIndex) => {
					const newIndex = isRightDirection ? currentIndex + 1 : currentIndex - 1;

					if (noBounds) {
						return newIndex < 0
							? totalNumberOfImages - 1
							: newIndex === totalNumberOfImages
							? 0
							: newIndex;
					}

					return newIndex < 0 ? 0 : newIndex === totalNumberOfImages ? currentIndex : newIndex;
				});
			} else {
				throw new Error(`Invalid params: ${{ dataIndex, dataDirection }}`);
			}
		},
		[setActiveIndex, totalNumberOfImages],
	);

	const checkSwipeDirection = React.useCallback(
		function checkSwipeDirection({ start, end }: typeof touchEventRef.current) {
			const diff = Math.abs(start - end);

			if (diff > 15) {
				if (end < start) {
					changeActivePhoto({ dataDirection: "right" });
				} else if (end > start) {
					changeActivePhoto({ dataDirection: "left" });
				}
			}
		},
		[changeActivePhoto],
	);

	// --- EFFECTS ---
	React.useEffect(
		function attachTouchEvents() {
			const { current: imagesContainer } = imagesContainerRef;

			if (!imagesContainer) {
				return () => undefined;
			}

			function onTouchStart(event: TouchEvent) {
				touchEventRef.current.start = event.changedTouches[0].screenX;
			}

			function onTouchEnd(event: TouchEvent) {
				touchEventRef.current.end = event.changedTouches[0].screenX;
				checkSwipeDirection(touchEventRef.current);
			}

			function onClickStart(event: MouseEvent) {
				touchEventRef.current.start = event.clientX;
			}

			function onClickEnd(event: MouseEvent) {
				touchEventRef.current.end = event.clientX;
				checkSwipeDirection(touchEventRef.current);
			}

			if (isMobileDevice()) {
				imagesContainer.addEventListener("touchstart", onTouchStart);
				imagesContainer.addEventListener("touchend", onTouchEnd);
			} else {
				imagesContainer.addEventListener("mousedown", onClickStart);
				imagesContainer.addEventListener("mouseup", onClickEnd);
			}

			return function dettachTouchEvents() {
				if (isMobileDevice()) {
					imagesContainer.removeEventListener("touchstart", onTouchStart);
					imagesContainer.removeEventListener("touchend", onTouchEnd);
				} else {
					imagesContainer.removeEventListener("mousedown", onClickStart);
					imagesContainer.removeEventListener("mouseup", onClickEnd);
				}
			};
		},
		[imagesContainerRef, checkSwipeDirection],
	);

	// --- HANDLERS ---
	function handleChangeImage(event: DR.React.Events.OnClickEvent<HTMLButtonElement>) {
		const dataIndex = safeCastNumber(event.currentTarget.getAttribute("data-index"), null);

		changeActivePhoto({
			dataIndex,
			dataDirection: event.currentTarget.getAttribute("data-direction"),
		});
	}

	if (images.length === 0) {
		return null;
	}

	return (
		<Block className="tw-relative tw-overflow-hidden tw-bg-white tw-p-2 tw-pb-3">
			<Block className="tw-relative tw-flex tw-h-[360px] tw-w-full tw-max-w-full tw-items-center tw-justify-center tw-overflow-hidden tw-bg-black md:tw-h-[570px]">
				<Block
					className="tw-absolute tw-left-0 tw-top-0 tw-h-full tw-w-full tw-cursor-grab"
					ref={imagesContainerRef}
				>
					<NavigationArrow
						direction="left"
						noBounds={noBounds}
						activeIndex={activeIndex}
						totalNumberOfImages={images.length}
						onClick={handleChangeImage}
					/>
					<NavigationArrow
						direction="right"
						noBounds={noBounds}
						activeIndex={activeIndex}
						totalNumberOfImages={images.length}
						onClick={handleChangeImage}
					/>
				</Block>

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
							loading={Math.abs(activeIndex - index) <= 1 ? "eager" : "lazy"}
							useNativeImage
						/>
					);
				})}
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

type T_NavigationArrowProps = {
	direction: "right" | "left";
	activeIndex: number;
	totalNumberOfImages: number;
	noBounds: boolean | undefined;
	onClick: DR.React.Events.OnMouseEventHandler<HTMLButtonElement>;
};

function NavigationArrow({
	direction,
	activeIndex,
	totalNumberOfImages,
	noBounds,
	onClick,
}: T_NavigationArrowProps) {
	const isFirstIndex = activeIndex === 0;
	const isLastIndex = activeIndex === totalNumberOfImages - 1;
	const isRightDirection = direction === "right";

	if (!noBounds && ((isLastIndex && isRightDirection) || (isFirstIndex && !isRightDirection))) {
		return null;
	}

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

type T_InfoBlockProps = {
	icon: { name: T_IconName; color: string };
	title: string;
	children: DR.React.Children;
};

function InfoBlock({ icon, title, children }: T_InfoBlockProps) {
	return (
		<Block className="tw-mb-4 last:tw-mb-0">
			<Block className="tw-mb-1 tw-flex tw-items-center">
				<Icon
					icon={icon.name}
					color={icon.color}
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

// --- TYPES ---

type T_Place = {
	id: string;
	name: string;
	maps: string;
	instagram: string;
	location: string;
	category: string;
	price: string;
	website: string;
	description: string;
	links: string[];
	published: boolean;
	images: { url: string; alt: string }[];
};
