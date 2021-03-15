import React, { useState, Fragment } from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout } from "~/components/layout";
import { Image, Link, Separator } from "~/components/primitive";
import { MDXContent } from "~/components/shared";
import GITHUB from "~/data/github.json";
import { posts as BlogPosts } from "~/data/blog/posts.json";
import { WEBSITE_METADATA } from "~/data/metadata.json";
import Routes from "~/data/routes.json";
import { useInternationalization, useAssets, useDidMount } from "~/hooks";
import twcss from "~/lib/twcss";
import BlogService from "~/services/blog";
import { TypeBlogPost, TypeLocale, TypePagesRoutes } from "~/types";
import {
  copyToClipboard,
  getScrollPosition,
  onScrollStoppedListener,
  setScrollPosition,
} from "~/utils/browser";
import { formatDate, getDifferenceBetweenDates } from "~/utils/dates";
import { generateSupportedLocales, getItemLocale } from "~/utils/internationalization";
import { MDXComponentsConfig, MDXScope } from "~/utils/mdx";

type TypeBlogPostPageProps = {
  post: TypeBlogPost;
  content: any;
};

function BlogPostPage({ post, content }: TypeBlogPostPageProps): any {
  const { SiteTexts, currentLocale } = useInternationalization({
    page: Routes.BLOG as TypePagesRoutes,
    layout: true,
  });

  const mdxContent = hydrate(content, { components: MDXComponentsConfig });

  return (
    <Page
      config={{
        title: post[currentLocale]?.title,
        pathname: `${Routes.BLOG}/${post.slug}`,
        description: post[currentLocale]?.description,
        assets: ["blog_post"],
      }}
    >
      <MainLayout
        locales={generateSupportedLocales(post.locales, `${Routes.BLOG}/${[post.slug]}`)}
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: Routes.HOME as TypePagesRoutes,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.blog,
            url: Routes.BLOG as TypePagesRoutes,
          },
          {
            text: BlogService.composeTitle(post, currentLocale),
          },
        ]}
        title={BlogService.composeTitle(post, currentLocale)}
      >
        <MDXContent content={mdxContent} />
        <BlogPostFooter
          createdAt={post.created_at}
          publishedAt={post.published_at}
          slug={post.slug}
          title={BlogService.composeTitle(post, currentLocale)}
          updatedAt={post.updated_at}
        />
      </MainLayout>
    </Page>
  );
}

// TODO: Next types
export async function getStaticPaths(): Promise<Record<string, any>> {
  return {
    paths: (await BlogService.fetchPosts()).reduce((result, post: TypeBlogPost) => {
      return result.concat(
        post.locales.map((locale: TypeLocale) => {
          return { params: { slug: post.slug }, locale };
        }),
      );
    }, [] as Array<any>),
    fallback: false,
  };
}

// TODO: Next types
export async function getStaticProps({
  params,
  locale,
}: Record<string, any>): Promise<Record<string, any>> {
  const post: TypeBlogPost = BlogPosts[params.slug];
  const file = fs.readFileSync(
    `${process.cwd()}/src/data/blog/posts/${getItemLocale(
      post.locales,
      post.default_locale,
      locale,
    )}/${post.created_at}-${post.slug}.mdx`,
    "utf8",
  );
  const content = await renderToString(file, {
    components: MDXComponentsConfig,
    scope: { DATA: { ...MDXScope.DATA, blog_post: post } },
  });

  return { props: { post, content } };
}

export default BlogPostPage;

// --- Components ---

type TypeBlogPostFooterProps = {
  createdAt: string;
  publishedAt: string;
  slug: string;
  title: string;
  updatedAt: string;
};

