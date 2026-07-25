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
    NEXT_PUBLIC_WEBSITE_URL=https://website.local
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
 CSS                     5          268          197           21           50
 JSON                    7         1712         1712            0            0
 Markdown                1           60            0           48           12
 TSX                    97         8031         6783          249          999
 TypeScript             84         3265         2573          151          541
===============================================================================
 Total                 194        13336        11265          469         1602
===============================================================================
```

---

> Hosted on [Vercel](https://vercel.com)
