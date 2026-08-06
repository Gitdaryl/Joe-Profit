#!/usr/bin/env bash
# Renders the brand-kit PNGs from src/*.html using headless Chrome.
# Re-run this any time you edit the HTML or swap the cover art.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$HERE/src"
OUT="$HERE/out"
mkdir -p "$OUT"

# Playwright's bundled Chrome. Falls back to a normal Chrome install.
CHROME=""
for c in \
  "$HOME/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing" \
  "$HOME/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing" \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium"
do
  [ -x "$c" ] && CHROME="$c" && break
done
[ -n "$CHROME" ] || { echo "No Chrome found. Edit CHROME in build.sh." >&2; exit 1; }

shot () { # shot <url> <out.png> <w> <h> [--transparent]
  local url="$1" out="$2" w="$3" h="$4" bg=""
  [ "${5:-}" = "--transparent" ] && bg="--default-background-color=00000000"
  "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
    --allow-file-access-from-files --force-device-scale-factor=1 \
    --virtual-time-budget=4000 $bg \
    --window-size="$w,$h" --screenshot="$out" "$url" 2>/dev/null
  echo "  -> $(basename "$out")"
}

echo "Rendering brand kit..."
shot "file://$SRC/seal.html"            "$OUT/seal-40-1024.png"              1024 1024 --transparent
shot "file://$SRC/lockup.html"          "$OUT/lockup-corner-1080x1920.png"   1080 1920 --transparent
shot "file://$SRC/lockup.html?v=min"    "$OUT/lockup-corner-min-1080x1920.png" 1080 1920 --transparent
shot "file://$SRC/scrim.html"           "$OUT/scrim-bottom-1080x1920.png"    1080 1920 --transparent
shot "file://$SRC/endcard.html"         "$OUT/endcard-1080x1920.png"         1080 1920

# tight-cropped pill, for editors where you want to place it by hand
magick "$OUT/lockup-corner-1080x1920.png" -trim +repage "$OUT/lockup-badge-trimmed.png"
echo "  -> lockup-badge-trimmed.png"

echo "Done. PNGs in $OUT"
