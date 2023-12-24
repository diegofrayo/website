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
 CSS                    15          675          585           18           72
 JSON                   35         1894         1894            0            0
 Markdown                2           68            0           53           15
 TSX                    77        10177         8817          247         1113
 TypeScript             88         4258         3394          227          637
===============================================================================
 Total                 217        17072        14690          545         1837
===============================================================================
```

---

> Hosted on [Vercel](https://vercel.com)
