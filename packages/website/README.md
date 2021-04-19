# monorepo/website

My personal website [[diegofrayo.vercel.app]](https://diegofrayo.vercel.app)

## Tech stack

- TypeScript
- React
- Next.js
- Tailwind CSS
- MDX ([next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) and [xdm](https://www.npmjs.com/package/xdm))

## Setup

1. `git clone https://github.com/diegofrayo/monorepo.git`

1. `cd monorepo/packages/website`

1. `yarn install`

1. `yarn husky:install` (Optional)

1. Create a `.env` file

   ```
   NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000
   ```

1. `yarn dev`

---

> Hosted on [Vercel](https://vercel.com)
