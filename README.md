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
- React Testing Library for integration tests
- Playwright for e2e tests

## ⚡ Setup

1. Clone the repo: `git clone https://github.com/diegofrayo/website.git`
1. Create a `.env` file
   ```
    NEXT_PUBLIC_WEBSITE_URL=https://website.local
    NEXT_PUBLIC_WEBSITE_URL_DEV=https://website.local
    NEXT_PUBLIC_WEBSITE_URL_PROD=https://diegofrayo.dev
    AUTH_TOKEN=XXX
    ISR_PIN=XXX
    JWT_SECRET=XXX
   ```
1. Install deps: `npm install`
1. Install git hooks: `npm run husky:install`
1. Run this project: `npm run dev`

## Stats

```
===============================================================================
 Language            Files        Lines         Code     Comments       Blanks
===============================================================================
 CSS                     2          200          140           20           40
 JSON                    7         1712         1712            0            0
 Markdown                1           60            0           48           12
 TSX                    93         7491         6296          238          957
 TypeScript            102         3621         2855          155          611
===============================================================================
 Total                 205        13084        11003          461         1620
===============================================================================
```

---

> Hosted on [Vercel](https://vercel.com)
