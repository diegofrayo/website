import * as React from "react";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import { Page, MainLayout } from "~/components/layout";
import { Icon, Space, Button, Block, Text, InlineText, Image, Link } from "~/components/primitive";
import { MDXContent, RateContent } from "~/components/shared";
import { withSafeRendering } from "~/hocs";
import { useDidMount } from "~/hooks";
import { useTranslation } from "~/i18n";
import twcss from "~/lib/twcss";
import { T_BlogPost } from "~/services/blog";
import { useStoreSelector, useStoreActionsDispatcher } from "~/state";
import { selectWebsiteMetadata } from "~/state/modules/metadata";
import { setLocales } from "~/state/modules/page-config";
import { copyToClipboard } from "~/utils/browser";
import { getDifferenceBetweenDates } from "~/utils/dates";
import { ROUTES } from "~/utils/routing";
import type { T_ReactElement } from "~/types";

type T_PageProps = {
  post: T_BlogPost;
  postMDXContent: MDXRemoteSerializeResult;
  // content: T_PageContent;
  // locale: T_Locale;
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
        />
        <Space size={8} />

        <MDXContent content={postMDXContent} />
        <Space size={8} />

        <RateContent />
        <Space size={8} />

        <BlogPostActions />
      </MainLayout>
    </Page>
  );
}

export default BlogPostPage;

// --- Components ---

type T_BlogPostDetailsProps = Pick<T_BlogPost, "publishedAt" | "updatedAt" | "isPublished">;

function BlogPostDetails({
  publishedAt,
  updatedAt,
  isPublished,
}: T_BlogPostDetailsProps): T_ReactElement {
  // hooks
  const { t } = useTranslation();

  // render
  return (
    <Block className="tw-flex tw-flex-col tw-items-center tw-justify-center sm:tw-flex-row">
      {isPublished ? (
        <React.Fragment>
          <BlogPostDetailsItem className="tw-border-b-2 tw-border-dotted dfr-border-color-primary dark:dfr-border-color-primary">
            <BlogPostDetailsItem.Icon
              icon={Icon.icon.CALENDAR}
              color="tw-text-black dark:tw-text-white"
            />
            <Text>
              <InlineText className="tw-mr-1">{t("page:published_at")}</InlineText>
              <InlineText is="strong">{publishedAt}</InlineText>
            </Text>
          </BlogPostDetailsItem>
          <Space responsive="tw-my-1 tw-block sm:tw-my-0 sm:tw-mx-4 sm:tw-inline-block" />
        </React.Fragment>
      ) : null}
      <BlogPostDetailsItem className="tw-border-b-2 tw-border-dotted dfr-border-color-primary dark:dfr-border-color-primary">
        <BlogPostDetailsItem.Icon
          icon={Icon.icon.EDIT}
          color="tw-text-black dark:tw-text-white"
        />
        <Text>
          <InlineText className="tw-mr-1">{t("page:updated_at")}</InlineText>
          <InlineText is="strong">{getDifferenceBetweenDates(updatedAt, new Date())}</InlineText>
        </Text>
      </BlogPostDetailsItem>
    </Block>
  );
}

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
        <BlogPostDetailsItem.Icon icon={Icon.icon.LINK} />
        <InlineText>{t("page:copy_url_to_clipboard")}</InlineText>
      </BlogPostDetailsItem>
      <Space responsive="tw-w-full tw-my-1 sm:tw-hidden" />
      <BlogPostDetailsItemLink />
    </Block>
  );
}

const BlogPostDetailsItem = twcss(Button)(
  "tw-flex tw-items-center tw-justify-start tw-text-sm tw-text-left",
  {
    variant: Button.variant.SIMPLE,
  },
);

const BlogPostDetailsItemLink = withSafeRendering(
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

    // render
    return (
      <BlogPostDetailsItem
        is={Link}
        href={composeMailToURL()}
      >
        <BlogPostDetailsItem.Icon icon={Icon.icon.REPLY} />
        <InlineText>{t("page:email_message_label")}</InlineText>
      </BlogPostDetailsItem>
    );
  },
);

BlogPostDetailsItem.Icon = twcss(Icon)("", {
  wrapperClassName: "tw-mr-2 tw-relative tw--top-1px",
});
