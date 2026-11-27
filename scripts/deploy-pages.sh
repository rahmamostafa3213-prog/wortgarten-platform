#!/bin/bash
# Build the static site and publish it to the gh-pages branch (GitHub Pages).
# usage: GH_TOKEN=... ./scripts/deploy-pages.sh
set -e
REPO=rahmamostafa3213-prog/wortgarten-platform
NEXT_PUBLIC_BASE_PATH=/wortgarten-platform npm run build
rm -rf /tmp/ghp && mkdir /tmp/ghp && cp -r out/. /tmp/ghp/ && touch /tmp/ghp/.nojekyll
cd /tmp/ghp && git init -q -b gh-pages && git add -A && git commit -qm "Deploy static site"
git push -q -f "https://x-access-token:${GH_TOKEN}@github.com/${REPO}.git" gh-pages
