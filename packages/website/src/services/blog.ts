import Data from "~/data/blog/posts.json";
import { TypeLocale, TypeBlogPost, TypePrimitive } from "~/types";
import { sortBy } from "~/utils/misc";

class BlogService {
  composeTitle(post: TypeBlogPost, locale: TypeLocale): string {
    return `${post.is_legacy ? "[LEGACY] " : ""}${post[locale]?.title}`;
  }

  async fetchPosts(): Promise<TypeBlogPost[]> {
    const result: TypeBlogPost[] = ((Object.values(Data.posts) as TypeBlogPost[]).filter(
      (post: TypeBlogPost) => {
        return post.config.is_published === true;
      },
    ) as TypeBlogPost[]).sort(sortBy([{ param: "published_at", order: "desc" }]));

    return result;
  }

  async getPost(config: Record<"slug", TypePrimitive>): Promise<TypeBlogPost> {
    const posts = await this.fetchPosts();
    const post = posts.find(post => post.slug === config.slug);

    if (post === undefined) {
      throw new Error(`Post not found. { config: "${JSON.stringify(config)}" }`);
    }

    return post;
  }
}

export default new BlogService();
