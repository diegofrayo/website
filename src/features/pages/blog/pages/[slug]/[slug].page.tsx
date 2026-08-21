"use client";

import dynamic from "next/dynamic";

import { withRenderInBrowser } from "@diegofrayo-pkg/hocs";
import type UtilsTypes from "@diegofrayo-pkg/types";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { encodeRequestParams } from "@diegofrayo-pkg/utilities/navigation";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";
import { isEmptyArray } from "@diegofrayo-pkg/validator";

import {
	BoxWithTitle,
	Callout,
	CopyToClipboardPopover,
	ImageWithLink,
	Toast,
	Tooltip,
} from "~/components/common";
import type { CopyToClipboardPopoverProps } from "~/components/common/copy-to-clipboard-popover";
import { MainLayout } from "~/components/layout";
import {
	Box,
	Button,
	Icon,
	Image,
	InlineText,
	Link,
	List,
	Paragraph,
	Space,
} from "~/components/primitive";
import { IconCatalog } from "~/components/primitive/icon";
import { BLOG_IMAGES_PATH } from "~/constants";
import WEBSITE_METADATA from "~/data/metadata.json";
import AnalyticsService from "~/features/analytics";
import { getMDXExport, MDXContent } from "~/features/mdx/client";

import { BlogPostCategory } from "../../components/blog-post-category";
import type { BlogPost, BlogPostWithContent } from "../../types";

export type BlogPostPageProps = {
	data: BlogPostWithContent;
};

function BlogPostPage({ data }: BlogPostPageProps) {
	const { details: blogPostDetails, content: blogPostContent } = data;

	return (
		<MainLayout title={blogPostDetails.title}>
			<Box className="border-t border-zinc-100 bg-slate-50 shadow-sm shadow-zinc-300">
				<Image
					src={`${BLOG_IMAGES_PATH}/thumbnails/${blogPostDetails.slug}.png`}
					alt={blogPostDetails.title}
					className="mx-auto h-auto w-full max-w-full"
					width={600}
					height={338}
					loading="eager"
				/>
			</Box>
			<Space size={1.5} />
			<BlogPostDetails details={blogPostDetails} />
			<Space size={1.5} />
			<MDXContent
				code={blogPostContent}
				components={getBlogPostDynamicComponents(getMDXExport(blogPostContent))}
				globals={{
					DATA: { post: blogPostDetails },
				}}
			/>
			<Space size={4} />
			<BlogPostSources sources={blogPostDetails.sources} />
			<Space size={2} />
			<BlogPostActions blogPostTitle={blogPostDetails.title} />
		</MainLayout>
	);
}

export default BlogPostPage;

// --- UTILS ---

function getBlogPostDynamicComponents(componentsMap: UtilsTypes.Object<string>) {
	const DYNAMIC_COMPONENTS = [
		"Playground",
		"MFMAMGitHubRepo",
		"MFMAMHelloWorldMDX",
		"MFMAMSpotifyPlaylist",
		"SPVEEQPlaces",
		"SPVEEQRecommendations",
	];

	const components = {
		Callout,
		CopyToClipboardPopover,
		ImageWithLink,
		Toast,
		Tooltip,
	} as UtilsTypes.Object;

	Object.keys(componentsMap["Components"] || {}).forEach((componentName) => {
		if (DYNAMIC_COMPONENTS.includes(componentName)) {
			switch (componentName) {
				case "Playground": {
					components[componentName] = dynamic(
						() => import("../../../../../components/common/playground"),
						{ ssr: true },
					);
					break;
				}

				case "MFMAMGitHubRepo": {
					components[componentName] = dynamic(
						() => import("./components/my-favorite-music-and-mdx/mfmam-github-repo"),
						{ ssr: true },
					);
					break;
				}

				case "MFMAMHelloWorldMDX": {
					components[componentName] = dynamic(
						() => import("./components/my-favorite-music-and-mdx/mfmam-hello-world-mdx"),
						{ ssr: true },
					);
					break;
				}

				case "MFMAMSpotifyPlaylist": {
					components[componentName] = dynamic(
						() => import("./components/my-favorite-music-and-mdx/mfmam-spotify-playlist"),
						{ ssr: true },
					);
					break;
				}

				case "SPVEEQPlaces": {
					components[componentName] = dynamic(
						() => import("./components/sitios-para-visitar-en-el-quindio/spveeq-places"),
						{ ssr: true },
					);
					break;
				}

				case "SPVEEQRecommendations": {
					components[componentName] = dynamic(
						() => import("./components/sitios-para-visitar-en-el-quindio/spveeq-recommendations"),
						{ ssr: true },
					);
					break;
				}

				default:
					break;
			}
		}
	});

	return components;
}

