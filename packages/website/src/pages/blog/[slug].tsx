import React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { GetStaticPaths, GetStaticProps } from "next";

import { Page, MainLayout } from "~/components/layout";
import { Blockquote, Icon, Link, Space, Button } from "~/components/primitive";
import { MDXContent } from "~/components/pages/_shared";
import { useInternationalization } from "~/hooks";
import twcss from "~/lib/twcss";
import BlogService from "~/services/blog";
import { T_BlogPost, T_Locale, T_ReactElement } from "~/types";
import { copyToClipboard } from "~/utils/browser";
import { WEBSITE_METADATA, GITHUB_DATA } from "~/utils/constants";
import { formatDate, getDifferenceBetweenDates } from "~/utils/dates";
import { generateSupportedLocales, getItemLocale } from "~/utils/internationalization";
import { MDXComponents, MDXScope } from "~/utils/mdx";
import { ROUTES } from "~/utils/routing";

type T_BlogPostPageProps = {
  post: T_BlogPost;
  content: string;
};

function BlogPostPage({ post, content }: T_BlogPostPageProps): T_ReactElement {
  const { SiteTexts, currentLocale } = useInternationalization({
    page: ROUTES.BLOG,
    layout: true,
  });

  const mdxContent = hydrate(content, { components: MDXComponents });

  return (
    <Page
      config={{
        title: post[currentLocale]?.title,
        pathname: `${ROUTES.BLOG}/${post.slug}`,
        description: post[currentLocale]?.description,
      }}
    >
      <MainLayout
        locales={generateSupportedLocales(post.locales, `${ROUTES.BLOG}/${[post.slug]}`)}
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: ROUTES.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.blog,
            url: ROUTES.BLOG,
          },
          {
            text: BlogService.composeTitle(post, currentLocale),
          },
        ]}
        title={BlogService.composeTitle(post, currentLocale)}
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

type T_Path = { params: { slug: string }; locale: T_Locale };

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async function getStaticPaths() {
  return {
    paths: (await BlogService.fetchPosts()).reduce((result: T_Path[], post: T_BlogPost) => {
      return result.concat(
        post.locales.map(
          (locale: T_Locale): T_Path => {
            return { params: { slug: post.slug }, locale };
          },
        ),
      );
    }, []),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  T_BlogPostPageProps,
  { slug: string }
> = async function getStaticProps({ params, locale }) {
  const post: T_BlogPost = await BlogService.getPost({ slug: params?.slug });
  const file = fs.readFileSync(
    `${process.cwd()}/src/data/blog/posts/${getItemLocale(
      post.locales,
      post.defaultLocale,
      locale as T_Locale,
    )}/${post.createdAt}-${post.slug}.mdx`,
    "utf8",
  );
  const content = await renderToString(file, {
    components: MDXComponents,
    scope: { DATA: { ...MDXScope.DATA, blog_post: post } },
  });

  return { props: { post, content } };
};

export default BlogPostPage;

// --- Components ---

type T_BlogPostFooterProps = Pick<T_BlogPost, "createdAt" | "publishedAt" | "slug" | "updatedAt">;

function BlogPostFooter({
  createdAt,
  publishedAt,
  slug,
  updatedAt,
}: T_BlogPostFooterProps): T_ReactElement {
  const { SiteTexts, currentLocale } = useInternationalization({
    page: ROUTES.BLOG,
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
            <span className="tw-mr-2">{SiteTexts.page.current_locale.published_at}</span>
            <strong>{formatDate(publishedAt)}</strong>
          </p>
        </BlogPostFooterItem>
        <BlogPostFooterItem>
          <BlogPostFooterItem.Icon icon={Icon.icon.EDIT} />
          <p>
            <span className="tw-mr-2">{SiteTexts.page.current_locale.updated_at}</span>
            <strong>{getDifferenceBetweenDates(updatedAt, new Date())}</strong>
          </p>
        </BlogPostFooterItem>
      </div>
      <div className="tw-w-full sm:tw-w-1/2 tw-flex tw-items-start tw-justify-center tw-flex-col sm:tw-items-end tw-mt-2 sm:tw-mt-0">
        <BlogPostFooterItem
          is={Button}
          data-clipboard-text={`${WEBSITE_METADATA.url}${ROUTES.BLOG}/${slug}`}
          onClick={copyToClipboard}
        >
          <BlogPostFooterItem.Icon icon={Icon.icon.LINK} />
          <span>{SiteTexts.page.current_locale.copy_url_to_clipboard}</span>
        </BlogPostFooterItem>
        <BlogPostFooterItem
          is={Link}
          href={generateBlogPostRawContentLink()}
          variant={Link.variant.UNSTYLED}
        >
          <BlogPostFooterItem.Icon icon={Icon.icon.CODE} />
          <span>{SiteTexts.page.current_locale.see_publication_source_code}</span>
        </BlogPostFooterItem>
      </div>
    </Blockquote>
  );
}

const BlogPostFooterItem = twcss.div`tw-flex tw-items-start sm:tw-items-center tw-justify-start tw-mb-2 last:tw-mb-0 tw-text-sm tw-text-left`;

BlogPostFooterItem.Icon = twcss(Icon)("", {
  wrapperClassName: "tw-mr-2 tw-relative tw-top-0.5 sm:tw-top-0",
});
