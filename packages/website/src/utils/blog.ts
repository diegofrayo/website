import { posts as BlogPosts } from "~/data/blog/posts.json";
import { TypeLocale, TypeBlogPost } from "~/types";
import { sortBy } from "./misc";

export function getBlogTitle(post: TypeBlogPost, locale: TypeLocale): string {
  return `${post.is_legacy ? "[LEGACY] " : ""}${post[locale]?.title}`;
}

// TODO: Improve this types (avoid casting many times)
export function getBlogPosts(): TypeBlogPost[] {
  const result: TypeBlogPost[] = ((Object.values(BlogPosts) as TypeBlogPost[]).filter(
    (post: TypeBlogPost) => {
      return post.is_published === true;
    },
  ) as TypeBlogPost[]).sort(sortBy("published_at", "desc"));

  return result;
}
