from PIL import Image
import shutil
import os

source_path = r'C:\Users\susha\.gemini\antigravity\brain\868d806f-207e-4675-adc4-fef532a9026b\formpilot_icon_main_1773945911807.png'
dest_dir = r'd:\codes\formPilot\public'
root_dir = r'd:\codes\formPilot'

sizes = [16, 48, 128]

# Ensure it's a PNG
with Image.open(source_path) as img:
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
        
    for size in sizes:
        resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Save to public/
        dest_file_public = os.path.join(dest_dir, f'icon{size}.png')
        resized_img.save(dest_file_public, 'PNG')
        print(f"Saved {dest_file_public} as PNG {size}x{size}")
        
        # Save to root/
        dest_file_root = os.path.join(root_dir, f'icon{size}.png')
        resized_img.save(dest_file_root, 'PNG')
        print(f"Saved {dest_file_root} as PNG {size}x{size}")

print("Successfully updated icons!")
