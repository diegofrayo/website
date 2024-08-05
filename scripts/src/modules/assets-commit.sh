set -e
npm run build:ts
npm run build:build-info
npm run seo
npm run script:sync-shared-lib
git add .
git commit -m ":bento: [update] assets" --no-verify
