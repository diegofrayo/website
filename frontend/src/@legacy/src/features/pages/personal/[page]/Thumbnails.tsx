import * as React from "react";

import {
	Input,
	Block,
	Title,
	Image,
	InlineText,
	Space,
	Button,
} from "~/@legacy/src/components/primitive";
import { Emoji } from "~/@legacy/src/components/shared";
import v from "~/@legacy/src/lib/v";
import { downloadComponentAsImage } from "~/@legacy/src/utils/browser";
import { generateSlug } from "~/@legacy/src/utils/strings";
import type {
	T_ReactElement,
	T_ReactOnChangeEventHandler,
	T_ReactOnClickEventHandler,
	T_ReactRef,
} from "~/@legacy/src/types";

function Thumbnails(): T_ReactElement {
	const {
		// states & refs
		title,
		src,
		thumbnailRef,

		// handlers
		onChangeHandler,
		handleDownloadAsImageClick,
	} = useController();

	return (
		<Block>
			<Block>
				<Input
					componentProps={{ label: "Title" }}
					id="input-title"
					type="text"
					value={title}
					onChange={onChangeHandler("title")}
				/>
				<Space size={2} />
				<Input
					componentProps={{ label: "Thumbnail url" }}
					id="input-thumbnail"
					type="text"
					value={src}
					onChange={onChangeHandler("src")}
				/>
			</Block>
			<Space size={8} />

			<Block className="tw-mx-auto tw-max-w-xl tw-text-center">
				<Thumbnail
					src={src}
					title={title}
					thumbnailRef={thumbnailRef}
				/>
				<Space size={1} />
				<Button
					variant={Button.variant.DEFAULT}
					onClick={handleDownloadAsImageClick}
				>
					<Emoji className="tw-mr-2">⬇️</Emoji>
					<InlineText>descargar como imagen</InlineText>
				</Button>
			</Block>
		</Block>
	);
}

export default Thumbnails;

// --- Controller ---

type T_UseControllerReturn = {
	title: string;
	src: string;
	thumbnailRef: T_ReactRef<HTMLDivElement>;
	onChangeHandler: (inputName: "src" | "title") => T_ReactOnChangeEventHandler<HTMLInputElement>;
	handleDownloadAsImageClick: T_ReactOnClickEventHandler<HTMLButtonElement>;
};

function useController(): T_UseControllerReturn {
	// vars
	const BLOG_POSTS = [
		{
			slug: "javascript-arrays-examples",
			title: "JavaScript arrays examples",
			image: 2,
		},
		{
			slug: "typescript-snippets",
			title: "TypeScript snippets",
			image: 1,
		},
		{
			slug: "connecting-a-firebase-project-with-a-go-daddy-domain",
			title: "Connecting a Firebase project with a Go Daddy domain",
			image: 2,
		},
		{
			slug: "my-favorite-music-and-mdx",
			title: "My favorite music and MDX",
			image: 1,
		},
		{
			slug: "publishing-a-npm-private-package-to-github-packages-using-github-actions",
			title: "Publishing a npm private package to GitHub pakages using GitHub actions",
			image: 2,
		},
	];
	const CURRENT_BLOG_POST = BLOG_POSTS[0];

	// states & refs
	const [title, setTitle] = React.useState(CURRENT_BLOG_POST.title);
	const [src, setSrc] = React.useState(
		`/static/images/pages/personal/thumbnails/code-${CURRENT_BLOG_POST.image}.png`,
	);
	const thumbnailRef = React.useRef<HTMLDivElement>(null);

	// handlers
	const onChangeHandler: T_UseControllerReturn["onChangeHandler"] = function onChangeHandler(
		inputName,
	) {
		return (event) => {
			const { value } = event.currentTarget;

			if (inputName === "title") {
				setTitle(value);
			} else {
				setSrc(value);
			}
		};
	};

	const handleDownloadAsImageClick: T_UseControllerReturn["handleDownloadAsImageClick"] =
		async function handleDownloadAsImageClick() {
			if (v.isNull(thumbnailRef.current)) {
				return;
			}

			await downloadComponentAsImage(thumbnailRef.current, generateSlug(title));
		};

	return {
		// states & refs
		title,
		src,
		thumbnailRef,

		// handlers
		onChangeHandler,
		handleDownloadAsImageClick,
	};
}

// --- Components ---

type T_ThumbnailProps = Pick<T_UseControllerReturn, "title" | "src" | "thumbnailRef">;

function Thumbnail({ title, src, thumbnailRef }: T_ThumbnailProps): T_ReactElement {
	return (
		<Block
			className="tw-relative tw-mx-auto tw-flex tw-h-80 tw-flex-col tw-items-center tw-justify-center tw-overflow-auto tw-bg-gradient-to-b tw-from-black tw-to-gray-800 tw-px-4 tw-py-16"
			ref={thumbnailRef}
		>
			<Image
				src={src}
				alt="Blog post thumbnail"
				width={96}
				height={96}
				useNextImage={false}
			/>
			<Title
				is="h1"
				variant={Title.variant.UNSTYLED}
				className="tw-mt-2 tw-max-w-xs tw-text-center tw-font-sans tw-font-thin tw-uppercase tw-text-gray-200"
			>
				{title}
			</Title>
			<InlineText className="tw-absolute tw-bottom-1 tw-right-2 tw-text-right tw-font-mono tw-text-xs tw-font-bold tw-italic tw-text-gray-400">
				diegofrayo.vercel.app
			</InlineText>
		</Block>
	);
}