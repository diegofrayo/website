#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

yarn scripts:chords
yarn scripts:rss
yarn scripts:sitemap
yarn scripts:styles
yarn format
yarn lint
yarn build
git add .
