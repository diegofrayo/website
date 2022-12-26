# website

My personal website [[diegofrayo.vercel.app]](https://diegofrayo.vercel.app)

## Tech stack

- **Main**
  - typescript
  - react
  - next.js
  - tailwind-css
  - mdx using [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)

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

1. `npm install`

1. `npm run husky:install` (Required to commit changes)

1. `npm run dev`

## Stats

```
===============================================================================
 Language            Files        Lines         Code     Comments       Blanks
===============================================================================
 CSS                     7          401          329           17           55
 JSON                    1          113          113            0            0
 Markdown                2           68            0           53           15
 TSX                   113        13763        11691          534         1538
 TypeScript             81         4057         3249          180          628
===============================================================================
 Total                 204        18402        15382          784         2236
===============================================================================
```

---

> Hosted on [Vercel](https://vercel.com)
