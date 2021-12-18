import * as React from "react";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import { Page, MainLayout } from "~/components/layout";
import { Icon, Space, Button, Block, Text, InlineText } from "~/components/primitive";
import { MDXContent, RateContent } from "~/components/shared";
import { useDidMount } from "~/hooks";
import { useTranslation } from "~/i18n";
import twcss from "~/lib/twcss";
import { useStoreSelector, useStoreActionsDispatcher } from "~/state";
import { selectWebsiteMetadata } from "~/state/modules/metadata";
import { setLocales } from "~/state/modules/page-config";
import type {
  T_BlogPost,
  T_Locale,
  T_ReactElement,
  T_PageContent,
  T_WebsiteMetadata,
} from "~/types";
import { copyToClipboard } from "~/utils/browser";
import { getDifferenceBetweenDates } from "~/utils/dates";
import { ROUTES } from "~/utils/routing";

type T_PageProps = {
  post: T_BlogPost;
  postMDXContent: MDXRemoteSerializeResult;
  content: T_PageContent;
  locale: T_Locale;
};

function BlogPostPage({ post, postMDXContent }: T_PageProps): T_ReactElement {
  const { t } = useTranslation();
  const dispatch = useStoreActionsDispatcher();

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
        disableSEO: Boolean(t("page:config:is_seo_disabled")),
      }}
    >
      <MainLayout title={post.title}>
        <BlogPostDetails publishedAt={post.publishedAt} updatedAt={post.updatedAt} />
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

type T_BlogPostDetailsProps = Pick<T_BlogPost, "publishedAt" | "updatedAt">;

function BlogPostDetails({ publishedAt, updatedAt }: T_BlogPostDetailsProps): T_ReactElement {
  const { t } = useTranslation();

  return (
    <Block className="tw-flex-col sm:tw-flex-row" display="tw-flex" align="CENTER">
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
      <InlineText className="tw-block tw-my-1 sm:tw-my-0 sm:tw-inline-block sm:tw-mx-4" />
      <BlogPostDetailsItem className="tw-border-b-2 tw-border-dotted dfr-border-color-primary dark:dfr-border-color-primary">
        <BlogPostDetailsItem.Icon icon={Icon.icon.EDIT} color="tw-text-black dark:tw-text-white" />
        <Text>
          <InlineText className="tw-mr-1">{t("page:updated_at")}</InlineText>
          <InlineText is="strong">{getDifferenceBetweenDates(updatedAt, new Date())}</InlineText>
        </Text>
      </BlogPostDetailsItem>
    </Block>
  );
}

function BlogPostActions(): T_ReactElement {
  const { t } = useTranslation();
  const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);

  return (
    <Block variant="FEATURED">
      <BlogPostDetailsItem onClick={(e) => copyToClipboard(e, window.location.href)}>
        <BlogPostDetailsItem.Icon icon={Icon.icon.LINK} />
        <InlineText>{t("page:copy_url_to_clipboard")}</InlineText>
      </BlogPostDetailsItem>
      <Space size={1} />
      <BlogPostDetailsItem
        onClick={() => {
          window.location.href = `mailto:${WEBSITE_METADATA.email}?subject=${t(
            "page:email_message_subject",
          )}&body=${t("page:email_message_body", {
            url: encodeURIComponent(window.location.href),
          })}`;
        }}
      >
        <BlogPostDetailsItem.Icon icon={Icon.icon.REPLY} />
        <InlineText>{t("page:email_message_label")}</InlineText>
      </BlogPostDetailsItem>
    </Block>
  );
}

const BlogPostDetailsItem = twcss(Button)(
  "tw-flex tw-items-start md:tw-items-center tw-justify-start tw-text-sm tw-text-left",
  {
    variant: Button.variant.SIMPLE,
  },
);

BlogPostDetailsItem.Icon = twcss(Icon)("", {
  wrapperClassName: "tw-mr-2 tw-relative tw--top-1px",
});
