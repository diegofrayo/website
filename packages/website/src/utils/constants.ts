const METADATA = {
  seo: {
    title: "Diego Rayo | Desarrollador de Software",
  },
  website: {
    email: "diegofrayo@gmail.com",
    fullName: "Diego Fernando Rayo Zamora",
    shortName: "Diego Rayo",
    username: "diegofrayo",
    jobTitle: "Software Developer",
    url: "https://diegofrayo.vercel.app",
    nationality: "Colombian",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Armenia",
      addressRegion: "Quindío",
      addressCountry: "Colombia",
    },
    social: {
      github: "https://www.github.com/diegofrayo",
      linkedin: "https://www.linkedin.com/in/diegofrayo",
      "500px": "https://500px.com/p/diegofrayo?view=photos",
    },
  },
};

const GITHUB_DATA = {
  monorepo: {
    website: {
      name: "monorepo/website",
      url: "https://github.com/diegofrayo/monorepo/tree/master/packages/website",
      description: "My personal website",
      files: {
        MDXContent:
          "https://github.com/diegofrayo/monorepo/blob/master/packages/website/src/components/pages/_shared/MDXContent.tsx",
        Code: "https://github.com/diegofrayo/monorepo/blob/master/packages/website/src/components/pages/_shared/Code.tsx",
        posts:
          "https://github.com/diegofrayo/monorepo/blob/master/packages/website/src/data/blog/posts.json",
        "[slug]":
          "https://github.com/diegofrayo/monorepo/blob/master/packages/website/src/pages/blog/[slug].tsx",
        mdx: "https://github.com/diegofrayo/monorepo/blob/master/packages/website/src/utils/mdx.tsx",
        "raw-post":
          "https://raw.githubusercontent.com/diegofrayo/monorepo/master/packages/website/src/data/blog/posts/CURRENT_LOCALE/FILE_NAME.mdx",
      },
    },
  },
};

export const { website: WEBSITE_METADATA } = METADATA;
export const { seo: SEO_METADATA } = METADATA;
export { GITHUB_DATA };

export const HEADER_HEIGHT = 80;
