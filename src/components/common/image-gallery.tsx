// TODO: [react] Fix me
/* eslint-disable react-hooks/refs */

import { useCallback, useEffect, useRef, useState } from "react";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { createArray } from "@diegofrayo-pkg/utilities/arrays-and-objects";
import { isMobileDevice } from "@diegofrayo-pkg/utilities/browser";
import { safeCastNumber } from "@diegofrayo-pkg/utilities/numbers";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";
import { isNumber, isString } from "@diegofrayo-pkg/validator";

import { Box, Button, Icon, Image } from "~/components/primitive";
import { IconCatalog } from "~/components/primitive/icon";

type ImageGalleryProps = {
	id: string;
	images: { url: string; alt: string }[];
	noBounds?: boolean;
	className?: string;
};

function ImageGallery({ id, images, noBounds, className }: ImageGalleryProps) {
	// --- STATE & REFS ---
	const [activeIndex, setActiveIndex] = useState(0);
	const { current: totalNumberOfImages } = useRef(images.length);
	const touchEventRef = useRef({ start: 0, end: 0 });
	const imagesContainerRef = useRef<HTMLDivElement>(null);

	// --- UTILS ---
	const changeActivePhoto = useCallback(
		function changeActivePhoto({
			dataIndex,
			dataDirection,
		}: {
			dataIndex?: number | null;
			dataDirection?: string | null;
		}) {
			if (isNumber(dataIndex)) {
				setActiveIndex(Number(dataIndex));
			} else if (isString(dataDirection)) {
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

	const checkSwipeDirection = useCallback(
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
	useEffect(
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
	function handleChangeImage(event: ReactTypes.Events.OnClickEvent<HTMLButtonElement>) {
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
		<Box
			className={cn(
				"relative overflow-hidden rounded-md border border-zinc-300 bg-white p-2",
				className,
			)}
		>
			<Box className="relative flex h-90 w-full max-w-full items-center justify-center overflow-hidden bg-black md:h-142">
				<Box
					className={cn(
						"absolute top-0 left-0 h-full w-full",
						totalNumberOfImages > 1 && "cursor-grab",
					)}
					ref={imagesContainerRef}
				/>

				{images.map((image, index) => {
					return (
						<Image
							key={image.url}
							src={image.url}
							alt={image.alt}
							className={cn("mx-auto max-h-full max-w-full", activeIndex !== index && "hidden")}
							loading={Math.abs(activeIndex - index) <= 1 ? "eager" : "lazy"}
							useNativeElement
						/>
					);
				})}
			</Box>

			<GalleryControls
				id={id}
				activeIndex={activeIndex}
				noBounds={noBounds}
				totalNumberOfImages={totalNumberOfImages}
				onClick={handleChangeImage}
			/>
		</Box>
	);
}

export default ImageGallery;

// --- COMPONENTS ---

type GalleryControlsProps = {
	activeIndex: number;
	id: string;
	noBounds: boolean | undefined;
	totalNumberOfImages: number;
	onClick: ReactTypes.Events.OnMouseEventHandler<HTMLButtonElement>;
};

function GalleryControls({
	activeIndex,
	id,
	noBounds,
	totalNumberOfImages,
	onClick,
}: GalleryControlsProps) {
	// --- STYLES ---
	const classes = {
		container: cn("mt-2 flex w-full items-center justify-between gap-3"),
		leftArrow: cn("flex w-8 items-center justify-start"),
		dots: cn("inline-flex h-8 items-center justify-center rounded-md bg-zinc-800 px-1"),
		rightArrow: cn("flex w-8 items-center justify-end"),
		dot: (index: number) =>
			cn(
				"mx-1 inline-block size-3 rounded-full leading-0",
				index === activeIndex ? "bg-zinc-200" : "bg-zinc-500",
			),
	};

	if (totalNumberOfImages <= 1) {
		return null;
	}

	return (
		<Box className={classes.container}>
			<Box className={classes.leftArrow}>
				<NavigationArrow
					direction="left"
					noBounds={noBounds}
					activeIndex={activeIndex}
					totalNumberOfImages={totalNumberOfImages}
					onClick={onClick}
				/>
			</Box>

			<Box className={classes.dots}>
				{createArray(totalNumberOfImages, 0).map((index) => {
					return (
						<Button
							key={generateSlug(`${id}-Button-${index}`)}
							className={classes.dot(index)}
							data-index={String(index)}
							onClick={onClick}
						/>
					);
				})}
			</Box>

			<Box className={classes.rightArrow}>
				<NavigationArrow
					direction="right"
					noBounds={noBounds}
					activeIndex={activeIndex}
					totalNumberOfImages={totalNumberOfImages}
					onClick={onClick}
				/>
			</Box>
		</Box>
	);
}

type NavigationArrowProps = {
	direction: "right" | "left";
	activeIndex: number;
	totalNumberOfImages: number;
	noBounds: boolean | undefined;
	onClick: ReactTypes.Events.OnMouseEventHandler<HTMLButtonElement>;
};

function NavigationArrow({
	direction,
	activeIndex,
	totalNumberOfImages,
	noBounds,
	onClick,
}: NavigationArrowProps) {
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
				icon={isRightDirection ? IconCatalog.CHEVRON_RIGHT : IconCatalog.CHEVRON_LEFT}
				color="text-black"
				wrapperClassName="relative"
				size={20}
			/>
		</Button>
	);
}
