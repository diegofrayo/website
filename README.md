# website

My personal website [[diegofrayo.vercel.app]](https://diegofrayo.vercel.app)

## Tech stack

- **Main**
  - typescript
  - react
  - next.js
  - tailwind-css
  - mdx using [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) and [xdm](https://www.npmjs.com/package/xdm)

- **Experiments**
  - redux
  - react-query
  - axios
  - storybook
  - next-pwa

- **Linting and formatting**
  - prettier
  - eslint
  - husky

## Setup

1. `git clone https://github.com/diegofrayo/website.git`

1. Create a `.env` file

   ```
   NEXT_PUBLIC_ASSETS_SERVER_URL=https://diegofrayo-backend.vercel.app
   NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000
	 DISABLE_PWA=true
   ```

1. `yarn install`

1. `yarn husky:install` (Required to commit changes)

1. `yarn dev`

## Stats

```
===============================================================================
 Language            Files        Lines         Code     Comments       Blanks
===============================================================================
 CSS                     2          296          241           12           43
 JSON                    1          100          100            0            0
 Markdown                1           59            0           46           13
 TSX                   108        13217        11229          506         1482
 TypeScript             79         3802         3087          145          570
===============================================================================
 Total                 191        17474        14657          709         2108
===============================================================================
```

---

> Hosted on [Vercel](https://vercel.com)
