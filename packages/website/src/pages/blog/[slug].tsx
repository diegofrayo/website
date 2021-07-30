import React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { GetStaticPaths } from "next";

import { Page, MainLayout } from "~/components/layout";
import { Blockquote, Icon, Link, Space, Button } from "~/components/primitive";
import { MDXContent } from "~/components/pages/_shared";
import { useTranslation } from "~/hooks";
import twcss from "~/lib/twcss";
import BlogService from "~/services/blog";
import { T_BlogPost, T_Locale, T_ReactElement, T_PageContent } from "~/types";
import { copyToClipboard } from "~/utils/browser";
import { WEBSITE_METADATA, GITHUB_DATA } from "~/utils/constants";
import { formatDate, getDifferenceBetweenDates } from "~/utils/dates";
import { MDXComponents, MDXScope } from "~/utils/mdx";
import { ROUTES } from "~/utils/routing";
import { getPageContentStaticProps } from "~/server/i18n";
import { loader } from "~/server/loader";

type T_PageProps = {
  post: T_BlogPost;
  postMDXContent: string;
  content: T_PageContent;
  locale: T_Locale;
};

function BlogPostPage({ post, postMDXContent }: T_PageProps): T_ReactElement {
  const { t } = useTranslation({
    page: true,
    layout: true,
  });

  const mdxContent = hydrate(postMDXContent, { components: MDXComponents });

  return (
    <Page
      config={{
        title: post.title,
        description: post.description,
        pathname: `${ROUTES.BLOG}/${post.slug}`,
        disableSEO: Boolean(t("page:config:is_seo_disabled")),
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
          createdAt={post.createdAt}
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

type T_Path = { params: { slug: string }; locale: T_Locale };

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async function getStaticPaths() {
  return {
    paths: (await BlogService.fetchPosts({ locale: "es" })).reduce(
      (result: T_Path[], post: T_BlogPost) => {
        return result.concat(
          post.locales.map((locale: T_Locale): T_Path => {
            return { params: { slug: post.slug }, locale };
          }),
        );
      },
      [],
    ),
    fallback: false,
  };
};

export const getStaticProps = getPageContentStaticProps<
  { post: T_BlogPost; postMDXContent: string },
  { slug: string }
>({
  page: ROUTES.BLOG,
  callback: async ({ params, locale }) => {
    const post: T_BlogPost = await BlogService.fetchPost({ slug: params?.slug });
    const file = await loader({
      path: `/pages/blog/[slug]/${locale}/${post.createdAt}-${post.slug}.mdx`,
    });
    const postSlug = post.slug;
    const codeSnippets = fs.existsSync(
      `${process.cwd()}/src/components/pages/blog/${postSlug}/code-snippets.ts`,
    )
      ? require(`src/components/pages/blog/${postSlug}/code-snippets.ts`).default // eslint-disable-line @typescript-eslint/no-var-requires
      : {};
    const postMDXContent = (await renderToString(file, {
      components: MDXComponents,
      scope: {
        DATA: {
          ...MDXScope.DATA,
          blogPost: {
            ...post,
            codeSnippets,
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

type T_BlogPostFooterProps = Pick<T_BlogPost, "createdAt" | "publishedAt" | "slug" | "updatedAt">;

function BlogPostFooter({
  createdAt,
  publishedAt,
  slug,
  updatedAt,
}: T_BlogPostFooterProps): T_ReactElement {
  const { t, currentLocale } = useTranslation({
    page: true,
    layout: true,
  });

  function generateBlogPostRawContentLink() {
    return GITHUB_DATA.monorepo.website.files["raw-post"]
      .replace("CURRENT_LOCALE", currentLocale)
      .replace("FILE_NAME", `${createdAt}-${slug}`);
  }

  return (
    <Blockquote
      className="tw-flex tw-flex-wrap sm:tw-flex-no-wrap tw-my-4 tw-text-black dark:tw-text-white"
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
      <div className="tw-hidden tw-w-full sm:tw-w-1/2 tw-items-start tw-justify-center tw-flex-col sm:tw-items-end tw-mt-2 sm:tw-mt-0">
        <BlogPostFooterItem
          is={Link}
          href={generateBlogPostRawContentLink()}
          variant={Link.variant.SIMPLE}
        >
          <BlogPostFooterItem.Icon icon={Icon.icon.CODE} />
          <span>{t("page:see_publication_source_code")}</span>
        </BlogPostFooterItem>
      </div>
    </Blockquote>
  );
}

const BlogPostFooterItem = twcss.div`tw-flex tw-items-start sm:tw-items-center tw-justify-start tw-mb-2 last:tw-mb-0 tw-text-sm tw-text-left`;

BlogPostFooterItem.Icon = twcss(Icon)("", {
  wrapperClassName: "tw-mr-2 tw-relative tw-top-0.5 sm:tw-top-0",
});
