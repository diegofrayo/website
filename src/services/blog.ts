import { I18nService } from "~/i18n";
import http from "~/lib/http";
import { T_BlogPost, T_BlogPostCategory, T_Object, T_Primitive } from "~/types";
import {
  isDevelopmentEnvironment,
  sortBy,
  transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/utils/misc";

class BlogService {
  constructor() {
    this.fetchPosts = this.fetchPosts.bind(this);
  }

  async fetchPosts(): Promise<T_BlogPost[]> {
    const { posts, categories } = await this.fetchData();

    const result = Object.values(posts)
      .map((post: T_Object) => {
        return {
          ...post[I18nService.getCurrentLocale()],
          ...(transformObjectKeysFromSnakeCaseToLowerCamelCase(post.config) as T_Object),
          assets: post.assets,
          categories: post.config.categories
            .map((category) => {
              return categories.find((item) => item.id === category);
            })
            .filter(Boolean)
            .sort(sortBy([{ param: "value", order: "asc" }])),
        } as T_BlogPost;
      })
      .filter((post: T_BlogPost) => {
        return isDevelopmentEnvironment() || post.isPublished;
      })
      .sort(sortBy([{ param: "publishedAt", order: "desc" }]));

    return result;
  }

  async fetchPost(config: Record<"slug", T_Primitive>): Promise<T_BlogPost> {
    const posts = await this.fetchPosts();
    const post = posts.find((post) => post.slug === config.slug);

    if (post === undefined) {
      throw new Error(`Post not found. { config: "${JSON.stringify(config)}" }`);
    }

    return transformObjectKeysFromSnakeCaseToLowerCamelCase(post) as T_BlogPost;
  }

  composeTitle(post: T_BlogPost): string {
    return `${post.isLegacy ? "[LEGACY] " : ""}${post.title}`;
  }

  private async fetchData(): Promise<{ posts: T_Object[]; categories: T_BlogPostCategory[] }> {
    const response = await http.get(
      `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/pages/blog/data.json`,
    );
    return response.data;
  }
}

export default new BlogService();
