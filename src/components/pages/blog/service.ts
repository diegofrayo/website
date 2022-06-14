import http from "~/lib/http";
import { I18nService, T_Locale } from "~/i18n";
import { ENV_VARS } from "~/utils/constants";
import {
  sortBy,
  transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/utils/objects-and-arrays";
import { isNotUndefined, notFound } from "~/utils/validations";
import type { T_Object, T_UnknownObject } from "~/types";

class BlogService {
  constructor() {
    this.fetchPosts = this.fetchPosts.bind(this);
  }

  async fetchPosts(locale?: T_Locale): Promise<T_BlogPost[]> {
    const { posts, categories } = await this.fetchData();

    const result = Object.values(posts)
      .map((blogPost) => BlogPostVO(blogPost, categories, locale))
      .sort(sortBy([{ param: "publishedAt", order: "desc" }]));

    return result;
  }

  async fetchPost(criteria: { locale: T_Locale; slug: T_BlogPost["slug"] }): Promise<T_BlogPost> {
    const posts = await this.fetchPosts(criteria.locale);
    const post = posts.find((item) => item.slug === criteria.slug);

    if (notFound(post)) {
      throw new Error(`Post not found. { criteria: "${JSON.stringify(criteria)}" }`);
    }

    return post;
  }

  private async fetchData(): Promise<{
    posts: T_BlogPostFetchDTO[];
    categories: T_BlogPostCategory[];
  }> {
    const { data } = await http.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
      path: "/data",
      model: "blog",
    });

    return data;
  }
}

export default new BlogService();

// --- Value objects ---

// TODO: Validate scheme using a library and infer its types
function BlogPostVO(
  blogPostData: T_BlogPostFetchDTO,
  categories: T_BlogPostCategory[],
  locale?: T_Locale,
): T_BlogPost {
  let blogPost = transformObjectKeysFromSnakeCaseToLowerCamelCase<T_BlogPost>(blogPostData);

  blogPost = {
    ...blogPost,
    ...transformObjectKeysFromSnakeCaseToLowerCamelCase(blogPostData.config),
    ...transformObjectKeysFromSnakeCaseToLowerCamelCase(
      blogPostData[
        I18nService.getContentLocale({
          locales: blogPostData.config.locales,
          currentLocale: locale || I18nService.getCurrentLocale(),
          defaultLocale: blogPostData.config.locales[0],
        })
      ],
    ),
  };

  blogPost.categories = (
    blogPostData.config.categories
      .map((category): T_BlogPostCategory | undefined => {
        return categories.find((item) => item.id === category);
      })
      .filter((category) => isNotUndefined(category)) as T_BlogPostCategory[]
  ).sort(sortBy([{ param: "value", order: "asc" }]));

  return blogPost;
}

// --- Types ---

export type T_BlogPost = {
  title: string;
  description: string;
  slug: string;
  categories: T_BlogPostCategory[];
  locales: T_Locale[];
  thumbnail: string;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  isPublished: boolean;
  assets?: T_UnknownObject;
};

type T_BlogPostCategory = { id: "tech" | "personal"; value: string };

type T_BlogPostFetchDTO = {
  config: {
    slug: string;
    categories: Array<T_BlogPostCategory["id"]>;
    locales: T_Locale[];
    created_at: string;
    published_at: string;
    updated_at: string;
    is_published: boolean;
  };
  en: {
    title: string;
    description: string;
  };
  assets: T_Object<string>;
};
