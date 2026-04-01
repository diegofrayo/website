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
 CSS                     7          650          536           26           88
 JSON                    7         1706         1706            0            0
 Markdown                1           60            0           48           12
 TSX                    87         7758         6604          243          911
 TypeScript             78         2858         2222          134          502
===============================================================================
 Total                 180        13032        11068          451         1513
===============================================================================
```

---

> Hosted on [Vercel](https://vercel.com)
