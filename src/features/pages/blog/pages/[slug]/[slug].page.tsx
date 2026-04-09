import dynamic from "next/dynamic";

import { withRenderInBrowser } from "@diegofrayo-pkg/hocs";
import type UtilsTypes from "@diegofrayo-pkg/types";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";
import { isEmptyArray } from "@diegofrayo-pkg/validator";

import BoxWithTitle from "~/components/common/box-with-title";
import Callout from "~/components/common/callout";
import CopyToClipboardPopover from "~/components/common/copy-to-clipboard-popover";
import type { CopyToClipboardPopoverProps } from "~/components/common/copy-to-clipboard-popover";
import ImageWithLink from "~/components/common/image-with-link";
import Toast from "~/components/common/toast";
import Tooltip from "~/components/common/tooltip";
import { MainLayout, Page } from "~/components/layout";
import {
	Box,
	Button,
	Icon,
	IconCatalog,
	Image,
	InlineText,
	Link,
	List,
	Space,
	Text,
} from "~/components/primitive";
import { BLOG_IMAGES_PATH, Routes } from "~/constants";
import WEBSITE_METADATA from "~/data/metadata.json";
import AnalyticsService from "~/features/analytics";
import { getMDXExport, MDXContent } from "~/features/mdx/client";

import { BlogPostCategory } from "../../components/blog-post-category";
import type { BlogPostWithContent } from "../../types";

export type BlogPostPageProps = {
	data: BlogPostWithContent;
};

function BlogPostPage({ data }: BlogPostPageProps) {
	const { details: blogPostDetails, content: blogPostContent } = data;

	return (
		<Page
			config={{
				isSEOEnabled: blogPostDetails.is_published === true,
				title: blogPostDetails.title,
				description: blogPostDetails.description,
				pathname: `${Routes.BLOG}/${blogPostDetails.slug}`,
			}}
		>
			<MainLayout title={blogPostDetails.title}>
				<Box className="border-t border-zinc-100 bg-slate-50 shadow-sm shadow-zinc-300">
					<Image
						src={`${BLOG_IMAGES_PATH}/thumbnails/${blogPostDetails.slug}.png`}
						alt={blogPostDetails.title}
						className="mx-auto max-w-full"
						useNativeElement
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
				<BlogPostActions />
			</MainLayout>
		</Page>
	);
}

export default BlogPostPage;

// --- UTILS ---

function getBlogPostDynamicComponents(componentsMap: UtilsTypes.Object<string>) {
	const COMPONENTS_PATHS_MAP = {
		Playground: "../../../../common/components/common/playground",
		MFMAMGitHubRepo: "./components/my-favorite-music-and-mdx/MFMAMGitHubRepo",
		MFMAMHelloWorldMDX: "./components/my-favorite-music-and-mdx/MFMAMHelloWorldMDX",
		MFMAMSpotifyPlaylist: "./components/my-favorite-music-and-mdx/MFMAMSpotifyPlaylist",
		SPVEEQPlaces: "./components/sitios-para-visitar-en-el-quindio/SPVEEQPlaces",
		SPVEEQRecommendations: "./components/sitios-para-visitar-en-el-quindio/SPVEEQRecommendations",
	} as UtilsTypes.Object<string>;

	const components = {
		Callout,
		CopyToClipboardPopover,
		ImageWithLink,
		Toast,
		Tooltip,
	} as UtilsTypes.Object;

	Object.keys(componentsMap["Components"] || {}).forEach((componentName) => {
		if (COMPONENTS_PATHS_MAP[componentName]) {
			if (componentName === "Playground") {
				components[componentName] = dynamic(
					() => import("../../../../../components/common/playground"),
					{
						ssr: true,
					},
				);
			} else if (componentName === "MFMAMGitHubRepo") {
				components[componentName] = dynamic(
					() => import("./components/my-favorite-music-and-mdx/mfmam-github-repo"),
					{
						ssr: true,
					},
				);
			} else if (componentName === "MFMAMHelloWorldMDX") {
				components[componentName] = dynamic(
					() => import("./components/my-favorite-music-and-mdx/mfmam-hello-world-mdx"),
					{
						ssr: true,
					},
				);
			} else if (componentName === "MFMAMSpotifyPlaylist") {
				components[componentName] = dynamic(
					() => import("./components/my-favorite-music-and-mdx/mfmam-spotify-playlist"),
					{
						ssr: true,
					},
				);
			} else if (componentName === "SPVEEQPlaces") {
				components[componentName] = dynamic(
					() => import("./components/sitios-para-visitar-en-el-quindio/spveeq-places"),
					{
						ssr: true,
					},
				);
			} else if (componentName === "SPVEEQRecommendations") {
				components[componentName] = dynamic(
					() => import("./components/sitios-para-visitar-en-el-quindio/spveeq-recommendations"),
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

function BlogPostDetails({ details }: { details: BlogPostPageProps["data"]["details"] }) {
	return (
		<Box className="border border-zinc-200 bg-zinc-50 py-4 text-center text-sm">
			<Text>
				<Icon
					icon={IconCatalog.CALENDAR}
					wrapperClassName="relative -top-px"
				/>{" "}
				<InlineText>Published at</InlineText>{" "}
				<InlineText as="strong">{details.published_at}</InlineText>
			</Text>
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

function BlogPostSources({ sources }: { sources: { title: string; url: string }[] }) {
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
							<Text className="text-xs italic">{host}</Text>
						</List.Item>
					);
				})}
			</List>
		</BoxWithTitle>
	);
}

const BlogPostActions = withRenderInBrowser(function BlogPostActions() {
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

					const queryParams = Object.entries(paramsValues)
						.reduce((result: string[], [key, value]) => {
							return [...result, `${key}=${value}`];
						}, [])
						.join("&");

					return `mailto:${WEBSITE_METADATA.email}?${queryParams}`;
				})(),
				isExternalLink: true,
			},
		},
		{
			type: "BUTTON",
			icon: IconCatalog.LINK,
			label: "Copy URL",
			popoverConfig: { textToCopy: window.location.href },
			props: {
				onClick: AnalyticsService.trackClickEvent("BLOG|COPY_URL", { url: window.location.href }),
			},
		},
	] as const;

	return (
		<Box className="flex flex-col flex-wrap justify-between gap-2 border border-x-8 border-black p-4 text-black sm:flex-row">
			{ACTIONS.map((action) => {
				return (
					<BlogPostActionsItemWrapper
						key={action.label}
						popoverConfig={action.popoverConfig}
					>
						<Button
							className="flex items-center justify-start text-left text-sm"
							render={action.type === "LINK" ? <Link {...action.props} /> : undefined}
						>
							<Icon
								className="mr-1"
								icon={action.icon}
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
		return <CopyToClipboardPopover {...popoverConfig}>{children}</CopyToClipboardPopover>;
	}

	return children;
};
