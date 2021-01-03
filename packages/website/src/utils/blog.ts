import { posts as BlogPosts } from "~/data/blog/posts.json";
import { TypeLocale, TypeBlogPost } from "~/types";

export function getBlogTitle(post: TypeBlogPost, locale: TypeLocale): string {
  return `${post.is_legacy ? "[LEGACY] " : ""}${post[locale].title}`;
}

// TODO: Improve this types (avoid casting many times)
export function getBlogPosts(): TypeBlogPost[] {
  const result: TypeBlogPost[] = ((Object.values(BlogPosts) as TypeBlogPost[]).filter(
    (post: TypeBlogPost) => {
      return post.is_published === true;
    },
  ) as TypeBlogPost[]).sort(sortBlogPostsByPublishedDate);

  return result;
}

function sortBlogPostsByPublishedDate(a: TypeBlogPost, b: TypeBlogPost): number {
  if (a.published_at > b.published_at) {
    return -1;
  }

  if (a.published_at < b.published_at) {
    return 1;
  }

  return 0;
}
