# website

My personal website [[diegofrayo.vercel.app]](https://diegofrayo.vercel.app)

## Tech stack

- **Main**
  - TypeScript
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
 TSX                   101        11162         9402          446         1314
 TypeScript             70         3579         2886          150          543
===============================================================================
 Total                 174        15056        12559          605         1892
===============================================================================
```

---

> Hosted on [Vercel](https://vercel.com)
