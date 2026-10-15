import { useEffect, useRef, useState } from "react";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { createArray } from "@diegofrayo-pkg/utilities/arrays-and-objects";
import { isMobileDevice } from "@diegofrayo-pkg/utilities/browser/device";
import { safeCastNumber } from "@diegofrayo-pkg/utilities/numbers";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";
import { isNumber, isString } from "@diegofrayo-pkg/validator";

import { Box, Button, Icon, Image } from "~/components/primitive";
import { IconCatalog } from "~/components/primitive/icon";

type ImageGalleryProps = {
	id: string;
	images: { url: string; alt: string }[];

	className?: string;
	noBounds?: boolean;
};

function ImageGallery({
	id,
	images,
	className,
	noBounds,
}: ImageGalleryProps): ReactTypes.JSXElementNullable {
	// --- STATES & REFS ---
	const [activeIndex, setActiveIndex] = useState(0);
	const touchEventRef = useRef<TouchEventPositions>({ start: 0, end: 0 });
	const imagesContainerRef = useRef<HTMLDivElement>(null);

	// --- COMPUTED STATES ---
	const totalNumberOfImages = images.length;
	const hasMultipleImages = totalNumberOfImages > 1;

	// --- STYLES ---
	const classes = {
		container: cn("relative overflow-hidden rounded-md border border-zinc-300 bg-white p-2", className),
		viewport: cn(
			"relative flex h-90 w-full max-w-full items-center justify-center overflow-hidden bg-black md:h-142",
		),
		swipeArea: cn("absolute top-0 left-0 h-full w-full", hasMultipleImages && "cursor-grab"),
		image: (index: number): string =>
			cn("mx-auto max-h-full max-w-full", activeIndex !== index && "hidden"),
	};

	// --- HANDLERS ---
	function handleControlClick(event: ReactTypes.Events.OnClickEvent<HTMLButtonElement>): void {
		changeActivePhoto({
			dataIndex: safeCastNumber(event.currentTarget.getAttribute("data-index"), null),
			dataDirection: event.currentTarget.getAttribute("data-direction"),
		});
	}

	// --- UTILS ---
	function changeActivePhoto({ dataIndex, dataDirection }: ChangeActivePhotoParams): void {
		if (isNumber(dataIndex)) {
			setActiveIndex(dataIndex);
			return;
		}

		if (isString(dataDirection)) {
			setActiveIndex(
				createIndexUpdater({
					isRightDirection: dataDirection === "right",
					noBounds: Boolean(noBounds),
					totalNumberOfImages,
				}),
			);
			return;
		}

		throw new Error(`Invalid params: ${JSON.stringify({ dataIndex, dataDirection })}`);
	}

	// --- EFFECTS ---
	useEffect(
		function attachTouchEvents() {
			const { current: imagesContainer } = imagesContainerRef;

			if (!imagesContainer) {
				return (): undefined => undefined;
			}

			function handleTouchStart(event: TouchEvent): void {
				const [touch] = event.changedTouches;
				if (!touch) return;

				touchEventRef.current.start = touch.screenX;
			}

			function handleTouchEnd(event: TouchEvent): void {
				const [touch] = event.changedTouches;
				if (!touch) return;

				touchEventRef.current.end = touch.screenX;
				checkSwipeDirection(touchEventRef.current);
			}

			function handleMouseDown(event: MouseEvent): void {
				touchEventRef.current.start = event.clientX;
			}

			function handleMouseUp(event: MouseEvent): void {
				touchEventRef.current.end = event.clientX;
				checkSwipeDirection(touchEventRef.current);
			}

			function checkSwipeDirection({ start, end }: TouchEventPositions): void {
				const isSwipe = Math.abs(start - end) > 15;
				if (!isSwipe) return;

				setActiveIndex(
					createIndexUpdater({
						isRightDirection: end < start,
						noBounds: Boolean(noBounds),
						totalNumberOfImages,
					}),
				);
			}

			const isMobile = isMobileDevice();

			if (isMobile) {
				imagesContainer.addEventListener("touchstart", handleTouchStart);
				imagesContainer.addEventListener("touchend", handleTouchEnd);
			} else {
				imagesContainer.addEventListener("mousedown", handleMouseDown);
				imagesContainer.addEventListener("mouseup", handleMouseUp);
			}

			return function detachTouchEvents(): void {
				if (isMobile) {
					imagesContainer.removeEventListener("touchstart", handleTouchStart);
					imagesContainer.removeEventListener("touchend", handleTouchEnd);
				} else {
					imagesContainer.removeEventListener("mousedown", handleMouseDown);
					imagesContainer.removeEventListener("mouseup", handleMouseUp);
				}
			};
		},
		[noBounds, totalNumberOfImages],
	);

	if (totalNumberOfImages === 0) {
		return null;
	}

	return (
		<Box className={classes.container}>
			<Box className={classes.viewport}>
				<Box
					className={classes.swipeArea}
					ref={imagesContainerRef}
				/>

				{images.map((image, index) => {
					return (
						<Image
							key={image.url}
							src={image.url}
							alt={image.alt}
							className={classes.image(index)}
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
				onClick={handleControlClick}
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
}: GalleryControlsProps): ReactTypes.JSXElementNullable {
	// --- STYLES ---
	const classes = {
		container: cn("mt-2 flex w-full items-center justify-between gap-3"),
		leftArrow: cn("flex w-8 items-center justify-start"),
		dots: cn("inline-flex h-8 items-center justify-center rounded-md bg-zinc-800 px-1"),
		rightArrow: cn("flex w-8 items-center justify-end"),
		dot: (index: number): string =>
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
					activeIndex={activeIndex}
					direction="left"
					noBounds={noBounds}
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
					activeIndex={activeIndex}
					direction="right"
					noBounds={noBounds}
					totalNumberOfImages={totalNumberOfImages}
					onClick={onClick}
				/>
			</Box>
		</Box>
	);
}

type NavigationArrowProps = {
	activeIndex: number;
	direction: "right" | "left";
	noBounds: boolean | undefined;
	totalNumberOfImages: number;

	onClick: ReactTypes.Events.OnMouseEventHandler<HTMLButtonElement>;
};

function NavigationArrow({
	activeIndex,
	direction,
	noBounds,
	totalNumberOfImages,
	onClick,
}: NavigationArrowProps): ReactTypes.JSXElementNullable {
	// --- COMPUTED STATES ---
	const isRightDirection = direction === "right";
	const isFirstIndex = activeIndex === 0;
	const isLastIndex = activeIndex === totalNumberOfImages - 1;
	const isAtBoundary = (isLastIndex && isRightDirection) || (isFirstIndex && !isRightDirection);
	const iconName = isRightDirection ? IconCatalog.CHEVRON_RIGHT : IconCatalog.CHEVRON_LEFT;

	// --- STYLES ---
	const classes = {
		icon: cn("text-black"),
	};

	if (!noBounds && isAtBoundary) {
		return null;
	}

	return (
		<Button
			data-direction={direction}
			onClick={onClick}
		>
			<Icon
				name={iconName}
				className={classes.icon}
				size={20}
			/>
		</Button>
	);
}

// --- UTILS ---

type CreateIndexUpdaterParams = {
	isRightDirection: boolean;
	noBounds: boolean;
	totalNumberOfImages: number;
};

function createIndexUpdater({
	isRightDirection,
	noBounds,
	totalNumberOfImages,
}: CreateIndexUpdaterParams): (currentIndex: number) => number {
	return function getNextIndex(currentIndex) {
		const newIndex = isRightDirection ? currentIndex + 1 : currentIndex - 1;

		if (newIndex < 0) {
			return noBounds ? totalNumberOfImages - 1 : 0;
		}

		if (newIndex === totalNumberOfImages) {
			return noBounds ? 0 : currentIndex;
		}

		return newIndex;
	};
}

// --- TYPES ---

type TouchEventPositions = { start: number; end: number };

type ChangeActivePhotoParams = {
	dataDirection?: string | null;
	dataIndex?: number | null;
};
