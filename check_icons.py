from PIL import Image
import os

icons = ['icon16.png', 'icon48.png', 'icon128.png']
paths = ['d:/codes/formPilot/', 'd:/codes/formPilot/public/', 'd:/codes/formPilot/dist/']

for p in paths:
    print(f"Checking in {p}")
    for icon in icons:
        full_path = os.path.join(p, icon)
        if os.path.exists(full_path):
            try:
                with Image.open(full_path) as img:
                    print(f"  {icon}: {img.format} {img.size}")
            except Exception as e:
                print(f"  {icon}: Error {e}")
        else:
            print(f"  {icon}: Not found")
