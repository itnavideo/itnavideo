"""Remove white background from sticker PNGs and add alpha transparency."""
import os
from PIL import Image
import numpy as np

STICKER_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'assets', 'stickman')
PREVIEW_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'visuals', 'stickers', 'previews')

# Threshold: pixels with R,G,B all above this value are considered "white background"
WHITE_THRESHOLD = 240
# Edge feathering: soften the transition at edges
EDGE_FEATHER = 2

def remove_white_bg(input_path, output_path):
    """Remove white/near-white background from PNG."""
    img = Image.open(input_path).convert('RGBA')
    data = np.array(img)
    
    # Find white-ish pixels (R > threshold AND G > threshold AND B > threshold)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    white_mask = (r > WHITE_THRESHOLD) & (g > WHITE_THRESHOLD) & (b > WHITE_THRESHOLD)
    
    # Set white pixels to transparent
    data[white_mask] = [255, 255, 255, 0]
    
    # Near-white pixels get partial transparency for smooth edges
    near_white = (r > WHITE_THRESHOLD - 20) & (g > WHITE_THRESHOLD - 20) & (b > WHITE_THRESHOLD - 20) & ~white_mask
    if near_white.any():
        # Calculate how "white" the pixel is (0=not white, 1=pure white)
        whiteness = ((r[near_white].astype(float) + g[near_white].astype(float) + b[near_white].astype(float)) / 3 - (WHITE_THRESHOLD - 20)) / 20
        whiteness = np.clip(whiteness, 0, 1)
        data[near_white, 3] = (255 * (1 - whiteness * 0.8)).astype(np.uint8)
    
    result = Image.fromarray(data, 'RGBA')
    result.save(output_path, 'PNG')
    return True

def main():
    processed = 0
    skipped = 0
    
    for folder in os.listdir(STICKER_DIR):
        folder_path = os.path.join(STICKER_DIR, folder)
        if not os.path.isdir(folder_path):
            continue
        
        for filename in os.listdir(folder_path):
            if not filename.endswith('.png'):
                continue
            
            filepath = os.path.join(folder_path, filename)
            
            # Check if already has alpha
            img = Image.open(filepath)
            if img.mode == 'RGBA':
                # Check if it actually uses alpha
                has_transparency = img.split()[3].getextrema()[0] < 250
                if has_transparency:
                    skipped += 1
                    continue
            
            # Remove white background
            print(f"Processing: {folder}/{filename}")
            remove_white_bg(filepath, filepath)
            processed += 1
    
    # Also update preview images
    if os.path.isdir(PREVIEW_DIR):
        for filename in os.listdir(PREVIEW_DIR):
            if not filename.endswith('.png'):
                continue
            filepath = os.path.join(PREVIEW_DIR, filename)
            img = Image.open(filepath)
            if img.mode != 'RGBA' or img.split()[3].getextrema()[0] >= 250:
                print(f"Processing preview: {filename}")
                remove_white_bg(filepath, filepath)
                processed += 1
    
    print(f"\nDone! Processed: {processed}, Skipped (already transparent): {skipped}")

if __name__ == '__main__':
    main()
