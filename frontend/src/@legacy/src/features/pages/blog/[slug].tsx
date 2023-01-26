import * as React from "react";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import { Page, MainLayout } from "~/@legacy/src/components/layout";
import { Icon, Space, Button, Block, Text, InlineText, Image, Link } from "~/@legacy/src/components/primitive";
import { MDXContent, RateContent } from "~/@legacy/src/components/shared";
import { withOnlyClientRendering } from "~/@legacy/src/hocs";
import { useDidMount } from "~/@legacy/src/hooks";
import { useTranslation } from "~/@legacy/src/features/i18n";
import twcss from "~/@legacy/src/lib/twcss";
import { useStoreSelector, useStoreActionsDispatcher } from "~/@legacy/src/stores";
import { selectWebsiteMetadata, T_WebsiteMetadata } from "~/@legacy/src/stores/modules/metadata";
import { setLocales } from "~/@legacy/src/stores/modules/page-config";
import { copyToClipboard } from "~/@legacy/src/utils/browser";
import { getFormattedDatesDifference } from "~/@legacy/src/utils/dates";
import { ROUTES } from "~/@legacy/src/features/routing";
import type { T_ReactElement } from "~/@legacy/src/types";

import { PostSources } from "./components";
import type { T_BlogPost } from "./service";

type T_PageProps = {
	post: T_BlogPost;
	postMDXContent: MDXRemoteSerializeResult;
};

function BlogPostPage({ post, postMDXContent }: T_PageProps): T_ReactElement {
	// hooks
	const { t } = useTranslation();
	const dispatch = useStoreActionsDispatcher();

	// effects
	useDidMount(() => {
		dispatch(setLocales(post.locales));
	});

	return (
		<Page
			config={{
				title: post.title,
				replaceTitle: true,
				description: post.description,
				pathname: `${ROUTES.BLOG}/${post.slug}`,
				image: post.thumbnail,
				disableSEO: Boolean(t("page:config:is_seo_disabled")),
			}}
		>
			<MainLayout title={post.title}>
				<BlogPostDetails
					publishedAt={post.publishedAt}
					updatedAt={post.updatedAt}
					isPublished={post.isPublished}
				/>
				<Space size={8} />

				<Image
					src={post.thumbnail}
					alt="Blog post thumbnail"
					className="tw-mx-auto tw-rounded-md"
					width={576}
					height={432}
				/>

				<Space size={8} />

				<MDXContent content={postMDXContent} />
				<PostSources sources={post.sources} />

				<Space
					sizeTop={8}
					sizeBottom={24}
					variant="DASHED"
				/>

				<RateContent />
				<Space size={2} />

				<BlogPostActions />
			</MainLayout>
		</Page>
	);
}

export default BlogPostPage;

// --- Components ---
function BlogPostActions(): T_ReactElement {
	// hooks
	const { t } = useTranslation();

	// handlers
	function handleCopyUrlClick(): void {
		copyToClipboard(window.location.href);
	}

	return (
		<Block
			variant="FEATURED"
			className="tw-flex tw-flex-wrap tw-justify-between"
		>
			<BlogPostDetailsItem onClick={handleCopyUrlClick}>
				<BlogPostDetailsItemIcon icon={Icon.icon.LINK} />
				<InlineText>{t("page:copy_url_to_clipboard")}</InlineText>
			</BlogPostDetailsItem>
			<Space responsive="tw-w-full tw-my-1 sm:tw-hidden" />
			<BlogPostDetailsItemLink />
		</Block>
	);
}

type T_BlogPostDetailsProps = Pick<T_BlogPost, "publishedAt" | "updatedAt" | "isPublished">;

function BlogPostDetails({
	publishedAt,
	updatedAt,
	isPublished,
}: T_BlogPostDetailsProps): T_ReactElement {
	// hooks
	const { t } = useTranslation();

	return (
		<Block className="tw-flex tw-flex-col tw-items-center tw-justify-center sm:tw-flex-row">
			{isPublished ? (
				<React.Fragment>
					<BlogPostDetailsItem
						is="div"
						className="tw-border-b-2 tw-border-dotted dfr-border-color-primary"
					>
						<BlogPostDetailsItemIcon icon={Icon.icon.CALENDAR} />
						<Text>
							<InlineText className="tw-mr-1">{t("page:published_at")}</InlineText>
							<InlineText is="strong">{publishedAt}</InlineText>
						</Text>
					</BlogPostDetailsItem>
					<Space responsive="tw-my-1 tw-block sm:tw-my-0 sm:tw-mx-4 sm:tw-inline-block" />
				</React.Fragment>
			) : null}
			<BlogPostDetailsItem
				is="div"
				className="tw-border-b-2 tw-border-dotted dfr-border-color-primary"
			>
				<BlogPostDetailsItemIcon icon={Icon.icon.EDIT} />
				<Text>
					<InlineText className="tw-mr-1">{t("page:updated_at")}</InlineText>
					<InlineText is="strong">{getFormattedDatesDifference(updatedAt, new Date())}</InlineText>
				</Text>
			</BlogPostDetailsItem>
		</Block>
	);
}

const BlogPostDetailsItem = twcss(Button)(
	"tw-flex tw-items-center tw-justify-start tw-text-sm tw-text-left",
	{
		variant: Button.variant.SIMPLE,
	},
);

const BlogPostDetailsItemLink = withOnlyClientRendering(
	function BlogPostDetailsItemLink(): T_ReactElement {
		// hooks
		const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);
		const { t } = useTranslation();

		// utils
		function composeMailToURL(): string {
			return `mailto:${WEBSITE_METADATA.email}?subject=${t("page:email_message_subject")}&body=${t(
				"page:email_message_body",
				{
					url: encodeURIComponent(window.location.href),
				},
			)}`;
		}

		return (
			<BlogPostDetailsItem
				is={Link}
				href={composeMailToURL()}
				isExternalLink
			>
				<BlogPostDetailsItemIcon icon={Icon.icon.REPLY} />
				<InlineText>{t("page:email_message_label")}</InlineText>
			</BlogPostDetailsItem>
		);
	},
);

const BlogPostDetailsItemIcon = twcss(Icon)("", {
	wrapperClassName: "tw-mr-2 tw-relative tw--top-1px",
});
