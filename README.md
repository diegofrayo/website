# website

My personal website.

**URL:** [diegofrayo.dev](https://diegofrayo.dev)

## 🛠️ Tech stack

- TypeScript
- React.js
- Next.js
- Tailwind CSS
- MDX with [mdx-bundler](https://github.com/kentcdodds/mdx-bundler)
- ESLint & Prettier & Husky
- Storybook

## ⚡ Setup

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
 CSS                     8          682          562           26           94
 JSON                    7         1848         1848            0            0
 Markdown                1           60            0           48           12
 TSX                    98         8402         7162          247          993
 TypeScript             80         2945         2295          133          517
===============================================================================
 Total                 194        13937        11867          454         1616
===============================================================================
```

---

> Hosted on [Vercel](https://vercel.com)
