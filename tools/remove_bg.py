#!/usr/bin/env python3
from PIL import Image
import sys
import os

# Usage: python3 remove_bg.py [input_path] [output_path]
input_path = 'public/frank.png'
output_path = 'public/frank_transparent.png'
if len(sys.argv) > 1:
    input_path = sys.argv[1]
if len(sys.argv) > 2:
    output_path = sys.argv[2]

if not os.path.exists(input_path):
    print(f"Input file not found: {input_path}")
    sys.exit(1)

im = Image.open(input_path).convert('RGBA')
px = im.load()
width, height = im.size

# Threshold for considering a pixel "white". Tune if needed.
threshold = 245

for y in range(height):
    for x in range(width):
        r,g,b,a = px[x,y]
        # If pixel is nearly white, set alpha to 0
        if r >= threshold and g >= threshold and b >= threshold:
            px[x,y] = (r, g, b, 0)

# Save to output path (in public folder by default)
im.save(output_path)
print(f"Saved transparent image to: {output_path}")
