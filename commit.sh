set -e
npm run build:ts
git add .
git commit -m "chore: minor changes" --no-verify
git push
