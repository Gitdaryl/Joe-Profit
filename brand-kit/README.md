# Never Broken brand kit

Reusable overlays and two command-line tools for Joe Profit's reels and audio
clips. Build once, apply in seconds.

## Quick start

```bash
./build.sh                                  # render the PNGs (only after editing src/)
./apply-lockup.sh reel.mp4                  # -> reel_branded.mp4
./audiogram.sh -a interview.mp3 -i photo.jpg -c clips.txt -o ~/Desktop/clips
```

## What's in `out/`

Every PNG is 1080x1920 and drops onto the timeline at 0,0 with no
repositioning. Nothing needs scaling or nudging.

| File | Use |
|---|---|
| `lockup-corner-1080x1920.png` | The standard corner badge. Transparent. Sits on top of the whole clip. |
| `lockup-corner-min-1080x1920.png` | Seal only, no pill. For shots where the frame is already busy. |
| `endcard-1080x1920.png` | Opaque card for the last ~4 seconds. |
| `scrim-bottom-1080x1920.png` | Soft bottom gradient. Only needed if you are burning captions over bright footage. |
| `seal-40-1024.png` | The 40 / Never Broken / Always Forward seal on its own, transparent. |
| `lockup-badge-trimmed.png` | The pill cropped tight, if you would rather place it by hand. |

The seal is rebuilt from scratch as `src/seal.svg`, so it is vector and scales
to any size. There was no source file for it before this.

## Why the layout is what it is

- **Top-left at y=190.** Instagram and TikTok paint the caption, username and
  the like/comment/share stack over the bottom 20-25% of the screen. Anything
  put down there is partly hidden by the app. The top-left corner is clear on
  both.
- **Full frame, no shrinking.** The video fills 1080x1920 by cropping, never by
  padding with black bars. A reel is judged in the first second and that second
  is the face.
- **Nothing covers the captions.** The badge sits above the caption band, and
  the end card only arrives after the talking is nearly done.
- **The end card fades in over the last 4 seconds and the audio is untouched**,
  so a spoken CTA plays over the card instead of eating runtime before it.

## apply-lockup.sh

```
./apply-lockup.sh reel.mp4                    # lockup + 4s end card
./apply-lockup.sh -n reel.mp4                 # lockup only, no end card
./apply-lockup.sh -m reel.mp4                 # minimal (seal only) lockup
./apply-lockup.sh -e 5 -o out.mp4 reel.mp4    # 5s end card, named output
./apply-lockup.sh *.mp4                       # batch, writes *_branded.mp4
```

Output is H.264 high profile, yuv420p, capped at 8 Mbps so a 90-second reel
lands around 60 MB and still emails. The corner badge fades out a beat before
the end card arrives so the two never stack.

## audiogram.sh

Turns a long recording into short vertical clips. A 15-minute radio interview
should ship as six 45-second clips, not one 15-minute video that nobody
finishes.

```
./audiogram.sh -a interview.mp3 -i photo.jpg -c clips.txt -o ~/Desktop/clips
./audiogram.sh -a interview.mp3 -i photo.jpg -s 00:04:12 -d 45 -t "On faith"
./audiogram.sh -a interview.mp3 -i photo.jpg -c clips.txt -l captions.srt
```

`clips.txt` is one clip per line. Blank lines and `#` comments are ignored:

```
# start    dur  title
00:01:30   42   What the cotton fields taught me
00:06:05   38   Why I never quit
```

Each clip gets a slow push-in on the still, a gold waveform, the title, the
corner lockup, audio fades and loudness normalisation to -16 LUFS.

Titles do not word-wrap. Keep them to about 34 characters.

`-l` burns in an SRT if you have one. Generate it with whisper first.

## Two ffmpeg gotchas baked into these scripts

Both cost real time to find, so they are worth knowing:

1. **Thin waveform lines turn green.** `showwaves` draws 1px hairlines. In
   yuv420p the chroma is subsampled 2x2, so a thin gold line averages with the
   black behind it and comes out a muddy green. The fix is to render the
   waveform small and scale it up with nearest-neighbour, which gives chunky
   bars that survive the encode. Same trap applies to any thin coloured line
   in a video.
2. **ffmpeg eats stdin.** Inside a `while read` loop it will swallow the rest
   of the input file and silently skip every clip after the first. `-nostdin`
   fixes it.

## Editing the design

Everything is HTML and SVG in `src/`, rendered by headless Chrome. Change the
markup, run `./build.sh`, done.

- `src/seal.svg` - the 40 seal. Fonts are Playfair Display and Anton.
- `src/lockup.html` - the corner badge. Position, size, colours.
- `src/endcard.html` - the end card.
- `src/scrim.html` - the bottom gradient.
- `assets/never-broken-cover.png` - swap this to change the book image.

Brand gold is `#D8B45B` with `#C09339` for the darker stops.

## The CTA spec these were built for

- Spoken CTA in the **last 4 seconds**, 12 to 18 words, not 35 to 45.
- URL visible the whole time in the corner badge, never in the bottom band.
- The clickable link goes in the caption and the link-in-bio. An MP4 cannot
  carry a clickable hyperlink.
