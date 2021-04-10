import React, { useState, Fragment } from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout } from "~/components/layout";
import { Blockquote, Icon, Link, Space, Button } from "~/components/primitive";
import { MDXContent } from "~/components/pages/_shared";
import { useInternationalization, useDidMount } from "~/hooks";
import twcss from "~/lib/twcss";
import BlogService from "~/services/blog";
import { T_BlogPost, T_Locale } from "~/types";
import { copyToClipboard, getScrollPosition, setScrollPosition } from "~/utils/browser";
import { WebsiteMetadata, GithubData } from "~/utils/constants";
import { formatDate, getDifferenceBetweenDates } from "~/utils/dates";
import { generateSupportedLocales, getItemLocale } from "~/utils/internationalization";
import { MDXComponents, MDXScope } from "~/utils/mdx";
import { Routes } from "~/utils/routing";

type T_BlogPostPageProps = {
  post: T_BlogPost;
  content: any;
};

function BlogPostPage({ post, content }: T_BlogPostPageProps): any {
  const { SiteTexts, currentLocale } = useInternationalization({
    page: Routes.BLOG,
    layout: true,
  });

  const mdxContent = hydrate(content, { components: MDXComponents });

  return (
    <Page
      config={{
        title: post[currentLocale]?.title,
        pathname: `${Routes.BLOG}/${post.slug}`,
        description: post[currentLocale]?.description,
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
          createdAt={post.createdAt}
          publishedAt={post.publishedAt}
          slug={post.slug}
          updatedAt={post.updatedAt}
        />
      </MainLayout>
    </Page>
  );
}

// TODO: Next types
export async function getStaticPaths(): Promise<Record<string, any>> {
  return {
    paths: (await BlogService.fetchPosts()).reduce((result, post: T_BlogPost) => {
      return result.concat(
        post.locales.map((locale: T_Locale) => {
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
  const post: T_BlogPost = await BlogService.getPost({ slug: params.slug });
  const file = fs.readFileSync(
    `${process.cwd()}/src/data/blog/posts/${getItemLocale(
      post.locales,
      post.defaultLocale,
      locale,
    )}/${post.createdAt}-${post.slug}.mdx`,
    "utf8",
  );
  const content = await renderToString(file, {
    components: MDXComponents,
    scope: { DATA: { ...MDXScope.DATA, blog_post: post } },
  });

  return { props: { post, content } };
}

export default BlogPostPage;

// --- Components ---

type T_BlogPostFooterProps = Pick<T_BlogPost, "createdAt" | "publishedAt" | "slug" | "updatedAt">;

function BlogPostFooter({ createdAt, publishedAt, slug, updatedAt }: T_BlogPostFooterProps): any {
  const { SiteTexts, currentLocale } = useInternationalization({
    page: Routes.BLOG,
    layout: true,
  });

  const [showGoToTopButton, setShowGoToTopButton] = useState<boolean>(false);

  useDidMount(() => {
    // TODO: Isolate this code

    function onScroll() {
      if (getScrollPosition() > 0) {
        setShowGoToTopButton(true);
      } else {
        setShowGoToTopButton(false);
      }
    }

    function onScrollStopped() {
      if (!mounted) return;
      setShowGoToTopButton(false);
    }

    let isScrolling = 0;
    let mounted = true;

    function onScrollCallback() {
      window.clearTimeout(isScrolling);

      onScroll();

      isScrolling = window.setTimeout(() => {
        onScrollStopped();
      }, 3000);
    }

    window.addEventListener("scroll", onScrollCallback, false);

    return () => {
      mounted = false;
      window.removeEventListener("scroll", onScrollCallback, false);
    };
  });

  function generateBlogPostRawContentLink() {
    return GithubData.monorepo.website.files["raw-post"]
      .replace("CURRENT_LOCALE", currentLocale)
      .replace("FILE_NAME", `${createdAt}-${slug}`);
  }

  return (
    <Fragment>
      <Space size={8} />
      <Blockquote
        className="tw-flex tw-flex-wrap sm:tw-flex-no-wrap tw-my-4 tw-text-black dark:tw-text-white"
        variant={Blockquote.variant.UNSTYLED}
      >
        <div className="tw-w-full sm:tw-w-1/2 tw-flex tw-items-start tw-justify-center tw-flex-col">
          <BlogPostFooterItem>
            <Icon icon={Icon.icon.CALENDAR} wrapperClassName="tw-mr-2" />
            <span className="tw-mr-2">{SiteTexts.page.current_locale.published_at}</span>
            <strong>{formatDate(publishedAt)}</strong>
          </BlogPostFooterItem>
          <BlogPostFooterItem>
            <Icon icon={Icon.icon.EDIT} wrapperClassName="tw-mr-2" />
            <span className="tw-mr-2">{SiteTexts.page.current_locale.updated_at}</span>
            <strong>{getDifferenceBetweenDates(updatedAt, new Date())}</strong>
          </BlogPostFooterItem>
        </div>
        <div className="tw-w-full sm:tw-w-1/2 tw-flex tw-items-start tw-justify-center tw-flex-col sm:tw-items-end tw-mt-2 sm:tw-mt-0">
          <BlogPostFooterItem
            is={Button}
            className="clipboard"
            data-clipboard-text={`${WebsiteMetadata.url}${Routes.BLOG}/${slug}`}
            onClick={copyToClipboard}
          >
            <Icon icon={Icon.icon.LINK} wrapperClassName="tw-mr-2" />
            <span>{SiteTexts.page.current_locale.copy_url_to_clipboard}</span>
          </BlogPostFooterItem>
          <BlogPostFooterItem
            is={Link}
            href={generateBlogPostRawContentLink()}
            variant={Link.variant.UNSTYLED}
          >
            <Icon icon={Icon.icon.CODE} wrapperClassName="tw-mr-2" />
            <span>{SiteTexts.page.current_locale.see_publication_source_code}</span>
          </BlogPostFooterItem>
        </div>
      </Blockquote>
      {showGoToTopButton && <GoToTopButton />}
    </Fragment>
  );
}

const BlogPostFooterItem = twcss.div`tw-flex tw-items-center tw-justify-start tw-mb-2 last:tw-mb-0 tw-text-sm tw-text-left`;

function GoToTopButton() {
  return (
    <Button
      className="root tw-fixed tw-text-2xl tw-bottom-3 sm:tw-bottom-4 tw-right-3 sm:tw-right-4 tw-rounded-lg tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-transition-opacity hover:tw-opacity-75"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
      onClick={() => {
        setScrollPosition(0);
      }}
    >
      <span className="tw-relative tw--top-0.5 tw-text-white tw-font-bold">↑</span>
    </Button>
  );
}
