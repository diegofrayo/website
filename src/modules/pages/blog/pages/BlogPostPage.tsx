import * as React from "react";
import cn from "classnames";
import dynamic from "next/dynamic";

import { MainLayout, Page } from "~/components/layout";
import {
	Block,
	Button,
	Icon,
	InlineText,
	Link,
	List,
	Space,
	Text,
	Title,
} from "~/components/primitive";
import {
	Callout,
	CopyToClipboardPopover,
	ImageWithLink,
	Toast,
	Tooltip,
} from "~/components/shared";
import WEBSITE_METADATA from "~/data/metadata.json";
import { withOnlyClientRender } from "~/hocs";
import AnalyticsService from "~/modules/analytics";
import { MDXContent, getMDXExport } from "~/modules/mdx/client";
import { ROUTES } from "~/modules/routing";
import twcss from "@diegofrayo/twcss";
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";
import { useLocalStorageState } from "@diegofrayo/storage";
import type DR from "@diegofrayo/types";

import { BlogPostCategory } from "../components";
import type { T_BlogPost } from "../types";

export type T_BlogPostPageProps = {
	postDetails: T_BlogPost;
	postContent: string;
};

function BlogPostPage({ postDetails, postContent }: T_BlogPostPageProps) {
	return (
		<Page
			config={{
				title: postDetails.content.title,
				description: postDetails.content.description,
				disableSEO: postDetails.is_published === false,
				pathname: `${ROUTES.BLOG}/${postDetails.slug}`,
			}}
		>
			<MainLayout title={postDetails.content.title}>
				<BlogPostDetails postDetails={postDetails} />
				<Space size={1.5} />

				<MDXContent
					code={postContent}
					components={getBlogPostDynamicComponents(getMDXExport(postContent))}
					globals={{
						DATA: { post: postDetails },
					}}
				/>
				<Space size={5} />

				<BlogPostSources sources={postDetails.sources} />
				<Space size={12} />

				<RateContent />
				<Space size={4} />

				<BlogPostActions />
			</MainLayout>
		</Page>
	);
}

export default BlogPostPage;

// --- UTILS ---

function getBlogPostDynamicComponents(componentsMap: DR.Object<string>) {
	const COMPONENTS_PATHS_MAP = {
		Playground: "../../../components/shared/Playground",
		SourceCode: "../../../components/shared/SourceCode",
		MFMAMGitHubRepo: "./components/my-favorite-music-and-mdx/MFMAMGitHubRepo",
		MFMAMHelloWorldMDX: "./components/my-favorite-music-and-mdx/MFMAMHelloWorldMDX",
		MFMAMSpotifyPlaylist: "./components/my-favorite-music-and-mdx/MFMAMSpotifyPlaylist",
	} as DR.Object<string>;

	const components = {
		Callout,
		CopyToClipboardPopover,
		ImageWithLink,
		Toast,
		Tooltip,
	} as DR.Object;

	Object.keys(componentsMap["Components"] || {}).forEach((componentName) => {
		if (COMPONENTS_PATHS_MAP[componentName]) {
			if (componentName === "Playground") {
				components[componentName] = dynamic(
					() => import("../../../../components/shared/Playground"),
					{
						ssr: true,
					},
				);
			} else if (componentName === "MFMAMGitHubRepo") {
				components[componentName] = dynamic(
					() => import("../components/my-favorite-music-and-mdx/MFMAMGitHubRepo"),
					{
						ssr: true,
					},
				);
			} else if (componentName === "MFMAMHelloWorldMDX") {
				components[componentName] = dynamic(
					() => import("../components/my-favorite-music-and-mdx/MFMAMHelloWorldMDX"),
					{
						ssr: true,
					},
				);
			} else if (componentName === "MFMAMSpotifyPlaylist") {
				components[componentName] = dynamic(
					() => import("../components/my-favorite-music-and-mdx/MFMAMSpotifyPlaylist"),
					{
						ssr: true,
					},
				);
			}
		}
	});

	return components;
}

// --- COMPONENTS ---

function BlogPostDetails({ postDetails }: Pick<T_BlogPostPageProps, "postDetails">) {
	return (
		<Block className="tw-border-b-8 tw-border-double tw-border-white tw-pb-16 tw-text-center tw-text-sm">
			<Tooltip
				text="YYYY/MM/DD"
				triggerAsChild={false}
			>
				<Text className="tw-text-white">
					<Icon
						icon={Icon.icon.CALENDAR}
						wrapperClassName="tw-relative tw--top-0.5"
					/>{" "}
					<InlineText>Published at</InlineText>{" "}
					<InlineText is="strong">{postDetails.published_at}</InlineText>
				</Text>
			</Tooltip>
			<Space size={0.5} />
			<Block>
				{postDetails.categories.map((category) => {
					return <BlogPostCategory key={category}>{category}</BlogPostCategory>;
				})}
			</Block>
		</Block>
	);
}

