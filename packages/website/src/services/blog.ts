import Data from "~/data/blog/posts.json";
import { TypeLocale, TypeBlogPost } from "~/types";
import { sortBy } from "~/utils/misc";

function composeTitle(post: TypeBlogPost, locale: TypeLocale): string {
  return `${post.is_legacy ? "[LEGACY] " : ""}${post[locale]?.title}`;
}

// TODO: Improve this types (avoid casting many times)
async function fetchPosts(): Promise<TypeBlogPost[]> {
  const result: TypeBlogPost[] = ((Object.values(Data.posts) as TypeBlogPost[]).filter(
    (post: TypeBlogPost) => {
      return post.config.is_published === true;
    },
  ) as TypeBlogPost[]).sort(sortBy([{ param: "published_at", order: "desc" }]));

  return result;
}

export default {
  composeTitle,
  fetchPosts,
};
