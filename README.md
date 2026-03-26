# website

My personal website | [[diegofrayo.dev]](https://diegofrayo.dev)

## Tech stack

- TypeScript
- React.js
- Next.js
- Tailwind CSS
- MDX with [mdx-bundler](https://github.com/kentcdodds/mdx-bundler)
- ESLint & Prettier & Husky
- Storybook

## Setup

1. Clone the repo: `git clone https://github.com/diegofrayo/website.git`
1. Create a `.env` file
   ```
    NODE_ENV=development
    NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000
    NEXT_PUBLIC_WEBSITE_URL_PROD=https://diegofrayo.dev
   ```
1. Install deps: `npm install`
1. Install git hooks: `npm run husky:install`
1. Run this project: `npm run dev`

## Stats

```
===============================================================================
 Language            Files        Lines         Code     Comments       Blanks
===============================================================================
 CSS                    10          718          598           25           95
 JSON                    8         1800         1800            0            0
 Markdown                1           59            0           46           13
 TSX                    67         9667         7892          851          924
 TypeScript             88         3173         2496          124          553
===============================================================================
 Total                 174        15417        12786         1046         1585
===============================================================================
```

---

> Hosted on [Vercel](https://vercel.com)