// --- COMPONENTS ---

function BlogPostDetails({ details }: { details: BlogPostPageProps["data"]["details"] }) {
	return (
		<Box className="border border-zinc-200 bg-zinc-50 py-4 text-center text-sm">
			<Paragraph>
				<Icon
					name={IconCatalog.CALENDAR}
					className="relative -top-px"
				/>{" "}
				<InlineText>Published at</InlineText>{" "}
				<InlineText as="strong">{details.published_at}</InlineText>
			</Paragraph>
			<Space size={0.5} />
			<Box className="flex flex-wrap items-center justify-center gap-x-2">
				{details.categories.map((category) => {
					return (
						<BlogPostCategory
							key={category}
							text={category}
						/>
					);
				})}
			</Box>
		</Box>
	);
}

function BlogPostSources({ sources }: Pick<BlogPost, "sources">) {
	if (isEmptyArray(sources)) return null;

	return (
		<BoxWithTitle
			title="Sources"
			className="border-zinc-300 p-4 pb-2"
		>
			<List variant={List.variant.SIMPLE}>
				{sources.map((source) => {
					const { host } = new URL(source.url);

					return (
						<List.Item key={generateSlug(source.title)}>
							<Link
								variant={Link.variant.STYLED}
								href={source.url}
								isExternalLink
							>
								{source.title}
							</Link>
							<Paragraph className="text-xs italic">{host}</Paragraph>
						</List.Item>
					);
				})}
			</List>
		</BoxWithTitle>
	);
}

const BlogPostActions = withRenderInBrowser(function BlogPostActions({
	blogPostTitle,
}: {
	blogPostTitle: string;
}) {
	const ACTIONS = [
		{
			type: "LINK",
			icon: IconCatalog.MAILS,
			label: "Send a comment via e-mail",
			popoverConfig: undefined,
			props: {
				href: (function composeMailToURL() {
					const paramsValues = {
						subject: "Blog post comment",
						body: `Hi, I have a comment about this blog post: ${window.location.href}`,
					};

					const queryParams = encodeRequestParams(paramsValues);
					const result = `mailto:${WEBSITE_METADATA.email}?${queryParams}`;

					return result;
				})(),
				isExternalLink: true,
				onClick: AnalyticsService.trackClickEvent("BLOG|SEND_EMAIL", { post: blogPostTitle }),
			},
		},
		{
			type: "BUTTON",
			icon: IconCatalog.LINK,
			label: "Copy URL",
			popoverConfig: { textToCopy: window.location.href },
			props: {
				onClick: AnalyticsService.trackClickEvent("BLOG|COPY_URL", { post: blogPostTitle }),
			},
		},
	] as const;

	return (
		<Box className="flex flex-col flex-wrap items-start justify-between gap-2 border border-x-8 border-black p-4 text-black sm:flex-row">
			{ACTIONS.map((action) => {
				return (
					<BlogPostActionsItemWrapper
						key={action.label}
						popoverConfig={action.popoverConfig}
					>
						<Button
							className="inline-flex items-center justify-start text-left text-sm"
							render={action.type === "LINK" ? <Link {...action.props} /> : undefined}
							onClick={action.type === "BUTTON" ? action.props.onClick : undefined}
						>
							<Icon
								className="mr-1"
								name={action.icon}
							/>
							<InlineText>{action.label}</InlineText>
						</Button>
					</BlogPostActionsItemWrapper>
				);
			})}
		</Box>
	);
});

type BlogPostActionsItemWrapperProps = {
	children: ReactTypes.Children;
	popoverConfig: Omit<CopyToClipboardPopoverProps, "children"> | undefined;
};

const BlogPostActionsItemWrapper = ({
	children,
	popoverConfig,
}: BlogPostActionsItemWrapperProps) => {
	if (popoverConfig) {
		return (
			<CopyToClipboardPopover
				popoverInnerWrapperClassName="leading-none"
				{...popoverConfig}
			>
				{children}
			</CopyToClipboardPopover>
		);
	}

	return children;
};
