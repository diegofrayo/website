# website

My personal website [[diegofrayo.vercel.app]](https://diegofrayo.vercel.app)

## Tech stack

- TypeScript
- React
- Next.js
- Tailwind CSS
- Redux
- React Query
- MDX ([next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) and [xdm](https://www.npmjs.com/package/xdm))

## Setup

1. `git clone https://github.com/diegofrayo/website.git`

1. Create a `.env` file

   ```
   NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000
   NEXT_PUBLIC_IS_OWNER=false
   ```

1. `yarn install`

1. `yarn husky:install` (Required to commit changes)

1. `yarn dev`

---

> Hosted on [Vercel](https://vercel.com)
