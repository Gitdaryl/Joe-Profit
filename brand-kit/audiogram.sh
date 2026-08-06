#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# Turns a long audio file (radio interview, podcast, sermon) into a set of
# short vertical clips: still image with a slow push-in, gold waveform,
# a title card line, and the Never Broken corner lockup.
#
# A 15-minute interview should ship as 6 x 45s clips, not one 15-minute video.
#
#   ./audiogram.sh -a interview.mp3 -i photo.jpg -c clips.txt
#   ./audiogram.sh -a interview.mp3 -i photo.jpg -c clips.txt -o ~/Desktop/out
#   ./audiogram.sh -a interview.mp3 -i photo.jpg -s 00:04:12 -d 45 -t "On faith"
#
# clips.txt -- one clip per line, blank lines and # comments ignored:
#   00:01:30  42  What the cotton fields taught me
#   00:06:05  38  Why I never quit
# -----------------------------------------------------------------------------
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCKUP="$HERE/out/lockup-corner-1080x1920.png"
SCRIM="$HERE/out/scrim-bottom-1080x1920.png"
SERIF="$HOME/Library/Fonts/PlayfairDisplay-Bold.ttf"
SANS="$HOME/Library/Fonts/Montserrat-Bold.ttf"

AUDIO=""; IMAGE=""; CLIPS=""; OUTDIR="."; SRT=""
ONE_START=""; ONE_DUR="45"; ONE_TITLE=""

while getopts "a:i:c:o:s:d:t:l:h" o; do
  case "$o" in
    a) AUDIO="$OPTARG" ;;
    i) IMAGE="$OPTARG" ;;
    c) CLIPS="$OPTARG" ;;
    o) OUTDIR="$OPTARG" ;;
    s) ONE_START="$OPTARG" ;;
    d) ONE_DUR="$OPTARG" ;;
    t) ONE_TITLE="$OPTARG" ;;
    l) SRT="$OPTARG" ;;
    h) sed -n '2,20p' "$0"; exit 0 ;;
  esac
done

[ -f "${AUDIO:-}" ] || { echo "Need -a AUDIO" >&2; sed -n '2,20p' "$0"; exit 1; }
[ -f "${IMAGE:-}" ] || { echo "Need -i IMAGE" >&2; exit 1; }
[ -f "$LOCKUP" ]    || { echo "Missing lockup -- run ./build.sh first." >&2; exit 1; }
[ -f "$SCRIM" ]     || { echo "Missing scrim -- run ./build.sh first." >&2; exit 1; }
mkdir -p "$OUTDIR"

# drawtext needs : and ' escaped
esc () { printf '%s' "$1" | sed "s/\\\\/\\\\\\\\/g; s/:/\\\\:/g; s/'/\\\\\\\\\\\\'/g; s/%/\\\\%/g"; }

make_clip () {
  local start="$1" dur="$2" title="$3" idx="$4"
  local out; out="$OUTDIR/clip_$(printf '%02d' "$idx").mp4"
  local frames; frames=$(awk "BEGIN{printf \"%d\", $dur * 30}")
  local t; t=$(esc "$title")

  # Still -> slow push-in. Rendered at 2x then downscaled so the zoom stays sharp.
  local fc="[1:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,"
  fc+="zoompan=z='min(1.0+0.00022*on,1.14)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  fc+=":d=${frames}:s=1080x1920:fps=30,setsar=1,eq=brightness=-0.06:saturation=0.96[bg];"

  # Soft gradient scrim (input 3) so text stays legible over bright footage.
  fc+="[3:v]format=rgba[sc];[bg][sc]overlay=0:0[scrim];"

  # Gold waveform.
  # Two things matter here and both took a while to find:
  #   1. showwaves' hairlines are 1px, and 4:2:0 chroma subsampling averages
  #      them into the black background -- gold collapses to a muddy green.
  #      Rendering small and scaling up with nearest-neighbour gives chunky
  #      bars that hold their colour through the encode.
  #   2. The volume boost is on this branch only, so the exported audio is
  #      untouched. Speech sits too low to show any movement otherwise.
  fc+="[0:a]volume=12dB,showwaves=s=216x44:mode=cline:rate=30:colors=0xD8B45B,"
  fc+="scale=1080:180:flags=neighbor,format=rgba,colorchannelmixer=aa=0.92[wave];"
  fc+="[scrim][wave]overlay=0:1660[wv];"

  # Title sits high, under the lockup, so it never fights the captions.
  # drawtext does not wrap -- keep titles to about 34 characters.
  if [ -n "$title" ]; then
    fc+="[wv]drawtext=fontfile='${SERIF}':text='${t}':fontsize=52:fontcolor=white:"
    fc+="x=(w-text_w)/2:y=360:box=0:shadowcolor=black@0.75:shadowx=0:shadowy=3[tt];"
  else
    fc+="[wv]null[tt];"
  fi

  # Optional burned-in captions, sat in the lower third above the waveform.
  if [ -n "$SRT" ]; then
    fc+="[tt]subtitles='${SRT}':force_style='FontName=Montserrat,Fontsize=17,Bold=1,"
    fc+="PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=2,"
    fc+="Shadow=0,Alignment=2,MarginV=380'[cap];"
  else
    fc+="[tt]null[cap];"
  fi

  # Corner lockup on top.
  fc+="[2:v]format=rgba[lk];[cap][lk]overlay=0:0[v]"

  local fadeout; fadeout=$(awk -v d="$dur" 'BEGIN{printf "%.2f", d-0.6}')

  echo "-> $(basename "$out")  [$start +${dur}s] $title"
  ffmpeg -y -nostdin -v error -stats \
    -ss "$start" -t "$dur" -i "$AUDIO" \
    -i "$IMAGE" \
    -i "$LOCKUP" \
    -i "$SCRIM" \
    -filter_complex "$fc" \
    -map "[v]" -map 0:a \
    -af "afade=t=in:st=0:d=0.4,afade=t=out:st=${fadeout}:d=0.6,loudnorm=I=-16:TP=-1.5:LRA=11" \
    -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p \
    -crf 20 -preset medium -movflags +faststart \
    -c:a aac -b:a 192k -ar 48000 -t "$dur" \
    "$out"
}

if [ -n "$CLIPS" ]; then
  [ -f "$CLIPS" ] || { echo "No such clips file: $CLIPS" >&2; exit 1; }
  i=0
  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in ''|\#*) continue ;; esac
    start=$(printf '%s' "$line" | awk '{print $1}')
    dur=$(printf   '%s' "$line" | awk '{print $2}')
    title=$(printf '%s' "$line" | awk '{$1="";$2="";sub(/^ +/,"");print}')
    i=$((i+1))
    make_clip "$start" "$dur" "$title" "$i"
  done < "$CLIPS"
  echo "Done. $i clip(s) in $OUTDIR"
elif [ -n "$ONE_START" ]; then
  make_clip "$ONE_START" "$ONE_DUR" "$ONE_TITLE" 1
  echo "Done. 1 clip in $OUTDIR"
else
  echo "Need either -c clips.txt or -s START." >&2; exit 1
fi
