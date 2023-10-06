import * as React from "react";
import cn from "classnames";

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
	Playground,
	SourceCode,
	Toast,
	Tooltip,
} from "~/components/shared";
import WEBSITE_METADATA from "~/data/generated/metadata.json";
import { MDXContent } from "~/modules/mdx/client";
import { ROUTES } from "~/modules/routing";
import { withOnlyClientRendering } from "~/hocs";
import { useLocalStorageState } from "~/hooks";
import twcss from "@diegofrayo/twcss";
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";
import type { T_BlogPost } from "~/modules/pages/blog/types";
import type DR from "@diegofrayo/types";

import * as BlogPostsComponents from "./components/my-favorite-music-and-mdx";
import { BlogPostCategory } from "./components";

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
				disableSEO: postDetails.config.is_published === false,
				pathname: `${ROUTES.BLOG}/${postDetails.config.slug}`,
			}}
		>
			<MainLayout title={postDetails.content.title}>
				<BlogPostDetails postDetails={postDetails} />
				<Space size={1.5} />

				<MDXContent
					code={postContent}
					components={{
						Callout,
						ImageWithLink,
						Playground,
						SourceCode,
						...BlogPostsComponents,
					}}
					globals={{
						DATA: { post: postDetails },
					}}
				/>
				<Space size={5} />

				<BlogPostSources sources={postDetails.config.sources} />
				<Space size={12} />

				<RateContent />
				<Space size={1.5} />

				<BlogPostActions />
			</MainLayout>
		</Page>
	);
}

export default BlogPostPage;

// --- COMPONENTS ---

function BlogPostDetails({ postDetails }: Pick<T_BlogPostPageProps, "postDetails">) {
	return (
		<Block className="tw-border-b-8 tw-border-double tw-border-white tw-pb-16 tw-text-center tw-text-xs">
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
					<InlineText is="strong">{postDetails.config.published_at}</InlineText>
				</Text>
			</Tooltip>
			<Space size={0.5} />
			<Block>
				{postDetails.config.categories.map((category) => {
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
			<List variant={List.variant.DEFAULT}>
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

const RateContent = withOnlyClientRendering(function RateContent() {
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

	function handleAnswerClick(answer: "YES" | "NO") {
		return () => {
			// AnalyticsService.trackEvent("RATE_CONTENT", {
			// 	answer,
			// 	page: window.location.pathname,
			// });

			setRatedContent({ [window.location.pathname]: answer });
			Toast.success("Thanks for answering");
		};
	}

	return (
		<Block className="tw-text-center print:tw-hidden">
			<Text className="tw-mb-2 tw-text-sm tw-font-bold">This content was useful for you?</Text>
			<Block className={cn("tw-text-center tw-text-xl", isQuestionAnswered && "tw-opacity-50")}>
				<Button
					variant={Button.variant.SIMPLE}
					disabled={isQuestionAnswered}
					onClick={handleAnswerClick("YES")}
				>
					<InlineText>👍</InlineText>
					<Text
						className={cn("tw-text-sm", questionAnswer === "YES" && "tw-font-bold tw-underline")}
					>
						YES
					</Text>
				</Button>
				<Space
					size={3}
					orientation="v"
				/>
				<Button
					variant={Button.variant.SIMPLE}
					className={cn(questionAnswer === "NO" && "tw-font-bold")}
					disabled={isQuestionAnswered}
					onClick={handleAnswerClick("NO")}
				>
					<InlineText>👎</InlineText>
					<Text
						className={cn("tw-text-sm", questionAnswer === "NO" && "tw-font-bold tw-underline")}
					>
						NO
					</Text>
				</Button>
			</Block>
		</Block>
	);
});

const BlogPostActions = withOnlyClientRendering(function BlogPostActions() {
	return (
		<Block className="tw-flex tw-flex-wrap tw-justify-between tw-border tw-border-l-8 tw-p-4 dr-border-color-surface-300">
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
				<BlogPostDetailsItemIcon icon={Icon.icon.LINK} />
				<InlineText>Copy URL</InlineText>
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