function BlogPostFooter({
  createdAt,
  publishedAt,
  slug,
  title,
  updatedAt,
}: TypeBlogPostFooterProps): any {
  const { BlogPostAssets } = useAssets();
  const { SiteTexts, currentLocale } = useInternationalization({
    page: Routes.BLOG as TypePagesRoutes,
    layout: true,
  });

  const [showGoToTopButton, setShowGoToTopButton] = useState(false);

  useDidMount(() => {
    onScrollStoppedListener({
      onScroll: () => {
        if (getScrollPosition() > 0) {
          setShowGoToTopButton(true);
        } else {
          setShowGoToTopButton(false);
        }
      },
      onScrollStopped: () => {
        setShowGoToTopButton(false);
      },
      timeout: 3000,
    });
  });

  function generateBlogPostRawContentLink() {
    return GITHUB.monorepo.website.files["raw-post"]
      .replace("CURRENT_LOCALE", currentLocale)
      .replace("FILE_NAME", `${createdAt}-${slug}`);
  }

  return (
    <Fragment>
      <Separator size={8} />

      {/*
      <div className="tw-mb-4 tw-flex-1 tw-flex tw-items-center tw-text-sm">
        <p className="tw-mr-4 tw-italic">
          {SiteTexts.page.current_locale.like_blog_post}
        </p>
        <button
          className="tw-border dfr-border-color-primary dark:dfr-border-color-primary dfr-bg-secondary dark:dfr-bg-secondary tw-flex tw-items-center tw-flex-shrink-0 tw-rounded-md tw-text-sm"
          onClick={() => {
            alert("En progreso...");
          }}
        >
          <Emoji className="tw-px-2">👍</Emoji>
          <div className="tw-border-l dfr-border-color-primary dark:dfr-border-color-primary tw-flex tw-items-center tw-px-2 tw-py-1 tw-h-full">
            <span className="tw-relative tw--top-2px tw-font-bold">0</span>
          </div>
        </button>
      </div>
      */}

      <div className="dfr-border-color-primary tw-border-l-4 tw-pl-4 tw-flex tw-flex-wrap sm:tw-flex-no-wrap tw-my-4">
        <div className="tw-w-full sm:tw-w-1/2 tw-flex tw-items-start tw-justify-center tw-flex-col">
          <BlogPostFooterItem>
            <BlogPostFooterItem.Icon
              src={BlogPostAssets.CALENDAR}
              alt="Calendar icon"
              tw-variant="withoutDarkMode"
            />
            <span className="tw-mr-1">{SiteTexts.page.current_locale.published_at}</span>
            <strong>{formatDate(publishedAt)}</strong>
          </BlogPostFooterItem>
          <BlogPostFooterItem>
            <BlogPostFooterItem.Icon src={BlogPostAssets.UPDATED} alt="Document updated icon" />
            <span className="tw-mr-1">{SiteTexts.page.current_locale.updated_at}</span>
            <strong>{getDifferenceBetweenDates(updatedAt, new Date())}</strong>
          </BlogPostFooterItem>
        </div>
        <div className="tw-w-full sm:tw-w-1/2 tw-flex tw-items-start sm:tw-items-end tw-justify-center tw-flex-col">
          <BlogPostFooterItem
            is="button"
            className="clipboard"
            tw-variant="withHover"
            data-clipboard-text={`${title} - ${WEBSITE_METADATA.url}${Routes.BLOG}/${slug} via @${WEBSITE_METADATA.username}`}
            onClick={copyToClipboard}
          >
            <BlogPostFooterItem.Icon src={BlogPostAssets.LINK} alt="Link icon" />
            <span>{SiteTexts.page.current_locale.copy_url_to_clipboard}</span>
          </BlogPostFooterItem>
          <BlogPostFooterItem
            is={Link}
            href={generateBlogPostRawContentLink()}
            styled={false}
            tw-variant="withHover"
          >
            <BlogPostFooterItem.Icon src={BlogPostAssets.SOURCE_CODE} alt="Source code icon" />
            <span>{SiteTexts.page.current_locale.see_publication_source_code}</span>
          </BlogPostFooterItem>
        </div>
      </div>
      {showGoToTopButton && <GoToTopButton />}
    </Fragment>
  );
}

function GoToTopButton() {
  return (
    <button
      className="root tw-fixed tw-text-2xl tw-bottom-2 tw-right-2 tw-rounded-lg tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-transition-opacity hover:tw-opacity-75"
      onClick={() => {
        setScrollPosition(0);
      }}
    >
      <span className="tw-relative tw--top-0.5 tw-text-white tw-font-bold">↑</span>

      <style jsx>{`
        .root {
          background-color: rgba(0, 0, 0, 0.75);
        }
      `}</style>
    </button>
  );
}

const BlogPostFooterItem = twcss.div({
  __base: `tw-flex tw-items-center tw-justify-start tw-my-1 tw-text-sm tw-text-left`,
  withHover: "tw-transition-opacity hover:tw-opacity-75",
});

BlogPostFooterItem.Icon = twcss(Image)(
  {
    __base: "tw-inline-block tw-h-4 tw-w-4 tw-mr-2",
    withDarkMode: "dark:tw-rounded-md dark:dfr-bg-secondary dark:tw-p-1",
    withoutDarkMode: "",
  },
  {
    "tw-variant": "withDarkMode",
  },
);
