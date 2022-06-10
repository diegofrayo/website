import { GetStaticPaths } from "next";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

import BlogPostPage from "~/components/pages/blog/[slug]";
import { getPageContentStaticProps, T_Locale } from "~/i18n";
import BlogService, { T_BlogPost } from "~/services/blog";
import { dataLoader } from "~/server";
import { MDXScope } from "~/utils/mdx";
import { ROUTES } from "~/utils/routing";
import { replaceAll } from "~/utils/strings";

export default BlogPostPage;

// --- Next.js functions ---

type T_StaticPath = { slug: string };

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async function getStaticPaths() {
  return {
    paths: (await BlogService.fetchPosts()).reduce(
      (result: { params: T_StaticPath; locale: T_Locale }[], post: T_BlogPost) => {
        return result.concat(
          post.locales.map((locale: T_Locale) => {
            return { params: { slug: post.slug }, locale };
          }),
        );
      },
      [],
    ),
    fallback: "blocking",
  };
};

export const getStaticProps = getPageContentStaticProps<
  { post: T_BlogPost; postMDXContent: MDXRemoteSerializeResult },
  T_StaticPath
>({
  page: [ROUTES.BLOG, ROUTES.BLOG_DETAILS],
  localesExtractor: (data) => data.post.locales,
  callback: async ({ params, locale }) => {
    const post = await BlogService.fetchPost({ slug: params.slug, locale });
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
