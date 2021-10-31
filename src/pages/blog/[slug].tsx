import React from "react";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { GetStaticPaths } from "next";

import { Page, MainLayout } from "~/components/layout";
import { Blockquote, Icon, Space, Button } from "~/components/primitive";
import { MDXContent, RateContent } from "~/components/pages/_shared";
import { useDidMount } from "~/hooks";
import { useTranslation, getPageContentStaticProps } from "~/i18n";
import twcss from "~/lib/twcss";
import BlogService from "~/services/blog";
import { dataLoader } from "~/server";
import { useStoreSelector, useStoreActionsDispatcher } from "~/state";
import { selectWebsiteMetadata } from "~/state/modules/metadata";
import { setLocales } from "~/state/modules/page-config";
import { T_BlogPost, T_Locale, T_ReactElement, T_PageContent, T_WebsiteMetadata } from "~/types";
import { copyToClipboard } from "~/utils/browser";
import { getDifferenceBetweenDates } from "~/utils/dates";
import { MDXComponents, MDXScope } from "~/utils/mdx";
import { ROUTES } from "~/utils/routing";
import { replaceAll } from "~/utils/strings";

type T_PageProps = {
  post: T_BlogPost;
  postMDXContent: string;
  content: T_PageContent;
  locale: T_Locale;
};

function BlogPostPage({ post, postMDXContent }: T_PageProps): T_ReactElement {
  const { t } = useTranslation();
  const dispatch = useStoreActionsDispatcher();

  const mdxContent = hydrate(postMDXContent, { components: MDXComponents });

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
        <MDXContent content={mdxContent} />
        <Space size={8} />
        <RateContent />
        <Space size={8} />
        <BlogPostActions />
      </MainLayout>
    </Page>
  );
}

export default BlogPostPage;

// --- Next.js functions ---

type T_StaticPath = { params: { slug: string }; locale: T_Locale };

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async function getStaticPaths() {
  return {
    paths: (await BlogService.fetchPosts()).reduce((result: T_StaticPath[], post: T_BlogPost) => {
      return result.concat(
        post.locales.map((locale: T_Locale): T_StaticPath => {
          return { params: { slug: post.slug }, locale };
        }),
      );
    }, []),
    fallback: "blocking",
  };
};

export const getStaticProps = getPageContentStaticProps<
  { post: T_BlogPost; postMDXContent: string },
  { slug: string }
>({
  page: [ROUTES.BLOG, ROUTES.BLOG_DETAILS],
  localesExtractor: (data) => {
    return data.post.locales;
  },
  callback: async ({ params, locale }) => {
    const post = await BlogService.fetchPost({ slug: params?.slug, locale: locale });
    const file = await dataLoader({
      path: `/pages/blog/[slug]/${locale}/${replaceAll(post.createdAt, "/", "-")}-${post.slug}.mdx`,
    });
    const postMDXContent = (await renderToString(file, {
      components: MDXComponents,
      scope: {
        DATA: {
          ...MDXScope.DATA,
          post,
        },
      },
    })) as string;

    return {
      props: {
        post,
        postMDXContent,
      },
      revalidate: 60,
    };
  },
});

// --- Components ---

type T_BlogPostDetailsProps = Pick<T_BlogPost, "publishedAt" | "updatedAt">;

function BlogPostDetails({ publishedAt, updatedAt }: T_BlogPostDetailsProps): T_ReactElement {
  const { t } = useTranslation();

  return (
    <div className="tw-flex tw-flex-col sm:tw-flex-row tw-justify-center tw-items-center">
      <BlogPostDetailsItem className="tw-border-b-2 tw-border-dotted dfr-border-primary dark:dfr-border-primary">
        <BlogPostDetailsItem.Icon
          icon={Icon.icon.CALENDAR}
          color="tw-text-black dark:tw-text-white"
        />
        <p>
          <span className="tw-mr-1">{t("page:published_at")}</span>
          <strong>{publishedAt}</strong>
        </p>
      </BlogPostDetailsItem>
      <span className="tw-block tw-my-1 sm:tw-my-0 sm:tw-inline-block sm:tw-mx-4" />
      <BlogPostDetailsItem className="tw-border-b-2 tw-border-dotted dfr-border-primary dark:dfr-border-primary">
        <BlogPostDetailsItem.Icon icon={Icon.icon.EDIT} color="tw-text-black dark:tw-text-white" />
        <p>
          <span className="tw-mr-1">{t("page:updated_at")}</span>
          <strong>{getDifferenceBetweenDates(updatedAt, new Date())}</strong>
        </p>
      </BlogPostDetailsItem>
    </div>
  );
}

function BlogPostActions(): T_ReactElement {
  const { t } = useTranslation();
  const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);

  return (
    <Blockquote
      className="dfr-border-primary dfr-text-strong dark:dfr-text-strong dark:dfr-border-primary tw-p-4 tw-border"
      variant={Blockquote.variant.STYLED}
    >
      <BlogPostDetailsItem is={Button} onClick={(e) => copyToClipboard(e, window.location.href)}>
        <BlogPostDetailsItem.Icon icon={Icon.icon.LINK} />
        <span>{t("page:copy_url_to_clipboard")}</span>
      </BlogPostDetailsItem>
      <Space size={1} />
      <BlogPostDetailsItem
        is={Button}
        onClick={() => {
          window.location.href = `mailto:${WEBSITE_METADATA.email}?subject=${t(
            "page:email_message_subject",
          )}&body=${t("page:email_message_body", {
            url: encodeURIComponent(window.location.href),
          })}`;
        }}
      >
        <BlogPostDetailsItem.Icon icon={Icon.icon.REPLY} />
        <span>{t("page:email_message_label")}</span>
      </BlogPostDetailsItem>
    </Blockquote>
  );
}

const BlogPostDetailsItem = twcss.div`tw-flex tw-items-start md:tw-items-center tw-justify-start tw-text-sm tw-text-left`;

BlogPostDetailsItem.Icon = twcss(Icon)("", {
  wrapperClassName: "tw-mr-2 tw-relative tw--top-1px",
});
