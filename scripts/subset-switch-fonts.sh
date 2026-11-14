#!/usr/bin/env bash
# Rebuilds the two tiny fonts used only for the language-switch labels
# (ગુજરાતી and हिन्दी), so those labels render correctly on devices with no
# Gujarati or Devanagari font, without loading the full script fonts while
# another language is active. Requires: pip install fonttools brotli
# Run from the repository root after changing the labels in src/i18n/languages.ts.
set -euo pipefail
OUT=src/assets/fonts
GU=node_modules/@fontsource/noto-sans-gujarati/files/noto-sans-gujarati-gujarati-400-normal.woff2
HI=node_modules/@fontsource/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-400-normal.woff2
pyftsubset "$GU" --text="ગુજરાતી" --layout-features='*' --flavor=woff2 --output-file="$OUT/switch-gujarati.woff2"
pyftsubset "$HI" --text="हिन्दी" --layout-features='*' --flavor=woff2 --output-file="$OUT/switch-devanagari.woff2"
cp node_modules/@fontsource/noto-sans-gujarati/LICENSE "$OUT/OFL-LICENSE.txt"
ls -la "$OUT"
