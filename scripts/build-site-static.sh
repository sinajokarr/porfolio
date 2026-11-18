#!/bin/sh
set -eu
SITES_STATIC_EXPORT=1 npm --prefix frontend run build
rm -rf out
cp -R frontend/out out
cp frontend/public/index.html out/index.html 2>/dev/null || true
