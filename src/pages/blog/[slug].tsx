import { GetStaticPaths } from "next";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

import BlogPostPage from "~/components/pages/blog/[slug]";
import { getPageContentStaticProps } from "~/i18n";
import BlogService from "~/services/blog";
import { dataLoader } from "~/server";
import type { T_BlogPost, T_Locale } from "~/types";
import { MDXScope } from "~/utils/mdx";
import { ROUTES } from "~/utils/routing";
import { replaceAll } from "~/utils/strings";

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
  { post: T_BlogPost; postMDXContent: MDXRemoteSerializeResult },
  { slug: string }
>({
  page: [ROUTES.BLOG, ROUTES.BLOG_DETAILS],
  localesExtractor: (data) => {
    return data.post.locales;
  },
  callback: async ({ params, locale }) => {
    const post = await BlogService.fetchPost({ slug: params?.slug, locale: locale });
    const file = (await dataLoader({
      path: `/pages/blog/[slug]/${locale}/${replaceAll(post.createdAt, "/", "-")}-${post.slug}.mdx`,
    })) as string;
    const postMDXContent = await serialize(file, {
      scope: {
        DATA: {
          ...MDXScope.DATA,
          post,
        },
      },
    });

    return {
      props: {
        post,
        postMDXContent,
      },
    };
  },
});
