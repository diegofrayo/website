import Data from "~/data/blog/posts.json";
import { T_Locale, T_BlogPost, T_Primitive } from "~/types";
import { sortBy } from "~/utils/misc";

class BlogService {
  composeTitle(post: T_BlogPost, locale: T_Locale): string {
    return `${post.is_legacy ? "[LEGACY] " : ""}${post[locale]?.title}`;
  }

  async fetchPosts(): Promise<T_BlogPost[]> {
    const result: T_BlogPost[] = ((Object.values(Data.posts) as T_BlogPost[]).filter(
      (post: T_BlogPost) => {
        return post.config.is_published === true;
      },
    ) as T_BlogPost[]).sort(sortBy([{ param: "published_at", order: "desc" }]));

    return result;
  }

  async getPost(config: Record<"slug", T_Primitive>): Promise<T_BlogPost> {
    const posts = await this.fetchPosts();
    const post = posts.find(post => post.slug === config.slug);

    if (post === undefined) {
      throw new Error(`Post not found. { config: "${JSON.stringify(config)}" }`);
    }

    return post;
  }
}

export default new BlogService();
