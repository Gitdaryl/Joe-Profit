#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# Applies the Never Broken corner lockup (and optional end card) to a reel.
# Keeps the video full-frame 1080x1920 -- no shrinking, no letterbox bars.
# Audio is never touched, so a spoken CTA over the end card stays intact.
#
#   ./apply-lockup.sh reel.mp4                    # lockup + 4s end card
#   ./apply-lockup.sh -n reel.mp4                 # lockup only, no end card
#   ./apply-lockup.sh -m reel.mp4                 # minimal (seal only) lockup
#   ./apply-lockup.sh -e 5 -o out.mp4 reel.mp4    # 5s end card, named output
#   ./apply-lockup.sh *.mp4                       # batch, writes *_branded.mp4
# -----------------------------------------------------------------------------
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTDIR="$HERE/out"
LOCKUP="$OUTDIR/lockup-corner-1080x1920.png"
ENDCARD="$OUTDIR/endcard-1080x1920.png"
ENDSEC=4
DOEND=1

EXPLICIT_OUT=""

while getopts "nme:o:h" o; do
  case "$o" in
    n) DOEND=0 ;;
    m) LOCKUP="$OUTDIR/lockup-corner-min-1080x1920.png" ;;
    e) ENDSEC="$OPTARG" ;;
    o) EXPLICIT_OUT="$OPTARG" ;;
    h) sed -n '2,14p' "$0"; exit 0 ;;
  esac
done
shift $((OPTIND-1))
[ $# -ge 1 ] || { sed -n '2,14p' "$0"; exit 1; }
[ -z "$EXPLICIT_OUT" ] || [ $# -eq 1 ] || {
  echo "-o only makes sense with a single input file." >&2; exit 1; }

for f in "$LOCKUP" "$ENDCARD"; do
  [ -f "$f" ] || { echo "Missing $f -- run ./build.sh first." >&2; exit 1; }
done

for IN in "$@"; do
  [ -f "$IN" ] || { echo "skip (not found): $IN" >&2; continue; }
  OUT="${EXPLICIT_OUT:-${IN%.*}_branded.mp4}"

  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
  # Guard: if the clip is shorter than the end card, shrink the card.
  ES="$ENDSEC"
  awk "BEGIN{exit !($DUR <= $ES + 1)}" && ES=$(awk "BEGIN{printf \"%.2f\", ($DUR/3)}")
  START=$(awk "BEGIN{printf \"%.3f\", $DUR - $ES}")

  # Fill to 1080x1920 by cropping, never by padding with black bars.
  FC="[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30[base];"

  if [ "$DOEND" = "1" ]; then
    # Pill clears out just before the card arrives, so they never stack.
    LKOUT=$(awk "BEGIN{printf \"%.3f\", $START - 0.25}")
    FC+="[1:v]format=rgba,fade=t=out:st=${LKOUT}:d=0.3:alpha=1[lk];"
    FC+="[base][lk]overlay=0:0[wl];"
    FC+="[2:v]format=rgba,fade=t=in:st=${START}:d=0.45:alpha=1[ec];"
    FC+="[wl][ec]overlay=0:0:enable='gte(t,${START})'[v]"
    # -loop/-framerate give the stills a real timebase so fade st= can fire.
    INPUTS=(-i "$IN"
            -loop 1 -framerate 30 -t "$DUR" -i "$LOCKUP"
            -loop 1 -framerate 30 -t "$DUR" -i "$ENDCARD")
    echo "-> $(basename "$OUT")  (${DUR}s, end card at ${START}s)"
  else
    FC+="[1:v]format=rgba[lk];[base][lk]overlay=0:0[v]"
    INPUTS=(-i "$IN" -i "$LOCKUP")
    echo "-> $(basename "$OUT")  (${DUR}s, no end card)"
  fi

  ffmpeg -y -nostdin -v error -stats "${INPUTS[@]}" \
    -filter_complex "$FC" \
    -map "[v]" -map "0:a?" \
    -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p \
    -crf 21 -maxrate 8M -bufsize 16M -preset medium -movflags +faststart \
    -c:a aac -b:a 192k -ar 48000 \
    "$OUT"
done
