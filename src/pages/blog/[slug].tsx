import React from "react";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { GetStaticPaths } from "next";

import { Page, MainLayout } from "~/components/layout";
import { Blockquote, Icon, Space, Button } from "~/components/primitive";
import { MDXContent } from "~/components/pages/_shared";
import { useTranslation, getPageContentStaticProps } from "~/i18n";
import twcss from "~/lib/twcss";
import http from "~/lib/http";
import BlogService from "~/services/blog";
import { dataLoader } from "~/server";
import { useStoreSelector } from "~/state";
import { selectWebsiteMetadata } from "~/state/modules/metadata";
import { T_BlogPost, T_Locale, T_ReactElement, T_PageContent, T_WebsiteMetadata } from "~/types";
import { copyToClipboard } from "~/utils/browser";
import { formatDate, getDifferenceBetweenDates } from "~/utils/dates";
import { MDXComponents, MDXScope } from "~/utils/mdx";
import { ROUTES } from "~/utils/routing";

type T_PageProps = {
  post: T_BlogPost;
  postMDXContent: string;
  content: T_PageContent;
  locale: T_Locale;
};

function BlogPostPage({ post, postMDXContent }: T_PageProps): T_ReactElement {
  const { t, currentLocale } = useTranslation();

  const mdxContent = hydrate(postMDXContent, { components: MDXComponents });

  return (
    <Page
      config={{
        title: post.title,
        description: post.description,
        pathname: `${ROUTES.BLOG}/${post.slug}`,
        disableSEO: currentLocale === "es" ? Boolean(t("page:config:is_seo_disabled")) : true, // TODO
      }}
    >
      <MainLayout
        breadcumb={[
          {
            text: t("layout:breadcumb:home"),
            url: ROUTES.HOME,
          },
          {
            text: t("layout:breadcumb:blog"),
            url: ROUTES.BLOG,
          },
          {
            text: BlogService.composeTitle(post),
          },
        ]}
        title={BlogService.composeTitle(post)}
        showGoToTopButton
      >
        <MDXContent content={mdxContent} />
        <Space size={8} />
        <BlogPostFooter
          publishedAt={post.publishedAt}
          slug={post.slug}
          updatedAt={post.updatedAt}
        />
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
    fallback: false,
  };
};

export const getStaticProps = getPageContentStaticProps<
  { post: T_BlogPost; postMDXContent: string },
  { slug: string }
>({
  page: ROUTES.BLOG,
  callback: async ({ params, locale }) => {
    const post = await BlogService.fetchPost({ slug: params?.slug, locale: locale });
    const file = await dataLoader({
      path: `/pages/blog/[slug]/${locale}/${post.createdAt}-${post.slug}.mdx`,
    });
    const { data: codeSnippets } = await http.post(
      `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/blog/code-snippets?slug=${post.slug}`,
    );
    const postMDXContent = (await renderToString(file, {
      components: MDXComponents,
      scope: {
        DATA: {
          ...MDXScope.DATA,
          blogPost: {
            ...post,
            assets: {
              ...post.assets,
              codeSnippets,
            },
          },
        },
      },
    })) as string;

    return {
      props: {
        post,
        postMDXContent,
      },
    };
  },
});

// --- Components ---

type T_BlogPostFooterProps = Pick<T_BlogPost, "publishedAt" | "slug" | "updatedAt">;

function BlogPostFooter({ publishedAt, slug, updatedAt }: T_BlogPostFooterProps): T_ReactElement {
  const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);
  const { t } = useTranslation();

  return (
    <Blockquote
      className="tw-flex tw-flex-wrap sm:tw-flex-no-wrap tw-mt-4 tw-text-black dark:tw-text-white tw-p-4 tw-border dfr-border-color-primary dark:dfr-border-color-primary"
      variant={Blockquote.variant.UNSTYLED}
    >
      <div className="tw-w-full sm:tw-w-1/2 tw-flex tw-items-start tw-justify-center tw-flex-col">
        <BlogPostFooterItem>
          <BlogPostFooterItem.Icon icon={Icon.icon.CALENDAR} />
          <p>
            <span className="tw-mr-1">{t("page:published_at")}</span>
            <strong>{formatDate(publishedAt)}</strong>
          </p>
        </BlogPostFooterItem>
        <BlogPostFooterItem>
          <BlogPostFooterItem.Icon icon={Icon.icon.EDIT} />
          <p>
            <span className="tw-mr-1">{t("page:updated_at")}</span>
            <strong>{getDifferenceBetweenDates(updatedAt, new Date())}</strong>
          </p>
        </BlogPostFooterItem>
        <BlogPostFooterItem
          is={Button}
          data-clipboard-text={`${WEBSITE_METADATA.url}${ROUTES.BLOG}/${slug}`}
          onClick={copyToClipboard}
        >
          <BlogPostFooterItem.Icon icon={Icon.icon.LINK} />
          <span>{t("page:copy_url_to_clipboard")}</span>
        </BlogPostFooterItem>
      </div>
    </Blockquote>
  );
}

const BlogPostFooterItem = twcss.div`tw-flex tw-items-start sm:tw-items-center tw-justify-start tw-mb-2 last:tw-mb-0 tw-text-sm tw-text-left`;

BlogPostFooterItem.Icon = twcss(Icon)("", {
  wrapperClassName: "tw-mr-2 tw-relative tw-top-0.5 sm:tw-top-0",
});
