# @diegofrayo/website

My personal website | [[diegofrayo.vercel.app]](https://diegofrayo.vercel.app)

## Tech stack

- TypeScript
- React.js
- Next.js
- Tailwind CSS
- MDX with [mdx-bundler](https://github.com/kentcdodds/mdx-bundler)
- ESLint & Prettier & Husky

## Setup

1. Clone the repo: `git clone https://github.com/diegofrayo/website.git`
1. Create a `.env` file
   ```
    NODE_ENV=development
    NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000
   ```
1. Install deps: `npm install`
1. Install git hooks: `npm run husky:install`
1. Run this project: `npm run dev`

## Stats

```
===============================================================================
 Language            Files        Lines         Code     Comments       Blanks
===============================================================================
 CSS                     9          579          491           22           66
 JSON                    7          415          415            0            0
 Markdown                1           59            0           46           13
 TSX                    41         4113         3474          147          492
 TypeScript             30         2050         1342          448          260
===============================================================================
 Total                  88         7216         5722          663          831
===============================================================================
```

---

> Hosted on [Vercel](https://vercel.com)
