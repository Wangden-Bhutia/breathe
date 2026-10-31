#!/usr/bin/env bash
# Records the new cue lines in the same voice as the existing clips (Piper, en_GB-alan-medium).
# Usage: tools/make-voice.sh /path/to/en_GB-alan-medium.onnx
# Needs: piper (pip install piper-tts) and ffmpeg. Writes audio/<name>.mp3 (22.05 kHz mono, 48 kbps, like the others).
set -euo pipefail
MODEL="${1:?path to en_GB-alan-medium.onnx}"
cd "$(dirname "$0")/.."
while IFS=$'\t' read -r name text; do
  [ -z "$name" ] && continue
  echo "$text" | piper --model "$MODEL" --length_scale 1.15 --output_file "/tmp/$name.wav"
  ffmpeg -y -v error -i "/tmp/$name.wav" -ar 22050 -ac 1 -b:a 48k "audio/$name.mp3"
  echo "audio/$name.mp3"
done < tools/voice-lines.tsv
echo "Done. Commit the new files in audio/ and the app will be wired to use them."