function BlogPostSources({ sources }: { sources: { title: string; url: string }[] }) {
	if (v.isEmptyArray(sources)) {
		return null;
	}

	return (
		<Block
			is="section"
			className="tw-border tw-p-4 dr-bg-color-surface-200 dr-border-color-surface-300"
		>
			<Title
				is="h2"
				variant={Title.variant.PRIMARY}
			>
				Sources
			</Title>
			<Space size={1} />
			<List variant={List.variant.SIMPLE}>
				{sources.map((source) => {
					const { host } = new URL(source.url);

					return (
						<List.Item key={generateSlug(source.title)}>
							<Link
								variant={Link.variant.PRIMARY}
								href={source.url}
								isExternalLink
							>
								{source.title}
							</Link>
							<Text className="tw-text-xs tw-font-bold tw-italic">{host}</Text>
						</List.Item>
					);
				})}
			</List>
		</Block>
	);
}

const RateContent = withOnlyClientRender(function RateContent() {
	// --- STATES & REFS ---
	const [ratedContent, setRatedContent] = useLocalStorageState<DR.Object<string>>({
		key: "DR_RATED_CONTENT",
		value: {},
		saveWhenCreating: true,
		readInitialValueFromStorage: true,
	});

	// --- VARS ---
	const questionAnswer = ratedContent[window.location.pathname] || "";
	const isQuestionAnswered = v.isNotEmptyString(questionAnswer);
	const ANSWERS = ["YES", "NO"];

	function handleAnswerClick(answer: "YES" | "NO") {
		return () => {
			AnalyticsService.trackEvent("RATE_CONTENT", {
				answer,
				page: window.location.pathname,
			});

			setRatedContent({ [window.location.pathname]: answer });
			Toast.success("Thanks for answering");
		};
	}

	return (
		<Block className="tw-text-center">
			<Text className="tw-mb-2 tw-text-sm tw-font-bold">This content was useful for you?</Text>
			<Block>
				{ANSWERS.map((answer) => {
					return (
						<Button
							key={generateSlug(answer)}
							variant={Button.variant.STYLED}
							className={cn("tw-mx-3 tw-w-12", questionAnswer === answer && "tw-text-white")}
							disabled={isQuestionAnswered}
							onClick={handleAnswerClick("YES")}
						>
							<InlineText className="tw-text-2xl">{answer === "YES" ? "👍" : "👎"}</InlineText>
							<Text
								className={cn(
									"tw-text-sm",
									questionAnswer === answer && "tw-font-bold tw-underline",
								)}
							>
								{answer}
							</Text>
						</Button>
					);
				})}
			</Block>
		</Block>
	);
});

const BlogPostActions = withOnlyClientRender(function BlogPostActions() {
	return (
		<Block className="tw-flex tw-flex-wrap tw-justify-between tw-border tw-border-l-8 tw-p-4 tw-text-white dr-border-color-surface-300">
			<BlogPostDetailsCopyUrlItem />
			<Space responsive="tw-w-full tw-my-1 sm:tw-hidden" />
			<BlogPostDetailsSendCommentItem />
		</Block>
	);
});

function BlogPostDetailsSendCommentItem() {
	// --- UTILS ---
	function composeMailToURL() {
		const paramsValues = {
			subject: "Blog post comment",
			body: `Hi, I have a comment about this blog post: ${window.location.href}`,
		};

		const queryParams = Object.entries(paramsValues)
			.reduce((result: string[], [key, value]) => {
				return [...result, `${key}=${value}`];
			}, [])
			.join("&");

		return `mailto:${WEBSITE_METADATA.email}?${queryParams}`;
	}

	return (
		<BlogPostDetailsItem
			is={Link}
			href={composeMailToURL()}
			isExternalLink
		>
			<BlogPostDetailsItemIcon icon={Icon.icon.ENVELOPE} />
			<InlineText>Send a comment via e-mail</InlineText>
		</BlogPostDetailsItem>
	);
}

function BlogPostDetailsCopyUrlItem() {
	return (
		<BlogPostDetailsItem is="div">
			<CopyToClipboardPopover textToCopy={window.location.href}>
				<Button variant={Button.variant.SIMPLE}>
					<BlogPostDetailsItemIcon icon={Icon.icon.LINK} />
					<InlineText>Copy URL</InlineText>
				</Button>
			</CopyToClipboardPopover>
		</BlogPostDetailsItem>
	);
}

const BlogPostDetailsItem = twcss(Button)(
	"tw-flex tw-items-center tw-justify-start tw-text-sm tw-text-left",
	{
		variant: Button.variant.SIMPLE,
	},
);

const BlogPostDetailsItemIcon = twcss(Icon)("", {
	wrapperClassName: "tw-mr-2 tw-relative tw--top-1px",
});
