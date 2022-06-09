import { I18nService } from "~/i18n";
import http from "~/lib/http";
import type { T_BlogPost, T_ItemCategory, T_Primitive } from "~/types";
import { sortBy, transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/misc";

class BlogService {
  constructor() {
    this.fetchPosts = this.fetchPosts.bind(this);
  }

  async fetchPosts(locale?: string): Promise<T_BlogPost[]> {
    const { posts, categories } = await this.fetchData();

    const result = Object.values(posts)
      .map(
        (post: T_UnknownObject) =>
          ({
            ...post[
              I18nService.getContentLocale(
                post.config.locales,
                locale || I18nService.getCurrentLocale(),
                post.config.locales[0],
              )
            ],
            ...(transformObjectKeysFromSnakeCaseToLowerCamelCase(post.config) as T_UnknownObject),
            assets: post.assets,
            categories: post.config.categories
              .map((category) => categories.find((item) => item.id === category))
              .filter(Boolean)
              .sort(sortBy([{ param: "value", order: "asc" }])),
          } as T_BlogPost),
      )
      .sort(sortBy([{ param: "publishedAt", order: "desc" }]));

    return result;
  }

  async fetchPost(config: Record<"slug" | "locale", T_Primitive>): Promise<T_BlogPost> {
    const posts = await this.fetchPosts(config.locale as string);
    const post = posts.find((post) => post.slug === config.slug);

    if (post === undefined) {
      throw new Error(`Post not found. { config: "${JSON.stringify(config)}" }`);
    }

    return transformObjectKeysFromSnakeCaseToLowerCamelCase(post) as T_BlogPost;
  }

  private async fetchData(): Promise<{ posts: T_UnknownObject[]; categories: T_ItemCategory[] }> {
    const { data } = await http.get(
      `${process.env["NEXT_PUBLIC_ASSETS_SERVER_URL"]}/pages/blog/data.json`,
    );

    return data;
  }
}

export default new BlogService();
