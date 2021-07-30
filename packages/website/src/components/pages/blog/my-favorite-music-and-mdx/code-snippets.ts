const CODE = {
  ONE: `export function HelloWorldMDX({ text }: T_Object): T_ReactElement {
  return (
    <p className="tw-bg-red-200 tw-block tw-p-2 tw-text-red-700 tw-rounded-md">{text}</p>
  );
}`,

  TWO: `import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";`,

  THREE: `import { MDXComponents, MDXScope } from "~/utils/mdx";`,

  FOUR: `type T_Path = { params: { slug: string }; locale: T_Locale };

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async function getStaticPaths() {
  return {
    paths: (await BlogService.fetchPosts()).reduce((result: T_Path[], post: T_BlogPost) => {
      return result.concat(
        post.locales.map(
          (locale: T_Locale): T_Path => {
            return { params: { slug: post.slug }, locale };
          },
        ),
      );
    }, []),
    fallback: false,
  };
};`,

  FIVE: `export const getStaticProps: GetStaticProps<
  T_BlogPostPageProps,
  { slug: string }
> = async function getStaticProps({ params, locale }) {
  const post: T_BlogPost = await BlogService.fetchPost({ slug: params?.slug });
  const file = fs.readFileSync(
    \`\${process.cwd()}/src/data/blog/posts/\${getItemLocale(
      post.locales,
      post.defaultLocale,
      locale as T_Locale,
    )}/\${post.createdAt}-\${post.slug}.mdx\`,
    "utf8",
  );

  const postSlug = post.slug;
  const codeSnippets = fs.existsSync(
    \`\${process.cwd()}/src/components/pages/blog/\${postSlug}/code.ts\`,
  )
    ? require(\`src/components/pages/blog/\${postSlug}/code.ts\`).default // eslint-disable-line @typescript-eslint/no-var-requires
    : {};

  const content = await renderToString(file, {
    components: MDXComponents,
    scope: {
      DATA: {
        ...MDXScope.DATA,
        blogPost: {
          ...post,
          codeSnippets,
        },
      },
    },
  });

  return { props: { post, content } };
};`,

  SIX: `type T_BlogPostPageProps = {
  post: T_BlogPost;
  content: string;
};

function BlogPostPage({ post, content }: T_BlogPostPageProps): T_ReactElement {
  const { SiteTexts, currentLocale } = useTranslation({
    page: ROUTES.BLOG,
    layout: true,
  });

  const mdxContent = hydrate(content, { components: MDXComponents });

  return (
    <Page
      config={{
        title: post[currentLocale]?.title,
        pathname: \`\${ROUTES.BLOG}/\${post.slug}\`,
        description: post[currentLocale]?.description,
      }}
    >
      <MainLayout
        locales={generateSupportedLocales(post.locales, \`\${ROUTES.BLOG}/\${[post.slug]}\`)}
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: ROUTES.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.blog,
            url: ROUTES.BLOG,
          },
          {
            text: BlogService.composeTitle(post, currentLocale),
          },
        ]}
        title={BlogService.composeTitle(post, currentLocale)}
        showGoToTopButton
      >
        <MDXContent content={mdxContent} />
        <Space size={8} />

        <BlogPostFooter
          createdAt={post.createdAt}
          publishedAt={post.publishedAt}
          slug={post.slug}
          updatedAt={post.updatedAt}
        />
      </MainLayout>
    </Page>
  );
}`,

  SEVEN: `import React from "react";

import { T_ReactChildrenProp, T_ReactElement } from "~/types";
import { mirror } from "~/utils/misc";

type T_Variants = "DEFAULT" | "UNSTYLED";
const VARIANTS = mirror(["DEFAULT", "UNSTYLED"]) as Record<T_Variants, T_Variants>;

type T_MDXContentProps = {
  content: T_ReactChildrenProp;
  variant?: T_Variants;
};

function MDXContent({ content, variant = VARIANTS.DEFAULT }: T_MDXContentProps): T_ReactElement {
  return (
    <article className={\`dfr-MDXContent dfr-MDXContent--\${variant.toLowerCase()}\`}>
      {content}

      <style jsx>{\`
        /* Spacing: parent components */
        :global(.dfr-MDXContent--default) > :global(blockquote),
        :global(.dfr-MDXContent--default) > :global(hr),
        :global(.dfr-MDXContent--default) > :global(img),
        :global(.dfr-MDXContent--default) > :global(ol),
        :global(.dfr-MDXContent--default) > :global(p),
        :global(.dfr-MDXContent--default) > :global(pre),
        :global(.dfr-MDXContent--default) > :global(ul),
        :global(.dfr-MDXContent--default) :global(*[data-markdown-block]) {
          @apply tw-mb-6;
        }

        /* Spacing: nested components */
        :global(.dfr-MDXContent--default) :global(li) > :global(p),
        :global(.dfr-MDXContent--default) :global(li) > :global(pre),
        :global(.dfr-MDXContent--default) :global(li) > :global(blockquote),
        :global(.dfr-MDXContent--default) :global(li) > :global(img),
        :global(.dfr-MDXContent--default) :global(blockquote) > :global(p) {
          @apply tw-mb-3;
        }

        /* Spacing: titles */
        :global(.dfr-MDXContent--default) > :global(h1),
        :global(.dfr-MDXContent--default) > :global(h2),
        :global(.dfr-MDXContent--default) > :global(h3),
        :global(.dfr-MDXContent--default) > :global(h4) {
          @apply tw-mt-6;
          @apply tw-mb-3;
        }

        /* Spacing: nested UL lists */
        :global(.dfr-MDXContent--default) :global(li) > :global(ul) {
          @apply tw-mt-3;
        }

        /* Ordered lists */
        :global(.dfr-MDXContent--default) :global(ol) {
          @apply tw-pl-9;
          list-style-type: decimal;
        }

        :global(.dfr-MDXContent--default) :global(ol) > :global(li) {
          @apply tw-mb-6;
        }

        /* Images */
        :global(.dfr-MDXContent--default) > :global(img),
        :global(.dfr-MDXContent--default) :global(li) > :global(img) {
          margin-left: auto;
          margin-right: auto;
        }
      \`}</style>
    </article>
  );
}

MDXContent.variant = VARIANTS;

export default MDXContent;`,

  EIGHT: `import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from "prism-react-renderer/themes/dracula";

import { Link, Icon, Code as CodePrimitive, Button } from "~/components/primitive";
import twcss from "~/lib/twcss";
import { T_CodeProps, T_ReactElement } from "~/types";
import { copyToClipboard } from "~/utils/browser";
import { getSiteTexts } from "~/utils/internationalization";
import { ROUTES } from "~/utils/routing";
import { generateSlug } from "~/utils/strings";

function Code({ language, fileName, code, sourceURL }: T_CodeProps): T_ReactElement {
  const SiteTexts = getSiteTexts({ page: ROUTES.BLOG });

  return (
    <div
      className="root tw-rounded-md tw-border dfr-border-color-primary dark:tw-bg-gray-700"
      data-markdown-block
    >
      <div className="tw-flex tw-items-center tw-justify-between tw-flex-wrap tw-px-2 tw-py-2 tw-text-sm tw-font-mono">
        <code className="tw-w-full sm:tw-w-auto tw-font-bold">
          {fileName
            ? \`// \${generateSlug(fileName)}\`
            : sourceURL
            ? \`// \${sourceURL.slice(sourceURL.lastIndexOf("/") + 1, sourceURL.length)}\`
            : ""}
        </code>
        <span className="tw-rounded-md tw-bg-yellow-300 tw-text-yellow-700 tw-text-xs tw-px-3 tw-py-1 tw-inline-block tw-font-bold tw-flex-shrink-0 tw-ml-auto sm:tw-ml-4 tw-mt-2 sm:tw-mt-0">
          {language}
        </span>
      </div>

      <Highlight
        {...defaultProps}
        code={code}
        language={language}
        theme={dracula}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          return (
            <CodePrimitive className={className} style={style}>
              {tokens.map((line, i) => {
                return (
                  <Line key={i} {...getLineProps({ line, key: i })}>
                    <LineNo>{i + 1}</LineNo>
                    <LineContent>
                      {line.map((token, key) => {
                        return <span key={key} {...getTokenProps({ token, key })} />;
                      })}
                    </LineContent>
                  </Line>
                );
              })}
            </CodePrimitive>
          );
        }}
      </Highlight>
      <div className="tw-p-2 tw-pt-1.5 tw-text-sm tw-text-right">
        {sourceURL && (
          <Link
            className="tw-block sm:tw-inline-block tw-ml-auto tw-font-bold sm:tw-mr-6 tw-mb-1 sm:tw-mb-0"
            href={sourceURL}
            variant={Link.variant.SIMPLE}
          >
            <Icon
              icon={Icon.icon.GITHUB}
              wrapperClassName="tw-align-middle tw-mr-1.5"
              withDarkModeBackground
            />
            <span className="tw-align-middle tw-inline-block">
              {SiteTexts.page.current_locale.see_source_code}
            </span>
          </Link>
        )}
        <Button
          className="tw-block sm:tw-inline-block tw-ml-auto tw-font-bold tw-align-middle"
          data-clipboard-text={code}
          onClick={copyToClipboard}
        >
          {SiteTexts.page.current_locale.copy_to_clipboard}
        </Button>
      </div>
    </div>
  );
}

export default Code;

// --- Components ---

const Line = twcss.div\`tw-table-row\`;
const LineNo = twcss.span\`tw-table-cell tw-text-right tw-pr-4 tw-opacity-50 tw-select-none\`;
const LineContent = twcss.span\`tw-table-cell\`;`,
};

export default CODE;
