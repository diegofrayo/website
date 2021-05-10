import Data from "~/data/blog/posts.json";
import { T_Locale, T_BlogPost, T_Primitive } from "~/types";
import { isBrowser } from "~/utils/browser";
import {
  isUserLoggedIn,
  sortBy,
  transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/utils/misc";

class BlogService {
  async fetchPosts(): Promise<T_BlogPost[]> {
    const result = (
      Object.values(Data.posts).map(
        transformObjectKeysFromSnakeCaseToLowerCamelCase,
      ) as T_BlogPost[]
    )
      .filter((post: T_BlogPost) => {
        return isBrowser() ? isUserLoggedIn() || post.config.isPublished : true;
      })
      .sort(sortBy([{ param: "publishedAt", order: "desc" }]));

    return result;
  }

  async getPost(config: Record<"slug", T_Primitive>): Promise<T_BlogPost> {
    const posts = await this.fetchPosts();
    const post = posts.find((post) => post.slug === config.slug);

    if (post === undefined) {
      throw new Error(`Post not found. { config: "${JSON.stringify(config)}" }`);
    }

    return transformObjectKeysFromSnakeCaseToLowerCamelCase(post) as T_BlogPost;
  }

  composeTitle(post: T_BlogPost, locale: T_Locale): string {
    return `${post.isLegacy ? "[LEGACY] " : ""}${post[locale]?.title}`;
  }
}

export default new BlogService();
