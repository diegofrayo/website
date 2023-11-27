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
 CSS                    15          664          576           18           70
 JSON                   23          256          256            0            0
 Markdown                2           68            0           53           15
 TSX                    71         8693         7489          224          980
 TypeScript             83         4200         3328          246          626
===============================================================================
 Total                 194        13881        11649          541         1691
===============================================================================
```

---

> Hosted on [Vercel](https://vercel.com)
