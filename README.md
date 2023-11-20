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
 CSS                    13          643          556           18           69
 JSON                   17          205          205            0            0
 Markdown                2           68            0           53           15
 TSX                    63         7727         6046          791          890
 TypeScript             75         3898         3051          267          580
===============================================================================
 Total                 170        12541         9858         1129         1554
===============================================================================
```

---

> Hosted on [Vercel](https://vercel.com)
