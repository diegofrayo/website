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
    DISABLE_PWA=true
   ```
1. Install deps: `npm install`
1. Install git hooks: `npm run husky:install`
1. Run this project: `npm run dev`

## Stats

```
===============================================================================
 Language            Files        Lines         Code     Comments       Blanks
===============================================================================
 CSS                    10          565          486           17           62
 JSON                   10           82           82            0            0
 Markdown                1           59            0           46           13
 TSX                    48         4410         3729          152          529
 TypeScript             42         2486         1706          451          329
===============================================================================
 Total                 111         7602         6003          666          933
===============================================================================
```

---

> Hosted on [Vercel](https://vercel.com)
