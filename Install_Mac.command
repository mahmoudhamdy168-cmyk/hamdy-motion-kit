#!/bin/bash
cd "$(dirname "$0")"
echo ""
echo "  Installing Hamdy Motion Kit  for After Effects..."
for v in 9 10 11 12 13 14 15 16; do defaults write com.adobe.CSXS.$v PlayerDebugMode 1; done
DEST="$HOME/Library/Application Support/Adobe/CEP/extensions"
mkdir -p "$DEST"
rm -rf "$DEST/com.hamdy.motionkit"
cp -R extension "$DEST/com.hamdy.motionkit"
xattr -dr com.apple.quarantine "$DEST/com.hamdy.motionkit" 2>/dev/null
if [ -f "$DEST/com.hamdy.motionkit/index.html" ]; then
  echo "  Done! Restart After Effects, then open: Window > Extensions > Hamdy Motion Kit"
else
  echo "  Something went wrong."
fi
echo ""
read -n 1 -s -r -p "  Press any key to close..."
