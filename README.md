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
 CSS                     2          303          241           19           43
 JSON                    1           99           99            0            0
 Markdown                1           59            0           46           13
 TSX                   103        12153        10275          485         1393
 TypeScript             70         3622         2922          158          542
===============================================================================
 Total                 177        16236        13537          708         1991
===============================================================================
```

---

> Hosted on [Vercel](https://vercel.com)
