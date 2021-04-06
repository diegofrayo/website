import React, { useState, Fragment } from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout } from "~/components/layout";
import { Icon, Link, Space } from "~/components/primitive";
import { MDXContent } from "~/components/pages/_shared";
import { useInternationalization, useDidMount } from "~/hooks";
import twcss from "~/lib/twcss";
import BlogService from "~/services/blog";
import { TypeBlogPost, TypeLocale } from "~/types";
import {
  copyToClipboard,
  getScrollPosition,
  onScrollStoppedListener,
  setScrollPosition,
} from "~/utils/browser";
import { WebsiteMetadata, GithubData } from "~/utils/constants";
import { formatDate, getDifferenceBetweenDates } from "~/utils/dates";
import { generateSupportedLocales, getItemLocale } from "~/utils/internationalization";
import { MDXComponentsConfig, MDXScope } from "~/utils/mdx";
import { Routes } from "~/utils/routing";

type TypeBlogPostPageProps = {
  post: TypeBlogPost;
  content: any;
};

function BlogPostPage({ post, content }: TypeBlogPostPageProps): any {
  const { SiteTexts, currentLocale } = useInternationalization({
    page: Routes.BLOG,
    layout: true,
  });

  const mdxContent = hydrate(content, { components: MDXComponentsConfig });

  return (
    <Page
      config={{
        title: post[currentLocale]?.title,
        pathname: `${Routes.BLOG}/${post.slug}`,
        description: post[currentLocale]?.description,
        assets: ["blog"],
      }}
    >
      <MainLayout
        locales={generateSupportedLocales(post.locales, `${Routes.BLOG}/${[post.slug]}`)}
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: Routes.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.blog,
            url: Routes.BLOG,
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
  const post: TypeBlogPost = await BlogService.getPost({ slug: params.slug });
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
  updatedAt: string;
};

function BlogPostFooter({ createdAt, publishedAt, slug, updatedAt }: TypeBlogPostFooterProps): any {
  const { SiteTexts, currentLocale } = useInternationalization({
    page: Routes.BLOG,
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
    return GithubData.monorepo.website.files["raw-post"]
      .replace("CURRENT_LOCALE", currentLocale)
      .replace("FILE_NAME", `${createdAt}-${slug}`);
  }

  return (
    <Fragment>
      <Space size={8} />

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

      <div className="dfr-border-color-primary tw-border-l-4 tw-pl-4 tw-flex tw-flex-wrap sm:tw-flex-no-wrap tw-my-4 tw-text-black dark:tw-text-white">
        <div className="tw-w-full sm:tw-w-1/2 tw-flex tw-items-start tw-justify-center tw-flex-col">
          <BlogPostFooterItem>
            <BlogPostFooterItem.Icon icon={Icon.icon.CALENDAR} tw-variant="withoutDarkMode" />
            <span className="tw-mr-2">{SiteTexts.page.current_locale.published_at}</span>
            <strong>{formatDate(publishedAt)}</strong>
          </BlogPostFooterItem>
          <BlogPostFooterItem>
            <BlogPostFooterItem.Icon icon={Icon.icon.EDIT} />
            <span className="tw-mr-2">{SiteTexts.page.current_locale.updated_at}</span>
            <strong>{getDifferenceBetweenDates(updatedAt, new Date())}</strong>
          </BlogPostFooterItem>
        </div>
        <div className="tw-w-full sm:tw-w-1/2 tw-flex tw-items-start sm:tw-items-end tw-justify-center tw-flex-col">
          <BlogPostFooterItem
            is="button"
            className="clipboard"
            tw-variant="withHover"
            data-clipboard-text={`${WebsiteMetadata.url}${Routes.BLOG}/${slug}`}
            onClick={copyToClipboard}
          >
            <BlogPostFooterItem.Icon icon={Icon.icon.LINK} />
            <span>{SiteTexts.page.current_locale.copy_url_to_clipboard}</span>
          </BlogPostFooterItem>
          <BlogPostFooterItem
            is={Link}
            href={generateBlogPostRawContentLink()}
            variant={Link.variant.UNSTYLED}
            tw-variant="withHover"
          >
            <BlogPostFooterItem.Icon icon={Icon.icon.SOURCE_CODE} />
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
      className="root tw-fixed tw-text-2xl tw-bottom-3 sm:tw-bottom-4 tw-right-3 sm:tw-right-4 tw-rounded-lg tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-transition-opacity hover:tw-opacity-75"
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

BlogPostFooterItem.Icon = twcss(Icon)(
  {
    __base: "tw-inline-block tw-h-4 tw-w-4 tw-mr-2",
    withDarkMode: "dark:tw-rounded-md dark:dfr-bg-secondary dark:tw-p-1",
    withoutDarkMode: "",
  },
  {
    "tw-variant": "withDarkMode",
  },
);
