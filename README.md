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
   ```

1. `yarn install`

1. `yarn husky:install` (Required to commit changes)

1. `yarn dev`

## Stats

```
===============================================================================
 Language            Files        Lines         Code     Comments       Blanks
===============================================================================
 CSS                     2          216          172            9           35
 JSON                    1           99           99            0            0
 Markdown                1           59            0           46           13
 TSX                   101        11569         9742          488         1339
 TypeScript             70         3540         2848          159          533
===============================================================================
 Total                 175        15483        12861          702         1920
===============================================================================
```

---

> Hosted on [Vercel](https://vercel.com)
