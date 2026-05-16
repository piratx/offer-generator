#!/bin/bash
# deploy.sh — bump version across all files, commit, and push

set -e

V=$(date +"%Y%m%d%H%M")
T=$(date +%s)

echo "🚀 Deploying version $V ..."

# app.js — VERSION constant
perl -pi -e "s/const VERSION = '[0-9]+'/const VERSION = '$V'/" app.js

# index.html — CSS cache buster
perl -pi -e "s/styles\.css\?v=[0-9]+/styles.css?v=$V/" index.html

# index.html — JS cache buster
perl -pi -e "s/app\.js\?t=[0-9]+/app.js?t=$T/" index.html

# index.html — visible version display (v202xxxxxxxxxx)
perl -pi -e "s/v20[0-9]{10}/v$V/" index.html

# VERSION file
cat > VERSION <<EOF
VERSION=$V
$(git log -1 --pretty=%s 2>/dev/null || echo "Manual deploy")

CURRENT VERSION: $V
Date: $(date +"%Y-%m-%d")
EOF

# Commit & push
git add app.js index.html VERSION
git diff --cached --quiet && echo "⚠️  Nothing to commit." && exit 0
git commit -m "v$V"
git push

echo "✅ Done! Version $V live on GitHub Pages."
