import dynamic from "next/dynamic";

import { withRenderInBrowser } from "@diegofrayo-pkg/hocs";
import twcss from "@diegofrayo-pkg/twcss";
import type DR from "@diegofrayo-pkg/types";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";
import { isEmptyArray } from "@diegofrayo-pkg/validator";
import AnalyticsService from "@diegofrayo-features/analytics";
import {
	Box,
	Button,
	Icon,
	IconCatalog,
	InlineText,
	Link,
	List,
	Space,
	Text,
} from "@diegofrayo-features/components/primitive";
import {
	BoxWithTitle,
	Callout,
	CopyToClipboardPopover,
	ImageWithLink,
	Toast,
	Tooltip,
} from "@diegofrayo-features/components/shared";
import { getMDXExport, MDXContent } from "@diegofrayo-features/mdx/client";

import { MainLayout, Page } from "~/components/layout";
import { Routes } from "~/constants";
import WEBSITE_METADATA from "~/data/metadata.json";

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

function getBlogPostDynamicComponents(componentsMap: DR.Object<string>) {
	const COMPONENTS_PATHS_MAP = {
		Playground: "../../../../common/components/shared/playground",
		MFMAMGitHubRepo: "./components/my-favorite-music-and-mdx/MFMAMGitHubRepo",
		MFMAMHelloWorldMDX: "./components/my-favorite-music-and-mdx/MFMAMHelloWorldMDX",
		MFMAMSpotifyPlaylist: "./components/my-favorite-music-and-mdx/MFMAMSpotifyPlaylist",
		SPVEEQPlaces: "./components/sitios-para-visitar-en-el-quindio/SPVEEQPlaces",
		SPVEEQRecommendations: "./components/sitios-para-visitar-en-el-quindio/SPVEEQRecommendations",
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
					() => import("../../../../../lib/@diegofrayo-features/components/shared/playground"),
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
	return (
		<Box className="flex flex-wrap justify-between border border-x-8 border-black p-4 text-black">
			<BlogPostDetailsCopyUrlItem />
			<Space responsive="w-full my-1 sm:hidden" />
			<BlogPostDetailsSendCommentItem />
		</Box>
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
			as={Link}
			href={composeMailToURL()}
			onClick={AnalyticsService.trackClickEvent("BLOG|SEND_COMMENT", { url: window.location.href })}
			isExternalLink
		>
			<BlogPostDetailsItemIcon icon={IconCatalog.MAILS} />
			<InlineText>Send a comment via e-mail</InlineText>
		</BlogPostDetailsItem>
	);
}

function BlogPostDetailsCopyUrlItem() {
	return (
		<BlogPostDetailsItem as="div">
			<CopyToClipboardPopover textToCopy={window.location.href}>
				<Button
					variant={Button.variant.SMOOTH}
					onClick={AnalyticsService.trackClickEvent("BLOG|COPY_URL", { url: window.location.href })}
				>
					<BlogPostDetailsItemIcon icon={IconCatalog.LINK} />
					<InlineText>Copy URL</InlineText>
				</Button>
			</CopyToClipboardPopover>
		</BlogPostDetailsItem>
	);
}

const BlogPostDetailsItem = twcss(Button)("flex items-center justify-start text-sm text-left", {
	variant: Button.variant.SMOOTH,
});

const BlogPostDetailsItemIcon = twcss(Icon)("", {
	wrapperClassName: "mr-1",
});
