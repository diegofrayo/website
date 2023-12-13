import * as React from "react";
import cn from "classnames";

import { Block, Button, Icon, Image } from "~/components/primitive";
import type DR from "@diegofrayo/types";
import { createArray } from "@diegofrayo/utils/arrays-and-objects";
import { isMobileDevice } from "@diegofrayo/utils/browser";
import { safeCastNumber } from "@diegofrayo/utils/numbers";
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

type T_ImageGalleryProps = {
	id: string;
	images: { url: string; alt: string }[];
	noBounds?: boolean;
	className?: string;
};

function ImageGallery({ id, images, noBounds, className }: T_ImageGalleryProps) {
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
		[setActiveIndex, totalNumberOfImages, noBounds],
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

	if (totalNumberOfImages === 0) {
		return null;
	}

	return (
		<Block className={cn("tw-relative tw-overflow-hidden tw-bg-white tw-p-2 tw-pb-3", className)}>
			<Block className="tw-relative tw-flex tw-h-[360px] tw-w-full tw-max-w-full tw-items-center tw-justify-center tw-overflow-hidden tw-bg-black md:tw-h-[570px]">
				<Block
					className={cn(
						"tw-absolute tw-left-0 tw-top-0 tw-h-full tw-w-full",
						totalNumberOfImages > 1 && "tw-cursor-grab",
					)}
					ref={imagesContainerRef}
				/>

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

			{totalNumberOfImages > 1 ? (
				<Block className="tw-mt-2 tw-flex tw-w-full tw-justify-between tw-gap-3 tw-text-center">
					<Block className="tw-flex tw-w-8 tw-items-center tw-justify-start">
						<NavigationArrow
							direction="left"
							noBounds={noBounds}
							activeIndex={activeIndex}
							totalNumberOfImages={totalNumberOfImages}
							onClick={handleChangeImage}
						/>
					</Block>

					<Block className="tw-inline-block tw-items-center tw-justify-center tw-rounded-md tw-bg-black/80 tw-px-1 tw-py-0.5">
						{createArray(totalNumberOfImages, 0).map((index) => {
							return (
								<Button
									key={generateSlug(`${id}-Button-${index}`)}
									className={cn(
										"tw-mx-1 tw-inline-block tw-rounded-full tw-border-0 tw-leading-0 dr-border-color-surface-600 tw-wh-2",
										index === activeIndex
											? "tw-bg-white/80 tw-wh-3"
											: "tw-relative tw--top-0.5 tw-bg-white/20",
									)}
									data-index={String(index)}
									onClick={handleChangeImage}
								/>
							);
						})}
					</Block>

					<Block className="tw-flex tw-w-8 tw-items-center tw-justify-end">
						<NavigationArrow
							direction="right"
							noBounds={noBounds}
							activeIndex={activeIndex}
							totalNumberOfImages={totalNumberOfImages}
							onClick={handleChangeImage}
						/>
					</Block>
				</Block>
			) : null}
		</Block>
	);
}

export default ImageGallery;

// --- COMPONENTS ---

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
		<Button
			data-direction={direction}
			onClick={onClick}
		>
			<Icon
				icon={isRightDirection ? Icon.icon.CHEVRON_RIGHT : Icon.icon.CHEVRON_LEFT}
				color="tw-text-black"
				wrapperClassName="tw-relative"
				size={20}
			/>
		</Button>
	);
}
